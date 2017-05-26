using System;
using System.Data;
using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Mapster;
using Microsoft.Extensions.Logging;

using TimeRange = domain.Common.Range<System.DateTime>;

namespace domain.Conference.Command
{
    public class ConferenceCommandHandler : 
        KeyObjectCommandHandler<Conference>,
        ICommandHandlerWithResult<ChangePeriodCommand, bool>,
        ICommandHandlerWithResult<MakeAppointmentCommand, TimeRange>,
        ICommandHandlerWithResult<DeleteConferenceCommand, bool>
    {

        public ConferenceCommandHandler(IDbManager dbManager, ILogger<ConferenceCommandHandler> logger) : base(dbManager, logger)
        {
           
        }

        public bool Execute(ChangePeriodCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> ExecuteAsync(ChangePeriodCommand command)
        {
            DbManager.AddParameter("id", command.ConferenceId);

            int updated = await DbManager.ExecuteNonQueryAsync(CommandType.Text, "UPDATE conf_hall.conferences SET name = @name, grid_interval = @gridInterval, plan = @plan WHERE id = @id");
            Logger.LogInformation($"Modified {updated} records");

            return updated > 0;
        }

        public bool Execute(DeleteConferenceCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> ExecuteAsync(DeleteConferenceCommand command)
        {
            await DbManager.OpenAsync();

            Conference conference = new Conference();
            return await  DbManager.DbConnection.DeleteAsync(command.Adapt(conference));
        }


        public TimeRange Execute(MakeAppointmentCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<TimeRange> ExecuteAsync(MakeAppointmentCommand command)
        {    
            DbManager.AddParameter("pconference_id", command.ConferenceId);
            DbManager.AddParameter("phall_id", command.HallId);

            IDataParameter pDateStart = DbManager.AddParameter("pdate_start", DbType.DateTime, command.Start, ParameterDirection.InputOutput),
                           pDateEnd = DbManager.AddParameter("pdate_end", DbType.DateTime, command.Start.Add(command.Duration), ParameterDirection.InputOutput);

            int returnValue = await DbManager.ExecuteNonQueryAsync(CommandType.StoredProcedure, "conference_aprovement_make");
            Logger.LogInformation($"Modified {returnValue} records");

            return 
                new TimeRange()
                {
                    LowerBound = Convert.ToDateTime(pDateStart.Value),
                    UpperBound = Convert.ToDateTime(pDateEnd.Value)
                };
        }
    }
}
