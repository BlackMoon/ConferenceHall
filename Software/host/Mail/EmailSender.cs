using host.MessageSystem;

namespace host.EmailType
{
    public class EmailSender : ISender
    {
        public string[] Recipients { get; set; }

        public EmailSender()
        {
            
        }

        public void Send(string subject, string body)
        {
            throw new System.NotImplementedException();
        }
    }

}
