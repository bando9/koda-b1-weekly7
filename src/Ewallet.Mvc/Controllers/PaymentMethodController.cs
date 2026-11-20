using Ewallet.Mvc.DTOs;
using Ewallet.Mvc.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ewallet.Mvc.Controllers;

[ApiController]
[Route("api/v1/payment-methods")]

public sealed class PaymentMethodController(IPaymentMethodService service) : ControllerBase
{
    
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<PaymentMethodResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetActive(CancellationToken ct) => Ok(await service.GetActiveAsync(ct));
}