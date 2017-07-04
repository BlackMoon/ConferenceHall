using Dapper;
using domain.Common.Query;
using domain.Conference.Query;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace domain.Screen.Query
{
    public class ScreenQueryHandler : 
        KeyObjectQueryHandler<FindScreenByIdQuery, Screen>,
        IQueryHandler<FindScreensQuery, IEnumerable<Screen>>
    {
        public ScreenQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public override async Task<Screen> ExecuteAsync(FindScreenByIdQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.conferences c")
                .Column("c.id")
                .Column("c.subject")
                .Column("c.hall_scheme_id schemeid")
                .Column("lower(c.period) startDate")
                .Column("upper(c.period) endDate")
                .Column("conf_messages_get(c.id) tickers")
                .Join("conf_hall.halls h ON h.id = c.hall_id")
                .Where("c.id = @id");

            await DbManager.OpenAsync();
            return DbManager.DbConnection.QuerySingleOrDefault<Screen>(sqlBuilder.ToString(), new { id = query.Id });
        }

        public IEnumerable<Screen> Execute(FindScreensQuery query)
        {
            throw new System.NotImplementedException();
        }

        public async Task<IEnumerable<Screen>> ExecuteAsync(FindScreensQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.conferences c")
                .Column("c.id")
                .Column("c.state")
                .Column("c.subject")
                .Column("h.name hall")
                .Column("lower(c.period) startDate")
                .Column("upper(c.period) endDate")
                .Join("conf_hall.halls h ON h.id = c.hall_id")
                .Where("c.period && tsrange(date_trunc('day', @startDate)::date, date_trunc('day', @startDate)::date + 1, '[)')")
                .OrderBy("c.period");

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QueryAsync<Screen>(sqlBuilder.ToString(), new { startDate = query.StartDate });
        }
    }
}
