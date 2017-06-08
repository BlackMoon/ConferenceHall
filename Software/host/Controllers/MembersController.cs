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

        [HttpGet]
        public Task<IEnumerable<Member>> Get(int? confid, string filter)
        {
            if (confid.HasValue)
            {
                FindConferenceMembersQuery query = new FindConferenceMembersQuery() { ConferenceId = confid.Value };
                return QueryDispatcher.DispatchAsync<FindConferenceMembersQuery, IEnumerable<Member>>(query);
            }
            else
            {
                FindMembersQuery query = new FindMembersQuery() { Filter = filter };
                return QueryDispatcher.DispatchAsync<FindMembersQuery, IEnumerable<Member>>(query);
            }
        }

        // GET api/members/5
        [HttpGet("{id}")]
        public Task<Member> Get(int id)
        {
            return QueryDispatcher.DispatchAsync<FindMemberByIdQuery, Member>(new FindMemberByIdQuery() { Id = id });
        }

        // POST api/members
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/members/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/members/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
