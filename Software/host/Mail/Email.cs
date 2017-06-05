using host.MessageSystem;

namespace host.EmailType
{
    public class Email : IMessageSystem
    {
        public void Mail(string textmessage)
        {
            string s = textmessage;
        }
        public string[] subscribeList { get; set; }
    }

}
