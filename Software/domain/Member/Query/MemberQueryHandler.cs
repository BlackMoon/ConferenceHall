using System.Linq;
using System.Threading.Tasks;
using domain.Common.Query;
using Dapper;
using Kit.Dal.DbManager;

namespace domain.Member.Query
{
    public class MemberQueryHandler : KeyObjectQueryHandler<FindMemberByIdQuery, Member>
    {
        public MemberQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public override async Task<Member> ExecuteAsync(FindMemberByIdQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.employees s")
                .Column("s.id")
                .Column("s.name")
                .Column("s.job_title")
                .Column("s.emails_list")
                .Column("s.phones_list")
                .Column("u.role")
                 .Column("u.locked")
                 .LeftJoin("conf_hall.users u ON s.id = u.employee_id")
                .Where("s.id = @id");

            await DbManager.OpenAsync();
            var members = await DbManager.DbConnection.QueryAsync<Member>(sqlBuilder.ToString(), new { id = query.Id});
            return members.SingleOrDefault();
        }
    }
}
