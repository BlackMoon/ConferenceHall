using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Kit.Core.Web.Middleware.DebugMode
{
    /// <summary>
    /// Проверка debug mode
    /// <para>debug=true</para>
    /// </summary>
    public class DebugModeMiddleware
    {
        private readonly string _envName;
        private readonly IHostingEnvironment _env;
        private readonly RequestDelegate _next;

        public DebugModeMiddleware(RequestDelegate next, IHostingEnvironment env)
        {
            _next = next;
            _env = env;
            _envName = env.EnvironmentName;
        }

        public async Task Invoke(HttpContext context)
        {
            bool debug;
            bool.TryParse(context.Request.Query["debug"], out debug);
            _env.EnvironmentName = debug ? "Development" : _envName;

            await _next.Invoke(context);
        }
    }
}
