using System;
using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;

namespace domain.Hall.Command
{
    public class HallCommandHandler : KeyObjectCommandHandler, ICommandHandlerWithResult<CreateHallCommand, long>, ICommandHandlerWithResult<Hall, bool>
    {
        public HallCommandHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public override bool Execute(DeleteObjectByIdCommand command)
        {
            DbManager.Open();
            return DbManager.DbConnection.Delete(new Hall() {Id = command.Id});
        }

        public override async Task<bool> ExecuteAsync(DeleteObjectByIdCommand command)
        {
            IDbManagerAsync dbManagerAsync = DbManager as IDbManagerAsync;
            if (dbManagerAsync != null)
            {
                await dbManagerAsync.OpenAsync();
                return await DbManager.DbConnection.DeleteAsync(new Hall() { Id = command.Id });
            }

            throw new NotImplementedException();
        }

        public long Execute(CreateHallCommand command)
        {
            DbManager.Open();
            return DbManager.DbConnection.Insert(command);
        }

        public async Task<long> ExecuteAsync(CreateHallCommand command)
        {
            IDbManagerAsync dbManagerAsync = DbManager as IDbManagerAsync;
            if (dbManagerAsync != null)
            {
                await dbManagerAsync.OpenAsync();
                return await DbManager.DbConnection.InsertAsync(command);
            }

            throw new NotImplementedException();
        }

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
