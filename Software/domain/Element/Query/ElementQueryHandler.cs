using domain.Common.Query;
using Kit.Dal.DbManager;

namespace domain.Element.Query
{
    public class ElementQueryHandler : KeyObjectQueryHandler<FindObjectByIdQuery, Element>
    {
        public ElementQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }
    }
}
