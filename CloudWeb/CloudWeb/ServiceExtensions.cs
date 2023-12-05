using AngryMonkey.CloudWeb;
using Microsoft.AspNetCore.Components;
using System;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;

namespace Microsoft.Extensions.DependencyInjection;

public static class MvcServiceCollectionExtensions
{
    public static CloudWebConfig AddCloudWeb(this IServiceCollection services, CloudWebConfig defaultConfig)
    {
        services.AddSingleton(defaultConfig);
        services.AddScoped(_ => new CloudPage());

        return defaultConfig;
    }
}
