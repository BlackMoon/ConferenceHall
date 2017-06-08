using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DryIoc;
using Kit.Core.CQRS.Job;
using System.Reflection;

namespace messengers
{
    public class RegisterSenders: IStartupJob
    {
        private readonly Assembly _assembly;
        
        private readonly IContainer _container;
        public RegisterSenders(IContainer container)
        {
            _assembly = GetType().GetTypeInfo().Assembly;
            _container = container;
        }

        public void Run()
        {
            IDictionary<string, Type> messengers = new Dictionary<string, Type>(StringComparer.OrdinalIgnoreCase);
            Func<Type, bool> pre = t => t.IsAssignableTo(typeof(IMessageSender));
            
            foreach (Type t in _assembly.GetTypes().Where(pre))
            {
                // Вид мессенджера --> из аттрибута
                var attr = (SenderKindAttribute)t.GetTypeInfo().GetCustomAttribute(typeof(SenderKindAttribute));
                if (attr != null)
                {
                    messengers.Add(attr.MessengerKind, t);
                    _container.Register(t);
                }
            }

            _container.Register<SenderManager>(reuse: Reuse.Singleton);
            _container.RegisterInitializer<SenderManager>((m, r) => m.Messengers = messengers );
        }

        public Task RunAsync()
        {
            throw new NotImplementedException();
        }
    }
}
