using System;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using CacheManager.Core;
using domain.Element;
using DryIoc;
using host.Hubs;
using host.Security;
using host.Security.TokenProvider;
using Kit.Core;
using Kit.Core.CQRS.Job;
using Kit.Dal.DbManager;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ConfigurationBuilder = Microsoft.Extensions.Configuration.ConfigurationBuilder;

namespace host
{
    public partial class Startup : DryIocStartup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services.AddOptions();
            services.AddSignalR(options => options.Hubs.EnableDetailedErrors = true);
            
            // CORS в режиме debug'a
            services.AddCors(o => o.AddPolicy("AllowAll", b => b.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

            services.Configure<TokenProviderOptions>(Configuration.GetSection("TokenAuthentication"));
            
            services
                .AddMvc(options => 
                {
                    options.ModelBinderProviders.Insert(0, new Kit.Core.Web.Binders.InvariantDecimalModelBinderProvider());
                })
                .AddJsonOptions(option =>
                {
                    option.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                    option.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                });

            services.AddRouting(options => options.LowercaseUrls = true);

            // Add dependencies
            IContainer container = ConfigureDependencies(services, "domain", "Kit.Core", "Kit.Dal", "Kit.Dal.Postgre");
            
            // IDbManager
            container.RegisterInstance(Configuration.GetConnectionString("DefaultConnection"), serviceKey: "ConnectionString");
            container.RegisterInstance(Configuration["Data:DefaultConnection:ProviderName"], serviceKey: "ProviderName");

            Expression<Func<IDbManager>> serviceReturningExpr = () => DbManagerFactory.CreateDbManager(Arg.Of<string>("ProviderName"), Arg.Of<string>("ConnectionString"));
            container.Register(made: Made.Of(serviceReturningExpr, requestIgnored => string.Empty));

            const string broadcastManagerKey = "BroadcastManager";
            container.Register(made: Made.Of(serviceReturningExpr, requestIgnored => string.Empty), reuse:Reuse.Singleton, serviceKey: broadcastManagerKey);

            IConnectionManager connectionManager = container.Resolve<IConnectionManager>();
            container.RegisterInitializer<IDbManager>((m, r) => m.Notification = (sender, args) =>
            {
                connectionManager.GetHubContext<Broadcaster>().Clients.All.SendTicker("as");
            },
            info => Equals(info.ServiceKey, broadcastManagerKey));

            // start listen db events
            IDbManager broadcastDbManager = container.Resolve<IDbManager>(broadcastManagerKey);
            broadcastDbManager.Open();

            // cache managers
            #region object cache
            ICacheManagerConfiguration elCacheConfiguration = Configuration.GetCacheConfiguration("elementCache");

            container.Register(
                reuse: Reuse.Singleton,
                made: Made.Of(() => CacheFactory.FromConfiguration<Element>("elementCache", elCacheConfiguration)));
            
            #endregion

            #region secret cache
            ICacheManagerConfiguration secretCacheConfiguration = Configuration.GetCacheConfiguration("secretCache");

            container.Register(
                reuse: Reuse.Singleton,
                made: Made.Of(() => CacheFactory.FromConfiguration<SecretItem>("secretCache", secretCacheConfiguration)));

            #endregion

            container.Register<SecretStorage>(Reuse.Singleton);

            // Startup Jobs
            IJobDispatcher dispatcher = container.Resolve<IJobDispatcher>(IfUnresolved.ReturnDefault);
            dispatcher?.Dispatch<IStartupJob>();
            
            return container.Resolve<IServiceProvider>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory
                .AddConsole(Configuration.GetSection("Logging"))
                .AddDebug();

            //if (env.IsDevelopment())
            {
                app.UseCors("AllowAll");
            }

            app.Use(async (context, next) =>
            {
                await next();
                if (context.Response.StatusCode == 404)
                    context.Response.Redirect("/?returnUrl=" + context.Request.Path.Value.TrimStart('/'));
            });

            // exception handlers
            app.UseExceptionHandler(builder =>
            {
                builder.Run(async context =>
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.ContentType = "application/json";

                    IExceptionHandlerFeature ex = context.Features.Get<IExceptionHandlerFeature>();
                    if (ex != null)
                    {
                        string error = JsonConvert.SerializeObject(new { ex.Error.Message });
                        await context.Response.WriteAsync(error).ConfigureAwait(false);
                    }
                });
            });

            // authentication
            ConfigureAuth(app);

            app.UseFileServer();
            app.UseMvc();

            app.UseWebSockets();
            app.UseSignalR();
        }
    }
}
