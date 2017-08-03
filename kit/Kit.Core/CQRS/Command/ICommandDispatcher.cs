using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace Kit.Core.CQRS.Command
{
    /// <summary>
    /// Passed around to all allow dispatching a command and to be mocked by unit tests
    /// </summary>
    public interface ICommandDispatcher
    {
        /// <summary>
        /// Dispatches a command to its handler
        /// </summary>
        /// <typeparam name="TParameter">Command Type</typeparam>
        /// <param name="command">The command to be passed to the handler</param>
        void Dispatch<TParameter>(TParameter command) where TParameter : ICommand;

        Task DispatchAsync<TParameter>(TParameter command) where TParameter : ICommand;

        TResult Dispatch<TParameter, TResult>(TParameter command) where TParameter : ICommand;

        Task<TResult> DispatchAsync<TParameter, TResult>(TParameter command) where TParameter : ICommand;

        IEnumerable<ValidationResult> Validate<TCommand>(TCommand command) where TCommand : ICommand;
    }
}
