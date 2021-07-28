using System;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using AngryMonkey.Core.Web;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

public partial class CorePage
{
	internal readonly string ClientSideVersion = "1.0.0";
	internal string GetClientSideFileUrl(string filepath)
	{
		return $"{"https"}://cdn.amcapi.com/cloudweb/{ClientSideVersion}/{filepath}";
	}

	public CorePage AppendDateTimeFunctionality()
	{
		Bundle(GetClientSideFileUrl("css/datetimepicker.css"), 1);
		Bundle(GetClientSideFileUrl("js/datetimepicker.js"), 1);

		return this;
	}

	public CorePage AppendCarouselFunctionality()
	{
		Bundle(GetClientSideFileUrl("css/carousel.css"), 1);
		Bundle(GetClientSideFileUrl("js/carousel.js"), 1);

		return this;
	}

	public CorePage AppendMappingFunctionality()
	{
		Bundle("https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css");
		Bundle("https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js");

		return this;
	}
}