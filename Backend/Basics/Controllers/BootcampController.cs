using Basics.Models;
using Microsoft.AspNetCore.Mvc;

namespace Basics.Controllers;

public class BootcampController : Controller
{
    public IActionResult Index()
    {
        return View(Repository.GetAllBootcamps);
    }
    public IActionResult Details(int? id)
    {
        if(id == null)
        {
            return RedirectToAction("List");
        }

        var bootcamp = Repository.GetBootcampById(id);
        if (bootcamp == null)
        {
            return NotFound();
        }
        return View(bootcamp);
    }
    public IActionResult List()
    {
        return View(Repository.GetAllBootcamps);
    }
}