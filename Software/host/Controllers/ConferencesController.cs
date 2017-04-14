using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class ConferencesController : Controller
    {
        private IQueryDispatcher _queryDispatcher;

        public ConferencesController(IQueryDispatcher queryDispatcher)
        {
            _queryDispatcher = queryDispatcher;
        }

        // GET api/conferences
        [HttpGet]
        public IEnumerable<string> Get()
        {
            // todo _queryDispatcher.DispatchAsync<>()

            return new string[] { "conference1", "conference2" };
        }

        // GET api/conferences/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "conference";
        }

        // POST api/conferences
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/conferences/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/conferences/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
