/* ==============================================================

   Author: Elite Coder
   Author URL: https://codecanyon.net/user/EliteCoder
   Game: Green Cards - HTML5 Memory Game
   Version: 1.0

   ============================================================== */

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
                viewporter.settings.maxDensity = !1;
                var b = this.getProfile();
                if (!b) return this.triggerWindowEvent("viewportunknown");
                a = b ? b.inverseLandscape : !1;
                var d =
                    viewporter.isLandscape(),
                    e = 0,
                    f = 1,
                    g = !a ? screen.height : screen.width,
                    i = !a ? screen.width : screen.height,
                    j = this.IS_ANDROID ? 1 : 1 / window.devicePixelRatio,
                    e = 0,
                    l = !1,
                    o = g,
                    k = i,
                    m = function(a) {
                        return "function" == typeof a ? a(o, k, f) : a
                    };
                if (e = "function" == typeof b.ppi ? b.ppi() : b.ppi) viewporter.DEVICE_DENSITY = e, viewporter.settings.maxDensity && e > viewporter.settings.maxDensity && (f *= viewporter.settings.maxDensity / e, j = this.IS_ANDROID ? 1 : j / f);
                g = m(b.width) || g;
                i = m(b.height) || i;
                b.chromePrescale ? (e = m(b.chromePrescale), l = !0) : e = m(b.chrome) ||
                    0;
                if (b = b[d ? "landscape" : "portrait"]) g = m(b.width) || g, i = m(b.height) || i, e = m(b.chrome) || e || 0;
                this.data = {
                    width: (d ? g : i) * f,
                    height: (d ? i : g) * f,
                    scale: j,
                    chromeHeight: e * (l ? 1 : f)
                };
                viewporter.DEVICE_SUPPORTED = !0
            },
            prepareVisualViewport: function() {
                var a = this,
                    b = 0,
                    e = window.setInterval(function() {
                        viewporter.DEVICE_SUPPORTED || a.maximizeDocumentElement();
                        window.scrollTo(0, 1);
                        if (viewporter.DEVICE_SUPPORTED && 5 > Math.abs(window.innerHeight - Math.ceil(a.data.height - a.data.chromeHeight)) || 10 < b) clearInterval(e), a.triggerWindowEvent(!a._firstUpdateExecuted ?
                            "viewportready" : "viewportchange"), a._firstUpdateExecuted = !0;
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
    for (var e = 0, f = a.length, g, i, j = f, l = 0; e < f; ++e) {
        g = a[e];
        i = g.substr(g.lastIndexOf(".") + 1).toLowerCase();
        if ("mp3" === i || "wav" === i || "ogg" === i || "mp4" === i) i = new Audio(g), -1 != navigator.userAgent.indexOf("Chrome") && l++;
        else if ("jpg" === i || "jpeg" === i || "gif" === i || "png" === i) i = new Image, i.src = g;
        else {
            j--;
            continue
        }
        assets[g] = i;
        i.onload = function() {
            ++l;
            c && c.call(this, {
                loaded: l,
                total: j,
                percent: 100 * (l / j)
            });
            l === j && b && b()
        };
        i.onerror = function() {
            d ? d.call(this, {
                    loaded: l,
                    total: j,
                    percent: 100 * (l / j)
                }) :
                (l++, l === j && b && b())
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
var Sound = function() {
        function a(a, b) {
            var c = b + t,
                d = new Audio(c);
            d.preload = "auto";
            d.load();
            r[a] = {
                url: c,
                audio: d
            }
        }

        function b(a, b, c) {
            var d = r[a];
            if (!d || !d.audio) return null;
            if (c) d.audio.volume = c;
            d.audio.play();
            try {
                d.audio.currentTime = 0
            } catch (e) {}
            b && d.audio.addEventListener("ended", function() {
                try {
                    this.currentTime = 0
                } catch (a) {}
                this.play()
            }, !1);
            return a
        }

        function c(a) {
            (a = r[a]) && a.audio.pause()
        }

        function d(a) {
            Device.isAppleMobile() && (n = i);
            jQuery.getScript(j + "jquery.jplayer.min.js", function() {
                $("body").append("<div id='jPlayerInstanceId' style='width: 0px; height: 0px;'></div>");
                jPlayerInstance = $("#jPlayerInstanceId");
                jPlayerInstance.jPlayer({
                    ready: function() {
                        $(this).jPlayer("setMedia", {
                            oga: a + ".ogg",
                            mp3: a + ".mp3"
                        })
                    },
                    supplied: "oga, mp3",
                    solution: "flash, html",
                    swfPath: j,
                    ended: function() {},
                    playing: function(a) {
                        console.log("Jplayer playing " + a.jPlayer.status.currentTime)
                    },
                    timeupdate: function() {}
                })
            })
        }

        function e(a, b, c, d) {
            r[a] = {
                start: c,
                length: d
            }
        }

        function f(a, b, c) {
            b = r[a];
            if (!b) return null;
            c && jPlayerInstance.jPlayer("volume", c);
            jPlayerInstance.jPlayer("pause", b.start + n);
            jPlayerInstance.jPlayer("play",
                b.start + n);
            clearTimeout(u);
            u = setTimeout(g, 1E3 * b.length);
            return a
        }

        function g(a) {
            clearTimeout(u);
            u = null;
            !0 != a && jPlayerInstance.jPlayer("pause")
        }
        var i = -0.0,
            j = "scripts/",
            l, o, k, m, n = 0,
            r = {},
            q = {},
            v = function() {},
            s = function() {},
            p = function() {},
            t = null,
            u = null;
        return {
            init: function(i, r, u) {
                l = r || "string" == typeof i && Device.isMobile();
                o = "true" == Device.getStorageItem("soundOn", "true");
                if (l) j = u ? u : j, d(i), v = e, s = f, p = g;
                else {
                    var q;
                    try {
                        q = new Audio("")
                    } catch (x) {}
                    q && q.canPlayType && (k = "no" != q.canPlayType("audio/ogg") && "" != q.canPlayType("audio/ogg"),
                        m = "no" != q.canPlayType("audio/mpeg") && "" != q.canPlayType("audio/mpeg"), k ? (t = ".ogg", n = 0) : m && (t = ".mp3", n = 0.07), t && (v = a, s = b, p = c))
                }
            },
            update: function() {},
            turnOn: function(a) {
                o = a;
                Device.setStorageItem("soundOn", o);
                l ? o ? jPlayerInstance.jPlayer("unmute") : jPlayerInstance.jPlayer("mute") : Sound.stop()
            },
            isOn: function() {
                return "true" == Device.getStorageItem("soundOn", "true")
            },
            supportedExtention: function() {
                return t
            },
            add: function(a, b, c, d, e) {
                (!l || !e) && v.call(this, a, b, c, d)
            },
            play: function() {
                if (o) {
                    var a, b, c, d;
                    1 == arguments.length ?
                        "object" == typeof arguments[0] ? (d = arguments[0], a = d.channel, b = d.id, c = d.loop, d = d.volume) : (a = null, b = arguments[0], c = null) : 2 == arguments.length ? "boolean" == typeof arguments[1] ? (a = null, b = arguments[0], c = arguments[1]) : (a = arguments[0], b = arguments[1], c = null) : (a = arguments[0], b = arguments[1], c = arguments[2]);
                    if (null != a) {
                        var e = q[a];
                        e && (p.call(this, e), q[a] = null)
                    }(b = s.call(this, b, c, d)) && null != a && (q[a] = b);
                    return b
                }
            },
            stop: function(a) {
                if (null != a)(a = q[a]) && p.call(this, a);
                else
                    for (var b in q)(a = q[b]) && p.call(this, a)
            }
        }
    }(),
    MAX_WIDTH = 1280,
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

        function b() {
            if (Screen.isCorrectOrientation()) {
                var a;
                j = window.innerWidth;
                l = window.innerHeight;
                e = Math.min(MAX_WIDTH, window.innerWidth);
                f = Math.min(MAX_HEIGHT, window.innerHeight);
                a = BASE_WIDTH / BASE_HEIGHT;
                e / a >= f ? e = Math.ceil(f * a) : f = Math.ceil(e / a);
                g == f && i == e && o == j && k == l ? a = !1 : (q = Math.round((window.innerWidth - e) / 2), v = Math.round((window.innerHeight - f) / 2), o = j, k = l, g = f, i = e, n = e / BASE_WIDTH, r = f / BASE_HEIGHT, a = $("#root"), 0 < a.length && (a.css("left", q), a.css("top", v)), p.left = -Screen.offsetX(), p.top = -Screen.offsetY(), p.right = -Screen.offsetX() + Screen.fullWidth(), p.bottom = -Screen.offsetY() + Screen.fullHeight(), p.width = p.right - p.left, p.height = p.bottom - p.top, p.offsetX = 0, p.offsetY = 0, a = !0);
                a && d.resize()
            }
        }
        var c = {},
            d = null,
            e = BASE_WIDTH,
            f = BASE_HEIGHT,
            g, i, j, l, o, k, m, n = 1,
            r = 1,
            q = 0,
            v = 0,
            s = !0,
            p = {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            },
            t = null;
        return {
            init: function(e, g, f) {
                d = e;
                f = selectValue(f, {});
                !1 === g && (e = BASE_HEIGHT, BASE_HEIGHT = BASE_WIDTH, BASE_WIDTH = e, e = ENHANCED_BASE_HEIGHT, ENHANCED_BASE_HEIGHT = ENHANCED_BASE_WIDTH, ENHANCED_BASE_WIDTH = e, e = ENHANCED_BASE_MARGIN_HEIGHT, ENHANCED_BASE_MARGIN_HEIGHT = ENHANCED_BASE_MARGIN_WIDTH, ENHANCED_BASE_MARGIN_WIDTH = e, MAX_WIDTH = MAX_HEIGHT = e = MAX_WIDTH);
                BASE_WIDTH = selectValue(f.BASE_WIDTH, BASE_WIDTH);
                BASE_HEIGHT =
                    selectValue(f.BASE_HEIGHT, BASE_HEIGHT);
                MAX_WIDTH = selectValue(f.MAX_WIDTH, MAX_WIDTH);
                MAX_HEIGHT = selectValue(f.MAX_HEIGHT, MAX_HEIGHT);
                ENHANCED_BASE_WIDTH = selectValue(f.ENHANCED_BASE_WIDTH, ENHANCED_BASE_WIDTH);
                ENHANCED_BASE_HEIGHT = selectValue(f.ENHANCED_BASE_HEIGHT, ENHANCED_BASE_HEIGHT);
                ENHANCED_BASE_MARGIN_WIDTH = selectValue(f.ENHANCED_BASE_MARGIN_WIDTH, ENHANCED_BASE_MARGIN_WIDTH);
                ENHANCED_BASE_MARGIN_HEIGHT = selectValue(f.ENHANCED_BASE_MARGIN_HEIGHT, ENHANCED_BASE_MARGIN_HEIGHT);
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
                "onorientationchange" in window && !f.disableOrientation ? !1 == g ? (s = !1, $("head").append('<link rel="stylesheet" href="css/orientationPortrait.css" type="text/css" />')) : (s = !0, $("head").append('<link rel="stylesheet" href="css/orientationLandscape.css" type="text/css" />')) : (s = null, $("#rotateMsg").remove());
                disableTouchEvents();
                $(window).resize(function() {
                    if (Screen.isCorrectOrientation()) clearTimeout(t), t = setTimeout(b, 100), a(), $("#rotateMsg").css("z-index", 0), $("#rotateMsg").css("display", "none");
                    else {
                        var c = $("#rotateMsg");
                        "number" != typeof m && (m = c.height() / c.width());
                        var d = Math.min(MAX_WIDTH, window.innerWidth),
                            e = d * m;
                        c.width(d);
                        c.height(e);
                        Loader.loadingMessageShowed() ||
                            ($("#rotateMsg").css("display", "block"), $("#rotateMsg").css("z-index", 99999999))
                    }
                });
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
            setLandscapeDefault: function(a) {
                s = a
            },
            isCorrectOrientation: function() {
                var a = !0,
                    a = 1.1 > window.innerWidth / window.innerHeight;
                return null == s || s ===
                    !a
            },
            isLandscape: function() {
                return viewporter.isLandscape()
            },
            widthRatio: function() {
                return n
            },
            heightRatio: function() {
                return r
            },
            fieldWidth: function() {
                return i
            },
            fieldHeight: function() {
                return g
            },
            offsetX: function() {
                return q / n
            },
            offsetY: function() {
                return v / r
            },
            fullWidth: function() {
                return o / n
            },
            fullHeight: function() {
                return k / r
            },
            fullRect: function() {
                return p
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
                "number" == typeof a ? a = Math.round(Screen.widthRatio() * a) : "FULL_WIDTH" == a && (a = o);
                "number" == typeof b ? b = Math.round(Screen.heightRatio() * b) : "FULL_HEIGHT" == b && (b = k);
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
    enableTouchEvents = function(a) {
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
        }, document.body.ontouchend = function(b) {
            b.preventDefault();
            if (touchEndX && touchEndY) b = {}, b.pageX = touchEndX, b.pageY = touchEndY, a(b);
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
                l = k = a.touches[0].pageX;
                o = m = a.touches[0].pageY;
                return !1
            }, document.ontouchmove = function(a) {
                a.preventDefault();
                k = a.touches[0].pageX;
                m = a.touches[0].pageY;
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
            l, o, k, m, n = USE_NATIVE_RENDER && window.NativeRender ? window.NativeRender : null;
        return {
            init: function() {
                if (!d) {
                    i = navigator.userAgent.toLowerCase();
                    f = /iphone|ipod|ipad/gi.test(navigator.platform);
                    g = -1 < i.indexOf("webkit");
                    var b = i.indexOf("android");
                    if (-1 < b) {
                        var b = b + 7,
                            c = i.indexOf(";", b),
                            b = i.substring(b, c);
                        e = parseFloat(b)
                    }
                    d = !0
                }
                $("head").append('<link rel="apple-touch-icon"  href="images/icon114x114.png" />');
                Device.isAndroid() && $("head").append('<link rel="apple-touch-icon-precomposed" href="images/icon114x114alpha.png" />');
                a();
                b = new Date;
                for (c = 2E4; c--;) Math.sqrt(c * Math.random());
                j = 1200 / (new Date - b + 1)
            },
            setStorageItem: function(a, c) {
                b() && window.localStorage.setItem(a, c)
            },
            getStorageItem: function(a, c) {
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
                return n
            },
            isTouch: function() {
                return "ontouchstart" in document.documentElement
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
                    x: a.x / Screen.widthRatio() -
                        Screen.offsetX(),
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
                    default:
                        assert(!1, "Unrecognizible event " + a)
                }
                return a
            },
            touchStartX: function() {
                return l
            },
            touchStartY: function() {
                return o
            },
            touchEndX: function() {
                return k
            },
            touchEndY: function() {
                return m
            },
            isSlow: function() {
                return Device.isAndroid() && 2.3 > Device.androidVersion() || 80 > j ? !0 : !1
            },
            addToHomeOpenPopup: function() {
                window.addToHomeOpen()
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
            b = null,
            c = null,
            d = function(a, b) {
                var c = new Image;
                c.src = a;
                c.onload = b;
                return c
            };
        return {
            init: function() {},
            setResolution: function(c) {
                assert(a[c], "Resolution " + c + " not exists!");
                b = c
            },
            setDefaultResolution: function(b) {
                assert(a[b], "Resolution " + b + " not exists!");
                c = b
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
                    for (var i in a) d.push(i)
                }
                for (i = 0; i < d.length; i++) {
                    var j = d[i];
                    assert(a[j], "Resolution " + j + " not exists!");
                    a[j].images[b] = b
                }
            },
            getImage: function(e, f, g) {
                var i = null;
                if (!b) return f && d(e, g), e;
                a[b].images[e] && (i = a[b].folder + a[b].images[e]);
                !i && c && c != b && a[c].images[e] && (i = a[c].folder + a[c].images[e]);
                i || (i = a[b].folder + e);
                f && d(e, g);
                return i
            },
            getUsedImages: function() {
                var d = [],
                    f;
                for (f in a[c].images[f]) a[b].images[f] && d.push(Resources.getImage(f));
                return d
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
                for (var j = 0, l = a.length, o, k, m = l, n = 0; j < l; ++j) {
                    o = a[j];
                    k = o.substr(o.lastIndexOf(".") + 1).toLowerCase();
                    if ("mp3" === k || "wav" === k || "ogg" === k || "mp4" === k) k = new Audio(o), -1 != navigator.userAgent.indexOf("Chrome") && n++;
                    else if ("jpg" === k || "jpeg" === k || "gif" ===
                        k || "png" === k) k = new Image, k.src = Resources.getImage(o);
                    else {
                        m--;
                        continue
                    }
                    k.onload = function() {
                        ++n;
                        c && c.call(this, {
                            loaded: n,
                            total: m,
                            percent: 100 * (n / m)
                        });
                        n === m && b && b()
                    };
                    k.onerror = function() {
                        d ? d.call(this, {
                            loaded: n,
                            total: m,
                            percent: 100 * (n / m)
                        }) : (n++, n === m && b && b())
                    }
                }
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
    if ("string" == typeof a.parent) {
        var b = Account.instance.getEntity(a.parent);
        this.assert(b, " No parent found with id='" + a.parent + "' ");
        b.addChild(this)
    } else console.log(" No parent provided for entity with id='" + this.id + "'");
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
    console.log("ENTITY READ UPDATE DAta", a);
    if (a.parent != (this.parent ? this.parent.id : null)) this.parent.removeChild(this), this.parent = null, Account.instance.getEntity(a.parent).addChild(this)
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
    console.log("OPPOPOPOPO", this);
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
var UPDATE_TIME = 20;

function Account() {
    Account.parent.constructor.call(this)
}
Account.inheritsFrom(BaseState);
Account.prototype.init = function(a) {
    a = a ? a : {};
    a.id = "Account01";
    Account.parent.init.call(this, a);
    this.allEntities = {};
    this.id = "Account01";
    this.addEntity(this);
    this.backgroundState = new BackgroundState;
    a.backgroundState = selectValue(a.backgroundState, {});
    a.backgroundState.id = "backgroundState01";
    this.backgroundState.activate(a.backgroundState.backgroundState);
    assert(null == Account.instance, "Only one account object at time are allowed");
    Account.instance = this;
    var b = this,
        c = function() {
            $.each(b.allEntities, function(a,
                b) {
                b && b.update && b.update(UPDATE_TIME)
            });
            setTimeout(c, UPDATE_TIME)
        };
    c()
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
    if (c) b || (this.removeChild(c), c.destroy()), c.children = null, delete this.allEntities[a], this.allEntities[a] = null
};
Account.prototype.removeAllEntities = function() {
    $.each(this.allEntities, function(a, b) {
        b !== Account.instance && Account.instance.removeEntity(a, !1)
    })
};
Account.prototype.readUpdate = function(a) {
    this.money = a.money;
    this.premiumMoney = a.premiumMoney;
    this.energy = a.energy;
    this.happyness = a.happyness;
    this.experience = a.experience
};
Account.prototype.writeUpdate = function(a, b) {
    this.writeUpdateProperty(b, "money", this.money);
    this.writeUpdateProperty(b, "premiuMoney", this.premiumMoney);
    this.writeUpdateProperty(b, "energy", this.energy);
    this.writeUpdateProperty(b, "happyness", this.happyness);
    this.writeUpdateProperty(b, "experience", this.experience);
    this.serverCommands = null;
    Account.parent.writeUpdate.call(this, a, b)
};
Account.prototype.resize = function() {
    null != this.children && ($.each(this.children, function(a, b) {
        b && b.resize && b.resize()
    }), this.backgroundState && this.backgroundState.resize())
};
Account.prototype.getMoney = function() {
    return this.money
};
Account.prototype.setMoney = function(a) {
    this.money = a
};
Account.prototype.getPremiumMoney = function() {
    return this.premiumMoney
};
Account.prototype.setPremiumMoney = function(a) {
    this.premiumMoney = a
};
Account.prototype.showDialog = function(a) {
    var b = 1;
    this.backgroundState.dialogs.buy.labels[1].change(b);
    var c = this;
    "settings" == a.type && (Sound.isOn() ? (c.backgroundState.dialogs[a.type].buttons.unsound.hide(), c.backgroundState.dialogs[a.type].buttons.sound.show()) : (c.backgroundState.dialogs[a.type].buttons.sound.hide(), c.backgroundState.dialogs[a.type].buttons.unsound.show()));
    a.price && this.backgroundState.dialogs[a.type].labels[2].change("" + a.price);
    a.text && this.backgroundState.dialogs[a.type].labels[0].change(a.text);
    a.icons && $.each(a.icons, function(b, e) {
        e.width && e.height && (c.backgroundState.dialogs[a.type].icons[b].setSize(e.width, e.height), c.backgroundState.dialogs[a.type].icons[b].setPosition(c.backgroundState.dialogs[a.type].width / 2 - e.width / 2), c.backgroundState.dialogs[a.type].icons[b].resize());
        c.backgroundState.dialogs[a.type].icons[b].setBackground(e.background.image)
    });
    a.callbacks && $.each(a.callbacks, function(d, e) {
        "plus" == d ? c.backgroundState.dialogs[a.type].buttons[d].bind(function() {
            if (b < a.max) b++, c.backgroundState.dialogs[a.type].labels[1].change("" +
                b), c.backgroundState.dialogs[a.type].labels[2].change("" + b * a.price), a.result = b, e(a)
        }) : "unsound" == d ? c.backgroundState.dialogs[a.type].buttons[d].bind(function() {
            this.hide();
            c.backgroundState.dialogs[a.type].buttons.sound.show();
            e(a)
        }) : "sound" == d ? c.backgroundState.dialogs[a.type].buttons[d].bind(function() {
            this.hide();
            c.backgroundState.dialogs[a.type].buttons.unsound.show();
            e(a)
        }) : "minus" == d ? c.backgroundState.dialogs[a.type].buttons[d].bind(function() {
            b--;
            1 >= b && (b = 1);
            c.backgroundState.dialogs[a.type].labels[1].change("" +
                b);
            c.backgroundState.dialogs[a.type].labels[2].change("" + b * a.price);
            a.result = b;
            e(a)
        }) : c.backgroundState.dialogs[a.type].buttons[d].bind(function() {
            a.result = b;
            e(a);
            c.backgroundState.dialogs[a.type].hide()
        })
    });
    this.backgroundState.dialogs[a.type].show();
    a.result = null
};
Account.prototype.readGlobalUpdate = function(a) {
    console.log("ELEMENT UPDATE", a);
    var b = this;
    $.each(a, function(c, d) {
        console.log("readGlobalUpdate key is ", c);
        console.log(a);
        var e = Account.instance.getEntity(c);
        e ? d.destroy ? (console.log("!!!!!Destroy entity '" + e.id + "'"), b.removeEntity(c), delete a[c]) : e.readUpdate(d) : (d.id = c, e = entityFactory.createObject(d["class"], d), b.addEntity(e), console.log("New entity '" + e.id + "' of class " + d["class"] + " with parent '" + (e.parent ? e.parent.id : "no parent") + "'"))
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
    this.server.command(a, b, function(a, b) {
        that.readGlobalUpdate(b);
        c(a)
    })
};
Account.prototype.syncWithServer = function() {
    var a = this;
    this.server.sendData(this.writeGlobalUpdate(), function(b) {
        a.readGlobalUpdate(b)
    })
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
        $.each(a.visuals, function(b, c) {
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
        var f = c.x,
            g = c.y;
        "number" == typeof b.offsetX && (f -= b.offsetX);
        "number" == typeof b.offsetY && (g -= b.offsetY);
        b.visual.setPosition(f, g)
    })
};
VisualEntity.prototype.move = function(a, b) {
    this.setPosition(this.x + a, this.y + b)
};
VisualEntity.prototype.setPositionToVisual = function(a) {
    a = this.getVisualInfo(a);
    this.x = a.visual.x + a.offsetX;
    this.y = a.visual.y + a.offsetY
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
    this.x = this.readUpdateProperty(a, "x");
    this.y = this.readUpdateProperty(a, "y");
    VisualEntity.parent.readUpdate.call(this, a);
    console.log("readUpdate", this, a)
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
    d.move(a, b);
    d.resize()
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
            } else if (!this.sprite && (this.label.change(this.description.go),
                this.EndCallback)) this.EndCallback(), this.update = null;
        if (!this.label && !this.sprite)
            if (0 < this.duration) this.duration -= a, this.cycleEndCallback && b != Math.floor(this.duration / 1E3) + 1 && this.cycleEndCallback();
            else if (this.EndCallback) this.EndCallback(), this.update = null
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
    delete this.guiEntitiesMap
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
            var l = {};
            $.each(j.actions, function(a, b) {
                var c = b[0],
                    d = b[1],
                    e = b[2];
                if ("left" == c || "width" == c) e = "number" == typeof e ? Math.round(e * Screen.widthRatio()) : e;
                else if ("top" ==
                    c || "height" == c) e = "number" == typeof e ? Math.round(e * Screen.heightRatio()) : e;
                l[c] = d + e.toString()
            });
            e.$().animate(l, j.time)
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
    if (c) return d = this.parent, this.parent = c, this.jObject && this.jObject.appendTo(c.jObject), d && b && (d = d.globalOffset(), c = c.globalOffset(), this.move(d.x - c.x, d.y - c.y)), !0;
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
        f = a.height ? Screen.macro(a.height) : this.height,
        g = a.repeat ? Screen.macro(a.repeat) : null;
    this.setBackground(a.image, e, f, c, d, g, b)
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
    this.jObject.css("cursor", "pointer");
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
                g = selectValue(a.height, d.height, b.height);
            a.scale && (f = Math.round(f * a.scale / 100), g = Math.round(g *
                a.scale / 100));
            var k = -Math.round(f / 2),
                m = -Math.round(g / 2);
            e.setOffset(k, m);
            a.background ? e.applyBackground(a.background) : e.setBackground(a.image, f, g, 0, 0);
            e.setSize(f, g);
            e.hide();
            var n;
            a.label && (c = c ? c : a.label, k = 1, "number" == typeof a.scale && (k = a.scale / 100), f = selectValue(a.label.width, c.width, b.width) * k, g = selectValue(a.label.height, c.height, b.height) * k, fontSize = selectValue(a.label.fontSize, c.fontSize) * k, k = selectValue(a.label.offsetX, c.offsetX, -Math.round(f / 2)), m = selectValue(a.label.offsetY, c.offsetY, -Math.round(g /
                2)), f = Math.round(f), g = Math.round(g), n = guiFactory.createObject("GuiLabel", {
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
                offsetX: a.label.offsetX ? k + a.label.offsetX : k,
                offsetY: a.label.offsetY ? m + a.label.offsetY : m
            }), b.children.addGui(n), n.hide());
            return {
                image: e,
                label: n,
                callback: function() {
                    if (b.currentStateParams !== a) {
                        b.currentStateParams = a;
                        var c = b.currentImage,
                            d = b.currentLabel;
                        b.currentImage = e;
                        b.currentImage && b.currentImage.show();
                        b.currentLabel = n;
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
        if (a.hover) g = e(a.hover), b.imageActive = g.image, b.activeState = g.callback
    } else {
        if (a.hover) {
            var g =
                e(a.hover);
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
    (this.backgroundShown = a) ? this.showBackground(): this.hideBackground()
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
    return "<div id='" + this.id + "' class='" + this.style + " unselectable'><div id='" + this.rowId + "' style='display:table-row;'><div id='" + this.cellId + "' style='display:table-cell;'>" + a + "</div></div></div>"
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
    this.jObject.css("background-position", Math.floor(Screen.widthRatio() *
        this.totalTile.x * this.width) + "px " + Math.floor(Screen.heightRatio() * this.height * this.totalTile.y) + "px")
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
    this.scale = (this.flipped = a) ? -1 : 1;
    this.transform()
};
GuiSprite.prototype.transform = function(a) {
    if (a) {
        if (null != a.matrix) this.matrix = a.matrix;
        if (null != a.angle) this.angle = a.angle;
        if (null != a.scale) this.scale = a.scale;
        if (null != a.translate) this.translate = a.translate
    }
    if (Device.nativeRender()) {
        var b = void 0 == this.scale ? 1 : this.scale,
            a = b * Screen.widthRatio(),
            b = b * Screen.heightRatio(),
            c = (this.x + this.width / 2) * Screen.widthRatio(),
            d = (this.y + this.height / 2) * Screen.heightRatio();
        assert(void 0 !== this.nativeRenderImageId, "nativeRenderImageId not set");
        Device.nativeRender().updateImage(this.nativeRenderImageId,
            c, d, a, b, this.angle)
    } else cssTransform(this.jObject, this.matrix, this.angle, this.scale, this.scale, this.translate)
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
    this.viewport ? this.clampByViewport() : this.setRealPosition(a, b)
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
GuiSprite.prototype.setRealBackgroundPosition = function() {
    var a = selectValue(this.frame, 0),
        b = selectValue(this.row, 0);
    this.jObject.css("background-position", Math.round(-Screen.widthRatio() * a * this.width) + "px " + Math.round(-Screen.heightRatio() * b * this.height) + "px ")
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
GuiFrame.prototype = new GuiElement;
GuiFrame.prototype.constructor = GuiFrame;

function GuiFrame() {
    GuiFrame.parent.constructor.call(this)
}
GuiFrame.inheritsFrom(GuiElement);
GuiFrame.prototype.className = "GuiFrame";
GuiFrame.prototype.createInstance = function(a) {
    var b = new GuiFrame(a.parent, "dialogButton", a.width, a.height);
    b.initialize(a);
    return b
};
GuiFrame.prototype.initialize = function(a) {
    GuiFrame.parent.initialize.call(this, a);
    this.attachedDiv = a.attachedDiv;
    this.attachedDiv = $("#" + a.attachedDiv);
    0 >= this.attachedDiv.length ? (this.hide(), console.log("Object attched to GuiFrame not exists " + a.attachedDiv)) : (this.attachedDiv.show(), this.realWidth = this.attachedDiv.width(), this.scaleFactor = a.width / (a.originalWidth ? a.originalWidth : a.width), this.attachedDiv.width(0), this.attachedDiv.height(0), this.attachedDiv.css("position", "absolute"), this.jObject.css("display",
        "none"), this.jObject.css("position", "absolute"), this.jObject.css("display", "block"), this.setZ(this.z), this.attachedDiv.css("z-index", 999))
};
GuiFrame.prototype.resize = function() {
    GuiFrame.parent.resize.call(this);
    if (this.attachedDiv) {
        var a = Screen.widthRatio() * this.scaleFactor,
            b = Screen.heightRatio() * this.scaleFactor,
            c = this.jObject.offset();
        cssTransform(this.attachedDiv, null, null, a, b, {
            x: c.left,
            y: c.top
        })
    }
};
GuiFrame.prototype.setZ = function(a) {
    GuiFrame.parent.setZ.call(this, a);
    this.attachedDiv && this.z && this.attachedDiv.css("z-index", this.z)
};
GuiFrame.prototype.show = function() {
    GuiFrame.parent.show.call(this);
    this.attachedDiv && (this.attachedDiv.show(), this.resize())
};
GuiFrame.prototype.hide = function() {
    GuiFrame.parent.hide.call(this);
    this.attachedDiv && this.attachedDiv.hide()
};
GuiFrame.prototype.remove = function() {
    GuiFrame.parent.remove.call(this);
    this.attachedDiv && this.attachedDiv.hide()
};
guiFactory.addClass(GuiFrame);
GameBaseState.prototype = new GuiContainer;
GameBaseState.prototype.constructor = GameBaseState;

function GameBaseState() {
    GameBaseState.parent.constructor.call(this);
    GameBaseState.parent.init.call(this);
    this.timeouts = [];
    this.intervals = []
}
GameBaseState.inheritsFrom(GuiContainer);
GameBaseState.prototype.init = function() {};
GameBaseState.prototype.activate = function() {
    this.resources ? this.preload() : (this.init(), this.postInit())
};
GameBaseState.prototype.preload = function() {
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
GameBaseState.prototype.jsonPreloadComplete = function() {
    var a = this;
    this.resources.media ? loadArt(this.resources.media, function() {
        a.preloadComplete()
    }) : this.preloadComplete()
};
GameBaseState.prototype.preloadComplete = function() {
    this.init();
    this.postInit()
};
GameBaseState.prototype.preloadJson = function(a) {
    if (!this.resources) this.resources = {};
    if (!this.resources.json) this.resources.json = {};
    "string" === typeof a ? this.resources.json[a] = null : "array" === typeof a ? $.each(this.resources.json, function(a, c) {
        this.resources.json[c] = null
    }) : console.error("Invalid argument for preloadJson: should be array of json urls or single url.")
};
GameBaseState.prototype.preloadMedia = function(a) {
    if (!this.resources) this.resources = {};
    if (!this.resources.media) this.resources.media = [];
    "array" === typeof a ? this.resources.media.concat(a) : console.error("Invalid argument for preloadMedia: array of media urls.")
};
GameBaseState.prototype.postInit = function() {
    for (var a = 0; a < this.guiEntities.length; a++) this.guiEntities[a].postInit && this.guiEntities[a].postInit()
};
GameBaseState.prototype.setInterval = function(a, b) {
    var c = setInterval(a, b);
    this.intervals.push(c);
    return c
};
GameBaseState.prototype.setTimeout = function(a, b) {
    var c = setTimeout(a, b);
    this.timeouts.push(c);
    return c
};
GameBaseState.prototype.clearTimeout = function(a) {
    clearTimeout(a)
};
GameBaseState.prototype.clearInterval = function(a) {
    clearInterval(a)
};
GameBaseState.prototype.clearTimeouts = function() {
    for (var a in this.intervals) clearInterval(this.intervals[a]);
    this.intervals = [];
    for (a in this.timeouts) clearTimeout(this.timeouts[a]);
    this.timeouts = []
};
GameBaseState.prototype.clear = function() {
    GameBaseState.parent.clear.call(this);
    this.clearTimeouts()
};

function assert() {}
console.log = function() {};
var CARD_APPEAR_STATE = "MemoryGameCardAppearState";

function MemoryGameCardAppearState(a, b, c) {
    this.name = CARD_APPEAR_STATE;
    this.card = a;
    this.card.card.hide();
    this.card.item.hide();
    this.card.removed = !1;
    this.card.lucky = !1;
    var d = this;
    this.card.delayedStateHandle = setTimeout(function() {
        d.card.card.show();
        Sound.play("cardAppears");
        d.card.card.playAnimation("appear", c, null, null);
        d.card.card.setAnimationEndCallback(function() {
            d.card.setState(new MemoryGameCardIdleState(d.card))
        })
    }, a.number * b);
    this.update = function() {}
}
var CARD_DISAPPEAR_STATE = "MemoryGameCardDisappearState";

function MemoryGameCardDisappearState(a) {
    this.name = CARD_DISAPPEAR_STATE;
    this.card = a;
    this.card.card.playAnimation("disappear", 2 * a.animationDelay, !1);
    var b = this;
    b.card.card.setAnimationEndCallback(function() {
        b.card.card.hide()
    });
    this.card.item.hide();
    this.update = function() {}
}
var CARD_FADE_STATE = "MemoryGameCardFadeState";

function MemoryGameCardFadeState(a) {
    this.name = CARD_FADE_STATE;
    this.card = a;
    a.card.playAnimation(a.lucky ? "luckyFade" : "fade", null, !1);
    a.item.hide();
    this.update = function() {}
}
var CARD_IDLE_STATE = "MemoryGameCardIdleState";

function MemoryGameCardIdleState(a) {
    this.name = CARD_IDLE_STATE;
    this.card = a;
    this.card.card.show();
    this.update = function() {}
}
var CARD_ROLL_STATE = "MemoryGameCardRollState";

function MemoryGameCardRollState(a) {
    this.name = CARD_ROLL_STATE;
    this.card = a;
    if (this.card.flipped) {
        this.card.card.playAnimation("toWhat", a.animationDelay);
        var b = this;
        this.card.card.setAnimationEndCallback(function() {
            b.card.item.hide()
        });
        this.card.item.playAnimation("toWhat" + this.card.type, a.animationDelay)
    } else this.card.card.playAnimation("toCard", a.animationDelay), this.card.item.playAnimation("toCard" + this.card.type, a.animationDelay), this.card.item.show();
    a.flipped = !a.flipped;
    this.update = function() {}
}
MemoryGameCard.prototype = new VisualEntity;
MemoryGameCard.prototype.constructor = MemoryGameCard;

function MemoryGameCard() {
    MemoryGameCard.parent.constructor.call(this);
    this.type = 0;
    this.flipped = !1;
    this.state = null;
    this.lucky = !1
}
MemoryGameCard.inheritsFrom(VisualEntity);
MemoryGameCard.prototype.className = "MemoryGameCard";
MemoryGameCard.prototype.createInstance = function(a) {
    var b = new MemoryGameCard;
    b.init(a);
    return b
};
entityFactory.addClass(MemoryGameCard);
MemoryGameCard.prototype.init = function(a) {
    MemoryGameCard.parent.init.call(this, a)
};
MemoryGameCard.prototype.createVisual = function() {
    MemoryGameCard.parent.createVisual.call(this);
    this.itemDescription = Account.instance.descriptionsData[this.params.itemDescription];
    this.assert(this.itemDescription, "There is no correct item description");
    this.paddingDescription = Account.instance.descriptionsData[this.params.paddingDescription];
    this.assert(this.paddingDescription, "There is no correct padding description");
    this.animationDelay = this.params.animationDelay;
    this.card = guiFactory.createObject("GuiSprite", {
        parent: this.guiParent,
        style: "sprite",
        x: this.params.x,
        y: this.params.y,
        width: this.description.width,
        height: this.description.height,
        totalImage: Resources.getImage(this.paddingDescription.totalImage),
        totalImageWidth: this.paddingDescription.totalImageWidth,
        totalImageHeight: this.paddingDescription.totalImageHeight,
        totalTile: this.paddingDescription.totalTile,
        spriteAnimations: {
            appear: {
                frames: [0],
                row: 0
            },
            disappear: {
                frames: [0, 1, 2, 3, 7],
                row: 0
            },
            toCard: {
                frames: [0, 1, 2, 3, 4, 5, 6],
                row: 0
            },
            toWhat: {
                frames: [6, 5, 4, 3, 2, 1,
                    0
                ],
                row: 0
            },
            fade: {
                frames: [0, 1, 2, 3, 4, 5],
                row: 1,
                frameDuration: 50
            },
            luckyFade: {
                frames: [0, 1, 2, 3, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 8, 9],
                row: 1,
                frameDuration: 50
            }
        }
    });
    var a = {};
    a.visual = this.card;
    this.addVisual("card", a);
    this.item = guiFactory.createObject("GuiSprite", {
        parent: this.guiParent,
        style: "sprite",
        x: this.params.x,
        y: this.params.y,
        width: this.description.width,
        height: this.description.height,
        totalImage: Resources.getImage(this.itemDescription.totalImage),
        totalImageWidth: this.itemDescription.totalImageWidth,
        totalImageHeight: this.itemDescription.totalImageHeight,
        totalTile: this.itemDescription.totalTile
    });
    a = {};
    a.visual = this.item;
    this.addVisual("item", a);
    this.item.addAnimation("toCard" + this.type, [3, 3, 3, 3, 2, 1, 0], this.type);
    this.item.addAnimation("toWhat" + this.type, [0, 1, 2, 3, 3, 3, 3], this.type)
};
MemoryGameCard.prototype.destroy = function() {
    MemoryGameCard.parent.destroy.call(this);
    this.guiParent && this.guiParent.removeGui(this.card);
    this.guiParent && this.guiParent.removeGui(this.item)
};
MemoryGameCard.prototype.setState = function(a) {
    this.state = a
};
MemoryGameCard.prototype.getState = function() {
    return this.state
};
MemoryGameCard.prototype.flip = function() {
    this.setState(new MemoryGameCardRollState(this))
};
MemoryGameCard.prototype.getPosition = function() {
    return {
        x: this.card.x * Screen.widthRatio(),
        y: this.card.y * Screen.heightRatio()
    }
};
MemoryGameCard.prototype.getSize = function() {
    return {
        w: this.card.width * Screen.widthRatio(),
        h: this.card.height * Screen.heightRatio()
    }
};
MemoryGameCard.prototype.remove = function() {
    this.removed = !0;
    this.setState(new MemoryGameCardFadeState(this))
};
MemoryGameCard.prototype.update = function(a) {
    this.card && this.card.update(a);
    this.item && this.item.update(a)
};
MemoryGameCardPool.prototype = new Entity;
MemoryGameCardPool.prototype.constructor = MemoryGameCardPool;

function MemoryGameCardPool() {
    MemoryGameCardPool.parent.constructor.call(this)
}
MemoryGameCardPool.inheritsFrom(Entity);
MemoryGameCardPool.prototype.className = "MemoryGameCardPool";
MemoryGameCardPool.prototype.createInstance = function(a) {
    var b = new MemoryGameCardPool;
    b.init(a);
    return b
};
entityFactory.addClass(MemoryGameCardPool);
MemoryGameCardPool.prototype.setScoreListener = function(a) {
    this.scoreListener = a
};
MemoryGameCardPool.prototype.init = function(a) {
    MemoryGameCardPool.parent.init.call(this, a);
    this.rows = a.rows;
    this.columns = a.columns;
    this.description = Account.instance.descriptionsData[a.description];
    this.itemDescription = Account.instance.descriptionsData[a.itemDescription];
    this.paddingDescription = Account.instance.descriptionsData[a.paddingDescription];
    this.flipTimeout = a.flipTimeout;
    this.clickedEntities = [];
    this.canPush = !0;
    this.dealCards()
};
MemoryGameCardPool.prototype.remove = function() {
    this.removeCards();
    this.clearTimeouts()
};
MemoryGameCardPool.prototype.removeCards = function() {
    if (this.cards && 0 < this.cards.length)
        for (var a = 0; a < this.cards.length; a++) this.cards[a].destroy()
};
MemoryGameCardPool.prototype.dealCards = function() {
    this.clickedEntities = [];
    this.removeCards();
    this.cards = [];
    for (var a = [], b = [], c = 0; 4 > b.length;) {
        for (var c = Math.floor(Math.random() * (this.itemDescription.types.length - 1)), c = this.itemDescription.types[c], d = !1, e = 0; e < b.length; e++)
            if (c == b[e]) {
                d = !0;
                break
            }
        d || b.push(c)
    }
    for (d = 0; d < this.rows; d++)
        for (e = 0; e < this.columns; e++) {
            for (var f = null, f = !1; !f;) c = b[Math.floor(4 * Math.random())], a[c] || (a[c] = 0), 2 > a[c] && (a[c] += 1, f = !0);
            var f = this.itemDescription.types[c],
                g = entityFactory.createObject("MemoryGameCard", {
                    "class": "MemoryGameCard",
                    parent: this,
                    description: this.params.description,
                    paddingDescription: this.params.paddingDescription,
                    itemDescription: this.params.itemDescription,
                    animationDelay: this.params.animationDelay,
                    x: this.params.x + this.description.width * e,
                    y: this.params.y + this.description.height * d
                });
            g.type = f;
            g.number = d * this.columns + e + 1;
            this.cards.push(g)
        }
};

function FunctionBinder(a, b, c) {
    this.entity = c;
    b.bind(function() {
        c.removed || a.pushOnEntity(c)
    })
}
MemoryGameCardPool.prototype.attachToGui = function(a) {
    var b = this;
    this.guiParent = a;
    for (var c = 0; c < this.cards.length; c++) {
        var d = this.cards[c];
        d.attachToGui(a);
        new FunctionBinder(b, d.card, d, function() {
            b.pushOnEntity(d)
        });
        d.setState(new MemoryGameCardAppearState(d, 100, 500))
    }
};
MemoryGameCardPool.prototype.pushOnEntity = function(a) {
    if (this.canPush && !this.scoreListener.isGameFinished() && !a.flipped && !a.removed) {
        var b = this,
            c = [];
        a.flip();
        for (a = 0; a < this.cards.length; a++) this.cards[a].flipped && c.push(this.cards[a]);
        if (2 == c.length) {
            c[0].type === c[1].type ? (this.canPush = !1, this.setTimeout(function() {
                c[0].flipped = !1;
                c[0].remove()
            }, this.flipTimeout), this.setTimeout(function() {
                    c[1].flipped = !1;
                    c[1].remove();
                    b.canPush = !0;
                    Sound.play(c[1].lucky ? "lucky" : "pairSuccess");
                    b.checkCardPoolEmpty()
                },
                this.flipTimeout)) : (this.canPush = !1, this.setTimeout(function() {
                b.scoreListener.isGameFinished() || c[0].flip()
            }, this.flipTimeout), this.setTimeout(function() {
                b.scoreListener.isGameFinished() || c[1].flip();
                b.canPush = !0
            }, this.flipTimeout));
            if (1 < isInArray(c[0].number, this.clickedEntities) || 1 < isInArray(c[1].number, this.clickedEntities)) this.multiplyerValue = 1;
            c[0].type === c[1].type ? 0 == isInArray(c[0].number, this.clickedEntities) && 0 == isInArray(c[1].number, this.clickedEntities) ? (c[0].lucky = !0, c[1].lucky = !0, this.scoreListener.luckyBonus()) :
                0 < isInArray(c[0].number, this.clickedEntities) && 0 < isInArray(c[1].number, this.clickedEntities) ? this.scoreListener.bothCardsWasOpen() : this.scoreListener.firstOpenJustOneCard() : 0 == isInArray(c[0].number, this.clickedEntities) && 0 == isInArray(c[1].number, this.clickedEntities) ? this.scoreListener.firstOpenBothCards() : this.scoreListener.secondOpenOneCard();
            this.clickedEntities.push(c[0].number);
            this.clickedEntities.push(c[1].number)
        }
    }
};
MemoryGameCardPool.prototype.checkCardPoolEmpty = function() {
    for (var a = !0, b = 0; b < this.cards.length; b++)
        if (!this.cards[b].removed) {
            a = !1;
            break
        }
    a && this.scoreListener.cardPoolEmpty()
};
MemoryGameCardPool.prototype.update = function(a) {
    for (var b = 0; b < this.cards.length; b++) this.cards[b].update(a)
};
MemoryGameCardPool.prototype.resize = function() {
    for (var a = 0; a < this.cards.length; a++) this.cards[a].resize()
};
var CARD_WIDTH = 170,
    CARD_HEIGHT = 170,
    TIMER_WIDTH = 141,
    TIMER_HEIGHT = 141,
    ITEMS_PNG = "images/memoryGame/items.png",
    CARD_TOTAL_PNG = "images/memoryGame/cardTotal.png",
    ITEM_SMALL_PNG = "images/memoryGame/itemsSmall.png",
    CARD_SMALL_TOTAL_PNG = "images/memoryGame/cardTotalSmall.png",
    ITEM_MEDIUM_PNG = "images/memoryGame/itemsMedium.png",
    CARD_MEDIUM_TOTAL_PNG = "images/memoryGame/cardTotalMedium.png",
    BACKGROUND_PNG = "images/memoryGame/background.png",
    BACKGROUND_SMALL_PNG = "images/memoryGame/background_small.png",
    BACKGROUND =
    "background",
    TIMER = "memoryGameTimer",
    WHAT = "what",
    CARD = "card",
    MEMORY_GAME_MENU_GUI_JSON = "resources/ui/memoryGameMenu.json",
    DESCRIPTIONS_FILE = "resources/descriptions.json";
MemoryGameMenuState.prototype = new BaseState;
MemoryGameMenuState.prototype.constructor = MemoryGameMenuState;

function MemoryGameMenuState() {
    this.preloadJson(MEMORY_GAME_MENU_GUI_JSON);
    this.preloadJson(DESCRIPTIONS_FILE);
    this.preloadMedia("backdrop.png,background.png,cardTotal.png,clock.png,credits.png,greenChips.png,heightBar.png,highscores.png,items.png,loading.png,eliteCoder.png,mask.png,memoryGame.png,menu.png,multiplier.png,ok.png,pattern.png,pause.png,pauseScreen.png,play.png,playAgain.png,restart.png,resume.png,score.png,soundOff.png,soundOn.png,timer.png,wellDone.png".split(","));
    MemoryGameMenuState.parent.constructor.call(this)
}
MemoryGameMenuState.inheritsFrom(BaseState);
MemoryGameMenuState.prototype.className = "MemoryGameMenuState";
MemoryGameMenuState.prototype.createInstance = function(a) {
    var b = new MemoryGameMenuState;
    b.activate(a);
    return b
};
MemoryGameMenuState.prototype.jsonPreloadComplete = function() {
    Account.instance.descriptionsData = this.resources.json[DESCRIPTIONS_FILE];
    MemoryGameMenuState.parent.jsonPreloadComplete.call(this)
};
MemoryGameMenuState.prototype.init = function(a) {
    MemoryGameMenuState.parent.init.call(this, a);
    Device.addToHomeOpenPopup();
    guiFactory.createGuiFromJson(this.resources.json[MEMORY_GAME_MENU_GUI_JSON], this);
    var b = this,
        c = this.getGui("enhancedScene");
    this.getGui("play").bind(function() {
        Sound.play("click");
        Account.instance.switchState("MemoryGamePrepareState01", b.id, b.parent.id)
    });
    var d = this.getGui("sound");
    d.bind(function() {
        d.hide();
        e.show();
        Sound.turnOn(!1)
    });
    var e = this.getGui("unsound");
    e.bind(function() {
        d.show();
        e.hide();
        Sound.turnOn(!0);
        Sound.play("click")
    });
    Sound.isOn() ? (d.show(), e.hide()) : (d.hide(), e.show());
    this.getGui("highscores").bind(function() {
        alert("Highscores not implemented")
    });
    var a = this.getGui("credits"),
        f = this.getGui("creditsDialog");
    a.bind(function(a) {
        f.show();
        b.scroll.refresh();
        a.preventDefault();
        Sound.play("click")
    });
    this.getGui("resume").bind(function() {
        Sound.play("click");
        setTimeout(function() {
            f.hide()
        }, 200)
    });
    this.scroll = this.getGui("scroll");
    var a = this.getGui("backMask"),
        g = this.getGui("logo"),
        i = this.getGui("text");
    i.append("<span id='creditsLabel'><br><b><big> Game For Envato By Elite Coder </span>");
    i.align("center");
    this.scroll.addListItem(g);
    this.scroll.addListItem(i);
    this.scroll.addListItem(a);
    this.resize();
    Loader.loadingMessageShowed() ?
        Account.instance.backgroundState.fadeIn(LEVEL_FADE_TIME, "black", function() {
            Loader.hideLoadingMessage();
            c.show();
            b.setTimeout(function() {
                b.resize();
                Account.instance.backgroundState.fadeOut(LEVEL_FADE_TIME)
            }, 200);
            $(window).trigger("resize")
        }) : (c.show(), Account.instance.backgroundState.fadeOut(LEVEL_FADE_TIME, function() {
            $(window).trigger("resize")
        }));
    this.resize()
};
var MEMORY_GAME_PREPARE_GUI_JSON = "resources/ui/memoryGamePrepare.json",
    PREPARE_TIPS_ARRAY = ["find the matching pairs as fast as possible", "making no mistakes multiplies your score", "lucky bonus awarded for guessing pair"];
MemoryGamePrepareState.prototype = new BaseState;
MemoryGamePrepareState.prototype.constructor = MemoryGamePrepareState;

function MemoryGamePrepareState() {
    this.preloadJson(MEMORY_GAME_PREPARE_GUI_JSON);
    MemoryGamePrepareState.parent.constructor.call(this)
}
MemoryGamePrepareState.inheritsFrom(BaseState);
MemoryGamePrepareState.prototype.className = "MemoryGamePrepareState";
MemoryGamePrepareState.prototype.createInstance = function(a) {
    var b = new MemoryGamePrepareState;
    b.activate(a);
    return b
};
MemoryGamePrepareState.prototype.jsonPreloadComplete = function() {
    MemoryGamePrepareState.parent.jsonPreloadComplete.call(this)
};
MemoryGamePrepareState.prototype.init = function(a) {
    MemoryGamePrepareState.parent.init.call(this, a);
    guiFactory.createGuiFromJson(this.resources.json[MEMORY_GAME_PREPARE_GUI_JSON], this);
    var b = this,
        c = this.getGui("findTheMatchingPairs"),
        d = Device.getStorageItem("currentTip", "0").toString();
    c.change(PREPARE_TIPS_ARRAY[d]);
    d++;
    d >= PREPARE_TIPS_ARRAY.length && (d = 0);
    Device.setStorageItem("currentTip", d);
    this.initChildren(a);
    this.countdown = Account.instance.getEntity("countdown");
    this.countdown.attachToGui(this.getGui("menuContainer"));
    this.countdown.setCycleEndCallback(function() {
        console.log("1");
        Sound.play("beepShort");
        console.log("2")
    });
    this.countdown.setEndCallback(function() {
        console.log("3");
        Sound.play("beepShort");
        b.setTimeout(function() {
            Account.instance.switchState("MemoryGameState01", b.id, b.parent.id)
        }, 500)
    });
    this.countdown.show();
    Account.instance.backgroundState.fadeOut(LEVEL_FADE_TIME, function() {
        $(window).trigger("resize")
    });
    this.resize()
};
var MEMORY_GAME_GUI_JSON = "resources/ui/memoryGame.json";
MemoryGameState.prototype = new BaseState;
MemoryGameState.prototype.constructor = MemoryGameState;

function MemoryGameState() {
    this.preloadJson(MEMORY_GAME_GUI_JSON);
    MemoryGameState.parent.constructor.call(this)
}
MemoryGameState.inheritsFrom(BaseState);
MemoryGameState.prototype.className = "MemoryGameState";
MemoryGameState.prototype.createInstance = function(a) {
    var b = new MemoryGameState;
    b.activate(a);
    return b
};
MemoryGameState.prototype.jsonPreloadComplete = function() {
    MemoryGameState.parent.jsonPreloadComplete.call(this)
};
MemoryGameState.prototype.init = function(a) {
    MemoryGameState.parent.init.call(this, a);
    guiFactory.createGuiFromJson(this.resources.json[MEMORY_GAME_GUI_JSON], this);
    this.PauseDialog = null;
    this.luckyBonusScore = a.luckyBonusScore;
    this.rightPairScore = a.rightPairScore;
    var b = this;
    this.gameFinished = !1;
    this.scoreValue = 0;
    this.multiplyerValue = 1;
    this.luckyBonusValue = 0;
    this.score = this.getGui("score");
    this.multiplyer = this.getGui("multiplyer");
    this.initChildren(a);
    this.cardPool = Account.instance.getEntity("cardPool");
    this.cardPool.attachToGui(this.getGui("menuContainer"));
    this.countdown = Account.instance.getEntity("simpleCountdown");
    this.countdown.attachToGui(this.getGui("clock"));
    this.countdown.setCycleEndCallback(function() {
        b.countdown.setCycleEndCallback(null);
        Sound.stop();
        Sound.play("timeIsUp");
        b.cardPool.removeCards();
        b.getGui("timeIsUp").show();
        b.setTimeout(function() {
            Account.instance.scored = b.scoreValue;
            Account.instance.bonus = b.luckyBonusValue;
            Account.instance.switchState("MemoryGameWellDoneState01", b.id,
                b.parent.id)
        }, b.params.timeIsUpDelay)
    });
    this.cardPool.setScoreListener(this);
    this.updateScores();
    var a = this.getGui("pause"),
        c = this.getGui("pauseDialog");
    a.bind(function() {
        Sound.play("click");
        c.show();
        b.countdown.pause()
    });
    this.getGui("pauseDialogResume").bind(function() {
        Sound.play("click");
        setTimeout(function() {
            c.hide();
            b.countdown.resume()
        }, 200)
    });
    this.getGui("pauseDialogRestart").bind(function() {
        Sound.play("click");
        Account.instance.switchState("MemoryGamePrepareState01", b.id, b.parent.id)
    });
    this.getGui("pauseDialogMenu").bind(function() {
        Sound.play("click");
        Account.instance.switchState("MemoryGameMenuState01", b.id, b.parent.id)
    });
    var d = this.getGui("pauseDialogSoundOn");
    d.bind(function() {
        d.hide();
        e.show();
        Sound.turnOn(!1);
        Sound.play("click")
    });
    var e = this.getGui("pauseDialogSoundOff");
    e.bind(function() {
        d.show();
        e.hide();
        Sound.turnOn(!0);
        Sound.play("click")
    });
    Sound.isOn() ? (d.show(), e.hide()) : (d.hide(), e.show());
    Loader.loadingMessageShowed() ? Account.instance.backgroundState.fadeIn(LEVEL_FADE_TIME, "black", function() {
        Account.instance.backgroundState.fadeOut(LEVEL_FADE_TIME);
        Loader.hideLoadingMessage();
        $(window).trigger("resize")
    }) : Account.instance.backgroundState.fadeOut(LEVEL_FADE_TIME, function() {
        $(window).trigger("resize")
    });
    this.resize()
};
MemoryGameState.prototype.luckyBonus = function() {
    console.log("luckyBonus");
    this.luckyBonusValue += this.luckyBonusScore;
    this.multiplyerValue++;
    this.updateScores()
};
MemoryGameState.prototype.bothCardsWasOpen = function() {
    console.log("bothCardsWasOpen");
    this.scoreValue += this.multiplyerValue * this.rightPairScore;
    this.updateScores()
};
MemoryGameState.prototype.firstOpenJustOneCard = function() {
    console.log("firstOnenJustOneCard");
    this.scoreValue += this.multiplyerValue * this.rightPairScore;
    this.multiplyerValue++;
    this.updateScores()
};
MemoryGameState.prototype.firstOpenBothCards = function() {
    console.log("firstOnenBothCards")
};
MemoryGameState.prototype.secondOpenOneCard = function() {
    console.log("secondOpenOneCard");
    this.multiplyerValue = 1;
    this.updateScores()
};
MemoryGameState.prototype.cardPoolEmpty = function() {
    console.log("cardPoolEmpty");
    this.gameFinished = !0;
    var a = this;
    this.countdown.getTimeRemains() > 3 * this.params.cardDealDelay && this.setTimeout(function() {
        a.gameFinished = !1;
        a.cardPool.dealCards();
        a.cardPool.attachToGui(a.getGui("menuContainer"))
    }, this.params.cardDealDelay)
};
MemoryGameState.prototype.updateScores = function() {
    this.score.change(this.scoreValue + this.luckyBonusValue);
    this.multiplyer.change("X" + this.multiplyerValue)
};
MemoryGameState.prototype.isGameFinished = function() {
    return this.gameFinished
};
var MEMORY_GAME_WELLDONE_GUI_JSON = "resources/ui/memoryGameWellDone.json";
MemoryGameWellDoneState.prototype = new BaseState;
MemoryGameWellDoneState.prototype.constructor = MemoryGameWellDoneState;

function MemoryGameWellDoneState() {
    this.preloadJson(MEMORY_GAME_WELLDONE_GUI_JSON);
    MemoryGameWellDoneState.parent.constructor.call(this)
}
MemoryGameWellDoneState.inheritsFrom(BaseState);
MemoryGameWellDoneState.prototype.className = "MemoryGameWellDoneState";
MemoryGameWellDoneState.prototype.createInstance = function(a) {
    var b = new MemoryGameWellDoneState;
    b.activate(a);
    return b
};
MemoryGameWellDoneState.prototype.jsonPreloadComplete = function() {
    MemoryGameWellDoneState.parent.jsonPreloadComplete.call(this)
};
MemoryGameWellDoneState.prototype.init = function(a) {
    MemoryGameWellDoneState.parent.init.call(this, a);
    guiFactory.createGuiFromJson(this.resources.json[MEMORY_GAME_WELLDONE_GUI_JSON], this);
    this.scored = Account.instance.scored;
    this.bonus = Account.instance.bonus;
    this.total = this.scored + this.bonus;
    var b = this;
    this.getGui("playAgain").bind(function() {
        Sound.play("click");
        b.clearTimeouts();
        Sound.stop(0);
        Account.instance.switchState("MemoryGamePrepareState01", b.id, b.parent.id)
    });
    this.getGui("menu").bind(function() {
        Sound.play("click");
        b.clearTimeouts();
        Sound.stop(0);
        Account.instance.switchState("MemoryGameMenuState01", b.id, b.parent.id)
    });
    a = this.getGui("currentRecord");
    currentRecordScore = Device.getStorageItem("recordScore", 0);
    a.change("RECORD: " + currentRecordScore);
    var c = this.getGui("recordNew");
    cssTransform(c.$(), null, -20);
    var d = this.getGui("score"),
        e = 0,
        f = function() {
            e += 100;
            e > b.scored ? (d.change(b.scored), b.setTimeout(function() {
                1E3 < b.bonus && Sound.play(0, "scoreCounter", !0);
                j()
            }, 900), 0 < b.scored && Sound.play(0, "ding")) : (d.change(e),
                b.setTimeout(f, b.params.advanceScoreDelay))
        },
        g = this.getGui("luckyBonus"),
        i = 0,
        j = function() {
            i += 100;
            i > b.bonus ? (g.change(b.bonus), 0 < b.bonus && Sound.play(0, "ding"), this.setTimeout(function() {
                1E3 < b.total && Sound.play(0, "scoreCounter", !0);
                k()
            }, 900)) : (g.change(i), b.setTimeout(j, b.params.advanceLuckyBonusDelay))
        },
        l = this.getGui("total"),
        o = 0,
        k = function() {
            o += 100;
            if (o > b.total) {
                l.change(b.total);
                var a = Device.getStorageItem("recordScore", 0);
                b.total > a ? (Device.setStorageItem("recordScore", b.total), c.show(), Sound.play(0,
                    "timeIsUp")) : 0 < b.total && Sound.play(0, "ding")
            } else l.change(o), b.setTimeout(k, b.params.advanceTotalDelay)
        };
    this.setTimeout(function() {
        1E3 < b.scored && Sound.play(0, "scoreCounter", !0);
        f()
    }, 1E3);
    Account.instance.backgroundState.fadeOut(LEVEL_FADE_TIME, function() {
        $(window).trigger("resize")
    });
    this.resize()
};
entityFactory.addClass(MemoryGameMenuState);
entityFactory.addClass(MemoryGamePrepareState);
entityFactory.addClass(MemoryGameState);
entityFactory.addClass(MemoryGameWellDoneState);
window.onload = function() {
    (new MemoryGameAccount).init();
    Device.init();
    Resources.init();
    Resources.addResolution("low", "images/low/");
    Resources.addResolution("normal", "images/", !0);
    Device.isSlow() && Resources.setResolution("low");
    Resources.preloadFonts(["paytone-normal", "lcdmono-ultra"]);
    Sound.init("sounds/total", null, "js/");
    Sound.add("click", "sounds/click", 1, 1.2);
    Sound.add("scoreCounter", "sounds/scoreCounter", 3, 4.2);
    Sound.add("timeIsUp", "sounds/timeIsUp", 9, 2.3);
    Sound.add("ding", "sounds/ding", 13, 0.6);
    Sound.add("beepShort", "sounds/beepShort", 16, 1);
    Sound.add("cardAppears", "sounds/cardAppears", 18, 0.2, !0);
    Sound.add("lucky", "sounds/lucky", 20, 2);
    Sound.add("pairSuccess", "sounds/pairSuccess", 24, 1);
    Sound.add("pairFail", "sounds/cardAppears", 18, 0.6);
    Screen.init(Account.instance);
    Account.instance.readGlobalUpdate({
        Account01: {
            "class": "Account",
            state: "MemoryGameMenuState01"
        },
        MemoryGameMenuState01: {
            "class": "MemoryGameMenuState",
            parent: "Account01"
        }
    })
};
MemoryGameAccount.prototype = new Account;
MemoryGameAccount.prototype.constructor = MemoryGameAccount;

function MemoryGameAccount() {
    MemoryGameAccount.parent.constructor.call(this)
}
MemoryGameAccount.inheritsFrom(Account);
MemoryGameAccount.prototype.className = "MemoryGameAccount";
MemoryGameAccount.prototype.init = function() {
    MemoryGameAccount.parent.init.call(this);
    this.states = {};
    this.states.MemoryGameMenuState01 = {
        MemoryGameMenuState01: {
            "class": MemoryGameMenuState.prototype.className,
            children: {}
        }
    };
    this.states.MemoryGamePrepareState01 = {
        MemoryGamePrepareState01: {
            "class": MemoryGamePrepareState.prototype.className,
            children: {
                countdown: {
                    "class": "Countdown",
                    parent: "MemoryGamePrepareState01",
                    description: "countdown",
                    count: 3,
                    x: 330,
                    y: 180
                }
            }
        }
    };
    this.states.MemoryGameState01 = {
        MemoryGameState01: {
            "class": MemoryGameState.prototype.className,
            parent: "Account01",
            rightPairScore: 100,
            luckyBonusScore: 1E3,
            cardDealDelay: 500,
            timeIsUpDelay: 1E3,
            cardCreateDelay: 100,
            cardAppearDelay: 500,
            children: {
                cardPool: {
                    "class": "MemoryGameCardPool",
                    parent: "MemoryGameState01",
                    rows: 2,
                    columns: 4,
                    description: "card",
                    itemDescription: "cardItem",
                    paddingDescription: "cardPadding",
                    flipTimeout: 500,
                    animationDelay: 300,
                    x: 95,
                    y: 100
                },
                simpleCountdown: {
                    "class": "SimpleCountdown",
                    parent: "MemoryGameState01",
                    description: "simpleCountdown",
                    count: 30,
                    alarmCount: 5,
                    x: -4,
                    y: -3
                }
            }
        }
    };
    this.states.MemoryGameWellDoneState01 = {
        MemoryGameWellDoneState01: {
            "class": MemoryGameWellDoneState.prototype.className,
            advanceScoreDelay: 50,
            advanceLuckyBonusDelay: 50,
            advanceTotalDelay: 50
        }
    };
    Account.instance = this
};
MemoryGameAccount.prototype.switchState = function(a, b, c) {
    var d = this;
    this.backgroundState.fadeIn(LEVEL_FADE_TIME, "black", function() {
        var e = {};
        $.each(Account.instance.states, function(f) {
            if (f === a) e = Account.instance.states[f], e[f].parent = c, e[b] = {
                destroy: !0
            }, d.readGlobalUpdate(e)
        })
    })
};
MemoryGameAccount.prototype.resize = function() {
    MemoryGameAccount.parent.resize.call(this)
};