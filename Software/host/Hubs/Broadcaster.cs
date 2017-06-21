using System.Threading.Tasks;
using domain.Member;
using Microsoft.AspNetCore.SignalR;

namespace host.Hubs
{
    public interface IBroadcaster
    {
        /// <summary>
        /// Подтверждение регистрации участника
        /// </summary>
        /// <param name="member"></param>
        /// <returns></returns>
        Task ConfirmMember(Member member);

        /// <summary>
        /// Удаление участника
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task DeleteMember(int id);

        /// <summary>
        /// Отправить сообщения в бегущую строку
        /// </summary>
        /// <param name="tickers"></param>
        /// <returns></returns>
        Task SendTickers(string [] tickers);
    }


    /// <summary>
    /// SignalR hub
    /// </summary>
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
