using System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace messengers.Phone
{
    [SenderKind("Phone", "Телефон")]
    public class PhoneSender : IMessageSender
    {
        public IEnumerable<string> Errors { get;  }


        public Func<string, bool> AddressValidator { get; set; } = s => true;

     
        public void Send(string subject, string body, params string[] addresses)
        {
            
        }

        public Task SendAsync(string subject, string body, params string[] addresses)
        {
            return Task.FromResult(0);
        }
    }
}

