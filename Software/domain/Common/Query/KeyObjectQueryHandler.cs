using System;
using System.Threading.Tasks;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;
using System.Collections.Generic;
using System.Data;

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

        public IEnumerable<TResult> Execute(GetAllQuery query)
        {
            DbManager.Open();
            return DbManager.DbConnection.GetAll<TResult>();
        }

        public virtual async Task<TResult> ExecuteAsync(TQuery query)
        {
            IDbManagerAsync dbManagerAsync = DbManager as IDbManagerAsync;
            if (dbManagerAsync != null)
            {
                await dbManagerAsync.OpenAsync();
                return await DbManager.DbConnection.GetAsync<TResult>(query.Id);
            }

            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TResult>> ExecuteAsync(GetAllQuery query)
        {
            IDbManagerAsync dbManagerAsync = DbManager as IDbManagerAsync;
            if (dbManagerAsync != null)
            {
                await dbManagerAsync.OpenAsync();
                return await DbManager.DbConnection.GetAllAsync<TResult>();
            }
            throw new NotImplementedException();
        }
    }
}
