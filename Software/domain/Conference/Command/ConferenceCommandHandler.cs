using System;
using System.Data;
using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Mapster;
using Microsoft.Extensions.Logging;
using NpgsqlTypes;
using TimeRange = domain.Common.Range<System.DateTime>;

namespace domain.Conference.Command
{
    public class ConferenceCommandHandler : 
        KeyObjectCommandHandler<Conference>,
        ICommandHandlerWithResult<ChangePeriodCommand, bool>,
        ICommandHandlerWithResult<MakeAppointmentCommand, TimeRange>,
        ICommandHandlerWithResult<DeleteConferenceCommand, bool>,
        ICommandHandlerWithResult<CreateConferenceCommand, int>
    {

        public ConferenceCommandHandler(IDbManager dbManager, ILogger<ConferenceCommandHandler> logger) : base(dbManager, logger)
        {
           
        }

        /// <summary>
        /// Создание конференции
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public int Execute(CreateConferenceCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<int> ExecuteAsync(CreateConferenceCommand command)
        {
            await DbManager.OpenAsync();

            Conference conference = new Conference();
            return await DbManager.DbConnection.InsertAsync(command.Adapt(conference));

        }

        public bool Execute(ChangePeriodCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> ExecuteAsync(ChangePeriodCommand command)
        {  
            // todo через update conference

            DbManager.AddParameter("id", command.ConferenceId);
            DbManager.AddParameter("start", command.Start);
            DbManager.AddParameter("end", command.Start.Add(command.Delta));
            
            int updated = await DbManager.ExecuteNonQueryAsync(CommandType.Text, "UPDATE conf_hall.conferences SET period = tsrange(@start, @end) WHERE id = @id");
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
