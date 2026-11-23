using Ewallet.Application.Exceptions;
using Ewallet.Application.Repositories;
using Ewallet.Domain.Entities;
using Ewallet.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Infrastructure.Persistence;

public sealed class AppDbContext : IdentityDbContext<AppUser, IdentityRole<long>, long>, IAppDbContext // *Beda (long=>Guid)
{
    public AppDbContext(DbContextOptions<AppDbContext> options): base(options){}

    public DbSet<AuditLog> AuditLogs => Set<AuditLog>(); 
    public DbSet<PaymentMethod> PaymentMethods => Set<PaymentMethod>(); 
    public DbSet<TopUpRequest> TopUpRequests => Set<TopUpRequest>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Wallet> Wallets => Set<Wallet>();
    public DbSet<WalletMutation> WalletMutations => Set<WalletMutation>();
    public DbSet<RefreshToken> RefreshToken => Set<RefreshToken>();



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // *Users
        modelBuilder.Entity<AppUser>(entity =>
        {

            entity.Property(u=>u.FullName).HasMaxLength(150).IsRequired();

            entity.Property(u => u.Status).HasConversion<string>().HasColumnType("varchar(20)").IsRequired();

            entity.Property(u => u.PhoneNumber).HasMaxLength(20).IsRequired();
            entity.HasIndex(u => u.PhoneNumber).IsUnique();

        });


        // *Refresh Token
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.ToTable("RefreshTokens", "dbo");

            entity.HasKey(token => token.Id);
            entity.Property(token => token.Id)
                    .ValueGeneratedNever();
            entity.Property(token => token.TokenHash)
                    .HasMaxLength(64).IsUnicode(false).IsRequired();

            entity.HasIndex(token => new
            {
                token.UserId,
                token.FamilyId,
            });
            entity.HasIndex(token =>token.FamilyId);

            entity.HasOne(token => token.User)
                    .WithMany()
                    .HasForeignKey(token=>token.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

            entity.Property(token => token.CreatedAtUtc)
                    .HasColumnType("datetimeoffset");     
            entity.Property(token => token.ExpiredAtUtc)
                    .HasColumnType("datetimeoffset");     
            entity.Property(token => token.UsedAtUtc)
                    .HasColumnType("datetimeoffset");     
            entity.Property(token => token.RevokedAtUtc)
                    .HasColumnType("datetimeoffset");

        });
    
        // *Wallets
        modelBuilder.Entity<Wallet>(entity =>
        {
            entity.ToTable("Wallets", "dbo", table =>
            {
                table.HasCheckConstraint("CK_Wallets_Balance", "[Balance] >= 0");
                table.HasCheckConstraint("CK_Wallets_Status", "[Status] IN ('ACTIVE', 'FROZEN', 'CLOSED')");
            });

            entity.HasKey(w => w.Id);
            entity.Property(w => w.Id).UseIdentityColumn();

            entity.Property(w => w.WalletNumber).HasMaxLength(30).IsRequired();
            entity.HasIndex(w => w.WalletNumber).IsUnique();

            entity.Property(w => w.Balance).HasPrecision(18,2).IsRequired();

            entity.Property(w => w.Status).HasConversion<string>().HasColumnType("varchar(20)").IsRequired();

            entity.Property(w => w.RowVersion).IsRowVersion().IsRequired();

            entity.Property(w => w.CreatedAtUtc).HasColumnType("DATETIME2").HasDefaultValueSql("SYSUTCDATETIME()").IsRequired();
            entity.Property(w => w.UpdatedAtUtc).HasColumnType("DATETIME2").IsRequired(false);

            entity.HasOne<AppUser>().WithOne().HasForeignKey<Wallet>(u=>u.UserId).IsRequired().OnDelete(DeleteBehavior.Restrict);
            
            entity.HasIndex(w=>w.UserId).IsUnique();
        });

        // *Transaction
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.ToTable("Transactions", "dbo", table =>
            {
                table.HasCheckConstraint("CK_Transactions_Amount", "[Amount] > 0");
                table.HasCheckConstraint("CK_Transactions_Type", "[Type] IN ('TOPUP', 'TRANSFER')");
                table.HasCheckConstraint("CK_Transactions_Status", "[Status] IN ('PENDING', 'SUCCESS', 'FAILED')");

                table.HasCheckConstraint("CK_Transactions_Participants",
                "([Type] = 'TOPUP' AND [SenderWalletId] IS NULL) " +
                "OR ([Type] = 'TRANSFER' AND [SenderWalletId] IS NOT NULL AND [SenderWalletId] <> [ReceiverWalletId])");
            });

            entity.HasKey(t => t.Id);
            entity.Property(t => t.Id).UseIdentityColumn();

            entity.Property(t => t.ReferenceNo).HasMaxLength(50).IsRequired();
            entity.HasIndex(t => t.ReferenceNo).IsUnique();

            entity.Property(t => t.SenderWalletId).IsRequired(false);
            entity.Property(t => t.ReceiverWalletId).IsRequired();

            entity.Property(t => t.Type).HasConversion<string>().HasColumnType("varchar(20)").IsRequired();
            entity.Property(t => t.Amount).HasPrecision(18,2).IsRequired();
            entity.Property(t => t.Status).HasConversion<string>().HasColumnType("varchar(20)").IsRequired();
            entity.Property(t => t.Description).HasMaxLength(255).IsRequired(false);
            
            entity.Property(t => t.CreatedAtUtc).HasColumnType("DATETIME2").HasDefaultValueSql("SYSUTCDATETIME()").IsRequired();
            entity.Property(t => t.CompletedAtUtc).HasColumnType("DATETIME2").IsRequired(false);

            entity.HasIndex(t => new{t.SenderWalletId,t.CreatedAtUtc}).IsDescending(false, true);
            entity.HasIndex(t => new{t.ReceiverWalletId,t.CreatedAtUtc}).IsDescending(false,true);


            entity.HasOne(t => t.SenderWallet)
                .WithMany(w => w.SentTransactions)
                .HasForeignKey(t => t.SenderWalletId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(t => t.ReceiverWallet)
                .WithMany(w => w.ReceivedTransactions)
                .HasForeignKey(t => t.ReceiverWalletId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

        });

        // *Wallet Mutations
        modelBuilder.Entity<WalletMutation>(entity =>
        {
            entity.ToTable("WalletMutations", "dbo", table =>
            {
                table.HasCheckConstraint("CK_WalletMutations_Direction", "[Direction] IN ('IN', 'OUT')");
                table.HasCheckConstraint("CK_WalletMutations_Amount", "[Amount] > 0");
                table.HasCheckConstraint("CK_WalletMutations_BalanceConsistency",
                "([Direction] = 'IN'  AND [BalanceAfter] = [BalanceBefore] + [Amount]) " +
                "OR ([Direction] = 'OUT' AND [BalanceAfter] = [BalanceBefore] - [Amount])");
            });
            entity.HasKey(wm=>wm.Id);
            entity.Property(wm=>wm.Id).UseIdentityColumn();
            

            entity.Property(wm => wm.Direction).HasConversion<string>().HasColumnType("varchar(3)").IsRequired();
            entity.Property(wm => wm.Amount).HasPrecision(18,2).IsRequired();
            entity.Property(wm => wm.BalanceBefore).HasPrecision(18,2).IsRequired();
            entity.Property(wm => wm.BalanceAfter).HasPrecision(18,2).IsRequired();
            entity.Property(wm => wm.CreatedAtUtc).HasColumnType("datetime2").HasDefaultValueSql("SYSUTCDATETIME()").IsRequired();

            entity.HasOne(wm => wm.Transaction).WithMany(t=>t.WalletMutations).HasForeignKey(wm=>wm.TransactionId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(wm => wm.Wallet).WithMany(w=>w.WalletMutations).HasForeignKey(wm=>wm.WalletId).OnDelete(DeleteBehavior.Restrict);
            
            entity.HasIndex(wm=>new{wm.TransactionId, wm.WalletId}).IsUnique();
            entity.HasIndex(wm=>new{wm.WalletId, wm.CreatedAtUtc,wm.Id}).IsDescending(false,true,true);
        });

        // *PaymentMethods
        modelBuilder.Entity<PaymentMethod>(entity =>
        {
            entity.ToTable("PaymentMethods", "dbo");

            entity.HasKey(pm => pm.Id);
            entity.Property(pm => pm.Id).UseIdentityColumn();

            entity.Property(pm => pm.Code).HasMaxLength(30).IsRequired();
            entity.HasIndex(pm => pm.Code).IsUnique();

            entity.Property(pm => pm.Name).HasMaxLength(100).IsRequired();
            entity.Property(pm => pm.ProviderName).HasMaxLength(100).IsRequired(false);
            entity.Property(pm => pm.IsActive).IsRequired();
            entity.Property(pm=>pm.CreatedAtUtc).HasColumnType("datetime2").HasDefaultValueSql("SYSUTCDATETIME()").IsRequired();
        });

        // *TopUpRequests
        modelBuilder.Entity<TopUpRequest>(entity =>
        {
            entity.ToTable("TopUpRequests","dbo", table =>
            {
                table.HasCheckConstraint("CK_TopUpRequests_Amount", "[Amount] > 0");
                table.HasCheckConstraint("CK_TopUpRequests_Status", "[Status] IN ('PENDING', 'PAID', 'FAILED', 'EXPIRED')");
            });

            entity.HasKey(tr => tr.Id);
            entity.Property(tr => tr.Id).UseIdentityColumn();

            entity.Property(tr => tr.Amount).HasPrecision(18,2).IsRequired();
            entity.Property(tr => tr.Status).HasConversion<string>().HasColumnType("varchar(20)").IsRequired();
            entity.Property(tr => tr.ProviderReference).HasMaxLength(100).IsRequired(false);
            entity.Property(tr => tr.CreatedAtUtc).HasColumnType("datetime2").HasDefaultValueSql("SYSUTCDATETIME()").IsRequired();
            entity.Property(tr => tr.ExpiresAtUtc).HasColumnType("datetime2").IsRequired(false);
            entity.Property(tr => tr.PaidAtUtc).HasColumnType("datetime2").IsRequired(false);

            entity.HasOne(tr => tr.Transaction).WithOne(t=>t.TopUpRequest).HasForeignKey<TopUpRequest>(tr=>tr.TransactionId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(tr => tr.Wallet).WithMany(w=>w.TopUpRequests).HasForeignKey(tr=>tr.WalletId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(tr => tr.PaymentMethod).WithMany(pm=>pm.TopUpRequests).HasForeignKey(tr=>tr.PaymentMethodId).OnDelete(DeleteBehavior.Restrict);           

        });

        // *AuditLogs
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.ToTable("AuditLogs", "dbo",table =>
            {
                table.HasCheckConstraint("CK_AuditLogs_Outcome", "[Outcome] IN ('SUCCESS', 'REJECTED','FAILED')");
            });

            entity.HasKey(a=>a.Id);
            entity.Property(a=>a.Id).UseIdentityColumn();

            entity.Property(a=>a.Action).HasMaxLength(60).IsRequired();
            entity.Property(a=>a.EntityType).HasMaxLength(60).IsRequired();
            entity.Property(a=>a.EntityId).HasMaxLength(60).IsRequired(false);
            entity.Property(a=>a.Outcome).HasConversion<string>().HasColumnType("varchar(20)").IsRequired();
            entity.Property(a=>a.Description).HasMaxLength(500).IsRequired(false);    
            entity.Property(a=>a.CorrelationId).HasMaxLength(100).IsRequired(false);
            entity.Property(a=>a.CreatedAtUtc).HasColumnType("datetime2").HasDefaultValueSql("SYSUTCDATETIME()").IsRequired();

            entity.HasOne<AppUser>().WithMany().IsRequired(false).HasForeignKey(a=>a.ActorUserId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(a=>a.Transaction).WithMany(t=>t.AuditLogs).HasForeignKey(a=>a.TransactionId).OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(a=>new{a.ActorUserId,a.CreatedAtUtc}).IsDescending(false,true);
        });
    }

    public override async Task<int> SaveChangesAsync(CancellationToken ct)
    {
        try
        {
            return await base.SaveChangesAsync(ct);
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException {Number: 2601 or 2627})
        {
            
            throw new DuplicateKeyException("Data duplikat melanggar unique constraint", ex);
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 1205 })
        {
            throw new DeadlockException("Terjadi deadlock pada transaksi database.", ex);
        }
    }
}
