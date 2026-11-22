using Ewallet.Infrastructure.Persistence;
using Ewallet.Infrastructure.Persistence.Seeders;
using Ewallet.Mvc.Middlewares;
using Ewallet.Application.Repositories;
using Ewallet.Application.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Ewallet.Infrastructure;
using System.Threading.RateLimiting;
using Ewallet.Infrastructure.Identity;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddSingleton(TimeProvider.System);

builder.Services.AddOpenApi();

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

builder.Services.AddInfrastructure(builder.Configuration);

// var connectionString = builder.Configuration.GetConnectionString("newEwallet") 
//     ?? throw new InvalidOperationException("ga bisa koneksi, belum konfigurasi");

// builder.Services.AddDbContext<AppDbContext>(options =>
// {
//         .UseSeeding((context, _) =>
//         {
//             PaymentMethodSeedData.Seed(context);
//             // UserWalletSeedData.Seed(context);
//             TransactionSeedData.Seed(context);
//         })
//         .UseAsyncSeeding(async (context, _, ct) =>
//         {
//             await PaymentMethodSeedData.SeedAsync(context, ct);
//             // await UserWalletSeedData.SeedAsync(context, ct);
//             await TransactionSeedData.SeedAsync(context, ct);
//         });
// });



// *Service
builder.Services.AddScoped<IPaymentMethodService, PaymentMethodService>();
builder.Services.AddScoped<ITopUpService, TopUpService>();
// builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IHistoryService, HistoryService>();
builder.Services.AddScoped<ITransferService, TransferService>();
builder.Services.AddScoped<IAuditLogService, AuditLogService>();

builder.Services.AddInfrastructure(builder.Configuration);


// *RateLimiter
// builder.Services.AddRateLimiter(options =>
// {
//     options.AddPolicy("auth", ctx =>
//     {
//         var ip = ctx.Connection.RemoteIpAddress?.ToString() ?? "nihil";
//         return RateLimitPartition.GetFixedWindowLimiter(
//             partitionKey: $"login: {ip}",
//             factory: _=> new FixedWindowRateLimiterOptions
//             {
//                 PermitLimit=5,
//                 Window=TimeSpan.FromMinutes(5),
//                 QueueLimit=0,
//                 AutoReplenishment=true
//             }
//         );
//     });
// });


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var dbContext = services.GetRequiredService<AppDbContext>();
    var isDevOrTest = app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Testing");

    await PaymentMethodSeedData.SeedAsync(dbContext);
    await IdentitySeeder.SeedAsync(services, isDevOrTest);

    if (isDevOrTest)
    {
        await TransactionSeedData.SeedAsync(dbContext);
    }
}

app.UseExceptionHandler();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{

    app.MapOpenApi();

    app.UseExceptionHandler("/Home/Error");
    

    app.MapScalarApiReference("/api",options => 
    {
        options.Title = "Ewallet API";
    });
    
    app.MapGet("/", () => Results.Redirect("/api"));
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}


app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();

