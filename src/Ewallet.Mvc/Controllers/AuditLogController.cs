using Ewallet.Mvc.DTOs;
using Ewallet.Mvc.Models;
using Ewallet.Mvc.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ewallet.Mvc.Controllers;


[ApiController]
[Route("api/v1/audit-logs")]

public sealed class AuditLogController(IAuditLogService logService) : ControllerBase
{
    
    [HttpGet]
    [ProducesResponseType(typeof(PagedResultLogs<AuditLogItemResponse>) ,StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> GetAll ([FromQuery] AuditLogSearchRequest request ,CancellationToken ct)
    {
        var logs = await logService.SearchAsync(request,ct);
        return Ok(logs);
    }
    
}