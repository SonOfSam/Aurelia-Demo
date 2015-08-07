namespace AureliaDemo.ApiControllers
{    
    using Microsoft.AspNet.Authorization;
    using Microsoft.AspNet.Mvc;

    [Authorize]
    [Route("[controller]")]
    public class TestController : Controller
    {
        [HttpGet]
        public JsonResult Get()
        {
            return this.Json(new
            {
                message = "You See this then it's ok auth is  :" + this.User.Identity.IsAuthenticated,
            });
        }
    }
}
