using Microsoft.AspNetCore.Http;
using System.Collections.ObjectModel;
using System.Text;

namespace AngryMonkey.CloudWeb;

public class CloudPage
{
    public CloudPage()
    {
        IsCrawler = false;
    }

    public CloudPage(IHttpContextAccessor accessor)
    {
        // Crawler

        string? userAgeny = accessor.HttpContext?.Request.Headers["User-Agent"].ToString().Trim().ToLower();

        IsCrawler = !string.IsNullOrEmpty(userAgeny) && CloudWebConfig.CrawlersUserAgents.Any(userAgeny.Contains);

        // None Production
        string? host = accessor.HttpContext?.Request.Host.Host.ToLower();

        if (!string.IsNullOrEmpty(host))
        {
            string[] robotsBlockUrls = ["azurewebsites.net"];

            if (robotsBlockUrls.Any(host.EndsWith))
            {
                SetIndexPage(false);
                SetFollowPage(false);
            }
        }
    }

    public string? Title { get; internal set; }
    public string? Keywords { get; internal set; }
    public string? Description { get; internal set; }
    public bool? IndexPage { get; internal set; }
    public bool? FollowPage { get; internal set; }
    public string? Favicon { get; internal set; }
    public string? CallingAssemblyName { get; internal set; }
    public bool? AutoAppendBlazorStyles { get; internal set; }

    public bool IsCrawler { get; internal set; }

    internal readonly List<string> _titleAddOns = [];
    public ReadOnlyCollection<string> TitleAddOns => _titleAddOns.AsReadOnly();

    internal readonly List<CloudPageFeatures> _features = [];
    public ReadOnlyCollection<CloudPageFeatures> Features => _features.AsReadOnly();

    internal readonly List<CloudBundle> _bundles = [];
    public ReadOnlyCollection<CloudBundle> Bundles => _bundles.AsReadOnly();

    public event Action? OnModified;

    public CloudPage AppendBundle(CloudBundle bundle) => AppendBundles(bundle);

    public CloudPage AppendBundles(params CloudBundle[]? bundles)
    {
        if (bundles == null)
            return this;

        foreach (CloudBundle bundle in bundles)
            _bundles.Add(bundle);

        OnModified?.Invoke();

        return this;
    }

    public CloudPage AppendBundle(string bundle) => AppendBundles(bundle);

    public CloudPage AppendBundles(params string[]? bundles)
    {
        if (bundles == null)
            return this;

        foreach (string bundle in bundles)
            _bundles.Add(new CloudBundle() { Source = bundle });

        OnModified?.Invoke();

        return this;
    }

    public CloudPage SetTitle(string title)
    {
        Title = title;

        OnModified?.Invoke();

        return this;
    }

    public CloudPage SetFavicon(string path)
    {
        Favicon = path;

        OnModified?.Invoke();

        return this;
    }

    public CloudPage SetCallingAssemblyName(string? callingAssemblyName)
    {
        CallingAssemblyName = callingAssemblyName;

        OnModified?.Invoke();

        return this;
    }

    public CloudPage SetKeywords(string keywords)
    {
        Keywords = keywords;

        OnModified?.Invoke();

        return this;
    }

    public CloudPage SetDescription(string description)
    {
        Description = description;

        OnModified?.Invoke();

        return this;
    }

    public CloudPage SetIndexPage(bool indexPage)
    {
        IndexPage = indexPage;

        OnModified?.Invoke();

        return this;
    }

    public CloudPage SetFollowPage(bool followPage)
    {
        FollowPage = followPage;

        OnModified?.Invoke();

        return this;
    }

    public CloudPage SetTitleAddOns(IEnumerable<string> titleAddOns)
    {
        _titleAddOns.Clear();
        _titleAddOns.AddRange(titleAddOns);

        OnModified?.Invoke();

        return this;
    }

    public CloudPage AddFeature(CloudPageFeatures feature) => AddFeatures(feature);

    public CloudPage AddFeatures(params CloudPageFeatures[] features)
    {
        _features.AddRange(features);

        OnModified?.Invoke();

        return this;
    }

    public string? RobotsResult()
    {
        List<string> content = [];

        if (IndexPage.HasValue && !IndexPage.Value)
            content.Add("noindex");

        if (FollowPage.HasValue && !FollowPage.Value)
            content.Add("nofollow");

        if (content.Any())
            return string.Join(", ", content);

        return null;
    }

    public string? TitleResult(CloudWebConfig cloudWeb)
    {
        StringBuilder titleBuilder = new();

        if (string.IsNullOrEmpty(Title))
            titleBuilder.Append(cloudWeb.PageDefaults.Title);
        else
            titleBuilder.Append($"{cloudWeb.TitlePrefix}{Title}{cloudWeb.TitleSuffix}");

        List<string> addOns = cloudWeb.PageDefaults._titleAddOns;
        addOns.AddRange(TitleAddOns);

        if (addOns.Any())
            foreach (string addText in addOns)
                if (titleBuilder.Length + addText.Length + 1 <= 64)
                    titleBuilder.Append($" {addText}");

        return titleBuilder.ToString();
    }

    public string? FaviconResult() => Favicon;

    public string? KeywordsResult() => Keywords;

    public string? DescriptionResult() => Description?.Length > 160 ? $"{Description[..157]}..." : Description;
}
