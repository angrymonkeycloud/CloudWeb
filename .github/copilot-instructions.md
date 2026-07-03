# Copilot Instructions

## General AI-Assisted Development

For general AI-assisted development guidance, C# style, static assets, and documentation standards that apply to this repository, see:

- [AI Instructions](https://github.com/angrymonkeycloud/CloudDocs/blob/main/docs/ai/instructions.md)

**Note**: Project-specific instructions below take precedence when conflicts exist.

## What this repo is

`CloudWeb` is an ASP.NET Core **NuGet library** (`AngryMonkey.CloudWeb.Server`) that manages page `<head>` content (title, meta tags, favicon, SEO robots) and static asset bundles for both **Blazor** and **MVC** apps. It targets .NET 10.

## Project structure

- `CloudWeb.Server/` — The Razor Class Library (SDK: `Microsoft.NET.Sdk.Razor`). All library code lives here.
- `CloudWeb.Nuget/` — Console app that uses `AngryMonkey.CloudMate.CloudPack` to pack and publish the NuGet package. Not part of the library itself.

## Core abstractions

| Type | DI lifetime | Purpose |
|---|---|---|
| `CloudPage` | Scoped | Per-request page metadata: title, description, keywords, favicon, robots, bundles, features |
| `CloudWebConfig` | Options (`IOptionsSnapshot`) | App-wide defaults (PageDefaults, TitlePrefix/Suffix, StaticFilesBaseDirectory, crawler list) |
| `CloudController` | — | MVC base controller; surfaces `CloudPage` via `ViewData["CloudPageStatic"]` |

Register with `services.AddCloudWeb(config => { ... })` in the host app.

## `CloudPage` fluent API

`CloudPage` uses a fluent/builder pattern; all setters return `this` and fire `OnModified`:

```csharp
cloudPage.SetTitle("Home").SetDescription("...").AppendBundle("~/js/app.js").AddFeature(CloudPageFeatures.Maps);
```

`OnModified` is the reactive hook — `CloudHeadInit.razor` subscribes to it and calls `StateHasChanged()`.

## Blazor rendering pipeline

`CloudHeadContent.razor` → `CloudHeadInit.razor` (merges `CloudWebConfig.PageDefaults` + per-page `CloudPage`) → `CloudHead.razor` (meta tags) + `CloudBundles.razor` (scripts/styles). The merged `PageConfig` applies null-coalescing: page values take precedence over defaults.

## `CloudBundle` behaviour

- Automatically inserts `.min.` before the extension (e.g. `app.js` → `app.min.js`) unless `MinOnRelease=false`.
- Appends a file version query string via `IFileVersionProvider` unless `AppendVersion=false`.
- JS bundles default to `defer=true`; set `Async=true` for async loading.
- `UseMapping=true` uses an asset manifest; `false` falls back to `IFileVersionProvider`.

## `CloudPageFeatures` enum

Adding a feature injects its CDN dependency automatically in `CloudBundles.razor`:
- `Maps` → Azure Maps SDK
- `TextEditor` → TinyMCE 5
- `JQuery` → jQuery 3.6.4

Add new features here and add the corresponding CDN block in `CloudBundles.razor`.

## Crawler & robots handling

`CloudPage(IHttpContextAccessor)` auto-detects crawlers via `CloudWebConfig.CrawlersUserAgents`. Hosts ending in `azurewebsites.net` automatically receive `noindex, nofollow` — this is intentional to prevent staging sites from being indexed.

## Publishing a new version

1. Bump `<Version>` in `CloudWeb.Server/CloudWeb.Server.csproj` (both `<Version>` and the two derived `<AssemblyVersion>`/`<FileVersion>` are set via `$(PackageVersion)` — only update `<Version>`).
2. Store the NuGet API key in user secrets for `CloudWeb.Nuget` (`NuGetApiKey`).
3. Run `CloudWeb.Nuget` — it invokes `CloudPack` which packs and pushes `CloudWeb.Server`. Output lands in `NugetPackages/`.

## C# conventions (from CloudMate)

- Prefer explicit types; use `var` only when the type is obvious from the RHS.
- Use primary constructors, expression-bodied members, collection expressions (`[]`), and pattern matching.
- Omit braces for single-statement `if`/`for`/`foreach` bodies.
- Name enums in plural form (e.g., `CloudPageFeatures`).
- Never author `.css` directly — author `.less` files; the build compiles them. Razor isolated styles use `.razor.less` → `.razor.css`.

## Public Usage and Demo Links

- Focus on README content that highlights public usage and provides demo links.
- Omit internal NuGet packing/publishing instructions to streamline user experience.
