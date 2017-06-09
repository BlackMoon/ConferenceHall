
using Kit.Core.CQRS.Query;

namespace domain.Organization.Query
{
    public class FindOrganizationsQuery : IQuery
    {
        public int? OrganizationId { get; set; }
        public string Filter { get; set; }
    }
}
