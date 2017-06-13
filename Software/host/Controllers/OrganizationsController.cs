using System.Collections.Generic;
using System.Threading.Tasks;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using domain.Organization;
using domain.Organization.Command;
using domain.Organization.Query;
using Kit.Core.CQRS.Command;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class OrganizationsController : CqrsController
    {
        // GET api/organizations
        public OrganizationsController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher) : base(commandDispatcher, queryDispatcher)
        {
        }

        [HttpGet]
        public Task<IEnumerable<OrganizationNode>> Get(bool emplSearch, int? orgId, string filter)
        {
            FindOrganizationsQuery query = new FindOrganizationsQuery()
            {
                EmployeeSearch = emplSearch,
                OrganizationId = orgId,
                Filter = filter
            };
            return QueryDispatcher.DispatchAsync<FindOrganizationsQuery, IEnumerable<OrganizationNode>>(query);
        }

        // GET api/organizations/5
        [HttpGet("{id}")]
        public Task<Organization> Get(int id)
        {
            return QueryDispatcher.DispatchAsync<FindOrganizationByIdQuery, Organization>(new FindOrganizationByIdQuery() { Id = id });
        }

        // POST api/conferences
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/organizations/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }
        
        [HttpPost("/api/[controller]/delete")]
        public Task DeleteNodes([FromBody]DeleteNodesCommand value)
        {
            return CommandDispatcher.DispatchAsync<DeleteNodesCommand>(value);
        }
    }
}
