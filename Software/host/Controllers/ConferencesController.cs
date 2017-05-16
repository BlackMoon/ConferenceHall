using System.Collections.Generic;
using System.Threading.Tasks;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using domain.Conference;
using domain.Conference.Query;
using domain.Common.Query;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class ConferencesController : Controller
    {
        private readonly IQueryDispatcher _queryDispatcher;

        public ConferencesController(IQueryDispatcher queryDispatcher)
        {
            _queryDispatcher = queryDispatcher;
        }

        // GET api/conferences
        [HttpGet]
        public Task<IEnumerable<Conference>> Get()
        {
            return _queryDispatcher.DispatchAsync<GetAllQuery, IEnumerable<Conference>>(new GetAllQuery());
        }

        // GET api/conferences/5
        [HttpGet("{id}")]
        public Task<Conference> Get(int id)
        {
            return _queryDispatcher.DispatchAsync<FindConferenceByIdQuery, Conference>(new FindConferenceByIdQuery() { Id = id });
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
