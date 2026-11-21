namespace Ewallet.Application.Exceptions;

public class DeadlockException : Exception
{
    public DeadlockException(string message, Exception? innerException = null) 
        : base(message, innerException) { }
}