
namespace host.MessageSystem
{

    public interface IMessageSystem
    {
        void Mail(string textmessage);
        string[] subscribeList { get; set; }

    }


}
