using System.Collections.Generic;
using domain.Contact.Command;
using Kit.Core.CQRS.Command;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using messengers;
using Microsoft.AspNetCore.JsonPatch;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class ContactsController : CqrsController
    {
        private readonly SenderManager _senderManager;

        public ContactsController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher, SenderManager senderManager) : base(commandDispatcher, queryDispatcher)
        {
            _senderManager = senderManager;
        }

        [HttpGet("/api/[controller]/senders")]
        public IEnumerable<KeyValuePair<string, string>> GetRegisteredSenders()
        {
            return _senderManager.RegisteredSenders;
        }

        [HttpPost]
        public Task<int> Post([FromBody]CreateContactCommand value)
        {
            return CommandDispatcher.DispatchAsync<CreateContactCommand, int>(value);
        }

        [HttpPatch("{id}")]
        public Task Patch(int id, [FromBody]JsonPatchDocument patch)
        {
            PartialUpdateCommand value = new PartialUpdateCommand()
            {
                Id = id
            };

            patch.ApplyTo(value);

            return CommandDispatcher.DispatchAsync<PartialUpdateCommand, bool>(value);
        }

        [HttpPost("/api/[controller]/delete")]
        public Task DeleteContacts([FromBody]DeleteContactsCommand value)
        {
            return CommandDispatcher.DispatchAsync(value);
        }
    }
}