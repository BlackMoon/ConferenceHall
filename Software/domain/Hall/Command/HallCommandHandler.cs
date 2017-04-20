using System;
using System.Threading.Tasks;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Mapster;

namespace domain.Hall.Command
{
    public class HallCommandHandler : 
        ICommandHandlerWithResult<CreateHallCommand, long>,
        ICommandHandlerWithResult<DeleteHallCommand, bool>,
        ICommandHandlerWithResult<Hall, bool>
    {
        private readonly IDbManager _dbManager;

        public HallCommandHandler(IDbManager dbManager)
        {
            _dbManager = dbManager;
        }

        /// <summary>
        /// Создание холла
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public long Execute(CreateHallCommand command)
        {
            _dbManager.Open();
            return _dbManager.DbConnection.Insert(command);
        }

        public async Task<long> ExecuteAsync(CreateHallCommand command)
        {
            IDbManagerAsync dbManagerAsync = _dbManager as IDbManagerAsync;
            if (dbManagerAsync != null)
            {
                await dbManagerAsync.OpenAsync();

                Hall hall = new Hall();
                return await _dbManager.DbConnection.InsertAsync(command.Adapt(hall));
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
            _dbManager.Open();
            return _dbManager.DbConnection.Delete(new Hall() {Id = command.Id});
        }

        public async Task<bool> ExecuteAsync(DeleteHallCommand command)
        {
            IDbManagerAsync dbManagerAsync = _dbManager as IDbManagerAsync;
            if (dbManagerAsync != null)
            {
                await dbManagerAsync.OpenAsync();

                Hall hall = new Hall();
                return await _dbManager.DbConnection.DeleteAsync(command.Adapt(hall));
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
            _dbManager.Open();
            return _dbManager.DbConnection.Update(command);
        }

        public async Task<bool> ExecuteAsync(Hall command)
        {
            IDbManagerAsync dbManagerAsync = _dbManager as IDbManagerAsync;
            if (dbManagerAsync != null)
            {
                await dbManagerAsync.OpenAsync();
                return await _dbManager.DbConnection.UpdateAsync(command);
            }

            throw new NotImplementedException();
        }
    }
}
