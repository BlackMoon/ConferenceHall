using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using domain.Element;
using domain.Element.Command;
using domain.Element.Query;
using Kit.Core.CQRS.Command;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class ElementsController : CqrsController
    {
        public ElementsController(ICommandDispatcher commandDispatcher, IQueryDispatcher queryDispatcher) : base(commandDispatcher, queryDispatcher)
        {
        }

        /// <summary>
        /// Список элементов в группе или по фильтру
        /// </summary>
        /// <param name="groupId"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpGet]
        public Task<IEnumerable<Element>> Get(int? groupId, string filter)
        {
            FindElementsQuery query = new FindElementsQuery()
            {
                Filter = filter,
                GroupId = groupId,
                UserId = 1          // todo userId from HttpContext.User
            };
            return QueryDispatcher.DispatchAsync<FindElementsQuery, IEnumerable<Element>>(query);
        }

        [HttpGet("{id}")]
        public Task<Element> Get(int id)
        {
            return QueryDispatcher.DispatchAsync<FindElementByIdQuery, Element>(new FindElementByIdQuery() { Id = id });
        }

        [HttpGet("/api/thumbnail/{id}")]
        public async Task<ActionResult> GetThumbnail(int id)
        {
            byte[] fileContents = {};
            string contentType = "image/*";

            Element el = await Get(id);
            if (el != null)
            {
                fileContents = el.Thumbnail;
                contentType = el.MimeType;
            }

            return new FileContentResult(fileContents, contentType);
        }

        [HttpPost("/api/favorites")]
        public Task AddToFavorites([FromBody]AddToFavoritesCommand value)
        {
            value.UserId = 1;  // todo from HttpContext.User
            return CommandDispatcher.DispatchAsync(value);
        }

        /// <summary>
        /// Отправляются файлы ('Content-Type', 'multipart/form-data')
        /// </summary>
        [HttpPost]
        public async Task Post(CreateElementCommand value)
        {
            value.UserId = 1;  // todo from HttpContext.User

            IFormFile f = Request.Form.Files.FirstOrDefault();
            if (f != null)
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    await f.CopyToAsync(ms);
                    value.Data = ms.ToArray();
                }
                value.ContentType = f.ContentType;
            }
            
            await CommandDispatcher.DispatchAsync<CreateElementCommand, int>(value);
        }

        /// <summary>
        /// Отправляются файлы ('Content-Type', 'multipart/form-data')
        /// </summary>
        [HttpPut("{id}")]
        public async Task Put(int id, Element value)
        {
            IFormFile f = Request.Form.Files.FirstOrDefault();
            if (f != null)
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    await f.CopyToAsync(ms);
                    value.Data = ms.ToArray();
                }
                value.MimeType = f.ContentType;
            }

            await CommandDispatcher.DispatchAsync<Element, bool>(value);
        }

        [HttpPost("/api/[controller]/delete")]
        public Task DeleteElements([FromBody]DeleteElementsCommand value)
        {
            value.UserId = 1;          // todo userId from HttpContext.User
            return CommandDispatcher.DispatchAsync(value);
        }
    }
}
