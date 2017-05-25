using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using domain.Conference;
using domain.Conference.Command;
using domain.Conference.Query;
using Kit.Core.CQRS.Command;

using TimeRange = domain.Common.Range<System.DateTime>;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class ConferencesController : CqrsController
    {
        // GET api/conferences
        public ConferencesController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher) : base(commandDispatcher, queryDispatcher)
        {
        }

        [HttpGet]
        public Task<IEnumerable<Conference>> Get(ConfState state, DateTime? startDate, DateTime? endDate)
        {
            FindConferencesQuery query = new FindConferencesQuery() { EndDate = endDate, StartDate = startDate, State = state };
            return QueryDispatcher.DispatchAsync<FindConferencesQuery, IEnumerable<Conference>>(query);
        }

        // GET api/conferences/5
        [HttpGet("{id}")]
        public Task<Conference> Get(int id)
        {
            return QueryDispatcher.DispatchAsync<FindConferenceByIdQuery, Conference>(new FindConferenceByIdQuery() { Id = id });
        }

        [HttpPost("/api/appointment")]
        public Task<TimeRange> MakeAppointment([FromBody]MakeAppointmentCommand value)
        {
            return CommandDispatcher.DispatchAsync<MakeAppointmentCommand, TimeRange>(value);
        }

        // POST api/conferences
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/conferences/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/conferences/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
