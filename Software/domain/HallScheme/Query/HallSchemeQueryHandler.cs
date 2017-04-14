using domain.Common.Query;
using Kit.Dal.DbManager;

namespace domain.HallScheme.Query
{
    public class HallSchemeQueryHandler: KeyObjectQueryHandler<FindHallSchemeByIdQuery, HallScheme>
    {
        public HallSchemeQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }
    }
}
