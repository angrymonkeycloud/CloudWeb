using Microsoft.AspNetCore.Components;

namespace AngryMonkey.CloudWeb;

public partial class CloudBundle
{
    [Parameter] public required string Source { get; set; }
    [Parameter] public bool MinOnRelease { get; set; } = true;
    [Parameter] public string? AddOns { get; set; }
    [Parameter] public bool Defer { get; set; } = true;
    [Parameter] public bool Async { get; set; } = false;
    [Parameter] public bool AppendVersion { get; set; } = true;

    bool IsExternal => Source.StartsWith("http", StringComparison.OrdinalIgnoreCase);

    private string? Result
    {
        get
        {
            if (string.IsNullOrEmpty(Source) || !Source.Contains('.'))
                return null;

            SourceTypes? sourceType = Source.Split('.').Last().Trim().ToLower() switch
            {
                "css" => SourceTypes.CSS,
                "js" => SourceTypes.JS,
                _ => null,
            };

            if (sourceType == null)
                return null;

            List<string> segments =
                [
                    sourceType == SourceTypes.CSS ? "<link" : "<script"
                ];

            string source = Source;

            if (MinOnRelease && !source.Contains(".min.", StringComparison.OrdinalIgnoreCase))
            {
                List<string> sourceSplitted = Source.Split('.').ToList();

                sourceSplitted.Insert(sourceSplitted.Count - 1, "min");
                source = string.Join('.', sourceSplitted);
            }

            if (!IsExternal && AppendVersion)
                source = fileVersionProvider.AddFileVersionToPath("/", source);

            segments.Add(sourceType == SourceTypes.CSS ? $"href=\"{source}\"" : $"src=\"{source}\"");

            if (sourceType == SourceTypes.JS)
            {
                if (Defer)
                    segments.Add("defer");

                if (Async)
                    segments.Add("async");
            }

            if (!string.IsNullOrEmpty(AddOns))
                segments.Add(AddOns);

            segments.Add(sourceType == SourceTypes.CSS ? "rel=\"stylesheet\">" : "></script>");

            return string.Join(" ", segments);

            //return Source.Split('.').Last().Trim().ToLower() switch
            //{
            //    "css" => $"<link href=\"{source}\" rel=\"stylesheet\">",
            //    "js" => $"<script src=\"{source}\" {(Defer ? "defer" : null)} {(Async ? "async" : null)}></script>",
            //    _ => null,
            //};
        }
    }

    private enum SourceTypes
    {
        JS,
        CSS,
    }
}