using System;
using System.Threading.Tasks;
using Kit.Core.CQRS.Command;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using domain.Common.Command;
using Dapper;
using Kit.Dal.DbManager;
using Microsoft.Extensions.Logging;

namespace domain.Member.Command
{
    public class MemberCommandHandler : KeyObjectCommandHandler,
        ICommandHandler<DeleteMembersCommand>,
        ICommandHandlerWithResult<CreateMembersCommand, IEnumerable<Member>>,
        ICommandHandlerWithResult<PartialUpdateCommand, bool>
    {
        public MemberCommandHandler(IDbManager dbManager, ILogger<MemberCommandHandler> logger) : base(dbManager, logger)
        {
        }

        public IEnumerable<Member> Execute(CreateMembersCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Member>> ExecuteAsync(CreateMembersCommand command)
        {
            IEnumerable<Member> inserted = null;

            // добавить новых участников
            if (command.Members != null && command.Members.Any())
            {
                DynamicParameters param = new DynamicParameters();
                string[] values = new string[command.Members.Count];

                for (int i = 0; i < command.Members.Count; i++)
                {
                    Member m = command.Members[i];

                    param.Add($"confId{i}", command.ConferenceId);
                    param.Add($"employeeId{i}", m.EmployeeId);

                    values[i] = $"(@confId{i}, @employeeId{i})";
                }

                await DbManager.OpenAsync();
                inserted = await DbManager.DbConnection.QueryAsync<Member>("INSERT INTO conf_hall.conf_members(conf_id, employee_id) " +
                                                                           $"VALUES {string.Join(", ", values)} " +
                                                                           "ON CONFLICT  ON CONSTRAINT conf_members_uniq_key DO NOTHING " +
                                                                           "RETURNING id, employee_id", param);
            }

            return inserted;
        }

        public void Execute(DeleteMembersCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task ExecuteAsync(DeleteMembersCommand command)
        {
            DbManager.AddParameter("Ids", command.Ids);

            await DbManager.OpenAsync();
            await DbManager.ExecuteNonQueryAsync(CommandType.Text, "DELETE FROM conf_hall.conf_members WHERE id = ANY(@Ids)");
        }

        public bool Execute(PartialUpdateCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> ExecuteAsync(PartialUpdateCommand command)
        {
            List<string> columns = new List<string>() { "seat = @seat" };

            DbManager.AddParameter("id", command.MemberId);
            DbManager.AddParameter("seat", command.Seat ?? (object)DBNull.Value);

            if (command.State.HasValue)
            {
                DbManager.AddParameter("state", command.State);
                columns.Add("state = @state");
            }

            int updated = await DbManager.ExecuteNonQueryAsync(CommandType.Text, $"UPDATE conf_hall.conf_members SET {string.Join(",", columns)} WHERE id = @id");
            Logger.LogInformation($"Modified {updated} records");

            return updated > 0;
        }
    }
}
