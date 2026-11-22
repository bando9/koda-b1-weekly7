using System.Security.Cryptography;
using Ewallet.Application.Repositories;
using Ewallet.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Ewallet.Infrastructure.Identity;

public static class IdentitySeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider, bool isDevelopmentOrTesting = false)
    {
        using var scope = serviceProvider.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<long>>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        var db = scope.ServiceProvider.GetRequiredService<IAppDbContext>();
        var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();

        var roles = new [] {"CUSTOMER", "ADMIN"};
        foreach(var role in roles)
        {
            if(!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<long>(role));
            }
        }


        if (isDevelopmentOrTesting)
        {
            var adminEmail = config["AdminSeed:Email"];
            var adminUserName = config["AdminSeed:UserName"] ?? "admin";
            var adminPassword = config["AdminSeed:Password"];
            var adminPhoneNumber = config["AdminSeed:PhoneNumber"] ?? "+628111110000";

            if (!string.IsNullOrWhiteSpace(adminEmail) && !string.IsNullOrWhiteSpace(adminPassword))
            {
                await EnsureUserWithWalletAsync(
                    userManager, db,
                    userName: adminUserName,
                    fullName: "System Administrator",
                    email: adminEmail,
                    phoneNumber: adminPhoneNumber,
                    walletNumber: $"W-{GenerateWalletNumber()}",
                    password: adminPassword,
                    role: "ADMIN");
            }

            var sampleCustomers = new[]
            {
                ("andi.pratama", "Andi Pratama", "andi@example.com", "081234567801", "W-0001"),
                ("budi.santoso", "Budi Santoso", "budi@example.com", "081234567802", "W-0002"),
                ("citra.lestari", "Citra Lestari", "citra@example.com", "081234567803", "W-0003"),
                ("dimas.wijaya", "Dimas Wijaya", "dimas@example.com", "081234567804", "W-0004"),
                ("eka.putri", "Eka Putri", "eka@example.com", "081234567805", "W-0005"),
                ("fajar.nugroho", "Fajar Nugroho", "fajar@example.com", "081234567806", "W-0006"),
                ("gita.permata", "Gita Permata", "gita@example.com", "081234567807", "W-0007"),
                ("hendra.kusuma", "Hendra Kusuma", "hendra@example.com", "081234567808", "W-0008"),
                ("indah.sari", "Indah Sari", "indah@example.com", "081234567809", "W-0009"),
                ("joko.susilo", "Joko Susilo", "joko@example.com", "081234567810", "W-0010"),
            };

            const string defaultCustomerPassword = "Customer#123";

            foreach (var (userName, fullName, email, phone, walletNumber) in sampleCustomers)
            {
                await EnsureUserWithWalletAsync(
                    userManager, db,
                    userName: userName,
                    fullName: fullName,
                    email: email,
                    phoneNumber: phone,
                    walletNumber: walletNumber,
                    password: defaultCustomerPassword,
                    role: "CUSTOMER");
            }
        }
    }

    private static async Task EnsureUserWithWalletAsync(
        UserManager<AppUser> userManager,
        IAppDbContext db,
        string userName,
        string fullName,
        string email,
        string phoneNumber,
        string walletNumber,
        string password,
        string role)
    {
        await using var dbTx = await db.Database.BeginTransactionAsync();
        try
        {
            var user = await userManager.FindByNameAsync(userName)
                       ?? await userManager.FindByEmailAsync(email);

            if (user is null)
            {
                user = new AppUser
                {
                    FullName = fullName,
                    UserName = userName,
                    Email = email,
                    PhoneNumber = phoneNumber,
                    EmailConfirmed = true,
                    PhoneNumberConfirmed = true,
                    Status = UserStatusEnum.ACTIVE,
                    CreatedAtUtc = DateTimeOffset.UtcNow
                };

                var createdResult = await userManager.CreateAsync(user, password);
                if (!createdResult.Succeeded)
                {
                    await dbTx.RollbackAsync();
                    var errors = string.Join(", ", createdResult.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Gagal seed user '{userName}': {errors}");
                }

                await userManager.AddToRoleAsync(user, role);
            }

            var hasWallet = await db.Wallets.AnyAsync(w => w.UserId == user.Id);
            if (!hasWallet)
            {
                var wallet = new Wallet(
                    id: 0,
                    walletNumber: walletNumber,
                    userId: user.Id,
                    status: WalletStatusEnum.ACTIVE,
                    balance: 0m
                );
                db.Wallets.Add(wallet);
            }

            await db.SaveChangesAsync();
            await dbTx.CommitAsync();
        }
        catch
        {
            await dbTx.RollbackAsync();
            throw;
        }
    }
    


    private static string GenerateWalletNumber()
    {
        return string.Concat(Enumerable.Range(0, 12)
            .Select(_ => RandomNumberGenerator.GetInt32(0, 10)));
    }
}