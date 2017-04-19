
using System.Collections.Generic;
using System.Threading.Tasks;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using domain.Employee;
using domain.Employee.Query;
using domain.Common.Query;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class EmployeesController : Controller
    {
        private IQueryDispatcher _queryDispatcher;

        public EmployeesController(IQueryDispatcher queryDispatcher)
        {
            _queryDispatcher = queryDispatcher;
        }

        // GET api/employees
        [HttpGet]
        public Task<IEnumerable<Employee>> Get()
        {
            return _queryDispatcher.DispatchAsync<GetAllQuery, IEnumerable<Employee>>(new GetAllQuery());
        }

        // GET api/employees/5
        [HttpGet("{id}")]
        public Task<Employee> Get(int id)
        {
            return _queryDispatcher.DispatchAsync<FindEmployeByIdQuery, Employee>(new FindEmployeByIdQuery() { Id = id });
        }

        // POST api/employees
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/employees/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/employees/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
