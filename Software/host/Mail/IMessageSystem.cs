using System;

namespace host.Mail
{

    public interface IMessageSystem
    {
        void Mail(string textmessage);
        string[] subscribeList { get; set; }

    }

    public class Email : IMessageSystem
    {
        public void Mail(string textmessage)
        {
            string s = textmessage;
        }
        public string[] subscribeList { get; set; }
    }


    public class Sms : IMessageSystem
    {
        public void Mail(string textmessage)
        {
            string s = textmessage;
        }
        public string[] subscribeList { get; set; }
    }

    public class Mail
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
