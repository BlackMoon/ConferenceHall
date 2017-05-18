using System.Collections.Generic;
using System.Threading.Tasks;
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
    public class HallsController : CqrsController
    {

        // GET api/halls
        public HallsController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher) : base(commandDispatcher, queryDispatcher)
        {
        }

        [HttpGet]
        public Task<IEnumerable<Hall>> Get()
        {
            return QueryDispatcher.DispatchAsync<GetAllQuery, IEnumerable<Hall>>(new GetAllQuery());
        }

        // GET api/halls/5
        [HttpGet("{id}")]
        public Task<Hall> Get(int id)
        {
            return QueryDispatcher.DispatchAsync<FindHallByIdQuery, Hall>(new FindHallByIdQuery() { Id = id });
        }

        // POST api/halls
        [HttpPost]
        public Task<int> Post([FromBody]CreateHallCommand value)
        {
            return CommandDispatcher.DispatchAsync<CreateHallCommand, int>(value);
        }

        // PUT api/halls/5
        [HttpPut("{id}")]
        public Task Put(int id, [FromBody]Hall value)
        {
            return CommandDispatcher.DispatchAsync<Hall, bool>(value);
        }

        // DELETE api/halls/5
        [HttpDelete("{id}")]
        public Task Delete(int id)
        {
            return CommandDispatcher.DispatchAsync<DeleteHallCommand, bool>(new DeleteHallCommand() {Id = id});
        }
    }
}
