using Ewallet.Application.DTOs;
using Ewallet.Domain.Entities;
using Ewallet.Application.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Ewallet.Mvc.Controllers;


[ApiController]
[Route("api/v1/audit-logs")]

public sealed class AuditLogController(IAuditLogService logService) : ControllerBase
{
    
    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(PagedResultLogs<AuditLogItemResponse>) ,StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> GetAll ([FromQuery] AuditLogSearchRequest request ,CancellationToken ct)
    {
        var logs = await logService.SearchAsync(request,ct);
        return Ok(logs);
    }
    
}
