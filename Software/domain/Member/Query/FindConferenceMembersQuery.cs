using domain.Common.Query;

namespace domain.Member.Query
{
    /// <summary>
    /// Запрос. Найти участников конференции
    /// </summary>
    public class FindConferenceMembersQuery: GetAllQuery
    {
        public int ConferenceId { get; set; }
    }
}
