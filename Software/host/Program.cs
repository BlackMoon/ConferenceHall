using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Text.RegularExpressions;
using domain.Member;
using domain.Member.Query;
using domain.Screen.Query;
using DryIoc;
using host.Hubs;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace host
{
    public class Program
    {
        private static readonly string[] Channels = { "conf_members_change", "conf_messages_change" };

        public static void Main(string[] args)
        {
            var host = new WebHostBuilder()
                .UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration()
                .UseStartup<Startup>()
                .UseApplicationInsights()
                .Build();

            #region listener
            IContainer container = host.Services.GetService<IContainer>();
            IConnectionManager connectionManager = container.Resolve<IConnectionManager>();
            IDbManager dbManager = container.Resolve<IDbManager>(serviceKey: Startup.EventDbManagerKey);
            IQueryDispatcher queryDispatcher = container.Resolve<IQueryDispatcher>();

            Kit.Dal.NotificationListener listener = Kit.Dal.NotificationListener.Instance;
            listener.Channels = Channels;
            listener.DbManager = dbManager;
            listener.Notification = (o, e) =>
            {
                Npgsql.NpgsqlNotificationEventArgs eventArgs = e as Npgsql.NpgsqlNotificationEventArgs;

                if (eventArgs != null)
                {
                    string info = eventArgs.AdditionalInformation;
                    int confId;

                    switch (eventArgs.Condition.ToLower())
                    {
                        case "conf_members_change":

                            NameValueCollection nvc = new NameValueCollection();

                            // строка вида [confid=..&memberid=...]
                            foreach (string s in Regex.Split(info, "&"))
                            {
                                string[] pair = Regex.Split(s, "=");
                                if (pair.Length == 2)
                                {
                                    nvc.Add(pair[0], pair[1]);
                                }
                            }
                        
                            int memberId;
                            info = nvc["confid"];
                            if (int.TryParse(info, out confId) && int.TryParse(nvc["memberid"], out memberId))
                            {
                                var seat = queryDispatcher.Dispatch<FindMemberSeat, Member>(new FindMemberSeat() { Id = confId });
                                // отправить уведомления signalR клиенту(ам)
                                connectionManager.GetHubContext<Broadcaster>().Clients.Group(info).ConfirmMember(seat);
                            }

                            break;

                        case "conf_messages_change":
                        
                            if (int.TryParse(info, out confId))
                            {
                                var tickers = queryDispatcher.Dispatch<FindTickersByConference, IEnumerable<string>>(new FindTickersByConference() {Id = confId});
                                // отправить уведомления signalR клиенту(ам)
                                connectionManager.GetHubContext<Broadcaster>().Clients.Group(info).SendTickers(tickers);
                            }

                            break;
                    }
                }
            };
            listener.Start(true);
            #endregion

            host.Run();
        }
    }
}
