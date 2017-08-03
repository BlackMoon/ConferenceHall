using Kit.Core.CQRS.Query;

namespace domain.SysUser.Query
{
    /// <summary>
    /// Запрос. Найти пользователя по login'у
    /// </summary>
    public class FindSysUserByLoginQuery : IQuery
    {
        public string Login { get; set; }
    }
}
