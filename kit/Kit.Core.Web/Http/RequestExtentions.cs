using Microsoft.AspNetCore.Http;

namespace Kit.Core.Web.Http
{
    public static class RequestExtentions
    {
        /// <summary>
        /// Проверяет, является ли браузер Microsoft Internet Explorer 8.0
        /// </summary>
        public static bool IsIe8(this HttpRequest request)
        {
            string userAgent = request.UserAgent();
            return userAgent.Contains("MSIE 8.0");
        }

        /// <summary>
        /// Получает строку [User-Agent] браузера
        /// </summary>
        public static string UserAgent(this HttpRequest request)
        {
            return request.Headers["User-Agent"];
        }
    }
}
