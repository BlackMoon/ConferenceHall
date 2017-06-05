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
using Microsoft.AspNetCore.JsonPatch;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class ConferencesController : CqrsController
    {       
        // GET api/conferences
        public ConferencesController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher) : base(commandDispatcher, queryDispatcher)
        {            
        }

        // GET api/conferences/5
        [HttpGet("{id}")]
        public Task<Conference> Get(int id)
        {
            return QueryDispatcher.DispatchAsync<FindConferenceByIdQuery, Conference>(new FindConferenceByIdQuery() { Id = id });
        }

        [HttpPut("/api/appointment/{id}")]
        public Task<TimeRange> MakeAppointment(int id, [FromBody]MakeAppointmentCommand value)
        {
            value.ConferenceId = id;
            return CommandDispatcher.DispatchAsync<MakeAppointmentCommand, TimeRange>(value);
        }        

        [HttpPatch("{id}")]
        public Task Patch(int id, [FromBody]JsonPatchDocument patch)
        {
            PartialUpdateCommand value = new PartialUpdateCommand()
            {
                ConferenceId = id                
            };

            patch.ApplyTo(value);
            
            return CommandDispatcher.DispatchAsync<PartialUpdateCommand, bool>(value);
        }

        // POST api/conferences
        [HttpPost]
        public Task<int> Post([FromBody]CreateConferenceCommand value)
        {
            return CommandDispatcher.DispatchAsync<CreateConferenceCommand, int>(value);
        }

        // PUT api/conferences/5
        [HttpPut("{id}")]
        public Task Put(int id, [FromBody]Conference value)
        {
            return CommandDispatcher.DispatchAsync<Conference, bool>(value);
        }

        // DELETE api/conferences/5
        [HttpDelete("{id}")]
        public Task Delete(int id)
        {
            return CommandDispatcher.DispatchAsync<DeleteConferenceCommand, bool>(new DeleteConferenceCommand() { Id = id });
        }

        [HttpPost("/api/search")]
        public Task<IEnumerable<Conference>> Search([FromBody]FindConferencesQuery value)
        {
            return QueryDispatcher.DispatchAsync<FindConferencesQuery, IEnumerable<Conference>>(value);
        }
    }
}
