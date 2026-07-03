# ☁ CloudWeb.Server

<p align="center">
  <img src="CloudWeb.Server/AngryMonkeyCloudLogo-64x64.png" alt="Angry Monkey Cloud Logo" width="64" />
</p>

<p align="center">
  <a href="https://www.nuget.org/packages/AngryMonkey.CloudWeb.Server">
    <img src="https://img.shields.io/nuget/v/AngryMonkey.CloudWeb.Server?style=flat-square&logo=nuget&label=NuGet&color=blue" alt="NuGet Version" />
  </a>
  <a href="https://www.nuget.org/packages/AngryMonkey.CloudWeb.Server">
    <img src="https://img.shields.io/nuget/dt/AngryMonkey.CloudWeb.Server?style=flat-square&logo=nuget&label=Downloads&color=blue" alt="NuGet Downloads" />
  </a>
  <a href="https://github.com/angrymonkeycloud/CloudWeb/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/angrymonkeycloud/CloudWeb/dotnet.yml?branch=main&style=flat-square&logo=github&label=Build" alt="Build Status" />
  </a>
  <a href="https://github.com/angrymonkeycloud/CloudWeb/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/angrymonkeycloud/CloudWeb?style=flat-square&label=License" alt="License" />
  </a>
  <img src="https://img.shields.io/badge/.NET-10.0-512BD4?style=flat-square&logo=dotnet" alt=".NET 10" />
</p>

<p align="center">
  An ASP.NET Core library for managing page <code>&lt;head&gt;</code> content — titles, meta tags, favicons,
  SEO robots, and static asset bundles — for <strong>Blazor</strong> and <strong>MVC</strong> apps via a clean fluent API.
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| **Page Title** | Per-page title with global prefix/suffix and space-aware add-ons capped at 64 chars |
| **SEO Meta Tags** | Description (auto-truncated at 160 chars), keywords, favicon |
| **Robots Directives** | `noindex` / `nofollow` per page or globally |
| **Static Bundles** | CSS/JS injection with auto `.min.`, query-string versioning, `defer`, and `async` |
| **CDN Features** | One-call injection for Azure Maps, TinyMCE 5, and jQuery 3.6.4 |
| **Crawler Detection** | Auto-detects 200+ crawler user-agents; sets `IsCrawler = true` |
| **Staging Guard** | Auto-applies `noindex, nofollow` on `*.azurewebsites.net` hosts |
| **MVC Support** | `CloudController` base class + `IHtmlHelper` extension methods |
| **Blazor Support** | `CloudHeadContent`, `CloudHeadInit`, `CloudHead`, `CloudBundles` Razor components |

---

## 📦 Installation

```shell
dotnet add package AngryMonkey.CloudWeb.Server
```

---

## 🚀 Quick Start

### 1. Register in `Program.cs`

```csharp
builder.Services.AddCloudWeb(config =>
{
    config.TitlePrefix = "My App | ";
    config.PageDefaults.SetTitle("Home");
    config.PageDefaults.SetDescription("My application default description.");
    config.PageDefaults.SetFavicon("/favicon.png");
    config.PageDefaults.AppendBundle("bootstrap/bootstrap.min.css");
});
```

### 2. Blazor — wire up `App.razor`

```razor
@inject CloudPage CloudPage
@{ CloudPage.OnModified += StateHasChanged; }

<!DOCTYPE html>
<html lang="en">
<head>
    <base href="/" />
    <SectionOutlet SectionName="CloudWeb" />
</head>
<body>
    <Routes />
    <script src="_framework/blazor.web.js"></script>
</body>
</html>
```

### 3. Blazor — set values in a page

```razor
@page "/dashboard"
@inject CloudPage CloudPage

<CloudHeadContent />

@code {
    protected override void OnInitialized() =>
        CloudPage.SetTitle("Dashboard")
                 .SetDescription("Your personal dashboard.");
}
```

### 4. MVC — use in a controller

```csharp
public class HomeController(CloudPage cloudPage) : CloudController(cloudPage)
{
    public IActionResult Index()
    {
        CloudPage("Home").SetDescription("Welcome to the home page.");
        return View();
    }
}
```

### 5. MVC — render in `_Layout.cshtml`

```html
<head>
    <component type="typeof(CloudHeadInit)"
               param-CloudPage="@(ViewData["CloudPageStatic"])"
               render-mode="Static" />
</head>
```

---

## 📖 API Reference

### `CloudPage` — fluent methods

| Method | Description |
|---|---|
| `SetTitle(string)` | Sets the page title |
| `SetDescription(string)` | Sets the meta description (auto-truncated to 160 chars) |
| `SetKeywords(string)` | Sets the meta keywords |
| `SetFavicon(string)` | Sets the favicon `href` |
| `SetIndexPage(bool)` | Controls `noindex` robots directive |
| `SetFollowPage(bool)` | Controls `nofollow` robots directive |
| `SetTitleAddOns(IEnumerable<string>)` | Appends keyword tags to the title (64-char cap) |
| `SetAddLegacyExportsCreation(bool)` | Injects `var exports = {};` CommonJS shim |
| `AppendBundle(string)` | Appends a CSS/JS bundle by path |
| `AppendBundle(CloudBundle)` | Appends a bundle with full options |
| `AppendBundles(params string[])` | Appends multiple bundles at once |
| `InsertBundle(int, CloudBundle)` | Inserts a bundle at a specific index |
| `AddFeature(CloudPageFeatures)` | Injects a CDN feature dependency |
| `AddFeatures(params CloudPageFeatures[])` | Injects multiple CDN dependencies |
| `TitleResult(CloudWebConfig)` | Returns the composed title string |
| `DescriptionResult()` | Returns the (truncated) description |
| `RobotsResult()` | Returns the `robots` meta content string |

### `CloudWebConfig` — options

| Property | Type | Description |
|---|---|---|
| `TitlePrefix` | `string` | Prepended to every `SetTitle()` value |
| `TitleSuffix` | `string` | Appended to every `SetTitle()` value |
| `StaticFilesBaseDirectory` | `string?` | Base path used with `IFileVersionProvider` |
| `PageDefaults` | `CloudPage` | Default values applied to all pages |
| `CrawlersUserAgents` | `static string[]` | 200+ known crawler user-agent substrings |

### `CloudBundle` — options

| Property | Default | Description |
|---|---|---|
| `Source` | — | File path or absolute URL |
| `MinOnRelease` | `true` | Inserts `.min.` before extension in Release builds |
| `AppendVersion` | `true` | Appends `?v=<hash>` cache-busting query string |
| `Defer` | `true` | Adds `defer` to JS `<script>` tags |
| `Async` | `false` | Adds `async` to JS `<script>` tags |
| `UseMapping` | `true` | Use asset manifest; `false` = `IFileVersionProvider` |
| `AddOns` | `null` | Extra HTML attributes injected on the rendered tag |

### `CloudPageFeatures` enum

| Value | CDN Injected |
|---|---|
| `Maps` | Azure Maps SDK JS + CSS from `atlas.microsoft.com` |
| `TextEditor` | TinyMCE 5 from Tiny Cloud CDN |
| `JQuery` | jQuery 3.6.4 from `code.jquery.com` with SRI integrity hash |

---

## 🏗 Project Structure

```
CloudWeb/
├── CloudWeb.Server/               # Razor Class Library — the NuGet package
│   ├── CloudWeb/
│   │   ├── CloudPage.cs           # Core per-request model & fluent API
│   │   ├── CloudWebConfig.cs      # App-wide configuration & crawler list
│   │   └── ServiceExtensions.cs   # AddCloudWeb() DI registration
│   ├── Controllers/
│   │   └── CloudController.cs     # MVC base controller
│   ├── Enums/
│   │   └── CloudPageFeatures.cs
│   ├── CloudBundle.razor(.cs)     # Single bundle renderer component
│   ├── CloudBundles.razor         # Iterates bundles + injects CDN features
│   ├── CloudHead.razor            # Renders title, meta description, favicon
│   ├── CloudHeadContent.razor     # SectionContent wrapper (Blazor)
│   └── CloudHeadInit.razor        # Merges PageDefaults + per-page config
│
├── CloudWeb.BlazorDemo/           # Live interactive demo (Blazor Web App)
│   └── Components/Pages/
│       ├── Home.razor             # Overview & getting started
│       ├── Title.razor            # SetTitle, prefix/suffix, add-ons
│       ├── Seo.razor              # Description, keywords, robots, crawler
│       ├── Bundles.razor          # AppendBundle, InsertBundle, options
│       ├── Features.razor         # CDN feature injection
│       └── Configuration.razor    # CloudWebConfig & global defaults
│
├── CloudWeb.Tests/                # xUnit unit tests
│   ├── CloudPageTests.cs          # Title, description, keywords, robots, add-ons
│   ├── BundleTests.cs             # Bundle append, insert, ordering
│   ├── FeaturesTests.cs           # AddFeature, AddFeatures
│   └── CrawlerTests.cs            # Crawler user-agent detection
│
└── CloudWeb.Nuget/                # Pack & publish console tool
```

---

## 🧪 Running Tests

```shell
dotnet test CloudWeb.Tests/CloudWeb.Tests.csproj
```

---

## 🎮 Running the Demo

```shell
dotnet run --project CloudWeb.BlazorDemo/CloudWeb.BlazorDemo/CloudWeb.BlazorDemo.csproj
```

Open `https://localhost:{port}` in your browser. Each demo page shows a **live result panel** alongside a **Show Code** toggle that reveals the exact code that produces it.

---

## 📬 Publishing a New Version

1. Bump `<Version>` in `CloudWeb.Server/CloudWeb.Server.csproj`
2. Store your NuGet API key in user secrets for `CloudWeb.Nuget`:
   ```shell
   dotnet user-secrets set "NuGetApiKey" "<your-key>" --project CloudWeb.Nuget
   ```
3. Run `CloudWeb.Nuget` — it packs and pushes to NuGet.org. Output lands in `NugetPackages/`.

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss what you would like to change.

---

## 📄 License

[MIT](LICENSE) © [Angry Monkey Cloud](https://www.angrymonkeycloud.com/)
