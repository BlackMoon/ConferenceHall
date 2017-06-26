using System.Collections.Generic;
using System.Threading.Tasks;
using domain.Ticker;
using domain.Ticker.Command;
using domain.Ticker.Query;
using Kit.Core.CQRS.Command;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class TickersController : CqrsController
    {
        public TickersController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher) : base(commandDispatcher, queryDispatcher)
        {
        }

        [HttpGet("{confId}")]
        public Task<IEnumerable<Ticker>> Get(int confId)
        {
            return QueryDispatcher.DispatchAsync<FindTickersQuery, IEnumerable<Ticker>>(new FindTickersQuery(){ ConferenceId = confId });
        }

        [HttpPatch("{id}")]
        public Task Patch(int id, [FromBody]JsonPatchDocument patch)
        {
            PartialUpdateCommand value = new PartialUpdateCommand()
            {
                MessageId = id
            };

            patch.ApplyTo(value);

            return CommandDispatcher.DispatchAsync<PartialUpdateCommand, bool>(value);
        }

        [HttpPost]
        public Task<int> Post([FromBody]CreateTickerCommand value)
        {
            return CommandDispatcher.DispatchAsync<CreateTickerCommand, int>(value);
        }

        [HttpPost("/api/[controller]/delete")]
        public Task DeleteMessages([FromBody]DeleteTickersCommand value)
        {
            return CommandDispatcher.DispatchAsync(value);
        }
        
        [HttpPost("/api/[controller]/send")]
        public Task Send([FromBody]string value)
        {
            return Task.FromResult(0);
        }

    }
}
