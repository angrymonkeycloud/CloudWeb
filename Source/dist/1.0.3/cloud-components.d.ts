export declare class CorePopup {
    private static _contentLoadedCallBack;
    private static get selector();
    private static get element();
    static get isOpened(): boolean;
    static onContentLoaded(callback: () => void): void;
    static open(content?: string | HTMLElement, settings?: CorePopupSettings): void;
    static close(): void;
    static softClose(): void;
    static updateContent(content: string | HTMLElement): void;
}
export declare class CorePopupSettings {
    preventClose: boolean;
}

export declare class CoreMessage {
    private static get selector();
    private static get element();
    static get isOpened(): boolean;
    static open(title: string | HTMLElement, description: string | HTMLElement, buttons: CoreMessageButton[]): void;
    static close(): void;
    static click(): void;
    static selectPreviousButton(): void;
    static selectNextButton(): void;
}
export declare class CoreMessageButton {
    content: string | HTMLElement;
    method?: () => void;
    constructor(content: string | HTMLElement, method?: () => void);
}

export declare class CoreSideBar {
    private static _contentLoadedCallBack;
    static WindowsWidth: number;
    private static get selector();
    private static get element();
    static get isOpened(): boolean;
    static HeaderHeight: string | number;
    static updateWindowsWidthPropertyValue(): void;
    static onContentLoaded(callback: () => void): void;
    static open(content?: (string | HTMLElement)): void;
    static close(): void;
    static softClose(): void;
    static updateContent(content: (string | HTMLElement)): (void | string | HTMLElement);
}

export declare class CoreCarousel {
    private static _items;
    private static _siema;
    static open(elements: HTMLElement[], index?: number): void;
    static close(): void;
    static get currentSlide(): number;
    private static html;
    static goTo(index: number): void;
    static prev(): void;
    static next(): void;
    static isOpened(): boolean;
    static get count(): number;
}

