
using Kit.Core.CQRS.Query;

namespace domain.Organization.Query
{
    public class FindOrganizationsQuery : IQuery
    {
        public string Filter { get; set; }
    }
}
