import { CoreMain } from "./cloud/main";

export class CoreSideBar {

    private static _contentLoadedCallBack: () => void;
    static WindowsWidth: number;

    // Properties

    private static get selector(): string {
        return 'body > .sidebar';
    }

    private static get element(): JQuery<HTMLElement> {
        return $(this.selector);
    }

    static get isOpened(): boolean {
        return $(this.selector).length > 0;
    }

    static HeaderHeight: string | number;

    // Methods

    static updateWindowsWidthPropertyValue(): void {
        this.WindowsWidth = $(window).width();
    }

    static onContentLoaded(callback: () => void) {
        this._contentLoadedCallBack = callback;
    }

    static open(content?: (string | HTMLElement)): void {

        if (this.isOpened)
            this.close();

        window.history.pushState('forward', null, '');

        if (content === undefined)
            content = 'Loading...';

        let html = `
        <aside class="sidebar">
            <div class="sidebar-void">

            </div>
            <div class="sidebar-load">
                <div class="sidebar-header">
                    <div>
                        <div class="sidebar-back"></div>
                        <div class="sidebar-title"></div>
                        <div class="sidebar-close">
                            <svg viewBox="0 0 40 40">
                                <line style="fill: none; stroke: #000; stroke-miterlimit: 10;" x1="11.43" y1="11.26" x2="28.46" y2="28.29"></line>
                                <line style="fill: none; stroke: #000; stroke-miterlimit: 10;" x1="11.43" y1="28.29" x2="28.46" y2="11.26"></line>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="sidebar-content">`
            +
            content
            +
            `</div>
            </div>
        </aside>
        `;

        $('body').append(html);
        CoreMain.preventScrolling();

        if (this.HeaderHeight === undefined)
            this.element.find('.sidebar-header').height($('header').height() + 'px');
        else
            this.element.find('.sidebar-header').height(this.HeaderHeight);

        if (this._contentLoadedCallBack !== undefined)
            this._contentLoadedCallBack();

        CoreSideBar.updateWindowsWidthPropertyValue();

        $('.sidebar-void, .sidebar-header').click(function () {
            CoreSideBar.close();
        });
    }

    static close(): void {
        this.softClose();
        window.history.back();
    }

    static softClose(): void {
        CoreMain.allowScrolling();
        this.element.remove();
    }

    static updateContent(content: (string | HTMLElement)): (void | string | HTMLElement) {

        if (!this.isOpened)
            throw new Error('Open sidebar before setting its content');

        this.element.find('.sidebar-content').html(content);

        if (this._contentLoadedCallBack !== undefined)
            this._contentLoadedCallBack();
    }
}

CoreSideBar.updateWindowsWidthPropertyValue();

$(document).on('click', 'body > .sidebar .sidebar-content a', function () {
    CoreSideBar.close();
})

$(window).on("popstate", function () {

    if (CoreSideBar.isOpened)
        CoreSideBar.softClose();
});

$(window).resize(function () {

    if ($(this).width() !== CoreSideBar.WindowsWidth) {

        CoreSideBar.WindowsWidth = $(this).width();

        if (CoreSideBar.isOpened)
            CoreSideBar.close();
    }
});

$(window).on("load", function () {

    if (CoreSideBar.isOpened)
        CoreSideBar.close();
});