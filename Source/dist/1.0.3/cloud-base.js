var exports = {};
var loadImageObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.target.getAttribute('data-src') !== undefined) {
            var src = entry.target.getAttribute('data-src');
            entry.target.setAttribute('src', src);
            entry.target.removeAttribute('data-src');
            loadImageObserver.unobserve(entry.target);
        }
    });
});
var CoreMain = (function () {
    function CoreMain() {
    }
    CoreMain.reinitializeLazyLoadingImages = function () {
        document.querySelectorAll('img[data-src]').forEach(function (element) {
            loadImageObserver.unobserve(element);
            loadImageObserver.observe(element);
        });
    };
    CoreMain.preventScrolling = function () {
        var width = document.body.offsetWidth;
        $('html').addClass('_noscroll');
        var scrollWidth = document.body.offsetWidth - width;
        if (scrollWidth > 0) {
            document.body.style.marginRight = scrollWidth + 'px';
            var header = document.querySelector('body > header');
            if (header !== null)
                header.style.right = scrollWidth + 'px';
        }
    };
    CoreMain.allowScrolling = function () {
        $('html').removeClass('_noscroll');
        document.body.style.marginRight = null;
        var header = document.querySelector('body > header');
        if (header !== null)
            header.style.right = null;
    };
    CoreMain.scrollTo = function (scroll, scrollDuration) {
        if (typeof scroll === 'object')
            scroll = window.pageYOffset + scroll.getBoundingClientRect().y;
        var scrollTo = scroll;
        var cosParameter = (window.pageYOffset - scrollTo) / 2;
        var scrollCount = 0;
        var oldTimestamp = window.performance.now();
        function step(newTimestamp) {
            var tsDiff = newTimestamp - oldTimestamp;
            if (tsDiff > 100)
                tsDiff = 30;
            scrollCount += Math.PI / (scrollDuration / tsDiff);
            if (scrollCount >= Math.PI)
                return;
            var moveStep = Math.round(scrollTo + cosParameter + cosParameter * Math.cos(scrollCount));
            window.scrollTo(0, moveStep);
            oldTimestamp = newTimestamp;
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    };
    return CoreMain;
}());
{ CoreMain };
CoreMain.reinitializeLazyLoadingImages();


var exports = {};
var CoreString = (function () {
    function CoreString() {
    }
    CoreString.randomLetters = function (length) {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++)
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        return result;
    };
    CoreString.randomNumbers = function (length) {
        var result = "";
        var characters = "012345678911";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++)
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        return result;
    };
    CoreString.random = function (length) {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++)
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        return result;
    };
    return CoreString;
}());
{ CoreString };


var exports = {};
$(document).on('click', 'a[href*="#"]:not([href="#"])', function () {
    if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length)
            CoreMain.scrollTo(target[0], 200);
        return false;
    }
});

