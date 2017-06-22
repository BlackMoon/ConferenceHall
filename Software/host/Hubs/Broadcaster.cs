using System.Collections.Concurrent;
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
        private const string QueryKey = "id";

        private static readonly ConcurrentDictionary<string, int> GroupVolume = new ConcurrentDictionary<string, int>();

        /// <summary>
        /// Возвращает кол-во подключенных клиентов группы
        /// </summary>
        /// <param name="group"></param>
        /// <returns></returns>
        public static int GroupCount(string group)
        {
            int cnt;
            GroupVolume.TryGetValue(group, out cnt);
            return cnt;
        } 

        public override Task OnConnected()
        {
            string confId = Context.QueryString[QueryKey];
            if (!string.IsNullOrEmpty(confId))
            {
                Groups.Add(Context.ConnectionId, confId);
                GroupVolume.AddOrUpdate(confId, 1, (k, v) => v + 1);
            }

            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            string confId = Context.QueryString[QueryKey];
            if (!string.IsNullOrEmpty(confId))
            {
                Groups.Remove(Context.ConnectionId, confId);

                int cnt;
                GroupVolume.TryGetValue(confId, out cnt);

                if (cnt == 1)
                    // last client
                    GroupVolume.TryRemove(confId, out cnt);
                else
                    // descrease count
                    GroupVolume.TryUpdate(confId, cnt - 1, cnt);
            }

            return base.OnDisconnected(stopCalled);
        }
    }
}
