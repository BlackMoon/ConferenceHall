using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace host.Hubs
{
    public interface IBroadcaster
    {
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

        public override Task OnDisconnected(bool stopCalled)
        {
            int confId;
            if (int.TryParse(Context.QueryString["id"], out confId))
                Groups.Remove(Context.ConnectionId, confId.ToString());

            return base.OnDisconnected(stopCalled);
        }
    }
}
