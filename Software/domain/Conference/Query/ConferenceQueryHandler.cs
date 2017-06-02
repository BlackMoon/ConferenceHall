using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using domain.Common.Query;
using Kit.Dal.DbManager;
using Dapper;
using Kit.Core.CQRS.Query;

namespace domain.Conference.Query
{
    public class ConferenceQueryHandler : 
        KeyObjectQueryHandler<FindConferenceByIdQuery, Conference>,
        IQueryHandler<FindConferencesQuery, IEnumerable<Conference>>
    {
        public ConferenceQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public IEnumerable<Conference> Execute(FindConferencesQuery query)
        {
            throw new System.NotImplementedException();
        }

        public async Task<IEnumerable<Conference>> ExecuteAsync(FindConferencesQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.conferences c")
               .Column("c.id")
               .Column("c.subject")
               .Column("c.description")
               .Column("c.hall_id hallid")
               .Column("lower(c.period) startDate")
               .Column("upper(c.period) endDate")
               .OrderBy("lower(c.subject)");

            DynamicParameters param = new DynamicParameters();

            if (query.State.HasValue)
            {
                sqlBuilder.Where("c.state = @state::conf_state");
                param.Add("state", query.State.ToString());
            }

            // [активные, на подготовке, завершенные] совещания фильтруются по дате
            if (query.State != ConfState.Planned)
            {
                sqlBuilder.Where("c.period && tsrange(@startDate, @endDate, '[]')");

                param.Add("startDate", query.StartDate);
                param.Add("endDate", query.EndDate);
            }

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QueryAsync<Conference>(sqlBuilder.ToString(), param);
        }
    }
}
