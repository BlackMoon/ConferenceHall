
namespace Messengers.Email.EmailSender
{

    public interface IEmailSender
    {
        void Send(string subject, string body);
    }


}
