using AngryMonkey.CloudWeb;
using FluentAssertions;
using Xunit;

namespace CloudWeb.Tests;

public class FeaturesTests
{
    [Fact]
    public void AddFeature_AddsFeatureToList()
    {
        CloudPage page = new();
        page.AddFeature(CloudPageFeatures.JQuery);
        page.Features.Should().Contain(CloudPageFeatures.JQuery);
    }

    [Fact]
    public void AddFeatures_AddsAllFeatures()
    {
        CloudPage page = new();
        page.AddFeatures(CloudPageFeatures.Maps, CloudPageFeatures.TextEditor, CloudPageFeatures.JQuery);
        page.Features.Should().HaveCount(3);
        page.Features.Should().Contain(CloudPageFeatures.Maps);
        page.Features.Should().Contain(CloudPageFeatures.TextEditor);
        page.Features.Should().Contain(CloudPageFeatures.JQuery);
    }

    [Fact]
    public void AddFeature_FiresOnModified()
    {
        CloudPage page = new();
        bool fired = false;
        page.OnModified += () => fired = true;
        page.AddFeature(CloudPageFeatures.JQuery);
        fired.Should().BeTrue();
    }

    [Fact]
    public void AddFeature_ReturnsThis_ForFluentChaining()
    {
        CloudPage page = new();
        CloudPage result = page.AddFeature(CloudPageFeatures.Maps);
        result.Should().BeSameAs(page);
    }

    [Fact]
    public void Features_StartsEmpty()
    {
        CloudPage page = new();
        page.Features.Should().BeEmpty();
    }
}
