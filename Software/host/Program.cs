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
        private static readonly string[] Channels = { "conf_members_change", "conf_members_new", "conf_members_del", "conf_messages_change" };

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
                    NameValueCollection nvc;

                    string info = eventArgs.AdditionalInformation;
                    int confId, memberId;
                    
                    switch (eventArgs.Condition.ToLower())
                    {
                        case "conf_members_change":
                        case "conf_members_new":

                            nvc = new NameValueCollection();

                            // строка вида [confid=..&id=...&oldseat=...]
                            foreach (string s in Regex.Split(info, "&"))
                            {
                                string[] pair = Regex.Split(s, "=");
                                if (pair.Length == 2)
                                {
                                    nvc.Add(pair[0], pair[1]);
                                }
                            }

                            info = nvc["confid"];
                            if (int.TryParse(info, out confId) && Broadcaster.GroupCount(info) > 0 && int.TryParse(nvc["id"], out memberId))
                            {
                                var member = queryDispatcher.Dispatch<FindMemberSeatQuery, Member>(new FindMemberSeatQuery() { Id = confId, MemberId = memberId });
                                member.OldSeat = nvc["oldseat"];
                                // отправить уведомления signalR клиенту(ам)
                                connectionManager.GetHubContext<Broadcaster>().Clients.Group(info).ConfirmMember(member);
                            }

                            break;

                        case "conf_members_del":

                            nvc = new NameValueCollection();

                            // строка вида [confid=..&id=]
                            foreach (string s in Regex.Split(info, "&"))
                            {
                                string[] pair = Regex.Split(s, "=");
                                if (pair.Length == 2)
                                {
                                    nvc.Add(pair[0], pair[1]);
                                }
                            }

                            info = nvc["confid"];
                            if (int.TryParse(info, out confId) && Broadcaster.GroupCount(info) > 0 && int.TryParse(nvc["id"], out memberId))
                            {   
                                // отправить уведомления signalR клиенту(ам)
                                connectionManager.GetHubContext<Broadcaster>().Clients.Group(info).DeleteMember(memberId);
                            }

                            break;

                        case "conf_messages_change":
                        
                            if (int.TryParse(info, out confId) && Broadcaster.GroupCount(info) > 0)
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
