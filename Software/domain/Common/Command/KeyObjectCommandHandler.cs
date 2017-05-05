using System.Threading.Tasks;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;

namespace domain.Common.Command
{
    public abstract class KeyObjectCommandHandler
    {
        protected readonly IDbManager DbManager;

        protected KeyObjectCommandHandler(IDbManager dbManager)
        {
            DbManager = dbManager;
        }
    }

    public abstract class KeyObjectCommandHandler<TParameter> : KeyObjectCommandHandler, ICommandHandlerWithResult<TParameter, bool> where TParameter : class, ICommand
    {
        protected KeyObjectCommandHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        /// <summary>
        /// Update
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public virtual bool Execute(TParameter command)
        {
            DbManager.Open();
            return DbManager.DbConnection.Update(command);
        }

        /// <summary>
        /// Update async
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public virtual async Task<bool> ExecuteAsync(TParameter command)
        {
            await DbManager.OpenAsync();
            return await DbManager.DbConnection.UpdateAsync(command);
        }
    }
}
