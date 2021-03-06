function css_browser_selector(f) {
    var g = f.toLowerCase(),
        f = function(f) {
            return -1 < g.indexOf(f)
        },
        m = document.documentElement;
    c = [!/opera|webtv/i.test(g) && /msie\s(\d)/.test(g) ? "ie ie" + RegExp.$1 : f("firefox/2") ? "gecko ff2" : f("firefox/3.5") ? "gecko ff3 ff3_5" : f("firefox/3.6") ? "gecko ff3 ff3_6" : f("firefox/3") ? "gecko ff3" : f("gecko/") ? "gecko" : f("opera") ? "opera" + (/version\/(\d+)/.test(g) ? " opera" + RegExp.$1 : /opera(\s|\/)(\d+)/.test(g) ? " opera" + RegExp.$2 : "") : f("konqueror") ? "konqueror" : f("blackberry") ? "mobile blackberry" :
        f("android") ? "mobile android" : f("chrome") ? "webkit chrome" : f("iron") ? "webkit iron" : f("applewebkit/") ? "webkit safari" + (/version\/(\d+)/.test(g) ? " safari" + RegExp.$1 : "") : f("mozilla/") ? "gecko" : "", f("j2me") ? "mobile j2me" : f("iphone") ? "mobile iphone" : f("ipod") ? "mobile ipod" : f("ipad") ? "mobile ipad" : f("mac") ? "mac" : f("darwin") ? "mac" : f("webtv") ? "webtv" : f("win") ? "win" + (f("windows nt 6.0") ? " vista" : "") : f("freebsd") ? "freebsd" : f("x11") || f("linux") ? "linux" : "", "js"
    ].join(" ");
    m.className += " " + c;
    return c
}
css_browser_selector(navigator.userAgent);
window.Modernizr = function(f, g, m) {
    function o() {
        j.input = function(a) {
            for (var b = 0, d = a.length; b < d; b++) u[a[b]] = a[b] in l;
            return u
        }("autocomplete autofocus list placeholder max min multiple pattern required step".split(" "));
        j.inputtypes = function(a) {
            for (var b = 0, d, e, h, f = a.length; b < f; b++) l.setAttribute("type", e = a[b]), d = "text" !== l.type, d && (l.value = s, l.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(e) && l.style.WebkitAppearance !== m ? (z.appendChild(l), h = g.defaultView, d = h.getComputedStyle && "textfield" !==
                h.getComputedStyle(l, null).WebkitAppearance && 0 !== l.offsetHeight, z.removeChild(l)) : /^(search|tel)$/.test(e) || (/^(url|email)$/.test(e) ? d = l.checkValidity && !1 === l.checkValidity() : /^color$/.test(e) ? (z.appendChild(l), d = l.value != s, z.removeChild(l)) : d = l.value != s)), x[a[b]] = !!d;
            return x
        }("search tel url email datetime date month week time datetime-local number range color".split(" "))
    }

    function v(a, b) {
        var d = a.charAt(0).toUpperCase() + a.substr(1),
            d = (a + " " + n.join(d + " ") + d).split(" ");
        return w(d, b)
    }

    function w(a,
        b) {
        for (var d in a)
            if (k[a[d]] !== m) return "pfx" == b ? a[d] : !0;
        return !1
    }

    function y(a, b) {
        return typeof a === b
    }
    var j = {},
        z = g.documentElement;
    g.head || g.getElementsByTagName("head");
    var i = g.createElement("modernizr"),
        k = i.style,
        l = g.createElement("input"),
        s = ":)",
        A = Object.prototype.toString,
        p = " -webkit- -moz- -o- -ms- -khtml- ".split(" "),
        n = "Webkit Moz O ms Khtml".split(" "),
        i = {},
        x = {},
        u = {},
        t = [],
        b = function(a, b, d, e) {
            var h, f, C = g.createElement("div");
            if (parseInt(d, 10))
                for (; d--;) f = g.createElement("div"), f.id = e ? e[d] : "modernizr" +
                    (d + 1), C.appendChild(f);
            h = ["&shy;<style>", a, "</style>"].join("");
            C.id = "modernizr";
            C.innerHTML += h;
            z.appendChild(C);
            a = b(C, a);
            C.parentNode.removeChild(C);
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
                d = d || g.createElement(a[b] || "div");
                b = "on" + b;
                var e = b in d;
                e || (d.setAttribute || (d = g.createElement("div")), d.setAttribute && d.removeAttribute && (d.setAttribute(b, ""), e = y(d[b], "function"), y(d[b], m) || (d[b] = m), d.removeAttribute(b)));
                return e
            }
        }(),
        d, e = {}.hasOwnProperty,
        h;
    !y(e, m) && !y(e.call, m) ? h = function(a, b) {
        return e.call(a, b)
    } : h = function(a, b) {
        return b in a && y(a.constructor.prototype[b], m)
    };
    (function(a, d) {
        var e = a.join(""),
            h = d.length;
        b(e, function(a, b) {
            for (var d = g.styleSheets[g.styleSheets.length - 1], d = d.cssRules && d.cssRules[0] ? d.cssRules[0].cssText : d.cssText || "", r = a.childNodes, e = {}; h--;) e[r[h].id] = r[h];
            j.touch = "ontouchstart" in f || 9 === e.touch.offsetTop;
            j.csstransforms3d = 9 === e.csstransforms3d.offsetLeft;
            j.generatedcontent = 1 <= e.generatedcontent.offsetHeight;
            j.fontface = /src/i.test(d) && 0 === d.indexOf(b.split(" ")[0])
        }, h, d)
    })(['@font-face {font-family:"font";src:url("https://")}', ["@media (", p.join("touch-enabled),("), "modernizr){#touch{top:9px;position:absolute}}"].join(""), ["@media (", p.join("transform-3d),("), "modernizr){#csstransforms3d{left:9px;position:absolute}}"].join(""), ['#generatedcontent:after{content:"', s, '";visibility:hidden}'].join("")], ["fontface", "touch", "csstransforms3d", "generatedcontent"]);
    i.flexbox = function() {
        var a = g.createElement("div"),
            b = g.createElement("div"),
            d = "display";
        d += ":";
        a.style.cssText = (d + p.join("box;" + d)).slice(0, -d.length) + "width:42px;padding:0;";
        b.style.cssText = p.join("box-flex:1;") + "width:10px;";
        a.appendChild(b);
        z.appendChild(a);
        d = 42 === b.offsetWidth;
        a.removeChild(b);
        z.removeChild(a);
        return d
    };
    i.canvas = function() {
        var a = g.createElement("canvas");
        return !!a.getContext && !!a.getContext("2d")
    };
    i.canvastext = function() {
        return !!j.canvas && !!y(g.createElement("canvas").getContext("2d").fillText, "function")
    };
    i.webgl = function() {
        return !!f.WebGLRenderingContext
    };
    i.touch = function() {
        return j.touch
    };
    i.geolocation = function() {
        return !!navigator.geolocation
    };
    i.postmessage = function() {
        return !!f.postMessage
    };
    i.websqldatabase = function() {
        return !!f.openDatabase
    };
    i.indexedDB = function() {
        for (var a = -1, b = n.length; ++a < b;)
            if (f[n[a].toLowerCase() + "IndexedDB"]) return !0;
        return !!f.indexedDB
    };
    i.hashchange = function() {
        return a("hashchange", f) && (g.documentMode === m || 7 < g.documentMode)
    };
    i.history = function() {
        return !!f.history && !!history.pushState
    };
    i.draganddrop = function() {
        return a("dragstart") &&
            a("drop")
    };
    i.websockets = function() {
        for (var a = -1, b = n.length; ++a < b;)
            if (f[n[a] + "WebSocket"]) return !0;
        return "WebSocket" in f
    };
    i.rgba = function() {
        k.cssText = "background-color:rgba(150,255,150,.5)";
        return !!~("" + k.backgroundColor).indexOf("rgba")
    };
    i.hsla = function() {
        k.cssText = "background-color:hsla(120,40%,100%,.5)";
        return !!~("" + k.backgroundColor).indexOf("rgba") || !!~("" + k.backgroundColor).indexOf("hsla")
    };
    i.multiplebgs = function() {
        k.cssText = "background:url(https://),url(https://),red url(https://)";
        return /(url\s*\(.*?){3}/.test(k.background)
    };
    i.backgroundsize = function() {
        return v("backgroundSize")
    };
    i.borderimage = function() {
        return v("borderImage")
    };
    i.borderradius = function() {
        return v("borderRadius")
    };
    i.boxshadow = function() {
        return v("boxShadow")
    };
    i.textshadow = function() {
        return "" === g.createElement("div").style.textShadow
    };
    i.opacity = function() {
        var a = p.join("opacity:.55;") + "";
        k.cssText = a;
        return /^0.55$/.test(k.opacity)
    };
    i.cssanimations = function() {
        return v("animationName")
    };
    i.csscolumns = function() {
        return v("columnCount")
    };
    i.cssgradients = function() {
        var a =
            ("background-image:" + p.join("gradient(linear,left top,right bottom,from(#9f9),to(white));background-image:") + p.join("linear-gradient(left top,#9f9, white);background-image:")).slice(0, -17);
        k.cssText = a;
        return !!~("" + k.backgroundImage).indexOf("gradient")
    };
    i.cssreflections = function() {
        return v("boxReflect")
    };
    i.csstransforms = function() {
        return !!w(["transformProperty", "WebkitTransform", "MozTransform", "OTransform", "msTransform"])
    };
    i.csstransforms3d = function() {
        var a = !!w(["perspectiveProperty", "WebkitPerspective",
            "MozPerspective", "OPerspective", "msPerspective"
        ]);
        a && "webkitPerspective" in z.style && (a = j.csstransforms3d);
        return a
    };
    i.csstransitions = function() {
        return v("transitionProperty")
    };
    i.fontface = function() {
        return j.fontface
    };
    i.generatedcontent = function() {
        return j.generatedcontent
    };
    i.video = function() {
        var a = g.createElement("video"),
            b = !1;
        try {
            if (b = !!a.canPlayType) b = new Boolean(b), b.ogg = a.canPlayType('video/ogg; codecs="theora"'), b.h264 = a.canPlayType('video/mp4; codecs="avc1.42E01E"') || a.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'),
                b.webm = a.canPlayType('video/webm; codecs="vp8, vorbis"')
        } catch (d) {}
        return b
    };
    i.audio = function() {
        var a = g.createElement("audio"),
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
        return !!f.Worker
    };
    i.applicationcache = function() {
        return !!f.applicationCache
    };
    i.svg = function() {
        return !!g.createElementNS && !!g.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect
    };
    i.inlinesvg = function() {
        var a = g.createElement("div");
        a.innerHTML = "<svg/>";
        return "http://www.w3.org/2000/svg" == (a.firstChild && a.firstChild.namespaceURI)
    };
    i.smil = function() {
        return !!g.createElementNS && /SVG/.test(A.call(g.createElementNS("http://www.w3.org/2000/svg", "animate")))
    };
    i.svgclippaths =
        function() {
            return !!g.createElementNS && /SVG/.test(A.call(g.createElementNS("http://www.w3.org/2000/svg", "clipPath")))
        };
    for (var q in i) h(i, q) && (d = q.toLowerCase(), j[d] = i[q](), t.push((j[d] ? "" : "no-") + d));
    j.input || o();
    k.cssText = "";
    i = l = null;
    f.attachEvent && function() {
        var a = g.createElement("div");
        a.innerHTML = "<elem></elem>";
        return 1 !== a.childNodes.length
    }() && function(a, b) {
        function d(a) {
            for (var b = -1; ++b < g;) a.createElement(f[b])
        }
        a.iepp = a.iepp || {};
        var e = a.iepp,
            h = e.html5elements || "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
            f = h.split("|"),
            g = f.length,
            i = RegExp("(^|\\s)(" + h + ")", "gi"),
            q = RegExp("<(/*)(" + h + ")", "gi"),
            j = /^\s*[\{\}]\s*$/,
            l = RegExp("(^|[^\\n]*?\\s)(" + h + ")([^\\n]*)({[\\n\\w\\W]*?})", "gi"),
            o = b.createDocumentFragment(),
            n = b.documentElement,
            h = n.firstChild,
            D = b.createElement("body"),
            E = b.createElement("style"),
            p = /print|all/,
            k;
        e.getCSS = function(a, b) {
            if (a + "" === m) return "";
            for (var d = -1, h = a.length, f, g = []; ++d < h;) f = a[d], f.disabled || (b = f.media || b, p.test(b) && g.push(e.getCSS(f.imports, b), f.cssText), b = "all");
            return g.join("")
        };
        e.parseCSS =
            function(a) {
                for (var b = [], d; null != (d = l.exec(a));) b.push(((j.exec(d[1]) ? "\n" : d[1]) + d[2] + d[3]).replace(i, "$1.iepp_$2") + d[4]);
                return b.join("\n")
            };
        e.writeHTML = function() {
            var a = -1;
            for (k = k || b.body; ++a < g;)
                for (var d = b.getElementsByTagName(f[a]), e = d.length, h = -1; ++h < e;) 0 > d[h].className.indexOf("iepp_") && (d[h].className += " iepp_" + f[a]);
            o.appendChild(k);
            n.appendChild(D);
            D.className = k.className;
            D.id = k.id;
            D.innerHTML = k.innerHTML.replace(q, "<$1font")
        };
        e._beforePrint = function() {
            E.styleSheet.cssText = e.parseCSS(e.getCSS(b.styleSheets,
                "all"));
            e.writeHTML()
        };
        e.restoreHTML = function() {
            D.innerHTML = "";
            n.removeChild(D);
            n.appendChild(k)
        };
        e._afterPrint = function() {
            e.restoreHTML();
            E.styleSheet.cssText = ""
        };
        d(b);
        d(o);
        e.disablePP || (h.insertBefore(E, h.firstChild), E.media = "print", E.className = "iepp-printshim", a.attachEvent("onbeforeprint", e._beforePrint), a.attachEvent("onafterprint", e._afterPrint))
    }(f, g);
    j._version = "2.0.6";
    j._prefixes = p;
    j._domPrefixes = n;
    j.hasEvent = a;
    j.testProp = function(a) {
        return w([a])
    };
    j.testAllProps = v;
    j.testStyles = b;
    z.className =
        z.className.replace(/\bno-js\b/, "") + (" js " + t.join(" "));
    return j
}(this, this.document);
(function(f, g, m) {
    function o() {
        for (var a = 1, b = -1; p.length - ++b && (!p[b].s || (a = p[b].r)););
        a && y()
    }

    function v(a) {
        var b = g.createElement("script"),
            d;
        b.src = a.s;
        b.onreadystatechange = b.onload = function() {
            !d && (!b.readyState || "loaded" == b.readyState || "complete" == b.readyState) && (d = 1, o(), b.onload = b.onreadystatechange = null)
        };
        l(function() {
            d || (d = 1, o())
        }, B.errorTimeout);
        a.e ? b.onload() : s.parentNode.insertBefore(b, s)
    }

    function w(b) {
        var d = g.createElement("link"),
            e;
        d.href = b.s;
        d.rel = "stylesheet";
        d.type = "text/css";
        if (!b.e && (a ||
                x)) {
            var h = function(a) {
                l(function() {
                    if (!e) try {
                        a.sheet.cssRules.length ? (e = 1, o()) : h(a)
                    } catch (b) {
                        1E3 == b.code || "security" == b.message || "denied" == b.message ? (e = 1, l(function() {
                            o()
                        }, 0)) : h(a)
                    }
                }, 0)
            };
            h(d)
        } else d.onload = function() {
            e || (e = 1, l(function() {
                o()
            }, 0))
        }, b.e && d.onload();
        l(function() {
            e || (e = 1, o())
        }, B.errorTimeout);
        !b.e && s.parentNode.insertBefore(d, s)
    }

    function y() {
        var a = p.shift();
        n = 1;
        a ? a.t ? l(function() {
            "c" == a.t ? w(a) : v(a)
        }, 0) : (a(), o()) : n = 0
    }

    function j(a, b, d, e, h, f) {
        function r() {
            !q && (!i.readyState || "loaded" == i.readyState ||
                "complete" == i.readyState) && (j.r = q = 1, !n && o(), i.onload = i.onreadystatechange = null, l(function() {
                t.removeChild(i)
            }, 0))
        }
        var i = g.createElement(a),
            q = 0,
            j = {
                t: d,
                s: b,
                e: f
            };
        i.src = i.data = b;
        !u && (i.style.display = "none");
        i.width = i.height = "0";
        "object" != a && (i.type = d);
        i.onload = i.onreadystatechange = r;
        "img" == a ? i.onerror = r : "script" == a && (i.onerror = function() {
            j.e = j.r = 1;
            y()
        });
        p.splice(e, 0, j);
        t.insertBefore(i, u ? null : s);
        l(function() {
            q || (t.removeChild(i), j.r = j.e = q = 1, o())
        }, B.errorTimeout)
    }

    function z(a, b, d) {
        var f = "c" == b ? h : e;
        n = 0;
        b = b || "j";
        r(a) ? j(f, a, b, this.i++, k, d) : (p.splice(this.i++, 0, a), 1 == p.length && y());
        return this
    }

    function i() {
        var a = B;
        a.loader = {
            load: z,
            i: 0
        };
        return a
    }
    var k = g.documentElement,
        l = f.setTimeout,
        s = g.getElementsByTagName("script")[0],
        A = {}.toString,
        p = [],
        n = 0,
        x = "MozAppearance" in k.style,
        u = x && !!g.createRange().compareNode,
        t = u ? k : s.parentNode,
        b = f.opera && "[object Opera]" == A.call(f.opera),
        a = "webkitAppearance" in k.style,
        d = a && "async" in g.createElement("script"),
        e = x ? "object" : b || d ? "img" : "script",
        h = a ? "img" : e,
        q = Array.isArray ||
        function(a) {
            return "[object Array]" == A.call(a)
        },
        r = function(a) {
            return "string" == typeof a
        },
        F = function(a) {
            return "[object Function]" == A.call(a)
        },
        G = [],
        H = {},
        I, B;
    B = function(a) {
        function b(a) {
            var a = a.split("!"),
                d = G.length,
                e = a.pop(),
                h = a.length,
                e = {
                    url: e,
                    origUrl: e,
                    prefixes: a
                },
                f, g;
            for (g = 0; g < h; g++) f = H[a[g]], f && (e = f(e));
            for (g = 0; g < d; g++) e = G[g](e);
            return e
        }

        function d(a, e, h, f, g) {
            var r = b(a),
                q = r.autoCallback;
            if (!r.bypass) {
                e && (e = F(e) ? e : e[a] || e[f] || e[a.split("/").pop().split("?")[0]]);
                if (r.instead) return r.instead(a, e, h,
                    f, g);
                h.load(r.url, r.forceCSS || !r.forceJS && /css$/.test(r.url) ? "c" : m, r.noexec);
                (F(e) || F(q)) && h.load(function() {
                    i();
                    e && e(r.origUrl, g, f);
                    q && q(r.origUrl, g, f)
                })
            }
        }

        function e(a, b) {
            function h(a) {
                if (r(a)) d(a, i, b, 0, f);
                else if (Object(a) === a)
                    for (q in a) a.hasOwnProperty(q) && d(a[q], i, b, q, f)
            }
            var f = !!a.test,
                g = a.load || a.both,
                i = a.callback,
                q;
            h(f ? a.yep : a.nope);
            h(g);
            a.complete && b.load(a.complete)
        }
        var h, f, g = this.yepnope.loader;
        if (r(a)) d(a, 0, g, 0);
        else if (q(a))
            for (h = 0; h < a.length; h++) f = a[h], r(f) ? d(f, 0, g, 0) : q(f) ? B(f) : Object(f) ===
                f && e(f, g);
        else Object(a) === a && e(a, g)
    };
    B.addPrefix = function(a, b) {
        H[a] = b
    };
    B.addFilter = function(a) {
        G.push(a)
    };
    B.errorTimeout = 1E4;
    null == g.readyState && g.addEventListener && (g.readyState = "loading", g.addEventListener("DOMContentLoaded", I = function() {
        g.removeEventListener("DOMContentLoaded", I, 0);
        g.readyState = "complete"
    }, 0));
    f.yepnope = i()
})(this, this.document);
Modernizr.load = function() {
    yepnope.apply(window, [].slice.call(arguments, 0))
};
(function() {
    function f() {
        document.removeEventListener("DOMContentLoaded", f, !1);
        var e = document.createElement("div"),
            g = h.touchIcon ? document.querySelectorAll("head link[rel=apple-touch-icon],head link[rel=apple-touch-icon-precomposed]") : [],
            i, l = "";
        e.id = "addToHomeScreen";
        e.style.cssText += "position:absolute;-webkit-transition-property:-webkit-transform,opacity;-webkit-transition-duration:0;-webkit-transform:translate3d(0,0,0);";
        e.style.left = "-9999px";
        if (h.message in q) p = h.message, h.message = "";
        if ("" == h.message) h.message =
            p in q ? q[p] : q.en_us;
        if (g.length) {
            for (a = 0, d = g.length; a < d; a++)
                if (i = g[a].getAttribute("sizes")) {
                    if (z && "114x114" == i) {
                        l = g[a].href;
                        break
                    }
                } else l = g[a].href;
            l = '<span style="background-image:url(' + l + ')" class="touchIcon"></span>'
        }
        e.className = (j ? "ipad" : "iphone") + (l ? " wide" : "");
        e.innerHTML = l + h.message.replace("%device", A).replace("%icon", 4.2 <= s ? '<span class="share"></span>' : '<span class="plus">+</span>') + (h.arrow ? '<span class="arrow"></span>' : "") + '<span class="close">\u00d7</span>';
        e.innerHTML = '<span class="closeZone">' +
            e.innerHTML + "</span>";
        document.body.appendChild(e);
        b = e;
        (e = b.querySelector(".closeZone")) && e.addEventListener("touchend", v, !1);
        try {
            h.expire && localStorage.setItem("_addToHome", (new Date).getTime() + 6E4 * h.expire)
        } catch (n) {}
    }

    function g() {
        window.removeEventListener("load", g, !1);
        setTimeout(function() {
            var a;
            n = j ? window.scrollY : window.innerHeight + window.scrollY;
            startX = j ? window.scrollX : Math.round((window.innerWidth - b.offsetWidth) / 2) + window.scrollX;
            b.style.top = j ? n + h.bottomOffset + "px" : n - b.offsetHeight - h.bottomOffset +
                "px";
            b.style.left = j ? startX + (5 <= s ? 160 : 208) - Math.round(b.offsetWidth / 2) + "px" : startX + "px";
            switch (h.animationIn) {
                case "drop":
                    j ? (a = "0.6s", b.style.webkitTransform = "translate3d(0," + -(window.scrollY + h.bottomOffset + b.offsetHeight) + "px,0)") : (a = "0.9s", b.style.webkitTransform = "translate3d(0," + -(n + h.bottomOffset) + "px,0)");
                    break;
                case "bubble":
                    j ? (a = "0.6s", b.style.opacity = "0", b.style.webkitTransform = "translate3d(0," + (n + 50) + "px,0)") : (a = "0.6s", b.style.webkitTransform = "translate3d(0," + (b.offsetHeight + h.bottomOffset +
                        50) + "px,0)");
                    break;
                default:
                    a = "1s", b.style.opacity = "0"
            }
            setTimeout(function() {
                b.style.webkitTransitionDuration = a;
                b.style.opacity = "1";
                b.style.webkitTransform = "translate3d(0,0,0)";
                b.addEventListener("webkitTransitionEnd", m, !1)
            }, 0);
            t = setTimeout(v, h.lifespan);
            e = !0
        }, h.startDelay)
    }

    function m() {
        b.removeEventListener("webkitTransitionEnd", m, !1);
        b.style.webkitTransitionProperty = "-webkit-transform";
        b.style.webkitTransitionDuration = "0.2s";
        t ? (clearInterval(u), u = setInterval(o, h.iterations)) : b.parentNode.removeChild(b)
    }

    function o() {
        var a = new WebKitCSSMatrix(window.getComputedStyle(b, null).webkitTransform),
            d = j ? window.scrollY - n : window.scrollY + window.innerHeight - n,
            e = j ? window.scrollX - startX : window.scrollX + Math.round((window.innerWidth - b.offsetWidth) / 2) - startX;
        d == a.m42 && e == a.m41 || (clearInterval(u), b.removeEventListener("webkitTransitionEnd", m, !1), setTimeout(function() {
            b.addEventListener("webkitTransitionEnd", m, !1);
            b.style.webkitTransform = "translate3d(" + e + "px," + d + "px,0)"
        }, 0))
    }

    function v() {
        clearInterval(u);
        clearTimeout(t);
        t = null;
        b.removeEventListener("webkitTransitionEnd", m, !1);
        var a = j ? window.scrollY - n : window.scrollY + window.innerHeight - n,
            d = j ? window.scrollX - startX : window.scrollX + Math.round((window.innerWidth - b.offsetWidth) / 2) - startX,
            e = "1",
            f = "0";
        (f = b.querySelector(".closeZone")) && f.removeEventListener("touchend", v, !1);
        b.style.webkitTransitionProperty = "-webkit-transform,opacity";
        switch (h.animationOut) {
            case "drop":
                j ? (f = "0.4s", e = "0", a += 50) : (f = "0.6s", a = a + b.offsetHeight + h.bottomOffset + 50);
                break;
            case "bubble":
                j ? (f = "0.8s",
                    a = a - b.offsetHeight - h.bottomOffset - 50) : (f = "0.4s", e = "0", a -= 50);
                break;
            default:
                f = "0.8s", e = "0"
        }
        b.addEventListener("webkitTransitionEnd", m, !1);
        b.style.opacity = e;
        b.style.webkitTransitionDuration = f;
        b.style.webkitTransform = "translate3d(" + d + "px," + a + "px,0)"
    }
    var w = navigator,
        y = /iphone|ipod|ipad/gi.test(w.platform);
    if (y) {
        var j = /ipad/gi.test(w.platform),
            z = "devicePixelRatio" in window && 1 < window.devicePixelRatio,
            i = w.appVersion.match(/Safari/gi),
            k = "standalone" in w && y,
            l = k && w.standalone,
            s = w.appVersion.match(/OS \d+_\d+/g),
            A = w.platform.split(" ")[0],
            p = w.language.replace("-", "_"),
            n = startX = 0,
            x = localStorage.getItem("_addToHome"),
            u, t, b, a, d, e, h = {
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
            q = {
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
            s = s ? 1 * s[0].replace(/[^\d_]/g, "").replace("_", ".") : 0,
            x = "null" == x ? 0 : 1 * x;
        if (window.addToHomeConfig)
            for (a in window.addToHomeConfig) h[a] = window.addToHomeConfig[a];
        if (!h.expire || x < (new Date).getTime()) x = 0;
        window.addToHomeClose = v;
        window.addToHomeOpen = function() {
            k && !x && !l && i && !t && !e && (f(), g())
        }
    } else window.addToHomeClose = function() {}, window.addToHomeOpen = function() {}
})();
(function() {
    var f = Math,
        g = /webkit/i.test(navigator.appVersion) ? "webkit" : /firefox/i.test(navigator.userAgent) ? "Moz" : "opera" in window ? "O" : "",
        m = "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix,
        o = "ontouchstart" in window,
        v = g + "Transform" in document.documentElement.style,
        w = /android/gi.test(navigator.appVersion),
        y = /iphone|ipad/gi.test(navigator.appVersion),
        j = /playbook/gi.test(navigator.appVersion),
        z = y || j,
        i = function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(b) {
                    return setTimeout(b, 1)
                }
        }(),
        k = window.cancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout,
        l = "onorientationchange" in window ? "orientationchange" : "resize",
        s = o ? "touchstart" : "mousedown",
        A = o ? "touchmove" : "mousemove",
        p = o ? "touchend" : "mouseup",
        n = o ? "touchcancel" : "mouseup",
        x = "Moz" == g ? "DOMMouseScroll" :
        "mousewheel",
        u = "translate" + (m ? "3d(" : "("),
        t = m ? ",0)" : ")",
        j = function(b, a) {
            var d = this,
                e;
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
                fixedScrollbar: w,
                hideScrollbar: y,
                fadeScrollbar: y && m,
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
            for (e in a) d.options[e] = a[e];
            d.x = d.options.x;
            d.y = d.options.y;
            d.options.useTransform = v ? d.options.useTransform : !1;
            d.options.hScrollbar = d.options.hScroll && d.options.hScrollbar;
            d.options.vScrollbar = d.options.vScroll &&
                d.options.vScrollbar;
            d.options.zoom = d.options.useTransform && d.options.zoom;
            d.options.useTransition = z && d.options.useTransition;
            d.scroller.style[g + "TransitionProperty"] = d.options.useTransform ? "-" + g.toLowerCase() + "-transform" : "top left";
            d.scroller.style[g + "TransitionDuration"] = "0";
            d.scroller.style[g + "TransformOrigin"] = "0 0";
            d.options.useTransition && (d.scroller.style[g + "TransitionTimingFunction"] = "cubic-bezier(0.33,0.66,0.66,1)");
            d.options.useTransform ? d.scroller.style[g + "Transform"] = u + d.x + "px," + d.y +
                "px" + t : d.scroller.style.cssText += ";position:absolute;top:" + d.y + "px;left:" + d.x + "px";
            if (d.options.useTransition) d.options.fixedScrollbar = !0;
            d.refresh();
            d._bind(l, window);
            d._bind(s);
            o || (d._bind("mouseout", d.wrapper), d._bind(x));
            if (d.options.checkDOMChanges) d.checkDOMTime = setInterval(function() {
                d._checkDOMChanges()
            }, 500)
        };
    j.prototype = {
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
                case s:
                    if (!o && 0 !== b.button) break;
                    this._start(b);
                    break;
                case A:
                    this._move(b);
                    break;
                case p:
                case n:
                    this._end(b);
                    break;
                case l:
                    this._resize();
                    break;
                case x:
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
                    d.style.cssText += ";pointer-events:none;-" + g + "-transition-property:opacity;-" + g + "-transition-duration:" + (this.options.fadeScrollbar ? "350ms" : "0") + ";overflow:hidden;opacity:" + (this.options.hideScrollbar ?
                        "0" : "1");
                    this.wrapper.appendChild(d);
                    this[b + "ScrollbarWrapper"] = d;
                    d = a.createElement("div");
                    if (!this.options.scrollbarClass) d.style.cssText = "position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);-" + g + "-background-clip:padding-box;-" + g + "-box-sizing:border-box;" + ("h" == b ? "height:100%" : "width:100%") + ";-" + g + "-border-radius:3px;border-radius:3px";
                    d.style.cssText += ";pointer-events:none;-" + g + "-transition-property:-" + g + "-transform;-" + g + "-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-" +
                        g + "-transition-duration:0;-" + g + "-transform:" + u + "0,0" + t;
                    this.options.useTransition && (d.style.cssText += ";-" + g + "-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)");
                    this[b + "ScrollbarWrapper"].appendChild(d);
                    this[b + "ScrollbarIndicator"] = d
                }
                "h" == b ? (this.hScrollbarSize = this.hScrollbarWrapper.clientWidth, this.hScrollbarIndicatorSize = f.max(f.round(this.hScrollbarSize * this.hScrollbarSize / this.scrollerW), 8), this.hScrollbarIndicator.style.width = this.hScrollbarIndicatorSize + "px", this.hScrollbarMaxScroll =
                    this.hScrollbarSize - this.hScrollbarIndicatorSize, this.hScrollbarProp = this.hScrollbarMaxScroll / this.maxScrollX) : (this.vScrollbarSize = this.vScrollbarWrapper.clientHeight, this.vScrollbarIndicatorSize = f.max(f.round(this.vScrollbarSize * this.vScrollbarSize / this.scrollerH), 8), this.vScrollbarIndicator.style.height = this.vScrollbarIndicatorSize + "px", this.vScrollbarMaxScroll = this.vScrollbarSize - this.vScrollbarIndicatorSize, this.vScrollbarProp = this.vScrollbarMaxScroll / this.maxScrollY);
                this._scrollbarPos(b, !0)
            } else this[b +
                "ScrollbarWrapper"] && (v && (this[b + "ScrollbarIndicator"].style[g + "Transform"] = ""), this[b + "ScrollbarWrapper"].parentNode.removeChild(this[b + "ScrollbarWrapper"]), this[b + "ScrollbarWrapper"] = null, this[b + "ScrollbarIndicator"] = null)
        },
        _resize: function() {
            var b = this;
            setTimeout(function() {
                b.refresh()
            }, w ? 200 : 0)
        },
        _pos: function(b, a) {
            b = this.hScroll ? b : 0;
            a = this.vScroll ? a : 0;
            this.options.useTransform ? this.scroller.style[g + "Transform"] = u + b + "px," + a + "px" + t + " scale(" + this.scale + ")" : (b = f.round(b), a = f.round(a), this.scroller.style.left =
                b + "px", this.scroller.style.top = a + "px");
            this.x = b;
            this.y = a;
            this._scrollbarPos("h");
            this._scrollbarPos("v")
        },
        _scrollbarPos: function(b, a) {
            var d = "h" == b ? this.x : this.y;
            if (this[b + "Scrollbar"]) d *= this[b + "ScrollbarProp"], 0 > d ? (this.options.fixedScrollbar || (d = this[b + "ScrollbarIndicatorSize"] + f.round(3 * d), 8 > d && (d = 8), this[b + "ScrollbarIndicator"].style["h" == b ? "width" : "height"] = d + "px"), d = 0) : d > this[b + "ScrollbarMaxScroll"] && (this.options.fixedScrollbar ? d = this[b + "ScrollbarMaxScroll"] : (d = this[b + "ScrollbarIndicatorSize"] -
                f.round(3 * (d - this[b + "ScrollbarMaxScroll"])), 8 > d && (d = 8), this[b + "ScrollbarIndicator"].style["h" == b ? "width" : "height"] = d + "px", d = this[b + "ScrollbarMaxScroll"] + (this[b + "ScrollbarIndicatorSize"] - d))), this[b + "ScrollbarWrapper"].style[g + "TransitionDelay"] = "0", this[b + "ScrollbarWrapper"].style.opacity = a && this.options.hideScrollbar ? "0" : "1", this[b + "ScrollbarIndicator"].style[g + "Transform"] = u + ("h" == b ? d + "px,0" : "0," + d + "px") + t
        },
        _start: function(b) {
            var a = o ? b.touches[0] : b,
                d, e;
            if (this.enabled) {
                this.options.onBeforeScrollStart &&
                    this.options.onBeforeScrollStart.call(this, b);
                (this.options.useTransition || this.options.zoom) && this._transitionTime(0);
                this.zoomed = this.animating = this.moved = !1;
                this.dirY = this.dirX = this.absDistY = this.absDistX = this.distY = this.distX = 0;
                if (this.options.zoom && o && 1 < b.touches.length) e = f.abs(b.touches[0].pageX - b.touches[1].pageX), d = f.abs(b.touches[0].pageY - b.touches[1].pageY), this.touchesDistStart = f.sqrt(e * e + d * d), this.originX = f.abs(b.touches[0].pageX + b.touches[1].pageX - 2 * this.wrapperOffsetLeft) / 2 - this.x, this.originY =
                    f.abs(b.touches[0].pageY + b.touches[1].pageY - 2 * this.wrapperOffsetTop) / 2 - this.y, this.options.onZoomStart && this.options.onZoomStart.call(this, b);
                if (this.options.momentum && (this.options.useTransform ? (d = getComputedStyle(this.scroller, null)[g + "Transform"].replace(/[^0-9-.,]/g, "").split(","), e = 1 * d[4], d = 1 * d[5]) : (e = 1 * getComputedStyle(this.scroller, null).left.replace(/[^0-9-]/g, ""), d = 1 * getComputedStyle(this.scroller, null).top.replace(/[^0-9-]/g, "")), e != this.x || d != this.y)) this.options.useTransition ? this._unbind("webkitTransitionEnd") :
                    k(this.aniTime), this.steps = [], this._pos(e, d);
                this.absStartX = this.x;
                this.absStartY = this.y;
                this.startX = this.x;
                this.startY = this.y;
                this.pointX = a.pageX;
                this.pointY = a.pageY;
                this.startTime = b.timeStamp || Date.now();
                this.options.onScrollStart && this.options.onScrollStart.call(this, b);
                this._bind(A);
                this._bind(p);
                this._bind(n)
            }
        },
        _move: function(b) {
            var a = o ? b.touches[0] : b,
                d = a.pageX - this.pointX,
                e = a.pageY - this.pointY,
                h = this.x + d,
                i = this.y + e,
                j = b.timeStamp || Date.now();
            this.options.onBeforeScrollMove && this.options.onBeforeScrollMove.call(this,
                b);
            if (this.options.zoom && o && 1 < b.touches.length) h = f.abs(b.touches[0].pageX - b.touches[1].pageX), i = f.abs(b.touches[0].pageY - b.touches[1].pageY), this.touchesDist = f.sqrt(h * h + i * i), this.zoomed = !0, a = 1 / this.touchesDistStart * this.touchesDist * this.scale, a < this.options.zoomMin ? a = 0.5 * this.options.zoomMin * Math.pow(2, a / this.options.zoomMin) : a > this.options.zoomMax && (a = 2 * this.options.zoomMax * Math.pow(0.5, this.options.zoomMax / a)), this.lastScale = a / this.scale, h = this.originX - this.originX * this.lastScale + this.x, i = this.originY -
                this.originY * this.lastScale + this.y, this.scroller.style[g + "Transform"] = u + h + "px," + i + "px" + t + " scale(" + a + ")", this.options.onZoom && this.options.onZoom.call(this, b);
            else {
                this.pointX = a.pageX;
                this.pointY = a.pageY;
                if (0 < h || h < this.maxScrollX) h = this.options.bounce ? this.x + d / 2 : 0 <= h || 0 <= this.maxScrollX ? 0 : this.maxScrollX;
                if (i > this.minScrollY || i < this.maxScrollY) i = this.options.bounce ? this.y + e / 2 : i >= this.minScrollY || 0 <= this.maxScrollY ? this.minScrollY : this.maxScrollY;
                if (6 > this.absDistX && 6 > this.absDistY) this.distX += d, this.distY +=
                    e, this.absDistX = f.abs(this.distX), this.absDistY = f.abs(this.distY);
                else {
                    if (this.options.lockDirection)
                        if (this.absDistX > this.absDistY + 5) i = this.y, e = 0;
                        else if (this.absDistY > this.absDistX + 5) h = this.x, d = 0;
                    this.moved = !0;
                    this._pos(h, i);
                    this.dirX = 0 < d ? -1 : 0 > d ? 1 : 0;
                    this.dirY = 0 < e ? -1 : 0 > e ? 1 : 0;
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
                    e, h, i = {
                        dist: 0,
                        time: 0
                    },
                    j = {
                        dist: 0,
                        time: 0
                    },
                    l = (b.timeStamp || Date.now()) - a.startTime,
                    k = a.x,
                    m = a.y;
                a._unbind(A);
                a._unbind(p);
                a._unbind(n);
                a.options.onBeforeScrollEnd && a.options.onBeforeScrollEnd.call(a, b);
                if (a.zoomed) k = a.scale * a.lastScale, k = Math.max(a.options.zoomMin, k), k = Math.min(a.options.zoomMax, k), a.lastScale = k / a.scale, a.scale = k, a.x = a.originX - a.originX * a.lastScale + a.x, a.y = a.originY - a.originY * a.lastScale + a.y, a.scroller.style[g + "TransitionDuration"] = "200ms", a.scroller.style[g + "Transform"] = u + a.x + "px," +
                    a.y + "px" + t + " scale(" + a.scale + ")", a.zoomed = !1, a.refresh(), a.options.onZoomEnd && a.options.onZoomEnd.call(a, b);
                else {
                    if (a.moved) {
                        if (300 > l && a.options.momentum) {
                            i = k ? a._momentum(k - a.startX, l, -a.x, a.scrollerW - a.wrapperW + a.x, a.options.bounce ? a.wrapperW : 0) : i;
                            j = m ? a._momentum(m - a.startY, l, -a.y, 0 > a.maxScrollY ? a.scrollerH - a.wrapperH + a.y - a.minScrollY : 0, a.options.bounce ? a.wrapperH : 0) : j;
                            k = a.x + i.dist;
                            m = a.y + j.dist;
                            if (0 < a.x && 0 < k || a.x < a.maxScrollX && k < a.maxScrollX) i = {
                                dist: 0,
                                time: 0
                            };
                            if (a.y > a.minScrollY && m > a.minScrollY ||
                                a.y < a.maxScrollY && m < a.maxScrollY) j = {
                                dist: 0,
                                time: 0
                            }
                        }
                        if (i.dist || j.dist) {
                            i = f.max(f.max(i.time, j.time), 10);
                            if (a.options.snap) j = k - a.absStartX, l = m - a.absStartY, f.abs(j) < a.options.snapThreshold && f.abs(l) < a.options.snapThreshold ? a.scrollTo(a.absStartX, a.absStartY, 200) : (j = a._snap(k, m), k = j.x, m = j.y, i = f.max(j.time, i));
                            a.scrollTo(f.round(k), f.round(m), i)
                        } else a.options.snap ? (j = k - a.absStartX, l = m - a.absStartY, f.abs(j) < a.options.snapThreshold && f.abs(l) < a.options.snapThreshold ? a.scrollTo(a.absStartX, a.absStartY, 200) :
                            (j = a._snap(a.x, a.y), (j.x != a.x || j.y != a.y) && a.scrollTo(j.x, j.y, j.time))) : a._resetPos(200)
                    } else {
                        if (o) a.doubleTapTimer && a.options.zoom ? (clearTimeout(a.doubleTapTimer), a.doubleTapTimer = null, a.options.onZoomStart && a.options.onZoomStart.call(a, b), a.zoom(a.pointX, a.pointY, 1 == a.scale ? a.options.doubleTapZoom : 1), a.options.onZoomEnd && setTimeout(function() {
                            a.options.onZoomEnd.call(a, b)
                        }, 200)) : a.doubleTapTimer = setTimeout(function() {
                            a.doubleTapTimer = null;
                            for (e = d.target; 1 != e.nodeType;) e = e.parentNode;
                            if ("SELECT" !=
                                e.tagName && "INPUT" != e.tagName && "TEXTAREA" != e.tagName) h = document.createEvent("MouseEvents"), h.initMouseEvent("click", !0, !0, b.view, 1, d.screenX, d.screenY, d.clientX, d.clientY, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, 0, null), h._fake = !0, e.dispatchEvent(h)
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
                if (this.hScrollbar && this.options.hideScrollbar) "webkit" == g && (this.hScrollbarWrapper.style[g + "TransitionDelay"] = "300ms"), this.hScrollbarWrapper.style.opacity = "0";
                if (this.vScrollbar && this.options.hideScrollbar) "webkit" == g && (this.vScrollbarWrapper.style[g + "TransitionDelay"] = "300ms"), this.vScrollbarWrapper.style.opacity = "0"
            } else this.scrollTo(a, d, b || 0)
        },
        _wheel: function(b) {
            var a =
                this,
                d, e;
            "wheelDeltaX" in b ? (d = b.wheelDeltaX / 12, e = b.wheelDeltaY / 12) : d = "detail" in b ? e = 3 * -b.detail : e = -b.wheelDelta;
            if ("zoom" == a.options.wheelAction) {
                e = a.scale * Math.pow(2, 1 / 3 * (e ? e / Math.abs(e) : 0));
                if (e < a.options.zoomMin) e = a.options.zoomMin;
                if (e > a.options.zoomMax) e = a.options.zoomMax;
                e != a.scale && (!a.wheelZoomCount && a.options.onZoomStart && a.options.onZoomStart.call(a, b), a.wheelZoomCount++, a.zoom(b.pageX, b.pageY, e, 400), setTimeout(function() {
                    a.wheelZoomCount--;
                    !a.wheelZoomCount && a.options.onZoomEnd && a.options.onZoomEnd.call(a,
                        b)
                }, 400))
            } else {
                d = a.x + d;
                e = a.y + e;
                if (0 < d) d = 0;
                else if (d < a.maxScrollX) d = a.maxScrollX;
                if (e > a.minScrollY) e = a.minScrollY;
                else if (e < a.maxScrollY) e = a.maxScrollY;
                a.scrollTo(d, e, 0)
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
                e = Date.now(),
                h, g, j;
            if (!b.animating)
                if (b.steps.length) {
                    h = b.steps.shift();
                    if (h.x == a && h.y == d) h.time = 0;
                    b.animating = !0;
                    b.moved = !0;
                    b.options.useTransition ? (b._transitionTime(h.time), b._pos(h.x, h.y), b.animating = !1, h.time ? b._bind("webkitTransitionEnd") : b._resetPos(0)) : (j = function() {
                        var k = Date.now();
                        if (k >= e + h.time) b._pos(h.x, h.y), b.animating = !1, b.options.onAnimationEnd && b.options.onAnimationEnd.call(b), b._startAni();
                        else if (k = (k - e) / h.time - 1, g = f.sqrt(1 - k * k), k = (h.x - a) * g + a, b._pos(k, (h.y - d) * g + d), b.animating) b.aniTime = i(j)
                    }, j())
                } else b._resetPos(400)
        },
        _transitionTime: function(b) {
            b +=
                "ms";
            this.scroller.style[g + "TransitionDuration"] = b;
            this.hScrollbar && (this.hScrollbarIndicator.style[g + "TransitionDuration"] = b);
            this.vScrollbar && (this.vScrollbarIndicator.style[g + "TransitionDuration"] = b)
        },
        _momentum: function(b, a, d, e, h) {
            var a = f.abs(b) / a,
                g = a * a / 0.0012,
                i = 0,
                i = 0;
            0 < b && g > d ? (d += h / (6 / (6.0E-4 * (g / a))), a = a * d / g, g = d) : 0 > b && g > e && (e += h / (6 / (6.0E-4 * (g / a))), a = a * e / g, g = e);
            return {
                dist: g * (0 > b ? -1 : 1),
                time: f.round(a / 6.0E-4)
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
            var d, e, h;
            h = this.pagesX.length - 1;
            for (d = 0, e = this.pagesX.length; d < e; d++)
                if (b >= this.pagesX[d]) {
                    h = d;
                    break
                }
            h == this.currPageX && 0 < h && 0 > this.dirX && h--;
            b = this.pagesX[h];
            e = (e = f.abs(b - this.pagesX[this.currPageX])) ? 500 * (f.abs(this.x - b) / e) : 0;
            this.currPageX = h;
            h = this.pagesY.length - 1;
            for (d = 0; d < h; d++)
                if (a >= this.pagesY[d]) {
                    h = d;
                    break
                }
            h == this.currPageY && 0 < h && 0 > this.dirY && h--;
            a = this.pagesY[h];
            d = (d = f.abs(a - this.pagesY[this.currPageY])) ?
                500 * (f.abs(this.y - a) / d) : 0;
            this.currPageY = h;
            h = f.round(f.max(e, d)) || 200;
            return {
                x: b,
                y: a,
                time: h
            }
        },
        _bind: function(b, a, d) {
            (a || this.scroller).addEventListener(b, this, !!d)
        },
        _unbind: function(b, a, d) {
            (a || this.scroller).removeEventListener(b, this, !!d)
        },
        destroy: function() {
            this.scroller.style[g + "Transform"] = "";
            this.vScrollbar = this.hScrollbar = !1;
            this._scrollbar("h");
            this._scrollbar("v");
            this._unbind(l, window);
            this._unbind(s);
            this._unbind(A);
            this._unbind(p);
            this._unbind(n);
            this.options.hasTouch && (this._unbind("mouseout",
                this.wrapper), this._unbind(x));
            this.options.useTransition && this._unbind("webkitTransitionEnd");
            this.options.checkDOMChanges && clearInterval(this.checkDOMTime);
            this.options.onDestroy && this.options.onDestroy.call(this)
        },
        refresh: function() {
            var b, a, d, e = 0;
            a = 0;
            if (this.scale < this.options.zoomMin) this.scale = this.options.zoomMin;
            this.wrapperW = this.wrapper.clientWidth || 1;
            this.wrapperH = this.wrapper.clientHeight || 1;
            this.minScrollY = -this.options.topOffset || 0;
            this.scrollerW = f.round(this.scroller.offsetWidth * this.scale);
            this.scrollerH = f.round((this.scroller.offsetHeight + this.minScrollY) * this.scale);
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
                for (b = 0, a = d.length; b < a; b++) e = this._offset(d[b]), e.left += this.wrapperOffsetLeft, e.top += this.wrapperOffsetTop, this.pagesX[b] = e.left < this.maxScrollX ? this.maxScrollX : e.left * this.scale, this.pagesY[b] = e.top < this.maxScrollY ? this.maxScrollY : e.top *
                    this.scale
            } else if (this.options.snap) {
                for (this.pagesX = []; e >= this.maxScrollX;) this.pagesX[a] = e, e -= this.wrapperW, a++;
                this.maxScrollX % this.wrapperW && (this.pagesX[this.pagesX.length] = this.maxScrollX - this.pagesX[this.pagesX.length - 1] + this.pagesX[this.pagesX.length - 1]);
                a = e = 0;
                for (this.pagesY = []; e >= this.maxScrollY;) this.pagesY[a] = e, e -= this.wrapperH, a++;
                this.maxScrollY % this.wrapperH && (this.pagesY[this.pagesY.length] = this.maxScrollY - this.pagesY[this.pagesY.length - 1] + this.pagesY[this.pagesY.length - 1])
            }
            this._scrollbar("h");
            this._scrollbar("v");
            this.zoomed || (this.scroller.style[g + "TransitionDuration"] = "0", this._resetPos(200))
        },
        scrollTo: function(b, a, d, e) {
            var f = b;
            this.stop();
            f.length || (f = [{
                x: b,
                y: a,
                time: d,
                relative: e
            }]);
            for (b = 0, a = f.length; b < a; b++) {
                if (f[b].relative) f[b].x = this.x - f[b].x, f[b].y = this.y - f[b].y;
                this.steps.push({
                    x: f[b].x,
                    y: f[b].y,
                    time: f[b].time || 0
                })
            }
            this._startAni()
        },
        scrollToElement: function(b, a) {
            var d;
            if (b = b.nodeType ? b : this.scroller.querySelector(b)) d = this._offset(b), d.left += this.wrapperOffsetLeft, d.top += this.wrapperOffsetTop,
                d.left = 0 < d.left ? 0 : d.left < this.maxScrollX ? this.maxScrollX : d.left, d.top = d.top > this.minScrollY ? this.minScrollY : d.top < this.maxScrollY ? this.maxScrollY : d.top, a = void 0 === a ? f.max(2 * f.abs(d.left), 2 * f.abs(d.top)) : a, this.scrollTo(d.left, d.top, a)
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
            this._unbind(A);
            this._unbind(p);
            this._unbind(n)
        },
        enable: function() {
            this.enabled = !0
        },
        stop: function() {
            this.options.useTransition ? this._unbind("webkitTransitionEnd") : k(this.aniTime);
            this.steps = [];
            this.animating = this.moved = !1
        },
        zoom: function(b, a, d, e) {
            var f = d / this.scale;
            if (this.options.useTransform) this.zoomed = !0, e = void 0 === e ? 200 : e, b = b - this.wrapperOffsetLeft - this.x, a = a - this.wrapperOffsetTop - this.y, this.x = b - b * f + this.x, this.y = a - a * f + this.y, this.scale = d, this.refresh(), this.x = 0 < this.x ? 0 : this.x < this.maxScrollX ? this.maxScrollX : this.x, this.y = this.y > this.minScrollY ? this.minScrollY : this.y < this.maxScrollY ? this.maxScrollY : this.y, this.scroller.style[g + "TransitionDuration"] = e + "ms", this.scroller.style[g +
                "Transform"] = u + this.x + "px," + this.y + "px" + t + " scale(" + d + ")", this.zoomed = !1
        },
        isReady: function() {
            return !this.moved && !this.zoomed && !this.animating
        }
    };
    "undefined" !== typeof exports ? exports.iScroll = j : window.iScroll = j
})();