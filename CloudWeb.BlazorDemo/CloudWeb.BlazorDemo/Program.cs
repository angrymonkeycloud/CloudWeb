using AngryMonkey.CloudWeb;
using CloudWeb.BlazorDemo.Components;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents()
    .AddInteractiveWebAssemblyComponents();


builder.Services.AddCloudWeb(config =>
{
    config.PageDefaults.SetTitle("Default Title");
    config.PageDefaults.AppendBundles(
         new CloudBundle() { Source = "bootstrap/bootstrap.css" },
            new CloudBundle() { Source = "app.css", MinOnRelease = false },
            new CloudBundle() { Source = "CloudWeb.BlazorDemo.styles.css", MinOnRelease = false },
            new CloudBundle() { Source = "bootstrap/bootstrap.css" });
});

builder.Services.AddScoped(_ => new HttpClient() { BaseAddress = new Uri("https://dsadas.com/") });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseWebAssemblyDebugging();
}
else
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode()
    .AddInteractiveWebAssemblyRenderMode();

app.Run();
