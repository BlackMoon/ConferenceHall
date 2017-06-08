using domain.Common.Query;

namespace domain.Scheme.Query
{
    public class FindSchemasQuery : GetAllQuery
    {
        public int? HallId { get; set; }
    }
}
