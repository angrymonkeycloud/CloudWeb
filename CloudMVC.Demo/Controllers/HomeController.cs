using AngryMonkey.CloudWeb;
using CloudMVC.Demo.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;
using System.Reflection;

namespace CloudMVC.Demo.Controllers
{
    public class HomeController(CloudPage cloudPage) : CloudController(cloudPage)
    {
        public IActionResult Index()
        {
            CloudPage(string.Empty);

            return View();
        }

        public IActionResult Privacy()
        {
            CloudPage("Privacy");

            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}