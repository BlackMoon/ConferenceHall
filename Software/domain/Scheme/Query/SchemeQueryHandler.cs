using domain.Common.Query;
using Kit.Dal.DbManager;

namespace domain.Scheme.Query
{
    public class SchemeQueryHandler : KeyObjectQueryHandler<FindSchemeByIdQuery, Scheme>
    {
        public SchemeQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }
    }
}
