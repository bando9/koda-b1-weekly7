using Ewallet.Application.Repositories;
using Ewallet.Infrastructure.Persistence;
using Ewallet.Infrastructure.Repositories;
using Microsoft.CodeAnalysis.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Ewallet.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("newEwallet") ?? throw new InvalidOperationException("Connection string newEwallet blm dikonfigurasi");

        // services.AddDbContext<AppDbContext>(Option =>
        // {
        //    Option 
        // });

        // *Repository
        services.AddScoped<IAuditLogRepository, AuditLogRepository>();
        services.AddScoped<ITopUpRepository, TopUpRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IWalletRepository, WalletRepository>();
        services.AddScoped<IPaymentMethodRepository, PaymentMethodRepository>();
        services.AddScoped<ITransactionRepository, TransactionRepository>();
        services.AddScoped<IWalletMutationRepository, WalletMutationRepository>();
        services.AddScoped<IAuditLogRepository, AuditLogRepository>();

        return services;
    }
}