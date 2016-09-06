var viewporter;
(function() {
    var a = !1;
    viewporter = {
        ACTIVE: "ontouchstart" in window || /webos/i.test(navigator.userAgent),
        DEVICE_SUPPORTED: !1,
        DEVICE_DENSITY: null,
        META_VIEWPORT_CONTENT: null,
        settings: {
            maxDensity: 163
        },
        isLandscape: function() {
            return !a ? 90 === window.orientation || -90 === window.orientation : 0 === window.orientation || 180 === window.orientation
        },
        ready: function(a) {
            window.addEventListener("viewportready", a, !1)
        }
    };
    if (viewporter.ACTIVE) {
        var b = function() {
            var a = this;
            this.data = {};
            this.IS_ANDROID = /Android/.test(navigator.userAgent);
            document.addEventListener("DOMContentLoaded",
                function() {
                    a.computeViewportInformation();
                    a.setMetaViewport();
                    a.prepareVisualViewport();
                    var b = window.orientation;
                    window.addEventListener("orientationchange", function() {
                        if (window.orientation != b) a.computeViewportInformation(), a.updateMetaViewport(), a.prepareVisualViewport(), b = window.orientation
                    }, !1)
                }, !1)
        };
        b.prototype = {
            computeViewportInformation: function() {
                var b = this.getProfile();
                if (!b) return this.triggerWindowEvent("viewportunknown");
                a = b ? b.inverseLandscape : !1;
                var d = viewporter.isLandscape(),
                    e = 0,
                    f = 1,
                    g = !a ? screen.height : screen.width,
                    i = !a ? screen.width : screen.height,
                    j = this.IS_ANDROID ? 1 : 1 / window.devicePixelRatio,
                    e = 0,
                    m = !1,
                    q = g,
                    l = i,
                    k = function(a) {
                        return "function" == typeof a ? a(q, l, f) : a
                    };
                if (e = "function" == typeof b.ppi ? b.ppi() : b.ppi) viewporter.DEVICE_DENSITY = e, viewporter.settings.maxDensity && e > viewporter.settings.maxDensity && (f *= viewporter.settings.maxDensity / e, j = this.IS_ANDROID ? 1 : j / f);
                g = k(b.width) || g;
                i = k(b.height) || i;
                b.chromePrescale ? (e = k(b.chromePrescale), m = !0) : e = k(b.chrome) || 0;
                if (b = b[d ? "landscape" : "portrait"]) g =
                    k(b.width) || g, i = k(b.height) || i, e = k(b.chrome) || e || 0;
                this.data = {
                    width: (d ? g : i) * f,
                    height: (d ? i : g) * f,
                    scale: j,
                    chromeHeight: e * (m ? 1 : f)
                };
                viewporter.DEVICE_SUPPORTED = !0
            },
            prepareVisualViewport: function() {
                var a = this,
                    b = 0,
                    e = window.setInterval(function() {
                        viewporter.DEVICE_SUPPORTED || a.maximizeDocumentElement();
                        window.scrollTo(0, 1);
                        if (viewporter.DEVICE_SUPPORTED && 5 > Math.abs(window.innerHeight - Math.ceil(a.data.height - a.data.chromeHeight)) || 10 < b) clearInterval(e), a.triggerWindowEvent(!a._firstUpdateExecuted ? "viewportready" :
                            "viewportchange"), a._firstUpdateExecuted = !0;
                        b++
                    }, 10)
            },
            triggerWindowEvent: function(a) {
                var b = document.createEvent("Event");
                b.initEvent(a, !1, !1);
                window.dispatchEvent(b)
            },
            getProfile: function() {
                for (var a in viewporter.profiles)
                    if (RegExp(a).test(navigator.userAgent)) return viewporter.profiles[a];
                return null
            },
            maximizeDocumentElement: function() {
                document.documentElement.style.minHeight = "5000px"
            },
            fixDocumentElement: function(a) {
                document.documentElement.style.minHeight = (a || this.data.height - this.data.chromeHeight) +
                    "px";
                document.documentElement.style.minWidth = this.data.width + "px"
            },
            findMetaNode: function(a) {
                for (var b = document.getElementsByTagName("meta"), e = 0; e < b.length; e++)
                    if (b[e].getAttribute("name") == a) return b[e];
                return null
            },
            setMetaViewport: function() {
                var a = this.findMetaNode("viewport") || document.createElement("meta");
                a.setAttribute("name", "viewport");
                a.id = "metaviewport";
                this.updateMetaViewport(a);
                document.getElementsByTagName("head")[0].appendChild(a)
            },
            updateMetaViewport: function(a) {
                var a = a || document.getElementById("metaviewport"),
                    b = viewporter.DEVICE_SUPPORTED ? ["width=" + this.data.width, "height=" + (this.data.height - this.data.chromeHeight), "initial-scale=" + this.data.scale, "minimum-scale=" + this.data.scale, "maximum-scale=" + this.data.scale] : ["width=device-width", "initial-scale=1", "minimum-scale=1", "maximum-scale=1"];
                this.IS_ANDROID && b.unshift("target-densityDpi=" + (viewporter.DEVICE_DENSITY ? viewporter.settings.maxDensity || "device-dpi" : "device-dpi"));
                viewporter.META_VIEWPORT_CONTENT = b.join(",");
                a.setAttribute("content", viewporter.META_VIEWPORT_CONTENT);
                viewporter.DEVICE_SUPPORTED && this.fixDocumentElement()
            }
        };
        new b
    }
})();
viewporter.profiles = {
    "iPhone|iPod": {
        ppi: function() {
            return 2 <= window.devicePixelRatio ? 326 : 163
        },
        width: function(a) {
            return a * window.devicePixelRatio
        },
        height: function(a, b) {
            return b * window.devicePixelRatio
        },
        chromePrescale: function(a, b, c) {
            return 2 <= window.devicePixelRatio ? (navigator.standalone ? 0 : viewporter.isLandscape() ? 100 : 124) * c + 2 : (navigator.standalone ? 0 : viewporter.isLandscape() ? 50 : 62) * c + 2
        }
    },
    iPad: {
        ppi: 132,
        chrome: function() {
            return navigator.standalone ? 0 : /OS 5_/.test(navigator.userAgent) ? 96 : 78
        }
    },
    "GT-I9000|GT-I9100|Nexus S": {
        ppi: function() {
            if (/GT-I9000/.test(navigator.userAgent) ||
                /GT-I9100/.test(navigator.userAgent)) return 239.3;
            if (/Nexus S/.test(navigator.userAgent)) return 239
        },
        width: 800,
        height: 480,
        chrome: 38
    },
    MZ601: {
        ppi: 160,
        portrait: {
            width: function(a, b) {
                return b
            },
            height: function(a) {
                return a
            }
        },
        chrome: 152,
        inverseLandscape: !0
    },
    "GT-P1000": {
        width: 1024,
        height: 600,
        portrait: {
            chrome: 38
        }
    },
    "Desire_A8181|DesireHD_A9191": {
        width: 800,
        height: 480
    },
    TF101: {
        ppi: 160,
        portrait: {
            width: function(a, b) {
                return b
            },
            height: function(a) {
                return a
            }
        },
        chrome: 103,
        inverseLandscape: !0
    },
    A500: {
        portrait: {
            width: function(a,
                b) {
                return b
            },
            height: function(a) {
                return a
            }
        },
        inverseLandscape: !0
    }
};
Function.prototype.inheritsFrom = function(a) {
    a.constructor == Function ? (this.prototype = new a, this.prototype.constructor = this, this.parent = a.prototype) : (this.prototype = a, this.prototype.constructor = this, this.parent = a);
    return this
};

function popElementFromArray(a, b) {
    for (var c = 0; c < b.length; c++)
        if (b[c] === a) {
            b.splice(c, 1);
            break
        }
}

function popAllElementsFromArray(a) {
    a.splice(0, a.length)
}

function isInArray(a, b) {
    for (var c = 0, d = 0; d < b.length; d++) b[d] === a && c++;
    return c
}

function getCursorPositionXY(a) {
    var b;
    isMobile() ? (b = a.pageX, a = a.pageY) : (b = a.clientX, a = a.clientY);
    return {
        x: b,
        y: a
    }
}

function cssTransform(a, b, c, d, e, f) {
    var g = "";
    null != b && (g += "matrix(" + b + ")");
    if (Device.supports3dTransfrom()) {
        if (null != f && (g += " translate3d(" + f.x + "px, " + f.y + "px, 0px)"), null != c && (g += " rotate3d(0, 0, 1, " + c + "deg)"), d || e) g += " scale3d(" + (d ? d : 1) + ", " + (e ? e : 1) + ", 1)"
    } else null != f && (g += " translateX(" + f.x + "px)", g += " translateY(" + f.y + "px)"), null != c && (g += " rotate(" + c + "deg)"), null != d && (g += " scaleX(" + d + ")"), null != e && (g += " scaleY(" + e + ")");
    a.css("-webkit-transform", g);
    a.css("-moz-transform", g);
    a.css("transform", g);
    a.css("-o-transform", g);
    a.css("transform", g);
    a.css("msTransform", g)
}
var uniqueId = function() {
    var a = 0;
    return function() {
        return a++
    }
}();
if ("undefined" == typeof console) var console = {
    log: function() {}
};

function eLog(a, b, c) {
    eLog.displayF && !(c && c > eLog.currentLevel) && (b ? eLog.displayF(b + " :  " + a) : eLog.displayF(a))
}
eLog.displayF = function(a) {
    try {
        console.log(a)
    } catch (b) {}
};
eLog.currentLevel = 1;

function preventDefaultEventFunction(a) {
    a.preventDefault();
    return !1
}

function makeUnselectable(a) {
    a.addClass("unselectable");
    a.bind("touchstart", function(a) {
        a.preventDefault();
        return !1
    });
    a.bind("touchmove", function(a) {
        a.preventDefault();
        return !1
    });
    a.bind("touchend", function(a) {
        a.preventDefault();
        return !1
    })
}
calcPercentage = function(a, b) {
    "string" == typeof a && -1 < a.indexOf("%") && (a = parseFloat(a.replace("%", "")) * b / 100);
    return a
};

function makeClickTransparent(a) {
    a.css("pointer-events", "none")
}
var assets = [];

function loadMedia(a, b, c, d) {
    for (var e = 0, f = a.length, g, i, j = f, m = 0; e < f; ++e) {
        g = a[e];
        i = g.substr(g.lastIndexOf(".") + 1).toLowerCase();
        if ("mp3" === i || "wav" === i || "ogg" === i || "mp4" === i) i = new Audio(g), -1 != navigator.userAgent.indexOf("Chrome") && m++;
        else if ("jpg" === i || "jpeg" === i || "gif" === i || "png" === i) i = new Image, i.src = g;
        else {
            j--;
            continue
        }
        assets[g] = i;
        i.onload = function() {
            ++m;
            c && c.call(this, {
                loaded: m,
                total: j,
                percent: 100 * (m / j)
            });
            m === j && b && b()
        };
        i.onerror = function() {
            d ? d.call(this, {
                    loaded: m,
                    total: j,
                    percent: 100 * (m / j)
                }) :
                (m++, m === j && b && b())
        }
    }
}

function distance(a, b) {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
}

function selectValue() {
    for (var a, b = 0; b < arguments.length - 1; b++)
        if (a = arguments[b], null != a) return a;
    return a = arguments[arguments.length - 1]
}

function AssertException(a) {
    this.message = a
}
AssertException.prototype.toString = function() {
    return "AssertException: " + this.message
};

function assert(a, b) {
    if (!a) throw new AssertException(b);
}
var MAX_WIDTH = 1280,
    MAX_HEIGHT = 800,
    BASE_WIDTH = 800,
    BASE_HEIGHT = 500,
    ENHANCED_BASE_WIDTH = 1138,
    ENHANCED_BASE_HEIGHT = 640,
    ENHANCED_BASE_MARGIN_WIDTH = 169,
    ENHANCED_BASE_MARGIN_HEIGHT = 70,
    Screen = function() {
        function a() {
            setTimeout(function() {
                window.scrollTo(0, 1)
            }, 10);
            setTimeout(function() {
                window.scrollTo(0, 1)
            }, 500)
        }

        function b(b, c, z) {
            Screen.isCorrectOrientation() ? (clearTimeout(u), u = setTimeout(function() {
                if (Screen.isCorrectOrientation()) {
                    var a;
                    a = selectValue(c, window.innerWidth);
                    var b = selectValue(z, window.innerHeight);
                    j = a;
                    m = b;
                    e = Math.min(MAX_WIDTH, a);
                    f = Math.min(MAX_HEIGHT, b);
                    var v = BASE_WIDTH / BASE_HEIGHT;
                    e / v >= f ? e = Math.ceil(f * v) : f = Math.ceil(e / v);
                    g == f && i == e && q == j && l == m ? a = !1 : (t = Math.round((a - e) / 2), n = Math.round((b - f) / 2), q = j, l = m, g = f, i = e, o = e / BASE_WIDTH, p = f / BASE_HEIGHT, a = $("#root"), 0 < a.length && (a.css("left", t), a.css("top", n)), r.left = -Screen.offsetX(), r.top = -Screen.offsetY(), r.right = -Screen.offsetX() + Screen.fullWidth(), r.bottom = -Screen.offsetY() + Screen.fullHeight(), r.width = r.right - r.left, r.height = r.bottom - r.top, r.offsetX =
                        0, r.offsetY = 0, a = !0);
                    a && d.resize()
                }
            }, 100), a(), $("#rotateMsg").css("z-index", 0), $("#rotateMsg").css("display", "none")) : (v(c, z), Loader.loadingMessageShowed() || ($("#rotateMsg").css("display", "block"), $("#rotateMsg").css("z-index", 99999999)))
        }
        var c = {},
            d = null,
            e = BASE_WIDTH,
            f = BASE_HEIGHT,
            g, i, j, m, q, l, k, o = 1,
            p = 1,
            t = 0,
            n = 0,
            s = !0,
            r = {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            },
            u = null,
            v = function(a) {
                var b = $("#rotateMsg");
                "number" != typeof k && (k = b.height() / b.width());
                var a = selectValue(a, window.innerWidth),
                    a = Math.min(MAX_WIDTH, a),
                    c = a * k;
                b.width(a);
                b.height(c)
            };
        return {
            init: function(e, f, i) {
                d = e;
                i = selectValue(i, {});
                !1 === f && (e = BASE_HEIGHT, BASE_HEIGHT = BASE_WIDTH, BASE_WIDTH = e, e = ENHANCED_BASE_HEIGHT, ENHANCED_BASE_HEIGHT = ENHANCED_BASE_WIDTH, ENHANCED_BASE_WIDTH = e, e = ENHANCED_BASE_MARGIN_HEIGHT, ENHANCED_BASE_MARGIN_HEIGHT = ENHANCED_BASE_MARGIN_WIDTH, ENHANCED_BASE_MARGIN_WIDTH = e, MAX_WIDTH = MAX_HEIGHT = e = MAX_WIDTH);
                BASE_WIDTH = selectValue(i.BASE_WIDTH, BASE_WIDTH);
                BASE_HEIGHT = selectValue(i.BASE_HEIGHT, BASE_HEIGHT);
                MAX_WIDTH = selectValue(i.MAX_WIDTH,
                    MAX_WIDTH);
                MAX_HEIGHT = selectValue(i.MAX_HEIGHT, MAX_HEIGHT);
                ENHANCED_BASE_WIDTH = selectValue(i.ENHANCED_BASE_WIDTH, ENHANCED_BASE_WIDTH);
                ENHANCED_BASE_HEIGHT = selectValue(i.ENHANCED_BASE_HEIGHT, ENHANCED_BASE_HEIGHT);
                ENHANCED_BASE_MARGIN_WIDTH = selectValue(i.ENHANCED_BASE_MARGIN_WIDTH, ENHANCED_BASE_MARGIN_WIDTH);
                ENHANCED_BASE_MARGIN_HEIGHT = selectValue(i.ENHANCED_BASE_MARGIN_HEIGHT, ENHANCED_BASE_MARGIN_HEIGHT);
                c = {
                    BASE_WIDTH: BASE_WIDTH,
                    BASE_HEIGHT: BASE_HEIGHT,
                    ENHANCED_BASE_WIDTH: ENHANCED_BASE_WIDTH,
                    ENHANCED_BASE_HEIGHT: ENHANCED_BASE_HEIGHT,
                    ENHANCED_BASE_MARGIN_WIDTH: ENHANCED_BASE_MARGIN_WIDTH,
                    ENHANCED_BASE_MARGIN_HEIGHT: ENHANCED_BASE_MARGIN_HEIGHT,
                    "-ENHANCED_BASE_MARGIN_WIDTH": -ENHANCED_BASE_MARGIN_WIDTH,
                    "-ENHANCED_BASE_MARGIN_HEIGHT": -ENHANCED_BASE_MARGIN_HEIGHT
                };
                "onorientationchange" in window && !i.disableOrientation ? !1 == f ? (s = !1, $("head").append('<link rel="stylesheet" href="css/orientationPortrait.css" type="text/css" />')) : (s = !0, $("head").append('<link rel="stylesheet" href="css/orientationLandscape.css" type="text/css" />')) : (s =
                    null, $("#rotateMsg").remove());
                disableTouchEvents();
                $(window).resize(b);
                $(window).bind("scrollstart", function() {
                    a()
                });
                $(window).bind("scrollstop", function() {
                    a()
                });
                $(window).trigger("orientationchange");
                (Device.is("iphone") || Device.is("ipod")) && setInterval(a, 5E3);
                $(window).bind("viewportready viewportchange", function() {
                    $(window).trigger("resize")
                })
            },
            windowOnResize: function(a, c) {
                b(null, a, c)
            },
            setLandscapeDefault: function(a) {
                s = a
            },
            isCorrectOrientation: function() {
                var a = 1.1 > window.innerWidth / window.innerHeight;
                return null == s || s === !a
            },
            isLandscape: function() {
                return viewporter.isLandscape()
            },
            widthRatio: function() {
                return o
            },
            heightRatio: function() {
                return p
            },
            fieldWidth: function() {
                return i
            },
            fieldHeight: function() {
                return g
            },
            offsetX: function() {
                return t / o
            },
            offsetY: function() {
                return n / p
            },
            fullWidth: function() {
                return q / o
            },
            fullHeight: function() {
                return l / p
            },
            fullRect: function() {
                return r
            },
            baseWidth: function() {
                return BASE_WIDTH
            },
            baseHeight: function() {
                return BASE_HEIGHT
            },
            macro: function(a) {
                if ("string" == typeof a) {
                    var b = c[a];
                    return b ? b : a
                }
                return a
            },
            calcRealSize: function(a, b) {
                "number" == typeof a ? a = Math.round(Screen.widthRatio() * a) : "FULL_WIDTH" == a && (a = q);
                "number" == typeof b ? b = Math.round(Screen.heightRatio() * b) : "FULL_HEIGHT" == b && (b = l);
                return {
                    x: a,
                    y: b
                }
            },
            calcLogicSize: function(a, b) {
                return {
                    x: a / Screen.widthRatio(),
                    y: b / Screen.heightRatio()
                }
            }
        }
    }(),
    touchStartX = 0,
    touchStartY = 0,
    touchEndX = 0,
    touchEndY = 0,
    mobileBrowser = null;

function isMobile() {
    if (null != mobileBrowser) return mobileBrowser;
    var a = navigator.userAgent.toLowerCase();
    /(webkit)[ \/]([\w.]+)/.exec(a) || /(o)pera(?:.*version)?[ \/]([\w.]+)/.exec(a) || /(ms)ie ([\w.]+)/.exec(a) || /(moz)illa(?:.*? rv:([\w.]+))?/.exec(a);
    return mobileBrowser = /iPad|iPod|iPhone|Android|webOS/i.exec(a)
}
var disableTouchEvents = function() {
        if (isMobile()) document.body.ontouchmove = function(a) {
            a.preventDefault()
        }, document.body.ontouchstart = function(a) {
            a.preventDefault()
        }, document.body.ontouchend = function(a) {
            a.preventDefault()
        }
    },
    enableTouchEvents = function() {
        if (isMobile()) document.body.ontouchstart = function(a) {
            a.preventDefault();
            touchStartX = touchEndX = a.touches[0].pageX;
            touchStartY = touchEndY = a.touches[0].pageY;
            return !1
        }, document.body.ontouchmove = function(a) {
            a.preventDefault();
            touchEndX = a.touches[0].pageX;
            touchEndY = a.touches[0].pageY;
            return !1
        }, document.body.ontouchend = function(a) {
            a.preventDefault();
            return !1
        }
    };

function Transform() {
    this.m = [1, 0, 0, 1, 0, 0]
}
Transform.prototype.reset = function() {
    this.m = [1, 0, 0, 1, 0, 0]
};
Transform.prototype.multiply = function(a) {
    var b = this.m[1] * a.m[0] + this.m[3] * a.m[1],
        c = this.m[0] * a.m[2] + this.m[2] * a.m[3],
        d = this.m[1] * a.m[2] + this.m[3] * a.m[3],
        e = this.m[0] * a.m[4] + this.m[2] * a.m[5] + this.m[4],
        f = this.m[1] * a.m[4] + this.m[3] * a.m[5] + this.m[5];
    this.m[0] = this.m[0] * a.m[0] + this.m[2] * a.m[1];
    this.m[1] = b;
    this.m[2] = c;
    this.m[3] = d;
    this.m[4] = e;
    this.m[5] = f
};
Transform.prototype.invert = function() {
    var a = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]),
        b = -this.m[1] * a,
        c = -this.m[2] * a,
        d = this.m[0] * a,
        e = a * (this.m[2] * this.m[5] - this.m[3] * this.m[4]),
        f = a * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
    this.m[0] = this.m[3] * a;
    this.m[1] = b;
    this.m[2] = c;
    this.m[3] = d;
    this.m[4] = e;
    this.m[5] = f
};
Transform.prototype.rotate = function(a) {
    var b = Math.cos(a),
        a = Math.sin(a),
        c = this.m[1] * b + this.m[3] * a,
        d = this.m[0] * -a + this.m[2] * b,
        e = this.m[1] * -a + this.m[3] * b;
    this.m[0] = this.m[0] * b + this.m[2] * a;
    this.m[1] = c;
    this.m[2] = d;
    this.m[3] = e
};
Transform.prototype.rotateDegrees = function(a) {
    var b = a * Math.PI / 180,
        a = Math.cos(b),
        b = Math.sin(b),
        c = this.m[1] * a + this.m[3] * b,
        d = this.m[0] * -b + this.m[2] * a,
        e = this.m[1] * -b + this.m[3] * a;
    this.m[0] = this.m[0] * a + this.m[2] * b;
    this.m[1] = c;
    this.m[2] = d;
    this.m[3] = e
};
Transform.prototype.translate = function(a, b) {
    this.m[4] += this.m[0] * a + this.m[2] * b;
    this.m[5] += this.m[1] * a + this.m[3] * b
};
Transform.prototype.scale = function(a, b) {
    this.m[0] *= a;
    this.m[1] *= a;
    this.m[2] *= b;
    this.m[3] *= b
};
Transform.prototype.transformPoint = function(a, b) {
    var c = a,
        d = b,
        a = c * this.m[0] + d * this.m[2] + this.m[4],
        b = c * this.m[1] + d * this.m[3] + this.m[5];
    return [a, b]
};
var USE_NATIVE_RENDER = !0,
    Device = function() {
        function a() {
            if (Device.isTouch()) document.ontouchstart = function(a) {
                a.preventDefault();
                m = l = a.touches[0].pageX;
                q = k = a.touches[0].pageY;
                return !1
            }, document.ontouchmove = function(a) {
                a.preventDefault();
                l = a.touches[0].pageX;
                k = a.touches[0].pageY;
                return !1
            }, document.ontouchend = function(a) {
                a.preventDefault();
                return !1
            }
        }

        function b() {
            if (null == c) try {
                c = "localStorage" in window && null !== window.localStorage;
                var a = window.localStorage;
                a.setItem("test", "test");
                a.getItem("test")
            } catch (b) {
                console.error("Local storage not supported!"),
                    c = !1
            }
            return c
        }
        var c = null,
            d = null,
            e = null,
            f = null,
            g = null,
            i = null,
            j = 9999,
            m, q, l, k, o = USE_NATIVE_RENDER && window.NativeRender ? window.NativeRender : null;
        window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
        return {
            init: function(b) {
                if (!d) {
                    i = navigator.userAgent.toLowerCase();
                    f = /iphone|ipod|ipad/gi.test(navigator.platform);
                    g = -1 < i.indexOf("webkit");
                    var c = i.indexOf("android");
                    if (-1 < c) {
                        var c =
                            c + 7,
                            m = i.indexOf(";", c),
                            c = i.substring(c, m);
                        e = parseFloat(c)
                    }
                    d = !0
                }
                b = selectValue(b, {});
                c = selectValue(b.icon, "images/icon114x114.png");
                b = selectValue(b.iconAlpha, "images/icon114x114alpha.png");
                $("head").append('<link rel="apple-touch-icon"  href="' + c + '" />');
                Device.isAndroid() && $("head").append('<link rel="apple-touch-icon-precomposed" href="' + b + '" />');
                a();
                b = new Date;
                for (c = 2E4; c--;) Math.sqrt(c * Math.random());
                j = 1200 / (new Date - b + 1)
            },
            setStorageItem: function(a, c) {
                b() && window.localStorage.setItem(a, c)
            },
            getStorageItem: function(a,
                c) {
                if (b()) {
                    var d = window.localStorage.getItem(a);
                    return null != d ? d : c
                }
                return c
            },
            removeStorageItem: function(a) {
                b() && window.localStorage.removeItem(a)
            },
            is: function(a) {
                return -1 < i.indexOf(a)
            },
            isAndroid: function() {
                return null != e
            },
            androidVersion: function() {
                return e
            },
            isWebkit: function() {
                return g
            },
            isAppleMobile: function() {
                return f
            },
            isMobile: function() {
                return Device.isTouch()
            },
            supports3dTransfrom: function() {
                return Modernizr.csstransforms3d
            },
            nativeRender: function() {
                return o
            },
            isTouch: function() {
                return "ontouchstart" in
                    document.documentElement
            },
            getPositionFromEvent: function(a) {
                return a.originalEvent && a.originalEvent.touches ? {
                    x: a.originalEvent.touches[0].pageX,
                    y: a.originalEvent.touches[0].pageY
                } : a.touches ? {
                    x: a.touches[0].pageX,
                    y: a.touches[0].pageY
                } : {
                    x: a.pageX,
                    y: a.pageY
                }
            },
            getLogicPositionFromEvent: function(a) {
                a = Device.getPositionFromEvent(a);
                return {
                    x: a.x / Screen.widthRatio() - Screen.offsetX(),
                    y: a.y / Screen.heightRatio() - Screen.offsetY()
                }
            },
            event: function(a) {
                switch (a) {
                    case "click":
                        a = Device.isTouch() ? "touchstart" : "click";
                        break;
                    case "cursorDown":
                        a = Device.isTouch() ? "touchstart" : "mousedown";
                        break;
                    case "cursorUp":
                        a = Device.isTouch() ? "touchend" : "mouseup";
                        break;
                    case "cursorMove":
                        a = Device.isTouch() ? "touchmove" : "mousemove";
                        break;
                    case "cursorOut":
                        a = Device.isTouch() ? "touchstart" : "mouseout";
                        break;
                    case "cursorOver":
                        a = Device.isTouch() ? "touchstart" : "mouseover";
                        break;
                    default:
                        assert(!1, "Unrecognizible event " + a)
                }
                return a
            },
            touchStartX: function() {
                return m
            },
            touchStartY: function() {
                return q
            },
            touchEndX: function() {
                return l
            },
            touchEndY: function() {
                return k
            },
            isSlow: function() {
                return Device.isAndroid() && 2.3 > Device.androidVersion() || 80 > j ? !0 : !1
            },
            addToHomeOpenPopup: function() {
                window.addToHomeOpen()
            }
        }
    }(),
    DragManager = function() {
        function a(a) {
            c && (c.dragMove(a), $.each(d, function(b, d) {
                if (d.isEventIn(a)) {
                    if (!d.dragItemEntered) {
                        if (d.onDragItemEnter) d.onDragItemEnter(c);
                        d.dragItemEntered = !0
                    }
                } else if (d.dragItemEntered) {
                    if (d.onDragItemOut) d.onDragItemOut(c);
                    d.dragItemEntered = !1
                }
            }))
        }

        function b() {
            if (c) {
                var a = null;
                $.each(d, function(b, d) {
                    if (d.dragItemEntered) {
                        if (!a && d.onDragItemDrop) d.onDragItemDrop(c) &&
                            (a = d);
                        else if (d.onDragItemOut) d.onDragItemOut(c);
                        d.dragItemEntered = !1
                    }
                });
                c.dragEnd(a);
                c = null
            }
        }
        var c = null,
            d = [],
            e = !1;
        return {
            addListener: function(a) {
                assert(a instanceof GuiDiv, "Trying to add illegal drag'n'drop listener. Should be GuiDiv");
                a.dragItemEntered = !1;
                d.push(a);
                d.sort(function(a, b) {
                    return (b.dragListenerPriority ? b.dragListenerPriority : 0) - (a.dragListenerPriority ? a.dragListenerPriority : 0)
                })
            },
            removeListener: function(a) {
                popElementFromArray(a, d)
            },
            setItem: function(d, g) {
                e || ($(document).bind(Device.event("cursorUp"),
                    b), $(document).bind(Device.event("cursorMove"), a), e = !0);
                c && c.dragEnd && c.dragEnd();
                c = d;
                a(g)
            },
            getItem: function() {
                return c
            }
        }
    }();

function AbstractFactory() {
    var a = {};
    this.addClass = function(b, c) {
        var d;
        "function" == typeof b ? (d = b.prototype.className, c = b.prototype.createInstance) : d = b;
        assert("string" == typeof d, "Invalid classId: " + d);
        assert("function" == typeof c, "Invalid createInstance function for classId " + d);
        a[d] = c
    };
    this.createObject = function(b, c) {
        var d = a[b];
        assert("function" == typeof d, "classId: " + b + " was not properly registered.");
        var e = null;
        return e = "array" == typeof c ? d.apply(null, c) : d.call(null, c)
    };
    this.createObjectsFromJson = function(a,
        c, d) {
        var e = {},
            f = this;
        $.each(a, function(a, b) {
            var j = b.params;
            assert(j, "Params field not specified in '" + a + "'");
            j.name = a;
            c && c(a, j);
            obj = f.createObject(b["class"], j);
            e[a] = obj;
            d && d(a, obj, j)
        });
        return e
    }
}
var Resources = function() {
        var a = {},
            b = {},
            c = null,
            d = null,
            e = function(a, b) {
                var c = new Image;
                c.src = a;
                c.onload = b;
                return c
            };
        return {
            init: function() {},
            setResolution: function(b) {
                assert(a[b], "Resolution " + b + " not exists!");
                c = b
            },
            setDefaultResolution: function(b) {
                assert(a[b], "Resolution " + b + " not exists!");
                d = b
            },
            addResolution: function(b, c, d) {
                assert(!a[b], "Resolution " + b + " already exists!");
                a[b] = {
                    folder: c,
                    images: {}
                };
                d && (Resources.setResolution(b), Resources.setDefaultResolution(b))
            },
            addImage: function(b, c) {
                var d;
                if ("string" ==
                    typeof c) d = [], d(c);
                else if ("array" == typeof c) d = c;
                else {
                    d = [];
                    for (var e in a) d.push(e)
                }
                for (e = 0; e < d.length; e++) {
                    var m = d[e];
                    assert(a[m], "Resolution " + m + " not exists!");
                    a[m].images[b] = b
                }
            },
            getString: function(a) {
                return b[a] ? b[a] : a
            },
            setLanguage: function(a) {
                $.getJSON("resources/localization/" + a + ".json", function(a) {
                    b = a
                })
            },
            getImage: function(b, g, i) {
                var j = null;
                if (!c) return g && e(b, i), b;
                a[c].images[b] && (j = a[c].folder + a[c].images[b]);
                !j && d && d != c && a[d].images[b] && (j = a[d].folder + a[d].images[b]);
                j || (j = a[c].folder + b);
                g && e(b, i);
                return j
            },
            getUsedImages: function() {
                var b = [],
                    e;
                for (e in a[d].images[e]) a[c].images[e] && b.push(Resources.getImage(e));
                return b
            },
            preloadFonts: function(a) {
                for (var b = 0; b < a.length; ++b) {
                    $("#root").append("<div id='fontsPreload" + b + "' + style='opacity:0.1;font-size:1px'>.</div>");
                    var c = $("#fontsPreload" + b);
                    c.addClass(a[b]);
                    setTimeout(function() {
                        c.remove()
                    }, 1E3)
                }
            },
            loadMedia: function(a, b, c, d) {
                for (var e = 0, q = a.length, l, k, o = q, p = 0; e < q; ++e) {
                    l = a[e];
                    k = l.substr(l.lastIndexOf(".") + 1).toLowerCase();
                    if ("mp3" ===
                        k || "wav" === k || "ogg" === k || "mp4" === k) k = new Audio(l), -1 != navigator.userAgent.indexOf("Chrome") && p++;
                    else if ("jpg" === k || "jpeg" === k || "gif" === k || "png" === k) k = new Image, k.src = Resources.getImage(l);
                    else {
                        o--;
                        continue
                    }
                    k.onload = function() {
                        ++p;
                        c && c.call(this, {
                            loaded: p,
                            total: o,
                            percent: 100 * (p / o)
                        });
                        p === o && b && b()
                    };
                    k.onerror = function() {
                        d ? d.call(this, {
                            loaded: p,
                            total: o,
                            percent: 100 * (p / o)
                        }) : (p++, p === o && b && b())
                    }
                }
            }
        }
    }(),
    Sound = function() {
        function a(a, b) {
            var c = b + v,
                d = new Audio(c);
            d.preload = "auto";
            d.load();
            t[a] = {
                url: c,
                audio: d
            }
        }

        function b(a, b, c, d) {
            var e = t[a],
                i = {
                    id: a,
                    priority: d
                };
            if (!e || !e.audio) return null;
            if (c) e.audio.volume = c;
            e.audio.play();
            try {
                e.audio.currentTime = 0
            } catch (f) {}
            b ? e.audio.addEventListener("ended", function() {
                try {
                    this.currentTime = 0
                } catch (a) {}
                this.play()
            }, !1) : e.audio.addEventListener("ended", function() {
                i.channel && (n[i.channel] = null)
            }, !1);
            return i
        }

        function c(a) {
            (a = t[a]) && a.audio.pause()
        }

        function d(a) {
            Device.isAppleMobile() && (p = i);
            jQuery.getScript(j + "jquery.jplayer.min.js", function() {
                $("body").append("<div id='jPlayerInstanceId' style='position:absolute; left:50%; right:50%; width: 0px; height: 0px;'></div>");
                jPlayerInstance = $("#jPlayerInstanceId");
                jPlayerInstance.jPlayer({
                    ready: function() {
                        $(this).jPlayer("setMedia", {
                            oga: a + ".ogg",
                            m4a: a + ".mp4",
                            mp3: a + ".mp3"
                        })
                    },
                    supplied: "oga, mp3, m4a",
                    solution: "flash, html",
                    swfPath: j,
                    ended: function() {},
                    playing: function() {},
                    timeupdate: function() {}
                })
            })
        }

        function e(a, b, c, d) {
            t[a] = {
                start: c,
                length: d
            }
        }

        function f(a, b, c, d) {
            var b = t[a],
                e = {
                    id: a,
                    priority: d
                };
            if (!b) return null;
            x && (x(), x = null);
            c && jPlayerInstance.jPlayer("volume", c);
            jPlayerInstance.jPlayer("pause", b.start + p);
            jPlayerInstance.jPlayer("play",
                b.start + p);
            x = function() {
                g();
                e.channel && (n[e.channel] = null)
            };
            y = setTimeout(x, 1E3 * b.length);
            return e
        }

        function g(a) {
            clearTimeout(y);
            y = null;
            !0 != a && jPlayerInstance.jPlayer("pause")
        }
        var i = -0.0,
            j = "scripts/",
            m, q, l, k, o, p = 0,
            t = {},
            n = {},
            s = function() {},
            r = function() {},
            u = function() {},
            v = null,
            y = null,
            x = null;
        return {
            TURNED_OFF_BY_DEFAULT: !1,
            LOW_PRIORITY: -100,
            NORMAL_PRIORITY: 0,
            HIGH_PRIORITY: 100,
            init: function(i, y, x) {
                m = y || "string" == typeof i && Device.isMobile();
                q = Device.getStorageItem("soundOn", null);
                null == q ? (q = Sound.TURNED_OFF_BY_DEFAULT ?
                    !1 : !0, Device.setStorageItem("soundOn", q)) : q = "true" == q;
                if (m) j = x ? x : j, d(i), s = e, r = f, u = g;
                else {
                    var n;
                    try {
                        n = new Audio("")
                    } catch (t) {}
                    n && n.canPlayType && (l = "no" != n.canPlayType("audio/ogg") && "" != n.canPlayType("audio/ogg"), o = "no" != n.canPlayType("audio/mp4") && "" != n.canPlayType("audio/mp4"), k = "no" != n.canPlayType("audio/mpeg") && "" != n.canPlayType("audio/mpeg"), l ? (v = ".ogg", p = 0) : o ? (v = ".mp4", p = 0) : k && (v = ".mp3", p = 0.07), v && (s = a, r = b, u = c))
                }
            },
            update: function() {},
            turnOn: function(a) {
                q = a;
                Device.setStorageItem("soundOn", q);
                m ?
                    q ? jPlayerInstance.jPlayer("unmute") : jPlayerInstance.jPlayer("mute") : Sound.stop()
            },
            isOn: function() {
                return "true" == Device.getStorageItem("soundOn", "true")
            },
            supportedExtention: function() {
                return v
            },
            add: function(a, b, c, d, e) {
                (!m || !e) && s.call(this, a, b, c, d)
            },
            play: function() {
                if (q) {
                    var a, b, c, d = null,
                        e = null;
                    1 == arguments.length ? "object" == typeof arguments[0] ? (e = arguments[0], a = e.channel, b = e.id, c = e.loop, d = e.volume, e = e.priority) : (a = null, b = arguments[0], c = null) : 2 == arguments.length ? "boolean" == typeof arguments[1] ? (a = null,
                        b = arguments[0], c = arguments[1]) : (a = arguments[0], b = arguments[1], c = null) : (a = arguments[0], b = arguments[1], c = arguments[2], e = arguments[3]);
                    if (null != a) {
                        var i = n[a];
                        if (i)
                            if (e >= (i.priority || Sound.NORMAL_PRIORITY)) u.call(this, i), n[a] = null;
                            else return null
                    }
                    if ((b = r.call(this, b, c, d, e)) && null != a) n[a] = b, b.channel = a;
                    return b
                }
            },
            stop: function(a) {
                if (null != a)(a = n[a]) && u.call(this, a);
                else
                    for (var b in n)(a = n[b]) && u.call(this, a)
            }
        }
    }(),
    entityFactory = new AbstractFactory;
entityFactory.createEntitiesFromJson = function(a) {
    this.createObjectsFromJson(a, function(a, c) {
        c.id = a
    }, function(a, c, d) {
        assert(Account.instance);
        Account.instance.addEntity(c, a, d)
    })
};

function Entity() {}
Entity.prototype.init = function(a) {
    this.params = a;
    this.id = a.id;
    this.properties = {};
    if (a.parent) {
        var b = a.parent;
        "string" == typeof a.parent && (b = Account.instance.getEntity(a.parent), this.assert(b, " No parent found with id='" + a.parent + "' "));
        b.addChild(this)
    } else console.log(" No parent provided for entity with id='" + this.id + "'");
    this.setEnable(selectValue(a.enabled, !0));
    this.intervals = this.timeouts = null
};
Entity.prototype.assert = function(a, b) {
    assert(a, b + " for entity id='" + this.id + "'")
};
Entity.prototype.log = function(a) {
    console.log("Entity id='" + this.id + "', " + a)
};
Entity.prototype.destroy = function() {
    this.clearTimeouts();
    var a;
    this.parent && this.parent.removeChild(this);
    if (this.children)
        for (var b = 0; b < this.children.length; b++) a = this.children[b], this.removeChild(a), Account.instance.removeEntity(a.id), b--
};
Entity.prototype.addChild = function(a) {
    this.children = this.children ? this.children : [];
    this.assert(a != this, "Can't be parent for itself");
    this.assert(null == a.parent, "Can't assign as child id='" + a.id + "' since there's parent id='" + (a.parent ? a.parent.id : "") + "' ");
    a.parent = this;
    this.log("Entity.addChild " + a.id);
    this.children.push(a)
};
Entity.prototype.removeChild = function(a) {
    assert(this.children, "no children been assigned");
    popElementFromArray(a, this.children)
};
Entity.prototype.initChildren = function(a) {
    a && a.children && Account.instance.readGlobalUpdate(a.children)
};
Entity.prototype.update = null;
Entity.prototype.isEnabled = function() {
    return this.enabled
};
Entity.prototype.setEnable = function(a) {
    this.enabled = a;
    "function" == typeof this.update && (a ? Account.instance.addScheduledEntity(this) : Account.instance.removeScheduledEntity(this))
};
Entity.prototype.setDirty = function() {
    var a = this;
    $.each(arguments, function(b, c) {
        a.dirtyFlags[c] = !0
    })
};
Entity.prototype.clearDirty = function() {
    var a = this;
    $.each(arguments, function(b, c) {
        a.dirtyFlags[c] = null
    })
};
Entity.prototype.isDirty = function(a) {
    return !0 == this.dirtyFlags[a]
};
Entity.prototype.clearAllDirty = function() {
    this.dirtyFlags = {}
};
Entity.prototype.readUpdate = function(a) {
    if (a.parent != (this.parent ? this.parent.id : null)) {
        if (null != this.parent) this.parent.removeChild(this), this.parent = null;
        a.parent && Account.instance.getEntity(a.parent).addChild(this)
    }
};
Entity.prototype.readUpdateProperty = function(a, b) {
    this.properties[b] = a[b];
    return a[b]
};
Entity.prototype.writeUpdateProperty = function(a, b, c) {
    this.properties[b] != c && (a[b] = c, this.properties[b] = c)
};
Entity.prototype.writeUpdate = function(a, b) {
    a[this.id] = b;
    b["class"] = this.params["class"];
    b.parent = this.params.parent;
    this.children && $.each(this.children, function(b, d) {
        d.writeUpdate(a, {})
    })
};
Entity.prototype.setInterval = function(a, b) {
    var c = setInterval(a, b);
    this.intervals = this.intervals ? this.intervals : [];
    this.intervals.push(c);
    return c
};
Entity.prototype.setTimeout = function(a, b) {
    var c = setTimeout(a, b);
    this.timeouts = this.timeouts ? this.timeouts : [];
    this.timeouts.push(c);
    return c
};
Entity.prototype.clearTimeout = function(a) {
    clearTimeout(a)
};
Entity.prototype.clearInterval = function(a) {
    clearInterval(a)
};
Entity.prototype.clearTimeouts = function() {
    for (var a in this.intervals) clearInterval(this.intervals[a]);
    this.intervals = [];
    for (a in this.timeouts) clearTimeout(this.timeouts[a]);
    this.timeouts = []
};
BaseState.prototype = new Entity;
BaseState.prototype.constructor = BaseState;

function BaseState() {
    BaseState.parent.constructor.call(this)
}
BaseState.inheritsFrom(Entity);
BaseState.prototype.init = function(a) {
    BaseState.parent.init.call(this, a);
    this.guiContainer = new GuiContainer;
    this.guiContainer.init();
    this.guiContainer.resize()
};
BaseState.prototype.destroy = function() {
    BaseState.parent.destroy.call(this);
    this.guiContainer.clear()
};
BaseState.prototype.addGui = function(a, b) {
    this.guiContainer.addGui(a, b)
};
BaseState.prototype.removeGui = function(a) {
    this.guiContainer.removeGui(a)
};
BaseState.prototype.getGui = function(a) {
    return this.guiContainer.getGui(a)
};
BaseState.prototype.resize = function() {
    this.guiContainer.resize()
};
BaseState.prototype.activate = function(a) {
    this.id = a ? a.id : null;
    this.params = a;
    this.resources ? this.preload() : this.init(this.params)
};
BaseState.prototype.preload = function() {
    var a = 0,
        b = this;
    this.resources || this.preloadComplete();
    this.resources.json ? $.each(this.resources.json, function(c) {
        a++;
        $.getJSON(c, function(a) {
            b.resources.json[c] = a
        }).error(function() {
            assert(!1, "error reading JSON " + c)
        }).complete(function() {
            a--;
            0 >= a && b.jsonPreloadComplete()
        })
    }) : this.jsonPreloadComplete()
};
BaseState.prototype.jsonPreloadComplete = function() {
    var a = this;
    this.resources.media ? Resources.loadMedia(this.resources.media, function() {
        a.preloadComplete()
    }, this.preloadingCallback) : this.preloadComplete()
};
BaseState.prototype.preloadComplete = function() {
    this.init(this.params)
};
BaseState.prototype.preloadJson = function(a) {
    if (!this.resources) this.resources = {};
    if (!this.resources.json) this.resources.json = {};
    "string" === typeof a ? this.resources.json[a] = null : "array" === typeof a ? $.each(this.resources.json, function(a, c) {
        this.resources.json[c] = null
    }) : console.error("Invalid argument for preloadJson: should be array of json urls or single url.")
};
BaseState.prototype.preloadMedia = function(a, b) {
    if (!this.resources) this.resources = {};
    if (!this.resources.media) this.resources.media = [];
    this.preloadingCallback = b;
    a instanceof Array ? this.resources.media = a : console.error("Invalid argument for preloadMedia: array of media urls.")
};
Account.prototype = new BaseState;
Account.prototype.constructor = Account;
var GLOBAL_UPDATE_INTERVAL = 50;

function Account() {
    Account.parent.constructor.call(this)
}
Account.inheritsFrom(BaseState);
Account.prototype.init = function(a) {
    a = a ? a : {};
    Account.parent.init.call(this, a);
    this.allEntities = {};
    this.scheduledEntities = {};
    this.syncWithServerInterval = a.syncWithServerInterval;
    this.id = selectValue(a.id, "Account01");
    this.globalUpdateInterval = selectValue(a.globalUpdateInterval, GLOBAL_UPDATE_INTERVAL);
    this.addEntity(this);
    this.backgroundState = new BackgroundState;
    a.backgroundState = selectValue(a.backgroundState, {});
    a.backgroundState.id = selectValue(a.backgroundState.id, "backgroundState01");
    this.backgroundState.activate(a.backgroundState);
    assert(null == Account.instance, "Only one account object at time are allowed");
    Account.instance = this
};
Account.prototype.addEntity = function(a) {
    assert("string" == typeof a.id, "Entity ID must be string");
    assert(null == this.allEntities[a.id], "Entity with ID '" + a.id + "' already exists");
    this.allEntities[a.id] = a
};
Account.prototype.getEntity = function(a) {
    return this.allEntities[a]
};
Account.prototype.removeEntity = function(a, b) {
    var c = this.allEntities[a];
    c && (b || (this.removeScheduledEntity(c), this.removeChild(c), c.destroy()), delete this.allEntities[a])
};
Account.prototype.removeAllEntities = function() {
    $.each(this.allEntities, function(a, b) {
        b !== Account.instance && Account.instance.removeEntity(a, !1)
    })
};
Account.prototype.addScheduledEntity = function(a) {
    assert("string" == typeof a.id, "Entity ID must be string");
    var b = this,
        c = this.globalUpdateInterval;
    if (!this.globalUpdateIntervalHandle) this.globalUpdateIntervalHandle = this.setInterval(function() {
        b.update(c)
    }, c);
    this.scheduledEntities[a.id] = a
};
Account.prototype.removeScheduledEntity = function(a) {
    assert("string" == typeof a.id, "Entity ID must be string");
    delete this.scheduledEntities[a.id];
    if (!this.globalUpdateIntervalHandle && $.isEmptyObject(this.scheduledEntities)) this.clearInterval(this.globalUpdateIntervalHandle), this.globalUpdateIntervalHandle = null
};
Account.prototype.update = function(a) {
    $.each(this.scheduledEntities, function(b, c) {
        c && c.isEnabled() && c.update(a)
    })
};
Account.prototype.setEnable = function() {};
Account.prototype.resize = function() {
    null != this.children && ($.each(this.children, function(a, b) {
        b && b.resize && b.resize()
    }), this.backgroundState && this.backgroundState.resize())
};
Account.prototype.readGlobalUpdate = function(a) {
    var b = this;
    $.each(a, function(c, d) {
        var e = Account.instance.getEntity(c);
        if (e) d.destroy ? (b.removeEntity(c), delete a[c]) : e.readUpdate(d);
        else if (Account.instance.getEntity(d.parent)) d.id = c, e = entityFactory.createObject(d["class"], d), b.addEntity(e)
    })
};
Account.prototype.writeGlobalUpdate = function() {
    var a = {};
    this.writeUpdate(a, {});
    return a
};
Account.prototype.getUpdateFromServer = function(a) {
    this.server.receiveData(a)
};
Account.prototype.saveUpdateToServer = function(a, b) {
    this.server.sendData(a, b)
};
Account.prototype.commandToServer = function(a, b, c) {
    var d = this;
    this.server.command(a, b, function(a, b) {
        d.readGlobalUpdate(b);
        c(a)
    })
};
Account.prototype.syncWithServer = function(a, b, c) {
    var d = this.writeGlobalUpdate();
    b && $.extend(!0, d, b);
    var e = this;
    this.server.sendData(d, function(b) {
        e.readGlobalUpdate(b);
        a && a()
    });
    c = selectValue(c, this.syncWithServerInterval);
    if (null != c) this.clearTimeout(this.syncWithServerTimeoutId), e = this, this.syncWithServerTimeoutId = this.setTimeout(function() {
        e.syncWithServer()
    }, 5E3)
};
VisualEntity.prototype = new Entity;
VisualEntity.prototype.constructor = VisualEntity;

function VisualEntity() {
    VisualEntity.parent.constructor.call(this)
}
VisualEntity.inheritsFrom(Entity);
VisualEntity.prototype.init = function(a) {
    VisualEntity.parent.init.call(this, a);
    this.x = a.x;
    this.y = a.y;
    this.z = a.z;
    this.width = a.width;
    this.height = a.height;
    this.visible = a.visible;
    this.visuals = {}
};
VisualEntity.prototype.createVisual = function() {
    this.description = Account.instance.descriptionsData[this.params.description];
    this.assert(this.description, "There is no correct description")
};
VisualEntity.prototype.addVisual = function(a, b) {
    var c = null == a ? 0 : a;
    this.assert(null == this.visuals[c], "Visual id = '" + c + "' is already created.");
    this.visuals[c] = b
};
VisualEntity.prototype.getVisual = function(a) {
    a = null == a ? 0 : a;
    return this.visuals[a] ? this.visuals[a].visual : null
};
VisualEntity.prototype.removeVisual = function(a) {
    a = null == a ? 0 : a;
    this.guiParent.removeGui(this.visuals[a].visual);
    delete this.visuals[a]
};
VisualEntity.prototype.getVisualInfo = function(a) {
    return this.visuals[null == a ? 0 : a]
};
VisualEntity.prototype.attachToGui = function(a, b) {
    if (!this.visual) {
        this.guiParent = a ? a : this.params.guiParent;
        this.assert(this.guiParent, "No guiParent provided");
        this.createVisual();
        var c = this;
        $.each(c.visuals, function(a, e) {
            e.visual.visualEntity = c;
            c.guiParent.addGui(e.visual);
            e.visual.clampByParentViewport && e.visual.clampByParentViewport(b)
        })
    }
};
VisualEntity.prototype.destroy = function() {
    VisualEntity.parent.destroy.call(this);
    if (this.guiParent) {
        var a = this;
        $.each(this.visuals, function(b, c) {
            a.guiParent.removeGui(c.visual)
        })
    }
};
VisualEntity.prototype.setZ = function(a) {
    if ("number" == typeof a) this.z = a;
    var b = this;
    $.each(b.visuals, function(a, d) {
        "number" == typeof b.z && d.visual.setZ(b.z + d.z)
    })
};
VisualEntity.prototype.setPosition = function(a, b) {
    this.x = a;
    this.y = b;
    var c = this;
    $.each(c.visuals, function(a, b) {
        if (!b.dependent) {
            var f = c.x,
                g = c.y;
            "number" == typeof b.offsetX && (f -= b.offsetX);
            "number" == typeof b.offsetY && (g -= b.offsetY);
            b.visual.setPosition(f, g)
        }
    })
};
VisualEntity.prototype.move = function(a, b) {
    this.setPosition(this.x + a, this.y + b)
};
VisualEntity.prototype.setPositionToVisual = function(a) {
    a = this.getVisualInfo(a);
    this.x = a.visual.x + a.offsetX;
    this.y = a.visual.y + a.offsetY;
    this.setPosition(this.x, this.y)
};
VisualEntity.prototype.show = function() {
    this.visible = !0;
    $.each(this.visuals, function(a, b) {
        b.visual.show()
    })
};
VisualEntity.prototype.hide = function() {
    this.visible = !1;
    $.each(this.visuals, function(a, b) {
        b.visual.hide()
    })
};
VisualEntity.prototype.resize = function() {
    $.each(this.visuals, function(a, b) {
        b.visual.resize()
    })
};
VisualEntity.prototype.writeUpdate = function(a, b) {
    this.writeUpdateProperty(b, "x", this.x);
    this.writeUpdateProperty(b, "y", this.y);
    VisualEntity.parent.writeUpdate.call(this, a, b)
};
VisualEntity.prototype.readUpdate = function(a) {
    VisualEntity.parent.readUpdate.call(this, a)
};
Scene.prototype = new VisualEntity;
Scene.prototype.constructor = Scene;

function Scene() {
    Scene.parent.constructor.call(this)
}
Scene.inheritsFrom(VisualEntity);
Scene.prototype.className = "Scene";
Scene.prototype.createInstance = function(a) {
    var b = new Scene;
    b.init(a);
    return b
};
entityFactory.addClass(Scene);
Scene.prototype.init = function(a) {
    Scene.parent.init.call(this, a)
};
Scene.prototype.createVisual = function() {
    var a = this.params,
        a = guiFactory.createObject("GuiScene", {
            parent: this.guiParent,
            style: "scene",
            x: a.x,
            y: a.y,
            width: a.width,
            height: a.height,
            background: a.background
        }),
        b = {};
    b.visual = a;
    this.addVisual(null, b);
    var c = this;
    this.children = this.children ? this.children : [];
    $.each(this.children, function(a, b) {
        c.attachChildVisual(b)
    })
};
Scene.prototype.attachChildVisual = function(a) {
    a.attachToGui && a.attachToGui(this.getVisual(), !0)
};
Scene.prototype.move = function(a, b, c) {
    var d = this.getVisual();
    c && $.each(d.backgrounds, function(e, f) {
        f && e != d.backgrounds.length - 1 && d.setBackgroundPosition(d.backgrounds[e].left - a * (e / c), d.backgrounds[e].top - b * (e / c), e)
    });
    d.move(a, b)
};
var ITEM_NAME = "Item";
Item.prototype = new VisualEntity;
Item.prototype.constructor = Item;

function Item() {
    Item.parent.constructor.call(this)
}
Item.inheritsFrom(VisualEntity);
Item.prototype.className = ITEM_NAME;
Item.prototype.createInstance = function(a) {
    var b = new Item;
    b.init(a);
    return b
};
entityFactory.addClass(Item);
Item.prototype.init = function(a) {
    Item.parent.init.call(this, a);
    this.stashed = a.stashed;
    if (!this.stashed)(a = this.params.guiParent ? this.params.guiParent : this.parent.visual) && this.attachToGui(a), this.z = null != this.z ? this.z : 0
};
Item.prototype.getIcon = function() {
    return this.description.totalImage
};
Item.prototype.createVisual = function() {
    this.assert(this.guiParent, "No gui parent provided for creating visuals");
    this.description = Account.instance.descriptionsData[this.params.description];
    this.assert(this.description, "There is no correct description");
    var a = Resources.getImage(this.description.totalImage);
    visual = guiFactory.createObject("GuiSprite", {
        parent: this.guiParent,
        style: "sprite",
        x: this.params.x,
        y: this.params.y,
        width: this.description.totalImageWidth,
        height: this.description.totalImageHeight,
        totalImage: a,
        totalImageWidth: this.description.totalImageWidth,
        totalImageHeight: this.description.totalImageHeight,
        totalTile: this.description.totalTile
    });
    a = {};
    a.visual = visual;
    a.z = this.description["z-index"];
    a.offsetX = this.description.centerX ? calcPercentage(this.description.centerX, this.description.width) : 0;
    a.offsetY = this.description.centerY ? calcPercentage(this.description.centerY, this.description.height) : 0;
    this.addVisual(null, a);
    this.setPosition(this.x, this.y);
    this.setZ(null)
};
Item.prototype.writeUpdate = function(a, b) {
    Item.parent.writeUpdate.call(this, a, b)
};
Item.prototype.readUpdate = function(a) {
    Item.parent.readUpdate.call(this, a)
};
SimpleCountdown.prototype = new VisualEntity;
SimpleCountdown.prototype.constructor = SimpleCountdown;

function SimpleCountdown() {
    SimpleCountdown.parent.constructor.call(this)
}
SimpleCountdown.inheritsFrom(VisualEntity);
SimpleCountdown.prototype.className = "SimpleCountdown";
SimpleCountdown.prototype.createInstance = function(a) {
    var b = new SimpleCountdown;
    b.init(a);
    return b
};
entityFactory.addClass(SimpleCountdown);
SimpleCountdown.prototype.init = function(a) {
    SimpleCountdown.parent.init.call(this, a)
};
SimpleCountdown.prototype.setCycleEndCallback = function(a) {
    this.cycleEndCallback = a
};
SimpleCountdown.prototype.createVisual = function() {
    SimpleCountdown.parent.createVisual.call(this);
    this.description.style = null == this.description.style ? "dialogButtonLabel lcdmono-ultra" : this.description.style;
    this.label = guiFactory.createObject("GuiLabel", {
        parent: this.guiParent,
        x: this.params.x,
        y: this.params.y,
        style: this.description.style,
        width: this.description.width,
        height: this.description.height,
        align: "center",
        verticalAlign: "middle",
        text: this.params.count,
        fontSize: this.description.fontSize,
        color: this.description.color
    });
    var a = {};
    a.visual = this.label;
    this.addVisual(null, a);
    this.count = 1E3 * this.params.count;
    this.alarmCount = 1E3 * this.params.alarmCount;
    this.paused = !1
};
SimpleCountdown.prototype.pause = function() {
    this.paused = !0
};
SimpleCountdown.prototype.resume = function() {
    this.paused = !1
};
SimpleCountdown.prototype.getTimeRemains = function() {
    return this.count
};
SimpleCountdown.prototype.update = function(a) {
    if (!this.paused)
        if (this.count -= a, 0 < this.count) this.alarmCount && this.count < this.alarmCount ? (this.label.setColor(this.description.alarmColor), this.alarmCount = null) : this.label.change(Math.floor(this.count / 1E3));
        else if (this.label.change(this.description.go), this.cycleEndCallback) this.cycleEndCallback(), this.cycleEndCallback = null
};
Countdown.prototype = new VisualEntity;
Countdown.prototype.constructor = Countdown;

function Countdown() {
    Countdown.parent.constructor.call(this)
}
Countdown.inheritsFrom(VisualEntity);
Countdown.prototype.className = "Countdown";
Countdown.prototype.createInstance = function(a) {
    var b = new Countdown;
    b.init(a);
    return b
};
entityFactory.addClass(Countdown);
Countdown.prototype.init = function(a) {
    Countdown.parent.init.call(this, a)
};
Countdown.prototype.setCycleEndCallback = function(a) {
    this.cycleEndCallback = a
};
Countdown.prototype.setEndCallback = function(a) {
    this.EndCallback = a
};
Countdown.prototype.createVisual = function() {
    Countdown.parent.createVisual.call(this);
    if (this.description.sprite) {
        this.sprite = guiFactory.createObject("GuiSprite", {
            parent: this.guiParent,
            style: "dialogButton",
            x: this.params.x,
            y: this.params.y,
            width: this.description.sprite.width,
            height: this.description.sprite.height,
            totalImage: Resources.getImage(this.description.sprite.totalImage),
            totalImageWidth: this.description.sprite.totalImageWidth,
            totalImageHeight: this.description.sprite.totalImageHeight,
            totalTile: this.description.sprite.totalTile,
            spriteAnimations: this.description.sprite.spriteAnimations
        });
        var a = {};
        a.visual = this.sprite;
        this.addVisual("sprite", a)
    }
    this.tickSound = this.description.tickSound ? this.description.tickSound : "beepShort";
    this.lastSound = this.description.lastSound ? this.description.lastSound : "beepShort";
    this.tickDuration = this.description.tickDuration ? this.description.tickDuration : 1E3;
    this.count = this.params.count;
    this.duration = this.count * this.tickDuration;
    this.alarmColor = this.description.alarmColor;
    this.alarmCount = this.params.alarmCount;
    this.paused = this.description.paused ? this.description.paused : !1;
    if (this.description.label) this.label = guiFactory.createObject("GuiLabel", {
        parent: this.guiParent,
        style: this.description.label.params.style ? this.description.label.params.style : "dialogButtonLabel lcdmono-ultra",
        width: this.description.label.params.width,
        height: this.description.label.params.height,
        x: this.description.label.params.x ? this.description.label.params.x : this.params.x,
        y: this.description.label.params.y ? this.description.label.params.y : this.params.y,
        align: "center",
        verticalAlign: "middle",
        text: this.count,
        fontSize: this.description.label.params.fontSize,
        color: this.description.label.params.color
    }), a = {}, a.visual = this.label, this.addVisual("label", a);
    var b = this,
        c = function() {
            b.paused || (1 < b.count ? (b.count--, b.label && b.label.change(b.count), b.sprite && b.sprite.playAnimation("countdown", b.tickDuration, !1), b.sprite.setAnimationEndCallback(c)) : (b.sprite && b.sprite.playAnimation("empty", b.tickDuration, !0), b.label && b.label.change(b.description.go),
                b.EndCallback && b.EndCallback()))
        };
    this.sprite && (this.sprite.playAnimation("countdown", 1E3, !1), this.sprite.setAnimationEndCallback(c))
};
Countdown.prototype.update = function(a) {
    var b = Math.floor(this.duration / 1E3) + 1;
    if (!this.paused) {
        this.sprite && this.sprite.update(a);
        if (this.label)
            if (this.duration -= a, 0 < this.duration) {
                if (this.cycleEndCallback && b != Math.floor(this.duration / 1E3) + 1) this.cycleEndCallback(), b = this.label.text;
                this.alarmCount && this.duration / 1E3 < this.alarmCount ? (this.label.setColor(this.description.alarmColor), this.alarmCount = null) : this.sprite || this.label.change(Math.floor(this.duration / 1E3) + 1)
            } else this.sprite || (this.label.change(this.description.go),
                this.EndCallback && (this.EndCallback(), delete this.update));
            !this.label && !this.sprite && (0 < this.duration ? (this.duration -= a, this.cycleEndCallback && b != Math.floor(this.duration / 1E3) + 1 && this.cycleEndCallback()) : this.EndCallback && (this.EndCallback(), delete this.update))
    }
};
Countdown.prototype.pause = function() {
    this.paused = !0
};
Countdown.prototype.resume = function() {
    this.paused = !1
};
Countdown.prototype.getTimeRemains = function() {
    return this.count
};
Inventory.prototype = new Entity;
Inventory.prototype.constructor = Inventory;

function Inventory() {
    Inventory.parent.constructor.call(this)
}
Inventory.inheritsFrom(Entity);
Inventory.prototype.className = "Inventory";
Inventory.prototype.createInstance = function(a) {
    var b = new Inventory;
    b.init(a);
    return b
};
entityFactory.addClass(Inventory);
Inventory.prototype.init = function(a) {
    this.children = [];
    Inventory.parent.init.call(this, a)
};
Inventory.prototype.clear = function() {
    this.params.itemList = null
};
Inventory.prototype.addItem = function(a) {
    a instanceof Item && Account.instance.commandToServer("changeParent", [a.id, this.id], function(a) {
        a ? (console.log("SUCCESS"), console.log("ItemADDED")) : console.log("FAIL")
    })
};
Inventory.prototype.readUpdate = function(a) {
    Inventory.parent.readUpdate.call(this, a)
};
Inventory.prototype.writeUpdate = function(a, b) {
    Inventory.parent.writeUpdate.call(this, a, b)
};
var LEVEL_FADE_TIME = 500;
BackgroundState.prototype = new BaseState;
BackgroundState.prototype.constructor = BaseState;

function BackgroundState() {
    BackgroundState.parent.constructor.call(this)
}
BackgroundState.inheritsFrom(BaseState);
BackgroundState.prototype.init = function(a) {
    var a = a ? a : {},
        b = selectValue(a.image, "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII="),
        c;
    if (a.background) c = a.background, b = null;
    this.dialogs = {};
    var d = this;
    a.dialogs && $.each(a.dialogs, function(a, b) {
        d.dialogs[a] = guiFactory.createObject("GuiMessageBox", b.params)
    });
    BackgroundState.parent.init.call(this, a);
    this.mask = guiFactory.createObject("GuiDiv", {
        parent: "body",
        image: b,
        background: c,
        style: "mask",
        width: "FULL_WIDTH",
        height: "FULL_HEIGHT",
        x: 0,
        y: 0
    });
    this.addGui(this.mask);
    this.mask.$().css("opacity", 0);
    this.mask.setZ(1E4);
    this.mask.hide()
};
BackgroundState.prototype.fadeIn = function(a, b, c) {
    this.mask.$().css("opacity", 0);
    this.mask.$().css("background-color", b);
    this.mask.fadeTo(1, a, c)
};
BackgroundState.prototype.fadeOut = function(a, b) {
    var c = this;
    this.mask.fadeTo(0, a, function() {
        c.mask.hide();
        b && b()
    })
};
BackgroundState.prototype.resize = function() {
    BackgroundState.parent.resize.call(this);
    $.each(this.dialogs, function(a, b) {
        b.resize()
    })
};

function boxPolyVertices(a, b, c, d) {
    return [{
        x: a,
        y: b
    }, {
        x: a + c,
        y: b
    }, {
        x: a + c,
        y: b + d
    }, {
        x: a,
        y: b + d
    }]
}
var MathUtils = function() {
    return {
        toRad: function(a) {
            return Math.PI / 180 * a
        },
        toDeg: function(a) {
            return 180 / Math.PI * a
        }
    }
}();

function calculateAngle(a, b) {
    var c = new b2Vec2(a.x, a.y),
        d = new b2Vec2(b.x, b.y),
        c = (a.x * b.x + a.y * b.y) / (c.Length() * d.Length());
    return MathUtils.toDeg(Math.acos(c))
}

function calculateSignedAngle(a, b) {
    var c = new b2Vec2(a.x, a.y),
        d = new b2Vec2(b.x, b.y);
    return (a.x * b.y + a.y * b.x) / (c.Length() * d.Length())
}

function DebugCanvas() {
    var a = document.getElementById("debugCanvas");
    a || ($("#root").append("<canvas id='debugCanvas' width='800' height='500' style='position :absolute; top: 0 px; left: 0 px;'></canvas>"), a = document.getElementById("debugCanvas"));
    this.debugDrawContext = a.getContext("2d");
    a = document.getElementById("debugCanvas");
    this.debugDrawContext = a.getContext("2d");
    a.width = BASE_WIDTH;
    a.height = BASE_HEIGHT;
    a.style.width = BASE_WIDTH * Screen.widthRatio();
    a.style.height = BASE_HEIGHT * Screen.heightRatio();
    this.debugCanvasWidth = parseInt(a.width);
    this.debugCanvasHeight = parseInt(a.height);
    debugCanvasTop = parseInt(a.style.top);
    debugCanvasLeft = parseInt(a.style.left);
    eLog("left " + a.style.left, "top " + a.style.top)
}
var Physics = function() {
        function a() {
            if (null == l) {
                var a = new b2AABB;
                a.minVertex.Set(-1E3, -1E3);
                a.maxVertex.Set(2E3, 2E3);
                var b = new b2Vec2(0, 300);
                l = new b2World(a, b, !0);
                u = new ContactProcessor;
                r = new ContactListener(u)
            }
        }

        function b() {
            l.m_contactManager.CleanContactList();
            this.m_flags |= b2Body.e_sleepFlag;
            this.m_linearVelocity.Set(0, 0);
            this.m_sleepTime = this.m_angularVelocity = 0
        }

        function c(a, b) {
            this.SetCenterPosition(a, b);
            var c = b2Math.SubtractVV(this.m_position, this.GetShapeList().GetPosition());
            this.SetCenterPosition(b2Math.AddVV(a,
                c), b)
        }

        function d() {
            for (var a = this.GetShapeList(), b = 0; null != a; ++b, a = a.m_next);
            return b
        }

        function e(a) {
            for (var a = this.getShapesCount() - 1 - a, b = this.GetShapeList(), c = 0; c < a; ++c) {
                if (!b.m_next) return eLog("bad shape idx!"), null;
                b = b.m_next
            }
            return b
        }

        function f() {
            var a = void 0,
                a = this.positionInshape ? this.GetShapeList().GetPosition() : this.GetCenterPosition(),
                b = a.x - this.offset.x,
                a = a.y - this.offset.y,
                c = this.GetRotation();
            return {
                x: b,
                y: a,
                angle: c
            }
        }

        function g(a) {
            var b = new b2Vec2(parseFloat(a.x) + this.offset.x, parseFloat(a.y) +
                this.offset.y);
            this.positionInshape ? this.setPoseByShape(b, a.angle) : this.SetCenterPosition(b, a.angle)
        }

        function i(a) {
            a.friction = 0.5;
            a.restitution = 0.3;
            a.density = 0.01
        }

        function j(a, i, j, m, l) {
            var k = new b2BodyDef;
            k.linearDamping = 1.0E-4;
            k.angularDamping = 0.0010;
            if (void 0 != l)
                for (var p = 0; p < l; ++p) k.AddShape(m[p]);
            else k.AddShape(m);
            k.position.Set(a, i);
            k.rotation = j;
            k.isSleeping = !0;
            k.allowSleep = !0;
            a = Physics.getWorld().CreateBody(k);
            a.putToSleep = b;
            a.getShapesCount = d;
            a.getShapeByIdx = e;
            a.setPoseByShape = c;
            a.setContactCallback =
                q;
            a.getLogicPose = f;
            a.setLogicPose = g;
            return a
        }

        function m(a, b, c) {
            "undefined" == typeof c && (c = !0);
            var d = new b2PolyDef;
            c || i(d);
            b && d.localPosition.SetV(b);
            d.vertexCount = a.length;
            for (b = 0; b < a.length; b++) d.vertices[b].Set(a[b].x, a[b].y);
            return d
        }

        function q(a, b) {
            if (void 0 != b) this.getShapeByIdx(b).contactCallback = a;
            else
                for (var c = this.GetShapeList(); null != c; c = c.m_next) c.contactCallback = a
        }
        var l = null,
            k = null,
            o = null,
            p = !1,
            t = !0,
            n = null,
            s = [],
            r = null,
            u = null;
        return {
            getWorld: function() {
                a();
                assert(l, "No physics world created!");
                return l
            },
            createWorldBorder: function() {
                assert(l);
                var a = ENHANCED_BASE_MARGIN_WIDTH;
                if (!b) var b = 0;
                var c = BASE_WIDTH,
                    d = BASE_HEIGHT,
                    e = c + 200 + 2 * a,
                    i = d + 200 - b,
                    a = [boxPolyVertices(-100 - a, -1100, 100, i + 1E3), boxPolyVertices(c + a, -1100, 100, i + 1E3), boxPolyVertices(-100 - a, d - b, e, 100)];
                k = Physics.createPolyComposite(0, 0, 0, a)
            },
            getContactProcessor: function() {
                return u
            },
            getContactListener: function() {
                return r
            },
            updateWorld: function(a) {
                if (!p) {
                    this.getWorld().Step(a / 1350, 50);
                    o && o.tick(a);
                    n && n && (n.debugDrawContext.clearRect(0, 0,
                        n.debugCanvasWidth, n.debugCanvasHeight), drawWorld(l, n.debugDrawContext));
                    for (a = 0; a < s.length; ++a) s[a].updatePhysics()
                }
            },
            createSphere: function(a, b, c, d) {
                var e = new b2CircleDef;
                i(e);
                e.radius = c;
                c = j(a, b, 0, e);
                d && (c.GetShapeList().m_localPosition.Set(d.x, d.y), c.setPoseByShape({
                    x: a,
                    y: b
                }, 0));
                return c
            },
            createBox: function(a, b, c, d, e, f) {
                "undefined" == typeof f && (f = !0);
                var g = new b2BoxDef;
                f || i(g);
                g.extents.Set(d / 2, e / 2);
                return j(a, b, c, g)
            },
            createPoly: function(a, b, c, d) {
                c = m(c, d);
                return j(a, b, 0, c)
            },
            createPolyComposite: function(a,
                b, c, d, e, i) {
                poligonsDefs = [];
                for (var f = 0; f < d.length; ++f) poligonsDefs.push(m(d[f], e, i));
                a = j(a, b, c, poligonsDefs, poligonsDefs.length);
                a.m_userData = {
                    id: "Ground01",
                    params: {
                        type: "Ground"
                    }
                };
                return a
            },
            destroy: function(a) {
                a && (assert(l), l.DestroyBody(a))
            },
            destroyWorld: function() {
                Physics.destroy(k);
                l = null;
                s = []
            },
            getWorldBorder: function() {
                k || a();
                assert(k);
                return k
            },
            pause: function(a) {
                p = null == a ? !p : a
            },
            paused: function() {
                return p
            },
            resetTimeout: function(a) {
                o && (o.timeOut += a)
            },
            clearTimeout: function() {
                o = null
            },
            setTimout: function(a,
                b) {
                o = {
                    time: 0,
                    callback: a,
                    timeOut: b,
                    tick: function(a) {
                        this.time += a;
                        this.time < this.timeOut || (this.callback(), o = null)
                    }
                }
            },
            updateItemAdd: function(a) {
                -1 == s.indexOf(a) && s.push(a)
            },
            updateItemRemove: function(a) {
                a = s.indexOf(a); - 1 != a && s.splice(a, 1)
            },
            destroy: function(a) {
                a && (Physics.updateItemRemove(a), l && a.physics && l.DestroyBody(a.physics))
            },
            debugDrawing: function(a) {
                a && !n && (n = new DebugCanvas);
                !a && n && (n.debugDrawContext.clearRect(0, 0, n.debugCanvasWidth, n.debugCanvasHeight), n = null)
            },
            debugDrawingIsOn: function() {
                return !!n
            },
            setDebugModeEnabled: function(a) {
                t = a
            },
            debugMode: function() {
                return t
            },
            explode: function() {}
        }
    }(),
    collisionCallback = function() {
        var a = contact.GetFixtureA().GetBody().GetUserData(),
            b = contact.GetFixtureB().GetBody().GetUserData(),
            c = Physics.getMaterialImpact(a.descriptions.material, b.descriptions.material);
        a.beginContact && a.beginContact(b, c);
        b.beginContact && entity12.beginContact(a, c);
        c.effect && new VisualEffect(c.effect)
    },
    DAMAGE_DECR = 180,
    FORCE_RATING = 100;
Physics.explode = function(a) {
    function b() {
        setTimeout(function() {
            for (var g = d.m_bodyList; null != g; g = g.m_next) {
                var i = g.GetCenterPosition(),
                    j = new b2Vec2(i.x - a.center.x, i.y - a.center.y),
                    i = j.Length();
                i < a.radius && (j.Normalize(), j.Multiply(FORCE_RATING * a.force / Math.pow(1 + i, c)), g.m_userData && "CannonBall" != g.m_userData.params.id && (g.WakeUp(), g.ApplyImpulse(j, g.GetCenterPosition()), g.AllowSleeping(!0)), g.m_userData && g.m_userData.destructable && (i = j.Length() / DAMAGE_DECR, g.m_userData.onDamage(i)))
            }
            f < a.duration && b();
            f += e
        }, 5)
    }
    var c = null != a.decr ? a.decr : 1;
    DAMAGE_DECR = null != a.damageDecr ? a.damageDecr : 150;
    var d = Physics.getWorld(),
        e = 0 < a.delta ? a.delta : 20,
        f = a.duration / e;
    b()
};

function ContactProcessor() {
    this.pairs = {};
    this.defaultBegin = function() {};
    this.defaultEnd = function() {}
}
ContactProcessor.prototype.addPair = function(a, b, c, d) {
    a in this.pairs ? (this.pairs[a][b] || (this.pairs[a][b] = {}), this.pairs[a][b][c] = d) : b in this.pairs ? (this.pairs[b][a] || (this.pairs[b][a] = {}), this.pairs[b][a][c] = d) : (this.pairs[a] = {}, this.pairs[a][b] = {}, this.pairs[a][b][c] = d)
};
ContactProcessor.prototype.setDefaultBeginContact = function(a) {
    this.defaultBegin = a
};
ContactProcessor.prototype.setDefaultEndContact = function(a) {
    this.defaultEnd = a
};
ContactProcessor.prototype.processBegin = function(a, b, c) {
    a in this.pairs && b in this.pairs[a] && this.pairs[a][b].beginContact ? this.pairs[a][b].beginContact(c) : b in this.pairs && a in this.pairs[b] && this.pairs[b][a].beginContact ? this.pairs[b][a].beginContact(c) : this.defaultBegin(c)
};
ContactProcessor.prototype.processEnd = function(a, b, c) {
    a in this.pairs && b in this.pairs[a] && this.pairs[a][b].endContact ? this.pairs[a][b].endContact(c) : b in this.pairs && a in this.pairs[b] && this.pairs[b][a].endContact ? this.pairs[b][a].endContact(c) : this.defaultEnd(c)
};
var LOG_DEBUG = !1;

function ContactListener(a, b) {
    this.body = b;
    (this.contactProcessor = a) || console.log("No contact processor were added! Will be defaults");
    this.activeContacts = [];
    this.activeContactIDs = [];
    this.events = []
}
ContactListener.prototype.getContacts = function(a) {
    var b = [],
        c = [],
        a = a.m_contactList;
    if (null != a)
        for (; null != a; a = a.m_next) - 1 == $.inArray(a, c) && (b.push(a.contact.m_shape1.m_body.m_userData.id + ":" + a.contact.m_shape2.m_body.m_userData.id), c.push(a.contact));
    return {
        iDs: b,
        contacts: c
    }
};
ContactListener.prototype.update = function() {
    var a = this,
        b = this.getContacts(this.body),
        c = b.iDs,
        d = b.contacts;
    this.activeContactIDs && this.contactProcessor && ($.each(c, function(b, c) {
        -1 == $.inArray(c, a.activeContactIDs) && a.contactProcessor.processBegin(d[b].m_shape1.m_body.m_userData.params.type, d[b].m_shape2.m_body.m_userData.params.type, d[b])
    }), $.each(a.activeContactIDs, function(b, d) {
        -1 == $.inArray(d, c) && a.contactProcessor.processEnd(a.activeContacts[b].m_shape1.m_body.m_userData.params.type, a.activeContacts[b].m_shape2.m_body.m_userData.params.type,
            a.activeContacts[b])
    }));
    this.activeContactIDs = c;
    this.activeContacts = d
};
var ANIM_DELAY = 400;
PhysicEntity.prototype = new VisualEntity;
PhysicEntity.prototype.constructor = PhysicEntity;

function PhysicEntity() {
    PhysicEntity.parent.constructor.call(this)
}
PhysicEntity.inheritsFrom(VisualEntity);
PhysicEntity.prototype.className = "PhysicEntity";
PhysicEntity.prototype.createInstance = function(a) {
    var b = new PhysicEntity;
    b.init(a);
    return b
};
entityFactory.addClass(PhysicEntity);
PhysicEntity.prototype.init = function(a) {
    var b = {};
    this.physicsEnabled = !0;
    null != a.type && (b = Account.instance.descriptionsData[a.type]);
    PhysicEntity.parent.init.call(this, $.extend(a, b));
    if (this.params.physics) this.createPhysics(), assert(!this.physics.m_userData), this.physics.m_userData = this, this.updatePositionFromPhysics(), (!this.physics.IsStatic() || Physics.debugMode()) && Physics.updateItemAdd(this)
};
PhysicEntity.prototype.createPhysics = function() {
    function a(a, b) {
        a.density = selectValue(b.density, !0 == b["static"] ? 0 : 1);
        a.restitution = selectValue(b.restitution, 1);
        a.friction = selectValue(b.friction, 0)
    }
    var b, c, d = this.params.physics,
        e = this.params.x,
        f = this.params.y;
    c = new b2BodyDef;
    switch (d.type) {
        case "Box":
            b = new b2BoxDef;
            b.extents = new b2Vec2(d.width / 2, d.height / 2);
            a(b, d);
            c.AddShape(b);
            break;
        case "Circle":
            b = new b2CircleDef;
            b.radius = d.radius;
            a(b, d);
            c.AddShape(b);
            break;
        case "Poly":
            b = new b2PolyDef;
            b.vertexCount =
                d.vertexCount;
            b.vertices = d.vertices;
            a(b, d);
            c.AddShape(b);
            break;
        case "Triangle":
            b = new b2PolyDef;
            b.vertexCount = 3;
            b.vertices = d.vertices;
            c.AddShape(b);
            a(b, d);
            break;
        case "PolyComposite":
            $.each(d.shapes, function(b, e) {
                var f = new b2PolyDef;
                f.vertexCount = e.vertexCount;
                var m = [];
                $.each(e.vertices, function(a, b) {
                    var c = {};
                    c.x = d.scale ? b.x * d.scale : b.x;
                    c.y = d.scale ? b.y * d.scale : b.y;
                    m.push(c)
                });
                f.vertices = m;
                a(f, e);
                c.AddShape(f)
            });
            break;
        case "PrimitiveComposite":
            $.each(d.shapes, function(e, i) {
                switch (i.type) {
                    case "Box":
                        b =
                            new b2BoxDef;
                        b.extents = new b2Vec2(i.width / 2, i.height / 2);
                        a(b, i);
                        b.localPosition = new b2Vec2(i.x, i.y);
                        c.AddShape(b);
                        break;
                    case "Circle":
                        b = new b2CircleDef;
                        b.radius = d.radius;
                        a(b, d);
                        c.AddShape(b);
                        break;
                    case "Poly":
                        b = new b2PolyDef;
                        b.vertexCount = d.vertexCount;
                        b.vertices = d.vertices;
                        a(b, d);
                        c.AddShape(b);
                        break;
                    case "Triangle":
                        b = new b2PolyDef, b.vertexCount = 3, b.vertices = d.vertices, c.AddShape(b), a(b, d)
                }
            })
    }
    c.position.Set(0, 0);
    c.linearDamping = d.linearDamping;
    physicWorld = Physics.getWorld();
    this.physics = physicWorld.CreateBody(c);
    this.physics.SetCenterPosition(new b2Vec2(e, f), 0);
    this.health = (this.destructable = d.destructable) ? d.health : null;
    this.params.angle && this.rotate(2 * this.params.angle)
};
PhysicEntity.prototype.getContactedBody = function() {
    if (this.physics.m_contactList) return this.physics.m_contactList.other
};
PhysicEntity.prototype.getContactList = function() {
    return this.physics.m_contactList
};
PhysicEntity.prototype.setContactCallback = function(a) {
    for (var b = this.physics.GetShapeList(); null != b; b = b.m_next) b.contactCallback = a
};
PhysicEntity.prototype.createVisual = function() {
    PhysicEntity.parent.createVisual.call(this)
};
PhysicEntity.prototype.updatePositionFromPhysics = function() {
    var a = this;
    null != a.physics && (a.setPosition(a.physics.m_position.x - a.params.physics.x - a.params.physics.width / 2, a.physics.m_position.y - a.params.physics.y - a.params.physics.height / 2), "Circle" != a.params.physics.type && $.each(this.visuals, function(b, c) {
        var d = a.getPhysicsRotation().toFixed(3),
            d = MathUtils.toDeg(d),
            e = a.physics.GetCenterPosition().x,
            f = a.physics.GetCenterPosition().y,
            e = e - c.visual.width / 2,
            f = f - c.visual.height / 2,
            g = new Transform,
            i = new Transform;
        g.translate(e * Screen.widthRatio(), f * Screen.heightRatio());
        i.rotateDegrees(d / 2);
        g.multiply(i);
        i.translate(-e * Screen.widthRatio(), -f * Screen.heightRatio());
        g.multiply(i);
        c.visual.setTransform(g.m, 0)
    }))
};
PhysicEntity.prototype.physicsEnable = function(a) {
    this.physicsEnabled = a
};
PhysicEntity.prototype.updatePhysics = function() {
    this.params.physics && this.physicsEnabled && !Physics.paused() && this.updatePositionFromPhysics()
};
PhysicEntity.prototype.getPhysicsRotation = function() {
    return this.physics.GetRotation()
};
PhysicEntity.prototype.onDragBegin = function() {
    this.physicsEnable(!1)
};
PhysicEntity.prototype.onDragEnd = function() {
    this.physicsEnable(!0)
};
PhysicEntity.prototype.rotateByAxis = function(a, b) {
    var c = new Transform;
    c.translate(a.x, a.y);
    var d = new Transform;
    d.rotateDegrees(b);
    c.multiply(d);
    d.reset();
    d.translate(-a.x, -a.y);
    c.multiply(d);
    that = this;
    $.each(this.visuals, function() {
        var a = c.transformPoint(that.params.x - that.params.physics.x, that.params.y - that.params.physics.y);
        that.physics.SetCenterPosition(new b2Vec2(a[0], a[1]), that.physics.GetRotation())
    })
};
PhysicEntity.prototype.rotate = function(a) {
    var b = this.physics.GetCenterPosition(),
        a = this.physics.GetRotation() + a;
    this.physics.SetCenterPosition(b, a / 2);
    this.updatePositionFromPhysics()
};
PhysicEntity.prototype.destroy = function() {
    PhysicEntity.parent.destroy.call(this);
    this.physics && Physics.getWorld().DestroyBody(this.physics);
    Account.instance.removeEntity(this.id, !0)
};
PhysicEntity.prototype.onDamage = function(a) {
    var b = this;
    this.destructable && !(0 >= this.health) && (this.health -= a, this.params.physics.destructionLevels && $.each(b.params.physics.destructionLevels, function(a, d) {
        (b.health < d.minHealth || b.health == d.minHealth) && $.each(b.visuals, function(a, b) {
            b.visual.playAnimation(d.animName, ANIM_DELAY, !1, !0)
        })
    }), 0 >= this.health && $.each(b.visuals, function(a, d) {
        b.params.builtInDestruction ? d.visual.setAnimationEndCallback(function() {
            b.destroy()
        }) : b.destroy()
    }))
};
PhysicScene.prototype = new Scene;
PhysicScene.prototype.constructor = PhysicScene;

function PhysicScene() {
    PhysicScene.parent.constructor.call(this)
}
PhysicScene.inheritsFrom(Scene);
PhysicScene.prototype.className = "PhysicScene";
PhysicScene.prototype.createInstance = function(a) {
    var b = new PhysicScene;
    b.init(a);
    return b
};
entityFactory.addClass(PhysicScene);
PhysicScene.prototype.init = function(a) {
    PhysicScene.parent.init.call(this, a);
    this.physicWorld = Physics.getWorld();
    a.physicsBorder && Physics.createWorldBorder(a.physicsBorder);
    this.contactProcessor = function() {}
};
PhysicScene.prototype.addChild = function(a) {
    PhysicScene.parent.addChild.call(this, a)
};
PhysicScene.prototype.createVisual = function() {
    function a() {
        Physics.updateWorld(30);
        that.setTimeout(a, 15)
    }
    PhysicScene.parent.createVisual.call(this);
    that = this;
    a()
};
PhysicScene.prototype.setBackgrounds = function(a, b) {
    b || (b = this.getVisual());
    $.each(a, function(a, d) {
        b.setBackground(d.src, d.backWidth, d.backHeight, d.backX, d.backY, d.repeat, d.idx)
    });
    b.resize()
};
PhysicScene.prototype.attachChildVisual = function(a) {
    PhysicScene.parent.attachChildVisual.call(this, a)
};
PhysicScene.prototype.destroy = function() {
    PhysicScene.parent.destroy.call(this)
};
CreatePhysicsTrigger = function(a, b, c) {
    var d = {};
    d.rect = b;
    d.world = a;
    d.action = c;
    d.checkIfIn = function(a) {
        var b = !1;
        a.x > d.rect.left && a.x < d.rect.right && a.y > d.rect.top && a.y < d.rect.bottom && (b = !0);
        return b
    };
    d.move = function(a, b) {
        this.rect.left += a;
        this.rect.right += a;
        this.rect.top += b;
        this.rect.bottom += b
    };
    d.setPosition = function(a, c) {
        var d = b.right - b.left,
            i = b.bottom - b.top;
        this.rect.left = a;
        this.rect.right = a + d;
        this.rect.top = c;
        this.rect.bottom = c + i
    };
    d.update = function() {
        for (var a = d.world.m_bodyList; null != a; a = a.m_next) d.checkIfIn(a.m_position) &&
            d.action(a)
    };
    return d
};
Effect.prototype = new VisualEntity;
Effect.prototype.constructor = Effect;

function Effect() {
    Effect.parent.constructor.call(this)
}
Effect.inheritsFrom(VisualEntity);
Effect.prototype.className = "Effect";
Effect.prototype.createInstance = function(a) {
    var b = new Effect;
    b.init(a);
    return b
};
entityFactory.addClass(Effect);
Effect.prototype.init = function(a) {
    var b = {};
    null != a.type && (b = Account.instance.descriptionsData[a.type]);
    Effect.parent.init.call(this, $.extend(a, b));
    this.guis = []
};
Effect.prototype.createVisual = function() {};
Effect.prototype.play = function(a, b) {
    var c = this;
    if (a) c.x = a.x, c.y = a.y;
    $.each(c.params.visuals, function(d, e) {
        e.parent = c.guiParent;
        var f = guiFactory.createObject(e["class"], $.extend(e, a));
        f.clampByParentViewport();
        c.guis.push(f);
        $.each(f.animations, function(a) {
            f.playAnimation(a, c.params.lifeTime, !1, !0);
            c.setTimeout(function() {
                f.remove();
                b && b()
            }, c.params.lifeTime)
        })
    })
};
Effect.prototype.destroy = function() {
    Effect.parent.destroy.call(this);
    $.each(this.guis, function(a, b) {
        b.remove();
        delete b
    });
    this.guis = []
};
var guiFactory = new AbstractFactory;
guiFactory.createGuiFromJson = function(a, b) {
    guiFactory.createObjectsFromJson(a, function(a, d) {
        if (d.parent && "string" == typeof d.parent) {
            var e = b.getGui(d.parent);
            e || (e = $(d.parent), 0 == e.length && (e = null));
            if (e) {
                d.parent = e;
                return
            }
        }
        console.warn("For object '" + a + "' wrong parent '" + d.parent + "' is provided.")
    }, function(a, d) {
        b.addGui(d, a);
        d.name = a
    })
};

function GuiContainer() {
    this.guiEntities = null
}
GuiContainer.prototype.init = function() {
    this.guiEntities = [];
    this.guiEntitiesMap = {}
};
GuiContainer.prototype.resize = function() {
    for (var a = 0; a < this.guiEntities.length; a++) this.guiEntities[a].resize && this.guiEntities[a].resize()
};
GuiContainer.prototype.update = function(a) {
    for (var b = 0; b < this.guiEntities.length; b++) this.guiEntities[b].update && this.guiEntities[b].update(a)
};
GuiContainer.prototype.setUpdateInterval = function(a) {
    var b = this;
    this.updateIntervalTime = a;
    this.updateIntervalHandler = setInterval(function() {
        b.update(b.updateIntervalTime)
    }, this.updateIntervalTime)
};
GuiContainer.prototype.resetUpdateInterval = function() {
    if (this.updateIntervalHandler) clearInterval(this.updateIntervalHandler), this.updateIntervalTime = this.updateIntervalHandler = null
};
GuiContainer.prototype.clear = function() {
    for (var a = 0; a < this.guiEntities.length; a++) this.guiEntities[a].remove && this.guiEntities[a].remove();
    popAllElementsFromArray(this.guiEntities);
    this.guiEntitiesMap = {}
};
GuiContainer.prototype.remove = function() {
    this.clear();
    this.resetUpdateInterval()
};
GuiContainer.prototype.addGui = function(a, b) {
    assert(a, "Trying to add null pointer!");
    this.guiEntities.push(a);
    if ("string" == typeof b) a.name = b, this.guiEntitiesMap[b] = a
};
GuiContainer.prototype.removeGui = function(a) {
    popElementFromArray(a, this.guiEntities);
    this.guiEntitiesMap[a.name] && delete this.guiEntitiesMap[a.name];
    a.remove()
};
GuiContainer.prototype.getGui = function(a) {
    return this.guiEntitiesMap[a]
};

function GuiElement() {}
GuiElement.prototype.className = "GuiElement";
GuiElement.prototype.createInstance = function(a) {
    var b = new GuiElement;
    b.initialize(a);
    return b
};
guiFactory.addClass(GuiElement);
GuiElement.prototype.generateId = function() {
    return this.className + uniqueId()
};
GuiElement.prototype.generate = function(a) {
    assert(this.id, "Id not defined");
    assert(this.style, "Class for object with id = '" + this.id + "' is not defined");
    return '<div id="' + this.id + '" class="' + this.style + ' unselectable">' + a + "</div>"
};
GuiElement.prototype.create = function(a) {
    this.setParent(this.parent) || (this.setParent($("body")), console.warn("No parent was provided for object id = " + this.id));
    this.parent.jObject.append(this.generate(null == a ? "" : a));
    this.jObject = $("#" + this.id);
    assert(0 < this.jObject.length, "Object id ='" + this.id + "' was not properly created")
};
GuiElement.prototype.$ = function() {
    return this.jObject
};
GuiElement.prototype.setEnable = function(a) {
    this.enable = a
};
GuiElement.prototype.isEnabled = function() {
    return !0 == this.enable
};
GuiElement.prototype.callBindedFunction = function(a, b) {
    if (this.isEnabled()) this[b](a);
    else console.log("Button is not enabled " + this.id)
};
GuiElement.prototype.bind = function(a, b) {
    b = "string" == typeof b ? b : "click";
    a && (this[b] = a);
    if (this[b]) {
        this.unbind(b);
        var c = this;
        this.jObject.bind(Device.event(b) + ".guiElementEvents", function(a) {
            c.callBindedFunction(a, b)
        })
    }
};
GuiElement.prototype.unbind = function(a) {
    this.jObject.unbind(("string" == typeof a ? a : "") + ".guiElementEvents")
};
GuiElement.prototype.init = function() {
    this.children.init();
    this.create(this.src);
    this.pushFunction && this.bind(this.pushFunction);
    this.resize()
};
GuiElement.prototype.initialize = function(a) {
    this.params = a;
    this.parent = a.parent;
    this.id = this.generateId();
    0 < $("#" + this.id).length && console.error(" GuiElement with  id = '" + this.id + "' is already exists.");
    this.style = a.style;
    this.width = a.width;
    this.height = a.height;
    this.enable = !0;
    this.children = new GuiContainer;
    this.children.init();
    this.src = a.html ? a.html : this.src;
    a.jObject ? this.jObject = a.jObject : this.create(this.src);
    this.jObject.data("guiElement", this);
    this.pushFunction && this.bind(this.pushFunction);
    var b = this;
    a.animations && $.each(a.animations, function(a, d) {
        b.addJqueryAnimation(a, d)
    });
    this.setOffset(Screen.macro(a.offsetX), Screen.macro(a.offsetY));
    this.setPosition(Screen.macro(a.x), Screen.macro(a.y));
    this.setSize(Screen.macro(a.width), Screen.macro(a.height));
    "number" == typeof a.z && this.setZ(a.z);
    a.hide ? this.hide() : this.show();
    "number" == typeof a.opacity && this.setOpacity(a.opacity);
    this.resize()
};
GuiElement.prototype.setOffset = function(a, b) {
    this.offsetX = a;
    this.offsetY = b
};
GuiElement.prototype.calcPercentageWidth = function(a) {
    if ("string" == typeof a && -1 < a.indexOf("%")) {
        var b = this.parent.jObject.width() / Screen.widthRatio();
        assert("number" == typeof b, "Wrong parent or value for % param name='" + this.name + "'");
        a = parseFloat(a.replace("%", "")) * b / 100
    }
    return a
};
GuiElement.prototype.calcPercentageHeight = function(a) {
    if ("string" == typeof a && -1 < a.indexOf("%")) {
        var b = this.parent.jObject.height() / Screen.heightRatio();
        assert("number" == typeof b, "Wrong parent or value for % param name='" + this.name + "'");
        a = parseFloat(a.replace("%", "")) * b / 100
    }
    return a
};
GuiElement.prototype.setPosition = function(a, b) {
    this.x = a;
    this.y = b;
    var c = 0,
        d = 0;
    if ("number" == typeof this.offsetX) c = this.offsetX;
    if (null != this.offsetY) d = this.offsetY;
    a = this.calcPercentageWidth(a);
    b = this.calcPercentageHeight(b);
    this.setRealPosition(a + c, b + d)
};
GuiElement.prototype.move = function(a, b) {
    this.x += a;
    this.y += b;
    this.setPosition(this.x, this.y)
};
GuiElement.prototype.getRealPosition = function() {
    return {
        x: this.jObject.css("left").replace("px", ""),
        y: this.jObject.css("top").replace("px", "")
    }
};
GuiElement.prototype.getPosition = function() {
    return {
        x: this.x,
        y: this.y
    }
};
GuiElement.prototype.setZ = function(a) {
    this.jObject.css("z-index", a);
    this.z = a
};
GuiElement.prototype.show = function() {
    this.jObject.show();
    this.visible = !0
};
GuiElement.prototype.hide = function() {
    this.jObject.hide();
    this.visible = !1
};
GuiElement.prototype.setOpacity = function(a) {
    this.jObject.css("opacity", a)
};
GuiElement.prototype.isEventIn = function(a) {
    var a = Device.getPositionFromEvent(a),
        b = this.$().offset().left,
        c = b + this.$().width(),
        d = this.$().offset().top,
        e = d + this.$().height();
    return a.x > b && a.x < c && a.y > d && a.y < e
};
GuiElement.prototype.addJqueryAnimation = function(a, b) {
    this.jqueryAnimations = this.jqueryAnimations ? this.jqueryAnimations : {};
    this.jqueryAnimations[a] = b
};
GuiElement.prototype.playJqueryAnimation = function(a, b) {
    var c = this.jqueryAnimations[a];
    assert(c, "No animation found with name '" + a + "'");
    this.stopJqueryAnimation();
    for (var d = null, e = this, f = function(a, b) {
            a.setPosition(b.x || a.x, b.y || a.y);
            b.display && ("hide" === b.display ? a.hide() : "show" === b.display && a.show())
        }, g = 0; g < c.length; g++) {
        var i = c[g],
            j;
        if (j = i.animate) {
            var m = {};
            $.each(j.actions, function(a, b) {
                var c = b[0],
                    d = b[1],
                    e = b[2];
                if ("left" == c || "width" == c) e = "number" == typeof e ? Math.round(e * Screen.widthRatio()) : e;
                else if ("top" ==
                    c || "height" == c) e = "number" == typeof e ? Math.round(e * Screen.heightRatio()) : e;
                m[c] = d + e.toString()
            });
            e.$().animate(m, j.time)
        } else if (j = i.start) e.setPosition(null != j.x ? j.x : e.x, null != j.y ? j.y : e.y), f(e, j);
        else if (j = i["final"]) d = function() {
            e.setPosition(null != j.x ? j.x : e.x, null != j.y ? j.y : e.y);
            f(e, j)
        }
    }
    this.jqueryAnimationCallback = function() {
        d && d();
        b && b()
    };
    this.$().queue("fx", function() {
        e.jqueryAnimationCallback();
        e.jqueryAnimationCallback = null;
        e.jObject.stop(!0)
    })
};
GuiElement.prototype.stopJqueryAnimation = function() {
    if (this.$().is(":animated") && (this.$().stop(!0), this.jqueryAnimationCallback)) this.jqueryAnimationCallback(), this.jqueryAnimationCallback = null
};
GuiElement.prototype.isVisible = function() {
    return this.visible
};
GuiElement.prototype.setSize = function(a, b) {
    this.width = a;
    this.height = b;
    this.resize()
};
GuiElement.prototype.setRealSize = function(a, b) {
    var c = Screen.calcRealSize(a, b);
    this.jObject.css("width", c.x);
    this.jObject.css("height", c.y)
};
GuiElement.prototype.setRealPosition = function(a, b) {
    var c = Screen.calcRealSize(a, b);
    this.jObject.css("left", c.x);
    this.jObject.css("top", c.y)
};
GuiElement.prototype.resize = function() {
    w = this.calcPercentageWidth(this.width);
    h = this.calcPercentageHeight(this.height);
    this.setRealSize(w, h);
    this.setPosition(this.x, this.y);
    this.children.resize()
};
GuiElement.prototype.disableResize = function(a) {
    if (null == this.originalResize) this.originalResize = this.resize;
    this.resize = !1 == a ? this.originalResize : function() {}
};
GuiElement.prototype.change = function(a) {
    this.src = a;
    this.detach();
    this.create(a);
    this.pushFunction && this.bind(this.pushFunction);
    this.resize();
    this.show()
};
GuiElement.prototype.globalOffset = function() {
    var a = this.jObject.offset(),
        a = Screen.calcLogicSize(a.left, a.top);
    return {
        x: a.x,
        y: a.y
    }
};
GuiElement.prototype.setParent = function(a, b) {
    var c = null,
        d = null;
    "string" == typeof a ? d = $(a) : a && "object" == typeof a && (a.jquery ? d = a : a.jObject && 0 < a.jObject.length && (c = a));
    d && (assert(0 < d.length, "Object id ='" + this.id + "' has wrong parent: '" + a + "'"), (c = d.data("guiElement")) || (c = guiFactory.createObject("GuiElement", {
        jObject: d
    })));
    if (c) {
        d = this.parent;
        this.parent = c;
        if (d && b) {
            var e, d = d.globalOffset();
            e = c.globalOffset();
            this.move(d.x - e.x, d.y - e.y)
        }
        this.jObject && this.jObject.appendTo(c.jObject);
        return !0
    }
    console.error("Can't attach object '" +
        this.id + "' to parent that doesn't exists '" + a + "'");
    return !1
};
GuiElement.prototype.remove = function() {
    this.children.remove();
    this.jObject.remove()
};
GuiElement.prototype.detach = function() {
    this.jObject.detach()
};
GuiElement.prototype.addGui = function(a, b) {
    this.children.addGui(a, b)
};
GuiElement.prototype.removeGui = function(a) {
    this.children.removeGui(a)
};
GuiElement.prototype.getGui = function(a) {
    return this.children.getGui(a)
};
GuiElement.prototype.center = function() {
    this.jObject.css("text-align", "center")
};
GuiElement.prototype.fadeTo = function(a, b, c, d) {
    var e = this;
    if (this.fadeToTimeout) clearTimeout(this.fadeToTimeout), this.fadeToTimeout = null;
    if (!this.visible && !d) this.fadeToTimeout = setTimeout(function() {
        e.show()
    }, 1);
    this.jObject.animate({
        opacity: a
    }, b, c)
};
GuiElement.prototype.blinking = function(a, b, c, d) {
    if (a) {
        var e = b ? b : 1E3,
            f, g, i = this;
        f = function() {
            i.jObject.animate({
                opacity: c ? c : 0
            }, e, g)
        };
        g = function() {
            i.jObject.animate({
                opacity: d ? d : 1
            }, e, f)
        };
        f()
    } else this.jObject.stop()
};
GuiElement.prototype.right = function() {
    this.jObject.css("text-align", "right")
};
GuiElement.prototype.left = function() {
    this.jObject.css("text-align", "left")
};
GuiElement.prototype.setClickTransparent = function(a) {
    a ? this.jObject.css("pointer-events", "none") : this.jObject.css("pointer-events", "auto")
};
GuiElement.prototype.enableTouchEvents = function(a) {
    Device.isTouch() ? (document.body.ontouchstart = function(a) {
        a.preventDefault();
        touchStartX = touchEndX = a.touches[0].pageX;
        touchStartY = touchEndY = a.touches[0].pageY;
        return !1
    }, document.body.ontouchmove = function(a) {
        a.preventDefault();
        touchEndX = a.touches[0].pageX;
        touchEndY = a.touches[0].pageY;
        return !1
    }, document.body.ontouchend = function(b) {
        b.preventDefault();
        if (touchEndX && touchEndY) b = {}, b.pageX = touchEndX, b.pageY = touchEndY, a(b);
        return !1
    }) : this.jObject.bind("mousedown",
        a)
};
GuiElement.prototype.isPointInsideReal = function(a, b) {
    var c = this.jObject.offset(),
        d = this.jObject.width(),
        e = this.jObject.height();
    return a > c.left && a < c.left + d && b > c.top && b < c.top + e ? !0 : !1
};
GuiElement.prototype.getEventPosition = function(a) {
    var a = Device.getPositionFromEvent(a),
        b = this.jObject.offset();
    return Screen.calcLogicSize(a.x - b.left, a.y - b.top)
};
GuiDiv.prototype = new GuiElement;
GuiDiv.prototype.constructor = GuiDiv;

function GuiDiv() {
    GuiDiv.parent.constructor.call(this)
}
GuiDiv.inheritsFrom(GuiElement);
GuiDiv.prototype.className = "GuiDiv";
GuiDiv.prototype.createInstance = function(a) {
    var b = new GuiDiv;
    b.initialize(a);
    return b
};
guiFactory.addClass(GuiDiv);
GuiDiv.prototype.initialize = function(a) {
    this.backgrounds = [];
    a.image && (a.background = {
        image: a.image
    });
    this.viewRect = {};
    if (a.enhancedScene) a.width = a.width ? a.width : ENHANCED_BASE_WIDTH, a.height = a.height ? a.height : ENHANCED_BASE_HEIGHT, a.x = a.x ? a.x : -ENHANCED_BASE_MARGIN_WIDTH, a.y = a.y ? a.y : -ENHANCED_BASE_MARGIN_HEIGHT, this.enhancedScene = !0, this.setViewport(Screen.fullRect());
    else if (a.innerScene) a.width = a.width ? a.width : BASE_WIDTH, a.height = a.height ? a.height : BASE_HEIGHT, a.x = a.x ? a.x : ENHANCED_BASE_MARGIN_WIDTH,
        a.y = a.y ? a.y : ENHANCED_BASE_MARGIN_HEIGHT, this.innerScene = !0;
    GuiDiv.parent.initialize.call(this, a);
    this.applyBackground(a.background);
    a.enhancedScene && this.resize();
    assert(!this.innerScene || this.parent.enhancedScene, "inner scene should always be child to enhanced scene");
    this.innerScene && this.clampByParentViewport()
};
GuiDiv.prototype.generate = function() {
    return '<div id="' + this.id + '" class="' + this.style + ' unselectable"></div>'
};
GuiDiv.prototype.empty = function() {
    this.jObject.empty()
};
GuiDiv.prototype.applyBackground = function(a) {
    if (a instanceof Array)
        for (var b = a.length - 1, c = 0; c < a.length; c++) a[c].image = Resources.getImage(a[c].image), this.setBackgroundFromParams(a[c], b--);
    else if (a) a.image = Resources.getImage(a.image), this.setBackgroundFromParams(a, null)
};
GuiDiv.prototype.setBackground = function(a, b, c, d, e, f, g) {
    if ("begin" == g) this.backgrounds.unshift({}), g = 0;
    else if ("end" == g) g = this.backgrounds.length;
    this.backgrounds[g ? g : 0] = {
        url: a,
        width: b ? b : this.width,
        height: c ? c : this.height,
        left: d ? d : 0,
        top: e ? e : 0,
        repeat: f ? f : "no-repeat"
    };
    this.showBackground();
    this.resizeBackground()
};
GuiDiv.prototype.setBackgroundFromParams = function(a, b) {
    var c = a.x ? Screen.macro(a.x) : 0,
        d = a.y ? Screen.macro(a.y) : 0,
        e = a.width ? Screen.macro(a.width) : this.width,
        f = a.height ? Screen.macro(a.height) : this.height;
    this.setBackground(a.image, e, f, c, d, a.repeat ? a.repeat : null, b)
};
GuiDiv.prototype.setBackgroundPosition = function(a, b, c) {
    c = c ? c : 0;
    this.backgrounds[c].left = a ? a : 0;
    this.backgrounds[c].top = b ? b : 0;
    this.setRealBackgroundPosition(0, 0)
};
GuiDiv.prototype.setRealBackgroundPosition = function(a, b) {
    var c = " ";
    $.each(this.backgrounds, function(d, e) {
        if (e) {
            var f = Screen.calcRealSize(e.left + a, e.top + b);
            c += f.x + "px " + f.y + "px,"
        }
    });
    c = c.substr(0, c.length - 1);
    this.jObject.css("background-position", c)
};
GuiDiv.prototype.resizeBackground = function() {
    var a = " ",
        b = " ",
        c = this;
    $.each(this.backgrounds, function(d, e) {
        if (e) {
            var f = Screen.calcRealSize(e.left, e.top);
            a += f.x + "px " + f.y + "px,";
            w = c.calcPercentageWidth(e.width);
            h = c.calcPercentageHeight(e.height);
            f = Screen.calcRealSize(w, h);
            b += f.x + "px " + f.y + "px,"
        }
    });
    b = b.substr(0, b.length - 1);
    a = a.substr(0, a.length - 1);
    this.jObject.css("background-size", b);
    this.jObject.css("background-position", a)
};
GuiDiv.prototype.setPosition = function(a, b) {
    GuiDiv.parent.setPosition.call(this, a, b);
    this.viewport && this.clampByViewport()
};
GuiDiv.prototype.resize = function() {
    GuiDiv.parent.resize.call(this);
    this.resizeBackground();
    this.viewport && this.clampByViewport()
};
GuiDiv.prototype.dragBegin = function(a) {
    if (!this.dragStarted) {
        DragManager.setItem(this, a);
        this.dragStarted = !0;
        a = Device.getPositionFromEvent(a);
        this.dragX = a.x;
        this.dragY = a.y;
        if (this.onDragBegin) this.onDragBegin();
        this.$().addClass("dragged")
    }
};
GuiDiv.prototype.dragMove = function(a) {
    if (this.dragStarted) {
        var a = Device.getPositionFromEvent(a),
            b = a.y - this.dragY;
        this.move((a.x - this.dragX) / Screen.widthRatio(), b / Screen.heightRatio());
        this.dragX = a.x;
        this.dragY = a.y
    }
};
GuiDiv.prototype.dragEnd = function(a) {
    if (this.dragStarted) {
        if (this.onBeforeDragEnd) this.onBeforeDragEnd(a);
        if (this.onDragEnd) this.onDragEnd(a);
        this.$().removeClass("dragged");
        this.dragStarted = !1
    }
};
GuiDiv.prototype.setDragable = function(a) {
    if (this.dragable = a) {
        var b = this;
        this.$().bind(Device.event("cursorDown") + ".dragEvents", function(a) {
            b.dragBegin(a)
        })
    } else this.$().unbind(".dragEvents")
};
GuiDiv.prototype.setDragListener = function(a, b) {
    if (this.dragSlot = a) {
        if (b) this.dragListenerPriority = b;
        DragManager.addListener(this)
    } else DragManager.removeListener(this), this.$().unbind(".dragEvents")
};
GuiDiv.prototype.hideBackground = function() {
    this.jObject.css("background-image", "none")
};
GuiDiv.prototype.showBackground = function() {
    var a = " ",
        b = " ";
    $.each(this.backgrounds, function(c, d) {
        d && (a += "url('" + d.url + "'),", b += d.repeat + ",")
    });
    a = a.substr(0, a.length - 1);
    b = b.substr(0, b.length - 1);
    this.jObject.css("background-image", a);
    this.jObject.css("background-repeat", b)
};
GuiDiv.prototype.clampByParentViewport = function(a) {
    !1 == a ? (this.setViewport(null, null), this.resize()) : this.setViewport(this.parent.viewRect, !0)
};
GuiDiv.prototype.setViewport = function(a, b) {
    this.viewport = a;
    this.isParentsViewport = b;
    this.jObject && this.viewport && this.clampByViewport()
};
GuiDiv.prototype.globalOffset = function() {
    var a = this.jObject.offset(),
        a = Screen.calcLogicSize(a.left, a.top);
    return {
        x: a.x - (this.viewRect && this.viewRect.left ? this.viewRect.left : 0),
        y: a.y - (this.viewRect && this.viewRect.top ? this.viewRect.top : 0)
    }
};
GuiDiv.prototype.clampByViewport = function() {
    if (this.isVisible()) {
        var a = this.offsetX ? this.offsetX : 0,
            b = this.offsetY ? this.offsetY : 0,
            a = this.calcPercentageWidth(this.x) + a,
            b = this.calcPercentageHeight(this.y) + b,
            c = a + this.width,
            d = b + this.height,
            e = this.viewport,
            f = Math.max(a, e.left),
            g = Math.max(b, e.top),
            c = Math.min(c, e.right),
            i = Math.min(d, e.bottom),
            d = c - f,
            c = i - g;
        if (0 > d || 0 > c) {
            if (!this.viewRect.isOutside) this.jObject.hide(), this.viewRect.isOutside = !0
        } else if (this.viewRect.isOutside) this.viewRect.isOutside = !1, this.isVisible() &&
            this.jObject.show();
        var i = f,
            j = g;
        this.isParentsViewport && (i -= Math.max(e.left, 0), j -= Math.max(e.top, 0));
        this.setRealPosition(i, j);
        this.setRealSize(d, c);
        this.setRealBackgroundPosition(a - f, b - g);
        this.innerScene ? (this.viewRect.left = e.left - a, this.viewRect.top = e.top - b, this.viewRect.right = e.right - a, this.viewRect.bottom = e.bottom - b, this.viewRect.width = e.width, this.viewRect.height = e.height) : (this.viewRect.left = f - a, this.viewRect.top = g - b, this.viewRect.right = this.viewRect.left + d, this.viewRect.bottom = this.viewRect.top +
            c, this.viewRect.width = d, this.viewRect.height = c, this.viewRect.offsetX = i, this.viewRect.offsetY = j)
    }
};
GuiDiv.prototype.clampByViewportSimple = function() {
    if (this.isVisible()) {
        var a = this.viewport,
            b = this.offsetX ? this.offsetX : 0,
            a = this.offsetY ? this.offsetY : 0,
            b = this.calcPercentageWidth(this.x) + b,
            c = this.calcPercentageHeight(this.y) + a,
            a = this.viewport,
            d, e;
        this.isParentsViewport && (d = b - a.left, e = c - a.top);
        if (0 > d + this.width || d > a.width || 0 > e + this.height || e > a.height) {
            if (!this.viewRect.isOutside) this.jObject.hide(), this.viewRect.isOutside = !0
        } else if (this.viewRect.isOutside) this.jObject.show(), this.viewRect.isOutside = !1;
        this.setRealPosition(d, e)
    }
};
GuiDiv.prototype.remove = function() {
    GuiDiv.parent.remove.call(this);
    this.setDragListener(!1)
};
GuiButton.prototype = new GuiDiv;
GuiButton.prototype.constructor = GuiButton;

function GuiButton() {
    GuiButton.parent.constructor.call(this)
}
GuiButton.inheritsFrom(GuiDiv);
GuiButton.prototype.className = "GuiButton";
GuiButton.prototype.createInstance = function(a) {
    var b = new GuiButton;
    b.initialize(a);
    return b
};
guiFactory.addClass(GuiButton);
GuiButton.prototype.generate = function() {
    var a = "<div id='" + this.id + "' class='" + this.style + " unselectable'>";
    return a + "</div>"
};
GuiButton.prototype.initialize = function(a) {
    GuiButton.parent.initialize.call(this, a);
    this.clampByViewport = GuiDiv.prototype.clampByViewportSimple;
    this.jObject.css("cursor", "pointer");
    this.params = a;
    var b = this,
        c, d = {},
        e = function(a) {
            a.image = Resources.getImage(a.image);
            var e = GuiDiv.prototype.createInstance({
                parent: b,
                style: a.imageStyle ? a.imageStyle : "buttonImage",
                width: b.width,
                height: b.height,
                x: a.x ? a.x : "50%",
                y: a.y ? a.y : "50%"
            });
            b.children.addGui(e);
            var f = selectValue(a.width, d.width, b.width),
                g = selectValue(a.height,
                    d.height, b.height);
            a.scale && (f = Math.round(f * a.scale / 100), g = Math.round(g * a.scale / 100));
            var l = -Math.round(f / 2),
                k = -Math.round(g / 2);
            e.setOffset(l, k);
            a.background ? e.applyBackground(a.background) : e.setBackground(a.image, f, g, 0, 0);
            e.setSize(f, g);
            e.hide();
            var o;
            a.label && (c = c ? c : a.label, l = 1, "number" == typeof a.scale && (l = a.scale / 100), f = selectValue(a.label.width, c.width, b.width) * l, g = selectValue(a.label.height, c.height, b.height) * l, fontSize = selectValue(a.label.fontSize, c.fontSize) * l, l = selectValue(a.label.offsetX,
                c.offsetX, -Math.round(f / 2)), k = selectValue(a.label.offsetY, c.offsetY, -Math.round(g / 2)), f = Math.round(f), g = Math.round(g), o = guiFactory.createObject("GuiLabel", {
                parent: e,
                style: selectValue(a.label.style, c.style),
                width: f,
                height: g,
                text: selectValue(a.label.text, c.text),
                fontSize: fontSize,
                align: selectValue(a.label.align, c.align, "center"),
                verticalAlign: selectValue(a.label.align, c.align, "middle"),
                x: selectValue(a.label.x, c.x, "50%"),
                y: selectValue(a.label.y, c.y, "50%"),
                offsetX: a.label.offsetX ? l + a.label.offsetX : l,
                offsetY: a.label.offsetY ? k + a.label.offsetY : k
            }), b.children.addGui(o), o.hide());
            return {
                image: e,
                label: o,
                callback: function() {
                    if (b.currentStateParams !== a) {
                        b.currentStateParams = a;
                        var c = b.currentImage,
                            d = b.currentLabel;
                        b.currentImage = e;
                        b.currentImage && b.currentImage.show();
                        b.currentLabel = o;
                        b.currentLabel && b.currentLabel.show();
                        d && d.hide();
                        c && c.hide()
                    }
                }
            }
        };
    if (a.normal) {
        var d = a.normal,
            f = e(a.normal);
        b.imageNormal = f.image;
        b.normalState = function() {
            f.callback.call(b);
            b.clickAllowed = !1
        };
        b.normalState.call(b)
    }
    if (Device.isTouch()) {
        if (a.hover) g =
            e(a.hover), b.imageActive = g.image, b.activeState = g.callback
    } else {
        if (a.hover) {
            var g = e(a.hover);
            b.imageHover = g.image;
            b.hoverState = g.callback
        }
        if (a.active) g = e(a.active), b.imageActive = g.image, b.activeState = g.callback;
        else if (a.hover) b.activeState = b.normalState
    }
};
GuiButton.prototype.bind = function(a) {
    if (this.activeState) {
        var b = this;
        this.clickAllowed = this.backedToNormal = !1;
        this.unbind();
        this.hoverState && !Device.isTouch() && (this.jObject.bind("mouseenter.guiElementEvents", this.hoverState), this.jObject.bind("mouseleave.guiElementEvents", this.normalState));
        if (a) this.pushFunction = a;
        var c = this.hoverState ? this.hoverState : this.normalState,
            a = function(a) {
                if (b.isEnabled()) {
                    if (b.clickAllowed) b.pushFunction && b.pushFunction(a), b.clickAllowed = !1;
                    c.call(b)
                }
            };
        this.activeState &&
            (Device.isTouch() ? (this.jObject.bind("touchstart", function() {
                b.activeState.call(b);
                b.clickAllowed = !0;
                b.backedToNormal = !1
            }), this.jObject.bind("touchend", a), this.jObject.bind("touchmove", function(a) {
                if (!b.backedToNormal && (a.preventDefault(), a = a.originalEvent.touches[0] || a.originalEvent.changedTouches[0], $(document.elementFromPoint(a.pageX, a.pageY)), !b.isPointInsideReal(a.pageX, a.pageY))) c.call(b), b.backedToNormal = !0
            })) : (this.jObject.bind("mousedown", function() {
                    b.activeState.call(b);
                    b.clickAllowed = !0
                }),
                this.jObject.bind("mouseup", a)))
    } else GuiButton.parent.bind.call(this, a)
};
GuiButton.prototype.changeButtonBackgrounds = function(a, b) {
    this.imageNormal && this.imageNormal.setBackgroundFromParams(a, b);
    this.imageHover && this.imageHover.setBackgroundFromParams(a, b);
    this.imageActive && this.imageActive.setBackgroundFromParams(a, b)
};
GuiButton.prototype.highlight = function(a) {
    this.params.highlight ? (a ? (this.img = this.params.background.image, this.setBackground(this.params.highlight.image), this.backgroundShown = a) : this.setBackground(this.img), this.showBackground()) : (this.backgroundShown = a) ? this.showBackground() : this.hideBackground()
};
GuiButton.prototype.resize = function() {
    GuiButton.parent.resize.call(this)
};
GuiLabel.prototype = new GuiElement;
GuiLabel.prototype.constructor = GuiLabel;

function GuiLabel() {
    GuiLabel.parent.constructor.call(this)
}
GuiLabel.inheritsFrom(GuiElement);
GuiLabel.prototype.className = "GuiLabel";
GuiLabel.prototype.createInstance = function(a) {
    var b = new GuiLabel;
    b.initialize(a);
    return b
};
guiFactory.addClass(GuiLabel);
GuiLabel.prototype.initialize = function(a) {
    GuiLabel.parent.initialize.call(this, a);
    this.fontSize = a.fontSize ? a.fontSize : 20;
    this.change(a.text);
    a.align && this.align(a.align, a.verticalAlign);
    a.color && this.setColor(a.color)
};
GuiLabel.prototype.generate = function(a) {
    this.rowId = this.id + "_row";
    this.cellId = this.id + "_cell";
    return "<div id='" + this.id + "' class='" + this.style + " unselectable'><div id='" + this.rowId + "' style='display:table-row;cursor: default; '><div id='" + this.cellId + "' style='display:table-cell;cursor: default;'>" + a + "</div></div></div>"
};
GuiLabel.prototype.create = function(a) {
    GuiDiv.parent.create.call(this, a);
    $("#" + this.cellId).css("font-size", Math.floor(this.fontSize * Math.min(Screen.widthRatio(), Screen.heightRatio())) + "px")
};
GuiLabel.prototype.change = function(a) {
    $("#" + this.cellId).text(a);
    $("#" + this.cellId).css("font-size", Math.floor(this.fontSize * Math.min(Screen.widthRatio(), Screen.heightRatio())) + "px")
};
GuiLabel.prototype.append = function(a) {
    $("#" + this.cellId).append(a);
    this.resize()
};
GuiLabel.prototype.empty = function() {
    $("#" + this.cellId).empty();
    this.resize()
};
GuiLabel.prototype.setPosition = function(a, b) {
    GuiLabel.parent.setPosition.call(this, a, b)
};
GuiLabel.prototype.setRealSize = function(a, b) {
    GuiLabel.parent.setRealSize.call(this, a, b);
    var c = Screen.calcRealSize(a, b);
    $("#" + this.rowId).css("width", c.x);
    $("#" + this.rowId).css("height", c.y);
    $("#" + this.cellId).css("width", c.x);
    $("#" + this.cellId).css("height", c.y);
    $("#" + this.cellId).css("font-size", Math.floor(this.fontSize * Math.min(Screen.widthRatio(), Screen.heightRatio())) + "px")
};
GuiLabel.prototype.resize = function() {
    GuiLabel.parent.resize.call(this)
};
GuiLabel.prototype.setColor = function(a) {
    this.jObject.css("color", a)
};
GuiLabel.prototype.align = function(a, b) {
    a && $("#" + this.cellId).css("text-align", a);
    b && $("#" + this.cellId).css("vertical-align", b)
};
GuiScroll.prototype = new GuiElement;
GuiScroll.prototype.constructor = GuiScroll;

function GuiScroll() {
    GuiScroll.parent.constructor.call(this)
}
GuiScroll.inheritsFrom(GuiElement);
GuiScroll.prototype.className = "GuiScroll";
GuiScroll.prototype.generate = function() {
    this.listId = this.id + "_list";
    this.listId = this.scrollId = this.id + "_scroll";
    return "<div id='" + this.id + "' class='" + this.style + " scrollerWrapper unselectable'><div id='" + this.scrollId + "' class='scrollerBackground'></div></div>"
};
GuiScroll.prototype.createInstance = function(a) {
    var b = new GuiScroll(a.parent, a.style, a.width, a.height);
    b.initialize(a);
    return b
};
guiFactory.addClass(GuiScroll);
GuiScroll.prototype.initialize = function(a) {
    GuiScroll.parent.initialize.call(this, a);
    this.createScroll()
};
GuiScroll.prototype.createScroll = function() {
    var a = this;
    this.hScroll = null != this.params.hScroll ? this.params.hScroll : !0;
    this.vScroll = null != this.params.vScroll ? this.params.vScroll : !0;
    this.scroll = new iScroll(this.id, {
        hScroll: this.hScroll,
        vScroll: this.vScroll,
        useTransform: !0,
        onBeforeScrollStart: function(a) {
            for (var c = a.target; 1 != c.nodeType;) c = c.parentNode;
            a.preventDefault()
        },
        onScrollStart: function(b) {
            var c = b.target;
            for (a.candidateToClick = null;;)
                if (1 != c.nodeType || "" == c.id) c = c.parentNode;
                else {
                    var d = $("#" +
                        c.id);
                    if (0 < d.length && (d = d.data("guiElement")))
                        if (d.listItemClickCallback) {
                            a.candidateToClick = d;
                            break
                        } else if (d.listItemMouseDownCallback) {
                        d.listItemMouseDownCallback(b);
                        break
                    }
                    c = c.parentNode;
                    if (!c || c.id == a.listId || c.id == a.scrollId || c.id == a.id) break
                }
        },
        onScrollMove: function() {
            a.candidateToClick = null
        },
        onBeforeScrollEnd: function() {
            if (a.candidateToClick) a.candidateToClick.listItemClickCallback(), a.candidateToClick = null
        }
    })
};
GuiScroll.prototype.refresh = function() {
    this.scroll.scrollTo(0, 0, 0, !1);
    this.scroll.refresh()
};
GuiScroll.prototype.addListItem = function(a) {
    a.setParent("#" + this.listId);
    a.unbind();
    this.children.addGui(a);
    this.resize()
};
GuiScroll.prototype.removeListItem = function(a) {
    this.children.removeGui(a);
    this.resize()
};
GuiScroll.prototype.clearList = function() {
    $("#" + this.listId).empty();
    this.children.clear()
};
GuiScroll.prototype.remove = function() {
    this.scroll.destroy();
    delete this.scroll;
    GuiScroll.parent.remove.call(this)
};
GuiScroll.prototype.resizeScroll = function() {
    if (this.hScroll && !this.vScroll) {
        for (var a = 0, b = 0; b < this.children.guiEntities.length; b++) a += this.children.guiEntities[b].$().outerWidth(!0);
        $("#" + this.listId).width(a)
    }
};
GuiScroll.prototype.resize = function() {
    GuiScroll.parent.resize.call(this);
    this.resizeScroll();
    this.scroll && this.scroll.refresh()
};
var GUISPRITE_HACK_ON = !1;
GuiSprite.prototype = new GuiDiv;
GuiSprite.prototype.constructor = GuiSprite;

function GuiSprite() {
    GuiSprite.parent.constructor.call(this)
}
GuiSprite.inheritsFrom(GuiDiv);
GuiSprite.prototype.className = "GuiSprite";
GuiSprite.prototype.createInstance = function(a) {
    var b = new GuiSprite;
    b.initialize(a);
    return b
};
guiFactory.addClass(GuiSprite);
GuiSprite.prototype.initialize = function(a) {
    GuiSprite.parent.initialize.call(this, a);
    this.totalWidth = a.totalImageWidth;
    this.totalHeight = a.totalImageHeight;
    this.totalSrc = a.totalImage;
    if (GUISPRITE_HACK_ON) this.totalSrc = Resources.getImage(a.totalImage);
    this.totalTile = null == a.totalTile ? {
        x: 0,
        y: 0
    } : a.totalTile;
    this.flipped = !1;
    this.setBackground(this.totalSrc);
    this.currentAnimation = null;
    this.animations = {};
    var b = this;
    a.spriteAnimations && $.each(a.spriteAnimations, function(a, d) {
        b.addSpriteAnimation(a, d)
    });
    this.jObject.css("background-position",
        Math.floor(Screen.widthRatio() * this.totalTile.x * this.width) + "px " + Math.floor(Screen.heightRatio() * this.height * this.totalTile.y) + "px")
};
GuiSprite.prototype.addSpriteAnimation = function(a, b) {
    this.animations[a] = {
        frames: b.frames,
        row: b.row,
        frameDuration: b.frameDuration
    }
};
GuiSprite.prototype.addAnimation = function(a, b, c, d) {
    this.animations[a] = {
        frames: b,
        row: c,
        frameDuration: d
    }
};
GuiSprite.prototype.update = function(a) {
    if (null != this.currentAnimation) {
        var b = (new Date).getTime(),
            a = b - this.lastUpdateTime;
        this.lastUpdateTime = b;
        for (this.currentFrameTime += a; this.currentFrameTime >= this.currentFrameLength;) this.updateAnimation(), this.currentFrameTime -= this.currentFrameLength
    }
};
GuiSprite.prototype.updateAnimation = function() {
    if (null != this.currentAnimation) {
        if (this.currentFrame >= this.animations[this.currentAnimation].frames.length && (this.currentFrame = 0, !this.looped)) {
            this.stopAnimation();
            return
        }
        var a = Math.round(this.totalWidth / this.width),
            b = this.animations[this.currentAnimation].frames[this.currentFrame],
            c = b % a,
            a = this.animations[this.currentAnimation].row + (b - c) / a,
            b = c;
        this.jObject.css("background-position", Math.round(-Screen.widthRatio() * b * this.width) + "px " + Math.round(-Screen.heightRatio() *
            a * this.height) + "px ");
        this.frame = b;
        this.row = a;
        this.setRealBackgroundPosition();
        this.currentFrame++
    }
};
GuiSprite.prototype.stopAnimation = function(a) {
    this.jObject.stop();
    clearInterval(this.updateAnimationCallback);
    this.currentAnimation = this.updateAnimationCallback = null;
    if (!a && this.animationEndCallback) a = this.animationEndCallback, this.animationEndCallback = null, a.call(this)
};
GuiSprite.prototype.remove = function() {
    GuiSprite.parent.remove.call(this);
    clearInterval(this.updateAnimationCallback);
    this.updateAnimationCallback = null
};
GuiSprite.prototype.setAnimationEndCallback = function(a) {
    this.animationEndCallback = a
};
GuiSprite.prototype.playAnimation = function(a, b, c, d) {
    var e = this.animations[a];
    assert(e, "No such animation: " + a);
    this.stopAnimation(!0);
    this.lastAnimation = this.currentAnimation = a;
    var f = this;
    this.currentFrameTime = this.currentFrame = 0;
    this.lastUpdateTime = (new Date).getTime();
    this.currentFrameLength = b ? b / e.frames.length : this.animations[this.currentAnimation].frameDuration;
    this.looped = c;
    if (d) this.updateAnimationCallback = setInterval(function() {
        f.updateAnimation()
    }, this.currentFrameLength);
    this.updateAnimation()
};
GuiSprite.prototype.isPlayingAnimation = function(a) {
    return this.currentAnimation == a
};
GuiSprite.prototype.animate = function(a, b) {
    var c = this;
    this.jObject.animate({
        left: a.x * Screen.widthRatio() + "px",
        top: a.y * Screen.heightRatio() + "px"
    }, {
        duration: b,
        easing: "linear",
        complete: function() {
            c.stopAnimation()
        }
    })
};
GuiSprite.prototype.flip = function(a) {
    this.flipped = a;
    this.transform()
};
GuiSprite.prototype.transform = function(a) {
    if (a) {
        if (null != a.matrix) this.matrix = a.matrix;
        if (null != a.angle) this.angle = a.angle;
        if (null != a.scale) this.scale = a.scale;
        if (null != a.translate) this.translate = a.translate
    }
    var a = selectValue(this.scale, 1),
        b;
    b = a * (this.flipped ? -1 : 1);
    cssTransform(this.jObject, this.matrix, this.angle, b, a, this.translate)
};
GuiSprite.prototype.rotate = function(a) {
    this.angle = a;
    this.transform()
};
GuiSprite.prototype.setTransformOrigin = function(a) {
    this.transformOrigin = a;
    var b = this.jObject;
    b.css("-webkit-transform-origin", a);
    b.css("transform-origin", a);
    b.css("-moz-transform-origin", a);
    b.css("-o-transform-origin", a);
    b.css("transform-origin", a);
    b.css("msTransform-origin", a)
};
GuiSprite.prototype.setPosition = function(a, b) {
    this.x = a;
    this.y = b;
    this.setRealPosition(a, b)
};
GuiSprite.prototype.setRealPosition = function(a, b) {
    this.transform({
        translate: {
            x: Math.round(a * Screen.widthRatio()),
            y: Math.round(b * Screen.heightRatio())
        }
    })
};
GuiSprite.prototype.setTransform = function(a, b) {
    this.angle = b;
    this.matrix = a;
    this.transform()
};
GuiSprite.prototype.resize = function() {
    GuiSprite.parent.resize.call(this);
    this.setRealBackgroundPosition()
};
GuiSprite.prototype.setRealBackgroundPosition = function(a, b) {
    var c = selectValue(this.frame, 0),
        d = selectValue(this.row, 0);
    this.jObject.css("background-position", Math.round(Screen.widthRatio() * (-c * this.width + a)) + "px " + Math.round(Screen.heightRatio() * (d * this.height + b)) + "px ")
};
GuiSprite.prototype.resizeBackground = function() {
    var a = Screen.calcRealSize(this.totalWidth, this.totalHeight);
    this.jObject.css("background-size", a.x + "px " + a.y + "px")
};
GuiScene.prototype = new GuiDiv;
GuiScene.prototype.constructor = GuiScene;

function GuiScene() {
    GuiScene.parent.constructor.call(this)
}
GuiScene.inheritsFrom(GuiDiv);
GuiScene.prototype.className = "GuiScene";
GuiScene.prototype.createInstance = function(a) {
    var b = new GuiScene(a.parent, a.style, a.width, a.height, null);
    b.initialize(a);
    return b
};
guiFactory.addClass(GuiScene);
GuiDialog.prototype = new GuiDiv;
GuiDialog.prototype.constructor = GuiDialog;

function GuiDialog() {
    GuiDialog.parent.constructor.call(this)
}
GuiDialog.inheritsFrom(GuiDiv);
GuiDialog.prototype.className = "GuiDialog";
GuiDialog.prototype.createInstance = function(a) {
    var b = new GuiDialog(a.parent, a.style, a.width, a.height, null);
    b.initialize(a);
    return b
};
guiFactory.addClass(GuiDialog);
GuiDialog.prototype.resize = function() {
    GuiDialog.parent.resize.call(this);
    this.children.resize()
};
GuiDialog.prototype.initialize = function(a) {
    GuiDialog.parent.initialize.call(this, a);
    this.maskDiv = null;
    this.visible = !1;
    this.maskDiv = guiFactory.createObject("GuiDiv", {
        parent: "body",
        style: "mask",
        width: "FULL_WIDTH",
        height: "FULL_HEIGHT",
        x: 0,
        y: 0
    });
    this.maskDiv.setBackground("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=");
    this.maskDiv.bind(function(a) {
        a.preventDefault();
        return !1
    });
    this.children.addGui(this.maskDiv);
    this.maskDiv.setZ(130);
    this.setZ(131);
    this.maskDiv.hide();
    this.resize()
};
GuiDialog.prototype.init = function() {
    GuiDialog.parent.init.call(this)
};
GuiDialog.prototype.show = function() {
    GuiDialog.parent.show.call(this);
    this.maskDiv && this.maskDiv.show();
    this.visible = !0
};
GuiDialog.prototype.hide = function() {
    GuiDialog.parent.hide.call(this);
    this.maskDiv && this.maskDiv.hide();
    this.visible = !1
};
GuiDialog.prototype.isVisible = function() {
    return this.visible
};
var SCORE = null,
    GUI_SPRITE_IMAGES_FROM_RESOURCES = !0,
    GUISPRITE_HACK_ON = !0;
$(document).ready(function() {
    (new CannonsAndSoldiersAccount).init();
    Device.init();
    Resources.init();
    try {
        SCORE = JSON.parse(Device.getStorageItem("scores", {})), $.each(SCORE, function() {})
    } catch (a) {
        SCORE = {}
    }
    Resources.addResolution("low", "images/low/");
    Resources.addResolution("normal", "images/", !0);
    if (Device.isSlow() && (Resources.setResolution("low"), Device.isAppleMobile())) Sound.TURNED_OFF_BY_DEFAULT = !0;
    Screen.init(Account.instance, !0);
    Account.instance.readGlobalUpdate(Account.instance.states.MenuState01)
});
CannonsAndSoldiersAccount.prototype = new Account;
CannonsAndSoldiersAccount.prototype.constructor = CannonsAndSoldiersAccount;

function CannonsAndSoldiersAccount() {
    CannonsAndSoldiersAccount.parent.constructor.call(this)
}
CannonsAndSoldiersAccount.inheritsFrom(Account);
CannonsAndSoldiersAccount.prototype.className = "CannonsAndSoldiersAccount";
CannonsAndSoldiersAccount.prototype.init = function() {
    CannonsAndSoldiersAccount.parent.init.call(this);
    this.states = {};
    this.states.MenuState01 = {
        MenuState01: {
            "class": MenuState.prototype.className,
            parent: "Account01",
            children: {}
        }
    };
    this.states.LevelMenuState01 = {
        LevelMenuState01: {
            "class": LevelMenuState.prototype.className,
            parent: "Account01",
            children: {}
        }
    };
    this.states.GameState01 = {
        GameState01: {
            "class": GameState.prototype.className,
            parent: "Account01",
            scene: "Scene01",
            children: {}
        }
    };
    Account.instance = this
};
CannonsAndSoldiersAccount.prototype.switchState = function(a, b, c, d) {
    var e = this,
        f = function() {
            var d = {};
            $.each(Account.instance.states, function(f) {
                if (f === a) d = Account.instance.states[f], d[f].parent = c, d[b] = {
                    destroy: !0
                }, e.readGlobalUpdate(d)
            })
        };
    d ? f() : this.backgroundState.fadeIn(LEVEL_FADE_TIME, "white", f)
};
var LVL_MENU_GUI_JSON = "resources/ui/LevelMenu.json",
    LEVEL_DESCRIPTION = "resources/levels/",
    REPLY = !1,
    LVL_INDEX = 0,
    LAST_LEVEL = 27;
LevelMenuState.prototype = new BaseState;
LevelMenuState.prototype.constructor = LevelMenuState;

function LevelMenuState() {
    this.preloadJson(LVL_MENU_GUI_JSON);
    LevelMenuState.parent.constructor.call(this)
}
LevelMenuState.inheritsFrom(BaseState);
LevelMenuState.prototype.className = "LevelMenuState";
LevelMenuState.prototype.createInstance = function(a) {
    var b = new LevelMenuState;
    b.activate(a);
    return b
};
entityFactory.addClass(LevelMenuState);
LevelMenuState.prototype.jsonPreloadComplete = function() {
    LevelMenuState.parent.jsonPreloadComplete.call(this)
};
LevelMenuState.prototype.init = function(a) {
    LevelMenuState.parent.init.call(this, a);
    var b = this;
    if (REPLY) Account.instance.switchState("GameState01", b.id, b.parent.id, !0);
    else {
        guiFactory.createGuiFromJson(this.resources.json[LVL_MENU_GUI_JSON], this);
        for (var c = [], a = function(a, d) {
                var e = 0 < SCORE["level_" + (c.length - 1)] || 0 == c.length,
                    f = guiFactory.createObject("GuiButton", {
                        parent: b.getGui("menuContainer"),
                        normal: {
                            image: e ? "FinalArt/Menu/LevelSelect/NumberCell001.png" : "FinalArt/Menu/LevelSelect/Level_Locked.png",
                            label: {
                                style: "gameButton victoriana-normal",
                                text: e ? c.length + 1 : "",
                                fontSize: 30,
                                color: "#01B5FF",
                                y: "55%",
                                x: "45%"
                            }
                        },
                        hover: {
                            image: e ? "FinalArt/Menu/LevelSelect/NumberCell001.png" : "FinalArt/Menu/LevelSelect/Level_Locked.png",
                            scale: 115,
                            label: {
                                style: "gameButton victoriana-normal",
                                text: e ? c.length + 1 : "",
                                fontSize: 30,
                                color: "#01B5FF"
                            }
                        },
                        style: "gameButton",
                        width: 93,
                        height: 82,
                        x: 109 * d + 30,
                        y: 88 * a + 70,
                        i: a + d * a,
                        unlocked: e ? !0 : !1
                    });
                b.getGui("menuContainer").addGui(f, c.length);
                f.bind(function() {
                    f.params.unlocked && (LVL_INDEX =
                        c.indexOf(f), LEVEL_DESCRIPTION = "resources/levels/" + LVL_INDEX + ".json", Sound.play("change"), Account.instance.switchState("GameState01", b.id, b.parent.id))
                });
                c.push(f)
            }, d = 0; 4 > d; d++)
            for (var e = 0; 7 > e; e++) a(d, e);
        this.getGui("menu").bind(function() {
            Sound.play("change");
            Account.instance.switchState("MenuState01", b.id, b.parent.id)
        });
        var f = 0;
        $.each(SCORE, function(a, b) {
            f += 1 * b
        });
        this.getGui("score").children.guiEntities[1].change(f);
        Loader.loadingMessageShowed() ? Account.instance.backgroundState.fadeIn(REPLY ? 0 :
            LEVEL_FADE_TIME, "white",
            function() {
                Account.instance.backgroundState.fadeOut(REPLY ? 0 : LEVEL_FADE_TIME);
                Loader.hideLoadingMessage();
                $(window).trigger("resize")
            }) : Account.instance.backgroundState.fadeOut(REPLY ? 0 : LEVEL_FADE_TIME, function() {
            $(window).trigger("resize")
        })
    }
};
var MENU_GUI_JSON = "resources/ui/mainMenu.json",
    CREDITS_JSON = "resources/ui/credits.json",
    DESCRIPTIONS_JSON = "resources/objectsDescription.json";
MenuState.prototype = new BaseState;
MenuState.prototype.constructor = MenuState;

function MenuState() {
    this.preloadJson(MENU_GUI_JSON);
    this.preloadJson(CREDITS_JSON);
    this.preloadJson(DESCRIPTIONS_JSON);
    Account.instance.mediaPreloaded || (Resources.preloadFonts(["victoriana-normal"]), Sound.init("sounds/total", !0, "js/"), Sound.add("click", "sounds/click", 2, 0.5), Sound.add("change", "sounds/lucky", 4, 0.5), Sound.add("level_win", "sounds/select", 6, 2), Sound.add("level_fail", "sounds/music", 11, 5), Sound.add("shot", "sounds/music", 20, 2), Sound.add("explosion", "sounds/music", 30, 2), Sound.add("wood",
        "sounds/music", 20, 2), Sound.add("stone", "sounds/music", 20, 2), Sound.add("metal", "sounds/music", 37, 0.8), Sound.add("bubble", "sounds/music", 35, 0.2));
    MenuState.parent.constructor.call(this)
}
MenuState.inheritsFrom(BaseState);
MenuState.prototype.className = "MenuState";
MenuState.prototype.createInstance = function(a) {
    var b = new MenuState;
    b.activate(a);
    return b
};
entityFactory.addClass(MenuState);
MenuState.prototype.jsonPreloadComplete = function() {
    if (!Account.instance.mediaPreloaded) {
        var a = "FinalArt/Backgrounds/background_new.png,FinalArt/Tutorial/enemy.png,FinalArt/Tutorial/captive.png,FinalArt/Menu/LevelSelect/Balls.png,FinalArt/Menu/LevelSelect/FailureShit.png,FinalArt/Menu/LevelSelect/Level_Locked.png,FinalArt/Menu/LevelSelect/NumberCell001.png,FinalArt/Menu/LevelSelect/ScoreCell001.png,FinalArt/Menu/LevelSelect/Sheet2.png,FinalArt/Menu/LevelSelect/Sheet3.png,FinalArt/Menu/LevelSelect/VictoryShit.png,FinalArt/Menu/Main/Button1.png,FinalArt/Menu/Main/Button2.png,FinalArt/Menu/Main/circle.png,FinalArt/Menu/Main/FAQ.png,FinalArt/Menu/Main/elitecoder.png,FinalArt/Menu/Main/Sheet1.png,FinalArt/Menu/Main/SoundOff.png,FinalArt/Menu/Main/SoundOn.png,FinalArt/Menu/Main/title.png,FinalArt/Menu/Main/zastavka.jpg,FinalArt/Menu/Pause/forward_L.png,FinalArt/Menu/Pause/forward_R.png,FinalArt/Menu/Pause/ok.png,FinalArt/Menu/Pause/Pause1.png,FinalArt/Menu/Pause/return_L.png,FinalArt/Menu/Pause/return_R.png,FinalArt/Menu/Pause/select_level_L.png,FinalArt/Menu/Pause/select_level_R.png,FinalArt/Menu/Pause/shadow.png,FinalArt/Menu/Pause/shadowed.png,FinalArt/Menu/Tutorial/tutorial.png".split(",");
        $.each(this.resources.json[DESCRIPTIONS_JSON],
            function(b, c) {
                $.each(c.visuals, function(b, c) {
                    c.totalImage && a.push(c.totalImage)
                })
            });
        Loader.updateLoadingState(Loader.currentLoadingState() + 10);
        var b = Loader.currentLoadingState(),
            c = 100 - b;
        this.preloadMedia(a, function(a) {
            Loader.updateLoadingState(b + Math.round(c * (a.loaded / a.total)))
        });
        Account.instance.mediaPreloaded = !0
    }
    MenuState.parent.jsonPreloadComplete.call(this)
};
MenuState.prototype.init = function(a) {
    MenuState.parent.init.call(this, a);
    guiFactory.createGuiFromJson(this.resources.json[MENU_GUI_JSON], this);
    var b = this.getGui("enhancedScene");
    guiFactory.createGuiFromJson(this.resources.json[CREDITS_JSON], this);
    Sound.isOn() ? (this.getGui("soundOff").hide(), this.getGui("soundOn").show()) : (this.getGui("soundOn").hide(), this.getGui("soundOff").show());
    var c = this,
        a = this.getGui("play");
    a.bind(function() {
        Sound.play("change");
        Account.instance.switchState("LevelMenuState01",
            c.id, c.parent.id)
    });
    a = this.getGui("highscores");
    a.bind(function() {});
    a = this.getGui("soundOn");
    a.bind(function() {
        Sound.turnOn(!1);
        c.getGui("soundOn").hide();
        c.getGui("soundOff").show()
    });
    a = this.getGui("soundOff");
    a.bind(function() {
        Sound.turnOn(!0);
        Sound.play("click");
        c.getGui("soundOff").hide();
        c.getGui("soundOn").show();
        Sound.play("click")
    });
    var d = this.getGui("creditsDialog");
    this.getGui("help").bind(function(a) {
        d.show();
        c.scroll.refresh();
        a.preventDefault();
        Sound.play("click")
    });
    this.getGui("resume").bind(function() {
        Sound.play("click");
        d.hide()
    });
    this.scroll = this.getGui("scroll");
    var a = this.getGui("berrry"),
        e = this.getGui("text");
    e.append("<span id='creditsLabel'><br><br><br><br><b><big>Elite Coder ");
    e.align("center");
    this.scroll.addListItem(a);
    this.scroll.addListItem(e);
    Loader.loadingMessageShowed() ?
        Account.instance.backgroundState.fadeIn(LEVEL_FADE_TIME, "white", function() {
            b.show();
            c.resize();
            Account.instance.backgroundState.fadeOut(LEVEL_FADE_TIME);
            Loader.hideLoadingMessage();
            $(window).trigger("resize")
        }) : (b.show(), c.resize(), Account.instance.backgroundState.fadeOut(LEVEL_FADE_TIME, function() {
            $(window).trigger("resize")
        }))
};
var ANIMATION_SPEED = 400,
    MIN_PWR_RATIO = 0.1,
    STD_BALLS_COUNT = 3,
    POWER_RATING = 2E4;
Cannon.prototype = new VisualEntity;
Cannon.prototype.constructor = Cannon;

function Cannon() {
    Cannon.parent.constructor.call(this)
}
Cannon.inheritsFrom(VisualEntity);
Cannon.prototype.className = "Cannon";
Cannon.prototype.createInstance = function(a) {
    var b = new Cannon;
    b.init(a);
    return b
};
entityFactory.addClass(Cannon);
Cannon.prototype.init = function(a) {
    Cannon.parent.init.call(this, a);
    a.y -= 12;
    this.direction = {
        x: 1,
        y: 0
    };
    this.initialDirection = {
        x: 1,
        y: 0
    };
    this.powerRatio = 0;
    this.balls = a.balls ? a.balls : STD_BALLS_COUNT;
    Account.instance.getEntity("GameState01").getGui("ballsInfo").children.guiEntities[1].change(this.balls)
};
Cannon.prototype.createVisual = function() {
    var a = this;
    $.each(Account.instance.descriptionsData[this.params.type].visuals, function(b, c) {
        var d = guiFactory.createObject(c["class"], $.extend({
            parent: a.mainGui ? a.mainGui : a.guiParent,
            style: "sprite",
            x: a.params.x,
            y: a.params.y
        }, c));
        d.setZ(d.params.z);
        if (!a.mainGui) a.mainGui = d;
        !1 == c.visible && d.hide();
        var e = {};
        e.visual = d;
        a.addVisual(b, e)
    });
    this.mainGui.x += 0;
    this.mainGui.y += 12;
    this.mainGui.resize();
    this.cannonier = this.getVisual("cannonier");
    this.cannonier.playAnimation("getReady",
        0, !1, !0)
};
Cannon.prototype.rotateGuiElement = function(a, b, c) {
    var d = (1 * -a.x + c.x) * Screen.widthRatio(),
        c = (1 * -a.y + c.y) * Screen.heightRatio(),
        e = new Transform,
        f = new Transform;
    e.translate(d, c);
    f.rotateDegrees(b);
    e.multiply(f);
    f.translate(-d, -c);
    e.multiply(f);
    a.setTransform(e.m, 0)
};
Cannon.prototype.setTarget = function(a) {
    var b = this.getVisual("barrel");
    if (!(b.currentAnimation && null != b.currentAnimation)) {
        var c = this.getVisual("powerLine"),
            d = b.x + this.mainGui.x + 20,
            e = b.y + this.mainGui.y + 20;
        this.direction.x = Math.max(a.x, d) - d;
        this.direction.y = Math.min(a.y, e) - e;
        a = -calculateAngle(this.direction, this.initialDirection) / 2;
        this.rotateGuiElement(b, a, {
            x: 45,
            y: 50
        });
        this.rotateGuiElement(c, a, {
            x: 143 + 0.5 * (c.params.totalImageWidth - c.width),
            y: 37
        })
    }
};
Cannon.prototype.setPower = function(a) {
    var b = this.getVisual("barrel");
    if (!(b.currentAnimation && null != b.currentAnimation)) {
        var c = this.getVisual("powerLine");
        if (!(a.x < this.mainGui.x + 65)) this.powerRatio = Math.min((distance({
            x: b.x + this.mainGui.x + 20,
            y: b.y + this.mainGui.y + 20
        }, a) - 60) / 300, 1), this.powerRatio = this.powerRatio > MIN_PWR_RATIO ? this.powerRatio : 0, !c.visible && this.powerRatio > MIN_PWR_RATIO && c.show(), c.visible && this.powerRatio < MIN_PWR_RATIO && c.hide(), c.width = this.powerRatio * c.params.width, c.resize()
    }
};
Cannon.prototype.bind = function(a, b) {
    $.each(this.visuals, function(c, d) {
        d.visual && d.visual.jObject.bind(a, b)
    })
};
Cannon.prototype.createBall = function(a, b) {
    this.ball && Account.instance.removeEntity(this.ball.id);
    if (this.balls) {
        var c = this.parent;
        c.initChildren({
            children: {
                CannonBall: {
                    "class": "CannonBall",
                    type: "CannonBall_1",
                    parent: "Scene01",
                    x: a,
                    y: b
                }
            }
        });
        (this.ball = Account.instance.getEntity("CannonBall")) && this.ball.attachToGui(c.getVisual(), !1);
        this.ball.cannonBall.show();
        0 < this.balls && (this.balls -= 1);
        c = this.ball.physics.GetCenterPosition();
        this.ball.cannonBall.setZ(9998);
        var d = new b2Vec2(this.direction.x, this.direction.y);
        d.Normalize();
        d.Multiply(this.powerRatio * POWER_RATING);
        this.ball.physics.ApplyImpulse(d, new b2Vec2(c.x, c.y))
    }
};
Cannon.prototype.fire = function() {
    if (!(this.ball && this.ball.inMotion || this.powerRatio < MIN_PWR_RATIO)) {
        var a = this,
            b = this.getVisual("cannonier"),
            c = this.getVisual("barrel");
        if (!(c.currentAnimation && null != c.currentAnimation)) {
            var d = this.getVisual("powerLine"),
                e = c.x + a.mainGui.x + 16,
                f = c.y + a.mainGui.y + 16;
            d.hide();
            var g = new b2Vec2(a.direction.x, a.direction.y);
            g.Normalize();
            g.Multiply(45);
            c.setAnimationEndCallback(function() {
                if ("fireStart" == c.lastAnimation) c.playAnimation("fireEnd", ANIMATION_SPEED, !1, !0), a.createBall(e +
                    g.x + 2, f + g.y + 5), Physics.pause(!1), a.powerRatio = 0, Account.instance.getEntity("GameState01").getGui("ballsInfo").children.guiEntities[1].change(a.balls)
            });
            b.setAnimationEndCallback(function() {
                c.playAnimation("fireStart", ANIMATION_SPEED, !1, !0)
            });
            b.playAnimation("fire", ANIMATION_SPEED, !1, !0);
            this.setTimeout(function() {
                Sound.play("shot")
            }, 600)
        }
    }
};
Cannon.prototype.attachToGui = function(a) {
    Cannon.parent.attachToGui.call(this, a, !1)
};
Cannon.prototype.destroy = function() {
    Cannon.parent.destroy.call(this)
};
CannonBall.prototype = new PhysicEntity;
CannonBall.prototype.constructor = CannonBall;

function CannonBall() {
    CannonBall.parent.constructor.call(this)
}
CannonBall.inheritsFrom(PhysicEntity);
CannonBall.prototype.className = "CannonBall";
CannonBall.prototype.createInstance = function(a) {
    var b = new CannonBall;
    b.init(a);
    return b
};
entityFactory.addClass(CannonBall);
CannonBall.prototype.init = function(a) {
    CannonBall.parent.init.call(this, a);
    a = Physics.getContactProcessor();
    this.contactListener = new ContactListener(a, this.physics)
};
CannonBall.prototype.createVisual = function() {
    this.description = Account.instance.descriptionsData[this.params.type];
    this.angle = 0;
    this.cannonBall = guiFactory.createObject("GuiSprite", $.extend({
        parent: this.guiParent,
        style: "sprite",
        x: this.params.x - this.description.visuals.cannonBall.width / 2,
        y: this.params.y - this.description.visuals.cannonBall.height / 2
    }, this.description.visuals.cannonBall));
    var a = {};
    a.visual = this.cannonBall;
    this.addVisual("CannonBall", a);
    this.inMotion = !1;
    this.path = [];
    this.trace = !0;
    this.pathLength =
        0;
    this.cannonBall.hide()
};
CannonBall.prototype.createPath = function() {
    var a = this.guiParent.visualEntity.pool.clouds.guis[this.pathLength];
    a && (a.setPosition(this.x + 3, this.y + 3), this.path.push(a), this.pathLength += 1, 1 < this.pathLength && a.show(), a.clampByParentViewport(!0))
};
CannonBall.prototype.removePath = function() {
    delete this.path;
    this.path = [];
    $.each(this.guiParent.visualEntity.pool.clouds.guis, function(a, b) {
        b.visible && b.hide()
    });
    that.pathLength = 0
};
CannonBall.prototype.leaveOnlyTrace = function() {
    console.log("leaveOnlyTrace");
    if (this.physics) {
        Physics.getWorld().DestroyBody(this.physics);
        this.physics = null;
        this.cannonBall.hide();
        this.inMotion = !1;
        var a = Account.instance.getEntity("Scene01");
        a.needToReleaseBarrel = !0;
        if (0 == a.gun.balls) Account.instance.getEntity("Scene01").needToCheckForResult = !0
    }
};
CannonBall.prototype.destroy = function() {
    this.physics && this.physics.SetLinearVelocity(new b2Vec2(0, 0));
    this.removePath();
    CannonBall.parent.destroy.call(this)
};
CannonBall.prototype.getPathLength = function() {
    return this.path.length
};
CannonBall.prototype.updatePhysics = function() {
    CannonBall.parent.updatePhysics.call(this);
    this.contactListener.update();
    if (this.cannonBall.visible) {
        var a = {},
            b = {};
        if (this.inMotion = this.physics.m_linearVelocity.Length() > MIN_VELOCITY ? !0 : !1) a = {
            x: this.x,
            y: this.y
        }, b = 0 < this.path.length ? {
            x: this.path[this.path.length - 1].x,
            y: this.path[this.path.length - 1].y
        } : {
            x: 0,
            y: 0
        }, distance(a, b) > TRACE_STEP && !0 == this.cannonBall.visible && this.trace && this.createPath()
    }
};
var DEFAULT_SCORE = 50;
Block.prototype = new PhysicEntity;
Block.prototype.constructor = Block;

function Block() {
    Block.parent.constructor.call(this)
}
Block.inheritsFrom(PhysicEntity);
Block.prototype.className = "Block";
Block.prototype.createInstance = function(a) {
    var b = new Block;
    b.init(a);
    return b
};
entityFactory.addClass(Block);
Block.prototype.init = function(a) {
    Block.parent.init.call(this, a)
};
Block.prototype.createVisual = function() {
    var a = this,
        b = Account.instance.descriptionsData[this.params.type];
    this.angle = 0;
    $.each(b.visuals, function(b, d) {
        var e = guiFactory.createObject(d["class"], $.extend({
            parent: a.guiParent,
            style: "sprite",
            x: a.params.x,
            y: a.params.y
        }, d));
        e.setZ(e.params.z);
        var f = {};
        f.visual = e;
        a.addVisual(b, f)
    })
};
Block.prototype.onDamage = function(a) {
    var b = this.health;
    Block.parent.onDamage.call(this, a);
    this.parent.score += b - this.health;
    Account.instance.getEntity("GameState01").getGui("score").children.guiEntities[1].change(this.parent.score.toFixed(0))
};
Block.prototype.destroy = function() {
    var a = Account.instance.getEntity("BigBlockDestruction"),
        b = Account.instance.getEntity("SmallBlockDestruction"),
        c = {
            x: this.x + 9,
            y: this.y + 5
        };
    switch (this.params.type) {
        case "BigBlock_1":
            a.play(c);
            break;
        case "BigBlock_2":
            a.play(c);
            break;
        case "BigBlock_3":
            a.play(c);
            break;
        case "SmallBlock_1":
            b.play(c);
            break;
        case "SmallBlock_2":
            b.play(c);
            break;
        case "SmallBlock_3":
            b.play(c);
            break;
        case "WindowBlock":
            a.play(c)
    }
    a = this.params.score ? this.params.score : DEFAULT_SCORE;
    5E3 <= a ? scoreGroup =
        "5000" : 1E3 <= a ? scoreGroup = "1000" : 500 <= a ? scoreGroup = "500" : 100 <= a ? scoreGroup = "100" : 50 <= a ? scoreGroup = "50" : 15 <= a && (scoreGroup = "15");
    Block.parent.destroy.call(this)
};
Block.prototype.attachToGui = function(a) {
    Block.parent.attachToGui.call(this, a, !1)
};
var IEffect = function() {
        return {
            play: function(a, b, c) {
                function d() {
                    setTimeout(function() {
                        e && (a.x += e.x / i, a.y += e.y / i);
                        f && a.rotate(f / i);
                        a.resize();
                        j >= i - 1 ? g && g() : (j += 1, d())
                    }, c / i)
                }
                var e = !1;
                b.slide && (e = {
                    x: b.slide.x,
                    y: b.slide.y
                });
                var f = !1;
                if (b.rotate) f = b.rotate;
                var g = !1;
                if (b.onEnd) g = b.onEnd;
                var i = b.iterations ? b.iterations : 20,
                    j = 0;
                d()
            }
        }
    }(),
    DEATH_DELAY = 1E3;
Soldier.prototype = new Block;
Soldier.prototype.constructor = Soldier;

function Soldier() {
    Soldier.parent.constructor.call(this)
}
Soldier.inheritsFrom(Block);
Soldier.prototype.className = "Soldier";
Soldier.prototype.createInstance = function(a) {
    var b = new Soldier;
    b.init(a);
    return b
};
entityFactory.addClass(Soldier);
Soldier.prototype.init = function(a) {
    Soldier.parent.init.call(this, a);
    this.oldAngle = 0;
    this.dead = !1
};
Soldier.prototype.createVisual = function() {
    Soldier.parent.createVisual.call(this);
    this.refreshFace("normal")
};
Soldier.prototype.refreshFace = function(a) {
    var b = this;
    if (this.state != a) switch (this.state = a, a) {
        case "surprised":
            b.visuals.soldier.visual.playAnimation("surprised", 50, !1, !0);
            b.dead = !1;
            break;
        case "dead":
            b.visuals.soldier.visual.playAnimation("dead", 50, !1, !0);
            b.dead = !0;
            b.setTimeout(function() {
                b.dead && (Account.instance.getEntity("BallExplosion").play({
                    x: b.physics.m_position.x - 35,
                    y: b.physics.m_position.y - 35
                }), Sound.play({
                    id: "bubble",
                    channel: "game",
                    priority: Sound.LOW_PRIORITY
                }), b.destroy())
            }, DEATH_DELAY);
            break;
        case "normal":
            b.visuals.soldier.visual.playAnimation("normal", 50, !1, !0);
            b.dead = !1;
            break;
        case "happy":
            b.visuals.soldier.visual.playAnimation("happy", 50, !1, !0)
    }
};
Soldier.prototype.update = function() {
    Soldier.parent.updatePhysics.call(this);
    if (!this.DoNotUpdate)
        if ("happy" == this.state) this.y -= 1;
        else {
            this.angle = Math.abs(MathUtils.toDeg(this.physics.GetRotation()));
            var a = Account.instance.getEntity("Scene01");
            if (null != a) 3 < this.angle && 30 > this.angle && this.refreshFace("surprised"), 30 < this.angle && this.angle && this.refreshFace("dead"), 2 > this.angle && this.angle && !a.finishLevel && this.refreshFace("normal"), this.dead || this.angle == this.oldAngle && a.targeted && Physics.paused &&
                "happy" != this.state && this.refreshFace("normal"), this.oldAngle = this.angle
        }
};
Soldier.prototype.destroy = function() {
    Account.instance.getEntity("Scene01").needToCheckForSoldiers = !0;
    Soldier.parent.destroy.call(this)
};
Ground.prototype = new PhysicEntity;
Ground.prototype.constructor = Ground;

function Ground() {
    Ground.parent.constructor.call(this)
}
Ground.inheritsFrom(PhysicEntity);
Ground.prototype.className = "Ground";
Ground.prototype.createInstance = function(a) {
    var b = new Ground;
    b.init(a);
    return b
};
entityFactory.addClass(Ground);
Ground.prototype.init = function(a) {
    Ground.parent.init.call(this, a);
    a = Physics.getContactProcessor();
    this.contactListener = new ContactListener(a, this.physics)
};
Ground.prototype.updatePhysics = function() {
    Ground.parent.updatePhysics.call(this);
    this.contactListener.update()
};
Ground.prototype.destroy = function() {
    Ground.parent.destroy.call(this)
};
var TRACE_STEP = 45,
    MIN_VELOCITY = 3,
    STOP_SPEED = 3,
    SELF_DESTR_MULT = 2.0E-6;
BattleScene.prototype = new PhysicScene;
BattleScene.prototype.constructor = BattleScene;

function BattleScene() {
    BattleScene.parent.constructor.call(this)
}
BattleScene.inheritsFrom(PhysicScene);
BattleScene.prototype.className = "BattleScene";
BattleScene.prototype.createInstance = function(a) {
    var b = new BattleScene;
    b.init(a);
    return b
};
entityFactory.addClass(BattleScene);
BattleScene.prototype.init = function(a) {
    BattleScene.parent.init.call(this, a);
    Physics.getWorld();
    this.lvlResult = this.fired = this.targeted = this.needToCheckForSoldiers = this.needToCheckForResult = this.needToReleaseBarrel = !1;
    this.enemies = [];
    this.prisoners = [];
    this.score = 0;
    this.pool = {
        clouds: {
            count: 50,
            guis: []
        },
        scores: {
            15: {
                count: 2,
                guis: []
            },
            50: {
                count: 2,
                guis: []
            },
            100: {
                count: 2,
                guis: []
            },
            500: {
                count: 1,
                guis: []
            },
            1E3: {
                count: 1,
                guis: []
            },
            5E3: {
                count: 1,
                guis: []
            }
        }
    }
};
BattleScene.prototype.addChild = function(a) {
    BattleScene.parent.addChild.call(this, a)
};
BattleScene.prototype.createVisual = function() {
    function a() {
        var a = g.ball;
        a.trace = !1;
        Physics.getWorld();
        var b = new b2Vec2(a.x + 8, a.y + 8);
        Physics.explode({
            center: b,
            radius: 75,
            force: 1500,
            duration: 5,
            damageDecr: 90,
            owner: a.cannonBall
        });
        a.cannonBall.visible && (Account.instance.getEntity("BallExplosion").play({
            x: a.x - 20,
            y: a.y - 20
        }), Sound.play({
            id: "explosion",
            channel: "game",
            priority: Sound.HIGH_PRIORITY
        }));
        a.hide()
    }

    function b() {
        g.ball.leaveOnlyTrace()
    }

    function c(a) {
        contactedShape = a.m_shape1;
        23.021728866442675 == contactedShape.m_maxRadius &&
            Sound.play({
                id: "metal",
                channel: "game",
                priority: Sound.LOW_PRIORITY
            });
        console.log(a)
    }
    BattleScene.parent.createVisual.call(this);
    var d = this,
        e = this.getVisual();
    (function() {
        for (var a = 0; a < d.pool.clouds.count; a++) {
            var b = guiFactory.createObject("GuiSprite", {
                parent: d.getVisual(),
                style: "sprite",
                width: 0 == a % 2 ? 14 : 10,
                height: 0 == a % 2 ? 14 : 10,
                totalImage: 0 == a % 2 ? "FinalArt/CannonBalls/PointCloud002.png" : "FinalArt/CannonBalls/PointCloud001.png",
                totalImageWidth: 0 == a % 2 ? 14 : 10,
                totalImageHeight: 0 == a % 2 ? 14 : 10,
                totalTile: 1,
                x: 0,
                y: 0
            });
            b.setZ(5);
            b.hide();
            d.guiParent.addGui(b);
            b.clampByParentViewport(!1);
            d.pool.clouds.guis.push(b)
        }
    })();
    $.each(this.children, function(a, b) {
        "EnemySoldier" == b.params.type ? d.enemies.push(b) : "PrisonerSoldier" == b.params.type && d.prisoners.push(b)
    });
    document.getElementById(e.id).style.border = "0px solid black";
    this.setBackgrounds({
        background: {
            src: "images/FinalArt/Backgrounds/background_new.png",
            backX: 0,
            backY: 0,
            backWidth: 1138,
            backHeight: 640
        }
    }, Account.instance.getEntity("GameState01").getGui("enhancedScene"));
    var f = {
        id: "Ground01",
        "class": "Ground",
        parent: "Scene01",
        type: "Ground",
        x: 569,
        y: 460,
        angle: 0
    };
    this.ground = entityFactory.createObject(f["class"], f);
    Account.instance.addEntity(this.ground);
    f = Physics.getContactProcessor();
    f.setDefaultBeginContact(function(a) {
        if (a) {
            var b = a.m_shape1.m_body,
                c = a.m_shape2.m_body,
                a = b.m_mass * Math.pow(b.m_linearVelocity.Length(), 2),
                e = c.m_mass * Math.pow(c.m_linearVelocity.Length(), 2);
            "Ground" == b.m_userData.params.type && (a = 70 * e);
            var f = e * SELF_DESTR_MULT + a * SELF_DESTR_MULT;
            d.setTimeout(function() {
                if (b.m_userData &&
                    b.m_userData.onDamage) b.m_userData.onDamage(f / 2);
                if (c.m_userData && c.m_userData.onDamage) c.m_userData.onDamage(f / 2)
            }, 100)
        }
    });
    f.addPair("CannonBall_1", "Ground", "beginContact", a);
    f.addPair("CannonBall_1", "Ground", "endContact", b);
    f.addPair("CannonBall_1", "BigBlock_1", "beginContact", a);
    f.addPair("CannonBall_1", "BigBlock_2", "beginContact", a);
    f.addPair("CannonBall_1", "BigBlock_3", "beginContact", a);
    f.addPair("CannonBall_1", "WindowBlock", "beginContact", a);
    f.addPair("CannonBall_1", "SmallBlock_1", "beginContact",
        a);
    f.addPair("CannonBall_1", "RedTowerRoof", "beginContact", a);
    f.addPair("CannonBall_1", "BigColumn", "beginContact", a);
    f.addPair("CannonBall_1", "SmallColumn", "beginContact", a);
    f.addPair("CannonBall_1", "WoodBox", "beginContact", a);
    f.addPair("CannonBall_1", "WoodPlankBig", "beginContact", a);
    f.addPair("CannonBall_1", "WoodPlankThin", "beginContact", a);
    f.addPair("CannonBall_1", "WoodPlankSmall", "beginContact", a);
    f.addPair("CannonBall_1", "EnemySoldier", "beginContact", c);
    f.addPair("CannonBall_1", "PrisonerSoldier",
        "beginContact", c);
    f.addPair("CannonBall_1", "BigBlock_1", "endContact", b);
    f.addPair("CannonBall_1", "BigBlock_2", "endContact", b);
    f.addPair("CannonBall_1", "BigBlock_3", "endContact", b);
    f.addPair("CannonBall_1", "WindowBlock", "endContact", b);
    f.addPair("CannonBall_1", "SmallBlock_1", "endContact", b);
    f.addPair("CannonBall_1", "RedTowerRoof", "endContact", b);
    f.addPair("CannonBall_1", "BigColumn", "endContact", b);
    f.addPair("CannonBall_1", "SmallColumn", "endContact", b);
    f.addPair("CannonBall_1", "WoodBox", "endContact",
        b);
    f.addPair("CannonBall_1", "WoodPlankBig", "endContact", b);
    f.addPair("CannonBall_1", "WoodPlankThin", "endContact", b);
    f.addPair("CannonBall_1", "WoodPlankSmall", "endContact", b);
    var g = null,
        d = this;
    $.each(this.children, function(a, b) {
        if ("Cannon" == b.params["class"]) g = b, d.gun = b
    });
    null == g && alert("There is no Cannon in Scene! It can`t be so, if you have added one. Please add it!");
    if (d.params.balls) g.balls = d.params.balls;
    onDownHandler = function() {
        if (!d.gun.fired) d.targeting = !0
    };
    onUpHandler = function() {
        if (d.targeting) d.gun.fired = !0, g.fire();
        if (0.1 > d.gun.powerRatio) d.needToReleaseBarrel = !0;
        d.targeting = !1
    };
    onMoveHandler = function(a) {
        !d.gun.fired && d.gun.balls && (a = Device.getLogicPositionFromEvent(a), d.targeting && (Physics.pause(!0), g.setPower(a)), g.setTarget(a))
    };
    e.jObject.bind(Device.event("cursorMove"), onMoveHandler);
    e.jObject.bind(Device.event("cursorUp"), onUpHandler);
    g.bind(Device.event("cursorDown"), onDownHandler);
    Account.instance.getEntity("GameState01").getGui("enhancedScene").jObject.bind(Device.event("cursorUp"), onUpHandler);
    $.each(d.pool.clouds.guis, function(a, b) {
        b.jObject.bind(Device.event("cursorUp"), onUpHandler)
    });
    this.rightTrigger = CreatePhysicsTrigger(Physics.getWorld(), {
        left: e.width + 80,
        right: e.width + 100,
        top: 0,
        bottom: e.height
    }, function(a) {
        "CannonBall" == a.m_userData.params.id ? a.m_userData.leaveOnlyTrace() : (a.m_userData.destroy(), d.needToCheckForResult = !0)
    });
    this.leftTrigger = CreatePhysicsTrigger(Physics.getWorld(), {
        left: e.x,
        right: e.x + 20,
        top: 0,
        bottom: e.height
    }, function(a) {
        "CannonBall" == a.m_userData.params.id ? a.m_userData.leaveOnlyTrace() :
            (a.m_userData.destroy(), d.needToCheckForResult = !0)
    });
    this.updateTriggersPosition();
    this.update = function() {
        if (!d.finishLevel) {
            Physics.paused() || (d.leftTrigger.update(), d.rightTrigger.update());
            if (d.gun.fired || !d.gun.balls) d.targeted = !1;
            if (d.needToReleaseBarrel) {
                var a = d.checkMaxSpeed();
                d.maxSpeed = Math.max(a.linear, 1E3 * a.angular);
                if (d.maxSpeed < STOP_SPEED) d.gun.fired = !1, d.gun.cannonier.playAnimation("getReady", 0, !1, !0), d.needToReleaseBarrel = !1, d.targeted = !0, d.setTimeout(function() {
                        Physics.pause(!0)
                    },
                    500), d.checkForResult(g.balls)
            }
            if (d.needToCheckForSoldiers) {
                var b = !0,
                    c = !1;
                $.each(d.enemies, function(a, c) {
                    c.dead || (b = !1)
                });
                $.each(d.prisoners, function(a, b) {
                    b.dead && (c = !0)
                });
                if (b || c) d.needToCheckForResult = !0;
                d.needToCheckForSoldiers = !1
            }
        }
    };
    this.setEnable(!0);
    Physics.pause(!1)
};
BattleScene.prototype.checkForResult = function(a) {
    var b = !0,
        c = !1,
        d = this;
    this.setTimeout(function() {
        $.each(d.enemies, function(a, c) {
            c.dead || (b = !1)
        });
        $.each(d.prisoners, function(a, d) {
            d.dead ? (c = !0, b = !1) : b && d.refreshFace("happy")
        });
        var e = d.parent;
        if (!b && a && !c) return d.gun.fired = !1, d.finishLevel = !1;
        d.targeted = !1;
        d.gun.fired = !0;
        var f = e.getGui("endNextBtn");
        b ? f.show() : f.hide();
        LVL_INDEX == LAST_LEVEL && f.hide();
        if (b) {
            f = SCORE["level_" + LVL_INDEX];
            d.score += 50 * d.enemies.length;
            Account.instance.getEntity("GameState01").getGui("score").children.guiEntities[1].change(d.score.toFixed(0));
            d.score += 100 * a;
            Account.instance.getEntity("GameState01").getGui("score").children.guiEntities[1].change(d.score.toFixed(0));
            var g = d.score.toFixed();
            SCORE["level_" + LVL_INDEX] = f ? Math.max(f, g) : g;
            Device.setStorageItem("scores", JSON.stringify(SCORE));
            e.finalSound = "level_win"
        } else $.each(d.enemies, function(a, b) {
            if (!b.dead) b.DoNotUpdate = !0, b.refreshFace("normal")
        }), e.finalSound = "level_fail";
        f = e.getGui("endGameMenu");
        f.children.guiEntities[0].applyBackground(b ? {
            image: "FinalArt/Menu/LevelSelect/VictoryShit.png",
            label: {
                style: "gameButton victoriana-white",
                text: "",
                fontSize: 50,
                color: "#01B5FF",
                y: "40%"
            }
        } : {
            image: "FinalArt/Menu/LevelSelect/FailureShit.png",
            label: {
                style: "gameButton victoriana-white",
                text: "",
                fontSize: 50,
                color: "#01B5FF",
                y: "40%"
            }
        });
        f.children.guiEntities[1].change(b ? "Congratulations!" : "Ooops, you failed.");
        LVL_INDEX == LAST_LEVEL && b && f.children.guiEntities[1].change("Great Victory!");
        d.setTimeout(function() {
                Physics.pause(!0);
                Sound.play(e.finalSound);
                e.getGui("pauseMenuContainer").show();
                e.getGui("endGameMenu").show()
            },
            800);
        return !0
    }, 1E3)
};
BattleScene.prototype.checkMaxSpeed = function() {
    for (var a = this.physicWorld.m_bodyList, b = {
            linear: a.GetLinearVelocity().Length(),
            angular: a.GetAngularVelocity()
        }; null != a; a = a.m_next) {
        var c = a.GetLinearVelocity().Length(),
            d = a.GetAngularVelocity();
        if (c > b.linear) b.linear = c;
        if (d > b.angular) b.angular = d
    }
    return b
};
BattleScene.prototype.destroy = function() {
    BattleScene.parent.destroy.call(this)
};
BattleScene.prototype.updateTriggersPosition = function() {
    var a = this.getVisual();
    this.leftTrigger.setPosition(a.parent.viewRect.left - 20, 0);
    this.rightTrigger.setPosition(a.parent.viewRect.right, 0)
};
BattleScene.prototype.resize = function() {
    BattleScene.parent.resize.call(this);
    this.updateTriggersPosition()
};
var GAME_GUI_JSON = "resources/ui/GameState.json",
    OBJECTS_DESCRIPTION = "resources/objectsDescription.json";
GameState.prototype = new BaseState;
GameState.prototype.constructor = GameState;

function GameState() {
    this.preloadJson(GAME_GUI_JSON);
    this.preloadJson(LEVEL_DESCRIPTION);
    this.preloadJson(OBJECTS_DESCRIPTION);
    GameState.parent.constructor.call(this)
}
GameState.inheritsFrom(BaseState);
GameState.prototype.className = "GameState";
GameState.prototype.createInstance = function(a) {
    var b = new GameState;
    b.activate(a);
    return b
};
entityFactory.addClass(GameState);
GameState.prototype.jsonPreloadComplete = function() {
    GameState.parent.jsonPreloadComplete.call(this)
};
GameState.prototype.init = function(a) {
    function b() {
        c.getGui("pauseMenu").playJqueryAnimation("close", function() {
            c.getGui("pauseMenuContainer").hide();
            Physics.pause(!1)
        })
    }
    var c = this;
    REPLY = !1;
    GameState.parent.init.call(this, a);
    Account.instance.descriptionsData = this.resources.json[OBJECTS_DESCRIPTION];
    guiFactory.createGuiFromJson(this.resources.json[GAME_GUI_JSON], this);
    var a = this.resources.json[LEVEL_DESCRIPTION],
        d = Account.instance.getEntity("GameState01").params;
    d.children = $.extend(a, {
        BallExplosion: {
            "class": "Effect",
            type: "BallExplosion_1",
            parent: "Scene01"
        },
        BigBlockDestruction: {
            "class": "Effect",
            type: "BigBlockDestruction",
            parent: "Scene01"
        },
        SmallBlockDestruction: {
            "class": "Effect",
            type: "SmallBlockDestruction",
            parent: "Scene01"
        }
    });
    this.initChildren(d);
    a = Account.instance.getEntity("Scene01");
    d = this.getGui("sceneContainer");
    a.attachToGui(d, !1);
    this.battleField = a;
    this.getGui("pauseMenuContainer").hide();
    this.getGui("endGameMenu").hide();
    c.getGui("levelInfo").children.guiEntities[1].change(LVL_INDEX + 1);
    Sound.isOn() ? this.getGui("soundOff").hide() :
        this.getGui("soundOn").hide();
    a = this.getGui("pauseBtn");
    a.bind(function() {
        Sound.play("change");
        var a = c.getGui("pauseMenu");
        c.getGui("pauseMenuContainer").show();
        Physics.pause(!0);
        a.playJqueryAnimation("open")
    });
    a = this.getGui("resume");
    a.bind(function() {
        Sound.play("click");
        b()
    });
    a = this.getGui("restart");
    a.bind(function() {
        REPLY = !0;
        Sound.play("change");
        Account.instance.switchState("LevelMenuState01", c.id, c.parent.id)
    });
    a = this.getGui("menu");
    a.bind(function() {
        Sound.play("change");
        Account.instance.switchState("LevelMenuState01",
            c.id, c.parent.id)
    });
    a = this.getGui("endMenuBtn");
    a.bind(function() {
        LVL_INDEX += 1;
        Sound.play("change");
        Account.instance.switchState("LevelMenuState01", c.id, c.parent.id);
        console.log(SCORE)
    });
    a = this.getGui("endReplyBtn");
    a.bind(function() {
        REPLY = !0;
        Sound.play("change");
        Account.instance.switchState("LevelMenuState01", c.id, c.parent.id)
    });
    a = this.getGui("endNextBtn");
    a.bind(function() {
        Sound.play("change");
        REPLY = !0;
        LVL_INDEX += 1;
        LEVEL_DESCRIPTION = "resources/levels/" + LVL_INDEX + ".json";
        Account.instance.switchState("LevelMenuState01",
            c.id, c.parent.id)
    });
    a = this.getGui("soundOn");
    a.bind(function() {
        Sound.turnOn(!1);
        c.getGui("soundOn").hide();
        c.getGui("soundOff").show()
    });
    a = this.getGui("soundOff");
    a.bind(function() {
        Sound.turnOn(!0);
        c.getGui("soundOff").hide();
        c.getGui("soundOn").show();
        Sound.play("click")
    });
    a = this.getGui("tutorialMenu");
    0 == LVL_INDEX || 5 == LVL_INDEX ? (a.show(), c.getGui("pauseMenuContainer").show()) : (a.hide(), c.getGui("pauseMenuContainer").hide());
    a = this.getGui("tutorialMenu");
    a.children.guiEntities[1].change("Take a shot");
    a = this.getGui("tutorialFrame_1");
    a.hide();
    a = this.getGui("tutorialFrame_2");
    a.hide();
    0 == LVL_INDEX ? (a = this.getGui("tutorialFrame_0"), a.show(), a.playAnimation("tutorial", 3E3, !0, !0)) : 5 == LVL_INDEX && (a = this.getGui("tutorialFrame_2"), a.hide(), c.getGui("tutorialNext").hide(), c.getGui("tutorialEnd").show(), c.getGui("tutorialFrame_0").hide(), c.getGui("tutorialFrame_1").hide(), c.getGui("tutorialFrame_2").show(), a = c.getGui("tutorialMenu"), a.children.guiEntities[1].change("Save the captive"));
    a = this.getGui("tutorialNext");
    a.bind(function() {
        c.getGui("tutorialFrame_0").hide();
        0 == LVL_INDEX ? c.getGui("tutorialFrame_1").show() : c.getGui("tutorialFrame_2").show();
        c.getGui("tutorialNext").hide();
        c.getGui("tutorialEnd").show();
        var a = c.getGui("tutorialMenu");
        0 == LVL_INDEX ? a.children.guiEntities[1].change("Hit the enemy") : 5 == LVL_INDEX && a.children.guiEntities[1].change("Save the captive");
        Sound.play("click")
    });
    a = this.getGui("tutorialEnd");
    5 != LVL_INDEX && a.hide();
    a.bind(function() {
        c.getGui("tutorialFrame_0").hide();
        0 == LVL_INDEX ? c.getGui("tutorialFrame_1").hide() :
            5 == LVL_INDEX && c.getGui("tutorialFrame_2").hide();
        Sound.play("click");
        c.getGui("tutorialMenu").hide();
        c.getGui("pauseMenuContainer").hide()
    });
    Loader.loadingMessageShowed() ? Account.instance.backgroundState.fadeIn(REPLY ? 0 : LEVEL_FADE_TIME, "white", function() {
        Account.instance.backgroundState.fadeOut(REPLY ? 0 : LEVEL_FADE_TIME);
        Loader.hideLoadingMessage();
        $(window).trigger("resize")
    }) : Account.instance.backgroundState.fadeOut(REPLY ? 0 : LEVEL_FADE_TIME, function() {
        $(window).trigger("resize")
    })
};
GameState.prototype.destroy = function() {
    Account.instance.getEntity("Scene01");
    GameState.parent.destroy.call(this);
    delete Account.instance.allEntities.Scene01;
    delete Account.instance.allEntities[that.id];
    Account.instance.removeEntity("BallExplosion", !0);
    Account.instance.removeEntity("BigBlockDestruction", !0);
    Account.instance.removeEntity("SmallBlockDestruction", !0);
    Physics.destroyWorld()
};
GameState.prototype.resize = function() {
    GameState.parent.resize.call(this);
    Account.instance.getEntity("Scene01").resize()
};