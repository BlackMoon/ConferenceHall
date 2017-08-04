using System.Collections.Generic;
using System.Threading.Tasks;
using domain.Common.Query;
using Dapper;
using Kit.Dal.DbManager;

namespace domain.Group.Query
{
    public class GroupQueryHandler : KeyObjectQueryHandler<FindGroupByIdQuery, Group>
    {
        public GroupQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public override async Task<IEnumerable<Group>> ExecuteAsync(GetAllQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.scheme_element_groups g")
                .OrderBy("g.type")
                .OrderBy("g.name");

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QueryAsync<Group>(sqlBuilder.ToString());
        }
    }
}
