using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using domain.Organization;
using domain.Organization.Query;
using domain.Common.Query;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class OrganizationsController : Controller
    {
        private IQueryDispatcher _queryDispatcher;

        public OrganizationsController(IQueryDispatcher queryDispatcher)
        {
            _queryDispatcher = queryDispatcher;
        }

        // GET api/organizations
        [HttpGet]
        public Task<IEnumerable<Organization>> Get()
        {
            // todo _queryDispatcher.DispatchAsync<>()

            return _queryDispatcher.DispatchAsync<GetAllQuery, IEnumerable<Organization>>(new GetAllQuery());
        }

        // GET api/organizations/5
        [HttpGet("{id}")]
        public Task<Organization> Get(int id)
        {
            return _queryDispatcher.DispatchAsync<FindOrganizationByIdQuery, Organization>(new FindOrganizationByIdQuery() { Id = id });
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

        // DELETE api/organizations/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
