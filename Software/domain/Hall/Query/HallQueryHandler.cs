using domain.Common.Query;
using Kit.Dal.DbManager;

namespace domain.Hall.Query
{
    public class HallQueryHandler: KeyObjectQueryHandler<FindHallByIdQuery, Hall>
    {
        public HallQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }
    }
}
