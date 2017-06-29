using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Options;
using System.Linq;

namespace messengers.Telephone
{
    [SenderKind("Phone", "Телефон")]
    public class PhoneSender : IMessageSender
    {
        private readonly PhoneOptions _phoneSettings;

        private Lazy<IList<string>> _errors =
           new Lazy<IList<string>>(() => new List<string>());

        public IList<string> ErrorsList
        {
            get { return _errors.Value; }
            set { _errors = new Lazy<IList<string>>(() => value); }
        }

        public IEnumerable<string> Errors => ErrorsList?.AsEnumerable();

        /// <summary>
        /// создание регулярного выражения проверки телефона
        /// </summary>
        public Func<string, bool> AddressValidator { get; set; } = s =>
        {
            Boolean rgx = true;
            return rgx;
        };

        public PhoneSender(IOptions<PhoneOptions> phoneOptions)
        {
            _phoneSettings = phoneOptions.Value;
        }

        // region генерация сообщения
        public void Send(string subject, string body, params string[] addresses)
        {
            if (addresses != null && addresses.Any())
            {
               
            }
            else
                ErrorsList.Add(" Список адресатов не заполнен. ");
        }

        public async Task SendAsync(string subject, string body, params string[] addresses)
        {
            if (addresses != null && addresses.Any())
            {
                await Task.Delay(100);
            }
            else

                ErrorsList.Add(" Список адресатов не заполнен. ");
        }


    }


}

