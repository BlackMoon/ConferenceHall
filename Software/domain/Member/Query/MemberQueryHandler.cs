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
    public class MemberQueryHandler : KeyObjectQueryHandler<FindMemberByIdQuery, Member>,
        IQueryHandler<FindMembersQuery, IEnumerable<Member>>,
        IQueryHandler<FindMemberSeatQuery, Member>
    {

        public MemberQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public IEnumerable<Member> Execute(FindMembersQuery query)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Member>> ExecuteAsync(FindMembersQuery query)
        {

            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.employees s")
                .Column("s.id")
                .Column("s.name")
                .Column("s.job_title")
                .Column("u.role")
                 .Column("u.locked")
                 .Join("conf_hall.users u ON s.id = u.employee_id")
                 //  .Where("s.id = @id")
                 .OrderBy("lower(s.name)");

            DynamicParameters param = new DynamicParameters();

            // может задаваться фильтр
            if (!string.IsNullOrEmpty(query.Filter))
            {
                sqlBuilder.Where("lower(s.name) LIKE lower(@filter)");

                param.Add("filter", query.Filter + "%");
            }

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QueryAsync<Member>(sqlBuilder.ToString(), param);

        }

        public Member Execute(FindMemberSeatQuery query)
        {
            throw new NotImplementedException();
        }

        public async Task<Member> ExecuteAsync(FindMemberSeatQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.conf_members m")
                .Column("m.id")
                .Column("m.name")
                .Column("m.seat")
                .Column("m.state")
                .Where("m.conf_id = @id");

            await DbManager.OpenAsync();
            var members = await DbManager.DbConnection.QueryAsync<Member>(sqlBuilder.ToString(), new { id = query.Id });
            return members.SingleOrDefault();
        }
    }
}
