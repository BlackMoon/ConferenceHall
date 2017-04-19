using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using System.Threading.Tasks;

namespace domain.Common.Command
{
    public abstract class KeyObjectCommandHandler : ICommandHandlerWithResult<DeleteObjectByIdCommand, bool>
    {
        protected readonly IDbManager DbManager;

        public KeyObjectCommandHandler(IDbManager dbManager)
        {
            DbManager = dbManager;
        }

        public abstract bool Execute(DeleteObjectByIdCommand command);

        public abstract Task<bool> ExecuteAsync(DeleteObjectByIdCommand command);
    }
}
