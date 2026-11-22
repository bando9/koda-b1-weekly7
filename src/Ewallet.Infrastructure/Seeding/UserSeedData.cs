using System.Data.Common;
using Ewallet.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Infrastructure.Persistence.Seeders;

// public static class UserWalletSeedData
// {
//     private static IEnumerable<(User User, string WalletNumber)> InitialUsers()
//     {
//         var users = new[]
//         {
//             ("andi.pratama", "Andi Pratama", "andi@example.com", "081234567801", "W-0001"),
//             ("budi.santoso", "Budi Santoso", "budi@example.com", "081234567802", "W-0002"),
//             ("citra.lestari", "Citra Lestari", "citra@example.com", "081234567803", "W-0003"),
//             ("dimas.wijaya", "Dimas Wijaya", "dimas@example.com", "081234567804", "W-0004"),
//             ("eka.putri", "Eka Putri", "eka@example.com", "081234567805", "W-0005"),
//             ("fajar.nugroho", "Fajar Nugroho", "fajar@example.com", "081234567806", "W-0006"),
//             ("gita.permata", "Gita Permata", "gita@example.com", "081234567807", "W-0007"),
//             ("hendra.kusuma", "Hendra Kusuma", "hendra@example.com", "081234567808", "W-0008"),
//             ("indah.sari", "Indah Sari", "indah@example.com", "081234567809", "W-0009"),
//             ("joko.susilo", "Joko Susilo", "joko@example.com", "081234567810", "W-0010"),
//         };

//         foreach(var(username, fullName,email,phone,walletNumber) in users)
//         {
//             var user = new User(
//                 id:0,
//                 userName: username,
//                 fullName: fullName,
//                 email: email,
//                 phone:phone,
//                 passwordHash:"AQAAAAIAAYagAAAAEDummyHashedPasswordForSeedData123==",
//                 status: UserStatusEnum.ACTIVE
//             );

//             yield return(user, walletNumber);
//         }
//     }

//     public static void Seed(DbContext context)
//     {
//         foreach(var (user,walletNumber) in InitialUsers())
//         {
//             bool exists = context.Set<User>().Any(u => u.Username == user.Username);
//             if (!exists)
//             {
//                 context.Set<User>().Add(user);
//                 context.SaveChanges(); // Simpan dulu agar user.Id ter-generate oleh SQL Server

//                 var wallet = new Wallet(
//                     id: 0,
//                     walletNumber: walletNumber,
//                     userId: user.Id,
//                     status: WalletStatusEnum.ACTIVE,
//                     balance: 0m // Saldo awal Rp0 sesuai ketentuan
//                 );
//                 context.Set<Wallet>().Add(wallet);
//             }
//         }
//         context.SaveChanges();
//     }

//     public static async Task SeedAsync(DbContext context, CancellationToken ct = default)
//     {
//         foreach (var (user, walletNumber) in InitialUsers())
//         {
//             bool exists = await context.Set<User>().AnyAsync(u => u.Username == user.Username, ct);
//             if (!exists)
//             {
//                 context.Set<User>().Add(user);
//                 await context.SaveChangesAsync(ct);

//                 var wallet = new Wallet(
//                     id: 0,
//                     walletNumber: walletNumber,
//                     userId: user.Id,
//                     status: WalletStatusEnum.ACTIVE,
//                     balance: 0m
//                 );
//                 context.Set<Wallet>().Add(wallet);
//             }
//         }
//         await context.SaveChangesAsync(ct);
//     }
// }


// // using KodaStore.Api.Models;
// using Ewallet.Domain.Entities;
// using Microsoft.EntityFrameworkCore;

// namespace KodaStore.Api.Seeding;

// public static class UserSeedData
// {
    
//     private static IEnumerable<User> InitialUsers()
//     {
//         // *Data seed generate
//         for(int i = 1; i<=10; i++)
//         {
//             long id=i;
//             string userName = $"username{i:D3}";
//             string fullName = $"User Dummy {i}";
//             string email = $"userdummy{i}@dummy.com";
//             string phone="08967729"+i;
//             string? PasswordHash = $"password{i}";
//             UserStatusEnum status = UserStatusEnum.ACTIVE; 

//             yield return new User(id,userName,fullName,email,phone,PasswordHash,status);
//         }
//     }

//     public static void Seed(DbContext context)
//     {
//         foreach(var user in InitialUsers())
//         {
            
//             bool exists = context.Set<User>().Any(u=>u.Id == user.Id);

//             if (!exists)
//             {
//                 context.Set<User>().Add(user);
//             };

//         }

//         context.SaveChanges();
//     }

//     public static async Task SeedAsync(DbContext context, CancellationToken ct)
//     {
//         foreach (var user in InitialUsers())
//         {
//             bool exists = await context.Set<User>().AnyAsync(p => p.Id == user.Id, ct);

//             if (!exists)
//             {
//                 context.Set<User>().Add(user);
//             }
//         }

//         await context.SaveChangesAsync(ct);
//     }
// }
