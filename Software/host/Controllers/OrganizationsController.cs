using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using domain.Organization;
using domain.Organization.Command;
using domain.Organization.Query;
using Kit.Core.CQRS.Command;
using Microsoft.AspNetCore.Http;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class OrganizationsController : CqrsController
    {
        // GET api/organizations
        public OrganizationsController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher) : base(commandDispatcher, queryDispatcher)
        {
        }

        [HttpGet]
        public Task<IEnumerable<OrganizationNode>> Get(bool emplSearch, int? orgId, string filter)
        {
            FindOrganizationsQuery query = new FindOrganizationsQuery()
            {
                EmployeeSearch = emplSearch,
                OrganizationId = orgId,
                Filter = filter
            };
            return QueryDispatcher.DispatchAsync<FindOrganizationsQuery, IEnumerable<OrganizationNode>>(query);
        }

        // GET api/organizations/5
        [HttpGet("{id}")]
        public Task<Organization> Get(int id)
        {
            return QueryDispatcher.DispatchAsync<FindOrganizationByIdQuery, Organization>(new FindOrganizationByIdQuery() { Id = id });
        }

        /// <summary>
        /// Получить иконку логотипа организации (для отображения в дереве)
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("/api/icon/{id}")]
        public async Task<ActionResult> GetIcon(int id)
        {
            return await GetLogo(id, true);
        }

        /// <summary>
        /// Получить логотип организации
        /// </summary>
        /// <param name="id"></param>
        /// <param name="icon">иконка?</param>
        /// <returns></returns>
        [HttpGet("/api/logo/{id}")]
        public async Task<ActionResult> GetLogo(int id, bool icon = false)
        {
            string contentType = "image/*";
            
            FindOrganizationLogoQuery query = new FindOrganizationLogoQuery()
            {
                Id = id,
                Icon = icon
            };

            byte[] fileContents = await QueryDispatcher.DispatchAsync<FindOrganizationLogoQuery, byte[]>(query);
            return new FileContentResult(fileContents, contentType);
        }

        /// <summary>
        /// Отправляется файлы ('Content-Type', 'multipart/form-data')
        /// </summary>
        [HttpPost]
        public async Task<int> Post(CreateOrganizationCommand value)
        {
            IFormFile f = Request.Form.Files.FirstOrDefault();
            if (f != null)
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    await f.CopyToAsync(ms);
                    value.Logo = ms.ToArray();
                }
                value.ContentType = f.ContentType;
            }

            return await CommandDispatcher.DispatchAsync<CreateOrganizationCommand, int>(value);
        }

        /// <summary>
        /// Отправляется файлы ('Content-Type', 'multipart/form-data')
        /// </summary>
        [HttpPut("{id}")]
        public async Task Put(int id, Organization value)
        {
            IFormFile f = Request.Form.Files.FirstOrDefault();
            if (f != null)
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    await f.CopyToAsync(ms);
                    value.Logo = ms.ToArray();
                }
                value.ContentType = f.ContentType;
            }

            await CommandDispatcher.DispatchAsync<Organization, bool>(value);
        }
        
        [HttpPost("/api/[controller]/delete")]
        public Task DeleteNodes([FromBody]DeleteNodesCommand value)
        {
            return CommandDispatcher.DispatchAsync<DeleteNodesCommand>(value);
        }
    }
}
