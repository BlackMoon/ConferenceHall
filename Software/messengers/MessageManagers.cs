using System;
using System.Collections.Generic;
using System.Text;

namespace messengers
{
    // 
    public class MessageManagers
    {
        public string TypeMessager;
        public string Message;

        public void Send(string tmessage)
        {
            // сообщение отправляем в необходимый messanger 

            // почта
            string p = tmessage;

            //смс

            string s = tmessage;

            // телеграм

            string t = tmessage;

            //whatsapp

            string w = tmessage;


        }

    }
}
