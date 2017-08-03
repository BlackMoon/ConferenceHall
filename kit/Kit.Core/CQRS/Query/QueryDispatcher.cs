using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace Kit.Core.CQRS.Query
{
    public class QueryDispatcher : IQueryDispatcher
    {
        private readonly IServiceProvider _serviceProvider;

        public QueryDispatcher(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public TResult Dispatch<TParameter, TResult>(TParameter query) where TParameter : IQuery
        {
            if (query == null)
                throw new ArgumentNullException(nameof(query));

            var handler = _serviceProvider.GetRequiredService<IQueryHandler<TParameter, TResult>>();
            return handler.Execute(query);
        }

        public async Task<TResult> DispatchAsync<TParameter, TResult>(TParameter query) where TParameter : IQuery
        {
            if (query == null)
                throw new ArgumentNullException(nameof(query));

            var handler = _serviceProvider.GetRequiredService<IQueryHandler<TParameter, TResult>>();
            return await handler.ExecuteAsync(query).ConfigureAwait(false);
        }
    }
}