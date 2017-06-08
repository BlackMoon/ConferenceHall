using System.Collections.Generic;
using System.Threading.Tasks;
using domain.Common.Query;
using Dapper;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;

namespace domain.Organization.Query
{
    public class OrganizationQueryHandler: 
        KeyObjectQueryHandler<FindOrganizationByIdQuery, Organization>,
        IQueryHandler<FindOrganizationsQuery, IEnumerable<Organization>>
    {
        public OrganizationQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public IEnumerable<Organization> Execute(FindOrganizationsQuery query)
        {
            throw new System.NotImplementedException();
        }

        public async Task<IEnumerable<Organization>> ExecuteAsync(FindOrganizationsQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.organizations o")
                .Column("o.id")
                .Column("o.code")
                .Column("o.name")
                .OrderBy("lower(o.name)");

            DynamicParameters param = new DynamicParameters();

            // может задаваться фильтр
            if (!string.IsNullOrEmpty(query.Filter))
            {
                sqlBuilder.Where("lower(o.name) LIKE lower(@filter)");
                param.Add("filter", query.Filter + "%");
            }

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QueryAsync<Organization>(sqlBuilder.ToString(), param);
        }
    }
}
