using System.Threading.Tasks;

namespace Kit.Core.CQRS.Command
{
    /// <summary>
    /// Base interface for command handlers with result
    /// </summary>
    /// <typeparam name="TParameter">Command type</typeparam>
    /// <typeparam name="TResult">Command Result type</typeparam>
    public interface ICommandHandlerWithResult<in TParameter, TResult> where TParameter : ICommand
    {
        /// <summary>
        /// Execute a query result from a query
        /// </summary>
        /// <param name="command">Command</param>
        /// <returns>Execute Command Result</returns>
        TResult Execute(TParameter command);

        /// <summary>
        /// Async execute a query result from a query
        /// </summary>
        /// <param name="command">Command</param>
        /// <returns>Task</returns>
        Task<TResult> ExecuteAsync(TParameter command);
    }
}