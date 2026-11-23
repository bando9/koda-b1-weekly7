using System.Security.Cryptography;
using Ewallet.Application.DTOs;
using Ewallet.Application.Repositories;
using Ewallet.Application.Services;
using Ewallet.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Infrastructure.Identity;

public sealed class IdentityAuthService(UserManager<AppUser> user, IAppDbContext db) : IAuthService
{
    private readonly UserManager<AppUser> _user=user;
    private readonly IAppDbContext _db=db;
    public async Task<LoginResult> LoginAsync(LoginRequest request, CancellationToken ct)
    {
        ct.ThrowIfCancellationRequested();

        var identifier = request.Identifier.Trim();
        var user = identifier.Contains('@')
                    ? await _user.FindByEmailAsync(identifier)
                    : await _user.FindByNameAsync(identifier);

        if(user is null) return LoginResult.Failure("Username / Email atau Password salah");

        if(user.Status != UserStatusEnum.ACTIVE) return LoginResult.Failure("Akunmu sedang dinonaktifkan (suspend)");

        var passwordValid = await _user.CheckPasswordAsync(user,request.Password);
        if(!passwordValid) return LoginResult.Failure("Username / Email atau Password salah");

        var roles = await _user.GetRolesAsync(user);
        var primaryRole = roles.FirstOrDefault() ?? "CUSTOMER";

        var wallet = await _db.Wallets.AsNoTracking().FirstOrDefaultAsync(w => w.UserId == user.Id,ct);

        var response = new AuthUserResponse(
            user.Id,
            user.FullName,
            user.UserName!,
            user.Email!,
            user.PhoneNumber ?? string.Empty,
            primaryRole,
            wallet?.Id ?? 0,
            wallet?.Balance ?? 0);

        // var (accessToken,expiredAtUtc) = _jwtTokenGenerator

        return new LoginResult(true, response, null,null,null,null);
    }

    public async Task<RegisterResult> RegisterAsync(RegisterRequest request, CancellationToken ct)
    {
        ct.ThrowIfCancellationRequested();

        var fullName = request.FullName.Trim();
        var userName = request.UserName.Trim();
        var email = request.Email.Trim();
        var PhoneNumber = request.PhoneNumber.Trim();

        if(await _user.FindByEmailAsync(email) is not null)
                return new RegisterResult(RegisterStatus.DuplicateEmail,null!,["Email sudah terdaftar"]);
        
        if(await _user.FindByNameAsync(userName) is not null)
                return new RegisterResult(RegisterStatus.DuplicateUserName,null!,["Username sudah digunakan"]);

        var phoneExist = await _user.Users.AnyAsync(u=>u.PhoneNumber == PhoneNumber,ct);
        if(phoneExist) return new RegisterResult(RegisterStatus.DuplicateUserName,null!,["No Telp sudah terdaftar"]);

        var now = DateTimeOffset.UtcNow;
        var user = new AppUser
        {
            FullName=fullName,
            UserName=userName,
            Email=email,
            PhoneNumber=PhoneNumber,
            Status=UserStatusEnum.ACTIVE,
            CreatedAtUtc=now,
        };

        await using var dbTx = await _db.Database.BeginTransactionAsync(ct);
        
        try
        {
            IdentityResult identityResult;
            try
            {
                identityResult = await _user.CreateAsync(user, request.Password);
            }
            catch (DbUpdateException ex) when (ex.InnerException is SqlException{Number: 2601 or 2627} sqlEx)
            {
                await dbTx.RollbackAsync(ct);

                if (sqlEx.Message.Contains("PhoneNumber", StringComparison.OrdinalIgnoreCase))
                return new RegisterResult(RegisterStatus.DuplicatePhoneNumber, null, ["No telepon sudah terdaftar."]);

                if (sqlEx.Message.Contains("Email", StringComparison.OrdinalIgnoreCase))
                    return new RegisterResult(RegisterStatus.DuplicateEmail, null, ["Email sudah digunakan."]);

                return new RegisterResult(RegisterStatus.DuplicateUserName, null, ["Username sudah digunakan."]);
            }

            if (!identityResult.Succeeded)
            {
                await dbTx.RollbackAsync(ct);
                var errors = identityResult.Errors.ToArray();

                if(errors.Any(e => e.Code is "DuplicateEmail"))
                    return new RegisterResult(RegisterStatus.DuplicateEmail, null, ["Email sudah terdaftar"]);

                if(errors.Any(e => e.Code is "DuplicateUserName"))
                    return new RegisterResult(RegisterStatus.DuplicateUserName, null, ["UserName sudah terdaftar"]);

                return new RegisterResult(RegisterStatus.ValidationError,null,errors.Select(e=>e.Description).ToArray());
            }

            const string defaultRole = "CUSTOMER";
            var roleResult = await _user.AddToRoleAsync(user,defaultRole);
            if (!roleResult.Succeeded)
            {
                await dbTx.RollbackAsync(ct);
                return new RegisterResult(
                    RegisterStatus.ValidationError,
                    null,
                    roleResult.Errors.Select(e=>e.Description).ToArray()
                );
            }

            var wallet = new Wallet(0,$"W-{GenerateWalletNumber()}",user.Id, WalletStatusEnum.ACTIVE);

            _db.Wallets.Add(wallet);

            var log = AuditLog.Create(
                action: "USER_REGISTERED",
                entityType: "AspNetUsers",
                entityId: user.Id.ToString(),
                outcome:OutcomeEnum.SUCCESS,
                description: $"Registrasi akun baru untuk {user.UserName}",
                actorUserId:user.Id,
                transactionId:null,
                correlationId:null,
                nowUtc:DateTime.UtcNow);

            _db.AuditLogs.Add(log);

            await _db.SaveChangesAsync(ct);
            await dbTx.CommitAsync(ct);

            var response = new AuthUserResponse(
                user.Id,
                user.FullName,
                user.UserName!,
                user.Email!,
                user.PhoneNumber!,
                defaultRole,
                wallet.Id,
                wallet.Balance
            );
            return new RegisterResult(RegisterStatus.Created,response,[]);
        }
        catch 
        {
            await dbTx.RollbackAsync(ct);
            throw;
        }

    }

    private static string GenerateWalletNumber()
    {
        return string.Concat(Enumerable.Range(0, 12)
            .Select(_ => RandomNumberGenerator.GetInt32(0, 10)));
    }
}