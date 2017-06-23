using Dapper;
using domain.SysUser;
using Kit.Core.CQRS.Job;
using Npgsql;
using System;
using System.Threading.Tasks;
using domain.Conference;
using domain.Group;
using domain.Member;

namespace domain.Common.Job
{
    public class DapperTypeMapper : IStartupJob
    {
        public void Run()
        {
            // Should column names like User_Id be allowed to match properties/fields like UserId
            DefaultTypeMap.MatchNamesWithUnderscores = true;

            NpgsqlConnection.MapEnumGlobally<ConfState>();
            NpgsqlConnection.MapEnumGlobally<GroupType>("elgroup_type");
            NpgsqlConnection.MapEnumGlobally<MemberState>();
            NpgsqlConnection.MapEnumGlobally<UserRole>();
        }

        public Task RunAsync()
        {
            throw new NotImplementedException();
        }
    }
}
