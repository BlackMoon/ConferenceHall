using Matrix;
using Matrix.Xmpp;
using Matrix.Xmpp.Client;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;


namespace messengers.Jabber
{
    [SenderKind("Jabber", "XMPP (Jabber)")]
    public class JabberSender : AbstractSender
    {
        private readonly JabberOptions _jabberSettings;


        // по протоколу xmpp мы производим сначала аутентификацию: (A) client AUTH --> server (B) server SUCCESS --> клиент
        // В данной библиотеке Matrix.Xmpp это осуществляется в процедуре XmppClientOnLogin
        // операция Thread.Sleep(500) введено для задержки, чтобы сообщение не отправлялось раньше, чем придет успешный ответ на аутентификацию

        /// <summary>
        /// создание регулярного выражения проверки jid: https://stackoverflow.com/questions/1351041/what-is-the-regular-expression-for-validating-jabber-id
        /// </summary>
        protected new Func<string, bool> AddressValidator { get; } = s =>
        {
            // создание регулярного выражения проверки jid
            Regex rgx = new Regex(@"^\A([a-z0-9\.\-_\+]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z$");
            return rgx.IsMatch(s);
        };

        public JabberSender(IOptions<JabberOptions> jabberOptions)
        {
            _jabberSettings = jabberOptions.Value;
        }

        private void XmppClient_OnAuthError(object sender, Matrix.Xmpp.Sasl.SaslEventArgs e)
        {
            InnerErrors.Add("Ошибка авторизации: " + e.Failure);
        }

        private void XmppClient_OnError(object sender, Matrix.ExceptionEventArgs e)
        {
            InnerErrors.Add("Ошибка клиента: " + e.Exception);
        }

        // region генерация сообщения
        public override void Send(string subject, string body, params string[] addresses)
        {
            if (addresses != null && addresses.Any())
            {
                Jid jid = new Jid(_jabberSettings.JabberLogin);

                XmppClient xmppClient = new XmppClient
                {
                    Password = _jabberSettings.JabberPassword,
                    Username = jid.User,
                    Compression = true
                };
                
                xmppClient.SetXmppDomain(jid.Server);
                xmppClient.StartTls = true;
                xmppClient.OnAuthError += XmppClient_OnAuthError;
                xmppClient.OnError += XmppClient_OnError;
                xmppClient.Open();

                Thread.Sleep(_jabberSettings.JabberDelay);
                xmppClient.SendPresence(Show.Chat, "Online");

                if (!string.IsNullOrEmpty(body))
                {
                    foreach (var recipient in addresses)
                    {
                        if (AddressValidator(recipient))
                        {
                            xmppClient.Send(new Message(new Jid(recipient), MessageType.Chat, body));
                        }
                        else
                        {
                            InnerErrors.Add(recipient + " jid в неизвестном формате");
                        }
                    }
                }
                xmppClient.Close();
            }
            else
                InnerErrors.Add(" Список адресатов не заполнен. ");
        }


        // псевдоасинхронный метод для поддержания интерфейса, так как нативных методов асинхронности у Matrix.Xmpp не нашел
        public override async Task SendAsync(string subject, string body, params string[] addresses)
        {
            if (addresses != null && addresses.Any())
            {
                Jid jid = new Jid(_jabberSettings.JabberLogin);

                XmppClient xmppClient = new XmppClient
                {
                    Password = _jabberSettings.JabberPassword,
                    Username = jid.User,
                    Compression = true
                };

                xmppClient.SetXmppDomain(jid.Server);
                xmppClient.StartTls = true;
                xmppClient.OnAuthError += XmppClient_OnAuthError;
                xmppClient.OnError += XmppClient_OnError;
                xmppClient.Open();

                Thread.Sleep(_jabberSettings.JabberDelay);
                xmppClient.SendPresence(Show.Chat, "Online");

                if (!string.IsNullOrEmpty(body))
                {
                    foreach (var recipient in addresses)
                    {
                        if (AddressValidator(recipient))
                        {
                            await Task.Run(() =>
                            {
                                xmppClient.Send(new Message(new Jid(recipient), MessageType.Chat, body));
                            }); 
                        }
                        else
                        {
                            InnerErrors.Add(recipient + " jid в неизвестном формате");
                        }
                    }
                }
                xmppClient.Close();
            }
            else
                InnerErrors.Add(" Список адресатов не заполнен. ");
        }
    }
}