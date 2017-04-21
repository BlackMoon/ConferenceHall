using Dapper;
using domain.Common.Query;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;
using System.Threading.Tasks;

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
            DbManager.Open();
            return DbManager.DbConnection.QuerySingleOrDefault<SysUser>($"{SelectSysUser} WHERE u.login = @login", new { login = query.Login });
        }
        
        public Task<SysUser> ExecuteAsync(FindSysUserByLoginQuery query)
        {
            DbManager.OpenAsync();
            return DbManager.DbConnection.QuerySingleOrDefaultAsync<SysUser>($"{SelectSysUser} WHERE u.login = @login", new { login = query.Login });
        }
    }
}
