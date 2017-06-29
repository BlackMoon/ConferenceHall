using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using Matrix;
using Matrix.Xmpp;
using Matrix.Xmpp.Client;
using System.Threading;
using System.Linq;


namespace messengers.Jabber
{
    [SenderKind("Jabber", "XMPP (Jabber)")]
    public class JabberSender : IMessageSender
    {

        private readonly JabberOptions _jabberSettings;

        private IList<string> _errors = new List<string>();
        public IEnumerable<string> Errors => _errors ?? (_errors = new List<string>());


        // по протоколу xmpp мы производим сначала аутентификацию: (A) client AUTH --> server (B) server SUCCESS --> клиент
        // В данной библиотеке Matrix.Xmpp это осуществляется в процедуре XmppClientOnLogin
        // а потом отправку сообщения xmppClient.Send
        // поле Wait и операция Thread.Sleep(500) введено для задержки, чтобы сообщение не отправлялось раньше, чем придет успешный ответ на аутентификацию
        private bool Wait { get; set; }

        /// <summary>
        /// создание регулярного выражения проверки jid: https://stackoverflow.com/questions/1351041/what-is-the-regular-expression-for-validating-jabber-id
        /// </summary>
        public Func<string, bool> AddressValidator { get; set; } = s =>
       {
           Regex rgx = new Regex(@"^\A([a-z0-9\.\-_\+]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z$");  // создание регулярного выражения проверки jid
           return rgx.IsMatch(s);
       };
        public JabberSender(IOptions<JabberOptions> jabberOptions)
        {
            _jabberSettings = jabberOptions.Value;
        }

        private void XmppClientOnLogin(object sender, Matrix.EventArgs e)
        {
            Wait = false;
        }

        private void xmppClient_OnAuthError(object sender, Matrix.Xmpp.Sasl.SaslEventArgs e)
        {
            _errors.Add("Ошибка авторизации: " + e.Failure);
        }

        private void xmppClient_OnError(object sender, Matrix.ExceptionEventArgs e)
        {
            _errors.Add("Ошибка клиента: " + e.Exception);
        }

        // region генерация сообщения
        public void Send(string subject, string body, params string[] addresses)
        {
            if (addresses != null && addresses.Any())
            {
                XmppClient xmppClient = new XmppClient();
                Jid jid = new Jid(_jabberSettings.JabberLogin);
                xmppClient.Password = _jabberSettings.JabberPassword;
                xmppClient.Username = jid.User;
                xmppClient.Compression = true;
                xmppClient.SetXmppDomain(jid.Server);
                xmppClient.StartTls = true;
                xmppClient.OnAuthError += new EventHandler<Matrix.Xmpp.Sasl.SaslEventArgs>(xmppClient_OnAuthError);
                xmppClient.OnError += new EventHandler<ExceptionEventArgs>(xmppClient_OnError);
                xmppClient.Open();
                xmppClient.OnLogin += new EventHandler<Matrix.EventArgs>(XmppClientOnLogin);
                Wait = true;
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
                            _errors.Add(recipient + " jid в неизвестном формате");
                        }
                    }
                }
                xmppClient.Close();
            }
            else
                _errors.Add(" Список адресатов не заполнен. ");
        }


        // псевдоасинхронный метод для поддержания интерфейса, так как нативных методов асинхронности у Matrix.Xmpp не нашел
        public async Task SendAsync(string subject, string body, params string[] addresses)
        {
            if (addresses != null && addresses.Any())
            {
                XmppClient xmppClient = new XmppClient();
                Jid jid = new Jid(_jabberSettings.JabberLogin);
                xmppClient.Password = _jabberSettings.JabberPassword;
                xmppClient.Username = jid.User;
                xmppClient.Compression = true;
                xmppClient.SetXmppDomain(jid.Server);
                xmppClient.StartTls = true;
                xmppClient.OnAuthError += new EventHandler<Matrix.Xmpp.Sasl.SaslEventArgs>(xmppClient_OnAuthError);
                xmppClient.OnError += new EventHandler<ExceptionEventArgs>(xmppClient_OnError);
                xmppClient.Open();
                xmppClient.OnLogin += new EventHandler<Matrix.EventArgs>(XmppClientOnLogin);
                Wait = true;
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
                                var send = xmppClient.Send(new Message(new Jid(recipient), MessageType.Chat, body));
                            }); //отправляем сообщение
                        }
                        else
                        {
                            _errors.Add(recipient + " jid в неизвестном формате");
                        }
                    }
                }
                xmppClient.Close();
            }
            else
                _errors.Add(" Список адресатов не заполнен. ");
        }


    }


}

