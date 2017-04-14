using domain.Common.Query;
using Kit.Dal.DbManager;

namespace domain.Document.Query
{
    public class DocumentQueryHandler: KeyObjectQueryHandler<FindDocumentByIdQuery, Document>
    {
        public DocumentQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }
    }
}
