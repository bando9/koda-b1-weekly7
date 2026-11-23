using Ewallet.Application.Repositories;
using Ewallet.Application.Services;
using Ewallet.Infrastructure.Identity;
using Ewallet.Infrastructure.Persistence;
using Ewallet.Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Ewallet.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("newEwallet") ?? throw new InvalidOperationException("Connection string newEwallet blm dikonfigurasi");

        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseSqlServer(connectionString, sqlOptions => sqlOptions.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName));
        });

        services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());
        

        // *Repository
        services.AddScoped<IAuditLogRepository, AuditLogRepository>();
        services.AddScoped<ITopUpRepository, TopUpRepository>();
        services.AddScoped<IWalletRepository, WalletRepository>();
        services.AddScoped<IPaymentMethodRepository, PaymentMethodRepository>();
        services.AddScoped<ITransactionRepository, TransactionRepository>();
        services.AddScoped<IWalletMutationRepository, WalletMutationRepository>();
        services.AddScoped<IAuditLogRepository, AuditLogRepository>();

        // User
        services.AddIdentityCore<AppUser>(options =>
        {
            options.User.RequireUniqueEmail = true;
            options.Password.RequiredLength = 8;
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireNonAlphanumeric = true;
            options.Password.RequiredUniqueChars = 4;

            options.SignIn.RequireConfirmedEmail = false;
        })  .AddRoles<IdentityRole<long>>()
            .AddEntityFrameworkStores<AppDbContext>();

        services.AddScoped<IAuthService, IdentityAuthService>();

        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IRefreshTokenService, RefreshTokenService>();

        return services;
    }
}