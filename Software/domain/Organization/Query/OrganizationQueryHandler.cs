using domain.Common.Query;
using Kit.Dal.DbManager;

namespace domain.Organization.Query
{
    public class OrganizationQueryHandler: KeyObjectQueryHandler<FindOrganizationByIdQuery, Organization>
    {
        public OrganizationQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }
    }
}
