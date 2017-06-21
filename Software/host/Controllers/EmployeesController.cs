using System.Collections.Generic;
using System.Threading.Tasks;
using domain.Employee;
using domain.Employee.Command;
using domain.Employee.Query;
using Kit.Core.CQRS.Command;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class EmployeesController : CqrsController
    {
        public EmployeesController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher)
            : base(commandDispatcher, queryDispatcher)
        {

        }

        // GET api/members/5
        [HttpGet("{id}")]
        public Task<Employee> Get(int id)
        {
            return QueryDispatcher.DispatchAsync<FindEmployeeByIdQuery, Employee>(new FindEmployeeByIdQuery() {Id = id});
        }

        // POST api/members
        [HttpPost]
        public Task<int> Post([FromBody] CreateEmployeeCommand value)
        {
            return CommandDispatcher.DispatchAsync<CreateEmployeeCommand, int>(value);
        }

        // PUT api/members/5
        [HttpPut("{id}")]
        public Task Put(int id, [FromBody] Employee value)
        {
            return CommandDispatcher.DispatchAsync<Employee, bool>(value);
        }
    }
}
