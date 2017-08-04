using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace messengers
{
    public abstract class AbstractSender : IMessageSender
    {
        private IList<string> _innerErrors;

        protected IList<string> InnerErrors => _innerErrors ?? (_innerErrors = new List<string>());

        public IEnumerable<string> Errors => _innerErrors;

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
