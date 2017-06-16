using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using domain.Common.Query;
using Dapper;

using Kit.Dal.DbManager;

namespace domain.Employee.Query
{
    public class EmployeeQueryHandler :
        KeyObjectQueryHandler<FindEmployeeByIdQuery, Employee>
    {

        public EmployeeQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public override async Task<Employee> ExecuteAsync(FindEmployeeByIdQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.employees e")
                .Column("e.*")
                .Column("c.id")
                .Column("c.active")
                .Column("c.address")
                .Column("c.kind")
                .Column("u.locked")
                .Column("u.login")
                .Column("u.role")
                .LeftJoin("conf_hall.contacts c ON c.employee_id = e.id")
                .LeftJoin("conf_hall.users u ON u.employee_id = e.id")
                .Where("e.id = @id");

            Employee prev = null;
            Func<Employee, Contact, Employee> map = (e, c) =>
            {
                if (prev != null && prev.Id == e.Id)
                {
                    if (c != null)
                        prev.Contacts.Add(c);

                    return null;
                }

                prev = e;
                prev.Contacts = new List<Contact>();

                if (c != null)
                    prev.Contacts.Add(c);

                return e;
            };

            await DbManager.OpenAsync();
            var employees = await DbManager.DbConnection.QueryAsync(sqlBuilder.ToString(), map, new { id = query.Id });

            return employees.SingleOrDefault(e => e != null);
        }
    }
}
