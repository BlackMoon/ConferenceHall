using Kit.Core.CQRS.Query;

namespace domain.AdkUser.Query
{
    /// <summary>
    /// Запрос. Найти пользователя по login'у
    /// </summary>
    public class FindUserByLoginQuery : IQuery
    {
        public string ConnectionString { get; set; }
        public string Login { get; set; }
    }
}
