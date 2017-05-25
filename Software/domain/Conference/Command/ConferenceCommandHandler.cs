using System;
using System.Data;
using System.Threading.Tasks;
using domain.Common;
using domain.Common.Command;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Microsoft.Extensions.Logging;

using TimeRange = domain.Common.Range<System.DateTime>;

namespace domain.Conference.Command
{
    public class ConferenceCommandHandler : 
        KeyObjectCommandHandler<Conference>,
        ICommandHandlerWithResult<MakeAppointmentCommand, TimeRange>
    {

        public ConferenceCommandHandler(IDbManager dbManager, ILogger<ConferenceCommandHandler> logger) : base(dbManager, logger)
        {
           
        }

        public TimeRange Execute(MakeAppointmentCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<TimeRange> ExecuteAsync(MakeAppointmentCommand command)
        {    
            DbManager.AddParameter("pconference_id", command.ConferenceId);
            DbManager.AddParameter("phall_id", command.HallId);

            IDataParameter pDateStart = DbManager.AddParameter("pdate_start", command.DateStart);
            pDateStart.Direction = ParameterDirection.InputOutput;

            IDataParameter pDateEnd = DbManager.AddParameter("pdate_end", command.DateEnd);
            pDateEnd.Direction = ParameterDirection.InputOutput;

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
