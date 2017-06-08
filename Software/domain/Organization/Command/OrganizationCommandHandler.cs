using domain.Common.Command;
using Kit.Dal.DbManager;
using Microsoft.Extensions.Logging;

namespace domain.Organization.Command
{
    public class OrganizationCommandHandler: 
        KeyObjectCommandHandler<Organization>
    {
        public OrganizationCommandHandler(IDbManager dbManager, ILogger logger) : base(dbManager, logger)
        {
        }
    }
}
