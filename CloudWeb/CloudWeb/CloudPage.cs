using Microsoft.AspNetCore.Http;
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
        string? userAgeny = accessor.HttpContext?.Request.Headers["User-Agent"].ToString().Trim().ToLower();

        IsCrawler = !string.IsNullOrEmpty(userAgeny) && CloudWebConfig.CrawlersUserAgents.Any(userAgeny.Contains);
    }

    public string? Title { get; set; }
    public List<string> TitleAddOns { get; set; } = [];
    public string? Keywords { get; set; }
    public string? Description { get; set; }
    public bool? IndexPage { get; set; }
    public bool? FollowPage { get; set; }
    public string? BaseUrl { get; set; }
    public string? Favicon { get; set; }
    public string? CallingAssemblyName { get; set; }
    public bool? AutoAppendBlazorStyles { get; set; }

    public bool IsCrawler { get; private set; }

    public List<CloudPageFeatures> Features { get; set; } = [];

    public List<CloudBundle> Bundles { get; set; } = [];

    public event Action? OnModified;

    public CloudPage AppendBundle(CloudBundle? bundle)
    {
        if (bundle == null)
            return this;

        Bundles.Add(bundle);

        OnModified?.Invoke();

        return this;
    }

    public CloudPage AppendBundle(string? bundleSource)
    {
        if (string.IsNullOrEmpty(bundleSource))
            return this;

        Bundles.Add(new CloudBundle() { Source = bundleSource });

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

    public CloudPage SetBaseUrl(string baseUrl)
    {
        BaseUrl = baseUrl;

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

    public CloudPage SetTitleAddOns(List<string> titleAddOns)
    {
        TitleAddOns = titleAddOns;

        OnModified?.Invoke();

        return this;
    }

    public CloudPage AddFeatures(params CloudPageFeatures[] features)
    {
        Features.AddRange(features);

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

        List<string> addOns = cloudWeb.PageDefaults.TitleAddOns;
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
