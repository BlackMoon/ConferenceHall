using System.Collections.Generic;
using System.Threading.Tasks;
using domain.Message;
using domain.Message.Command;
using domain.Message.Query;
using Kit.Core.CQRS.Command;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class MessagesController : CqrsController
    {
        public MessagesController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher) : base(commandDispatcher, queryDispatcher)
        {
        }

        [HttpGet("{confId}")]
        public Task<IEnumerable<Message>> Get(int confId)
        {
            return QueryDispatcher.DispatchAsync<FindMessagesQuery, IEnumerable<Message>>(new FindMessagesQuery(){ ConferenceId = confId });
        }

        [HttpPost]
        public Task<int> Post([FromBody]CreateMessageCommand value)
        {
            return CommandDispatcher.DispatchAsync<CreateMessageCommand, int>(value);
        }

        [HttpPost("/api/[controller]/delete")]
        public Task DeleteSchemes([FromBody]DeleteMessagesCommand value)
        {
            return CommandDispatcher.DispatchAsync(value);
        }
    }
}
