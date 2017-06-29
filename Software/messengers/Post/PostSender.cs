using System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace messengers.Post
{
    [SenderKind("Post", "Адрес")]

    // В этом классе хранится информация об почтовом адрессе абонента 
    public class PostSender : IMessageSender
    {
        public IEnumerable<string> Errors { get; set;}


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

