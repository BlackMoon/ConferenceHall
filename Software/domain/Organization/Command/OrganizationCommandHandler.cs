using System;
using System.Data;
using System.Threading.Tasks;
using domain.Common;
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
        private const int H = 32;
        private const int W = 32;

        /// <summary>
        ///Максимально допустимые высота и ширина логотипа организации
        /// </summary>
        private const int MaxH = 256;
        private const int MaxW = 256;

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

            organization.Logo = ImageScaler.ResizeImage(command.Logo, MaxW, MaxH, command.ContentType);
            organization.Icon = ImageScaler.ResizeImage(command.Logo, W, H, command.ContentType, 50);

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
            command.Icon = ImageScaler.ResizeImage(command.Logo, W, H, command.ContentType, 50);
            command.Logo = ImageScaler.ResizeImage(command.Logo, MaxW, MaxH, command.ContentType);

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.UpdateAsync(command);
        }
    }
}
