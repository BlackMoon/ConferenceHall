using System;
using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Mapster;

namespace domain.Hall.Command
{
    public class HallCommandHandler : KeyObjectCommandHandler<Hall>,
        ICommandHandlerWithResult<CreateHallCommand, int>,
        ICommandHandlerWithResult<DeleteHallCommand, bool>
    {
        public HallCommandHandler(IDbManager dbManager) : base(dbManager)
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
        public bool Execute(DeleteHallCommand command)
        {
            DbManager.Open();
            return DbManager.DbConnection.Delete(new Hall() {Id = command.Id});
        }

        public async Task<bool> ExecuteAsync(DeleteHallCommand command)
        {
            await DbManager.OpenAsync();

            Hall hall = new Hall();
            return await DbManager.DbConnection.DeleteAsync(command.Adapt(hall));
        }
    }
}
