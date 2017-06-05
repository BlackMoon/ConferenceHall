using domain.Common.Query;

namespace domain.Member.Query
{
    public class FindMembersQuery : GetAllQuery
    {
        public string Filter { get; set; }
    }
}
