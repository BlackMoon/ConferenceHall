using Kit.Core.Web.Http;
using Kit.Core.Web.Http.Ajax;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Kit.Core.Web.Mvc.Filters
{
    /// <summary>
    /// Фильтр для обработки глобальных исключений
    /// </summary>
    public class GlobalExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            Microsoft.AspNetCore.Http.HttpRequest request = context.HttpContext.Request;
            if (request.IsAjax())
            {
                context.Result = new ObjectResult(new { context.Exception.Message, context.Exception.StackTrace }) { StatusCode = 500 };

                //Для Internet Explorer 8 заменяет contentType = text / html вместо application/ json
                if (request.IsIe8())
                    context.HttpContext.Response.ContentType = "text/html";
            }
        }
    }
}
