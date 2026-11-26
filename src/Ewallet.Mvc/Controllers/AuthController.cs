using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Ewallet.Application.DTOs;
using Ewallet.Application.Services;
using KodaStore.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Ewallet.Mvc.Controllers;

[ApiController]
[Route("api/v1/auth")]

public sealed class AuthController(
    IAuthService authService,
    IWebHostEnvironment environment,
    IConfiguration configuration,
    IRefreshTokenService refreshTokenService
) : ControllerBase
{
     private const string RefreshCookieName = "ewallet_refresh";
    private readonly IAuthService _authService=authService; 
    private readonly IRefreshTokenService _refreshTokenService = refreshTokenService;
    private readonly IWebHostEnvironment _environtment = environment;
    private readonly IConfiguration _configuration = configuration;

    [HttpPost("register")]
    [EnableRateLimiting("auth")]
    [ProducesResponseType(typeof(AuthUserResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> Register ([FromBody] RegisterRequest request, CancellationToken ct)
    {
        var result = await _authService.RegisterAsync(request,ct);

        return result.Status switch
        {
            RegisterStatus.Created => CreatedAtAction(nameof(Register), new{id=result.User!.Id},result.User),

            RegisterStatus.DuplicateEmail or
            RegisterStatus.DuplicateUserName or
            RegisterStatus.DuplicatePhoneNumber => Conflict(new{errors = result.Errors}),

            _ => BadRequest(new{errors=result.Errors})
        };
    }

    [AllowAnonymous]
    [HttpPost("login")]
    [EnableRateLimiting("auth")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status429TooManyRequests)]
    public async Task<ActionResult<LoginResult>> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var result = await _authService.LoginAsync(request, ct);

        if (!result.Succedded || result.User is null)
        {
            return Unauthorized(new ProblemDetails
            {
                Status = StatusCodes.Status401Unauthorized,
                Title = "Invalid access",
                Detail = "email atau password salah" 
            });
        }

        var session = await _refreshTokenService.CreateSessionAsync(result.User,ct);

        WriteRefreshCookie(session.RawRefreshToken,session.RefreshExpiredAtUtc);

        Response.Headers.CacheControl = "no-store";

        var response = new LoginResponse(
                            Message: "Akun berhasil diverifikasi", 
                            User: session.User, 
                            AccessToken: session.AccessToken.AccessToken,
                            TokenType: "Bearer",
                            ExpiresAtUtc: session.AccessToken.ExpiredAtUtc);

        return Ok(response);
    }


    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(CurrentUserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status401Unauthorized)]
    public ActionResult<CurrentUserResponse> Me()
    {
        var subject =  User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        if(!long.TryParse(subject, out var userId) || userId <= 0 )
        {
            return Unauthorized(new ProblemDetails
            {
                
                Status = StatusCodes.Status401Unauthorized,
                Title = "Invalid user data"
            });
        }

        var email = User.FindFirst(JwtRegisteredClaimNames.Email)?.Value ?? string.Empty;
        var roles = User.FindAll("role").Select(claim => claim.Value).ToArray();

        var response = new CurrentUserResponse(userId, email,roles); 

        return Ok(response);
    }

    // *Refresh
    [AllowAnonymous]
    [EnableRateLimiting("auth-refresh")]
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<LoginResponse>> Refresh(CancellationToken ct)
    {
        if (!IsTrustedOrigin())
        {
            return StatusCode(StatusCodes.Status403Forbidden, new ProblemDetails
            {
                Status = StatusCodes.Status403Forbidden,
                Title = "Origin not allowed"
            });
        }

        var rawToken = Request.Cookies[RefreshCookieName];
        if (string.IsNullOrWhiteSpace(rawToken))
        {
            return Unauthorized(new ProblemDetails
            {
                Status = StatusCodes.Status401Unauthorized,
                Title = "Refresh token not found"
            });
        }

        var session = await _refreshTokenService.RotateAsync(rawToken, ct);
        if (session is null)
        {
            DeleteRefreshCookie();
            return Unauthorized(new ProblemDetails
            {
                Status = StatusCodes.Status401Unauthorized,
                Title = "Invalid refresh token",
                Detail = "Sesi tidak valid. Silakan login kembali."
            });
        }

        WriteRefreshCookie(session.RawRefreshToken, session.RefreshExpiredAtUtc);
        Response.Headers.CacheControl = "no-store";

        return Ok(new LoginResponse(
            Message: "Token berhasil diperbarui.",
            User: session.User,
            AccessToken: session.AccessToken.AccessToken,
            TokenType: "Bearer",
            ExpiresAtUtc: session.AccessToken.ExpiredAtUtc));
    }

    // *LOGOUT
    [AllowAnonymous]
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        if (!IsTrustedOrigin())
        {
            return StatusCode(StatusCodes.Status403Forbidden, new ProblemDetails
            {
                Status = StatusCodes.Status403Forbidden,
                Title = "Origin not allowed"
            });
        }

        var rawToken = Request.Cookies[RefreshCookieName];
        if (!string.IsNullOrWhiteSpace(rawToken))
        {
            await _refreshTokenService.RevokeFamilyAsync(rawToken, cancellationToken);
        }

        DeleteRefreshCookie();

        return NoContent();
    }





    // *Helper
    private void WriteRefreshCookie(string rawRefreshToken,DateTimeOffset expiresAtUtc)
    {
        Response.Cookies.Append(RefreshCookieName,rawRefreshToken,new CookieOptions
        {
            HttpOnly=true, 
            Secure= !_environtment.IsDevelopment() || Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Path = "/api/v1/auth",
            Expires = expiresAtUtc,
            IsEssential = true 
        });
    }

    private void DeleteRefreshCookie()
    {
        Response.Cookies.Delete(RefreshCookieName,new CookieOptions
        {
            HttpOnly=true,
            Secure= !_environtment.IsDevelopment() || Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Path = "/api/v1/auth",
        });
    }

    private bool IsTrustedOrigin()
    {
        var origin = Request.Headers.Origin.ToString();

        if (string.IsNullOrWhiteSpace(origin))
        {
            return false;
        }

        var allowedOrigins = _configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

        return allowedOrigins.Contains(origin,StringComparer.Ordinal);
    }


}