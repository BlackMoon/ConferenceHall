using System;
using System.Threading.Tasks;
using Kit.Core.CQRS.Command;
using System.Collections.Generic;
using System.Data;
using domain.Common.Command;
using Kit.Dal.DbManager;
using Microsoft.Extensions.Logging;

namespace domain.Member.Command
{
    public class MemberCommandHandler : KeyObjectCommandHandler,
        ICommandHandlerWithResult<PartialUpdateCommand, bool>
    {
        public MemberCommandHandler(IDbManager dbManager, ILogger<MemberCommandHandler> logger) : base(dbManager, logger)
        {
        }

        public bool Execute(PartialUpdateCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> ExecuteAsync(PartialUpdateCommand command)
        {
            List<string> columns = new List<string>();

            DbManager.AddParameter("id", command.MemberId);

            if (command.Seat != null)
            {
                DbManager.AddParameter("seat", command.Seat);
                columns.Add("seat=@seat");
            }

            int updated = await DbManager.ExecuteNonQueryAsync(CommandType.Text, $"UPDATE conf_hall.conf_members SET {string.Join(",", columns)} WHERE id = @id");
            Logger.LogInformation($"Modified {updated} records");

            return updated > 0;
        }
    }
}
