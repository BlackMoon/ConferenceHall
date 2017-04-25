using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using domain.Element;
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

        [HttpGet]
        public Task<IEnumerable<Element>> Get(string group, string filter)
        {
            return QueryDispatcher.DispatchAsync<FindElementsQuery, IEnumerable<Element>>(new FindElementsQuery() { Filter = filter, Group = group, UserId = 1 });
        }

        [HttpGet("/api/thumbnail/{id}")]
        public async Task<ActionResult> GetThumbnail(int id)
        {
            Element el = await QueryDispatcher.DispatchAsync<FindElementByIdQuery, Element>(new FindElementByIdQuery());
            if (el != null)
                return new FileContentResult(el.Thumbnail, el.MimeType);

            return NoContent();
        }

        /// <summary>
        /// Отправляются файлы ('Content-Type', 'multipart/form-data')
        /// </summary>
        [HttpPost]
        public async Task Post(Element value)
        {
            IFormFile f = Request.Form.Files.FirstOrDefault();
            if (f != null)
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    await f.CopyToAsync(ms);
                    value.Data = value.Thumbnail = ms.ToArray();
                }
            }
            value.MimeType = "";
            await CommandDispatcher.DispatchAsync<Element, long>(value);
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
