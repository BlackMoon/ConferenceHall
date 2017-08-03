using System.Collections.Generic;

namespace Kit.Core.Web.Middleware.ForceHttps
{
    /// <summary>
    /// Настройки HTTPS REDIRECT
    /// </summary>
    public class ForceHttpsOptions
    {
        /// <summary>
        /// HTTPS port
        /// </summary>
        public int Port { get; set; } = 443;

        /// <summary>
        /// Обязятельные url для проверки 
        /// </summary>
        public IList<string> Paths { get; set; } = new List<string>();
    }
}
