using System.Threading.Tasks;
using domain.Screen;
using domain.Screen.Query;
using Kit.Core.CQRS.Command;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR.Infrastructure;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class ScreenController : CqrsController
    {
        private readonly IConnectionManager _connectionManager;
        // GET api/values/5
        public ScreenController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher, IConnectionManager connectionManager) : base(commandDispatcher, queryDispatcher)
        {
            _connectionManager = connectionManager;
        }

        [HttpGet("{id}")]
        public Task<Screen> Get(int id)
        {
            return QueryDispatcher.DispatchAsync<FindScreenByIdQuery, Screen>(new FindScreenByIdQuery() { Id = id });
        }

        [HttpPost]
        public Task Post([FromBody]string message)
        {
            return Task.FromResult(0);
        }
    }
}
