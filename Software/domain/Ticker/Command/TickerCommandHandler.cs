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

namespace domain.Ticker.Command
{
    public class TickerCommandHandler : 
        KeyObjectCommandHandler<Ticker>,
        ICommandHandler<DeleteTickersCommand>,        
        ICommandHandlerWithResult<CreateTickerCommand, int>,
        ICommandHandlerWithResult<PartialUpdateCommand, bool>
    {
        public TickerCommandHandler(IDbManager dbManager, ILogger<TickerCommandHandler> logger) : base(dbManager, logger)
        {
        }

        public int Execute(CreateTickerCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<int> ExecuteAsync(CreateTickerCommand command)
        {
            await DbManager.OpenAsync();

            Ticker message = new Ticker();
            return await DbManager.DbConnection.InsertAsync(command.Adapt(message));
        }

        public void Execute(DeleteTickersCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task ExecuteAsync(DeleteTickersCommand command)
        {
            DbManager.AddParameter("Ids", command.Ids);

            await DbManager.OpenAsync();
            await DbManager.ExecuteNonQueryAsync(CommandType.Text, "DELETE FROM conf_hall.conf_messages WHERE id = ANY(@Ids)");
        }

        public bool Execute(PartialUpdateCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> ExecuteAsync(PartialUpdateCommand command)
        {
            List<string> columns = new List<string>();

            DbManager.AddParameter("id", command.MessageId);

            if (command.Active.HasValue)
            {
                DbManager.AddParameter("active", command.Active);
                columns.Add("active = @active");
            }

            if (command.Content != null)
            {
                DbManager.AddParameter("content", command.Content);
                columns.Add("content = @content");
            }

            int updated = await DbManager.ExecuteNonQueryAsync(CommandType.Text, $"UPDATE conf_hall.conf_messages SET {string.Join(",", columns)} WHERE id = @id");
            Logger.LogInformation($"Modified {updated} records");

            return updated > 0;
        }        
    }
}
