using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using Matrix;
using Matrix.Xmpp;
using Matrix.Xmpp.Client;
using System.Threading;

namespace messengers.Jabber
{
    public class JabberSender : IMessageSender
    {

        private readonly JabberOptions _jabberSettings;

        public JabberSender(IOptions<JabberOptions> jabberOptions)
        {
            _jabberSettings = jabberOptions.Value;
        }

        public bool JabberTemplate(string jid)
        {
            // regex для jid: https://stackoverflow.com/questions/1351041/what-is-the-regular-expression-for-validating-jabber-id
            Regex myReg = new Regex(@"^\A([a-z0-9\.\-_\+]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z$");  // создание регулярного выражения проверки jid
            bool result = myReg.IsMatch(jid);
            return result;
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
            Thread.Sleep(500);
            xmppClient.SendPresence(Show.Chat, "Online");
            foreach (var recipient in addresses)
            {
                if (!JabberTemplate(recipient))
                {
                    _errors.Add(recipient + " jid в неизвестном формате");
                }
                else
                {
                    xmppClient.Send(new Message(new Jid(recipient), MessageType.Chat, body));
                }
            }
            xmppClient.Close();
        }


        // псевдоасинхронный метод для поддержания интерфейса, так как нативных методов асинхронности у Matrix.Xmpp не нашел
        public async Task SendAsync(string subject, string body, params string[] addresses)
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
            Thread.Sleep(500);
            xmppClient.SendPresence(Show.Chat, "Online");
            foreach (var recipient in addresses)
            {
                if (!JabberTemplate(recipient))
                {
                    _errors.Add(recipient + " jid в неизвестном формате");
                }
                else
                {
                    await Task.Delay(100);
                    xmppClient.Send(new Message(new Jid(recipient), MessageType.Chat, body));
                }
            }
            xmppClient.Close();
        }

        private IList<string> _errors = new List<string>();

        public IEnumerable<string> Errors => _errors ?? (_errors = new List<string>());


        // по протоколу xmpp мы производим сначала аутентификацию: (A) client AUTH --> server (B) server SUCCESS --> клиент
        // В данной библиотеке Matrix.Xmpp это осуществляется в процедуре XmppClientOnLogin
        // а потом отправку сообщения xmppClient.Send
        // поле Wait и операция Thread.Sleep(500) введено для задержки, чтобы сообщение не отправлялось раньше, чем придет успешный ответ на аутентификацию
        private bool Wait { get; set; }
    }


}

