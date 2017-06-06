using host.SmsSystem;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace host.SmsType
{
    public class SmsSender : ISmsSender
    {

        public Task SendSmsAsync(string number, string message)
        {
            return Task.FromResult(0);
        }
    }
}
