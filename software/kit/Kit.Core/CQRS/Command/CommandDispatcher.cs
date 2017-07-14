using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Kit.Core.CQRS.Validation;
using Microsoft.Extensions.DependencyInjection;

namespace Kit.Core.CQRS.Command
{
    public class CommandDispatcher : ICommandDispatcher
    {
        private readonly IServiceProvider _serviceProvider;

        public CommandDispatcher(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public void Dispatch<TParameter>(TParameter command) where TParameter : ICommand
        {
            if (command == null)
                throw new ArgumentNullException(nameof(command));

            var handler = _serviceProvider.GetRequiredService<ICommandHandler<TParameter>>();
            handler.Execute(command);
        }

        public async Task DispatchAsync<TParameter>(TParameter command) where TParameter : ICommand
        {
            if (command == null)
                throw new ArgumentNullException(nameof(command));

            var handler = _serviceProvider.GetRequiredService<ICommandHandler<TParameter>>();
            await handler.ExecuteAsync(command).ConfigureAwait(false);
        }

        public TResult Dispatch<TParameter, TResult>(TParameter command) where TParameter : ICommand
        {
            if (command == null)
                throw new ArgumentNullException(nameof(command));

            var handler = _serviceProvider.GetRequiredService<ICommandHandlerWithResult<TParameter, TResult>>();
            return handler.Execute(command);
        }

        public async Task<TResult> DispatchAsync<TParameter, TResult>(TParameter command) where TParameter : ICommand
        {
            if (command == null)
                throw new ArgumentNullException(nameof(command));

            var handler = _serviceProvider.GetRequiredService<ICommandHandlerWithResult<TParameter, TResult>>();
            return await handler.ExecuteAsync(command).ConfigureAwait(false);
        }

        /// <summary>
        /// Валидация
        /// </summary>
        /// <typeparam name="TParameter"></typeparam>
        /// <param name="command"></param>
        /// <returns></returns>
        public IEnumerable<ValidationResult> Validate<TParameter>(TParameter command) where TParameter : ICommand
        {
            if (command == null)
                throw new ArgumentNullException(nameof(command));

            var handler = _serviceProvider.GetService<IValidationHandler<TParameter>>();
            return handler?.Validate(command);
        }
    }
}