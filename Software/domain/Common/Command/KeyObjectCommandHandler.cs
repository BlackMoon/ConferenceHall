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
}
