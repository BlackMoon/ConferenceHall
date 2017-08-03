using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Kit.Core.Web.Mvc.Filters
{
    public class SecurityHeadersAttribute : ActionFilterAttribute
    {
        /// <summary>
        /// Директива CSP
        /// </summary>
        public string Directive { get; set; }

        public override void OnResultExecuting(ResultExecutingContext context)
        {
            var result = context.Result;
            if (result is ViewResult)
            {
                if (!context.HttpContext.Response.Headers.ContainsKey("X-Content-Type-Options"))
                    context.HttpContext.Response.Headers.Add("X-Content-Type-Options", "nosniff");
                
                if (!context.HttpContext.Response.Headers.ContainsKey("X-Frame-Options"))
                    context.HttpContext.Response.Headers.Add("X-Frame-Options", "SAMEORIGIN");

                string csp = Directive ?? "default-src 'self'";
                // once for standards compliant browsers
                if (!context.HttpContext.Response.Headers.ContainsKey("Content-Security-Policy"))
                    context.HttpContext.Response.Headers.Add("Content-Security-Policy", csp);
                
                // and once again for IE
                if (!context.HttpContext.Response.Headers.ContainsKey("X-Content-Security-Policy"))
                    context.HttpContext.Response.Headers.Add("X-Content-Security-Policy", csp);
            }
        }
    }
}
