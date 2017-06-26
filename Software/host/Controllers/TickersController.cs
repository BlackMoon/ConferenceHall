using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using domain.Contact.Query;
using domain.Notification;
using domain.Ticker;
using domain.Ticker.Command;
using domain.Ticker.Query;
using Kit.Core.CQRS.Command;
using Kit.Core.CQRS.Query;
using messengers;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class TickersController : CqrsController
    {
        private readonly SenderManager _senderManager;

        public TickersController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher, SenderManager senderManager) : base(commandDispatcher, queryDispatcher)
        {
            _senderManager = senderManager;
        }

        [HttpGet("{confId}")]
        public Task<IEnumerable<Ticker>> Get(int confId)
        {
            return QueryDispatcher.DispatchAsync<FindTickersQuery, IEnumerable<Ticker>>(new FindTickersQuery(){ ConferenceId = confId });
        }

        [HttpPatch("{id}")]
        public Task Patch(int id, [FromBody]JsonPatchDocument patch)
        {
            PartialUpdateCommand value = new PartialUpdateCommand()
            {
                MessageId = id
            };

            patch.ApplyTo(value);

            return CommandDispatcher.DispatchAsync<PartialUpdateCommand, bool>(value);
        }

        [HttpPost]
        public Task<int> Post([FromBody]CreateTickerCommand value)
        {
            return CommandDispatcher.DispatchAsync<CreateTickerCommand, int>(value);
        }

        [HttpPost("/api/[controller]/delete")]
        public Task DeleteMessages([FromBody]DeleteTickersCommand value)
        {
            return CommandDispatcher.DispatchAsync(value);
        }
        
        [HttpPost("/api/[controller]/send")]
        public async Task Send([FromBody]Notification value)
        {
            IList<string> errors = new List<string>();

            // ids --> employee ids
            if (value.Ids != null)
            {
                foreach (int id in value.Ids)
                {
                    try
                    {
                        var dbContacts = await QueryDispatcher.DispatchAsync<FindContactsQuery, IEnumerable<Contact>>(new FindContactsQuery() { EmployeeId = id });
                        var contacts = dbContacts
                            .Select(c => new Contact()
                            {
                                Address = c.Address,
                                Kind = c.Kind
                            });

                        await _senderManager.SendAsync("Внимание!", value.Body, contacts.ToArray());
                    }
                    catch (Exception ex)
                    {
                        errors.Add(ex.Message);
                    }
                }       
            }

            if (errors.Any())
                throw new Exception(string.Join(". ", errors));
        }

    }
}
