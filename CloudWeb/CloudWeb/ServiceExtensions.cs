using AngryMonkey.CloudWeb;
using Microsoft.Extensions.Options;

namespace Microsoft.Extensions.DependencyInjection;

public static class MvcServiceCollectionExtensions
{
    public static IServiceCollection AddCloudWeb(this IServiceCollection services, Action<CloudWebConfig> defaultConfig)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(defaultConfig);
        
        services.Configure(defaultConfig);

        services.AddHttpContextAccessor();

        services.AddScoped<CloudPage>();

        return services;
    }
}
