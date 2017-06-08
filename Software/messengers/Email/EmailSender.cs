using System.Collections.Generic;
using System.Threading.Tasks;
using host.Mail.Smtp;
using MailKit.Net.Smtp;
using MimeKit;

namespace messengers.Email
{
    [SenderKind("Email")]
    public class EmailSender : IMessageSender
    {

        public SmtpConnect SmtpSettings;


        // конструктор
        public EmailSender()
        {

        }

        public string Recepients;

        // генерация сообщения
        public async Task Send(string subject, string body)
        {
            var emailMessage = new MimeMessage();

            emailMessage.From.Add(new MailboxAddress(SmtpSettings.NameSender, SmtpSettings.EmailSender));
            emailMessage.To.Add(new MailboxAddress("", Recepients));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = body
            };

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync(SmtpSettings.SmtpServer, SmtpSettings.SmtpPort, SmtpSettings.UseSSL);
                await client.AuthenticateAsync(SmtpSettings.EmailSender, SmtpSettings.PasswordSender);
                await client.SendAsync(emailMessage);
                await client.DisconnectAsync(true);
            }

        }

        public void Send(string subject, string body, string[] email)
        {
            throw new System.NotImplementedException();
        }

        public IEnumerable<string> Errors { get; }
        public Task SendAsync(string subject, string body, params string[] addresses)
        {
            throw new System.NotImplementedException();
        }
    }

}
