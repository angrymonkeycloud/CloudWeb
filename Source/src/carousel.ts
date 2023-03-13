import { Siema } from './Siema';
import { CorePopup } from './popup';
import { CoreMain } from './cloud/main';

export class CoreCarousel {

    private static _items: HTMLElement[] = [];
    private static _siema;

    static open(elements: HTMLElement[], index?: number): void {

        for (const element of elements) {

            const slide = document.createElement('div');
            slide.className = "carousel-slide";
            slide.append(element);

            CoreCarousel._items.push(slide);
        }

        CorePopup.open(CoreCarousel.html());
        CoreMain.reinitializeLazyLoadingImages();

        const updateArrows = function () {

            const leftArrow = $('.carousel-leftarrow');
            const rightArrow = $('.carousel-rightarrow');

            leftArrow.removeClass('_disabled');
            rightArrow.removeClass('_disabled');

            if (CoreCarousel.currentSlide === 0)
                leftArrow.addClass('_disabled');

            if (CoreCarousel.currentSlide + 1 === CoreCarousel.count)
                rightArrow.addClass('_disabled');
        }

        CoreCarousel._siema = new Siema({
            selector: '.carousel-content',
            onChange: () => {

                updateArrows();

                // if (onChange)
                //     onChange.call(this);
            }
        });

        document.querySelector('.carousel-leftarrow span').addEventListener('click', function () {
            CoreCarousel.prev();
        });

        document.querySelector('.carousel-rightarrow span').addEventListener('click', function () {
            CoreCarousel.next();
        });

        document.querySelector('.carousel-header span').addEventListener('click', function () {
            CoreCarousel.close();
        });

        if (index)
            CoreCarousel.goTo(index);
        else updateArrows();
    }

    static close() {
        CoreCarousel._siema = undefined;
        CoreCarousel._items = [];
        CorePopup.close();
    }

    static get currentSlide(): number {
        return this._siema.currentSlide;
    }

    private static html(): string {

        let carouselElement = `<div class='carousel'>
                                <div class='carousel-header'><span>×</span></div>
                                <div class='carousel-leftarrow'><span>‹</span></div>
                                <div class='carousel-content'>`;

        for (const item of this._items)
            carouselElement += "<div>" + item.outerHTML + "</div>";

        carouselElement += `</div>
                            <div class='carousel-rightarrow'><span>›</span></div>
                            </div>`;

        return carouselElement;
    }

    static goTo(index: number): void {
        this._siema.goTo(index);
    }

    static prev(): void {
        this._siema.prev();
    }

    static next(): void {
        this._siema.next();
    }

    static isOpened(): boolean {
        return this._siema !== undefined;
    }

    static get count(): number {
        return this._items.length;
    }
}

$(document).on('keydown', 'body', function (e) {

    if (!CoreCarousel.isOpened())
        return;

    switch (e.key) {
        case "ArrowLeft":
            CoreCarousel.prev();
            break;
        case "ArrowRight":
            CoreCarousel.next();
            break;
        case "Escape":
            CoreCarousel.close();
            break;
        default: break;
    }
});