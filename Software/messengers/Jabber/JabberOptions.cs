using System;

namespace messengers.Jabber
{
    public class JabberOptions
    {
        // тип для отправки в jabbber клиент
        public string JabberLogin { get; set; }

        public string JabberPassword { get; set; }

        public Int32 JabberDelay { get; set; }

    }
}
