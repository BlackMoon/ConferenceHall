using Dapper;
using domain.Common.Query;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;
using System;
using System.Threading.Tasks;

namespace domain.SysUser.Query
{
    public class SysUserQueryHandler : KeyObjectQueryHandler<FindSysUserByIdQuery, SysUser>,         
        IQueryHandler<FindSysUserByLoginQuery, SysUser>        
    {

        public SysUserQueryHandler(IDbManager dbManager) : base(dbManager)
        {
            
        }

        public SysUser Execute(FindSysUserByLoginQuery query)
        {
            throw new NotImplementedException();
        }
        
        public async Task<SysUser> ExecuteAsync(FindSysUserByLoginQuery query)
        {
            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QuerySingleOrDefaultAsync<SysUser>("SELECT u.* FROM conf_hall.users u WHERE u.login = @login", new { login = query.Login });
        }
    }
}
