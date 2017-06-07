using System.Threading.Tasks;
using host.EmailSystem;
using MimeKit;
using MailKit.Net.Smtp;
using host.Mail.Smtp;

namespace host.EmailType
{
    public class EmailSender : IEmailSender
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
    }

}
