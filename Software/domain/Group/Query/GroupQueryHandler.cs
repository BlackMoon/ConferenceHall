using domain.Common.Query;
using Kit.Dal.DbManager;

namespace domain.Group.Query
{
    public class GroupQueryHandler : KeyObjectQueryHandler<FindGroupByIdQuery, Group>
    {
        public GroupQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }
    }
}
