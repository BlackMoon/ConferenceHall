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
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.conferences c")
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
