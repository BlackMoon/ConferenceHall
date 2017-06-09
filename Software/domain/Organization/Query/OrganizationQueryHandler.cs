using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using domain.Common.Query;
using domain.Dto;
using Dapper;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;
using Mapster;

namespace domain.Organization.Query
{
    public class OrganizationQueryHandler: 
        KeyObjectQueryHandler<FindOrganizationByIdQuery, Organization>,
        IQueryHandler<FindOrganizationsQuery, IEnumerable<OrganizationNode>>
    {
        public OrganizationQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public IEnumerable<OrganizationNode> Execute(FindOrganizationsQuery query)
        {
            throw new System.NotImplementedException();
        }

        public async Task<IEnumerable<OrganizationNode>> ExecuteAsync(FindOrganizationsQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder();

            await DbManager.OpenAsync();

            DynamicParameters param = new DynamicParameters();
            if (query.OrganizationId.HasValue)
            {
                sqlBuilder
                    .Column("e.id")
                    .Column("e.org_id orgid")
                    .Column("e.name")
                    .Column("e.position")
                    .Column("u.locked")
                    .From("conf_hall.employees e")
                    .LeftJoin("conf_hall.users u ON u.employee_id = e.id")
                    .Where("e.org_id = @orgid")
                    .OrderBy("lower(e.name)");

                param.Add("orgid", query.OrganizationId);

                // может задаваться фильтр
                if (query.EmployeeSearch && !string.IsNullOrEmpty(query.Filter))
                {
                    sqlBuilder.Where("lower(e.name) LIKE lower(@filter)");
                    param.Add("filter", query.Filter + "%");
                }

                var employees = await DbManager.DbConnection.QueryAsync<Employee.Employee>(sqlBuilder.ToString(), param);
                return employees.Select(e =>
                {
                    OrgEmployeeDto dto = new OrgEmployeeDto();
                    return new OrganizationNode() { Data = e.Adapt(dto), Leaf = true };
                });
            }
            
            sqlBuilder
                .Column("o.id")
                .Column("o.name")
                .Column("o.description")
                .From("conf_hall.organizations o")
                .OrderBy("lower(o.name)");

            // может задаваться фильтр
            if (!string.IsNullOrEmpty(query.Filter))
            {
                string expr;

                if (query.EmployeeSearch)
                {
                    expr = "exists (SELECT e.org_id FROM conf_hall.employees e WHERE e.org_id = o.id AND lower(e.name) LIKE lower(@filter))";
                    param.Add("filter", query.Filter + "%");
                }
                else
                {
                    expr = "lower(o.name) LIKE lower(@filter)";
                    param.Add("filter", $"%{query.Filter}%");
                }

                sqlBuilder.Where(expr);
            }

            var orgs = await DbManager.DbConnection.QueryAsync<Organization>(sqlBuilder.ToString(), param);
            return orgs.Select(o =>
            {
                OrgEmployeeDto dto = new OrgEmployeeDto();
                return new OrganizationNode() { Data = o.Adapt(dto) };
            });
           


            /*
            // может задаваться фильтр
            if (!string.IsNullOrEmpty(query.Filter))
            {
                sqlBuilder.Where("lower(o.name) LIKE lower(@filter)");
                param.Add("filter", query.Filter + "%");
            }

            IList<OrganizationNode> nodes = new List<OrganizationNode>();
            nodes.Add(new OrganizationNode(){Data = new OrgEmployeeDto(){Name = "1"}, Leaf = false});
            //return nodes;

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QueryAsync<Organization, Employee.Employee, OrganizationNode>(sqlBuilder.ToString(),
                (o, e) =>
                {
                    OrgEmployeeDto dto = new OrgEmployeeDto();

                    if (o.Id != 0)
                        return new OrganizationNode() { Data = o.Adapt(dto)};

                    return new OrganizationNode()  {Data = e.Adapt(dto), Leaf = true };
                },
                splitOn: "OrgId",
                param: param);*/
        }
    }
}
