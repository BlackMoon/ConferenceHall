using System;
using System.Threading.Tasks;
using domain.Common.Query;
using Dapper;
using Kit.Dal.DbManager;
using System.Collections.Generic;
using Kit.Core.CQRS.Query;

namespace domain.Member.Query
{
    public class EmployeeQueryHandler : 
        KeyObjectQueryHandler<FindMemberByIdQuery, Member>,
        IQueryHandler<FindMembersQuery, IEnumerable<Member>>,
        IQueryHandler<FindMemberSeatQuery, Member>
    {

        public EmployeeQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }
       
        public IEnumerable<Member> Execute(FindMembersQuery query)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Member>> ExecuteAsync(FindMembersQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.conf_members m")
                .Column("m.id")
                .Column("m.seat")
                .Column("m.state")
                .Column("m.employee_id employeeId")
                .Column("e.name")
                .Column("e.position")
                .Column("o.name job")
                .Join("conf_hall.employees e ON e.id = m.employee_id")
                .Join("conf_hall.organizations o ON o.id = e.org_id")
                .OrderBy("lower(e.name)");

            DynamicParameters param = new DynamicParameters();

            // фильтр по конференции
            if (query.ConferenceId.HasValue)
            {
                sqlBuilder.Where("m.conf_id = @conferenceId");
                param.Add("conferenceId", query.ConferenceId);
            }

            // фильтр по организациям
            if (query.OrganizationIds != null)
            {
                sqlBuilder.Where("e.org_id = ANY(@orgIds)");
                param.Add("orgIds", query.OrganizationIds);
            }

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QueryAsync<Member>(sqlBuilder.ToString(), param);
        }

        public override Member Execute(FindMemberByIdQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.conf_members m")
                .Column("m.id")
                .Column("m.seat")
                .Column("m.state")
                .Column("e.name")
                .Column("e.position")
                .Column("o.name job")
                .Join("conf_hall.employees e ON e.id = m.employee_id")
                .Join("conf_hall.organizations o ON o.id = e.org_id")
                .Where("m.id = @id");

            DbManager.Open();
            return DbManager.DbConnection.QueryFirstOrDefault<Member>(sqlBuilder.ToString(), new { id = query.Id });
        }

        public Member Execute(FindMemberSeatQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.conf_members m")
                .Column("m.id")
                .Column("m.seat")
                .Column("m.state")
                .Where("m.id = @memberId")
                .Where("m.conf_id = @id");

            DbManager.Open();
            return DbManager.DbConnection.QueryFirstOrDefault<Member>(sqlBuilder.ToString(), new { id = query.Id, memberId = query.MemberId });
        }

        public Task<Member> ExecuteAsync(FindMemberSeatQuery query)
        {
            throw new NotImplementedException();
        }
    }
}
