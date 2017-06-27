using Dapper;
using domain.Common.Query;
using Kit.Dal.DbManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kit.Core.CQRS.Query;

namespace domain.Employee.Query
{
    public class EmployeeQueryHandler :
        KeyObjectQueryHandler<FindEmployeeByIdQuery, Employee>,
        IQueryHandler<FindEmployeesQuery, IEnumerable<Employee>>
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
                .Column("u.id")
                .Column("u.locked")
                .Column("u.login")
                .Column("u.role")
                .LeftJoin("conf_hall.contacts c ON c.employee_id = e.id")
                .LeftJoin("conf_hall.users u ON u.employee_id = e.id")
                .Where("e.id = @id");

            Employee prev = null;
            Func<Employee, Contact.Contact, SysUser.SysUser, Employee> map = (e, c, u) =>
            {
                if (prev != null && prev.Id == e.Id)
                {
                    if (c != null)
                        prev.Contacts.Add(c);

                    return null;
                }

                e.User = u;                

                prev = e;
                prev.Contacts = new List<Contact.Contact>();

                if (c != null)
                    prev.Contacts.Add(c);

                return e;
            };

            await DbManager.OpenAsync();
            var employees = await DbManager.DbConnection.QueryAsync(sqlBuilder.ToString(), map, new { id = query.Id });

            return employees.SingleOrDefault(e => e != null);
        }

        public IEnumerable<Employee> Execute(FindEmployeesQuery query)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Employee>> ExecuteAsync(FindEmployeesQuery query)
        {
            IEnumerable<Employee> result = Enumerable.Empty<Employee>();

            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.employees e")
                .Column("e.id")
                .Column("e.name");
            
            DynamicParameters param = new DynamicParameters();

            // фильтр по конференции
            if (query.ConferenceId.HasValue)
            {
                sqlBuilder
                    .Join("conf_hall.conf_members m ON m.employee_id = e.id")
                    .Where("m.conf_id = @conferenceId");

                param.Add("conferenceId", query.ConferenceId);
            }

            await DbManager.OpenAsync();
            
            // фильтр по сотрудникам
            if (query.Ids != null)
            {
                Employee prev = null;
                Func<Employee, Contact.Contact, Employee> map = (e, c) =>
                {
                    if (prev != null && prev.Id == e.Id)
                    {
                        if (c != null)
                            prev.Contacts.Add(c);

                        return null;
                    }

                    prev = e;
                    prev.Contacts = new List<Contact.Contact>();

                    if (c != null)
                        prev.Contacts.Add(c);

                    return e;
                };

                sqlBuilder
                    .Column("c.id")
                    .Column("c.active")
                    .Column("c.address")
                    .Column("c.kind")
                    .LeftJoin("conf_hall.contacts c ON c.employee_id = e.id")
                    .Where("e.id = ANY(@ids)");

                param.Add("ids", query.Ids);

                var employees = await DbManager.DbConnection.QueryAsync(sqlBuilder.ToString(), map, param);
                result = employees.Where(e => e != null);
            }
            else
                result = await DbManager.DbConnection.QueryAsync<Employee>(sqlBuilder.ToString(), param);

            return result;
        }
    }
}
