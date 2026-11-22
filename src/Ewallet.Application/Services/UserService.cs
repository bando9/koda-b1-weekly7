// using System.Security.Cryptography;
// using Ewallet.Application.DTOs;
// using Ewallet.Domain.Entities;
// using Ewallet.Application.Repositories;
// using Ewallet.Application.Exceptions;

// namespace Ewallet.Application.Services;

// public sealed class UserService(IUserRepository repository,IAppDbContext context) : IUserService
// {
//     private readonly IUserRepository _repository=repository;
//     private readonly IAppDbContext _context = context;

//     public async Task<IReadOnlyList<UserResponse>> GetAllAsync(CancellationToken ct)
//     {
//         var users = await _repository.GetAllAsync(ct);

//         return users.Select(UserResponse.FromModel).ToArray();
//     }

//     public async Task<UserResponse?> GetByIdAsync(long id, CancellationToken ct)
//     {
//         if (id < 0)
//         {
//             return null!;
//         }

//         var user = await _repository.GetByIdAsync(id, ct);

//         return user is null ? null : UserResponse.FromModel(user);
//     }

//     public Task<UserDetailResponse?> GetDetailByIdAsync(long id, CancellationToken ct) => _repository.GetDetailByIdAsync(id,ct);

//     public async Task<UserResponse?> CreateWithWalletAsync(UserRequest request,CancellationToken ct)
//     {

//         var existingUser = await  _repository.GetConflictUserAsync(request.Username,request.Email,request.Phone,ct);

//         if(existingUser is not null)
//         {
//             if(existingUser.Username == request.Username)
//             {
//                 throw new InvalidOperationException("username already exist");
//             }
//             if(existingUser.Email == request.Email)
//             {
//                 throw new InvalidOperationException("email already exist");
//             }
//             if(existingUser.Phone == request.Phone)
//             {
//                 throw new InvalidOperationException("phone already exist");
//             }
//         }

//         await using var transaction = await _context.Database.BeginTransactionAsync(ct);
//         try
//         {
//             var user = new User(0, request.Username,request.FullName,request.Email,request.Phone,request?.PasswordHash,UserStatusEnum.ACTIVE);

//             long userId = await _repository.CreateAsync(user,ct);

//             var wallet = new Wallet(0,GenerateWalletNumber(),userId, WalletStatusEnum.ACTIVE);
            
//             await _repository.CreateWalletAsync(wallet,ct);

//             await transaction.CommitAsync(ct);

//             return UserResponse.FromModel(user);

//         }
//         catch (DuplicateKeyException)
//         {
//             await transaction.RollbackAsync(ct);
//             return null;
//         }
//         catch
//         {
//             await transaction.RollbackAsync(ct);
//             throw;
//         }
//     }


//     private static string GenerateWalletNumber()
//     {
//         return string.Concat(Enumerable.Range(0, 12)
//             .Select(_ => RandomNumberGenerator.GetInt32(0, 10)));
//     }
    

// }
