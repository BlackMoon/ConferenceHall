
namespace host.EmailSystem
{

    public interface IEmailSender
    {
        void Send(string subject, string body, string email);
    }


}
