using AngryMonkey.CloudWeb;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

builder.Services.AddCloudWeb(new CloudWebConfig()
{
    PageDefaults = new()
    {
        Title = "Default Title",
        Bundles = [
            new CloudBundle() { Source = "bootstrap/bootstrap.css" },
            new CloudBundle() { Source = "app.css", MinOnRelease = false },
            new CloudBundle() { Source = "CloudWeb.BlazorDemo.styles.css", MinOnRelease = false },
            new CloudBundle() { Source = "bootstrap/bootstrap.css" }
        ]
    }
});

builder.Services.AddScoped(_ => new HttpClient() { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

await builder.Build().RunAsync();
