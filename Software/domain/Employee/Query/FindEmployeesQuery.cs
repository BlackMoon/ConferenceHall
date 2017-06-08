using domain.Common.Query;

namespace domain.Employee.Query
{
    public class FindEmployeesQuery : GetAllQuery
    {

        public string Filter { get; set; }

        public int[] OrganizationIds { get; set; }
    }
}
