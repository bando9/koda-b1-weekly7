using Ewallet.Application.DTOs;
using Ewallet.Application.Services;
using Ewallet.Mvc.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ewallet.Mvc.Controllers;

[ApiController]
[Route("api/v1/topups")]
[Authorize]

public sealed class TopUpController(ITopUpService service) : ControllerBase
{
    
    [HttpPost]
    [ProducesResponseType(typeof(TopUpResponse),StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Create ([FromBody] CreateTopUpRequest request, CancellationToken ct)
    {
        var userId = User.GetRequiredUserId();
        var result = await service.CreateAsync(userId,request,ct);
        return CreatedAtAction(nameof(GetById), new {id = result.TopUpRequestId}, result);
    }


    [HttpGet("{id:long}")]
    [ProducesResponseType(typeof(TopUpResponse),StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(long id, CancellationToken ct)
    {
        try
        {
            var result = await service.GetByIdAsync(User.GetRequiredUserId(), User.IsAdmin(), id, ct);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }        
    }


    [HttpPost("{id:long}/confirm")]
    [ProducesResponseType(typeof(TopUpResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Confirm(long id, CancellationToken ct)
    {
        try
        {
            var result = await service.ConfirmAsync(User.GetRequiredUserId(), User.IsAdmin(),id,ct);
            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("tidak ditemukan", StringComparison.OrdinalIgnoreCase))
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

}
