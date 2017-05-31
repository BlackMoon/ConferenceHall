using System.Collections.Generic;
using System.IO;
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
        private static readonly string[] Channels = {"conf_messages_change"};

        public static void Main(string[] args)
        {
            var host = new WebHostBuilder()
                .UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration()
                .UseStartup<Startup>()
                .UseApplicationInsights()
                .Build();

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

                switch (eventArgs?.Condition.ToLower())
                {
                    case "conf_messages_change":

                        int confId;
                        if (int.TryParse(eventArgs.AdditionalInformation, out confId))
                        {
                            var tickers = queryDispatcher.Dispatch<FindTickersByConference, IEnumerable<string>>(new FindTickersByConference() {Id = confId});
                            // отправить signalR клиенту(ам)
                            connectionManager.GetHubContext<Broadcaster>().Clients.Group(confId.ToString()).SendTickers(tickers);
                        }

                        break;
                }

            };
            listener.Start(true);
           

            host.Run();
        }
    }
}
