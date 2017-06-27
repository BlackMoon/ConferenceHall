using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace messengers
{
    /// <summary>
    /// Интерфейс message sender'a
    /// </summary>
    public interface IMessageSender
    {
        IEnumerable<string> Errors { get; }

        void Send(string subject, string body, params string[] addresses);

        Task SendAsync(string subject, string body, params string[] addresses);

        Func<string, bool> AddressValidator { get; }
    }
}
