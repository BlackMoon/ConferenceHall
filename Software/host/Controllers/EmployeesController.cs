using System.Collections.Generic;
using System.Threading.Tasks;
using domain.Employee;
using domain.Employee.Query;
//using domain.Member;
using Kit.Core.CQRS.Command;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class EmployeesController : CqrsController
    {
        
        public EmployeesController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher) : base(commandDispatcher, queryDispatcher)
        {
         }
            // GET api/members/5
        [HttpGet("{id}")]
        public Task<Employee> Get(int id)
        {
            return QueryDispatcher.DispatchAsync<FindEmployeeByIdQuery, Employee>(new FindEmployeeByIdQuery() { Id = id });
        }

        // POST api/members
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/members/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/members/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        } 

            [HttpPost("/api/[controller]/search")]
        public Task<IEnumerable<Employee>> Search([FromBody]FindEmployeesQuery value)
        {
            return QueryDispatcher.DispatchAsync<FindEmployeesQuery, IEnumerable<Employee>>(value);
        }
    }
}
