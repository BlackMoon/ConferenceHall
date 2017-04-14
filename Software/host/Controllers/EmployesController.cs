using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using domain.Employe;
using domain.Employe.Query;
using domain.Common.Query;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class EmployesController : Controller
    {
        private IQueryDispatcher _queryDispatcher;

        public EmployesController(IQueryDispatcher queryDispatcher)
        {
            _queryDispatcher = queryDispatcher;
        }

        // GET api/employes
        [HttpGet]
        public Task<IEnumerable<Employe>> Get()
        {
            return _queryDispatcher.DispatchAsync<GetAllQuery, IEnumerable<Employe>>(new GetAllQuery());
        }

        // GET api/employes/5
        [HttpGet("{id}")]
        public Task<Employe> Get(int id)
        {
            return _queryDispatcher.DispatchAsync<FindEmployeByIdQuery, Employe>(new FindEmployeByIdQuery() { Id = id });
        }

        // POST api/employes
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/employes/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/employes/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
