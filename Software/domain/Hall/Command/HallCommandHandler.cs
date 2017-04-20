using System;
using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Mapster;

namespace domain.Hall.Command
{
    public class HallCommandHandler : KeyObjectCommandHandler,
        ICommandHandlerWithResult<CreateHallCommand, long>,
        ICommandHandlerWithResult<DeleteHallCommand, bool>,
        ICommandHandlerWithResult<Hall, bool>
    {
        public HallCommandHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        /// <summary>
        /// Создание холла
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public long Execute(CreateHallCommand command)
        {
            DbManager.Open();

            Hall hall = new Hall();
            return DbManager.DbConnection.Insert(command.Adapt(hall));
        }

        public async Task<long> ExecuteAsync(CreateHallCommand command)
        {
            IDbManagerAsync dbManagerAsync = DbManager as IDbManagerAsync;
            if (dbManagerAsync != null)
            {
                await dbManagerAsync.OpenAsync();

                Hall hall = new Hall();
                return await DbManager.DbConnection.InsertAsync(command.Adapt(hall));
            }

            throw new NotImplementedException();
        }

        /// <summary>
        /// Удаление холла
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public  bool Execute(DeleteHallCommand command)
        {
            DbManager.Open();
            return DbManager.DbConnection.Delete(new Hall() {Id = command.Id});
        }

        public async Task<bool> ExecuteAsync(DeleteHallCommand command)
        {
            IDbManagerAsync dbManagerAsync = DbManager as IDbManagerAsync;
            if (dbManagerAsync != null)
            {
                await dbManagerAsync.OpenAsync();

                Hall hall = new Hall();
                return await DbManager.DbConnection.DeleteAsync(command.Adapt(hall));
            }

            throw new NotImplementedException();
        }

        /// <summary>
        /// Обновление холла
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>

        public bool Execute(Hall command)
        {
            DbManager.Open();
            return DbManager.DbConnection.Update(command);
        }

        public async Task<bool> ExecuteAsync(Hall command)
        {
            IDbManagerAsync dbManagerAsync = DbManager as IDbManagerAsync;
            if (dbManagerAsync != null)
            {
                await dbManagerAsync.OpenAsync();
                return await DbManager.DbConnection.UpdateAsync(command);
            }

            throw new NotImplementedException();
        }
    }
}
