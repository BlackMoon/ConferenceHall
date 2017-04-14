using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using domain.Document;
using domain.Document.Query;
using domain.Common.Query;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class DocumentsController : Controller
    {
        private IQueryDispatcher _queryDispatcher;

        public DocumentsController(IQueryDispatcher queryDispatcher)
        {
            _queryDispatcher = queryDispatcher;
        }

        // GET api/documents
        [HttpGet]
        public Task<IEnumerable<Document>> Get()
        {
            // todo _queryDispatcher.DispatchAsync<>()

            return _queryDispatcher.DispatchAsync<GetAllQuery, IEnumerable<Document>>(new GetAllQuery());
        }

        // GET api/documents/5
        [HttpGet("{id}")]
        public Task<Document> Get(int id)
        {
            return _queryDispatcher.DispatchAsync<FindDocumentByIdQuery, Document>(new FindDocumentByIdQuery() { Id = id });
        }

        // POST api/documents
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/documents/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/documents/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
