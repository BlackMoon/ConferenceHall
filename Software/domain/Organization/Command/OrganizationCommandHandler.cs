using System;
using System.Data;
using System.Threading.Tasks;
using domain.Common.Command;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Microsoft.Extensions.Logging;

namespace domain.Organization.Command
{
    public class OrganizationCommandHandler: 
        KeyObjectCommandHandler<Organization>,
        ICommandHandler<DeleteNodesCommand>
    {
        public OrganizationCommandHandler(IDbManager dbManager, ILogger<OrganizationCommandHandler> logger) : base(dbManager, logger)
        {
        }

        public void Execute(DeleteNodesCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task ExecuteAsync(DeleteNodesCommand command)
        {
            DbManager.AddParameter("employeeIds", command.EmployeeIds);
            DbManager.AddParameter("orgIds", command.OrganizationIds);

            await DbManager.OpenAsync();

            await DbManager.ExecuteNonQueryAsync(CommandType.Text, "DELETE FROM conf_hall.employees WHERE id = ANY(@employeeIds)");
            await DbManager.ExecuteNonQueryAsync(CommandType.Text, "DELETE FROM conf_hall.organizations WHERE id = ANY(@orgIds)");
        }
    }
}
