using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using domain.Common.Query;
using Dapper;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;
using System;

namespace domain.Scheme.Query
{
    public class SchemeQueryHandler : 
        KeyObjectQueryHandler<FindSchemeByIdQuery, Scheme>,
        IQueryHandler<FindSchemesQuery, IEnumerable<Scheme>>
    {
        public SchemeQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public override async Task<Scheme> ExecuteAsync(FindSchemeByIdQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.hall_scheme s")
                .Column("s.id")
                .Column("s.name")
                .Column("s.plan")
                .Column("s.grid_interval gridinterval")
                .Column("h.width")
                .Column("h.height")
                .Join("conf_hall.halls h ON h.id = s.hall_id")
                .Where("s.id = @id");

            await DbManager.OpenAsync();
            return DbManager.DbConnection.QuerySingleOrDefault<Scheme>(sqlBuilder.ToString(), new { id = query.Id });
        }

        public IEnumerable<Scheme> Execute(FindSchemesQuery query)
        {
            throw new NotImplementedException();
        }        

        public async Task<IEnumerable<Scheme>> ExecuteAsync(FindSchemesQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.hall_scheme s")
                .Column("s.id")
                .Column("s.name")                
                .Where("s.hall_id = @hallid")
                .OrderBy("s.id");            
           
            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QueryAsync<Scheme>(sqlBuilder.ToString(), new { hallid = query.HallId });
        }
    }
}
