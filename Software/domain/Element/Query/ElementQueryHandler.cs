using System;
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
            throw new NotImplementedException();
        }

        
        public async Task<IEnumerable<Element>> ExecuteAsync(FindElementsQuery query)
        {
            // index = lower(name)
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.scheme_elements e")
                .Column("e.id")
                .Column("e.name")
                .Column("e.height")
                .Column("e.width")
                .OrderBy("lower(e.name)");

            DynamicParameters param = new DynamicParameters();

            // может задаваться либо фильтр
            if (!string.IsNullOrEmpty(query.Filter))
            {
                sqlBuilder.Where("lower(e.name) LIKE lower(@filter)");
                
                param.Add("filter", query.Filter + "%");
            }
            // либо группа(groupId)
            if (query.GroupId.HasValue)
            {
                sqlBuilder
                    .Join("scheme_element_locations l ON l.scheme_element_id = e.id")
                    .Join("scheme_element_groups g ON g.id = l.scheme_element_group_id")
                    .Where("g.id = @groupid AND (l.user_id = @userid OR l.user_id = user_system_id())");

                param.Add("groupid", query.GroupId);
                param.Add("userid", query.UserId);
            }

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.QueryAsync<Element>(sqlBuilder.ToString(), param);
        }
    }
}
