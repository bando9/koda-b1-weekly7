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
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

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
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    
    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.HttpContext.Response.ContentType="application/problem+json";

        int? retryAfterSeconds=null;
        if(context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
        {
            retryAfterSeconds=(int)Math.Ceiling(retryAfter.TotalSeconds);
            context.HttpContext.Response.Headers.RetryAfter=retryAfterSeconds.ToString();
        }

        var problemDetails = new ProblemDetails
        {
            Status= StatusCodes.Status429TooManyRequests,
            Title="Too Many Requests",
            Detail = retryAfterSeconds.HasValue
                        ? $"Terlalu banyak percobaan, silahkan coba lagi dalam {retryAfterSeconds} detik."
                        : "Terlalu banyak percobaan, silahkan coba lagi.",
            Instance = context.HttpContext.Request.Path
        };

        await context.HttpContext.Response.WriteAsJsonAsync(problemDetails,cancellationToken);        
    };

    options.AddPolicy("auth", ctx =>
    {
        var ip = ctx.Connection.RemoteIpAddress?.ToString() ?? "nihil";
        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: $"login: {ip}",
            factory: _=> new FixedWindowRateLimiterOptions
            {
                PermitLimit=5,
                Window=TimeSpan.FromMinutes(1),
                QueueLimit=0,
                AutoReplenishment=true
            }
        );
    });
});

var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? [];

builder.Services.AddCors(option =>
{
    option.AddPolicy("ReactClient", policy =>
    {
        policy.WithOrigins(allowedOrigins)
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});


// *JWT
var jwtOption = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>()
        ?? throw new InvalidOperationException("Konfigurasi JWT blm dilakukan");

if(string.IsNullOrWhiteSpace(jwtOption.Issuer))
    throw new InvalidOperationException("Jwt Issuer blm tersedia");
if(string.IsNullOrWhiteSpace(jwtOption.Audience))
    throw new InvalidOperationException("Jwt Audience blm tersedia");
if(jwtOption.AccessTokenMinutes is <1 or >60)
    throw new InvalidOperationException("Jwt Access Token Minutes hanya antara 1-60 detik");

byte[] signingKeyBytes;
try
{
    signingKeyBytes = Convert.FromBase64String(jwtOption.SigningKeyBase64);
}
catch (FormatException e)
{
    throw new InvalidOperationException("Jwt SigningKeyBase64 tidak menggunakan standar Base 64",e);
}

if(signingKeyBytes.Length <32) throw new InvalidOperationException("Jwt signing key minimal 32 byte");


// *Authenticatoin
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
   options.MapInboundClaims = false;
   options.IncludeErrorDetails = false;
   options.TokenValidationParameters = new TokenValidationParameters
   {
       ValidateIssuer=true,
       ValidIssuer=jwtOption.Issuer,
       ValidateAudience=true,
       ValidAudience=jwtOption.Audience,
       ValidateIssuerSigningKey=true,
       IssuerSigningKey=new SymmetricSecurityKey(signingKeyBytes),
       RequireSignedTokens = true,
       ValidAlgorithms = [
           SecurityAlgorithms.HmacSha256
       ],
       ValidateLifetime = true,
       RequireExpirationTime=true,
       ClockSkew = TimeSpan.Zero,
       NameClaimType =JwtRegisteredClaimNames.Sub,
       RoleClaimType = "role"
   }; 
});

// *Authorization
builder.Services.AddAuthorization();



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

app.UseCors("ReactClient");


app.UseAuthorization();

app.UseRateLimiter();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();

