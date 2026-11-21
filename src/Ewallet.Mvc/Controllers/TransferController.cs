using Ewallet.Application.DTOs;
using Ewallet.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ewallet.Mvc.Controllers;

[ApiController]
[Route("api/transfers")]

public sealed class TransferController(ITransferService service): ControllerBase
{
    
    [HttpPost]
    [ProducesResponseType(typeof(TransferResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Create([FromBody] CreateTransferRequest request, CancellationToken ct)
    {
        var result = await service.CreateAsync(request,ct);

        return StatusCode(StatusCodes.Status201Created,result);
    }
}
