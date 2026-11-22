// using Ewallet.Application.DTOs;
// using Ewallet.Application.Services;
// using Microsoft.AspNetCore.Mvc;

// namespace Ewallet.Mvc.Controllers;

// [ApiController]
// [Route("api/v1/users")]

// public sealed class UserController(
//     IUserService service, 
//     IHistoryService historyService
// ) : ControllerBase
// {
//     private readonly IUserService _service = service;
//     private readonly IHistoryService _historyservice = historyService;

//     // *Get All Users
//     [HttpGet]
//     [ProducesResponseType(typeof(IReadOnlyList<UserResponse>), StatusCodes.Status200OK)]
//     [ProducesResponseType(typeof(IReadOnlyList<UserResponse>), StatusCodes.Status404NotFound)]
//     public async Task<ActionResult<IReadOnlyList<UserResponse>>> GetAll(CancellationToken ct)
//     {
//         var users = await _service.GetAllAsync(ct);
//         return Ok(users);
//     }
    
//     // *Get user by id
//     [HttpGet("{id}")]
//     [ProducesResponseType(typeof(IReadOnlyList<UserDetailResponse>), StatusCodes.Status200OK)]
//     [ProducesResponseType(typeof(IReadOnlyList<UserDetailResponse>), StatusCodes.Status404NotFound)]
//     public async Task<ActionResult<IReadOnlyList<UserDetailResponse>>> GetById(long id, CancellationToken ct)
//     {
//         var user = await _service.GetDetailByIdAsync(id,ct);
//         return user is null ? Problem(statusCode: StatusCodes.Status404NotFound, title: "User not found") : Ok(user);
//     }

//     // *Create user with wallet
//     [HttpPost]
//     [ProducesResponseType(typeof(WalletResponse), StatusCodes.Status201Created)]
//     [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
//     [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
//     public async Task<ActionResult<WalletResponse>> Create([FromBody]UserRequest request ,CancellationToken ct)
//     {
//         try
//         {
//             var created = await _service.CreateWithWalletAsync(request, ct);

//             if (created is null)
//             {
//                 return Problem(statusCode: StatusCodes.Status409Conflict, title: "Wallet code already exists");
//             }

//             return CreatedAtAction(
//                 nameof(GetById),
//                 new { id = created.Id }, created);
//         }
//         catch (InvalidOperationException e)
//         {
//             return Problem(
//                 statusCode: StatusCodes.Status409Conflict,
//                 title: "Conflict user data!",
//                 detail: e.Message);
//         }
//         catch (ArgumentException e)
//         {
//             return Problem(
//                 statusCode: StatusCodes.Status400BadRequest,
//                 title: "Invalid user data!",
//                 detail: e.Message);
//         }
//     }



//     [HttpGet("{userId:long}/transactions")]
//     [ProducesResponseType(typeof(PagedResult<MutationResponse>), StatusCodes.Status200OK)] 
//     [ProducesResponseType(StatusCodes.Status400BadRequest)]
//     [ProducesResponseType(StatusCodes.Status404NotFound)]
//     public async Task<IActionResult> GetMutations(
//         long userId, [FromQuery] MutationQuery query, CancellationToken ct
//     )
//         {
//             try
//         {
//             var result = await _historyservice.GetMutationsAsync(userId, query, ct);
//             return Ok(result);
//         }
//         catch (KeyNotFoundException ex)
//         {
//             return NotFound(new { message = ex.Message });
//         }
//     }
// }
