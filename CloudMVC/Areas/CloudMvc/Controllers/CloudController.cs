﻿using AngryMonkey.CloudWeb;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace AngryMonkey.CloudMVC
{
    public class CloudController : Controller
    {
        public CloudPage CloudPage(string? title = null)
        {
            CloudPage cloudPage = new();

            if (!string.IsNullOrEmpty(title))
                cloudPage.SetTitle(title);

            cloudPage.SetIsCrawler(IsCrawler());
            cloudPage.SetCallingAssemblyName(Assembly.GetCallingAssembly().GetName().Name);

            string host = Request.Host.Host.ToLower();

            string[] robotsBlockUrls = new string[]
            {
                "azurewebsites.net"
            };

            if (robotsBlockUrls.Any(host.EndsWith))
            {
                cloudPage.SetIndexPage(false);
                cloudPage.SetFollowPage(false);
            }

            cloudPage.OnModified += (object? sender, EventArgs e) => { ViewData["CloudPageStatic"] = cloudPage; };

            ViewData.Add("CloudPageStatic", cloudPage);

            return cloudPage;
        }

        private bool IsCrawler()
        {
            string userAgeny = ControllerContext.HttpContext.Request.Headers.UserAgent.ToString().Trim().ToLower();

            return CloudWebConfig.CrawlersUserAgents.Any(userAgeny.Contains);
        }
    }
}
