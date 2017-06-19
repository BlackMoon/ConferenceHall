using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
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

        public bool EmailTemplate(string email)
        {
            // regex для email: https://docs.microsoft.com/en-us/dotnet/standard/base-types/how-to-verify-that-strings-are-in-valid-email-format
            Regex myReg = new Regex(@"^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))" +
                @"(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-\w]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9]))$");  // создание регулярного выражения проверки электронной почты
            bool result = myReg.IsMatch(email); 
            return result;
        }

        // генерация сообщения
        public void Send(string subject, string body, params string[] addresses)
        {
            var emailMessage = new MimeMessage();

           foreach (var email in addresses)
            {
              if (!EmailTemplate(email)) {_errors.Add(email + " почтовый ящик в неизвестном формате");}
              else {emailMessage.To.Add(new MailboxAddress("", email));}
            }

            emailMessage.From.Add(new MailboxAddress(_smtpSettings.NameSender, _smtpSettings.EmailSender));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = body
            };

            using (var client = new SmtpClient())
            {
                try
                {
                    client.Connect(_smtpSettings.SmtpServer, _smtpSettings.SmtpPort, _smtpSettings.UseSSL);
                    client.Authenticate(_smtpSettings.EmailSender, _smtpSettings.PasswordSender);
                    client.Send(emailMessage);
                    client.Disconnect(true);
                }

                catch (Exception ex)
                {
                    _errors.Add(ex.Message);
                }
            }

        }

        public async Task SendAsync(string subject, string body, params string[] addresses)
        {
            var emailMessage = new MimeMessage();


            foreach (var email in addresses)
            {
                if (!EmailTemplate(email)) { _errors.Add(email + " почтовый ящик в неизвестном формате"); }
                else { emailMessage.To.Add(new MailboxAddress("", email)); }
            }

            emailMessage.From.Add(new MailboxAddress(_smtpSettings.NameSender, _smtpSettings.EmailSender));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = body
            };

            using (var client = new SmtpClient())
            {
                try
                {
                    await client.ConnectAsync(_smtpSettings.SmtpServer, _smtpSettings.SmtpPort, _smtpSettings.UseSSL);
                    await client.AuthenticateAsync(_smtpSettings.EmailSender, _smtpSettings.PasswordSender);
                    await client.SendAsync(emailMessage);

                    await client.DisconnectAsync(true);
                }
                catch (Exception ex)
                {
                    _errors.Add(ex.Message);
                }
            }
        }

        private IList<string> _errors = new List<string>();

        public IEnumerable<string> Errors => _errors ?? (_errors = new List<string>());

    }

}
