
// Navigation

window.amc.Navigation.GoBack = () => {

    window.history.back();
}

window.amc.Navigation.PreventBack = (state = null, title = null, url = null) => {

    window.history.pushState(state, title, url);
};

window.amc.Navigation.NavigateOrGoBack = (newUrl) => {

    if (!document.referrer) {
        window.location.assign(newUrl);
        return;
    }

    let previous = new URL(document.referrer.toLowerCase()).pathname.toLowerCase();

    if (previous.startsWith('/'))
        previous = previous.substring(1);

    newUrl = newUrl.toLowerCase();

    var queryStringIndex = previous.indexOf('?');

    if (queryStringIndex !== -1)
        previous = previous.substring(0, queryStringIndex);

    if (previous === newUrl)
        window.history.back();
    else
        window.location.assign(newUrl);
}

// Elements

window.amc.Elements.FocusElement = (element) => {

    if (typeof element === 'string')
        document.querySelector(element).focus();
    else element.focus();
}

// Sharing

window.amc.Sharing.SupportsShare = () => {

    if (navigator.share)
        return true;

    else return false;
}

window.amc.Sharing.ShareCurrentLink = async () => {

    await navigator.share({
        title: document.title,
        url: location.href,
    });
}