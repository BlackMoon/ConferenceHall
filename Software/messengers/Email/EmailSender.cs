using System.Collections.Generic;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;

namespace messengers.Email
{
    public class EmailSender : IMessageSender
    {

        private readonly SmtpOptions _smtpSettings;

        
        public EmailSender(IOptions<SmtpOptions> smtpOptions)
        {
            _smtpSettings = smtpOptions.Value;
        }

        public string Recipients;

        // генерация сообщения
        public void Send(string subject, string body)
        {
            var emailMessage = new MimeMessage();

            string[] recipientList = Recipients.Split(';');
            foreach (var email in recipientList)
            {
                emailMessage.To.Add(new MailboxAddress("", email));
            }

            /*emailMessage.From.Add(new MailboxAddress(SmtpSettings.NameSender, SmtpSettings.EmailSender));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = body
            };

            using (var client = new SmtpClient())
            {
                client.Connect(SmtpSettings.SmtpServer, SmtpSettings.SmtpPort, SmtpSettings.UseSSL);
                client.Authenticate(SmtpSettings.EmailSender, SmtpSettings.PasswordSender);
                client.Send(emailMessage);
                client.Disconnect(true);
            }*/

        }

        public async Task SendEmailAsync(string subject, string body)
        {
            var emailMessage = new MimeMessage();


            string[] recipientList = Recipients.Split(';');
            foreach (var email in recipientList)
            {
                emailMessage.To.Add(new MailboxAddress("", email));
            }

            /*emailMessage.From.Add(new MailboxAddress(SmtpSettings.NameSender, SmtpSettings.EmailSender));
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
            }*/
        }

        public IEnumerable<string> Errors { get; set; }
        public void Send(string subject, string body, params string[] addresses)
        {
            throw new System.NotImplementedException();
        }

        public Task SendAsync(string subject, string body, params string[] addresses)
        {
            throw new System.NotImplementedException();
        }
    }

}
