using System.Data;
using System.Threading;
using System.Threading.Tasks;

namespace Kit.Dal.DbManager
{
    public partial interface IDbManager
    {
        Task OpenAsync(CancellationToken cancellationToken = default(CancellationToken));

        Task<int> ExecuteNonQueryAsync(CommandType commandType, string commandText);

        Task<object> ExecuteScalarAsync(CommandType commandType, string commandText);
    }
}