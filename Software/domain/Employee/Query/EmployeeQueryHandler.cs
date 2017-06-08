using System.Collections.Generic;
using System.Threading.Tasks;
using domain.Common.Query;
using Dapper;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;

namespace domain.Employee.Query
{
    public class EmployeeQueryHandler : 
        KeyObjectQueryHandler<FindEmployeeByIdQuery, Employee>,
        IQueryHandler<FindEmployeesQuery, IEnumerable<Employee>>
    {

        public EmployeeQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public IEnumerable<Employee> Execute(FindEmployeesQuery query)
        {
            throw new System.NotImplementedException();
        }

        public async Task<IEnumerable<Employee>> ExecuteAsync(FindEmployeesQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.employees e")
                .Column("e.id")
                .Column("e.name")
                .Column("e.position")
                .Column("o.name job")
                .Column("u.role")
                .Column("u.locked")
                .Join("conf_hall.organizations o ON o.id = e.org_id")
                .LeftJoin("conf_hall.users u ON u.employee_id = e.id")
                .OrderBy("lower(e.name)");

            DynamicParameters param = new DynamicParameters();

            // может задаваться фильтр
            if (!string.IsNullOrEmpty(query.Filter))
            {
                sqlBuilder.Where("lower(e.name) LIKE lower(@filter)");
                param.Add("filter", query.Filter + "%");
            }

            // фильтр по организациям
            if (query.OrganizationIds != null)
            {
                sqlBuilder.Where("c.org_id = ANY(@orgIds)");
                param.Add("orgIds", query.OrganizationIds);
            }

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QueryAsync<Employee>(sqlBuilder.ToString(), param);
        }
    }
}
