using Microsoft.AspNetCore.Builder;

namespace Kit.Core.Web.Middleware.DebugMode
{
    public static class DebugModetMiddlewareExtentions
    {
        public static IApplicationBuilder CheckDebugMode(this IApplicationBuilder app)
        {
            return app.UseMiddleware<DebugModeMiddleware>();
        }
    }
}
