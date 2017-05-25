using System;
using System.Data;
using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Mapster;
using Microsoft.Extensions.Logging;

// ReSharper disable ExpressionIsAlwaysNull
namespace domain.Scheme.Command
{
    public class SchemeCommandHandler : KeyObjectCommandHandler<Scheme>,
        ICommandHandlerWithResult<CopySchemeCommand, Scheme>,
        ICommandHandlerWithResult<CreateSchemeCommand, int>, 
        ICommandHandlerWithResult<DeleteSchemeCommand, bool>
    {
        public SchemeCommandHandler(IDbManager dbManager, ILogger<SchemeCommandHandler> logger) : base(dbManager, logger)
        {
         
        }

        /// <summary>
        /// Копировать схему
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public Scheme Execute(CopySchemeCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<Scheme> ExecuteAsync(CopySchemeCommand command)
        {
            DbManager.AddParameter("phall_scheme_source_id", command.Id);

            IDataParameter pId = DbManager.AddParameter("phall_scheme_new_id");
            pId.Direction = ParameterDirection.Output;

            IDataParameter pName = DbManager.AddParameter("phall_scheme_new_name");
            pName.Direction = ParameterDirection.Output;
            
            int returnValue = await DbManager.ExecuteNonQueryAsync(CommandType.StoredProcedure, "hall_scheme_copy");
            Logger.LogInformation($"Modified {returnValue} records");

            return new Scheme()
            {
                Id = Convert.ToInt32(pId.Value),
                Name = (string)pName.Value
            };
        }

        public int Execute(CreateSchemeCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<int> ExecuteAsync(CreateSchemeCommand command)
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

        public override async Task<bool> ExecuteAsync(Scheme command)
        {
            DbManager.AddParameter("id", command.Id);
            DbManager.AddParameter("name", command.Name);
            DbManager.AddParameter("gridInterval", command.GridInterval);
            DbManager.AddParameter("plan", command.Plan.Trim('\r', '\n'));
           
            int updated = await DbManager.ExecuteNonQueryAsync(CommandType.Text, "UPDATE conf_hall.hall_scheme SET name = @name, grid_interval = @gridInterval, plan = @plan WHERE id = @id");

            Logger.LogInformation($"Modified {updated} records");

            return updated > 0;
        }
    }
}
