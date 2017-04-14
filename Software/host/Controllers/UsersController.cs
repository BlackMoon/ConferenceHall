using domain.Common.Query;
using domain.SysUser;
using domain.SysUser.Query;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private IQueryDispatcher _queryDispatcher;

        public UsersController(IQueryDispatcher queryDispatcher)
        {
            _queryDispatcher = queryDispatcher;
        }

        // GET api/users
        [HttpGet]
        public Task<IEnumerable<SysUser>> Get()
        {
            // todo _queryDispatcher.DispatchAsync<>()

            return _queryDispatcher.DispatchAsync<GetAllQuery, IEnumerable<SysUser>>(new GetAllQuery());
        }

        // GET api/users/5
        [HttpGet("{id}")]
        public Task<SysUser> Get(int id)
        {
            return _queryDispatcher.DispatchAsync<FindSysUserByIdQuery, SysUser>(new FindSysUserByIdQuery() { Id = id });
        }

        // POST api/users
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/users/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/users/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
