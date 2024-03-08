using AngryMonkey.CloudWeb;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();

builder.Services.AddCloudWeb(config =>
{
    config.PageDefaults.SetTitle("Default Title");
    config.PageDefaults.AppendBundles(
         new CloudBundle() { Source = "bootstrap/bootstrap.css" },
            new CloudBundle() { Source = "app.css", MinOnRelease = false },
            new CloudBundle() { Source = "CloudWeb.BlazorDemo.styles.css", MinOnRelease = false },
            new CloudBundle() { Source = "bootstrap/bootstrap.css" });
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseBlazorFrameworkFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapRazorPages();
app.MapBlazorHub();

await app.RunAsync();
