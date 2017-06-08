using System;

namespace Messengers.Email.Smtpoptions
{
    // тип для связи с smtp сервером
    public class SmtpOptions
    {
        public string NameSender;
        public string EmailSender;
        public string PasswordSender;
        public string SmtpServer;
        public Int32 SmtpPort;
        public bool UseSSL;
    }
}
