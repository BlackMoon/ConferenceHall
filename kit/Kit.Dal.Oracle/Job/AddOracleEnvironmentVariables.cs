using System;
using System.Threading.Tasks;
using Kit.Core.CQRS.Job;
using Microsoft.Extensions.Options;

namespace Kit.Dal.Oracle.Job
{
    /// <summary>
    /// Задача - (пере)регистрация в системе [Oracle Environment Variales]
    /// </summary>
    public class AddOracleEnvironmentVariables : IStartupJob
    {
        private readonly OracleEnvironmentConfiguration _options;
        
        public AddOracleEnvironmentVariables(IOptions<OracleEnvironmentConfiguration> options)
        {
            _options = options.Value;
        }

        public void Run()
        {
            if (!string.IsNullOrEmpty(_options.Nls_Lang))
                Environment.SetEnvironmentVariable("NLS_LANG", _options.Nls_Lang);

            if (!string.IsNullOrEmpty(_options.Oracle_Home))
                Environment.SetEnvironmentVariable("ORACLE_HOME", _options.Oracle_Home);

            if (!string.IsNullOrEmpty(_options.Path))
                Environment.SetEnvironmentVariable("PATH", _options.Path + ";" + Environment.GetEnvironmentVariable("PATH"));

            if (!string.IsNullOrEmpty(_options.Tns_Admin))
                Environment.SetEnvironmentVariable("TNS_ADMIN", _options.Tns_Admin);
        }

        public Task RunAsync()
        {
            throw new NotImplementedException();
        }
    }
}
