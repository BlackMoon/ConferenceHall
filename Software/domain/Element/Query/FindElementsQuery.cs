using domain.Common.Query;

namespace domain.Element.Query
{
    public class FindElementsQuery : GetAllQuery
    {
        public string Filter { get; set; }

        public int? GroupId { get; set; }

        public int UserId { get; set; }
    }
}
