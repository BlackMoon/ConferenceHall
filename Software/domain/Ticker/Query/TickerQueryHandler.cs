using System.Collections.Generic;
using System.Threading.Tasks;
using domain.Common.Query;
using Dapper;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;

namespace domain.Ticker.Query
{
    public class TickerQueryHandler :
        KeyObjectQueryHandler,
        IQueryHandler<FindTickersQuery, IEnumerable<string>>,
        IQueryHandler<FindTickersQuery, IEnumerable<Ticker>>
    {
        public TickerQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        /// <summary>
        /// Сообщения конференции для бегущей строки
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        IEnumerable<string> IQueryHandler<FindTickersQuery, IEnumerable<string>>.Execute(FindTickersQuery query)
        {
            DbManager.Open();
            return DbManager.DbConnection.Query<string>("SELECT conf_messages_rows(@id)", new { id = query.ConferenceId });
        }

        Task<IEnumerable<string>> IQueryHandler<FindTickersQuery, IEnumerable<string>>.ExecuteAsync(FindTickersQuery query)
        {
            throw new System.NotImplementedException();
        }

        public IEnumerable<Ticker> Execute(FindTickersQuery query)
        {
            throw new System.NotImplementedException();
        }

        /// <summary>
        /// Сообщения конференции для настройки
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        public async Task<IEnumerable<Ticker>> ExecuteAsync(FindTickersQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.conf_messages m")
                .Column("m.id")
                .Column("m.active")
                .Column("m.content")
                .Where("m.conf_id = @confId")
                .OrderBy("m.id");

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QueryAsync<Ticker>(sqlBuilder.ToString(), new { confId = query.ConferenceId });
        }
    }
}
