
using System.Threading.Tasks;

namespace Messengers.Email.EmailSender
{

    public interface IEmailSender
    {
        void Send(string subject, string body);
        Task SendEmailAsync(string subject, string body);
    }


}
