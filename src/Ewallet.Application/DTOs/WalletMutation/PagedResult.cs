namespace Ewallet.Application.DTOs;

public sealed class PagedResult<T>
{
    public IReadOnlyList<T> Items {get; set;} =[];
    public int Page {get;set;}
    public int PageSize {get;set;}
    public int TotalCount {get;set;}
    public int TotalPages {get;set;}

    public static PagedResult<T> Create (IReadOnlyList<T> Items, int page, int pageSize, int totalCount) => new()
    {
        Items = Items,
        Page=page,
        PageSize=pageSize,
        TotalCount=totalCount,
        TotalPages=(int) Math.Ceiling(totalCount/(double)pageSize)
    };
}
