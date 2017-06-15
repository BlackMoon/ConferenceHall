using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using domain.Common.Query;
using Dapper;
using Kit.Dal.DbManager;

namespace domain.Hall.Query
{
    public class HallQueryHandler: KeyObjectQueryHandler<FindHallByIdQuery, Hall>
    {
        public HallQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public override async Task<Hall> ExecuteAsync(FindHallByIdQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.halls h")
                .Column("h.*")
                .Column("s.id")
                .Column("s.name")
                .LeftJoin("conf_hall.hall_scheme s ON s.hall_id = h.id")
                .Where("h.id = @id");

            Hall prev = null;
            Func<Hall, Scheme.Scheme, Hall> map = (h, s) =>
            {
                if (prev != null && prev.Id == h.Id)
                {
                    prev.Schemes.Add(s);
                    return null;
                }

                prev = h;
                prev.Schemes = new List<Scheme.Scheme> {s};

                return h;
            };

            await DbManager.OpenAsync();
            var halls = await DbManager.DbConnection.QueryAsync(sqlBuilder.ToString(), map, new { id = query.Id});

            return halls.SingleOrDefault(h => h != null);
        }
    }
}
