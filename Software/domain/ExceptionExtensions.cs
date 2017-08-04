using System;
using Npgsql;

namespace domain
{
    /// <summary>
    /// Расширения для PostgresException
    /// </summary>
    public static class ExceptionExtensions
    {
        public static string GetMessage(this Exception ex)
        {
            PostgresException exception = ex as PostgresException;
            return (exception != null) ? exception.MessageText : ex.Message;
        }

        public static string GetDetail(this Exception ex)
        {
            PostgresException exception = ex as PostgresException;
            return exception?.Detail;
        }
    }
}
