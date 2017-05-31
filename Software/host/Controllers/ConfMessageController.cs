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

        [HttpGet("{id}")]
        public Task<ConfMessage> Get(int id)
        {
            return QueryDispatcher.DispatchAsync<FindConfMessageByIdQuery, ConfMessage>(new FindConfMessageByIdQuery(){ Id = id });
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

        
        [HttpDelete("{id}")]
        public Task Delete(int id)
        {
            return CommandDispatcher.DispatchAsync<DeleteConfMessageCommand, bool>(new DeleteConfMessageCommand() { Id = id });
        }
    }
}
