using System;
using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Mapster;
using Microsoft.Extensions.Logging;
using System.Data;

namespace domain.Hall.Command
{
    public class HallCommandHandler : KeyObjectCommandHandler<Hall>,
        ICommandHandler<DeleteHallsCommand>,
        ICommandHandlerWithResult<CreateHallCommand, int>
    {
        public HallCommandHandler(IDbManager dbManager, ILogger<HallCommandHandler> logger) : base(dbManager, logger)
        {
        }

        /// <summary>
        /// Создание холла
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public int Execute(CreateHallCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<int> ExecuteAsync(CreateHallCommand command)
        {
            await DbManager.OpenAsync();

            Hall hall = new Hall();
            return await DbManager.DbConnection.InsertAsync(command.Adapt(hall));
            
        }

        /// <summary>
        /// Удаление холла
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public void Execute(DeleteHallsCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task ExecuteAsync(DeleteHallsCommand command)
        {
            DbManager.AddParameter("Ids", command.Ids);

            await DbManager.OpenAsync();
            await DbManager.ExecuteNonQueryAsync(CommandType.Text, "DELETE FROM conf_hall.halls WHERE id = ANY(@Ids)");
        }
    }
}
