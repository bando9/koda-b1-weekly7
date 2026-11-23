using Ewallet.Application.DTOs;
using Ewallet.Application.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Ewallet.Mvc.Controllers;

[ApiController]
[Route("api/v1/auth")]

public sealed class AuthController(IAuthService authService) : ControllerBase
{
    private readonly IAuthService _authService=authService;

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

    [HttpPost("login")]
    [EnableRateLimiting("auth")]
    [ProducesResponseType(typeof(AuthUserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var result = await _authService.LoginAsync(request, ct);

        if (!result.Succedded)
        {
            return Unauthorized(new { message=result.ErrorMessage});
        }

        return Ok(result.User);
    }
}