using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace host.Hubs
{
    public interface IBroadcaster
    {
        Task SetConnectionId(string connectionId);
        
        /// <summary>
        /// Отправить сообщения в бегущую строку
        /// </summary>
        /// <param name="tickers"></param>
        /// <returns></returns>
        Task SendTickers(string [] tickers);
    }

    public class Broadcaster : Hub<IBroadcaster>
    {
        public override Task OnConnected()
        {
            int confId;
            if (int.TryParse(Context.QueryString["id"], out confId))
                Groups.Add(Context.ConnectionId, confId.ToString());

            return base.OnConnected();
        }
    }
}
