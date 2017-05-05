using System.Data;
using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Mapster;
using Microsoft.Extensions.Logging;

namespace domain.Scheme.Command
{
    public class SchemeCommandHandler : KeyObjectCommandHandler<Scheme>,
        ICommandHandlerWithResult<CreateSchemeCommand, long>, 
        ICommandHandlerWithResult<DeleteSchemeCommand, bool>
    {
        private readonly ILogger<SchemeCommandHandler> _logger;

        public SchemeCommandHandler(IDbManager dbManager, ILogger<SchemeCommandHandler> logger) : base(dbManager)
        {
            _logger = logger;
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

        public override async Task<bool> ExecuteAsync(Scheme command)
        {
            DbManager.AddParameter("id", command.Id);
            DbManager.AddParameter("name", command.Name);
            DbManager.AddParameter("plan", command.Plan.Trim('\r', '\n'));

            await DbManager.OpenAsync();
            int updated = await DbManager.ExecuteNonQueryAsync(CommandType.Text, "UPDATE conf_hall.hall_scheme SET name = @name, plan = @plan WHERE id = @id");

            _logger.LogInformation($"Modified {updated} records");

            return updated > 0;
        }
    }
}
