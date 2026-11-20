using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Mvc.Middlewares;

public sealed class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;
    private readonly IProblemDetailsService _problemDetailsService;

    public GlobalExceptionHandler(
        ILogger<GlobalExceptionHandler> logger,
        IProblemDetailsService problemDetailsService)
    {
        _logger = logger;
        _problemDetailsService = problemDetailsService;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        
        if (exception is OperationCanceledException && httpContext.RequestAborted.IsCancellationRequested)
        {
            return false;
        }

        var (statusCode, title, detail) = MapException(exception);

        
        if (statusCode >= StatusCodes.Status500InternalServerError)
        {
            _logger.LogError(
                exception,
                "Unhandled request error. Method: {Method}, Path: {Path}, TraceId: {TraceId}",
                httpContext.Request.Method, httpContext.Request.Path, httpContext.TraceIdentifier);
        }
        else
        {
            _logger.LogWarning(
                "Handled client/domain error ({StatusCode}): {Message}. Method: {Method}, Path: {Path}, TraceId: {TraceId}",
                statusCode, exception.Message, httpContext.Request.Method, httpContext.Request.Path, httpContext.TraceIdentifier);
        }

        httpContext.Response.StatusCode = statusCode;

        var problem = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = detail,
            Instance = httpContext.Request.Path
        };

        problem.Extensions["traceId"] = httpContext.TraceIdentifier;

        var written = await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            ProblemDetails = problem,
            Exception = exception
        });

        if (!written)
        {
            httpContext.Response.ContentType = "text/plain; charset=utf-8";
            await httpContext.Response.WriteAsync(detail, cancellationToken);
        }

        return true;
    }

    private static (int StatusCode, string Title, string Detail) MapException(Exception exception)
    {
        return exception switch
        {
            
            ArgumentNullException or ArgumentException or FormatException => (
                StatusCodes.Status400BadRequest,
                "Bad Request",
                exception.Message
            ),
            
            KeyNotFoundException => (
                StatusCodes.Status404NotFound,
                "Not Found",
                exception.Message
            ),

            DbUpdateConcurrencyException => (
                StatusCodes.Status409Conflict,
                "Concurrency Conflict",
                "Saldo baru saja berubah karena transaksi lain. Silakan coba lagi."
            ),

            InvalidOperationException => (
                StatusCodes.Status409Conflict,
                "Business Rule Violation",
                exception.Message
            ),

            DbUpdateException => (
                StatusCodes.Status409Conflict,
                "Database Conflict",
                "Data bertabrakan dengan aturan database atau sudah terdaftar sebelumnya."
            ),

            _ => (
                StatusCodes.Status500InternalServerError,
                "Internal Server Error",
                "Ada masalah di server bang, silakan coba beberapa saat lagi."
            )
        };
    }
}