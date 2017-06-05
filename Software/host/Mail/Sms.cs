using host.MessageSystem;

namespace host.SmsType
{
    public class Sms : IMessageSystem
    {
        public void Mail(string textmessage)
        {
            string s = textmessage;
        }
        public string[] subscribeList { get; set; }
    }
}
