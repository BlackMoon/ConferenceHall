using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Mapster;

namespace domain.Scheme.Command
{
    public class SchemeCommandHandler : KeyObjectCommandHandler<Scheme>,
        ICommandHandlerWithResult<CreateSchemeCommand, long>, 
        ICommandHandlerWithResult<DeleteSchemeCommand, bool>,
        ICommandHandlerWithResult<Scheme, bool>
    {
        public SchemeCommandHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public long Execute(CreateSchemeCommand command)
        {
            DbManager.Open();
            Scheme scheme = new Scheme();
            return DbManager.DbConnection.Insert(command.Adapt(scheme));
        }

        public async Task<long> ExecuteAsync(CreateSchemeCommand command)
        {
            await DbManager.OpenAsync();

            Scheme scheme = new Scheme();
            return await DbManager.DbConnection.InsertAsync(command.Adapt(scheme));
        }

        public bool Execute(DeleteSchemeCommand command)
        {
            DbManager.Open();
            Scheme scheme = new Scheme();
            return DbManager.DbConnection.Delete(command.Adapt(scheme));
        }

        public async Task<bool> ExecuteAsync(DeleteSchemeCommand command)
        {
            await DbManager.OpenAsync();

            Scheme scheme = new Scheme();
            return await DbManager.DbConnection.DeleteAsync(command.Adapt(scheme));
        }
    }
}
