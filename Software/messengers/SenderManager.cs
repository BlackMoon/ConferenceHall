using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace messengers
{    
    public class SenderManager
    {
        private readonly IServiceProvider _serviceProvider;

        /// <summary>
        /// Словарь соответвий [вид - мессенджер] 
        /// </summary>
        public IDictionary<string, Type> Messengers;

        public SenderManager(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public void Send(string subject, string body, params Contact[] contacts)
        {
            List<string> errors = new List<string>();
            
            // фильтр по виду контакта
            ILookup<string, Contact> lookup = (Lookup<string, Contact>)contacts.ToLookup(c => c.Kind, c => c);
            foreach (IGrouping<string, Contact> g in lookup)
            {
                Type t = null;
                Messengers?.TryGetValue(g.Key, out t);

                if (t != null)
                {
                    IEnumerable<Contact> values = lookup[g.Key];

                    IMessageSender sender = (IMessageSender)_serviceProvider.GetService(t);
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
                Type t = null;
                Messengers?.TryGetValue(g.Key, out t);

                if (t != null)
                {
                    IEnumerable<Contact> values = lookup[g.Key];

                    IMessageSender sender = (IMessageSender)Activator.CreateInstance(t);
                    await sender.SendAsync(subject, body, values.Select(c => c.Address).ToArray());

                    if (sender.Errors != null && sender.Errors.Any())
                        errors.AddRange(sender.Errors);
                }
                else
                    errors.Add($"Messenger for type {g.Key} not found.");
            }

            if (errors.Any())
                throw new Exception(string.Join(". ", errors));
        }

    }
}
