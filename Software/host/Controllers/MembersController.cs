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

        [HttpPost("/api/[controller]/delete")]
        public Task DeleteSchemes([FromBody]DeleteMembersCommand value)
        {
            return CommandDispatcher.DispatchAsync(value);
        }

        [HttpPost("/api/[controller]/search")]
        public Task<IEnumerable<Member>> Search([FromBody]FindMembersQuery value)
        {
            return QueryDispatcher.DispatchAsync<FindMembersQuery, IEnumerable<Member>>(value);
        }
    }
}
