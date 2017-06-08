using System.Threading.Tasks;
using Messengers.Email.EmailSend;
using MessengersContact;
using Messengers.Email.Smtpoptions;

namespace MessengerManager
{
    // 
    public class MessageManager
    {
        public string MessageBody;
        public string MessageHeader;

        public MessageManager(string h, string b)
        {
            MessageHeader = h;
            MessageBody = b;
        }

        public void Send()
        {
            // сообщение отправляем в необходимый messanger 

            Contact cont = new Contact();
            SmtpOptions sConnect = new SmtpOptions();
            EmailSender es = new EmailSender();
            es.Recipients = cont.Address;
            es.SmtpSettings = sConnect;
            switch (cont.Kind)
            {
                //асинхронная отправка емаил
                case "Async":
                    Task t = es.SendEmailAsync(MessageHeader, MessageBody);
                    t.Wait();
                    break;
                //синхронная отправка емаил
                case "Sync":
                    es.Send(MessageHeader, MessageBody);
                    break;
                default:
                    break;
            }


            // почта
            //string p = tmessage;

            //смс

            //string s = tmessage;

            // телеграм

            //string t = tmessage;

            //whatsapp

            //string w = tmessage;


        }

    }
}
