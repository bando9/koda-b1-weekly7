using Ewallet.Application.DTOs;
using Ewallet.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ewallet.Mvc.Controllers;

[ApiController]
[Route("api/v1/topup")]

public sealed class TopUpController(ITopUpService service) : ControllerBase
{
    
    [HttpPost]
    [ProducesResponseType(typeof(TopUpResponse),StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Create ([FromBody] CreateTopUpRequest request, CancellationToken ct)
    {
        var result = await service.CreateAsync(request,ct);
        return CreatedAtAction(nameof(GetById), new {id = result.TopUpRequestId}, result);
    }


    [HttpGet("{id:long}")]
    [ProducesResponseType(typeof(TopUpResponse),StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(long id, CancellationToken ct) => Ok(await service.GetByIdAsync(id,ct));


    [HttpPost("{id:long}/confirm")]
    [ProducesResponseType(typeof(TopUpResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Confirm(long id, CancellationToken ct)
    {
        try
        {
            return Ok(await service.ConfirmAsync(id, ct));
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
