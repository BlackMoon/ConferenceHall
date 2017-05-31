using System;
using System.Data;
using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Mapster;
using Microsoft.Extensions.Logging;

namespace domain.ConfMessage.Command
{
    public class ConferenceCommandHandler : 
        KeyObjectCommandHandler<ConfMessage>,
        ICommandHandlerWithResult<CreateConfMessageCommand, int>
    {

        public ConferenceCommandHandler(IDbManager dbManager, ILogger<ConferenceCommandHandler> logger) : base(dbManager, logger)
        {
           
        }

        /// <summary>
        /// Создание сообщения конференции
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public int Execute(CreateConfMessageCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<int> ExecuteAsync(CreateConfMessageCommand command)
        {
            await DbManager.OpenAsync();

            ConfMessage confMessage = new ConfMessage();
            return await DbManager.DbConnection.InsertAsync(command.Adapt(confMessage));
        }

    }
}
