using host.MessageSystem;
using host.EmailType;
using host.SmsType;


namespace host.SendMessage
{
    public class Send
    {
        static void Main(string[] args)
        {
            var arrEmail = new string[] { "l100@rambler.ru", "ttt@mail.ru" };
            IMessageSystem messageEmail = new Email();
            messageEmail.Mail("Email");
            messageEmail.subscribeList = arrEmail;

            var arrSms = new string[] { "79108769023", "78197862345", "79655881431" };
            IMessageSystem messageSms = new Sms();
            messageSms.Mail("Sms");
            messageEmail.subscribeList = arrSms;
        }
    }
}
