using System.Threading.Tasks;
using domain.Scheme;
using domain.Scheme.Command;
using domain.Scheme.Query;
using Kit.Core.CQRS.Command;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class SchemesController : Controller
    {
        private readonly ICommandDispatcher _commandDispatcher;
        private readonly IQueryDispatcher _queryDispatcher;

        public SchemesController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher)
        {
            _commandDispatcher = commandDispatcher;
            _queryDispatcher = queryDispatcher;
        }

        
        [HttpGet("{id}")]
        public Task<Scheme> Get(int id)
        {
            return _queryDispatcher.DispatchAsync<FindSchemeByIdQuery, Scheme>(new FindSchemeByIdQuery(){ Id = id });
        }

        
        [HttpPost]
        public void Post([FromBody]CreateSchemeCommand value)
        {
        }

        
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]Scheme value)
        {
        }

        
        [HttpDelete("{id}")]
        public Task Delete(int id)
        {
            return _commandDispatcher.DispatchAsync<DeleteSchemeCommand, bool>(new DeleteSchemeCommand() { Id = id });
        }
    }
}
