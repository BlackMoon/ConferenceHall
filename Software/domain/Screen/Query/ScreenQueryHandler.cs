using System.Linq;
using System.Threading.Tasks;
using domain.Common.Query;
using Dapper;
using Kit.Dal.DbManager;

namespace domain.Screen.Query
{
    public class ScreenQueryHandler : KeyObjectQueryHandler<FindScreenByIdQuery, Screen>
    {
        public ScreenQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public override async Task<Screen> ExecuteAsync(FindScreenByIdQuery query)
        {
            // sql для выбора конференции
            SqlBuilder sqlBuilder1 = new SqlBuilder("conf_hall.conferences c")
                .Column("c.subject")
                .Column("c.period")
                .Column("conf_messages_get(c.id) messages")
                .Column("h.height")
                .Column("h.width")
                .Column("s.plan")
                .Join("conf_hall.halls h ON h.id = c.hall_id")
                .Join("conf_hall.hall_scheme s ON s.id = c.hall_scheme_id")
                .Where("c.id = @id");

            // sql для выбора участников
            SqlBuilder sqlBuilder2 = new SqlBuilder("conf_hall.conf_members m")
                .Column("m.id")
                .Column("m.state")
                .Column("m.place")
                .Column("e.name")
                .Join("conf_hall.employees e ON e.id = m.employee_id")
                .Where("m.conf_id = @id");

            await DbManager.OpenAsync();

            Screen screen;
            using (var multi = await DbManager.DbConnection.QueryMultipleAsync($"{sqlBuilder1}; {sqlBuilder2}", new { id = query.Id }))
            {
                screen = multi.Read<Screen>().Single();
                screen.Members = multi.Read<Member.Member>().ToArray();
            }
            
            return screen;
        }
    }
}
