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

        public int SmtpPort { get; set; } = 25;

        public bool UseSsl { get; set; }
    }
}
