using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using domain.HallScheme;
using domain.HallScheme.Query;
using domain.Common.Query;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class HallSchemesController : Controller
    {
        private IQueryDispatcher _queryDispatcher;

        public HallSchemesController(IQueryDispatcher queryDispatcher)
        {
            _queryDispatcher = queryDispatcher;
        }

        // GET api/hallschemes
        [HttpGet]
        public Task<IEnumerable<HallScheme>> Get()
        {
            // todo _queryDispatcher.DispatchAsync<>()

            return _queryDispatcher.DispatchAsync<GetAllQuery, IEnumerable<HallScheme>>(new GetAllQuery());
        }

        // GET api/hallschemes/5
        [HttpGet("{id}")]
        public Task<HallScheme> Get(int id)
        {
            return _queryDispatcher.DispatchAsync<FindHallSchemeByIdQuery, HallScheme>(new FindHallSchemeByIdQuery() { Id = id });
        }

        // POST api/hallschemes
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/hallschemes/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/hallschemes/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
