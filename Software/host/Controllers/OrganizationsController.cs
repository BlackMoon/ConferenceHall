using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;

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
        public IEnumerable<string> Get()
        {
            // todo _queryDispatcher.DispatchAsync<>()

            return new string[] { "organization1", "organization2" };
        }

        // GET api/organizations/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "organization";
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
