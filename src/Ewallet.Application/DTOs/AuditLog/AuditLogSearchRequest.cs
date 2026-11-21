using System.ComponentModel.DataAnnotations;
using Ewallet.Domain.Entities;

namespace Ewallet.Application.DTOs;


public sealed class AuditLogSearchRequest : IValidatableObject
{
    [StringLength(100)]
    public string? Search {get;set;}
    [StringLength(50)]
    public string? Action {get;set;}
    [StringLength(50)]
    public string? EntityType {get;set;}
    [StringLength(50)]
    public string? EntityId {get;set;}
    public OutcomeEnum? Outcome {get;set;}
    public long? ActorUserId {get;set;}
    public long? TransactionId {get;set;}
    public DateTime? FromUtc {get;set;}
    public DateTime? ToUtc {get;set;}
    [Required, StringLength(20)]
    public string Sort {get;set;} = "created_desc";
    [Range(1, 100000000000000)]
    public int Page {get;set;} = 1;
    [Range(1, 100000000000000)]
    public int PageSize {get;set;} = 10;


    public IEnumerable<ValidationResult> Validate(ValidationContext context)
    {
        if (ActorUserId is <= 0)
            yield return new ValidationResult("ActorUserId harus lebih besar dari 0.", [nameof(ActorUserId)]);

        if (TransactionId is <= 0)
            yield return new ValidationResult("TransactionId harus lebih besar dari 0.", [nameof(TransactionId)]);

        if (FromUtc.HasValue && ToUtc.HasValue && FromUtc > ToUtc)
        {
            yield return new ValidationResult(
                "FromUtc tidak boleh melebihi ToUtc.",
                [nameof(FromUtc), nameof(ToUtc)]
            );
        }


        string[] allowedSort = [
            "created_desc", "created_asc",
            "action_asc", "action_desc",
            "entity_asc", "entity_desc"
        ];

        if (!allowedSort.Contains(Sort, StringComparer.OrdinalIgnoreCase))
        {
            yield return new ValidationResult("Sort tidak tersedia di whitelist.", [nameof(Sort)]);
        } 
    }
}
