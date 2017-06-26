using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;
using System;
using Microsoft.Extensions.Options;

namespace messengers
{
    /// <summary>
    /// Creates IChangeTokens so that IOptionsMonitor gets notified when IConfiguration changes.
    /// </summary>
    /// <typeparam name="TOptions"></typeparam>
    public class ConfigurationChangeTokenSource<TOptions> : IOptionsChangeTokenSource<TOptions>
    {
        private IConfiguration _config;

        /// <summary>
        /// Constructor taking the IConfiguration instance to watch.
        /// </summary>
        /// <param name="config">The configuration instance.</param>
        public ConfigurationChangeTokenSource(IConfiguration config)
        {
            if (config == null)
            {
                throw new ArgumentNullException("config");
            }
            this._config = config;
        }

        /// <summary>
        /// Returns the reloadToken from IConfiguration.
        /// </summary>
        /// <returns></returns>
        public IChangeToken GetChangeToken()
        {
             return this._config.GetReloadToken();
        }
    }
}