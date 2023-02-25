using AngryMonkey.CloudWeb;
using Microsoft.AspNetCore.Components;
using System;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;

namespace Microsoft.Extensions.DependencyInjection;

public static class MvcServiceCollectionExtensions
{
    public static CloudWebConfig AddCloudWeb(this IServiceCollection services, CloudWebConfig cloudWeb)
    {
        //if (options.AutoAppendBlazorStyles)
        //{
        //    string assemblyName = Assembly.GetCallingAssembly().GetName().Name;
        //    options.SiteBundles.Insert(0, new CloudBundle() { Source = $"{assemblyName}.styles.css", MinOnRelease = false });
        //}

        services.AddSingleton(cloudWeb);
        services.AddScoped(s => new CloudPage());

        return cloudWeb;
    }
}
