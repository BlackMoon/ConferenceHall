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
using System.Collections.Generic;

namespace domain.Conference.Command
{
    public class ConferenceCommandHandler : 
        KeyObjectCommandHandler<Conference>,        
        ICommandHandlerWithResult<CreateConferenceCommand, int>,
        ICommandHandlerWithResult<DeleteConferenceCommand, bool>,
        ICommandHandlerWithResult<MakeAppointmentCommand, TimeRange>,
        ICommandHandlerWithResult<PartialUpdateCommand, bool>
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
            List<string> columns = new List<string>() { "subject", "description" },
                         values = new List<string>() { "@subject", "@description" };

            DbManager.AddParameter("subject", command.Subject);
            DbManager.AddParameter("description", command.Description ?? (object)DBNull.Value);

            if (command.StartDate.HasValue && command.EndDate.HasValue)
            {
                columns.Add("period");
                values.Add("tsrange(@startDate, @endDate)");

                DbManager.AddParameter("startDate", DbType.DateTime, command.StartDate);
                DbManager.AddParameter("endDate", DbType.DateTime, command.EndDate);
            }

            if (command.HallId.HasValue)
            {
                columns.Add("hall_id");
                values.Add("@hallId");

                DbManager.AddParameter("hallId", command.HallId);
            }

            if (command.SchemeId.HasValue)
            {
                columns.Add("hall_scheme_id");
                values.Add("@schemeId");

                DbManager.AddParameter("schemeId", command.SchemeId);
            }

            int inserted = await DbManager.ExecuteNonQueryAsync(CommandType.Text, $"INSERT INTO conf_hall.conferences({string.Join(",", columns)}) values({string.Join(",", values)})");
            Logger.LogInformation($"Inserted {inserted} conference");
            return inserted;
        }

        public override async Task<bool> ExecuteAsync(Conference command)
        {
            List<string> columns = new List<string>()
            {
                "subject = @subject",
                "description = @description",
                "period = tsrange(@startDate, @endDate)",
                "state = @state::conf_state"
            };

            DbManager.AddParameter("id", command.Id);
            DbManager.AddParameter("subject", command.Subject);
            DbManager.AddParameter("description", command.Description);
            DbManager.AddParameter("startDate", DbType.DateTime, command.StartDate);
            DbManager.AddParameter("endDate", DbType.DateTime, command.EndDate);
            DbManager.AddParameter("state", command.ConfState.ToString());

            if (command.HallId.HasValue)
            {
                columns.Add("hall_id = @hallId");
                DbManager.AddParameter("hallId", command.HallId);
            }

            if (command.SchemeId.HasValue)
            {
                columns.Add("hall_scheme_id = @schemeId");
                DbManager.AddParameter("schemeId", command.SchemeId);
            }

            int updated = await DbManager.ExecuteNonQueryAsync(CommandType.Text, $"UPDATE conf_hall.conferences SET {string.Join(",", columns)} WHERE id = @id");
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

        /// <summary>
        /// Частичное обновление конференции
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public bool Execute(PartialUpdateCommand command)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Частичное обновление конференции
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public async Task<bool> ExecuteAsync(PartialUpdateCommand command)
        {
            List<string> columns = new List<string>();

            DbManager.AddParameter("id", command.ConferenceId);           

            if (command.StartDate.HasValue && command.EndDate.HasValue)
            {
                DbManager.AddParameter("start", DbType.DateTime, command.StartDate);
                DbManager.AddParameter("end", DbType.DateTime, command.EndDate);
                columns.Add("period=tsrange(@start, @end)");
            }

            if (command.State.HasValue)
            {
                DbManager.AddParameter("state", command.State.ToString());  
                columns.Add("state=@state::conf_state");
            }

            int updated = await DbManager.ExecuteNonQueryAsync(CommandType.Text, $"UPDATE conf_hall.conferences SET {string.Join(",", columns)} WHERE id = @id");
            Logger.LogInformation($"Modified {updated} records");

            return updated > 0;
        }
    }
}
