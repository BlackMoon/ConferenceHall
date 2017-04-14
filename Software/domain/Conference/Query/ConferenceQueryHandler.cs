using domain.Common.Query;
using Kit.Dal.DbManager;

namespace domain.Conference.Query
{
    public class ConferenceQueryHandler : KeyObjectQueryHandler<FindConferenceByIdQuery, Conference>
    {
        public ConferenceQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }
    }
}
