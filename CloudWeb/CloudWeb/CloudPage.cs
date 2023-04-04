﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;

namespace AngryMonkey.CloudWeb;

public class CloudPage
{
    public string? Title { get; set; }
    public List<string> TitleAddOns { get; set; } = new List<string>();
    public string? Keywords { get; set; }
    public string? Description { get; set; }
    public bool? IndexPage { get; set; }
    public bool? FollowPage { get; set; }
    public bool? IsCrawler { get; set; }
    public string? BaseUrl { get; set; }
    public string? Favicon { get; set; }
    public string? CallingAssemblyName { get; set; }
    public bool? AutoAppendBlazorStyles { get; set; }
    public List<CloudPageFeatures> Features { get; set; } = new();
    public CloudPageBlazorRenderModes? BlazorRenderMode { get; set; }

    public List<CloudBundle> Bundles { get; set; } = new List<CloudBundle>();

    public event EventHandler? OnModified;

    public CloudPage AppendBundle(CloudBundle? bundle)
    {
        if (bundle == null)
            return this;

        Bundles.Add(bundle);

        OnModified?.Invoke(this, new EventArgs());

        return this;
    }

    public CloudPage AppendBundle(string? bundleSource)
    {
        if (string.IsNullOrEmpty(bundleSource))
            return this;

        Bundles.Add(new CloudBundle() { Source = bundleSource });

        OnModified?.Invoke(this, new EventArgs());

        return this;
    }

    public CloudPage SetTitle(string title)
    {
        Title = title;

        OnModified?.Invoke(this, new EventArgs());

        return this;
    }

    public CloudPage SetFavicon(string path)
    {
        Favicon = path;

        OnModified?.Invoke(this, new EventArgs());

        return this;
    }

    public CloudPage SetBaseUrl(string baseUrl)
    {
        BaseUrl = baseUrl;

        OnModified?.Invoke(this, new EventArgs());

        return this;
    }

    public CloudPage SetCallingAssemblyName(string? callingAssemblyName)
    {
        CallingAssemblyName = callingAssemblyName;

        OnModified?.Invoke(this, new EventArgs());

        return this;
    }

    public CloudPage SetKeywords(string keywords)
    {
        Keywords = keywords;

        OnModified?.Invoke(this, new EventArgs());

        return this;
    }

    public CloudPage SetDescription(string description)
    {
        Description = description;

        OnModified?.Invoke(this, new EventArgs());

        return this;
    }

    public CloudPage SetIndexPage(bool indexPage)
    {
        IndexPage = indexPage;

        OnModified?.Invoke(this, new EventArgs());

        return this;
    }

    public CloudPage SetFollowPage(bool followPage)
    {
        FollowPage = followPage;

        OnModified?.Invoke(this, new EventArgs());

        return this;
    }

    public CloudPage SetTitleAddOns(List<string> titleAddOns)
    {
        TitleAddOns = titleAddOns;

        OnModified?.Invoke(this, new EventArgs());

        return this;
    }

    public CloudPage SetBlazor(CloudPageBlazorRenderModes renderMode)
    {
        BlazorRenderMode = renderMode;

        OnModified?.Invoke(this, new EventArgs());

        return this;
    }

    public CloudPage SetIsCrawler(bool isCrawler)
    {
        IsCrawler = isCrawler;

        OnModified?.Invoke(this, new EventArgs());

        return this;
    }

    public CloudPage AddFeatures(params CloudPageFeatures[] features)
    {
        Features.AddRange(features);

        OnModified?.Invoke(this, new EventArgs());

        return this;
    }

    public string? RobotsResult()
    {
        List<string> content = new();

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

    public string FaviconResult() => Favicon;

    public string? KeywordsResult() => Keywords;

    public string? DescriptionResult() => Description?.Length > 160 ? $"{Description[..157]}..." : Description;

    public CloudPageBlazorRenderModes BlazorRenderModeResult()
        => !BlazorRenderMode.HasValue || (IsCrawler.HasValue && IsCrawler.Value) ? CloudPageBlazorRenderModes.None : BlazorRenderMode.Value;
}
