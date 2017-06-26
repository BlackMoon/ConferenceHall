using System;

namespace messengers.Email
{
    // тип для связи с smtp сервером
    public class SmtpOptions
    {
        public string NameSender { get; set; }

        public string EmailSender { get; set; }

        public string PasswordSender { get; set; }

        public string SmtpServer { get; set; }

        public Int32 SmtpPort { get; set; }

        public bool UseSsl { get; set; }
    }
}
