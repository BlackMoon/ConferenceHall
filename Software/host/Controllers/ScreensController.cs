using System;
using domain.Screen;
using domain.Screen.Query;
using Kit.Core.CQRS.Command;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class ScreensController : CqrsController
    {
        // GET api/values/5
        public ScreensController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher) : base(commandDispatcher, queryDispatcher)
        {
        }

        [HttpGet]
        public Task<IEnumerable<Screen>> Get(DateTime startDate)
        {
            return QueryDispatcher.DispatchAsync<FindScreensQuery, IEnumerable<Screen>>(new FindScreensQuery(){ StartDate = startDate });
        }

        [HttpGet("{id}")]
        public Task<Screen> Get(int id)
        {
            return QueryDispatcher.DispatchAsync<FindScreenByIdQuery, Screen>(new FindScreenByIdQuery() { Id = id });
        }
    }
}
