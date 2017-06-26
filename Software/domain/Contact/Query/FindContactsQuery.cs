using Kit.Core.CQRS.Query;

namespace domain.Contact.Query
{
    public class FindContactsQuery: IQuery
    {
        public int EmployeeId { get; set; }
    }
}
