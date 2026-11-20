using System.ComponentModel.DataAnnotations;

namespace Ewallet.Mvc.DTOs;

public class PagedQuery
{
    [Range(1,1_000_000,ErrorMessage ="page harus diantara 1 dan 1.000.000")]
    public int Page {get;set;}  =1;
    [Range(1,100,ErrorMessage ="pageSize harus diantara 1 dan 100")]
    public int PageSize {get;set;}=10;
}

public enum SortDirection{Asc,Desc}