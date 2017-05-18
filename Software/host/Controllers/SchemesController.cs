using System.Threading.Tasks;
using domain.Scheme;
using domain.Scheme.Command;
using domain.Scheme.Query;
using Kit.Core.CQRS.Command;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class SchemesController : CqrsController
    {
        public SchemesController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher) : base(commandDispatcher, queryDispatcher)
        {
        }

        [HttpGet("{id}")]
        public Task<Scheme> Get(int id)
        {
            return QueryDispatcher.DispatchAsync<FindSchemeByIdQuery, Scheme>(new FindSchemeByIdQuery(){ Id = id });
        }

        
        [HttpPost]
        public Task<int> Post([FromBody]CreateSchemeCommand value)
        {
            return CommandDispatcher.DispatchAsync<CreateSchemeCommand, int>(value);
        }

        
        [HttpPut("{id}")]
        public Task Put(int id, [FromBody]Scheme value)
        {
            return CommandDispatcher.DispatchAsync<Scheme, bool>(value);
        }

        
        [HttpDelete("{id}")]
        public Task Delete(int id)
        {
            return CommandDispatcher.DispatchAsync<DeleteSchemeCommand, bool>(new DeleteSchemeCommand() { Id = id });
        }
    }
}
