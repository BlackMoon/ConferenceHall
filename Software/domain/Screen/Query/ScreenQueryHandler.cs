using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using domain.Common.Query;
using Dapper;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;

namespace domain.Screen.Query
{
    public class ScreenQueryHandler : 
        KeyObjectQueryHandler<FindScreenByIdQuery, Screen>,
        IQueryHandler<FindTickersByConference, IEnumerable<string>>
    {
        public ScreenQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public override async Task<Screen> ExecuteAsync(FindScreenByIdQuery query)
        {
            // sql для выбора конференции
            SqlBuilder sqlBuilder1 = new SqlBuilder("conf_hall.conferences c")
                .Column("c.subject")
                .Column("lower(c.period) startDate")
                .Column("upper(c.period) endDate")
                .Column("conf_messages_get(c.id) tickers")
                .Column("h.height")
                .Column("h.width")
                .Column("s.plan")
                .Join("conf_hall.halls h ON h.id = c.hall_id")
                .Join("conf_hall.hall_scheme s ON s.id = c.hall_scheme_id")
                .Where("c.id = @id");

            // sql для выбора участников
            SqlBuilder sqlBuilder2 = new SqlBuilder("conf_hall.conf_members m")
                .Column("m.id")
                .Column("m.seat")
                .Column("m.state")
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

        public IEnumerable<string> Execute(FindTickersByConference query)
        {
            DbManager.Open();
            return DbManager.DbConnection.Query<string>("SELECT conf_messages_rows(@id)", new { id = query.Id });
        }

        public Task<IEnumerable<string>> ExecuteAsync(FindTickersByConference query)
        {
            throw new NotImplementedException();
        }
    }
}
