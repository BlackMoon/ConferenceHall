using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace host.Hubs
{
    public interface IBroadcaster
    {
        Task SetConnectionId(string connectionId);
        Task SendTicker(string [] messages);
    }

    public class Broadcaster : Hub<IBroadcaster>
    {
        public override Task OnConnected()
        {
            return base.OnConnected();
        }
    }
}
