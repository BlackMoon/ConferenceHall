using Dapper.Contrib.Extensions;
using domain.Common.Command;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Mapster;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace domain.Contact.Command
{
    public class ContactCommandHandler :
        KeyObjectCommandHandler<Contact>,
        ICommandHandler<DeleteContactsCommand>,
        ICommandHandlerWithResult<CreateContactCommand, int>,
        ICommandHandlerWithResult<PartialUpdateCommand, bool>
    {
        public ContactCommandHandler(IDbManager dbManager, ILogger<ContactCommandHandler> logger) : base(dbManager, logger)
        {
        }

        public int Execute(CreateContactCommand command)
        {
            throw new NotImplementedException();
        }        

        public async Task<int> ExecuteAsync(CreateContactCommand command)
        {
            await DbManager.OpenAsync();

            Contact contact = new Contact();
            return await DbManager.DbConnection.InsertAsync(command.Adapt(contact));
        }

        public void Execute(DeleteContactsCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task ExecuteAsync(DeleteContactsCommand command)
        {
            DbManager.AddParameter("Ids", command.Ids);

            await DbManager.OpenAsync();
            await DbManager.ExecuteNonQueryAsync(CommandType.Text, "DELETE FROM conf_hall.contacts WHERE id = ANY(@Ids)");
        }

        public bool Execute(PartialUpdateCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> ExecuteAsync(PartialUpdateCommand command)
        {
            IList<string> columns = new List<string>();

            DbManager.AddParameter("id", command.Id);

            if (command.Active.HasValue)
            {
                DbManager.AddParameter("active", command.Active);
                columns.Add("active = @active");
            }

            if (command.Address != null)
            {
                DbManager.AddParameter("address", command.Address);
                columns.Add("address = @address");
            }

            if (command.Kind != null)
            {
                DbManager.AddParameter("kind", command.Kind);
                columns.Add("kind = @kind");
            }

            int updated = await DbManager.ExecuteNonQueryAsync(CommandType.Text, $"UPDATE conf_hall.contacts SET {string.Join(",", columns)} WHERE id = @id");
            Logger.LogInformation($"Modified {updated} records");

            return updated > 0;
        }
    }
}
