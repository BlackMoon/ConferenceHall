using System;

namespace host.Mail.Smtp
{
    // тип для связи с smtp сервером
    public class SmtpConnect
    {
        public string NameSender;
        public string EmailSender;
        public string PasswordSender;
        public string SmtpServer;
        public Int32 SmtpPort;
        public bool UseSSL;
    }
}
