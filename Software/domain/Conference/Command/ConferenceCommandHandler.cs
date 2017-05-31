using System;
using System.Data;
using System.Text;
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
            DbManager.AddParameter("subject", command.Subject);
            DbManager.AddParameter("description", command.Description);
            DbManager.AddParameter("startDate", command.Period.LowerBound);
            DbManager.AddParameter("endDate", command.Period.UpperBound);

            var sbParams = new StringBuilder();
            var sbValues = new StringBuilder();
            sbParams.Append("subject, description, period");
            sbValues.Append("@subject, @description, tsrange(@startDate, @endDate)");
            if (command.HallId.HasValue)
            {
                sbParams.Append(",hall_id");
                sbValues.Append(",@hall_id");
                DbManager.AddParameter("hall_id", command.HallId);
            }
            if (command.HallSchemeId.HasValue)
            {
                sbParams.Append(",hall_scheme_id");
                sbParams.Append(",@hall_scheme_id");
                DbManager.AddParameter("hall_scheme_id", command.HallSchemeId);
            }

            int inserted = await DbManager.ExecuteNonQueryAsync(CommandType.Text, $"INSERT INTO conf_hall.conferences({sbParams}) values({sbValues})");
            Logger.LogInformation($"Inserted {inserted} conference");
            return inserted;
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
