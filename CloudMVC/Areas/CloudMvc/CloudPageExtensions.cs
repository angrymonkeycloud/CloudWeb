using AngryMonkey.CloudWeb;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

public static class CloudPageExtension
{
    public static RenderMode GetRenderMode(this CloudPage cloudPage) => cloudPage.BlazorRenderModeResult() switch
    {
        CloudPageBlazorRenderModes.Server => RenderMode.ServerPrerendered,
        CloudPageBlazorRenderModes.WebAssembly => RenderMode.WebAssemblyPrerendered,
        _ => RenderMode.Static,
    };

    public static CloudPage Current(ViewDataDictionary viewData)
    {
        object? obj = viewData["CloudPageStatic"];

        return obj == null ? new() : obj as CloudPage;
    }

    public static void Bundle(this IHtmlHelper html, string file)
    {
        Current(html.ViewData).AppendBundle(file);
    }

    public static void Bundle(this IHtmlHelper html, CloudBundle bundle)
    {
        Current(html.ViewData).AppendBundle(bundle);
    }
}
