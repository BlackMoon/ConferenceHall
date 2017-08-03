using domain.Common.Query;
using domain.Group;
using Kit.Core.CQRS.Command;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace host.Controllers
{

    [Route("api/[controller]")]
    public class GroupsController : CqrsController
    {
        public GroupsController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher) : base(commandDispatcher, queryDispatcher)
        {
        }

        [HttpGet]
        public Task<IEnumerable<Group>> Get()
        {
            return QueryDispatcher.DispatchAsync<GetAllQuery, IEnumerable<Group>>(new GetAllQuery());
        }
    }
}