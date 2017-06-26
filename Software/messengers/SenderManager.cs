using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DryIoc;

namespace messengers
{    
    public class SenderManager
    {
        private readonly IContainer _container;

        public SenderManager(IContainer container)
        {
            _container = container;
        }

        public void Send(string subject, string body, params Contact[] contacts)
        {
            List<string> errors = new List<string>();
            
            // фильтр по виду контакта
            ILookup<string, Contact> lookup = (Lookup<string, Contact>)contacts.ToLookup(c => c.Kind, c => c);
            foreach (IGrouping<string, Contact> g in lookup)
            {
                IMessageSender sender = _container.Resolve<IMessageSender>(serviceKey: g.Key);
                if (sender != null)
                {
                    IEnumerable<Contact> values = lookup[g.Key];
                    
                    sender.Send(subject, body, values.Select(c => c.Address).ToArray());

                    if (sender.Errors != null && sender.Errors.Any())
                        errors.AddRange(sender.Errors);
                }
                else
                    errors.Add($"Messenger for type {g.Key} not found.");
            }

            if (errors.Any())
                throw new Exception(string.Join(". ", errors));
        }

        public async Task SendAsync(string subject, string body, params Contact [] contacts)
        {
            List<string> errors = new List<string>();
            
            // фильтр по виду контакта
            ILookup<string, Contact> lookup = (Lookup<string, Contact>)contacts.ToLookup(c => c.Kind, c => c);
            foreach (IGrouping<string, Contact> g in lookup)
            {
                IMessageSender sender = _container.Resolve<IMessageSender>(serviceKey: g.Key, ifUnresolved: IfUnresolved.ReturnDefault);
                if (sender != null)
                {
                    IEnumerable<Contact> values = lookup[g.Key];
                    
                    await sender.SendAsync(subject, body, values.Select(c => c.Address).ToArray());

                    if (sender.Errors != null && sender.Errors.Any())
                        errors.AddRange(sender.Errors);
                }
                else
                    errors.Add($"Messenger for type {g.Key} not found");
            }

            if (errors.Any())
                throw new Exception(string.Join(". ", errors));
        }

    }
}
