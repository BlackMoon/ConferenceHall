using System.Collections.Generic;
using System.Threading.Tasks;
using domain.Common.Query;
using Dapper;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;

namespace domain.Message.Query
{
    public class MessageQueryHandler :
        KeyObjectQueryHandler,
        IQueryHandler<FindMessagesQuery, IEnumerable<Message>>
    {
        public MessageQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public IEnumerable<Message> Execute(FindMessagesQuery query)
        {
            throw new System.NotImplementedException();
        }

        public async Task<IEnumerable<Message>> ExecuteAsync(FindMessagesQuery query)
        {
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.conf_messages m")
                .Column("m.id")
                .Column("m.active")
                .Column("m.content")
                .Where("m.conf_id = @confId");

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QueryAsync<Message>(sqlBuilder.ToString(), new { confId = query.ConferenceId });
        }
    }
}
