using domain.Common.Query;

namespace domain.Member.Query
{
    /// <summary>
    /// Запрос. Найти место участника
    /// </summary>
    public class FindMemberSeatQuery : FindMemberByIdQuery
    {
        public int MemberId { get; set; }
    }
}
