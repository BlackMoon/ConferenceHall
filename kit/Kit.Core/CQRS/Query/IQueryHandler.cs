using System.Threading.Tasks;

namespace Kit.Core.CQRS.Query
{
    /// <summary>
    /// Base interface for query handlers
    /// </summary>
    /// <typeparam name="TParameter">Query type</typeparam>
    /// <typeparam name="TResult">Query Result type</typeparam>
    public interface IQueryHandler<in TParameter, TResult> where TParameter : IQuery
    {
        /// <summary>
        /// Execute a query result from a query
        /// </summary>
        /// <param name="query">Query</param>
        /// <returns>Execute Query Result</returns>
        TResult Execute(TParameter query);

        /// <summary>
        /// Async execute a query result from a query
        /// </summary>
        /// <param name="query">Query</param>
        /// <returns>Task</returns>
        Task<TResult> ExecuteAsync(TParameter query);
    }
}
