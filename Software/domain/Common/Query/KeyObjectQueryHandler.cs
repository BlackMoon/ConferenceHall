using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace domain.Common.Query
{
    public abstract class KeyObjectQueryHandler<TQuery, TResult> : IQueryHandler<TQuery, TResult>, IQueryHandler<GetAllQuery, IEnumerable<TResult>>
        where TQuery : FindObjectByIdQuery 
        where TResult : class
    {
        protected readonly IDbManager DbManager;

        protected KeyObjectQueryHandler(IDbManager dbManager)
        {
            DbManager = dbManager;
        }       

        public virtual TResult Execute(TQuery query)
        {
            DbManager.Open();
            return DbManager.DbConnection.Get<TResult>(query.Id);
        }

        public virtual IEnumerable<TResult> Execute(GetAllQuery query)
        {
            DbManager.Open();
            return DbManager.DbConnection.GetAll<TResult>();
        }

        public virtual async Task<TResult> ExecuteAsync(TQuery query)
        {
            await DbManager.OpenAsync();
            return await DbManager.DbConnection.GetAsync<TResult>(query.Id);}

        public virtual async Task<IEnumerable<TResult>> ExecuteAsync(GetAllQuery query)
        {
            await DbManager.OpenAsync();
            return await DbManager.DbConnection.GetAllAsync<TResult>();
        }
    }
}
