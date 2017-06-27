using DryIoc;
using Kit.Core.CQRS.Job;
using messengers.Email;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace messengers
{
    public class RegisterSenders: IStartupJob
    {
        private readonly Assembly _assembly;

        private readonly IConfigurationRoot _configuration;
        private readonly IContainer _container;

        public RegisterSenders(IConfigurationRoot configuration, IContainer container)
        {
            _assembly = GetType().GetTypeInfo().Assembly;

            _configuration = configuration;
            _container = container;
        }

        /// <summary>
        /// IServiceCollection Configure&#lt;TOptions$#gt;(this IServiceCollection services, IConfiguration config)
        /// </summary>
        /// <typeparam name="TOptions"></typeparam>
        /// <param name="config"></param>
        private void Configure<TOptions>(IConfiguration config) where TOptions : class
        {
            _container.UseInstance<IOptionsChangeTokenSource<TOptions>>(new ConfigurationChangeTokenSource<TOptions>(config));
            _container.UseInstance<IConfigureOptions<TOptions>>(new ConfigureFromConfigurationOptions<TOptions>(config));
        }

        public void Run()
        {
            Func <Type, bool> pre = t => t.IsAssignableTo(typeof(IMessageSender));
            
            foreach (Type t in _assembly.GetTypes().Where(pre))
            {
                // Вид мессенджера --> из аттрибута
                var attr = (SenderKindAttribute)t.GetTypeInfo().GetCustomAttribute(typeof(SenderKindAttribute));
                if (attr != null)
                    _container.Register(typeof(IMessageSender), t, serviceKey: attr.MessengerKind.ToLower());
            }

            _container.Register<SenderManager>(reuse: Reuse.Singleton);
            
            #region other sender's registrations
            Configure<SmtpOptions>(_configuration.GetSection("SmtpConnection"));

            #endregion
        }

        public Task RunAsync()
        {
            throw new NotImplementedException();
        }
    }
}
