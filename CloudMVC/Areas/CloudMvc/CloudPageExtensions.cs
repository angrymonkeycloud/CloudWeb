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

public static class CloudPageExtensions
{
    public static RenderMode GetRenderMode(this CloudPage cloudPage) => cloudPage.BlazorRenderModeResult() switch
    {
        CloudPageBlazorRenderModes.Server => RenderMode.ServerPrerendered,
        CloudPageBlazorRenderModes.WebAssembly => RenderMode.WebAssemblyPrerendered,
        _ => RenderMode.Static,
    };

    public static void Bundle(this IHtmlHelper html, string file)
    {
        CloudPage.Current(html.ViewData).AppendBundle(file);
    }

    public static void Bundle(this IHtmlHelper html, CloudBundle bundle)
    {
        CloudPage.Current(html.ViewData).AppendBundle(bundle);
    }
}
