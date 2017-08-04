using domain.Member;
using domain.Member.Query;
using domain.Ticker.Query;
using DryIoc;
using host.Hubs;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Text.RegularExpressions;

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
                    string info = eventArgs.AdditionalInformation;

                    NameValueCollection nvc = nvc = new NameValueCollection();

                    // строка вида [confid=..&id=..&oldseat=..]
                    foreach (string s in Regex.Split(info, "&"))
                    {
                        string[] pair = Regex.Split(s, "=");
                        if (pair.Length == 2)
                        {
                            nvc.Add(pair[0], pair[1]);
                        }
                    }

                    int confId;
                    string group = nvc["confid"];
                    
                    if (int.TryParse(group, out confId) && Broadcaster.GetVolume(group) > 0)
                    {
                        int memberId;
                        switch (eventArgs.Condition.ToLower())
                        {
                            case "conf_members_change":

                                if (int.TryParse(nvc["id"], out memberId))
                                {
                                    var member = queryDispatcher.Dispatch<FindMemberByIdQuery, Member>(new FindMemberByIdQuery() { Id = memberId });
                                    member.OldSeat = nvc["oldseat"];
                                    // отправить уведомления signalR клиенту(ам)
                                    connectionManager.GetHubContext<Broadcaster>().Clients.Group(group).ConfirmMember(member);
                                }

                                break;

                            case "conf_members_new":

                                if (int.TryParse(nvc["id"], out memberId))
                                {
                                    var member = queryDispatcher.Dispatch<FindMemberByIdQuery, Member>(new FindMemberByIdQuery() { Id = memberId, FullInfo = true });
                                    // отправить уведомления signalR клиенту(ам)
                                    connectionManager.GetHubContext<Broadcaster>().Clients.Group(group).ConfirmMember(member);
                                }

                                break;

                            case "conf_members_del":

                                if (int.TryParse(nvc["id"], out memberId))
                                    connectionManager.GetHubContext<Broadcaster>().Clients.Group(group).UnregisterMember(memberId);

                                break;

                            case "conf_messages_change":

                                var tickers = queryDispatcher.Dispatch<FindTickersQuery, IEnumerable<string>>(new FindTickersQuery() { ConferenceId = confId });
                                // отправить уведомления signalR клиенту(ам)
                                connectionManager.GetHubContext<Broadcaster>().Clients.Group(group).SendTickers(tickers);

                                break;
                        }
                    }
                    
                }
            };
            listener.Start(true);
            #endregion

            host.Run();
        }
    }
}
