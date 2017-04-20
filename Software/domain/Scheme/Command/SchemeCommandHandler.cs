using System;
using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Mapster;

namespace domain.Scheme.Command
{
    public class SchemeCommandHandler : KeyObjectCommandHandler,
        ICommandHandlerWithResult<CreateSchemeCommand, long>, 
        ICommandHandlerWithResult<DeleteSchemeCommand, bool>
    {
        public SchemeCommandHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public long Execute(CreateSchemeCommand command)
        {
            throw new System.NotImplementedException();
        }

        public Task<long> ExecuteAsync(CreateSchemeCommand command)
        {
            throw new System.NotImplementedException();
        }

        public bool Execute(DeleteSchemeCommand command)
        {
            DbManager.Open();
            Scheme scheme = new Scheme();
            return DbManager.DbConnection.Delete(command.Adapt(scheme));
        }

        public async Task<bool> ExecuteAsync(DeleteSchemeCommand command)
        {
            IDbManagerAsync dbManagerAsync = DbManager as IDbManagerAsync;
            if (dbManagerAsync != null)
            {
                await dbManagerAsync.OpenAsync();

                Scheme scheme = new Scheme();
                return await DbManager.DbConnection.DeleteAsync(command.Adapt(scheme));
            }

            throw new NotImplementedException();
        }
    }
}
