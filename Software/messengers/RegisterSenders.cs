using DryIoc;
using Kit.Core.CQRS.Job;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using messengers.Email;
using Microsoft.Extensions.DependencyInjection;

namespace messengers
{
    public class RegisterSenders: IStartupJob
    {
        private readonly Assembly _assembly;

        private readonly IConfigurationRoot _configuration;
        private readonly IContainer _container;
        private readonly IServiceCollection _services;

        public RegisterSenders(IConfigurationRoot configuration, IContainer container, IServiceCollection services)
        {
            _assembly = GetType().GetTypeInfo().Assembly;

            _configuration = configuration;
            _container = container;
            _services = services;
        }

        public void Run()
        {
            Func<Type, bool> pre = t => t.IsAssignableTo(typeof(IMessageSender));
            
            foreach (Type t in _assembly.GetTypes().Where(pre))
            {
                // Вид мессенджера --> из аттрибута
                var attr = (SenderKindAttribute)t.GetTypeInfo().GetCustomAttribute(typeof(SenderKindAttribute));
                if (attr != null)
                    _container.Register(typeof(IMessageSender), t, serviceKey: attr.MessengerKind.ToLower());
            }

            _container.Register<SenderManager>(reuse: Reuse.Singleton);

            #region other sender misc
            _services.Configure<SmtpOptions>(_configuration.GetSection("SmtpConnection"));

            #endregion
        }

        public Task RunAsync()
        {
            throw new NotImplementedException();
        }
    }
}
