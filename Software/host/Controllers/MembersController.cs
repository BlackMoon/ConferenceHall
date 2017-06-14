using System.Collections.Generic;
using System.Threading.Tasks;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using domain.Member;
using domain.Member.Command;
using domain.Member.Query;
using Kit.Core.CQRS.Command;
using Microsoft.AspNetCore.JsonPatch;

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

        [HttpPatch("{id}")]
        public Task Patch(int id, [FromBody]JsonPatchDocument patch)
        {
            PartialUpdateCommand value = new PartialUpdateCommand()
            {
                MemberId = id
            };

            patch.ApplyTo(value);

            return CommandDispatcher.DispatchAsync<PartialUpdateCommand, bool>(value);
        }
    }
}
