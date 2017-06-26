using Microsoft.AspNetCore.Mvc;

namespace host.Controllers
{
    [Route("api/[controller]")]
    public class NotificationController : Controller
    {
        
        // POST: api/Notification
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }
    }
}
