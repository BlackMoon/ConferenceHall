using System.Data;
using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Mapster;
using Microsoft.Extensions.Logging;

namespace domain.Message.Command
{
    public class MessageCommandHandler : 
        KeyObjectCommandHandler<Message>,
        ICommandHandler<DeleteMessagesCommand>,
        ICommandHandlerWithResult<CreateMessageCommand, int>
    {
        public MessageCommandHandler(IDbManager dbManager, ILogger<MessageCommandHandler> logger) : base(dbManager, logger)
        {
        }

        public int Execute(CreateMessageCommand command)
        {
            throw new System.NotImplementedException();
        }

        public async Task<int> ExecuteAsync(CreateMessageCommand command)
        {
            await DbManager.OpenAsync();

            Message message = new Message();
            return await DbManager.DbConnection.InsertAsync(command.Adapt(message));
        }

        public void Execute(DeleteMessagesCommand command)
        {
            throw new System.NotImplementedException();
        }

        public async Task ExecuteAsync(DeleteMessagesCommand command)
        {
            DbManager.AddParameter("Ids", command.Ids);

            await DbManager.OpenAsync();
            await DbManager.ExecuteNonQueryAsync(CommandType.Text, "DELETE FROM conf_hall.conf_messages WHERE id = ANY(@Ids)");
        }
    }
}
