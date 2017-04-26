using System.Collections.Generic;
using System.Threading.Tasks;
using CacheManager.Core;
using domain.Common.Query;
using Dapper;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;

namespace domain.Element.Query
{
    public class ElementQueryHandler : 
        KeyObjectQueryHandler<FindElementByIdQuery, Element>, 
        IQueryHandler<FindElementsQuery, IEnumerable<Element>>
    {
        private const string SelectElements = "SELECT e.* FROM conf_hall.scheme_elements e";

        private readonly ICacheManager<Element> _cacheManager;

        public ElementQueryHandler(IDbManager dbManager, ICacheManager<Element> cacheManager) : base(dbManager)
        {
            _cacheManager = cacheManager;
        }
        
        public override async Task<Element> ExecuteAsync(FindElementByIdQuery query)
        {
            Element element = _cacheManager.Get(query.Id.ToString());
            if (element == null)
            {
                element = await base.ExecuteAsync(query);
                _cacheManager.Add(element.Id.ToString(), element);
            }

            return element;
        }

        public IEnumerable<Element> Execute(FindElementsQuery query)
        {
            throw new System.NotImplementedException();
        }

        
        public async Task<IEnumerable<Element>> ExecuteAsync(FindElementsQuery query)
        {
            await DbManager.OpenAsync();

            object param = null;
            string sql = SelectElements;

            // может задваться либо фильтр
            if (!string.IsNullOrEmpty(query.Filter))
            {
                sql += " WHERE e.name LIKE @filter";
                param = new { filter = query.Filter + "%" };
            }
            // либо группа(favorites)
            if (!string.IsNullOrEmpty(query.Group))
            {
                sql += " JOIN conf_hall.scheme_element_favorites f ON f.scheme_element_id = e.id WHERE f.user_id = @userid";
                param = new { userid = query.UserId };
            }

            return await DbManager.DbConnection.QueryAsync<Element>(sql, param);
        }
    }
}
