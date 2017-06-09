using System.Collections.Generic;
using System.Threading.Tasks;
using domain.Employee;
using domain.Employee.Query;
using domain.Member;
using Kit.Core.CQRS.Command;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;

namespace host.Controllers
{
    public class EmployeesController : CqrsController
    {
        public EmployeesController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher) : base(commandDispatcher, queryDispatcher)
        {
        }

        [HttpPost("/api/[controller]/search")]
        public Task<IEnumerable<Employee>> Search([FromBody]FindEmployeesQuery value)
        {
            return QueryDispatcher.DispatchAsync<FindEmployeesQuery, IEnumerable<Employee>>(value);
        }
    }
}
