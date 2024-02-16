using AngryMonkey.CloudWeb;

namespace Microsoft.Extensions.DependencyInjection;

public static class MvcServiceCollectionExtensions
{
    public static CloudWebConfig AddCloudWeb(this IServiceCollection services, CloudWebConfig defaultConfig)
    {
        services.AddSingleton(defaultConfig);

        services.AddHttpContextAccessor();

        services.AddScoped<CloudPage>();

        return defaultConfig;
    }
}
