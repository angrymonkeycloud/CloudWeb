# CloudWeb

<p align="center">
  <img src="CloudWeb/amc-logo.png" alt="Angry Monkey Cloud Logo" width="64" />
</p>

<p align="center">
  <a href="https://www.nuget.org/packages/AngryMonkey.CloudWeb">
    <img src="https://img.shields.io/nuget/v/AngryMonkey.CloudWeb?style=flat-square&logo=nuget&label=NuGet" alt="NuGet Version" />
  </a>
  <a href="https://www.nuget.org/packages/AngryMonkey.CloudWeb">
    <img src="https://img.shields.io/nuget/dt/AngryMonkey.CloudWeb?style=flat-square&logo=nuget&label=Downloads" alt="NuGet Downloads" />
  </a>
  <a href="https://github.com/angrymonkeycloud/CloudWeb/actions/workflows/dotnet.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/angrymonkeycloud/CloudWeb/dotnet.yml?branch=main&style=flat-square&logo=github&label=Build" alt="Build Status" />
  </a>
  <a href="https://github.com/angrymonkeycloud/CloudWeb/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/angrymonkeycloud/CloudWeb?style=flat-square&label=License" alt="License" />
  </a>
  <img src="https://img.shields.io/badge/.NET-10-512BD4?style=flat-square&logo=dotnet" alt=".NET 10" />
</p>

CloudWeb is an ASP.NET Core library for managing page `<head>` content and static asset bundles for Blazor and MVC applications.

## Demo

https://angrymonkeycloud.github.io/CloudWeb/

## Features

- Fluent per-page metadata (`title`, `description`, `keywords`, `favicon`)
- Global defaults through `CloudWebConfig` with per-page overrides
- Robots directives (`noindex`, `nofollow`) and staging protection
- CSS/JS bundle injection with minified path and versioning support
- Built-in CDN features (`Maps`, `TextEditor`, `JQuery`)
- Crawler detection using a comprehensive user-agent list
- Native support for both Blazor and MVC

## Installation

```bash
dotnet add package AngryMonkey.CloudWeb
```

## Quick Start

### Register the library

```csharp
builder.Services.AddCloudWeb(config =>
{
    config.TitleSuffix = " - My Application";

    config.PageDefaults
        .SetTitle("Home")
        .SetDescription("Default site description.")
        .SetKeywords("cloudweb, aspnetcore, seo")
        .SetFavicon("/favicon.svg");
});
```

### Blazor integration

`App.razor`:

```razor
<head>
    <SectionPlaceholder SectionName="CloudWeb" />
</head>
```

`Routes.razor`:

```razor
<CloudHeadContent />
```

Page/component usage:

```razor
@inject CloudPage CloudPage

@code {
    protected override void OnInitialized()
    {
        CloudPage
            .SetTitle("Dashboard")
            .SetDescription("Operational dashboard")
            .SetKeywords("dashboard, analytics");
    }
}
```

### MVC integration

Controller:

```csharp
public class HomeController(CloudPage cloudPage) : CloudController(cloudPage)
{
    public IActionResult Index()
    {
        CloudPage("Home").SetDescription("Home page");
        return View();
    }
}
```

Layout (`_Layout.cshtml`):

```html
<head>
    <component type="typeof(CloudHeadInit)" render-mode="Static" />
</head>
```

## API Highlights

### CloudPage

- `SetTitle(string)`
- `SetDescription(string)`
- `SetKeywords(string)`
- `SetFavicon(string)`
- `SetIndexPage(bool)` / `SetFollowPage(bool)`
- `SetTitleAddOns(IEnumerable<string>)`
- `SetAddLegacyExportsCreation(bool)`
- `AppendBundle(string)` / `AppendBundle(CloudBundle)`
- `AppendBundles(params string[])`
- `InsertBundle(int, CloudBundle)`
- `AddFeature(CloudPageFeatures)` / `AddFeatures(params CloudPageFeatures[])`

### CloudBundle Options

| Property | Default | Description |
|---|---|---|
| `Source` | required | Asset path or URL |
| `MinOnRelease` | `true` | Inserts `.min.` before extension |
| `AppendVersion` | `true` | Adds cache-busting query string |
| `UseMapping` | `true` | Uses static web assets mapping |
| `Defer` | `true` | Adds `defer` to JavaScript tags |
| `Async` | `false` | Adds `async` to JavaScript tags |
| `AddOns` | `null` | Extra tag attributes |

### CloudPageFeatures

- `Maps` (Azure Maps SDK)
- `TextEditor` (TinyMCE)
- `JQuery` (jQuery 3.6.4)

## Repository Structure

```text
CloudWeb/
├── CloudWeb/          # Razor Class Library (NuGet package)
├── CloudWeb.Demo/     # Blazor demo application
└── CloudWeb.Tests/    # xUnit test project
```

## Local Development

Run tests:

```bash
dotnet test CloudWeb.Tests/CloudWeb.Tests.csproj
```

Run demo:

```bash
dotnet run --project CloudWeb.Demo/CloudWeb.Demo.csproj
```

## License

[MIT](LICENSE) © [Angry Monkey Cloud](https://www.angrymonkeycloud.com/)

