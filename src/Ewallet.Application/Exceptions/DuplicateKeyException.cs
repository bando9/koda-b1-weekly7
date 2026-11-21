namespace Ewallet.Application.Exceptions;

public class DuplicateKeyException : Exception
{
    public DuplicateKeyException(string message, Exception? innerException = null) 
        : base(message, innerException) { }
}