using System;
using System.Threading.Tasks;
using Dapper;
using Kit.Core.CQRS.Job;

namespace domain.Common.Job
{
    public class DapperTypeMapper : IStartupJob
    {
        public void Run()
        {
            // Should column names like User_Id be allowed to match properties/fields like UserId
            DefaultTypeMap.MatchNamesWithUnderscores = true;
        }

        public Task RunAsync()
        {
            throw new NotImplementedException();
        }
    }
}
