using Ewallet.Application.DTOs;
using Ewallet.Application.Services;
using Ewallet.Mvc.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ewallet.Mvc.Controllers;

[ApiController]
[Route("api/v1/transfers")]
[Authorize]

public sealed class TransferController(ITransferService service): ControllerBase
{
    
    [HttpPost]
    [ProducesResponseType(typeof(TransferResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Create([FromBody] CreateTransferRequest request, CancellationToken ct)
    {
        try
        {
            var userId = User.GetRequiredUserId();
            var result = await service.CreateAsync(userId, request,ct);
            return StatusCode(StatusCodes.Status201Created, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new{message = ex.Message});
        }

    }
}
