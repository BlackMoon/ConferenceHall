using domain.Common.Query;

namespace domain.Member.Query
{
    public class FindMembersQuery : GetAllQuery
    {
        public int? ConferenceId { get; set; }

        public string Filter { get; set; }

        public int[] OrganizationIds { get; set; }
    }
}
