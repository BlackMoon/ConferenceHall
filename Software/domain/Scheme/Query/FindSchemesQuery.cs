using domain.Common.Query;

namespace domain.Scheme.Query
{
    public class FindSchemesQuery : GetAllQuery
    {
        public int HallId { get; set; }
    }
}
