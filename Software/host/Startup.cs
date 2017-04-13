using System;
using System.Net;
using System.Security.Claims;
using DryIoc;
using Kit.Core;
using Kit.Core.CQRS.Job;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Internal.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace host
{
    public class Startup : DryIocStartup
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

            services
                .AddMvc()
                .AddJsonOptions(option =>
                {
                    option.SerializerSettings.DefaultValueHandling = DefaultValueHandling.Ignore;
                    option.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                    option.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                });

            services.AddRouting(options => options.LowercaseUrls = true);

            // Add dependencies
            IContainer container = ConfigureDependencies(services, "domain", "Kit.Core", "Kit.Dal", "Kit.Dal.Postgre");

            // IDbManager
            /*container.RegisterDelegate(delegate (IResolver r)
            {
                HttpContext httpContext = r.Resolve<IHttpContextAccessor>().HttpContext;
                ConnectionOptions options = r.Resolve<IOptions<ConnectionOptions>>().Value;

                ClaimsPrincipal cp = httpContext.User;
                string pswd = "postgres",//cp.FindFirst(ConnectionClaimTypes.Password)?.Value,
                    userId = "postgres";// cp.Identity.Name;                       

                return $"User Id={userId};Password={pswd};Host={options.Server};Port={options.Port};Database={options.DataSource};Pooling=true;";

            }, serviceKey: "ConnectionString");*/

            container.RegisterInstance(Configuration["Data:DefaultConnection:ProviderName"], serviceKey: "ProviderName");

            // dbManager для текущего пользователя (веб)
            //container.Register(
              //  made: Made.Of(() => DbManagerFactory.CreateDbManager(Arg.Of<string>("ProviderName"), Arg.Of<string>("ConnectionString")), requestIgnored => string.Empty));

            // Startup Jobs
            IJobDispatcher dispatcher = container.Resolve<IJobDispatcher>(IfUnresolved.ReturnDefault);
            dispatcher?.Dispatch<IStartupJob>();

            return container.Resolve<IServiceProvider>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

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

            app.UseFileServer();
            app.UseMvc();
        }
    }
}
