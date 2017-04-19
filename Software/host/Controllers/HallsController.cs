using System.Collections.Generic;
using System.Threading.Tasks;
using domain.Common.Command;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using domain.Hall;
using domain.Hall.Query;
using domain.Common.Query;
using domain.Hall.Command;
using Kit.Core.CQRS.Command;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class HallsController : Controller
    {
        private readonly ICommandDispatcher _commandDispatcher;
        private readonly IQueryDispatcher _queryDispatcher;

        public HallsController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher)
        {
            _commandDispatcher = commandDispatcher;
            _queryDispatcher = queryDispatcher;
        }

        // GET api/halls
        [HttpGet]
        public Task<IEnumerable<Hall>> Get()
        {
            return _queryDispatcher.DispatchAsync<GetAllQuery, IEnumerable<Hall>>(new GetAllQuery());
        }

        // GET api/halls/5
        [HttpGet("{id}")]
        public Task<Hall> Get(int id)
        {
            return _queryDispatcher.DispatchAsync<FindHallByIdQuery, Hall>(new FindHallByIdQuery() { Id = id });
        }

        // POST api/halls
        [HttpPost]
        public Task Post([FromBody]CreateHallCommand value)
        {
            return _commandDispatcher.DispatchAsync<CreateHallCommand, long>(value);
        }

        // PUT api/halls/5
        [HttpPut("{id}")]
        public Task Put(int id, [FromBody]Hall value)
        {
            return _commandDispatcher.DispatchAsync<Hall, bool>(value);
        }

        // DELETE api/halls/5
        [HttpDelete("{id}")]
        public Task Delete(int id)
        {
            return _commandDispatcher.DispatchAsync<DeleteObjectByIdCommand, bool>(new DeleteObjectByIdCommand() {Id = id});
        }
    }
}
