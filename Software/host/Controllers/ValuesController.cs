using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        private IQueryDispatcher _queryDispatcher;

        public ValuesController(IQueryDispatcher queryDispatcher)
        {
            _queryDispatcher = queryDispatcher;
        }

        // GET api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            // todo _queryDispatcher.DispatchAsync<>()

            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
