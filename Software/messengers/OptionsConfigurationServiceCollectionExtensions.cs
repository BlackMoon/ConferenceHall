using Microsoft.Extensions.Options;
using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

namespace messengers
{
    /// <summary>
    /// Extension methods for adding configuration related options services to the DI container.
    /// </summary>
    public static class OptionsConfigurationServiceCollectionExtensions
    {
        /// <summary>
        /// Registers a configuration instance which TOptions will bind against.
        /// </summary>
        /// <typeparam name="TOptions">The type of options being configured.</typeparam>
        /// <param name="services">The <see cref="T:Microsoft.Extensions.DependencyInjection.IServiceCollection" /> to add the services to.</param>
        /// <param name="config">The configuration being bound.</param>
        /// <returns>The <see cref="T:Microsoft.Extensions.DependencyInjection.IServiceCollection" /> so that additional calls can be chained.</returns>
        public static IServiceCollection Configure<TOptions>(this IServiceCollection services, IConfiguration config)
        where TOptions : class
         {
            if (services == null)
            {
                throw new ArgumentNullException("services");
            }
            if (config == null)
            {
                throw new ArgumentNullException("config");
            }
            ServiceCollectionServiceExtensions.AddSingleton<IOptionsChangeTokenSource<TOptions>>(services, new ConfigurationChangeTokenSource<TOptions>(config));
            return ServiceCollectionServiceExtensions.AddSingleton<IConfigureOptions<TOptions>>(services, new ConfigureFromConfigurationOptions<TOptions>(config));
         }
    }
}