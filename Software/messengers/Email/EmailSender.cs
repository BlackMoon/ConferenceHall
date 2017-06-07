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
        public void Send(string subject, string body)
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
                client.Connect(SmtpSettings.SmtpServer, SmtpSettings.SmtpPort, SmtpSettings.UseSSL);
                client.Authenticate(SmtpSettings.EmailSender, SmtpSettings.PasswordSender);
                client.Send(emailMessage);
                client.Disconnect(true);
            }

        }


    }

}
