using System.Collections.Generic;
using System.Threading.Tasks;
using domain.Common.Query;
using Kit.Dal.DbManager;
using Dapper;

namespace domain.Conference.Query
{
    public class ConferenceQueryHandler : KeyObjectQueryHandler<FindConferenceByIdQuery, Conference>
    {
        public ConferenceQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public override async Task<IEnumerable<Conference>> ExecuteAsync(GetAllQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.conferences c")
                .Column("c.id")
                .Column("c.subject")
                .Column("c.description")
                .Where("c.state = 'Planned'")
                .OrderBy("lower(c.subject)");

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QueryAsync<Conference>(sqlBuilder.ToString());
        }
    }
}
