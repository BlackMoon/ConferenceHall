using domain.Common.Query;

namespace domain.Member.Query
{
    /// <summary>
    /// Запрос. Поиск участников
    /// </summary>
    public class FindMembersQuery : GetAllQuery
    {
        public int? ConferenceId { get; set; }

        /// <summary>
        /// id организаций
        /// </summary>
        public int[] OrganizationIds { get; set; }
    }
}
