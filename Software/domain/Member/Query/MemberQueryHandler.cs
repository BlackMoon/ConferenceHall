using System;
using System.Threading.Tasks;
using domain.Common.Query;
using Dapper;
using Kit.Dal.DbManager;
using System.Collections.Generic;
using Kit.Core.CQRS.Query;
using System.Linq;

namespace domain.Member.Query
{
    public class MemberQueryHandler : 
        KeyObjectQueryHandler<FindMemberByIdQuery, Member>,
        IQueryHandler<FindConferenceMembersQuery, IEnumerable<Member>>,
        IQueryHandler<FindMembersQuery, IEnumerable<Member>>,
        IQueryHandler<FindMemberSeatQuery, Member>
    {

        public MemberQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public IEnumerable<Member> Execute(FindConferenceMembersQuery query)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Member>> ExecuteAsync(FindConferenceMembersQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.conf_members m")
                .Column("m.id")
                .Column("m.seat")
                .Column("m.state")
                .Column("e.name")
                .Column("e.job_title jobTitle")
                .Column("o.name organization")
                .Join("conf_hall.employees e ON e.id = m.employee_id")
                .Join("conf_hall.organizations o ON o.id = e.org_id")
                .Where("m.conf_id = @confid")
                .OrderBy("lower(e.name)");

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QueryAsync<Member>(sqlBuilder.ToString(), new { confid = query.ConferenceId });
        }

        public IEnumerable<Member> Execute(FindMembersQuery query)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Member>> ExecuteAsync(FindMembersQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.employees e")
                .Column("e.id")
                .Column("e.name")
                .Column("e.job_title jobTitle")
                .Column("o.name organization")
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

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QueryAsync<Member>(sqlBuilder.ToString(), param);
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
