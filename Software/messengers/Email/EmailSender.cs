using Messengers.Email.EmailSender;
using MimeKit;
using MailKit.Net.Smtp;
using Messengers.Email.Smtpoptions;
using System.Threading.Tasks;

namespace Messengers.Email.EmailSend
{
    public class EmailSender : IEmailSender
    {

        public SmtpOptions SmtpSettings;


        // конструктор
        public EmailSender()
        {

        }

        public string[] Recipients;

        // генерация сообщения
        public void Send(string subject, string body)
        {
            var emailMessage = new MimeMessage();

            foreach (var email in Recipients)
            {
                emailMessage.To.Add(new MailboxAddress("", email));
            }

            emailMessage.From.Add(new MailboxAddress(SmtpSettings.NameSender, SmtpSettings.EmailSender));
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
            }

        }

        public async Task SendEmailAsync(string subject, string body)
        {
            var emailMessage = new MimeMessage();

            foreach (var email in Recipients)
            {
                emailMessage.To.Add(new MailboxAddress("", email));
            }

            emailMessage.From.Add(new MailboxAddress(SmtpSettings.NameSender, SmtpSettings.EmailSender));
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


    }

}
