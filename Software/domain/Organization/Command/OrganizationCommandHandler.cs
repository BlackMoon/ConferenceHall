using System;
using System.Data;
using System.Threading.Tasks;
using domain.Common.Command;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Mapster;
using Microsoft.Extensions.Logging;
using Dapper.Contrib.Extensions;

namespace domain.Organization.Command
{
    public class OrganizationCommandHandler: 
        KeyObjectCommandHandler<Organization>,
        ICommandHandlerWithResult<CreateOrganizationCommand, int>,
        ICommandHandler<DeleteNodesCommand>
    {
        public OrganizationCommandHandler(IDbManager dbManager, ILogger<OrganizationCommandHandler> logger) : base(dbManager, logger)
        {
        }

        

        public int Execute(CreateOrganizationCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<int> ExecuteAsync(CreateOrganizationCommand command)
        {
            Organization organization = new Organization();
            command.Adapt(organization);

            //organization.Data = ResizeImage(element.Data, MaxW, MaxH, element.MimeType);
            //element.Thumbnail = ResizeImage(element.Data, W, H, element.MimeType, 50);

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.InsertAsync(organization);
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

        public override async Task<bool> ExecuteAsync(Organization command)
        {
            //command.Data = ResizeImage(command.Data, MaxW, MaxH, command.MimeType);
            

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.UpdateAsync(command);
        }
    }
}
