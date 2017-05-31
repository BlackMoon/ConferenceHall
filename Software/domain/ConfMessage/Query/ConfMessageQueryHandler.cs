using System.Collections.Generic;
using System.Threading.Tasks;
using domain.Common.Query;
using Kit.Dal.DbManager;
using Dapper;
using Kit.Core.CQRS.Query;

namespace domain.ConfMessage.Query
{
    public class ConfMessageQueryHandler : 
        KeyObjectQueryHandler<FindConfMessageByIdQuery, ConfMessage>,
        IQueryHandler<FindConfMessageQuery, IEnumerable<ConfMessage>>
    {
        public ConfMessageQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public IEnumerable<ConfMessage> Execute(FindConfMessageQuery query)
        {
            throw new System.NotImplementedException();
        }

        public async Task<IEnumerable<ConfMessage>> ExecuteAsync(FindConfMessageQuery query)
        {

            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.conf_messages s")
                .Column("s.id")
                .Column("s.conf_id")
                .Column("s.message")
                .Column("s.active")
                 //  .Where("s.id = @id")
                 .OrderBy("s.id");

            DynamicParameters param = new DynamicParameters();

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QueryAsync<ConfMessage>(sqlBuilder.ToString(), param);

        }
    }
}
