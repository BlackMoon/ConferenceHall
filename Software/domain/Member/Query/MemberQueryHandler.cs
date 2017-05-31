using System;
using System.Threading.Tasks;
using domain.Common.Query;
using Dapper;
using Kit.Dal.DbManager;
using System.Collections.Generic;
using Kit.Core.CQRS.Query;


namespace domain.Member.Query
{
    public class MemberQueryHandler : KeyObjectQueryHandler<FindMemberByIdQuery, Member>,
         IQueryHandler<FindMembersQuery, IEnumerable<Member>>
    {

        public MemberQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public IEnumerable<Member> Execute(FindMembersQuery query)
            {
                throw new NotImplementedException();
            }

            public async Task<IEnumerable<Member>> ExecuteAsync(FindMembersQuery query)
            {
               
            SqlBuilder sqlBuilder = new SqlBuilder("conf_hall.employees s")
                .Column("s.id")
                .Column("s.name")
                .Column("s.job_title")
                .Column("s.emails_list")
                .Column("s.phones_list")
                .Column("u.role")
                 .Column("u.locked")
                 .Join("conf_hall.users u ON s.id = u.employee_id")
              //  .Where("s.id = @id")
                 .OrderBy("lower(s.name)"); 

            DynamicParameters param = new DynamicParameters();

                // может задаваться фильтр
                if (!string.IsNullOrEmpty(query.Filter))
                {
                    sqlBuilder.Where("lower(s.name) LIKE lower(@filter)");

                    param.Add("filter", query.Filter + "%");
                }
               
               await DbManager.OpenAsync();
               return await DbManager.DbConnection.QueryAsync<Member>(sqlBuilder.ToString(), param);
                  
        }





      
    }
}
