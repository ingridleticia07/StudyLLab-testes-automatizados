using Microsoft.AspNetCore.Mvc;

namespace StudyLab.Controllers
{
    public class AuthenticationController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
