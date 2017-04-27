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
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.scheme_elements e")
                .Column("e.id")
                .Column("e.name")
                .Column("e.height")
                .Column("e.width")
                .Column("f.scheme_element_id IS NOT NULL favorite");

            DynamicParameters param = new DynamicParameters();
            param.Add("userid", query.UserId);

            // может задаваться либо фильтр
            if (!string.IsNullOrEmpty(query.Filter))
            {
                sqlBuilder
                    .LeftJoin("conf_hall.scheme_element_favorites f ON f.scheme_element_id = e.id AND f.user_id = @userid")
                    .Where("e.name LIKE @filter");
                
                param.Add("filter", query.Filter + "%");
            }
            // либо группа(группа favorites)
            if (!string.IsNullOrEmpty(query.Group))
            {
                sqlBuilder
                    .Column("true favorite")
                    .Join("conf_hall.scheme_element_favorites f ON f.scheme_element_id = e.id AND f.user_id = @userid");
            }

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QueryAsync<Element>(sqlBuilder.ToString(), param);
        }
    }
}
