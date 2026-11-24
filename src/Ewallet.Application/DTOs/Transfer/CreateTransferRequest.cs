using System.ComponentModel.DataAnnotations;

namespace Ewallet.Application.DTOs;

public sealed class CreateTransferRequest
{

    [Required]
    [StringLength(30, MinimumLength = 1)]
    public string ReceiverWalletNumber {get;init;} = string.Empty;
    [Required]
    [Range(typeof(decimal), "10000", "1000000000000", ErrorMessage ="nominal antara 10000 hingga 1000000000000")]
    public decimal Amount {get;init;}
    [StringLength(255)] 
    public string? Description{get;init;}
}
