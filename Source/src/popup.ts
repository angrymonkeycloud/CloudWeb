import { CoreMain } from "./cloud/main";

export class CorePopup {

  private static _contentLoadedCallBack: () => void;

  // Properties

  private static get selector(): string {
    return "body > .popup";
  }

  private static get element(): JQuery<HTMLElement> {
    return $(this.selector);
  }

  static get isOpened(): boolean {
    return $(this.selector).length > 0;
  }

  // Methods

    static onContentLoaded(callback: () => void){
        this._contentLoadedCallBack = callback;
    }

  static open(
    content?: string | HTMLElement,
    settings?: CorePopupSettings
  ): void {
    if (this.isOpened) this.close();

    if (content === undefined) content = "loading...";

    if (settings === undefined) settings = new CorePopupSettings();

    let html =
      `
            <aside class="popup">
                <div class="popup-content">` +
      content +
      `</div>
            </aside>`;

    $("body").append(html);
    CoreMain.preventScrolling();

    let contentElement = this.element.find(".popup-content");

    if (this._contentLoadedCallBack !== undefined)
        this._contentLoadedCallBack();

    if (!settings.preventClose) {
      CorePopup.element.css("cursor", "pointer");
      $(this.selector).click(function(e) {
        if (
          !contentElement.is(e.target) &&
          contentElement.has(e.target).length === 0
        )
          CorePopup.close();
      });
    }    

    window.history.pushState("forward", null, "");
  }

  static close(): void {
    this.softClose();
    window.history.back();
  }

  static softClose(): void {
    CoreMain.allowScrolling();
    this.element.remove();
  }

  static updateContent(content: string | HTMLElement): void {
    if (!this.isOpened)
      throw new Error("Open popup before setting its content.");

    this.element.find(".popup-content").html(content);

    if (this._contentLoadedCallBack !== undefined)
        this._contentLoadedCallBack();
  }
}

export class CorePopupSettings {
  preventClose: boolean = false;
}

$(window).on("popstate", function() {

  if (CorePopup.isOpened)
    CorePopup.softClose();
});