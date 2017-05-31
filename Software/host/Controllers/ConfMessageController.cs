using System.Threading.Tasks;
using domain.ConfMessage;
using domain.ConfMessage.Command;
using domain.ConfMessage.Query;
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

        [HttpPost]
        public Task<int> Post([FromBody]CreateConfMessageCommand value)
        {
            return CommandDispatcher.DispatchAsync<CreateConfMessageCommand, int>(value);
        }

        
        [HttpPut("{id}")]
        public Task Put(int id, [FromBody]ConfMessage value)
        {
            return CommandDispatcher.DispatchAsync<ConfMessage, bool>(value);
        }

    }
}
