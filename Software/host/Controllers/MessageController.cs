using System.Collections.Generic;
using System.Threading.Tasks;
using domain.Message;
using domain.Message.Query;
using Kit.Core.CQRS.Command;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class ConfMessageController : CqrsController
    {
        public ConfMessageController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher) : base(commandDispatcher, queryDispatcher)
        {
        }

        [HttpGet("{confId}")]
        public Task<IEnumerable<Message>> Get(int confId)
        {
            return QueryDispatcher.DispatchAsync<FindMessagesQuery, IEnumerable<Message>>(new FindMessagesQuery(){ ConferenceId = confId }));
        }
    }
}
