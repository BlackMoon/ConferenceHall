using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;

namespace domain.Element.Command
{
    public class ElementCommandHandler: KeyObjectCommandHandler, ICommandHandlerWithResult<Element, long>
    {
        public ElementCommandHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public long Execute(Element command)
        {
            DbManager.Open();
            return DbManager.DbConnection.Insert(command);
        }

        public async Task<long> ExecuteAsync(Element command)
        {
            


            await DbManager.OpenAsync();



            return await DbManager.DbConnection.InsertAsync(command);
        }
    }
}
