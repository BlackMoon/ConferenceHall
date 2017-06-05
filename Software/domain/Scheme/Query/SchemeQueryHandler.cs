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
        IQueryHandler<FindSchemasQuery, IEnumerable<Scheme>>
    {
        public SchemeQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public IEnumerable<Scheme> Execute(FindSchemasQuery query)
        {
            throw new NotImplementedException();
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
            var schemes = await DbManager.DbConnection.QueryAsync<Scheme>(sqlBuilder.ToString(), new { id = query.Id});
            return schemes.SingleOrDefault();
        }

        public async Task<IEnumerable<Scheme>> ExecuteAsync(FindSchemasQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.hall_scheme s")
                .Column("s.id")
                .Column("s.name")
                .Column("s.plan")
                .Column("s.hall_id")
                .Column("s.grid_interval gridinterval");

            DynamicParameters param = new DynamicParameters();

            if (query.HallId.HasValue)
            {
                param.Add("hall_id", query.HallId);
                sqlBuilder.Where("s.hall_id = @hall_id");
            }
            if (!string.IsNullOrEmpty(query.Filter))
            {
                sqlBuilder.Where("@filter");
                param.Add("filter", query.Filter);
            }
            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QueryAsync<Scheme>(sqlBuilder.ToString(), param);
        }
    }
}
