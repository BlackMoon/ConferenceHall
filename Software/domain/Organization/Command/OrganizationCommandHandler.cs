using Dapper.Contrib.Extensions;
using domain.Common.Command;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Mapster;
using Microsoft.Extensions.Logging;
using System;
using System.Data;
using System.Threading.Tasks;

namespace domain.Organization.Command
{
    public class OrganizationCommandHandler: 
        KeyObjectCommandHandler<Organization>,
        ICommandHandler<DeleteNodesCommand>,
        ICommandHandlerWithResult<CreateOrganizationCommand, int>,
        ICommandHandlerWithResult<DeleteLogoCommand, bool>

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

        public bool Execute(DeleteLogoCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> ExecuteAsync(DeleteLogoCommand command)
        {
            DbManager.AddParameter("id", command.Id);

            await DbManager.OpenAsync();
            int updated = await DbManager.ExecuteNonQueryAsync(CommandType.Text, "UPDATE conf_hall.organizations SET logo = NULL, icon = NULL WHERE id = @id");
            Logger.LogInformation($"Modified {updated} records");

            return updated > 0;
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

            DbManager.AddParameter("pid", command.Id);
            DbManager.AddParameter("paddress", command.Address ?? (object)DBNull.Value);
            DbManager.AddParameter("pcode", command.Code);
            DbManager.AddParameter("pdescription", command.Description ?? (object)DBNull.Value);
            DbManager.AddParameter("pname", command.Name);
            DbManager.AddParameter("picon", command.Icon ?? (object)DBNull.Value);
            DbManager.AddParameter("plogo", command.Logo ?? (object)DBNull.Value);

            await DbManager.OpenAsync();
            int updated = await DbManager.ExecuteNonQueryAsync(CommandType.StoredProcedure, "organization_change");
            Logger.LogInformation($"Modified {updated} records");

            return updated > 0;
        }
    }
}
