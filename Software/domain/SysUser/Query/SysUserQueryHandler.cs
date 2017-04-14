using System.Threading.Tasks;
using domain.Common.Query;
using Dapper;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;

namespace domain.SysUser.Query
{
    public class SysUserQueryHandler : KeyObjectQueryHandler<FindSysUserByIdQuery, SysUser>,         
        IQueryHandler<FindSysUserByLoginQuery, SysUser>        
    {
        private const string SelectSysUser = "SELECT u.* FROM conf_hall.users u";

        public SysUserQueryHandler(IDbManager dbManager) : base(dbManager)
        {  
        }

        public SysUser Execute(FindSysUserByLoginQuery query)
        {
            DbManager.Open(query.ConnectionString);
            return DbManager.DbConnection.QuerySingleOrDefault<SysUser>($"{SelectSysUser} WHERE u.login = @login", new { login = query.Login });
        }
        
        public Task<SysUser> ExecuteAsync(FindSysUserByLoginQuery query)
        {
            DbManager.Open(query.ConnectionString);
            return DbManager.DbConnection.QuerySingleOrDefaultAsync<SysUser>($"{SelectSysUser} WHERE u.login = @login", new { login = query.Login });
        }
    }
}
