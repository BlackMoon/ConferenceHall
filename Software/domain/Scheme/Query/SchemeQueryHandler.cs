using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using domain.Common.Query;
using Dapper;
using Kit.Dal.DbManager;

namespace domain.Scheme.Query
{
    public class SchemeQueryHandler : KeyObjectQueryHandler<FindSchemeByIdQuery, Scheme>
    {
        public SchemeQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public override async Task<Scheme> ExecuteAsync(FindSchemeByIdQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.hall_scheme s")
                .Column("s.id")
                .Column("s.hall_id")
                .Column("s.name")
                .Column("s.plan")
                .Column("h.width")
                .Column("h.height")
                .Join("conf_hall.halls h ON h.id = s.hall_id")
                .Where("s.id = @id");

            await DbManager.OpenAsync();
            var schemes = await DbManager.DbConnection.QueryAsync<Scheme>(sqlBuilder.ToString(), new { id = query.Id});
            return schemes.SingleOrDefault();
        }
    }
}
