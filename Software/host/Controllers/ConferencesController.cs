using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using domain.Conference;
using domain.Conference.Command;
using domain.Conference.Query;
using host.Hubs;
using Kit.Core.CQRS.Command;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using TimeRange = domain.Common.Range<System.DateTime>;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class ConferencesController : CqrsController
    {
        private readonly IConnectionManager _connectionManager;
        // GET api/conferences
        public ConferencesController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher, IConnectionManager connectionManager) : base(commandDispatcher, queryDispatcher)
        {
            _connectionManager = connectionManager;
        }

        [HttpGet]
        public Task<IEnumerable<Conference>> Get(ConfState? state, DateTime? startDate, DateTime? endDate)
        {
            _connectionManager.GetHubContext<Broadcaster>().Clients.All.AddTickerMessage("44");

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

        [HttpPatch("/api/period/{id}")]
        public Task Patch(int id, [FromBody]JsonPatchDocument<Conference> patch)
        {
            Conference value = new Conference()
            {
                Id = id
            };
            patch.ApplyTo(value, ModelState);

            return CommandDispatcher.DispatchAsync<Conference, bool>(value);
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
        public Task Delete(int id)
        {
            return CommandDispatcher.DispatchAsync<DeleteConferenceCommand, bool>(new DeleteConferenceCommand() { Id = id });
        }
    }
}
