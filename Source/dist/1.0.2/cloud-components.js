var exports = {};
var CorePopup = (function () {
    function CorePopup() {
    }
    Object.defineProperty(CorePopup, "selector", {
        get: function () {
            return "body > .popup";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CorePopup, "element", {
        get: function () {
            return $(this.selector);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CorePopup, "isOpened", {
        get: function () {
            return $(this.selector).length > 0;
        },
        enumerable: false,
        configurable: true
    });
    CorePopup.onContentLoaded = function (callback) {
        this._contentLoadedCallBack = callback;
    };
    CorePopup.open = function (content, settings) {
        if (this.isOpened)
            this.close();
        if (content === undefined)
            content = "loading...";
        if (settings === undefined)
            settings = new CorePopupSettings();
        var html = "\n            <aside class=\"popup\">\n                <div class=\"popup-content\">" +
            content +
            "</div>\n            </aside>";
        $("body").append(html);
        CoreMain.preventScrolling();
        var contentElement = this.element.find(".popup-content");
        if (this._contentLoadedCallBack !== undefined)
            this._contentLoadedCallBack();
        if (!settings.preventClose) {
            CorePopup.element.css("cursor", "pointer");
            $(this.selector).click(function (e) {
                if (!contentElement.is(e.target) &&
                    contentElement.has(e.target).length === 0)
                    CorePopup.close();
            });
        }
        window.history.pushState("forward", null, "");
    };
    CorePopup.close = function () {
        this.softClose();
        window.history.back();
    };
    CorePopup.softClose = function () {
        CoreMain.allowScrolling();
        this.element.remove();
    };
    CorePopup.updateContent = function (content) {
        if (!this.isOpened)
            throw new Error("Open popup before setting its content.");
        this.element.find(".popup-content").html(content);
        if (this._contentLoadedCallBack !== undefined)
            this._contentLoadedCallBack();
    };
    return CorePopup;
}());
{ CorePopup };
var CorePopupSettings = (function () {
    function CorePopupSettings() {
        this.preventClose = false;
    }
    return CorePopupSettings;
}());
{ CorePopupSettings };
$(window).on("popstate", function () {
    if (CorePopup.isOpened)
        CorePopup.softClose();
});


var exports = {};
var CoreMessage = (function () {
    function CoreMessage() {
    }
    Object.defineProperty(CoreMessage, "selector", {
        get: function () {
            return "body > .popup .message";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoreMessage, "element", {
        get: function () {
            return $(this.selector);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoreMessage, "isOpened", {
        get: function () {
            return $(this.selector).length > 0;
        },
        enumerable: false,
        configurable: true
    });
    CoreMessage.open = function (title, description, buttons) {
        var buttonsHtml = "";
        buttons.forEach(function (button, index) {
            var id = CoreString.randomLetters(20);
            var buttonElement = $("<button id='" +
                id +
                "' class=\"message-button\">" +
                button.content +
                "</button>");
            if (button.method !== undefined)
                $(document).on("click", "#" + id, button.method);
            $(document).on("click", "#" + id, function () {
                CoreMessage.close();
            });
            buttonsHtml += buttonElement[0].outerHTML;
        });
        var html = "\n            <div class=\"message\">\n                <div class=\"message-content\">\n                    <p class=\"message-title\">" +
            title +
            "</p>\n                    <p class=\"message-description\">" +
            description +
            "</p>\n                    <div class=\"message-buttons\">" +
            buttonsHtml +
            "</div>\n                </div>\n            </div>";
        CorePopup.open(html, {
            preventClose: false
        });
        CoreMessage.element
            .find(".message-button")
            .first()
            .focus();
    };
    CoreMessage.close = function () {
        CorePopup.close();
    };
    CoreMessage.click = function () {
        this.element.find(".message-button:focus").click();
    };
    CoreMessage.selectPreviousButton = function () {
        var selected = this.element.find(".message-button:focus");
        if (selected.length === 0) {
            CoreMessage.element
                .find(".message-button")
                .first()
                .focus();
            return;
        }
        var previous = selected.not(":hidden").prev();
        if (previous.length > 0)
            previous.focus();
    };
    CoreMessage.selectNextButton = function () {
        var selected = this.element.find(".message-button:focus");
        if (selected.length === 0) {
            this.element
                .find(".message-button")
                .first()
                .focus();
            return;
        }
        var next = selected.not(":hidden").next();
        if (next.length > 0)
            next.focus();
    };
    return CoreMessage;
}());
{ CoreMessage };
var CoreMessageButton = (function () {
    function CoreMessageButton(content, method) {
        this.content = content;
        this.method = method;
    }
    return CoreMessageButton;
}());
{ CoreMessageButton };
$(document).on("keydown", document, function (eventObject) {
    if (CoreMessage.isOpened)
        switch (eventObject.key) {
            case "Enter":
                CoreMessage.click();
                break;
            case "Escape":
                CoreMessage.close();
                break;
            case "ArrowLeft":
                CoreMessage.selectPreviousButton();
                break;
            case "ArrowRight":
                CoreMessage.selectNextButton();
                break;
            default:
                break;
        }
});


var exports = {};
var CoreSideBar = (function () {
    function CoreSideBar() {
    }
    Object.defineProperty(CoreSideBar, "selector", {
        get: function () {
            return 'body > .sidebar';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoreSideBar, "element", {
        get: function () {
            return $(this.selector);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoreSideBar, "isOpened", {
        get: function () {
            return $(this.selector).length > 0;
        },
        enumerable: false,
        configurable: true
    });
    CoreSideBar.updateWindowsWidthPropertyValue = function () {
        this.WindowsWidth = $(window).width();
    };
    CoreSideBar.onContentLoaded = function (callback) {
        this._contentLoadedCallBack = callback;
    };
    CoreSideBar.open = function (content) {
        if (this.isOpened)
            this.close();
        window.history.pushState('forward', null, '');
        if (content === undefined)
            content = 'Loading...';
        var html = "\n        <aside class=\"sidebar\">\n            <div class=\"sidebar-void\">\n\n            </div>\n            <div class=\"sidebar-load\">\n                <div class=\"sidebar-header\">\n                    <div>\n                        <div class=\"sidebar-back\"></div>\n                        <div class=\"sidebar-title\"></div>\n                        <div class=\"sidebar-close\">\n                            <svg viewBox=\"0 0 40 40\">\n                                <line style=\"fill: none; stroke: #000; stroke-miterlimit: 10;\" x1=\"11.43\" y1=\"11.26\" x2=\"28.46\" y2=\"28.29\"></line>\n                                <line style=\"fill: none; stroke: #000; stroke-miterlimit: 10;\" x1=\"11.43\" y1=\"28.29\" x2=\"28.46\" y2=\"11.26\"></line>\n                            </svg>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"sidebar-content\">"
            +
                content
            +
                "</div>\n            </div>\n        </aside>\n        ";
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
    };
    CoreSideBar.close = function () {
        this.softClose();
        window.history.back();
    };
    CoreSideBar.softClose = function () {
        CoreMain.allowScrolling();
        this.element.remove();
    };
    CoreSideBar.updateContent = function (content) {
        if (!this.isOpened)
            throw new Error('Open sidebar before setting its content');
        this.element.find('.sidebar-content').html(content);
        if (this._contentLoadedCallBack !== undefined)
            this._contentLoadedCallBack();
    };
    return CoreSideBar;
}());
{ CoreSideBar };
CoreSideBar.updateWindowsWidthPropertyValue();
$(document).on('click', 'body > .sidebar .sidebar-content a', function () {
    CoreSideBar.close();
});
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


/**
 * Hi :-) This is a class representing a Siema.
 */
  class Siema {
  /**
   * Create a Siema.
   * @param {Object} options - Optional settings object.
   */
  constructor(options) {
    // Merge defaults with user's settings
    this.config = Siema.mergeSettings(options);

    // Resolve selector's type
    this.selector = typeof this.config.selector === 'string' ? document.querySelector(this.config.selector) : this.config.selector;

    // Early throw if selector doesn't exists
    if (this.selector === null) {
      throw new Error('Something wrong with your selector 😭');
    }

    // update perPage number dependable of user value
    this.resolveSlidesNumber();

    // Create global references
    this.selectorWidth = this.selector.offsetWidth;
    this.innerElements = [].slice.call(this.selector.children);
    this.currentSlide = this.config.loop ?
      this.config.startIndex % this.innerElements.length :
      Math.max(0, Math.min(this.config.startIndex, this.innerElements.length - this.perPage));
    this.transformProperty = Siema.webkitOrNot();

    // Bind all event handlers for referencability
    ['resizeHandler', 'touchstartHandler', 'touchendHandler', 'touchmoveHandler', 'mousedownHandler', 'mouseupHandler', 'mouseleaveHandler', 'mousemoveHandler', 'clickHandler'].forEach(method => {
      this[method] = this[method].bind(this);
    });

    // Build markup and apply required styling to elements
    this.init();
  }


  /**
   * Overrides default settings with custom ones.
   * @param {Object} options - Optional settings object.
   * @returns {Object} - Custom Siema settings.
   */
  static mergeSettings(options) {
    const settings = {
      selector: '.siema',
      duration: 200,
      easing: 'ease-out',
      perPage: 1,
      startIndex: 0,
      draggable: true,
      multipleDrag: true,
      threshold: 20,
      loop: false,
      rtl: false,
      onInit: () => {},
      onChange: () => {},
    };

    const userSttings = options;
    for (const attrname in userSttings) {
      settings[attrname] = userSttings[attrname];
    }

    return settings;
  }


  /**
   * Determine if browser supports unprefixed transform property.
   * Google Chrome since version 26 supports prefix-less transform
   * @returns {string} - Transform property supported by client.
   */
  static webkitOrNot() {
    const style = document.documentElement.style;
    if (typeof style.transform === 'string') {
      return 'transform';
    }
    return 'WebkitTransform';
  }

  /**
   * Attaches listeners to required events.
   */
  attachEvents() {
    // Resize element on window resize
    window.addEventListener('resize', this.resizeHandler);

    // If element is draggable / swipable, add event handlers
    if (this.config.draggable) {
      // Keep track pointer hold and dragging distance
      this.pointerDown = false;
      this.drag = {
        startX: 0,
        endX: 0,
        startY: 0,
        letItGo: null,
        preventClick: false,
      };

      // Touch events
      this.selector.addEventListener('touchstart', this.touchstartHandler);
      this.selector.addEventListener('touchend', this.touchendHandler);
      this.selector.addEventListener('touchmove', this.touchmoveHandler);

      // Mouse events
      this.selector.addEventListener('mousedown', this.mousedownHandler);
      this.selector.addEventListener('mouseup', this.mouseupHandler);
      this.selector.addEventListener('mouseleave', this.mouseleaveHandler);
      this.selector.addEventListener('mousemove', this.mousemoveHandler);

      // Click
      this.selector.addEventListener('click', this.clickHandler);
    }
  }


  /**
   * Detaches listeners from required events.
   */
  detachEvents() {
    window.removeEventListener('resize', this.resizeHandler);
    this.selector.removeEventListener('touchstart', this.touchstartHandler);
    this.selector.removeEventListener('touchend', this.touchendHandler);
    this.selector.removeEventListener('touchmove', this.touchmoveHandler);
    this.selector.removeEventListener('mousedown', this.mousedownHandler);
    this.selector.removeEventListener('mouseup', this.mouseupHandler);
    this.selector.removeEventListener('mouseleave', this.mouseleaveHandler);
    this.selector.removeEventListener('mousemove', this.mousemoveHandler);
    this.selector.removeEventListener('click', this.clickHandler);
  }


  /**
   * Builds the markup and attaches listeners to required events.
   */
  init() {
    this.attachEvents();

    // hide everything out of selector's boundaries
    this.selector.style.overflow = 'hidden';

    // rtl or ltr
    this.selector.style.direction = this.config.rtl ? 'rtl' : 'ltr';

    // build a frame and slide to a currentSlide
    this.buildSliderFrame();

    this.config.onInit.call(this);
  }


  /**
   * Build a sliderFrame and slide to a current item.
   */
  buildSliderFrame() {
    const widthItem = this.selectorWidth / this.perPage;
    const itemsToBuild = this.config.loop ? this.innerElements.length + (2 * this.perPage) : this.innerElements.length;

    // Create frame and apply styling
    this.sliderFrame = document.createElement('div');
    this.sliderFrame.style.width = `${widthItem * itemsToBuild}px`;
    this.enableTransition();

    if (this.config.draggable) {
      this.selector.style.cursor = '-webkit-grab';
    }

    // Create a document fragment to put slides into it
    const docFragment = document.createDocumentFragment();

    // Loop through the slides, add styling and add them to document fragment
    if (this.config.loop) {
      for (let i = this.innerElements.length - this.perPage; i < this.innerElements.length; i++) {
        const element = this.buildSliderFrameItem(this.innerElements[i].cloneNode(true));
        docFragment.appendChild(element);
      }
    }
    for (let i = 0; i < this.innerElements.length; i++) {
      const element = this.buildSliderFrameItem(this.innerElements[i]);
      docFragment.appendChild(element);
    }
    if (this.config.loop) {
      for (let i = 0; i < this.perPage; i++) {
        const element = this.buildSliderFrameItem(this.innerElements[i].cloneNode(true));
        docFragment.appendChild(element);
      }
    }

    // Add fragment to the frame
    this.sliderFrame.appendChild(docFragment);

    // Clear selector (just in case something is there) and insert a frame
    this.selector.innerHTML = '';
    this.selector.appendChild(this.sliderFrame);

    // Go to currently active slide after initial build
    this.slideToCurrent();
  }

  buildSliderFrameItem(elm) {
    const elementContainer = document.createElement('div');
    elementContainer.style.cssFloat = this.config.rtl ? 'right' : 'left';
    elementContainer.style.float = this.config.rtl ? 'right' : 'left';
    elementContainer.style.width = `${this.config.loop ? 100 / (this.innerElements.length + (this.perPage * 2)) : 100 / (this.innerElements.length)}%`;
    elementContainer.appendChild(elm);
    return elementContainer;
  }


  /**
   * Determinates slides number accordingly to clients viewport.
   */
  resolveSlidesNumber() {
    if (typeof this.config.perPage === 'number') {
      this.perPage = this.config.perPage;
    }
    else if (typeof this.config.perPage === 'object') {
      this.perPage = 1;
      for (const viewport in this.config.perPage) {
        if (window.innerWidth >= viewport) {
          this.perPage = this.config.perPage[viewport];
        }
      }
    }
  }


  /**
   * Go to previous slide.
   * @param {number} [howManySlides=1] - How many items to slide backward.
   * @param {function} callback - Optional callback function.
   */
  prev(howManySlides = 1, callback) {
    // early return when there is nothing to slide
    if (this.innerElements.length <= this.perPage) {
      return;
    }

    const beforeChange = this.currentSlide;

    if (this.config.loop) {
      const isNewIndexClone = this.currentSlide - howManySlides < 0;
      if (isNewIndexClone) {
        this.disableTransition();

        const mirrorSlideIndex = this.currentSlide + this.innerElements.length;
        const mirrorSlideIndexOffset = this.perPage;
        const moveTo = mirrorSlideIndex + mirrorSlideIndexOffset;
        const offset = (this.config.rtl ? 1 : -1) * moveTo * (this.selectorWidth / this.perPage);
        const dragDistance = this.config.draggable ? this.drag.endX - this.drag.startX : 0;

        this.sliderFrame.style[this.transformProperty] = `translate3d(${offset + dragDistance}px, 0, 0)`;
        this.currentSlide = mirrorSlideIndex - howManySlides;
      }
      else {
        this.currentSlide = this.currentSlide - howManySlides;
      }
    }
    else {
      this.currentSlide = Math.max(this.currentSlide - howManySlides, 0);
    }

    if (beforeChange !== this.currentSlide) {
      this.slideToCurrent(this.config.loop);
      this.config.onChange.call(this);
      if (callback) {
        callback.call(this);
      }
    }
  }


  /**
   * Go to next slide.
   * @param {number} [howManySlides=1] - How many items to slide forward.
   * @param {function} callback - Optional callback function.
   */
  next(howManySlides = 1, callback) {
    // early return when there is nothing to slide
    if (this.innerElements.length <= this.perPage) {
      return;
    }

    const beforeChange = this.currentSlide;

    if (this.config.loop) {
      const isNewIndexClone = this.currentSlide + howManySlides > this.innerElements.length - this.perPage;
      if (isNewIndexClone) {
        this.disableTransition();

        const mirrorSlideIndex = this.currentSlide - this.innerElements.length;
        const mirrorSlideIndexOffset = this.perPage;
        const moveTo = mirrorSlideIndex + mirrorSlideIndexOffset;
        const offset = (this.config.rtl ? 1 : -1) * moveTo * (this.selectorWidth / this.perPage);
        const dragDistance = this.config.draggable ? this.drag.endX - this.drag.startX : 0;

        this.sliderFrame.style[this.transformProperty] = `translate3d(${offset + dragDistance}px, 0, 0)`;
        this.currentSlide = mirrorSlideIndex + howManySlides;
      }
      else {
        this.currentSlide = this.currentSlide + howManySlides;
      }
    }
    else {
      this.currentSlide = Math.min(this.currentSlide + howManySlides, this.innerElements.length - this.perPage);
    }
    if (beforeChange !== this.currentSlide) {
      this.slideToCurrent(this.config.loop);
      this.config.onChange.call(this);
      if (callback) {
        callback.call(this);
      }
    }
  }


  /**
   * Disable transition on sliderFrame.
   */
  disableTransition() {
    this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`;
    this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`;
  }


  /**
   * Enable transition on sliderFrame.
   */
  enableTransition() {
    this.sliderFrame.style.webkitTransition = `all ${this.config.duration}ms ${this.config.easing}`;
    this.sliderFrame.style.transition = `all ${this.config.duration}ms ${this.config.easing}`;
  }


  /**
   * Go to slide with particular index
   * @param {number} index - Item index to slide to.
   * @param {function} callback - Optional callback function.
   */
  goTo(index, callback) {
    if (this.innerElements.length <= this.perPage) {
      return;
    }
    const beforeChange = this.currentSlide;
    this.currentSlide = this.config.loop ?
      index % this.innerElements.length :
      Math.min(Math.max(index, 0), this.innerElements.length - this.perPage);
    if (beforeChange !== this.currentSlide) {
      this.slideToCurrent();
      this.config.onChange.call(this);
      if (callback) {
        callback.call(this);
      }
    }
  }


  /**
   * Moves sliders frame to position of currently active slide
   */
  slideToCurrent(enableTransition) {
    const currentSlide = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide;
    const offset = (this.config.rtl ? 1 : -1) * currentSlide * (this.selectorWidth / this.perPage);

    if (enableTransition) {
      // This one is tricky, I know but this is a perfect explanation:
      // https://youtu.be/cCOL7MC4Pl0
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.enableTransition();
          this.sliderFrame.style[this.transformProperty] = `translate3d(${offset}px, 0, 0)`;
        });
      });
    }
    else {
      this.sliderFrame.style[this.transformProperty] = `translate3d(${offset}px, 0, 0)`;
    }
  }


  /**
   * Recalculate drag /swipe event and reposition the frame of a slider
   */
  updateAfterDrag() {
    const movement = (this.config.rtl ? -1 : 1) * (this.drag.endX - this.drag.startX);
    const movementDistance = Math.abs(movement);
    const howManySliderToSlide = this.config.multipleDrag ? Math.ceil(movementDistance / (this.selectorWidth / this.perPage)) : 1;

    const slideToNegativeClone = movement > 0 && this.currentSlide - howManySliderToSlide < 0;
    const slideToPositiveClone = movement < 0 && this.currentSlide + howManySliderToSlide > this.innerElements.length - this.perPage;

    if (movement > 0 && movementDistance > this.config.threshold && this.innerElements.length > this.perPage) {
      this.prev(howManySliderToSlide);
    }
    else if (movement < 0 && movementDistance > this.config.threshold && this.innerElements.length > this.perPage) {
      this.next(howManySliderToSlide);
    }
    this.slideToCurrent(slideToNegativeClone || slideToPositiveClone);
  }


  /**
   * When window resizes, resize slider components as well
   */
  resizeHandler() {
    // update perPage number dependable of user value
    this.resolveSlidesNumber();

    // relcalculate currentSlide
    // prevent hiding items when browser width increases
    if (this.currentSlide + this.perPage > this.innerElements.length) {
      this.currentSlide = this.innerElements.length <= this.perPage ? 0 : this.innerElements.length - this.perPage;
    }

    this.selectorWidth = this.selector.offsetWidth;

    this.buildSliderFrame();
  }


  /**
   * Clear drag after touchend and mouseup event
   */
  clearDrag() {
    this.drag = {
      startX: 0,
      endX: 0,
      startY: 0,
      letItGo: null,
      preventClick: this.drag.preventClick
    };
  }


  /**
   * touchstart event handler
   */
  touchstartHandler(e) {
    // Prevent dragging / swiping on inputs, selects and textareas
    const ignoreSiema = ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf(e.target.nodeName) !== -1;
    if (ignoreSiema) {
      return;
    }

    e.stopPropagation();
    this.pointerDown = true;
    this.drag.startX = e.touches[0].pageX;
    this.drag.startY = e.touches[0].pageY;
  }


  /**
   * touchend event handler
   */
  touchendHandler(e) {
    e.stopPropagation();
    this.pointerDown = false;
    this.enableTransition();
    if (this.drag.endX) {
      this.updateAfterDrag();
    }
    this.clearDrag();
  }


  /**
   * touchmove event handler
   */
  touchmoveHandler(e) {
    e.stopPropagation();

    if (this.drag.letItGo === null) {
      this.drag.letItGo = Math.abs(this.drag.startY - e.touches[0].pageY) < Math.abs(this.drag.startX - e.touches[0].pageX);
    }

    if (this.pointerDown && this.drag.letItGo) {
      e.preventDefault();
      this.drag.endX = e.touches[0].pageX;
      this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`;
      this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`;

      const currentSlide = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide;
      const currentOffset = currentSlide * (this.selectorWidth / this.perPage);
      const dragOffset = (this.drag.endX - this.drag.startX);
      const offset = this.config.rtl ? currentOffset + dragOffset : currentOffset - dragOffset;
      this.sliderFrame.style[this.transformProperty] = `translate3d(${(this.config.rtl ? 1 : -1) * offset}px, 0, 0)`;
    }
  }


  /**
   * mousedown event handler
   */
  mousedownHandler(e) {
    // Prevent dragging / swiping on inputs, selects and textareas
    const ignoreSiema = ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf(e.target.nodeName) !== -1;
    if (ignoreSiema) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    this.pointerDown = true;
    this.drag.startX = e.pageX;
  }


  /**
   * mouseup event handler
   */
  mouseupHandler(e) {
    e.stopPropagation();
    this.pointerDown = false;
    this.selector.style.cursor = '-webkit-grab';
    this.enableTransition();
    if (this.drag.endX) {
      this.updateAfterDrag();
    }
    this.clearDrag();
  }


  /**
   * mousemove event handler
   */
  mousemoveHandler(e) {
    e.preventDefault();
    if (this.pointerDown) {
      // if dragged element is a link
      // mark preventClick prop as a true
      // to detemine about browser redirection later on
      if (e.target.nodeName === 'A') {
        this.drag.preventClick = true;
      }

      this.drag.endX = e.pageX;
      this.selector.style.cursor = '-webkit-grabbing';
      this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`;
      this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`;

      const currentSlide = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide;
      const currentOffset = currentSlide * (this.selectorWidth / this.perPage);
      const dragOffset = (this.drag.endX - this.drag.startX);
      const offset = this.config.rtl ? currentOffset + dragOffset : currentOffset - dragOffset;
      this.sliderFrame.style[this.transformProperty] = `translate3d(${(this.config.rtl ? 1 : -1) * offset}px, 0, 0)`;
    }
  }


  /**
   * mouseleave event handler
   */
  mouseleaveHandler(e) {
    if (this.pointerDown) {
      this.pointerDown = false;
      this.selector.style.cursor = '-webkit-grab';
      this.drag.endX = e.pageX;
      this.drag.preventClick = false;
      this.enableTransition();
      this.updateAfterDrag();
      this.clearDrag();
    }
  }


  /**
   * click event handler
   */
  clickHandler(e) {
    // if the dragged element is a link
    // prevent browsers from folowing the link
    if (this.drag.preventClick) {
      e.preventDefault();
    }
    this.drag.preventClick = false;
  }


  /**
   * Remove item from carousel.
   * @param {number} index - Item index to remove.
   * @param {function} callback - Optional callback to call after remove.
   */
  remove(index, callback) {
    if (index < 0 || index >= this.innerElements.length) {
      throw new Error('Item to remove doesn\'t exist 😭');
    }

    // Shift sliderFrame back by one item when:
    // 1. Item with lower index than currenSlide is removed.
    // 2. Last item is removed.
    const lowerIndex = index < this.currentSlide;
    const lastItem = this.currentSlide + this.perPage - 1 === index;

    if (lowerIndex || lastItem) {
      this.currentSlide--;
    }

    this.innerElements.splice(index, 1);

    // build a frame and slide to a currentSlide
    this.buildSliderFrame();

    if (callback) {
      callback.call(this);
    }
  }


  /**
   * Insert item to carousel at particular index.
   * @param {HTMLElement} item - Item to insert.
   * @param {number} index - Index of new new item insertion.
   * @param {function} callback - Optional callback to call after insert.
   */
  insert(item, index, callback) {
    if (index < 0 || index > this.innerElements.length + 1) {
      throw new Error('Unable to inset it at this index 😭');
    }
    if (this.innerElements.indexOf(item) !== -1) {
      throw new Error('The same item in a carousel? Really? Nope 😭');
    }

    // Avoid shifting content
    const shouldItShift = index <= this.currentSlide > 0 && this.innerElements.length;
    this.currentSlide = shouldItShift ? this.currentSlide + 1 : this.currentSlide;

    this.innerElements.splice(index, 0, item);

    // build a frame and slide to a currentSlide
    this.buildSliderFrame();

    if (callback) {
      callback.call(this);
    }
  }


  /**
   * Prepernd item to carousel.
   * @param {HTMLElement} item - Item to prepend.
   * @param {function} callback - Optional callback to call after prepend.
   */
  prepend(item, callback) {
    this.insert(item, 0);
    if (callback) {
      callback.call(this);
    }
  }


  /**
   * Append item to carousel.
   * @param {HTMLElement} item - Item to append.
   * @param {function} callback - Optional callback to call after append.
   */
  append(item, callback) {
    this.insert(item, this.innerElements.length + 1);
    if (callback) {
      callback.call(this);
    }
  }


  /**
   * Removes listeners and optionally restores to initial markup
   * @param {boolean} restoreMarkup - Determinants about restoring an initial markup.
   * @param {function} callback - Optional callback function.
   */
  destroy(restoreMarkup = false, callback) {
    this.detachEvents();

    this.selector.style.cursor = 'auto';

    if (restoreMarkup) {
      const slides = document.createDocumentFragment();
      for (let i = 0; i < this.innerElements.length; i++) {
        slides.appendChild(this.innerElements[i]);
      }
      this.selector.innerHTML = '';
      this.selector.appendChild(slides);
      this.selector.removeAttribute('style');
    }

    if (callback) {
      callback.call(this);
    }
  }
}

var exports = {};
var CoreCarousel = (function () {
    function CoreCarousel() {
    }
    CoreCarousel.open = function (elements, index) {
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            var slide = document.createElement('div');
            slide.className = "carousel-slide";
            slide.append(element);
            CoreCarousel._items.push(slide);
        }
        CorePopup.open(CoreCarousel.html());
        CoreMain.reinitializeLazyLoadingImages();
        var updateArrows = function () {
            var leftArrow = $('.carousel-leftarrow');
            var rightArrow = $('.carousel-rightarrow');
            leftArrow.removeClass('_disabled');
            rightArrow.removeClass('_disabled');
            if (CoreCarousel.currentSlide === 0)
                leftArrow.addClass('_disabled');
            if (CoreCarousel.currentSlide + 1 === CoreCarousel.count)
                rightArrow.addClass('_disabled');
        };
        CoreCarousel._siema = new Siema({
            selector: '.carousel-content',
            onChange: function () {
                updateArrows();
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
        else
            updateArrows();
    };
    CoreCarousel.close = function () {
        CoreCarousel._siema = undefined;
        CoreCarousel._items = [];
        CorePopup.close();
    };
    Object.defineProperty(CoreCarousel, "currentSlide", {
        get: function () {
            return this._siema.currentSlide;
        },
        enumerable: false,
        configurable: true
    });
    CoreCarousel.html = function () {
        var carouselElement = "<div class='carousel'>\n                                <div class='carousel-header'><span>\uFFFD</span></div>\n                                <div class='carousel-leftarrow'><span>\uFFFD</span></div>\n                                <div class='carousel-content'>";
        for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
            var item = _a[_i];
            carouselElement += "<div>" + item.outerHTML + "</div>";
        }
        carouselElement += "</div>\n                            <div class='carousel-rightarrow'><span>\uFFFD</span></div>\n                            </div>";
        return carouselElement;
    };
    CoreCarousel.goTo = function (index) {
        this._siema.goTo(index);
    };
    CoreCarousel.prev = function () {
        this._siema.prev();
    };
    CoreCarousel.next = function () {
        this._siema.next();
    };
    CoreCarousel.isOpened = function () {
        return this._siema !== undefined;
    };
    Object.defineProperty(CoreCarousel, "count", {
        get: function () {
            return this._items.length;
        },
        enumerable: false,
        configurable: true
    });
    CoreCarousel._items = [];
    return CoreCarousel;
}());
{ CoreCarousel };
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

