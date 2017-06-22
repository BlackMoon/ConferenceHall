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
using System.Linq;

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

            await DbManager.OpenAsync();
            DbManager.BeginTransaction();
            
            int newId = await DbManager.ExecuteScalarAsync<int>(CommandType.Text, $"INSERT INTO conf_hall.conferences({string.Join(",", columns)}) values({string.Join(",", values)}) RETURNING id");

            // добавить новых участников
            if (command.Members.Any())
            {
                values.Clear();
                values.Capacity = command.Members.Count;

                DbManager.ClearParameters();
                for (int i = 0; i < command.Members.Count; i++)
                {
                    Member.Member m = command.Members[i];

                    DbManager.AddParameter($"confId{i}", newId);
                    DbManager.AddParameter($"employeeId{i}", m.EmployeeId);
                    DbManager.AddParameter($"seat{i}", m.Seat ?? (object)DBNull.Value);
                    DbManager.AddParameter($"state{i}::conf_member_state", m.State);

                    values.Add($"(@confId{i}, @seat{i}, @employeeId{i})");
                }

                await DbManager.ExecuteNonQueryAsync(CommandType.Text, $"INSERT INTO conf_hall.conf_members(conf_id, seat, employee_id) VALUES {string.Join(", ", values)}");
            }

            // добавить новые сообщения
            if (command.Messages.Any())
            {
                values.Clear();
                values.Capacity = command.Messages.Count;

                DbManager.ClearParameters();
                for (int i = 0; i < command.Messages.Count; i++)
                {
                    Message.Message m = command.Messages[i];

                    DbManager.AddParameter($"confId{i}", newId);
                    DbManager.AddParameter($"active{i}", m.Active);
                    DbManager.AddParameter($"content{i}", m.Content);

                    values.Add($"(@confId{i}, @active{i}, @content{i})");
                }

                await DbManager.ExecuteNonQueryAsync(CommandType.Text, $"INSERT INTO conf_hall.conf_members(conf_id, active, content) VALUES {string.Join(", ", values)}");
            }

            DbManager.CommitTransaction();
            return newId;
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
            DbManager.AddParameter("description", command.Description ?? (object)DBNull.Value);
            DbManager.AddParameter("startDate", DbType.DateTime, command.StartDate);
            DbManager.AddParameter("endDate", DbType.DateTime, command.EndDate);
            DbManager.AddParameter("state", command.State);

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

            await DbManager.OpenAsync();
            DbManager.BeginTransaction();

            int updated = await DbManager.ExecuteNonQueryAsync(CommandType.Text, $"UPDATE conf_hall.conferences SET {string.Join(",", columns)} WHERE id = @id");
            Logger.LogInformation($"Modified {updated} records");
            
            // удалить пред. участников
            await DbManager.ExecuteNonQueryAsync(CommandType.Text, "DELETE FROM conf_hall.conf_members WHERE conf_id = @id");

            // удалить пред. сообщения
            await DbManager.ExecuteNonQueryAsync(CommandType.Text, "DELETE FROM conf_hall.conf_messages WHERE conf_id = @id");

            // добавить новых участников
            if (command.Members.Any())
            {
                string[] values = new string[command.Members.Count];

                DbManager.ClearParameters();
                for (int i = 0; i < command.Members.Count; i++)
                {
                    Member.Member m = command.Members[i];

                    DbManager.AddParameter($"confId{i}", command.Id);
                    DbManager.AddParameter($"employeeId{i}", m.EmployeeId);
                    DbManager.AddParameter($"seat{i}", m.Seat ?? (object)DBNull.Value);
                    DbManager.AddParameter($"state{i}", m.State);

                    values[i] = $"(@confId{i}, @employeeId{i}, @seat{i}, @state{i}::conf_member_state)";
                }

                await DbManager.ExecuteNonQueryAsync(CommandType.Text, $"INSERT INTO conf_hall.conf_members(conf_id, employee_id, seat, state) VALUES {string.Join(", ", values)}");
            }
            
            // добавить новые сообщения
            if (command.Messages.Any())
            {
                string[] values = new string[command.Messages.Count];

                DbManager.ClearParameters();
                for (int i = 0; i < command.Messages.Count; i++)
                {
                    Message.Message m = command.Messages[i];

                    DbManager.AddParameter($"confId{i}", command.Id);
                    DbManager.AddParameter($"active{i}", m.Active);
                    DbManager.AddParameter($"content{i}", m.Content);

                    values[i] = $"(@confId{i}, @active{i}, @content{i})";
                }

                await DbManager.ExecuteNonQueryAsync(CommandType.Text, $"INSERT INTO conf_hall.conf_messages(conf_id, active, content) VALUES {string.Join(", ", values)}");
            }

            DbManager.CommitTransaction();
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
