using domain.Common.Query;
using Kit.Dal.DbManager;

namespace domain.Employee.Query
{
    public class EmployeeQueryHandler: KeyObjectQueryHandler<FindEmployeByIdQuery, Employee>
    {
        public EmployeeQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }
    }
}
