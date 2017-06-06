﻿using System;
using System.Net;
using CacheManager.Core;
using domain.Element;
using DryIoc;
using host.EmailType;
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
        public const string EventDbManagerKey = "EventDbManager";

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
            JsonSerializer serializer = JsonSerializer.Create(new JsonSerializerSettings { ContractResolver = new SignalRContractResolver() });
            services.Add(new ServiceDescriptor(typeof(JsonSerializer),
                         provider => serializer,
                         ServiceLifetime.Transient));

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
            
            // IDbManagers
            string providerName = Configuration["Data:DefaultConnection:ProviderName"];

            string defaultConnectionString = Configuration.GetConnectionString("DefaultConnection");
            container.Register(
                made: Made.Of(() => DbManagerFactory.CreateDbManager(providerName, defaultConnectionString), 
                requestIgnored => string.Empty));

            string eventConnectionString = Configuration.GetConnectionString("EventConnection");
            container.Register(
                made: Made.Of(() => DbManagerFactory.CreateDbManager(providerName, eventConnectionString), requestIgnored => string.Empty), 
                reuse: Reuse.Singleton, 
                serviceKey: EventDbManagerKey);


            // smtp manager
            //SmtpConnect sConnect = new SmtpConnect();
            //sConnect.SmtpPort = Configuration["SmtpConnection:SmtpPort"];
            //sConnect.PasswordSender = Configuration["SmtpConnection:PasswordSender"];
            //sConnect.SmtpServer = Configuration["SmtpConnection:SmtpServer"];
            //sConnect.EmailSender = Configuration["SmtpConnection:EmailSender"];
            //sConnect.NameSender = Configuration["SmtpConnection:NameSender"]; 
            //sConnect.UseSSL = Configuration["SmtpConnection:UseSSL"];

            // пример рассылки по списку
            //String[] listEmail = { "phstas2016@rambler.ru", "fiseyskiysv@aquilon-st.ru" };
            //EmailSender es = new EmailSender("Header letter", "Body letter");
            //es.SmtpSettings = sConnect;
            //es.EmailSending(listEmail);
            
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

            container.Register<SecretStorage>(Reuse.Singleton);
            #endregion

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
