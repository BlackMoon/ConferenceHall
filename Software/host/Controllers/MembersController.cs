using System.Collections.Generic;
using System.Threading.Tasks;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using domain.Member;
using domain.Member.Query;
using Kit.Core.CQRS.Command;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class MembersController : CqrsController
    {
        // GET api/members
        public MembersController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher) : base(commandDispatcher, queryDispatcher)
        {
        }

        [HttpGet("{confid}")]
        public Task<IEnumerable<Member>> Get(int confId)
        {
            return QueryDispatcher.DispatchAsync<FindConferenceMembersQuery, IEnumerable<Member>>(new FindConferenceMembersQuery() { ConferenceId = confId });
        }
    }
}
