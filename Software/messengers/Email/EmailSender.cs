using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace messengers.Email
{
    [SenderKind("Email")]
    public class EmailSender : AbstractSender
    {
        private readonly SmtpOptions _smtpSettings;
       

        /// <summary>
        /// regex для email: 
        /// https://docs.microsoft.com/en-us/dotnet/standard/base-types/how-to-verify-that-strings-are-in-valid-email-format
        /// </summary>
        public new Func<string, bool> AddressValidator { get; set; } = s =>
        {
            Regex rgx = new Regex(@"^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))" +
                        @"(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-\w]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9]))$");

            return rgx.IsMatch(s);
        };

        public EmailSender(IOptions<SmtpOptions> smtpOptions)
        {
            _smtpSettings = smtpOptions.Value;
        }

        public override void Send(string subject, string body, params string[] addresses)
        {
            if (addresses != null && addresses.Any())
            {
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_smtpSettings.NameSender, _smtpSettings.EmailSender));

                foreach (var email in addresses)
                {
                    if (AddressValidator(email))
                        emailMessage.To.Add(new MailboxAddress("", email));
                    else
                        _errors.Add(email + " почтовый ящик в неизвестном формате");
                }

                if (!string.IsNullOrEmpty(subject))
                    emailMessage.Subject = subject;

                if (!string.IsNullOrEmpty(body))
                {
                    emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
                    {
                        Text = body,
                        ContentType = { Charset = _smtpSettings.Charset }
                    };
                }

                // send
                using (var client = new SmtpClient())
                {
                    try
                    {
                        client.Connect(_smtpSettings.SmtpServer, _smtpSettings.SmtpPort, _smtpSettings.UseSsl);
                        client.Authenticate(_smtpSettings.EmailSender, _smtpSettings.PasswordSender);
                        client.Send(emailMessage);
                    }
                    catch (Exception ex)
                    {
                        _errors.Add(ex.Message);
                    }
                    finally
                    {
                        client.Disconnect(true);
                    }
                }
            }
            else
                _errors.Add(" Список адресатов не заполнен. ");

        }

        public override async Task SendAsync(string subject, string body, params string[] addresses)
        {
            if (addresses != null && addresses.Any())
            {
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_smtpSettings.NameSender, _smtpSettings.EmailSender));
                foreach (var email in addresses)
                {
                    if (AddressValidator(email))
                        emailMessage.To.Add(new MailboxAddress("", email));
                    else
                        _errors.Add(email + " почтовый ящик в неизвестном формате");
                }
                
                if (!string.IsNullOrEmpty(subject))
                    emailMessage.Subject = subject;
             

                if (!string.IsNullOrEmpty(body))
                {
                    emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
                    {
                        Text = body,
                        ContentType = { Charset = _smtpSettings.Charset }
                    };
                }

                // send
                using (var client = new SmtpClient())
                {
                    try
                    {
                        await client.ConnectAsync(_smtpSettings.SmtpServer, _smtpSettings.SmtpPort, _smtpSettings.UseSsl);
                        await client.AuthenticateAsync(_smtpSettings.EmailSender, _smtpSettings.PasswordSender);
                        await client.SendAsync(emailMessage);
                    }
                    catch (Exception ex)
                    {
                        _errors.Add(ex.Message);
                    }
                    finally
                    {
                        client.Disconnect(true);
                    }
                }
            }
            else
                _errors.Add(" Список адресатов не заполнен. ");
            
        }
    }

}
