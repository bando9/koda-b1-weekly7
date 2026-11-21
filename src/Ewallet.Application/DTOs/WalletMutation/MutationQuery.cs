using System.ComponentModel.DataAnnotations;
using Ewallet.Domain.Entities;

namespace Ewallet.Application.DTOs;

public enum MutationSortBy
{
    CreatedAt,
    Amount
}

public sealed class MutationQuery : PagedQuery, IValidatableObject
{
    [StringLength(50)]
    public string? Search {get;set;}
    [EnumDataType(typeof(DirectionEnum))]
    public DirectionEnum? Direction {get;set;}
    public DateTime? FromDate {get;set;}
    public DateTime? ToDate {get;set;}
    [EnumDataType(typeof(MutationSortBy))]
    public MutationSortBy SortBy {get;set;} = MutationSortBy.CreatedAt;
    [EnumDataType(typeof(SortDirection))]
    public SortDirection SortDir {get;set;} = SortDirection.Desc;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if(FromDate.HasValue && ToDate.HasValue && FromDate.Value.Date > ToDate.Value.Date)
            yield return new ValidationResult("fromDate tidak boleh lebih besar dari toDate", 
            [nameof(FromDate), nameof(ToDate)]);
    }
}
