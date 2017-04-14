using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class EmployesController : Controller
    {
        private IQueryDispatcher _queryDispatcher;

        public EmployesController(IQueryDispatcher queryDispatcher)
        {
            _queryDispatcher = queryDispatcher;
        }

        // GET api/employes
        [HttpGet]
        public IEnumerable<string> Get()
        {
            // todo _queryDispatcher.DispatchAsync<>()

            return new string[] { "employe1", "employe2" };
        }

        // GET api/employes/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "employe";
        }

        // POST api/employes
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/employes/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/employes/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
