using host.EmailSystem;
using MimeKit;
using MailKit.Net.Smtp;
using System;

namespace host.EmailType
{
    public class EmailSender : IEmailSender
    {

        public SmtpConnect SmtpSettings;
        private string _subject;
        private string _body;

        // конструктор
        public EmailSender(string subject, string body)
        {
            _subject = subject;
            _body = body;
        }

        // запуск отсылки по адресатам
        public void EmailSending(string[] Recipients)
        {foreach (var email in Recipients)
            {
                Send(_subject, _body, email);
            }
        }


        // генерация сообщения
        public void Send(string subject, string body, string email)
        {
            var emailMessage = new MimeMessage();

            emailMessage.From.Add(new MailboxAddress(SmtpSettings.NameSender, SmtpSettings.EmailSender));
            emailMessage.To.Add(new MailboxAddress("", email));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = body
            };

            using (var client = new SmtpClient())
            {
                client.Connect(SmtpSettings.SmtpServer, Convert.ToInt32(SmtpSettings.SmtpPort), Convert.ToBoolean(SmtpSettings.UseSSL));
                client.Authenticate(SmtpSettings.EmailSender, SmtpSettings.PasswordSender);
                client.Send(emailMessage);
                client.Disconnect(true);
            }

        }


    }

    // тип для связи с smtp сервером
    public class SmtpConnect
    {
        public string NameSender;
        public string EmailSender;
        public string PasswordSender;
        public string SmtpServer;
        public string SmtpPort;
        public string UseSSL;
    }

}
