using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using domain.Hall;
using domain.Hall.Query;
using domain.Common.Query;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class HallsController : Controller
    {
        private IQueryDispatcher _queryDispatcher;

        public HallsController(IQueryDispatcher queryDispatcher)
        {
            _queryDispatcher = queryDispatcher;
        }

        // GET api/halls
        [HttpGet]
        public Task<IEnumerable<Hall>> Get()
        {
            // todo _queryDispatcher.DispatchAsync<>()

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
        public void Post([FromBody]string value)
        {
        }

        // PUT api/halls/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/halls/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
