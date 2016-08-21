function css_browser_selector(e) {
    var f = e.toLowerCase(),
        e = function(e) {
            return -1 < f.indexOf(e)
        },
        s = document.documentElement;
    c = [!/opera|webtv/i.test(f) && /msie\s(\d)/.test(f) ? "ie ie" + RegExp.$1 : e("firefox/2") ? "gecko ff2" : e("firefox/3.5") ? "gecko ff3 ff3_5" : e("firefox/3.6") ? "gecko ff3 ff3_6" : e("firefox/3") ? "gecko ff3" : e("gecko/") ? "gecko" : e("opera") ? "opera" + (/version\/(\d+)/.test(f) ? " opera" + RegExp.$1 : /opera(\s|\/)(\d+)/.test(f) ? " opera" + RegExp.$2 : "") : e("konqueror") ? "konqueror" : e("blackberry") ? "mobile blackberry" :
        e("android") ? "mobile android" : e("chrome") ? "webkit chrome" : e("iron") ? "webkit iron" : e("applewebkit/") ? "webkit safari" + (/version\/(\d+)/.test(f) ? " safari" + RegExp.$1 : "") : e("mozilla/") ? "gecko" : "", e("j2me") ? "mobile j2me" : e("iphone") ? "mobile iphone" : e("ipod") ? "mobile ipod" : e("ipad") ? "mobile ipad" : e("mac") ? "mac" : e("darwin") ? "mac" : e("webtv") ? "webtv" : e("win") ? "win" + (e("windows nt 6.0") ? " vista" : "") : e("freebsd") ? "freebsd" : e("x11") || e("linux") ? "linux" : "", "js"
    ].join(" ");
    s.className += " " + c;
    return c
}
css_browser_selector(navigator.userAgent);
(function() {
    var e = Math,
        f = /webkit/i.test(navigator.appVersion) ? "webkit" : /firefox/i.test(navigator.userAgent) ? "Moz" : "opera" in window ? "O" : "",
        s = "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix,
        o = "ontouchstart" in window,
        u = f + "Transform" in document.documentElement.style,
        x = /android/gi.test(navigator.appVersion),
        y = /iphone|ipad/gi.test(navigator.appVersion),
        k = /playbook/gi.test(navigator.appVersion),
        A = y || k,
        i = function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(b) {
                    return setTimeout(b, 1)
                }
        }(),
        r = window.cancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout,
        l = "onorientationchange" in window ? "orientationchange" : "resize",
        p = o ? "touchstart" : "mousedown",
        B = o ? "touchmove" : "mousemove",
        m = o ? "touchend" : "mouseup",
        n = o ? "touchcancel" : "mouseup",
        z = "Moz" == f ? "DOMMouseScroll" :
        "mousewheel",
        v = "translate" + (s ? "3d(" : "("),
        t = s ? ",0)" : ")",
        k = function(b, a) {
            var d = this,
                h;
            d.wrapper = "object" == typeof b ? b : document.getElementById(b);
            d.wrapper.style.overflow = "hidden";
            d.scroller = d.wrapper.children[0];
            d.options = {
                hScroll: !0,
                vScroll: !0,
                x: 0,
                y: 0,
                bounce: !0,
                bounceLock: !1,
                momentum: !0,
                lockDirection: !0,
                useTransform: !0,
                useTransition: !1,
                topOffset: 0,
                checkDOMChanges: !1,
                hScrollbar: !0,
                vScrollbar: !0,
                fixedScrollbar: x,
                hideScrollbar: y,
                fadeScrollbar: y && s,
                scrollbarClass: "",
                zoom: !1,
                zoomMin: 1,
                zoomMax: 4,
                doubleTapZoom: 2,
                wheelAction: "scroll",
                snap: !1,
                snapThreshold: 1,
                onRefresh: null,
                onBeforeScrollStart: function(a) {
                    a.preventDefault()
                },
                onScrollStart: null,
                onBeforeScrollMove: null,
                onScrollMove: null,
                onBeforeScrollEnd: null,
                onScrollEnd: null,
                onTouchEnd: null,
                onDestroy: null,
                onZoomStart: null,
                onZoom: null,
                onZoomEnd: null
            };
            for (h in a) d.options[h] = a[h];
            d.x = d.options.x;
            d.y = d.options.y;
            d.options.useTransform = u ? d.options.useTransform : !1;
            d.options.hScrollbar = d.options.hScroll && d.options.hScrollbar;
            d.options.vScrollbar = d.options.vScroll &&
                d.options.vScrollbar;
            d.options.zoom = d.options.useTransform && d.options.zoom;
            d.options.useTransition = A && d.options.useTransition;
            d.scroller.style[f + "TransitionProperty"] = d.options.useTransform ? "-" + f.toLowerCase() + "-transform" : "top left";
            d.scroller.style[f + "TransitionDuration"] = "0";
            d.scroller.style[f + "TransformOrigin"] = "0 0";
            d.options.useTransition && (d.scroller.style[f + "TransitionTimingFunction"] = "cubic-bezier(0.33,0.66,0.66,1)");
            d.options.useTransform ? d.scroller.style[f + "Transform"] = v + d.x + "px," + d.y +
                "px" + t : d.scroller.style.cssText += ";position:absolute;top:" + d.y + "px;left:" + d.x + "px";
            if (d.options.useTransition) d.options.fixedScrollbar = !0;
            d.refresh();
            d._bind(l, window);
            d._bind(p);
            o || (d._bind("mouseout", d.wrapper), d._bind(z));
            if (d.options.checkDOMChanges) d.checkDOMTime = setInterval(function() {
                d._checkDOMChanges()
            }, 500)
        };
    k.prototype = {
        enabled: !0,
        x: 0,
        y: 0,
        steps: [],
        scale: 1,
        currPageX: 0,
        currPageY: 0,
        pagesX: [],
        pagesY: [],
        aniTime: null,
        wheelZoomCount: 0,
        handleEvent: function(b) {
            switch (b.type) {
                case p:
                    if (!o && 0 !== b.button) break;
                    this._start(b);
                    break;
                case B:
                    this._move(b);
                    break;
                case m:
                case n:
                    this._end(b);
                    break;
                case l:
                    this._resize();
                    break;
                case z:
                    this._wheel(b);
                    break;
                case "mouseout":
                    this._mouseout(b);
                    break;
                case "webkitTransitionEnd":
                    this._transitionEnd(b)
            }
        },
        _checkDOMChanges: function() {
            !this.moved && !this.zoomed && !(this.animating || this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale) && this.refresh()
        },
        _scrollbar: function(b) {
            var a = document,
                d;
            if (this[b + "Scrollbar"]) {
                if (!this[b +
                        "ScrollbarWrapper"]) {
                    d = a.createElement("div");
                    this.options.scrollbarClass ? d.className = this.options.scrollbarClass + b.toUpperCase() : d.style.cssText = "position:absolute;z-index:100;" + ("h" == b ? "height:7px;bottom:1px;left:2px;right:" + (this.vScrollbar ? "7" : "2") + "px" : "width:7px;bottom:" + (this.hScrollbar ? "7" : "2") + "px;top:2px;right:1px");
                    d.style.cssText += ";pointer-events:none;-" + f + "-transition-property:opacity;-" + f + "-transition-duration:" + (this.options.fadeScrollbar ? "350ms" : "0") + ";overflow:hidden;opacity:" + (this.options.hideScrollbar ?
                        "0" : "1");
                    this.wrapper.appendChild(d);
                    this[b + "ScrollbarWrapper"] = d;
                    d = a.createElement("div");
                    if (!this.options.scrollbarClass) d.style.cssText = "position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);-" + f + "-background-clip:padding-box;-" + f + "-box-sizing:border-box;" + ("h" == b ? "height:100%" : "width:100%") + ";-" + f + "-border-radius:3px;border-radius:3px";
                    d.style.cssText += ";pointer-events:none;-" + f + "-transition-property:-" + f + "-transform;-" + f + "-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-" +
                        f + "-transition-duration:0;-" + f + "-transform:" + v + "0,0" + t;
                    this.options.useTransition && (d.style.cssText += ";-" + f + "-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)");
                    this[b + "ScrollbarWrapper"].appendChild(d);
                    this[b + "ScrollbarIndicator"] = d
                }
                "h" == b ? (this.hScrollbarSize = this.hScrollbarWrapper.clientWidth, this.hScrollbarIndicatorSize = e.max(e.round(this.hScrollbarSize * this.hScrollbarSize / this.scrollerW), 8), this.hScrollbarIndicator.style.width = this.hScrollbarIndicatorSize + "px", this.hScrollbarMaxScroll =
                    this.hScrollbarSize - this.hScrollbarIndicatorSize, this.hScrollbarProp = this.hScrollbarMaxScroll / this.maxScrollX) : (this.vScrollbarSize = this.vScrollbarWrapper.clientHeight, this.vScrollbarIndicatorSize = e.max(e.round(this.vScrollbarSize * this.vScrollbarSize / this.scrollerH), 8), this.vScrollbarIndicator.style.height = this.vScrollbarIndicatorSize + "px", this.vScrollbarMaxScroll = this.vScrollbarSize - this.vScrollbarIndicatorSize, this.vScrollbarProp = this.vScrollbarMaxScroll / this.maxScrollY);
                this._scrollbarPos(b, !0)
            } else this[b +
                "ScrollbarWrapper"] && (u && (this[b + "ScrollbarIndicator"].style[f + "Transform"] = ""), this[b + "ScrollbarWrapper"].parentNode.removeChild(this[b + "ScrollbarWrapper"]), this[b + "ScrollbarWrapper"] = null, this[b + "ScrollbarIndicator"] = null)
        },
        _resize: function() {
            var b = this;
            setTimeout(function() {
                b.refresh()
            }, x ? 200 : 0)
        },
        _pos: function(b, a) {
            b = this.hScroll ? b : 0;
            a = this.vScroll ? a : 0;
            this.options.useTransform ? this.scroller.style[f + "Transform"] = v + b + "px," + a + "px" + t + " scale(" + this.scale + ")" : (b = e.round(b), a = e.round(a), this.scroller.style.left =
                b + "px", this.scroller.style.top = a + "px");
            this.x = b;
            this.y = a;
            this._scrollbarPos("h");
            this._scrollbarPos("v")
        },
        _scrollbarPos: function(b, a) {
            var d = "h" == b ? this.x : this.y;
            if (this[b + "Scrollbar"]) d *= this[b + "ScrollbarProp"], 0 > d ? (this.options.fixedScrollbar || (d = this[b + "ScrollbarIndicatorSize"] + e.round(3 * d), 8 > d && (d = 8), this[b + "ScrollbarIndicator"].style["h" == b ? "width" : "height"] = d + "px"), d = 0) : d > this[b + "ScrollbarMaxScroll"] && (this.options.fixedScrollbar ? d = this[b + "ScrollbarMaxScroll"] : (d = this[b + "ScrollbarIndicatorSize"] -
                e.round(3 * (d - this[b + "ScrollbarMaxScroll"])), 8 > d && (d = 8), this[b + "ScrollbarIndicator"].style["h" == b ? "width" : "height"] = d + "px", d = this[b + "ScrollbarMaxScroll"] + (this[b + "ScrollbarIndicatorSize"] - d))), this[b + "ScrollbarWrapper"].style[f + "TransitionDelay"] = "0", this[b + "ScrollbarWrapper"].style.opacity = a && this.options.hideScrollbar ? "0" : "1", this[b + "ScrollbarIndicator"].style[f + "Transform"] = v + ("h" == b ? d + "px,0" : "0," + d + "px") + t
        },
        _start: function(b) {
            var a = o ? b.touches[0] : b,
                d, h;
            if (this.enabled) {
                this.options.onBeforeScrollStart &&
                    this.options.onBeforeScrollStart.call(this, b);
                (this.options.useTransition || this.options.zoom) && this._transitionTime(0);
                this.zoomed = this.animating = this.moved = !1;
                this.dirY = this.dirX = this.absDistY = this.absDistX = this.distY = this.distX = 0;
                if (this.options.zoom && o && 1 < b.touches.length) h = e.abs(b.touches[0].pageX - b.touches[1].pageX), d = e.abs(b.touches[0].pageY - b.touches[1].pageY), this.touchesDistStart = e.sqrt(h * h + d * d), this.originX = e.abs(b.touches[0].pageX + b.touches[1].pageX - 2 * this.wrapperOffsetLeft) / 2 - this.x, this.originY =
                    e.abs(b.touches[0].pageY + b.touches[1].pageY - 2 * this.wrapperOffsetTop) / 2 - this.y, this.options.onZoomStart && this.options.onZoomStart.call(this, b);
                if (this.options.momentum && (this.options.useTransform ? (d = getComputedStyle(this.scroller, null)[f + "Transform"].replace(/[^0-9-.,]/g, "").split(","), h = 1 * d[4], d = 1 * d[5]) : (h = 1 * getComputedStyle(this.scroller, null).left.replace(/[^0-9-]/g, ""), d = 1 * getComputedStyle(this.scroller, null).top.replace(/[^0-9-]/g, "")), h != this.x || d != this.y)) this.options.useTransition ? this._unbind("webkitTransitionEnd") :
                    r(this.aniTime), this.steps = [], this._pos(h, d);
                this.absStartX = this.x;
                this.absStartY = this.y;
                this.startX = this.x;
                this.startY = this.y;
                this.pointX = a.pageX;
                this.pointY = a.pageY;
                this.startTime = b.timeStamp || Date.now();
                this.options.onScrollStart && this.options.onScrollStart.call(this, b);
                this._bind(B);
                this._bind(m);
                this._bind(n)
            }
        },
        _move: function(b) {
            var a = o ? b.touches[0] : b,
                d = a.pageX - this.pointX,
                h = a.pageY - this.pointY,
                g = this.x + d,
                i = this.y + h,
                j = b.timeStamp || Date.now();
            this.options.onBeforeScrollMove && this.options.onBeforeScrollMove.call(this,
                b);
            if (this.options.zoom && o && 1 < b.touches.length) g = e.abs(b.touches[0].pageX - b.touches[1].pageX), i = e.abs(b.touches[0].pageY - b.touches[1].pageY), this.touchesDist = e.sqrt(g * g + i * i), this.zoomed = !0, a = 1 / this.touchesDistStart * this.touchesDist * this.scale, a < this.options.zoomMin ? a = 0.5 * this.options.zoomMin * Math.pow(2, a / this.options.zoomMin) : a > this.options.zoomMax && (a = 2 * this.options.zoomMax * Math.pow(0.5, this.options.zoomMax / a)), this.lastScale = a / this.scale, g = this.originX - this.originX * this.lastScale + this.x, i = this.originY -
                this.originY * this.lastScale + this.y, this.scroller.style[f + "Transform"] = v + g + "px," + i + "px" + t + " scale(" + a + ")", this.options.onZoom && this.options.onZoom.call(this, b);
            else {
                this.pointX = a.pageX;
                this.pointY = a.pageY;
                if (0 < g || g < this.maxScrollX) g = this.options.bounce ? this.x + d / 2 : 0 <= g || 0 <= this.maxScrollX ? 0 : this.maxScrollX;
                if (i > this.minScrollY || i < this.maxScrollY) i = this.options.bounce ? this.y + h / 2 : i >= this.minScrollY || 0 <= this.maxScrollY ? this.minScrollY : this.maxScrollY;
                if (6 > this.absDistX && 6 > this.absDistY) this.distX += d, this.distY +=
                    h, this.absDistX = e.abs(this.distX), this.absDistY = e.abs(this.distY);
                else {
                    if (this.options.lockDirection)
                        if (this.absDistX > this.absDistY + 5) i = this.y, h = 0;
                        else if (this.absDistY > this.absDistX + 5) g = this.x, d = 0;
                    this.moved = !0;
                    this._pos(g, i);
                    this.dirX = 0 < d ? -1 : 0 > d ? 1 : 0;
                    this.dirY = 0 < h ? -1 : 0 > h ? 1 : 0;
                    if (300 < j - this.startTime) this.startTime = j, this.startX = this.x, this.startY = this.y;
                    this.options.onScrollMove && this.options.onScrollMove.call(this, b)
                }
            }
        },
        _end: function(b) {
            if (!(o && 0 != b.touches.length)) {
                var a = this,
                    d = o ? b.changedTouches[0] :
                    b,
                    h, g, i = {
                        dist: 0,
                        time: 0
                    },
                    j = {
                        dist: 0,
                        time: 0
                    },
                    w = (b.timeStamp || Date.now()) - a.startTime,
                    q = a.x,
                    C = a.y;
                a._unbind(B);
                a._unbind(m);
                a._unbind(n);
                a.options.onBeforeScrollEnd && a.options.onBeforeScrollEnd.call(a, b);
                if (a.zoomed) q = a.scale * a.lastScale, q = Math.max(a.options.zoomMin, q), q = Math.min(a.options.zoomMax, q), a.lastScale = q / a.scale, a.scale = q, a.x = a.originX - a.originX * a.lastScale + a.x, a.y = a.originY - a.originY * a.lastScale + a.y, a.scroller.style[f + "TransitionDuration"] = "200ms", a.scroller.style[f + "Transform"] = v + a.x + "px," +
                    a.y + "px" + t + " scale(" + a.scale + ")", a.zoomed = !1, a.refresh(), a.options.onZoomEnd && a.options.onZoomEnd.call(a, b);
                else {
                    if (a.moved) {
                        if (300 > w && a.options.momentum) {
                            i = q ? a._momentum(q - a.startX, w, -a.x, a.scrollerW - a.wrapperW + a.x, a.options.bounce ? a.wrapperW : 0) : i;
                            j = C ? a._momentum(C - a.startY, w, -a.y, 0 > a.maxScrollY ? a.scrollerH - a.wrapperH + a.y - a.minScrollY : 0, a.options.bounce ? a.wrapperH : 0) : j;
                            q = a.x + i.dist;
                            C = a.y + j.dist;
                            if (0 < a.x && 0 < q || a.x < a.maxScrollX && q < a.maxScrollX) i = {
                                dist: 0,
                                time: 0
                            };
                            if (a.y > a.minScrollY && C > a.minScrollY ||
                                a.y < a.maxScrollY && C < a.maxScrollY) j = {
                                dist: 0,
                                time: 0
                            }
                        }
                        if (i.dist || j.dist) {
                            i = e.max(e.max(i.time, j.time), 10);
                            if (a.options.snap) j = q - a.absStartX, w = C - a.absStartY, e.abs(j) < a.options.snapThreshold && e.abs(w) < a.options.snapThreshold ? a.scrollTo(a.absStartX, a.absStartY, 200) : (j = a._snap(q, C), q = j.x, C = j.y, i = e.max(j.time, i));
                            a.scrollTo(e.round(q), e.round(C), i)
                        } else a.options.snap ? (j = q - a.absStartX, w = C - a.absStartY, e.abs(j) < a.options.snapThreshold && e.abs(w) < a.options.snapThreshold ? a.scrollTo(a.absStartX, a.absStartY, 200) :
                            (j = a._snap(a.x, a.y), (j.x != a.x || j.y != a.y) && a.scrollTo(j.x, j.y, j.time))) : a._resetPos(200)
                    } else {
                        if (o) a.doubleTapTimer && a.options.zoom ? (clearTimeout(a.doubleTapTimer), a.doubleTapTimer = null, a.options.onZoomStart && a.options.onZoomStart.call(a, b), a.zoom(a.pointX, a.pointY, 1 == a.scale ? a.options.doubleTapZoom : 1), a.options.onZoomEnd && setTimeout(function() {
                            a.options.onZoomEnd.call(a, b)
                        }, 200)) : a.doubleTapTimer = setTimeout(function() {
                            a.doubleTapTimer = null;
                            for (h = d.target; 1 != h.nodeType;) h = h.parentNode;
                            if ("SELECT" !=
                                h.tagName && "INPUT" != h.tagName && "TEXTAREA" != h.tagName) g = document.createEvent("MouseEvents"), g.initMouseEvent("click", !0, !0, b.view, 1, d.screenX, d.screenY, d.clientX, d.clientY, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, 0, null), g._fake = !0, h.dispatchEvent(g)
                        }, a.options.zoom ? 250 : 0);
                        a._resetPos(200)
                    }
                    a.options.onTouchEnd && a.options.onTouchEnd.call(a, b)
                }
            }
        },
        _resetPos: function(b) {
            var a = 0 <= this.x ? 0 : this.x < this.maxScrollX ? this.maxScrollX : this.x,
                d = this.y >= this.minScrollY || 0 < this.maxScrollY ? this.minScrollY : this.y < this.maxScrollY ?
                this.maxScrollY : this.y;
            if (a == this.x && d == this.y) {
                if (this.moved) this.moved = !1, this.options.onScrollEnd && this.options.onScrollEnd.call(this);
                if (this.hScrollbar && this.options.hideScrollbar) "webkit" == f && (this.hScrollbarWrapper.style[f + "TransitionDelay"] = "300ms"), this.hScrollbarWrapper.style.opacity = "0";
                if (this.vScrollbar && this.options.hideScrollbar) "webkit" == f && (this.vScrollbarWrapper.style[f + "TransitionDelay"] = "300ms"), this.vScrollbarWrapper.style.opacity = "0"
            } else this.scrollTo(a, d, b || 0)
        },
        _wheel: function(b) {
            var a =
                this,
                d, h;
            "wheelDeltaX" in b ? (d = b.wheelDeltaX / 12, h = b.wheelDeltaY / 12) : d = "detail" in b ? h = 3 * -b.detail : h = -b.wheelDelta;
            if ("zoom" == a.options.wheelAction) {
                h = a.scale * Math.pow(2, 1 / 3 * (h ? h / Math.abs(h) : 0));
                if (h < a.options.zoomMin) h = a.options.zoomMin;
                if (h > a.options.zoomMax) h = a.options.zoomMax;
                h != a.scale && (!a.wheelZoomCount && a.options.onZoomStart && a.options.onZoomStart.call(a, b), a.wheelZoomCount++, a.zoom(b.pageX, b.pageY, h, 400), setTimeout(function() {
                    a.wheelZoomCount--;
                    !a.wheelZoomCount && a.options.onZoomEnd && a.options.onZoomEnd.call(a,
                        b)
                }, 400))
            } else {
                d = a.x + d;
                h = a.y + h;
                if (0 < d) d = 0;
                else if (d < a.maxScrollX) d = a.maxScrollX;
                if (h > a.minScrollY) h = a.minScrollY;
                else if (h < a.maxScrollY) h = a.maxScrollY;
                a.scrollTo(d, h, 0)
            }
        },
        _mouseout: function(b) {
            var a = b.relatedTarget;
            if (a)
                for (; a = a.parentNode;)
                    if (a == this.wrapper) return;
            this._end(b)
        },
        _transitionEnd: function(b) {
            b.target == this.scroller && (this._unbind("webkitTransitionEnd"), this._startAni())
        },
        _startAni: function() {
            var b = this,
                a = b.x,
                d = b.y,
                h = Date.now(),
                g, f, j;
            if (!b.animating)
                if (b.steps.length) {
                    g = b.steps.shift();
                    if (g.x == a && g.y == d) g.time = 0;
                    b.animating = !0;
                    b.moved = !0;
                    b.options.useTransition ? (b._transitionTime(g.time), b._pos(g.x, g.y), b.animating = !1, g.time ? b._bind("webkitTransitionEnd") : b._resetPos(0)) : (j = function() {
                        var w = Date.now();
                        if (w >= h + g.time) b._pos(g.x, g.y), b.animating = !1, b.options.onAnimationEnd && b.options.onAnimationEnd.call(b), b._startAni();
                        else if (w = (w - h) / g.time - 1, f = e.sqrt(1 - w * w), w = (g.x - a) * f + a, b._pos(w, (g.y - d) * f + d), b.animating) b.aniTime = i(j)
                    }, j())
                } else b._resetPos(400)
        },
        _transitionTime: function(b) {
            b +=
                "ms";
            this.scroller.style[f + "TransitionDuration"] = b;
            this.hScrollbar && (this.hScrollbarIndicator.style[f + "TransitionDuration"] = b);
            this.vScrollbar && (this.vScrollbarIndicator.style[f + "TransitionDuration"] = b)
        },
        _momentum: function(b, a, d, h, g) {
            var a = e.abs(b) / a,
                f = a * a / 0.0012,
                j = 0,
                j = 0;
            0 < b && f > d ? (d += g / (6 / (6.0E-4 * (f / a))), a = a * d / f, f = d) : 0 > b && f > h && (h += g / (6 / (6.0E-4 * (f / a))), a = a * h / f, f = h);
            return {
                dist: f * (0 > b ? -1 : 1),
                time: e.round(a / 6.0E-4)
            }
        },
        _offset: function(b) {
            for (var a = -b.offsetLeft, d = -b.offsetTop; b = b.offsetParent;) a -= b.offsetLeft,
                d -= b.offsetTop;
            b != this.wrapper && (a *= this.scale, d *= this.scale);
            return {
                left: a,
                top: d
            }
        },
        _snap: function(b, a) {
            var d, f, g;
            g = this.pagesX.length - 1;
            for (d = 0, f = this.pagesX.length; d < f; d++)
                if (b >= this.pagesX[d]) {
                    g = d;
                    break
                }
            g == this.currPageX && 0 < g && 0 > this.dirX && g--;
            b = this.pagesX[g];
            f = (f = e.abs(b - this.pagesX[this.currPageX])) ? 500 * (e.abs(this.x - b) / f) : 0;
            this.currPageX = g;
            g = this.pagesY.length - 1;
            for (d = 0; d < g; d++)
                if (a >= this.pagesY[d]) {
                    g = d;
                    break
                }
            g == this.currPageY && 0 < g && 0 > this.dirY && g--;
            a = this.pagesY[g];
            d = (d = e.abs(a - this.pagesY[this.currPageY])) ?
                500 * (e.abs(this.y - a) / d) : 0;
            this.currPageY = g;
            g = e.round(e.max(f, d)) || 200;
            return {
                x: b,
                y: a,
                time: g
            }
        },
        _bind: function(b, a, d) {
            (a || this.scroller).addEventListener(b, this, !!d)
        },
        _unbind: function(b, a, d) {
            (a || this.scroller).removeEventListener(b, this, !!d)
        },
        destroy: function() {
            this.scroller.style[f + "Transform"] = "";
            this.vScrollbar = this.hScrollbar = !1;
            this._scrollbar("h");
            this._scrollbar("v");
            this._unbind(l, window);
            this._unbind(p);
            this._unbind(B);
            this._unbind(m);
            this._unbind(n);
            this.options.hasTouch && (this._unbind("mouseout",
                this.wrapper), this._unbind(z));
            this.options.useTransition && this._unbind("webkitTransitionEnd");
            this.options.checkDOMChanges && clearInterval(this.checkDOMTime);
            this.options.onDestroy && this.options.onDestroy.call(this)
        },
        refresh: function() {
            var b, a, d, h = 0;
            a = 0;
            if (this.scale < this.options.zoomMin) this.scale = this.options.zoomMin;
            this.wrapperW = this.wrapper.clientWidth || 1;
            this.wrapperH = this.wrapper.clientHeight || 1;
            this.minScrollY = -this.options.topOffset || 0;
            this.scrollerW = e.round(this.scroller.offsetWidth * this.scale);
            this.scrollerH = e.round((this.scroller.offsetHeight + this.minScrollY) * this.scale);
            this.maxScrollX = this.wrapperW - this.scrollerW;
            this.maxScrollY = this.wrapperH - this.scrollerH + this.minScrollY;
            this.dirY = this.dirX = 0;
            this.options.onRefresh && this.options.onRefresh.call(this);
            this.hScroll = this.options.hScroll && 0 > this.maxScrollX;
            this.vScroll = this.options.vScroll && (!this.options.bounceLock && !this.hScroll || this.scrollerH > this.wrapperH);
            this.hScrollbar = this.hScroll && this.options.hScrollbar;
            this.vScrollbar = this.vScroll &&
                this.options.vScrollbar && this.scrollerH > this.wrapperH;
            b = this._offset(this.wrapper);
            this.wrapperOffsetLeft = -b.left;
            this.wrapperOffsetTop = -b.top;
            if ("string" == typeof this.options.snap) {
                this.pagesX = [];
                this.pagesY = [];
                d = this.scroller.querySelectorAll(this.options.snap);
                for (b = 0, a = d.length; b < a; b++) h = this._offset(d[b]), h.left += this.wrapperOffsetLeft, h.top += this.wrapperOffsetTop, this.pagesX[b] = h.left < this.maxScrollX ? this.maxScrollX : h.left * this.scale, this.pagesY[b] = h.top < this.maxScrollY ? this.maxScrollY : h.top *
                    this.scale
            } else if (this.options.snap) {
                for (this.pagesX = []; h >= this.maxScrollX;) this.pagesX[a] = h, h -= this.wrapperW, a++;
                this.maxScrollX % this.wrapperW && (this.pagesX[this.pagesX.length] = this.maxScrollX - this.pagesX[this.pagesX.length - 1] + this.pagesX[this.pagesX.length - 1]);
                a = h = 0;
                for (this.pagesY = []; h >= this.maxScrollY;) this.pagesY[a] = h, h -= this.wrapperH, a++;
                this.maxScrollY % this.wrapperH && (this.pagesY[this.pagesY.length] = this.maxScrollY - this.pagesY[this.pagesY.length - 1] + this.pagesY[this.pagesY.length - 1])
            }
            this._scrollbar("h");
            this._scrollbar("v");
            this.zoomed || (this.scroller.style[f + "TransitionDuration"] = "0", this._resetPos(200))
        },
        scrollTo: function(b, a, d, f) {
            var g = b;
            this.stop();
            g.length || (g = [{
                x: b,
                y: a,
                time: d,
                relative: f
            }]);
            for (b = 0, a = g.length; b < a; b++) {
                if (g[b].relative) g[b].x = this.x - g[b].x, g[b].y = this.y - g[b].y;
                this.steps.push({
                    x: g[b].x,
                    y: g[b].y,
                    time: g[b].time || 0
                })
            }
            this._startAni()
        },
        scrollToElement: function(b, a) {
            var d;
            if (b = b.nodeType ? b : this.scroller.querySelector(b)) d = this._offset(b), d.left += this.wrapperOffsetLeft, d.top += this.wrapperOffsetTop,
                d.left = 0 < d.left ? 0 : d.left < this.maxScrollX ? this.maxScrollX : d.left, d.top = d.top > this.minScrollY ? this.minScrollY : d.top < this.maxScrollY ? this.maxScrollY : d.top, a = void 0 === a ? e.max(2 * e.abs(d.left), 2 * e.abs(d.top)) : a, this.scrollTo(d.left, d.top, a)
        },
        scrollToPage: function(b, a, d) {
            this.options.onScrollStart && this.options.onScrollStart.call(this);
            if (this.options.snap) b = "next" == b ? this.currPageX + 1 : "prev" == b ? this.currPageX - 1 : b, a = "next" == a ? this.currPageY + 1 : "prev" == a ? this.currPageY - 1 : a, b = 0 > b ? 0 : b > this.pagesX.length - 1 ? this.pagesX.length -
                1 : b, a = 0 > a ? 0 : a > this.pagesY.length - 1 ? this.pagesY.length - 1 : a, this.currPageX = b, this.currPageY = a, b = this.pagesX[b], a = this.pagesY[a];
            else {
                b *= -this.wrapperW;
                a *= -this.wrapperH;
                if (b < this.maxScrollX) b = this.maxScrollX;
                if (a < this.maxScrollY) a = this.maxScrollY
            }
            this.scrollTo(b, a, d || 400)
        },
        disable: function() {
            this.stop();
            this._resetPos(0);
            this.enabled = !1;
            this._unbind(B);
            this._unbind(m);
            this._unbind(n)
        },
        enable: function() {
            this.enabled = !0
        },
        stop: function() {
            this.options.useTransition ? this._unbind("webkitTransitionEnd") : r(this.aniTime);
            this.steps = [];
            this.animating = this.moved = !1
        },
        zoom: function(b, a, d, e) {
            var g = d / this.scale;
            if (this.options.useTransform) this.zoomed = !0, e = void 0 === e ? 200 : e, b = b - this.wrapperOffsetLeft - this.x, a = a - this.wrapperOffsetTop - this.y, this.x = b - b * g + this.x, this.y = a - a * g + this.y, this.scale = d, this.refresh(), this.x = 0 < this.x ? 0 : this.x < this.maxScrollX ? this.maxScrollX : this.x, this.y = this.y > this.minScrollY ? this.minScrollY : this.y < this.maxScrollY ? this.maxScrollY : this.y, this.scroller.style[f + "TransitionDuration"] = e + "ms", this.scroller.style[f +
                "Transform"] = v + this.x + "px," + this.y + "px" + t + " scale(" + d + ")", this.zoomed = !1
        },
        isReady: function() {
            return !this.moved && !this.zoomed && !this.animating
        }
    };
    "undefined" !== typeof exports ? exports.iScroll = k : window.iScroll = k
})();
window.Modernizr = function(e, f, s) {
    function o() {
        k.input = function(a) {
            for (var b = 0, d = a.length; b < d; b++) v[a[b]] = a[b] in l;
            return v
        }("autocomplete autofocus list placeholder max min multiple pattern required step".split(" "));
        k.inputtypes = function(a) {
            for (var b = 0, d, e, g, h = a.length; b < h; b++) l.setAttribute("type", e = a[b]), d = "text" !== l.type, d && (l.value = p, l.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(e) && l.style.WebkitAppearance !== s ? (A.appendChild(l), g = f.defaultView, d = g.getComputedStyle && "textfield" !==
                g.getComputedStyle(l, null).WebkitAppearance && 0 !== l.offsetHeight, A.removeChild(l)) : /^(search|tel)$/.test(e) || (/^(url|email)$/.test(e) ? d = l.checkValidity && !1 === l.checkValidity() : /^color$/.test(e) ? (A.appendChild(l), d = l.value != p, A.removeChild(l)) : d = l.value != p)), z[a[b]] = !!d;
            return z
        }("search tel url email datetime date month week time datetime-local number range color".split(" "))
    }

    function u(a, b) {
        var d = a.charAt(0).toUpperCase() + a.substr(1),
            d = (a + " " + n.join(d + " ") + d).split(" ");
        return x(d, b)
    }

    function x(a,
        b) {
        for (var d in a)
            if (r[a[d]] !== s) return "pfx" == b ? a[d] : !0;
        return !1
    }

    function y(a, b) {
        return typeof a === b
    }
    var k = {},
        A = f.documentElement;
    f.head || f.getElementsByTagName("head");
    var i = f.createElement("modernizr"),
        r = i.style,
        l = f.createElement("input"),
        p = ":)",
        B = Object.prototype.toString,
        m = " -webkit- -moz- -o- -ms- -khtml- ".split(" "),
        n = "Webkit Moz O ms Khtml".split(" "),
        i = {},
        z = {},
        v = {},
        t = [],
        b = function(a, b, d, e) {
            var g, h, i = f.createElement("div");
            if (parseInt(d, 10))
                for (; d--;) h = f.createElement("div"), h.id = e ? e[d] : "modernizr" +
                    (d + 1), i.appendChild(h);
            g = ["&shy;<style>", a, "</style>"].join("");
            i.id = "modernizr";
            i.innerHTML += g;
            A.appendChild(i);
            a = b(i, a);
            i.parentNode.removeChild(i);
            return !!a
        },
        a = function() {
            var a = {
                select: "input",
                change: "input",
                submit: "form",
                reset: "form",
                error: "img",
                load: "img",
                abort: "img"
            };
            return function(b, d) {
                d = d || f.createElement(a[b] || "div");
                b = "on" + b;
                var e = b in d;
                e || (d.setAttribute || (d = f.createElement("div")), d.setAttribute && d.removeAttribute && (d.setAttribute(b, ""), e = y(d[b], "function"), y(d[b], s) || (d[b] = s), d.removeAttribute(b)));
                return e
            }
        }(),
        d, h = {}.hasOwnProperty,
        g;
    !y(h, s) && !y(h.call, s) ? g = function(a, b) {
        return h.call(a, b)
    } : g = function(a, b) {
        return b in a && y(a.constructor.prototype[b], s)
    };
    (function(a, d) {
        var g = a.join(""),
            h = d.length;
        b(g, function(a, b) {
            for (var d = f.styleSheets[f.styleSheets.length - 1], d = d.cssRules && d.cssRules[0] ? d.cssRules[0].cssText : d.cssText || "", j = a.childNodes, g = {}; h--;) g[j[h].id] = j[h];
            k.touch = "ontouchstart" in e || 9 === g.touch.offsetTop;
            k.csstransforms3d = 9 === g.csstransforms3d.offsetLeft;
            k.generatedcontent = 1 <= g.generatedcontent.offsetHeight;
            k.fontface = /src/i.test(d) && 0 === d.indexOf(b.split(" ")[0])
        }, h, d)
    })(['@font-face {font-family:"font";src:url("https://")}', ["@media (", m.join("touch-enabled),("), "modernizr){#touch{top:9px;position:absolute}}"].join(""), ["@media (", m.join("transform-3d),("), "modernizr){#csstransforms3d{left:9px;position:absolute}}"].join(""), ['#generatedcontent:after{content:"', p, '";visibility:hidden}'].join("")], ["fontface", "touch", "csstransforms3d", "generatedcontent"]);
    i.flexbox = function() {
        var a = f.createElement("div"),
            b = f.createElement("div"),
            d = "display";
        d += ":";
        a.style.cssText = (d + m.join("box;" + d)).slice(0, -d.length) + "width:42px;padding:0;";
        b.style.cssText = m.join("box-flex:1;") + "width:10px;";
        a.appendChild(b);
        A.appendChild(a);
        d = 42 === b.offsetWidth;
        a.removeChild(b);
        A.removeChild(a);
        return d
    };
    i.canvas = function() {
        var a = f.createElement("canvas");
        return !!a.getContext && !!a.getContext("2d")
    };
    i.canvastext = function() {
        return !!k.canvas && !!y(f.createElement("canvas").getContext("2d").fillText, "function")
    };
    i.webgl = function() {
        return !!e.WebGLRenderingContext
    };
    i.touch = function() {
        return k.touch
    };
    i.geolocation = function() {
        return !!navigator.geolocation
    };
    i.postmessage = function() {
        return !!e.postMessage
    };
    i.websqldatabase = function() {
        return !!e.openDatabase
    };
    i.indexedDB = function() {
        for (var a = -1, b = n.length; ++a < b;)
            if (e[n[a].toLowerCase() + "IndexedDB"]) return !0;
        return !!e.indexedDB
    };
    i.hashchange = function() {
        return a("hashchange", e) && (f.documentMode === s || 7 < f.documentMode)
    };
    i.history = function() {
        return !!e.history && !!history.pushState
    };
    i.draganddrop = function() {
        return a("dragstart") &&
            a("drop")
    };
    i.websockets = function() {
        for (var a = -1, b = n.length; ++a < b;)
            if (e[n[a] + "WebSocket"]) return !0;
        return "WebSocket" in e
    };
    i.rgba = function() {
        r.cssText = "background-color:rgba(150,255,150,.5)";
        return !!~("" + r.backgroundColor).indexOf("rgba")
    };
    i.hsla = function() {
        r.cssText = "background-color:hsla(120,40%,100%,.5)";
        return !!~("" + r.backgroundColor).indexOf("rgba") || !!~("" + r.backgroundColor).indexOf("hsla")
    };
    i.multiplebgs = function() {
        r.cssText = "background:url(https://),url(https://),red url(https://)";
        return /(url\s*\(.*?){3}/.test(r.background)
    };
    i.backgroundsize = function() {
        return u("backgroundSize")
    };
    i.borderimage = function() {
        return u("borderImage")
    };
    i.borderradius = function() {
        return u("borderRadius")
    };
    i.boxshadow = function() {
        return u("boxShadow")
    };
    i.textshadow = function() {
        return "" === f.createElement("div").style.textShadow
    };
    i.opacity = function() {
        var a = m.join("opacity:.55;") + "";
        r.cssText = a;
        return /^0.55$/.test(r.opacity)
    };
    i.cssanimations = function() {
        return u("animationName")
    };
    i.csscolumns = function() {
        return u("columnCount")
    };
    i.cssgradients = function() {
        var a =
            ("background-image:" + m.join("gradient(linear,left top,right bottom,from(#9f9),to(white));background-image:") + m.join("linear-gradient(left top,#9f9, white);background-image:")).slice(0, -17);
        r.cssText = a;
        return !!~("" + r.backgroundImage).indexOf("gradient")
    };
    i.cssreflections = function() {
        return u("boxReflect")
    };
    i.csstransforms = function() {
        return !!x(["transformProperty", "WebkitTransform", "MozTransform", "OTransform", "msTransform"])
    };
    i.csstransforms3d = function() {
        var a = !!x(["perspectiveProperty", "WebkitPerspective",
            "MozPerspective", "OPerspective", "msPerspective"
        ]);
        a && "webkitPerspective" in A.style && (a = k.csstransforms3d);
        return a
    };
    i.csstransitions = function() {
        return u("transitionProperty")
    };
    i.fontface = function() {
        return k.fontface
    };
    i.generatedcontent = function() {
        return k.generatedcontent
    };
    i.video = function() {
        var a = f.createElement("video"),
            b = !1;
        try {
            if (b = !!a.canPlayType) b = new Boolean(b), b.ogg = a.canPlayType('video/ogg; codecs="theora"'), b.h264 = a.canPlayType('video/mp4; codecs="avc1.42E01E"') || a.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'),
                b.webm = a.canPlayType('video/webm; codecs="vp8, vorbis"')
        } catch (d) {}
        return b
    };
    i.audio = function() {
        var a = f.createElement("audio"),
            b = !1;
        try {
            if (b = !!a.canPlayType) b = new Boolean(b), b.ogg = a.canPlayType('audio/ogg; codecs="vorbis"'), b.mp3 = a.canPlayType("audio/mpeg;"), b.wav = a.canPlayType('audio/wav; codecs="1"'), b.m4a = a.canPlayType("audio/x-m4a;") || a.canPlayType("audio/aac;")
        } catch (d) {}
        return b
    };
    i.localstorage = function() {
        try {
            return !!localStorage.getItem
        } catch (a) {
            return !1
        }
    };
    i.sessionstorage = function() {
        try {
            return !!sessionStorage.getItem
        } catch (a) {
            return !1
        }
    };
    i.webworkers = function() {
        return !!e.Worker
    };
    i.applicationcache = function() {
        return !!e.applicationCache
    };
    i.svg = function() {
        return !!f.createElementNS && !!f.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect
    };
    i.inlinesvg = function() {
        var a = f.createElement("div");
        a.innerHTML = "<svg/>";
        return "http://www.w3.org/2000/svg" == (a.firstChild && a.firstChild.namespaceURI)
    };
    i.smil = function() {
        return !!f.createElementNS && /SVG/.test(B.call(f.createElementNS("http://www.w3.org/2000/svg", "animate")))
    };
    i.svgclippaths =
        function() {
            return !!f.createElementNS && /SVG/.test(B.call(f.createElementNS("http://www.w3.org/2000/svg", "clipPath")))
        };
    for (var D in i) g(i, D) && (d = D.toLowerCase(), k[d] = i[D](), t.push((k[d] ? "" : "no-") + d));
    k.input || o();
    r.cssText = "";
    i = l = null;
    e.attachEvent && function() {
        var a = f.createElement("div");
        a.innerHTML = "<elem></elem>";
        return 1 !== a.childNodes.length
    }() && function(a, b) {
        function d(a) {
            for (var b = -1; ++b < h;) a.createElement(g[b])
        }
        a.iepp = a.iepp || {};
        var f = a.iepp,
            e = f.html5elements || "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
            g = e.split("|"),
            h = g.length,
            i = RegExp("(^|\\s)(" + e + ")", "gi"),
            k = RegExp("<(/*)(" + e + ")", "gi"),
            l = /^\s*[\{\}]\s*$/,
            o = RegExp("(^|[^\\n]*?\\s)(" + e + ")([^\\n]*)({[\\n\\w\\W]*?})", "gi"),
            n = b.createDocumentFragment(),
            m = b.documentElement,
            e = m.firstChild,
            F = b.createElement("body"),
            G = b.createElement("style"),
            r = /print|all/,
            p;
        f.getCSS = function(a, b) {
            if (a + "" === s) return "";
            for (var d = -1, e = a.length, g, h = []; ++d < e;) g = a[d], g.disabled || (b = g.media || b, r.test(b) && h.push(f.getCSS(g.imports, b), g.cssText), b = "all");
            return h.join("")
        };
        f.parseCSS =
            function(a) {
                for (var b = [], d; null != (d = o.exec(a));) b.push(((l.exec(d[1]) ? "\n" : d[1]) + d[2] + d[3]).replace(i, "$1.iepp_$2") + d[4]);
                return b.join("\n")
            };
        f.writeHTML = function() {
            var a = -1;
            for (p = p || b.body; ++a < h;)
                for (var d = b.getElementsByTagName(g[a]), f = d.length, e = -1; ++e < f;) 0 > d[e].className.indexOf("iepp_") && (d[e].className += " iepp_" + g[a]);
            n.appendChild(p);
            m.appendChild(F);
            F.className = p.className;
            F.id = p.id;
            F.innerHTML = p.innerHTML.replace(k, "<$1font")
        };
        f._beforePrint = function() {
            G.styleSheet.cssText = f.parseCSS(f.getCSS(b.styleSheets,
                "all"));
            f.writeHTML()
        };
        f.restoreHTML = function() {
            F.innerHTML = "";
            m.removeChild(F);
            m.appendChild(p)
        };
        f._afterPrint = function() {
            f.restoreHTML();
            G.styleSheet.cssText = ""
        };
        d(b);
        d(n);
        f.disablePP || (e.insertBefore(G, e.firstChild), G.media = "print", G.className = "iepp-printshim", a.attachEvent("onbeforeprint", f._beforePrint), a.attachEvent("onafterprint", f._afterPrint))
    }(e, f);
    k._version = "2.0.6";
    k._prefixes = m;
    k._domPrefixes = n;
    k.hasEvent = a;
    k.testProp = function(a) {
        return x([a])
    };
    k.testAllProps = u;
    k.testStyles = b;
    A.className =
        A.className.replace(/\bno-js\b/, "") + (" js " + t.join(" "));
    return k
}(this, this.document);
(function(e, f, s) {
    function o() {
        for (var a = 1, b = -1; m.length - ++b && (!m[b].s || (a = m[b].r)););
        a && y()
    }

    function u(a) {
        var b = f.createElement("script"),
            d;
        b.src = a.s;
        b.onreadystatechange = b.onload = function() {
            !d && (!b.readyState || "loaded" == b.readyState || "complete" == b.readyState) && (d = 1, o(), b.onload = b.onreadystatechange = null)
        };
        l(function() {
            d || (d = 1, o())
        }, E.errorTimeout);
        a.e ? b.onload() : p.parentNode.insertBefore(b, p)
    }

    function x(b) {
        var d = f.createElement("link"),
            e;
        d.href = b.s;
        d.rel = "stylesheet";
        d.type = "text/css";
        if (!b.e && (a ||
                z)) {
            var g = function(a) {
                l(function() {
                    if (!e) try {
                        a.sheet.cssRules.length ? (e = 1, o()) : g(a)
                    } catch (b) {
                        1E3 == b.code || "security" == b.message || "denied" == b.message ? (e = 1, l(function() {
                            o()
                        }, 0)) : g(a)
                    }
                }, 0)
            };
            g(d)
        } else d.onload = function() {
            e || (e = 1, l(function() {
                o()
            }, 0))
        }, b.e && d.onload();
        l(function() {
            e || (e = 1, o())
        }, E.errorTimeout);
        !b.e && p.parentNode.insertBefore(d, p)
    }

    function y() {
        var a = m.shift();
        n = 1;
        a ? a.t ? l(function() {
            "c" == a.t ? x(a) : u(a)
        }, 0) : (a(), o()) : n = 0
    }

    function k(a, b, d, e, g, h) {
        function i() {
            !k && (!j.readyState || "loaded" == j.readyState ||
                "complete" == j.readyState) && (q.r = k = 1, !n && o(), j.onload = j.onreadystatechange = null, l(function() {
                t.removeChild(j)
            }, 0))
        }
        var j = f.createElement(a),
            k = 0,
            q = {
                t: d,
                s: b,
                e: h
            };
        j.src = j.data = b;
        !v && (j.style.display = "none");
        j.width = j.height = "0";
        "object" != a && (j.type = d);
        j.onload = j.onreadystatechange = i;
        "img" == a ? j.onerror = i : "script" == a && (j.onerror = function() {
            q.e = q.r = 1;
            y()
        });
        m.splice(e, 0, q);
        t.insertBefore(j, v ? null : p);
        l(function() {
            k || (t.removeChild(j), q.r = q.e = k = 1, o())
        }, E.errorTimeout)
    }

    function A(a, b, d) {
        var e = "c" == b ? g : h;
        n = 0;
        b = b || "j";
        j(a) ? k(e, a, b, this.i++, r, d) : (m.splice(this.i++, 0, a), 1 == m.length && y());
        return this
    }

    function i() {
        var a = E;
        a.loader = {
            load: A,
            i: 0
        };
        return a
    }
    var r = f.documentElement,
        l = e.setTimeout,
        p = f.getElementsByTagName("script")[0],
        B = {}.toString,
        m = [],
        n = 0,
        z = "MozAppearance" in r.style,
        v = z && !!f.createRange().compareNode,
        t = v ? r : p.parentNode,
        b = e.opera && "[object Opera]" == B.call(e.opera),
        a = "webkitAppearance" in r.style,
        d = a && "async" in f.createElement("script"),
        h = z ? "object" : b || d ? "img" : "script",
        g = a ? "img" : h,
        D = Array.isArray ||
        function(a) {
            return "[object Array]" == B.call(a)
        },
        j = function(a) {
            return "string" == typeof a
        },
        w = function(a) {
            return "[object Function]" == B.call(a)
        },
        q = [],
        C = {},
        H, E;
    E = function(a) {
        function b(a) {
            var a = a.split("!"),
                d = q.length,
                e = a.pop(),
                f = a.length,
                e = {
                    url: e,
                    origUrl: e,
                    prefixes: a
                },
                g, h;
            for (h = 0; h < f; h++) g = C[a[h]], g && (e = g(e));
            for (h = 0; h < d; h++) e = q[h](e);
            return e
        }

        function d(a, e, f, g, h) {
            var j = b(a),
                k = j.autoCallback;
            if (!j.bypass) {
                e && (e = w(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]);
                if (j.instead) return j.instead(a, e, f,
                    g, h);
                f.load(j.url, j.forceCSS || !j.forceJS && /css$/.test(j.url) ? "c" : s, j.noexec);
                (w(e) || w(k)) && f.load(function() {
                    i();
                    e && e(j.origUrl, h, g);
                    k && k(j.origUrl, h, g)
                })
            }
        }

        function e(a, b) {
            function g(a) {
                if (j(a)) d(a, i, b, 0, f);
                else if (Object(a) === a)
                    for (k in a) a.hasOwnProperty(k) && d(a[k], i, b, k, f)
            }
            var f = !!a.test,
                h = a.load || a.both,
                i = a.callback,
                k;
            g(f ? a.yep : a.nope);
            g(h);
            a.complete && b.load(a.complete)
        }
        var f, g, h = this.yepnope.loader;
        if (j(a)) d(a, 0, h, 0);
        else if (D(a))
            for (f = 0; f < a.length; f++) g = a[f], j(g) ? d(g, 0, h, 0) : D(g) ? E(g) : Object(g) ===
                g && e(g, h);
        else Object(a) === a && e(a, h)
    };
    E.addPrefix = function(a, b) {
        C[a] = b
    };
    E.addFilter = function(a) {
        q.push(a)
    };
    E.errorTimeout = 1E4;
    null == f.readyState && f.addEventListener && (f.readyState = "loading", f.addEventListener("DOMContentLoaded", H = function() {
        f.removeEventListener("DOMContentLoaded", H, 0);
        f.readyState = "complete"
    }, 0));
    e.yepnope = i()
})(this, this.document);
Modernizr.load = function() {
    yepnope.apply(window, [].slice.call(arguments, 0))
};
(function() {
    function e() {
        document.removeEventListener("DOMContentLoaded", e, !1);
        var f = document.createElement("div"),
            h = g.touchIcon ? document.querySelectorAll("head link[rel=apple-touch-icon],head link[rel=apple-touch-icon-precomposed]") : [],
            i, l = "";
        f.id = "addToHomeScreen";
        f.style.cssText += "position:absolute;-webkit-transition-property:-webkit-transform,opacity;-webkit-transition-duration:0;-webkit-transform:translate3d(0,0,0);";
        f.style.left = "-9999px";
        if (g.message in D) m = g.message, g.message = "";
        if ("" == g.message) g.message =
            m in D ? D[m] : D.en_us;
        if (h.length) {
            for (a = 0, d = h.length; a < d; a++)
                if (i = h[a].getAttribute("sizes")) {
                    if (A && "114x114" == i) {
                        l = h[a].href;
                        break
                    }
                } else l = h[a].href;
            l = '<span style="background-image:url(' + l + ')" class="touchIcon"></span>'
        }
        f.className = (k ? "ipad" : "iphone") + (l ? " wide" : "");
        f.innerHTML = l + g.message.replace("%device", B).replace("%icon", 4.2 <= p ? '<span class="share"></span>' : '<span class="plus">+</span>') + (g.arrow ? '<span class="arrow"></span>' : "") + '<span class="close">\u00d7</span>';
        f.innerHTML = '<span class="closeZone">' +
            f.innerHTML + "</span>";
        document.body.appendChild(f);
        b = f;
        (f = b.querySelector(".closeZone")) && f.addEventListener("touchend", u, !1);
        try {
            g.expire && localStorage.setItem("_addToHome", (new Date).getTime() + 6E4 * g.expire)
        } catch (n) {}
    }

    function f() {
        window.removeEventListener("load", f, !1);
        setTimeout(function() {
            var a;
            n = k ? window.scrollY : window.innerHeight + window.scrollY;
            startX = k ? window.scrollX : Math.round((window.innerWidth - b.offsetWidth) / 2) + window.scrollX;
            b.style.top = k ? n + g.bottomOffset + "px" : n - b.offsetHeight - g.bottomOffset +
                "px";
            b.style.left = k ? startX + (5 <= p ? 160 : 208) - Math.round(b.offsetWidth / 2) + "px" : startX + "px";
            switch (g.animationIn) {
                case "drop":
                    k ? (a = "0.6s", b.style.webkitTransform = "translate3d(0," + -(window.scrollY + g.bottomOffset + b.offsetHeight) + "px,0)") : (a = "0.9s", b.style.webkitTransform = "translate3d(0," + -(n + g.bottomOffset) + "px,0)");
                    break;
                case "bubble":
                    k ? (a = "0.6s", b.style.opacity = "0", b.style.webkitTransform = "translate3d(0," + (n + 50) + "px,0)") : (a = "0.6s", b.style.webkitTransform = "translate3d(0," + (b.offsetHeight + g.bottomOffset +
                        50) + "px,0)");
                    break;
                default:
                    a = "1s", b.style.opacity = "0"
            }
            setTimeout(function() {
                b.style.webkitTransitionDuration = a;
                b.style.opacity = "1";
                b.style.webkitTransform = "translate3d(0,0,0)";
                b.addEventListener("webkitTransitionEnd", s, !1)
            }, 0);
            t = setTimeout(u, g.lifespan);
            h = !0
        }, g.startDelay)
    }

    function s() {
        b.removeEventListener("webkitTransitionEnd", s, !1);
        b.style.webkitTransitionProperty = "-webkit-transform";
        b.style.webkitTransitionDuration = "0.2s";
        t ? (clearInterval(v), v = setInterval(o, g.iterations)) : b.parentNode.removeChild(b)
    }

    function o() {
        var a = new WebKitCSSMatrix(window.getComputedStyle(b, null).webkitTransform),
            d = k ? window.scrollY - n : window.scrollY + window.innerHeight - n,
            e = k ? window.scrollX - startX : window.scrollX + Math.round((window.innerWidth - b.offsetWidth) / 2) - startX;
        d == a.m42 && e == a.m41 || (clearInterval(v), b.removeEventListener("webkitTransitionEnd", s, !1), setTimeout(function() {
            b.addEventListener("webkitTransitionEnd", s, !1);
            b.style.webkitTransform = "translate3d(" + e + "px," + d + "px,0)"
        }, 0))
    }

    function u() {
        clearInterval(v);
        clearTimeout(t);
        t = null;
        b.removeEventListener("webkitTransitionEnd", s, !1);
        var a = k ? window.scrollY - n : window.scrollY + window.innerHeight - n,
            d = k ? window.scrollX - startX : window.scrollX + Math.round((window.innerWidth - b.offsetWidth) / 2) - startX,
            e = "1",
            f = "0";
        (f = b.querySelector(".closeZone")) && f.removeEventListener("touchend", u, !1);
        b.style.webkitTransitionProperty = "-webkit-transform,opacity";
        switch (g.animationOut) {
            case "drop":
                k ? (f = "0.4s", e = "0", a += 50) : (f = "0.6s", a = a + b.offsetHeight + g.bottomOffset + 50);
                break;
            case "bubble":
                k ? (f = "0.8s",
                    a = a - b.offsetHeight - g.bottomOffset - 50) : (f = "0.4s", e = "0", a -= 50);
                break;
            default:
                f = "0.8s", e = "0"
        }
        b.addEventListener("webkitTransitionEnd", s, !1);
        b.style.opacity = e;
        b.style.webkitTransitionDuration = f;
        b.style.webkitTransform = "translate3d(" + d + "px," + a + "px,0)"
    }
    var x = navigator,
        y = /iphone|ipod|ipad/gi.test(x.platform);
    if (y) {
        var k = /ipad/gi.test(x.platform),
            A = "devicePixelRatio" in window && 1 < window.devicePixelRatio,
            i = x.appVersion.match(/Safari/gi),
            r = "standalone" in x && y,
            l = r && x.standalone,
            p = x.appVersion.match(/OS \d+_\d+/g),
            B = x.platform.split(" ")[0],
            m = x.language.replace("-", "_"),
            n = startX = 0,
            z = localStorage.getItem("_addToHome"),
            v, t, b, a, d, h, g = {
                animationIn: "drop",
                animationOut: "fade",
                startDelay: 2E3,
                lifespan: 1E4,
                bottomOffset: 14,
                expire: 60,
                message: "",
                touchIcon: !0,
                arrow: !0,
                iterations: 100
            },
            D = {
                ca_es: "Per instal\u0412\u00b7lar aquesta aplicaci\u0413\u0456 al vostre %device premeu %icon i llavors <strong>Afegir a pantalla d'inici</strong>.",
                da_dk: "Tilf\u0413\u0451j denne side til din %device: tryk p\u0413\u0490 %icon og derefter <strong>Tilf\u0413\u0451j til hjemmesk\u0413\u00a6rm</strong>.",
                de_de: "Installieren Sie diese App auf Ihrem %device: %icon antippen und dann <strong>Zum Home-Bildschirm</strong>.",
                el_gr: "\u041e\u2022\u041e\u0456\u041e\u0454\u041e\u00b1\u041f\u201e\u041e\u00b1\u041f\u0453\u041f\u201e\u041e\u00ae\u041f\u0453\u041e\u00b5\u041f\u201e\u041e\u00b5 \u041e\u00b1\u041f\u2026\u041f\u201e\u041e\u00ae\u041e\u0405 \u041f\u201e\u041e\u00b7\u041e\u0405 \u041e\u2022\u041f\u2020\u041e\u00b1\u041f\u0403\u041e\ufffd?\u041e\u0457\u041e\u0456\u041e\u00ae \u041f\u0453\u041f\u201e\u041e\u00ae\u041e\u0405 \u041f\u0453\u041f\u2026\u041f\u0453\u041e\u0454\u041e\u00b5\u041f\u2026\u041e\u00ae \u041f\u0453\u041e\u00b1\u041f\u201a %device: %icon \u041e\ufffd?\u041e\u00b5\u041f\u201e\u041e\u00ac \u041f\u0402\u041e\u00b1\u041f\u201e\u041e\u00ac\u041f\u201e\u041e\u00b5 <strong>\u041e\u00a0\u041f\u0403\u041e\u0457\u041f\u0453\u041e\u0451\u041e\u00ae\u041e\u0454\u041e\u00b7 \u041f\u0453\u041e\u00b5 \u041e\ufffd?\u041f\u2020\u041e\u00b5\u041f\u201e\u041e\u00b7\u041f\u0403\u041e\u0407\u041e\u00b1</strong>.",
                en_us: "Install this web app on your %device: tap %icon and then <strong>Add to Home Screen</strong>.",
                es_es: "Para instalar esta app en su %device, pulse %icon y seleccione <strong>A\u0413\u00b1adir a pantalla de inicio</strong>.",
                fi_fi: "Asenna t\u0413\u00a4m\u0413\u00a4 web-sovellus laitteeseesi %device: paina %icon ja sen j\u0413\u00a4lkeen valitse <strong>Lis\u0413\u00a4\u0413\u00a4 Koti-valikkoon</strong>.",
                fr_fr: "Ajoutez cette application sur votre %device en cliquant sur %icon, puis <strong>Ajouter \u0413\u00a0 l'\u0413\u00a9cran d'accueil</strong>.",
                he_il: '<span dir="rtl">\u0427\u201d\u0427\u0404\u0427\u00a7\u0427\u045f \u0427\u0452\u0427\u00a4\u0427\u045a\u0427\u2122\u0427\u00a7\u0427\u00a6\u0427\u2122\u0427\u201d \u0427\u2013\u0427\u2022 \u0427\u045e\u0427\u045a \u0427\u201d-%device \u0427\u00a9\u0427\u045a\u0427\u0459: \u0427\u201d\u0427\u00a7\u0427\u00a9 %icon \u0427\u2022\u0427\u0452\u0427\u2013 <strong>\u0427\u201d\u0427\u2022\u0427\u040e\u0427\u0408 \u0427\u045a\u0427\u045b\u0427\u040e\u0427\u0459 \u0427\u201d\u0427\ufffd?\u0427\u2122\u0427\u0404</strong>.</span>',
                hu_hu: "Telep\u0413\u00adtse ezt a web-alkalmaz\u0413\u040est az \u0413\u2013n %device-j\u0413\u040era: nyomjon a %icon-ra majd a <strong>F\u0415\ufffd?k\u0413\u00a9perny\u0415\ufffd?h\u0413\u00b6z ad\u0413\u040es</strong> gombra.",
                it_it: "Installa questa applicazione sul tuo %device: premi su %icon e poi <strong>Aggiungi a Home</strong>.",
                ja_jp: "\u0433\u0403\u201c\u0433\u0403\u00ae\u0433\u201a\u00a6\u0433\u201a\u00a7\u0433\u0453\u2013\u0433\u201a\u045e\u0433\u0453\u2014\u0433\u0453\u0404\u0433\u201a\u2019\u0433\u0403\u201a\u0433\u0403\u0404\u0433\u0403\u045f\u0433\u0403\u00ae%device\u0433\u0403\u00ab\u0433\u201a\u00a4\u0433\u0453\u0456\u0433\u201a\u2116\u0433\u0453\u20ac\u0433\u0453\ufffd?\u0433\u0453\u00ab\u0433\u0403\u2122\u0433\u201a\u2039\u0433\u0403\u00ab\u0433\u0403\u0407%icon\u0433\u201a\u2019\u0433\u201a\u0457\u0433\u0453\u0453\u0433\u0453\u2014\u0433\u0403\u2014\u0433\u0403\u00a6<strong>\u0433\u0453\u203a\u0433\u0453\ufffd?\u0433\u0453\u00a0\u0437\u201d\u00bb\u0439\u045c\u045e\u0433\u0403\u00ab\u0438\u0457\u0405\u0435\u0409\u00a0</strong>\u0433\u201a\u2019\u0439\u0403\u0451\u0433\u201a\u201c\u0433\u0403\u00a7\u0433\u0403\u040f\u0433\u0403\u00a0\u0433\u0403\u2022\u0433\u0403\u201e\u0433\u0402\u201a",
                ko_kr: '%device\u043c\u2014\u0452 \u043c\u203a\u2116\u043c\u2022\u00b1\u043c\u045c\u201e \u043c\u201e\u00a4\u043c\u2116\ufffd\u043d\u2022\ufffd\u043b\u00a0\u00a4\u043b\u00a9\u0491 %icon\u043c\u045c\u201e \u043d\u201e\u00b0\u043c\u2116\ufffd \u043d\u203a\u201e "\u043d\u2122\u20ac\u043d\u2122\u201d\u043b\u00a9\u0491\u043c\u2014\u0452 \u043c\u00b6\u201d\u043a\u00b0\u0402"\u043b\u0490\ufffd? \u043c\u201e\u00a0\u043d\u0453\u045c\u043d\u2022\ufffd\u043c\u201e\u0451\u043c\u0459\u201d',
                nb_no: "Installer denne appen p\u0413\u0490 din %device: trykk p\u0413\u0490 %icon og deretter <strong>Legg til p\u0413\u0490 Hjem-skjerm</strong>",
                nl_nl: "Installeer deze webapp op uw %device: tik %icon en dan <strong>Zet in beginscherm</strong>.",
                pt_br: "Instale este web app em seu %device: aperte %icon e selecione <strong>Adicionar \u0413\u00a0 Tela Inicio</strong>.",
                pt_pt: "Para instalar esta aplica\u0413\u00a7\u0413\u0408o no seu %device, prima o %icon e depois o <strong>Adicionar ao ecr\u0413\u0408 principal</strong>.",
                ru_ru: "\u0420\u0408\u0421\u0403\u0421\u201a\u0420\u00b0\u0420\u0405\u0420\u0455\u0420\u0406\u0420\u0451\u0421\u201a\u0420\u00b5 \u0421\u040c\u0421\u201a\u0420\u0455 \u0420\u0406\u0420\u00b5\u0420\u00b1-\u0420\u0457\u0421\u0402\u0420\u0451\u0420\u00bb\u0420\u0455\u0420\u00b6\u0420\u00b5\u0420\u0405\u0420\u0451\u0420\u00b5 \u0420\u0405\u0420\u00b0 \u0420\u0406\u0420\u00b0\u0421\u20ac %device: \u0420\u0405\u0420\u00b0\u0420\u00b6\u0420\ufffd?\u0420\u0451\u0421\u201a\u0420\u00b5 %icon, \u0420\u00b7\u0420\u00b0\u0421\u201a\u0420\u00b5\u0420\ufffd? <strong>\u0420\u201d\u0420\u0455\u0420\u00b1\u0420\u00b0\u0420\u0406\u0420\u0451\u0421\u201a\u0421\u040a \u0420\u0406 \u0412\u00ab\u0420\u201d\u0420\u0455\u0420\ufffd?\u0420\u0455\u0420\u2116\u0412\u00bb</strong>.",
                sv_se: "L\u0413\u00a4gg till denna webbapplikation p\u0413\u0490 din %device: tryck p\u0413\u0490 %icon och d\u0413\u00a4refter <strong>L\u0413\u00a4gg till p\u0413\u0490 hemsk\u0413\u00a4rmen</strong>.",
                th_th: "\u0430\u0451\u2022\u0430\u0451\u0491\u0430\u0451\u201d\u0430\u0451\u2022\u0430\u0451\u00b1\u0430\u2116\u2030\u0430\u0451\u2021\u0430\u2116\u0402\u0430\u0451\u00a7\u0430\u2116\u2021\u0430\u0451\u0459\u0430\u2116\u0403\u0430\u0451\u00ad\u0430\u0451\u045b\u0430\u0451\u0407 \u0430\u0451\u2122\u0430\u0451\u00b5\u0430\u2116\u2030\u0430\u0451\u0459\u0430\u0451\u2122 %device \u0430\u0451\u201a\u0430\u0451\u00ad\u0430\u0451\u2021\u0430\u0451\u201e\u0430\u0451\u0451\u0430\u0451\u201c: \u0430\u2116\u0403\u0430\u0451\u2022\u0430\u0451\u00b0 %icon \u0430\u2116\u0403\u0430\u0451\u0490\u0430\u0451\u00b0 <strong>\u0430\u2116\u0402\u0430\u0451\u045b\u0430\u0451\u0491\u0430\u2116\u20ac\u0430\u0451\u040e\u0430\u0451\u2014\u0430\u0451\u00b5\u0430\u2116\u20ac\u0430\u0451\u00ab\u0430\u0451\u2122\u0430\u2116\u2030\u0430\u0451\u0406\u0430\u0451\u20ac\u0430\u0451\u00ad\u0430\u2116\u201a\u0430\u0451\u00ae\u0430\u0451\u040e</strong>",
                tr_tr: "%device i\u0413\u00a7in bu uygulamay\u0414\u00b1 kurduktan sonra %icon simgesine dokunarak <strong>Ev Ekran\u0414\u00b1na Ekle</strong>yin.",
                zh_cn: "\u0436\u201a\u0401\u0435\u040f\u0407\u0434\u00bb\u0490\u0435\u00b0\u2020\u0436\u00ad\u00a4\u0435\u0454\u201d\u0437\u201d\u0401\u0437\u0401\u2039\u0435\ufffd?\u040f\u0435\u00ae\u2030\u0438\u0408\u2026\u0435\u20ac\u00b0\u0436\u201a\u0401\u0437\u0459\u201e %device \u0434\u0451\u0409\u0433\u0402\u201a\u0438\u0407\u00b7\u0436\u040a\u2030 %icon \u0437\u201e\u00b6\u0435\u0452\u040b\u0437\u201a\u2116\u0439\u0402\u2030<strong>\u0436\u00b7\u00bb\u0435\u0409\u00a0\u0438\u2021\u0456\u0434\u0451\u00bb\u0435\u00b1\u040f\u0435\u2116\u2022</strong>\u0433\u0402\u201a",
                zh_tw: "\u0436\u201a\u0401\u0435\u040f\u0407\u0434\u00bb\u0490\u0435\u00b0\u2021\u0436\u00ad\u00a4\u0436\u2021\u2030\u0437\u201d\u0401\u0437\u0401\u2039\u0435\ufffd?\u040f\u0435\u00ae\u2030\u0438\u0408\u045c\u0435\u20ac\u00b0\u0436\u201a\u0401\u0437\u0459\u201e %device \u0434\u0451\u0409\u0433\u0402\u201a\u0438\u00ab\u2039\u0436\u040a\u2030 %icon \u0437\u201e\u00b6\u0435\u0455\u040a\u0439\u00bb\u045b\u0439\u0403\u0451<strong>\u0435\u0409\u00a0\u0435\u2026\u0490\u0434\u0451\u00bb\u0437\u2022\u00ab\u0439\u045c\u045e\u0438\u045b\u045e\u0435\u2116\u2022</strong>\u0433\u0402\u201a"
            },
            p = p ? 1 * p[0].replace(/[^\d_]/g, "").replace("_", ".") : 0,
            z = "null" == z ? 0 : 1 * z;
        if (window.addToHomeConfig)
            for (a in window.addToHomeConfig) g[a] = window.addToHomeConfig[a];
        if (!g.expire || z < (new Date).getTime()) z = 0;
        window.addToHomeClose = u;
        window.addToHomeOpen = function() {
            r && !z && !l && i && !t && !h && (e(), f())
        }
    } else window.addToHomeClose = function() {}, window.addToHomeOpen = function() {}
})();