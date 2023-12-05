using AngryMonkey.CloudWeb;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

builder.Services.AddScoped<CloudPage>();

await builder.Build().RunAsync();
