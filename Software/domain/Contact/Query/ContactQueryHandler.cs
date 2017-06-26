using Dapper;
using domain.Common.Query;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace domain.Contact.Query
{
    public class ContactQueryHandler:
        KeyObjectQueryHandler,
        IQueryHandler<FindContactsQuery, IEnumerable<Contact>>
    {
        public ContactQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public IEnumerable<Contact> Execute(FindContactsQuery query)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Contact>> ExecuteAsync(FindContactsQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.contacts c")
                .Column("c.id")
                .Column("c.kind")
                .Column("c.address")
                .Where("c.employee_id = @employeeId");

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QueryAsync<Contact>(sqlBuilder.ToString(), new { employeeId = query.EmployeeId });
        }
    }
}
