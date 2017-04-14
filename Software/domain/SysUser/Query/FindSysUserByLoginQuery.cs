using Kit.Core.CQRS.Query;
using domain.Common.Query;

namespace domain.SysUser.Query
{
    /// <summary>
    /// Запрос. Найти пользователя по login'у
    /// </summary>
    public class FindSysUserByLoginQuery : IQuery
    {
        public string ConnectionString { get; set; }
        public string Login { get; set; }
    }
}
