using System;

namespace messengers.Jabber
{
    public class JabberOptions
    {
        // тип для отправки в jabbber клиент

        /// <summary>
        /// Учетная запись (jid) jabber с которой отправляется сообщение
        /// </summary>
        public string JabberLogin { get; set; }

        /// <summary>
        /// Пароль к учетной запиcи jabber с которой отправляется сообщение
        /// </summary>
        public string JabberPassword { get; set; }

        /// <summary>
        /// Задержка в милисекундах между процессом авторизации и отправки сообщения
        /// протоколом xmpp
        /// </summary>
        public Int32 JabberDelay { get; set; }

    }
}
