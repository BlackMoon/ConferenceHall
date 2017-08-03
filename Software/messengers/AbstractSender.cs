using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace messengers
{
    public abstract class AbstractSender : IMessageSender
    {
        // ReSharper disable once InconsistentNaming
        protected IList<string> _errors = new List<string>();

        public IEnumerable<string> Errors => _errors.AsEnumerable();

        public virtual void Send(string subject, string body, params string[] addresses)
        {

        }

        public virtual Task SendAsync(string subject, string body, params string[] addresses)
        {
            return Task.FromResult(0);
        }

        /// <summary>
        /// Делегат проверки адреса
        ///  </summary>
        protected Func<string, bool> AddressValidator = s => true;
    }
}
