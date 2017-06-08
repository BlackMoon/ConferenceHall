using System;

namespace Messengers.Email.Smtpoptions
{
    // тип для связи с smtp сервером
    public class SmtpOptions
    {
        public SmtpOptions()
        {
            PasswordSender = "Anapa19811981";
            SmtpServer = "smtp.timeweb.ru";
            EmailSender = "fiseyskiysv@aquilon-st.ru";
            NameSender = "Станислав";
            UseSSL = false;
            SmtpPort = 25;
        }

        public string NameSender;
        public string EmailSender;
        public string PasswordSender;
        public string SmtpServer;
        public Int32 SmtpPort;
        public bool UseSSL;
    }
}
