var Prototype = {
    Version: "1.7",
    Browser: function() {
        var a = navigator.userAgent,
            b = "[object Opera]" == Object.prototype.toString.call(window.opera);
        return {
            IE: !!window.attachEvent && !b,
            Opera: b,
            WebKit: -1 < a.indexOf("AppleWebKit/"),
            Gecko: -1 < a.indexOf("Gecko") && -1 === a.indexOf("KHTML"),
            MobileSafari: /Apple.*Mobile/.test(a)
        }
    }(),
    BrowserFeatures: {
        XPath: !!document.evaluate,
        SelectorsAPI: !!document.querySelector,
        ElementExtensions: function() {
            var a = window.Element || window.HTMLElement;
            return !(!a || !a.prototype)
        }(),
        SpecificElementExtensions: function() {
            if ("undefined" !==
                typeof window.HTMLDivElement) return !0;
            var a = document.createElement("div"),
                b = document.createElement("form"),
                c = !1;
            a.__proto__ && a.__proto__ !== b.__proto__ && (c = !0);
            return c
        }()
    },
    ScriptFragment: "<script[^>]*>([\\S\\s]*?)<\/script>",
    JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
    emptyFunction: function() {},
    K: function(a) {
        return a
    }
};
if (Prototype.Browser.MobileSafari) Prototype.BrowserFeatures.SpecificElementExtensions = !1;
var Abstract = {},
    Try = {
        these: function() {
            for (var a, b = 0, c = arguments.length; b < c; b++) {
                var e = arguments[b];
                try {
                    a = e();
                    break
                } catch (f) {}
            }
            return a
        }
    },
    Class = function() {
        function a() {}
        var b = function() {
            for (var a in {
                    toString: 1
                })
                if ("toString" === a) return !1;
            return !0
        }();
        return {
            create: function() {
                function b() {
                    this.initialize.apply(this, arguments)
                }
                var e = null,
                    f = $A(arguments);
                Object.isFunction(f[0]) && (e = f.shift());
                Object.extend(b, Class.Methods);
                b.superclass = e;
                b.subclasses = [];
                if (e) a.prototype = e.prototype, b.prototype = new a, e.subclasses.push(b);
                for (var e = 0, g = f.length; e < g; e++) b.addMethods(f[e]);
                if (!b.prototype.initialize) b.prototype.initialize = Prototype.emptyFunction;
                return b.prototype.constructor = b
            },
            Methods: {
                addMethods: function(a) {
                    var e = this.superclass && this.superclass.prototype,
                        f = Object.keys(a);
                    b && (a.toString != Object.prototype.toString && f.push("toString"), a.valueOf != Object.prototype.valueOf && f.push("valueOf"));
                    for (var g = 0, h = f.length; g < h; g++) {
                        var i = f[g],
                            j = a[i];
                        if (e && Object.isFunction(j) && "$super" == j.argumentNames()[0]) {
                            var k = j,
                                j = function(a) {
                                    return function() {
                                        return e[a].apply(this,
                                            arguments)
                                    }
                                }(i).wrap(k);
                            j.valueOf = k.valueOf.bind(k);
                            j.toString = k.toString.bind(k)
                        }
                        this.prototype[i] = j
                    }
                    return this
                }
            }
        }
    }();
(function() {
    function a(a) {
        switch (a) {
            case null:
                return k;
            case void 0:
                return l
        }
        switch (typeof a) {
            case "boolean":
                return m;
            case "number":
                return o;
            case "string":
                return n
        }
        return p
    }

    function b(a, b) {
        for (var c in b) a[c] = b[c];
        return a
    }

    function c(a) {
        return e("", {
            "": a
        }, [])
    }

    function e(b, c, h) {
        var c = c[b],
            f = typeof c;
        a(c) === p && "function" === typeof c.toJSON && (c = c.toJSON(b));
        b = j.call(c);
        switch (b) {
            case s:
            case r:
            case q:
                c = c.valueOf()
        }
        switch (c) {
            case null:
                return "null";
            case !0:
                return "true";
            case !1:
                return "false"
        }
        switch (typeof c) {
            case "string":
                return c.inspect(!0);
            case "number":
                return isFinite(c) ? "" + c : "null";
            case "object":
                for (var f = 0, g = h.length; f < g; f++)
                    if (h[f] === c) throw new TypeError;
                h.push(c);
                var i = [];
                if (b === t) {
                    f = 0;
                    for (g = c.length; f < g; f++) {
                        var k = e(f, c, h);
                        i.push("undefined" === typeof k ? "null" : k)
                    }
                    i = "[" + i.join(",") + "]"
                } else {
                    for (var l = Object.keys(c), f = 0, g = l.length; f < g; f++) b = l[f], k = e(b, c, h), "undefined" !== typeof k && i.push(b.inspect(!0) + ":" + k);
                    i = "{" + i.join(",") + "}"
                }
                h.pop();
                return i
        }
    }

    function f(a) {
        return JSON.stringify(a)
    }

    function g(b) {
        if (a(b) !== p) throw new TypeError;
        var c = [],
            e;
        for (e in b) b.hasOwnProperty(e) && c.push(e);
        return c
    }

    function h(a) {
        return j.call(a) === t
    }

    function i(a) {
        return "undefined" === typeof a
    }
    var j = Object.prototype.toString,
        k = "Null",
        l = "Undefined",
        m = "Boolean",
        o = "Number",
        n = "String",
        p = "Object",
        r = "[object Boolean]",
        s = "[object Number]",
        q = "[object String]",
        t = "[object Array]",
        z = window.JSON && "function" === typeof JSON.stringify && "0" === JSON.stringify(0) && "undefined" === typeof JSON.stringify(Prototype.K);
    if ("function" == typeof Array.isArray && Array.isArray([]) &&
        !Array.isArray({})) h = Array.isArray;
    b(Object, {
        extend: b,
        inspect: function(a) {
            try {
                return i(a) ? "undefined" : null === a ? "null" : a.inspect ? a.inspect() : "" + a
            } catch (b) {
                if (b instanceof RangeError) return "...";
                throw b;
            }
        },
        toJSON: z ? f : c,
        toQueryString: function(a) {
            return $H(a).toQueryString()
        },
        toHTML: function(a) {
            return a && a.toHTML ? a.toHTML() : String.interpret(a)
        },
        keys: Object.keys || g,
        values: function(a) {
            var b = [],
                c;
            for (c in a) b.push(a[c]);
            return b
        },
        clone: function(a) {
            return b({}, a)
        },
        isElement: function(a) {
            return !!(a && 1 == a.nodeType)
        },
        isArray: h,
        isHash: function(a) {
            return a instanceof Hash
        },
        isFunction: function(a) {
            return "[object Function]" === j.call(a)
        },
        isString: function(a) {
            return j.call(a) === q
        },
        isNumber: function(a) {
            return j.call(a) === s
        },
        isDate: function(a) {
            return "[object Date]" === j.call(a)
        },
        isUndefined: i
    })
})();
Object.extend(Function.prototype, function() {
    function a(a, b) {
        for (var c = a.length, h = b.length; h--;) a[c + h] = b[h];
        return a
    }

    function b(b, f) {
        b = c.call(b, 0);
        return a(b, f)
    }
    var c = Array.prototype.slice;
    return {
        argumentNames: function() {
            var a = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, "").replace(/\s+/g, "").split(",");
            return 1 == a.length && !a[0] ? [] : a
        },
        bind: function(a) {
            if (2 > arguments.length && Object.isUndefined(arguments[0])) return this;
            var f = this,
                g = c.call(arguments,
                    1);
            return function() {
                var c = b(g, arguments);
                return f.apply(a, c)
            }
        },
        bindAsEventListener: function(b) {
            var f = this,
                g = c.call(arguments, 1);
            return function(c) {
                c = a([c || window.event], g);
                return f.apply(b, c)
            }
        },
        curry: function() {
            if (!arguments.length) return this;
            var a = this,
                f = c.call(arguments, 0);
            return function() {
                var c = b(f, arguments);
                return a.apply(this, c)
            }
        },
        delay: function(a) {
            var b = this,
                g = c.call(arguments, 1);
            return window.setTimeout(function() {
                return b.apply(b, g)
            }, 1E3 * a)
        },
        defer: function() {
            return this.delay.apply(this,
                a([0.01], arguments))
        },
        wrap: function(b) {
            var c = this;
            return function() {
                var g = a([c.bind(this)], arguments);
                return b.apply(this, g)
            }
        },
        methodize: function() {
            if (this._methodized) return this._methodized;
            var b = this;
            return this._methodized = function() {
                var c = a([this], arguments);
                return b.apply(null, c)
            }
        }
    }
}());
(function(a) {
    function b() {
        return this.getUTCFullYear() + "-" + (this.getUTCMonth() + 1).toPaddedString(2) + "-" + this.getUTCDate().toPaddedString(2) + "T" + this.getUTCHours().toPaddedString(2) + ":" + this.getUTCMinutes().toPaddedString(2) + ":" + this.getUTCSeconds().toPaddedString(2) + "Z"
    }

    function c() {
        return this.toISOString()
    }
    if (!a.toISOString) a.toISOString = b;
    if (!a.toJSON) a.toJSON = c
})(Date.prototype);
RegExp.prototype.match = RegExp.prototype.test;
RegExp.escape = function(a) {
    return ("" + a).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")
};
var PeriodicalExecuter = Class.create({
    initialize: function(a, b) {
        this.callback = a;
        this.frequency = b;
        this.currentlyExecuting = !1;
        this.registerCallback()
    },
    registerCallback: function() {
        this.timer = setInterval(this.onTimerEvent.bind(this), 1E3 * this.frequency)
    },
    execute: function() {
        this.callback(this)
    },
    stop: function() {
        if (this.timer) clearInterval(this.timer), this.timer = null
    },
    onTimerEvent: function() {
        if (!this.currentlyExecuting) try {
            this.currentlyExecuting = !0, this.execute(), this.currentlyExecuting = !1
        } catch (a) {
            throw this.currentlyExecuting = !1, a;
        }
    }
});
Object.extend(String, {
    interpret: function(a) {
        return null == a ? "" : "" + a
    },
    specialChar: {
        "\u0008": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\u000c": "\\f",
        "\r": "\\r",
        "\\": "\\\\"
    }
});
Object.extend(String.prototype, function() {
    function a(a) {
        if (Object.isFunction(a)) return a;
        var b = new Template(a);
        return function(a) {
            return b.evaluate(a)
        }
    }

    function b() {
        return this.replace(/^\s+/, "").replace(/\s+$/, "")
    }

    function c(a) {
        var b = this.strip().match(/([^?#]*)(#.*)?$/);
        return !b ? {} : b[1].split(a || "&").inject({}, function(a, b) {
            if ((b = b.split("="))[0]) {
                var c = decodeURIComponent(b.shift()),
                    e = 1 < b.length ? b.join("=") : b[0];
                void 0 != e && (e = decodeURIComponent(e));
                c in a ? (Object.isArray(a[c]) || (a[c] = [a[c]]), a[c].push(e)) :
                    a[c] = e
            }
            return a
        })
    }

    function e(a) {
        var b = this.unfilterJSON(),
            c = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        c.test(b) && (b = b.replace(c, function(a) {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }));
        try {
            if (!a || b.isJSON()) return eval("(" + b + ")")
        } catch (e) {}
        throw new SyntaxError("Badly formed JSON string: " + this.inspect());
    }

    function f() {
        var a = this.unfilterJSON();
        return JSON.parse(a)
    }
    var g = window.JSON && "function" === typeof JSON.parse &&
        JSON.parse('{"test": true}').test;
    return {
        gsub: function(b, c) {
            var e = "",
                f = this,
                g, c = a(c);
            Object.isString(b) && (b = RegExp.escape(b));
            if (!b.length && !b.source) return c = c(""), c + f.split("").join(c) + c;
            for (; 0 < f.length;)(g = f.match(b)) ? (e += f.slice(0, g.index), e += String.interpret(c(g)), f = f.slice(g.index + g[0].length)) : (e += f, f = "");
            return e
        },
        sub: function(b, c, e) {
            c = a(c);
            e = Object.isUndefined(e) ? 1 : e;
            return this.gsub(b, function(a) {
                return 0 > --e ? a[0] : c(a)
            })
        },
        scan: function(a, b) {
            this.gsub(a, b);
            return "" + this
        },
        truncate: function(a,
            b) {
            a = a || 30;
            b = Object.isUndefined(b) ? "..." : b;
            return this.length > a ? this.slice(0, a - b.length) + b : "" + this
        },
        strip: String.prototype.trim || b,
        stripTags: function() {
            return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, "")
        },
        stripScripts: function() {
            return this.replace(RegExp(Prototype.ScriptFragment, "img"), "")
        },
        extractScripts: function() {
            var a = RegExp(Prototype.ScriptFragment, "im");
            return (this.match(RegExp(Prototype.ScriptFragment, "img")) || []).map(function(b) {
                return (b.match(a) || ["", ""])[1]
            })
        },
        evalScripts: function() {
            return this.extractScripts().map(function(a) {
                return eval(a)
            })
        },
        escapeHTML: function() {
            return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        },
        unescapeHTML: function() {
            return this.stripTags().replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
        },
        toQueryParams: c,
        parseQuery: c,
        toArray: function() {
            return this.split("")
        },
        succ: function() {
            return this.slice(0, this.length - 1) + String.fromCharCode(this.charCodeAt(this.length - 1) + 1)
        },
        times: function(a) {
            return 1 > a ? "" : Array(a + 1).join(this)
        },
        camelize: function() {
            return this.replace(/-+(.)?/g, function(a,
                b) {
                return b ? b.toUpperCase() : ""
            })
        },
        capitalize: function() {
            return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase()
        },
        underscore: function() {
            return this.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/-/g, "_").toLowerCase()
        },
        dasherize: function() {
            return this.replace(/_/g, "-")
        },
        inspect: function(a) {
            var b = this.replace(/[\x00-\x1f\\]/g, function(a) {
                return a in String.specialChar ? String.specialChar[a] : "\\u00" + a.charCodeAt().toPaddedString(2,
                    16)
            });
            return a ? '"' + b.replace(/"/g, '\\"') + '"' : "'" + b.replace(/'/g, "\\'") + "'"
        },
        unfilterJSON: function(a) {
            return this.replace(a || Prototype.JSONFilter, "$1")
        },
        isJSON: function() {
            var a = this;
            if (a.blank()) return !1;
            a = a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@");
            a = a.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]");
            a = a.replace(/(?:^|:|,)(?:\s*\[)+/g, "");
            return /^[\],:{}\s]*$/.test(a)
        },
        evalJSON: g ? f : e,
        include: function(a) {
            return -1 < this.indexOf(a)
        },
        startsWith: function(a) {
            return 0 ===
                this.lastIndexOf(a, 0)
        },
        endsWith: function(a) {
            var b = this.length - a.length;
            return 0 <= b && this.indexOf(a, b) === b
        },
        empty: function() {
            return "" == this
        },
        blank: function() {
            return /^\s*$/.test(this)
        },
        interpolate: function(a, b) {
            return (new Template(this, b)).evaluate(a)
        }
    }
}());
var Template = Class.create({
    initialize: function(a, b) {
        this.template = a.toString();
        this.pattern = b || Template.Pattern
    },
    evaluate: function(a) {
        a && Object.isFunction(a.toTemplateReplacements) && (a = a.toTemplateReplacements());
        return this.template.gsub(this.pattern, function(b) {
            if (null == a) return b[1] + "";
            var c = b[1] || "";
            if ("\\" == c) return b[2];
            var e = a,
                f = b[3],
                g = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/,
                b = g.exec(f);
            if (null == b) return c;
            for (; null != b;) {
                var h = b[1].startsWith("[") ? b[2].replace(/\\\\]/g, "]") : b[1],
                    e = e[h];
                if (null ==
                    e || "" == b[3]) break;
                f = f.substring("[" == b[3] ? b[1].length : b[0].length);
                b = g.exec(f)
            }
            return c + String.interpret(e)
        })
    }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
var $break = {},
    Enumerable = function() {
        function a(a, b) {
            var a = a || Prototype.K,
                c = !0;
            this.each(function(e, f) {
                c = c && !!a.call(b, e, f);
                if (!c) throw $break;
            });
            return c
        }

        function b(a, b) {
            var a = a || Prototype.K,
                c = !1;
            this.each(function(e, f) {
                if (c = !!a.call(b, e, f)) throw $break;
            });
            return c
        }

        function c(a, b) {
            var a = a || Prototype.K,
                c = [];
            this.each(function(e, f) {
                c.push(a.call(b, e, f))
            });
            return c
        }

        function e(a, b) {
            var c;
            this.each(function(e, f) {
                if (a.call(b, e, f)) throw c = e, $break;
            });
            return c
        }

        function f(a, b) {
            var c = [];
            this.each(function(e,
                f) {
                a.call(b, e, f) && c.push(e)
            });
            return c
        }

        function g(a) {
            if (Object.isFunction(this.indexOf) && -1 != this.indexOf(a)) return !0;
            var b = !1;
            this.each(function(c) {
                if (c == a) throw b = !0, $break;
            });
            return b
        }

        function h() {
            return this.map()
        }
        return {
            each: function(a, b) {
                var c = 0;
                try {
                    this._each(function(e) {
                        a.call(b, e, c++)
                    })
                } catch (e) {
                    if (e != $break) throw e;
                }
                return this
            },
            eachSlice: function(a, b, c) {
                var e = -a,
                    f = [],
                    h = this.toArray();
                if (1 > a) return h;
                for (;
                    (e += a) < h.length;) f.push(h.slice(e, e + a));
                return f.collect(b, c)
            },
            all: a,
            every: a,
            any: b,
            some: b,
            collect: c,
            map: c,
            detect: e,
            findAll: f,
            select: f,
            filter: f,
            grep: function(a, b, c) {
                var b = b || Prototype.K,
                    e = [];
                Object.isString(a) && (a = RegExp(RegExp.escape(a)));
                this.each(function(f, h) {
                    a.match(f) && e.push(b.call(c, f, h))
                });
                return e
            },
            include: g,
            member: g,
            inGroupsOf: function(a, b) {
                b = Object.isUndefined(b) ? null : b;
                return this.eachSlice(a, function(c) {
                    for (; c.length < a;) c.push(b);
                    return c
                })
            },
            inject: function(a, b, c) {
                this.each(function(e, f) {
                    a = b.call(c, a, e, f)
                });
                return a
            },
            invoke: function(a) {
                var b = $A(arguments).slice(1);
                return this.map(function(c) {
                    return c[a].apply(c, b)
                })
            },
            max: function(a, b) {
                var a = a || Prototype.K,
                    c;
                this.each(function(e, f) {
                    e = a.call(b, e, f);
                    if (null == c || e >= c) c = e
                });
                return c
            },
            min: function(a, b) {
                var a = a || Prototype.K,
                    c;
                this.each(function(e, f) {
                    e = a.call(b, e, f);
                    if (null == c || e < c) c = e
                });
                return c
            },
            partition: function(a, b) {
                var a = a || Prototype.K,
                    c = [],
                    e = [];
                this.each(function(f, h) {
                    (a.call(b, f, h) ? c : e).push(f)
                });
                return [c, e]
            },
            pluck: function(a) {
                var b = [];
                this.each(function(c) {
                    b.push(c[a])
                });
                return b
            },
            reject: function(a, b) {
                var c = [];
                this.each(function(e, f) {
                    a.call(b, e, f) || c.push(e)
                });
                return c
            },
            sortBy: function(a, b) {
                return this.map(function(c, e) {
                    return {
                        value: c,
                        criteria: a.call(b, c, e)
                    }
                }).sort(function(a, b) {
                    var c = a.criteria,
                        e = b.criteria;
                    return c < e ? -1 : c > e ? 1 : 0
                }).pluck("value")
            },
            toArray: h,
            entries: h,
            zip: function() {
                var a = Prototype.K,
                    b = $A(arguments);
                Object.isFunction(b.last()) && (a = b.pop());
                var c = [this].concat(b).map($A);
                return this.map(function(b, e) {
                    return a(c.pluck(e))
                })
            },
            size: function() {
                return this.toArray().length
            },
            inspect: function() {
                return "#<Enumerable:" +
                    this.toArray().inspect() + ">"
            },
            find: e
        }
    }();

function $A(a) {
    if (!a) return [];
    if ("toArray" in Object(a)) return a.toArray();
    for (var b = a.length || 0, c = Array(b); b--;) c[b] = a[b];
    return c
}

function $w(a) {
    return !Object.isString(a) ? [] : (a = a.strip()) ? a.split(/\s+/) : []
}
Array.from = $A;
(function() {
    function a(a, b) {
        for (var c = 0, e = this.length >>> 0; c < e; c++) c in this && a.call(b, this[c], c, this)
    }

    function b() {
        return h.call(this, 0)
    }

    function c(a, b) {
        b || (b = 0);
        var c = this.length;
        for (0 > b && (b = c + b); b < c; b++)
            if (this[b] === a) return b;
        return -1
    }

    function e(a, b) {
        var b = isNaN(b) ? this.length : (0 > b ? this.length + b : b) + 1,
            c = this.slice(0, b).reverse().indexOf(a);
        return 0 > c ? c : b - c - 1
    }

    function f() {
        for (var a = h.call(this, 0), b, c = 0, e = arguments.length; c < e; c++)
            if (b = arguments[c], Object.isArray(b) && !("callee" in b))
                for (var f = 0, g =
                        b.length; f < g; f++) a.push(b[f]);
            else a.push(b);
        return a
    }
    var g = Array.prototype,
        h = g.slice,
        i = g.forEach;
    i || (i = a);
    Object.extend(g, Enumerable);
    if (!g._reverse) g._reverse = g.reverse;
    Object.extend(g, {
        _each: i,
        clear: function() {
            this.length = 0;
            return this
        },
        first: function() {
            return this[0]
        },
        last: function() {
            return this[this.length - 1]
        },
        compact: function() {
            return this.select(function(a) {
                return null != a
            })
        },
        flatten: function() {
            return this.inject([], function(a, b) {
                if (Object.isArray(b)) return a.concat(b.flatten());
                a.push(b);
                return a
            })
        },
        without: function() {
            var a = h.call(arguments, 0);
            return this.select(function(b) {
                return !a.include(b)
            })
        },
        reverse: function(a) {
            return (!1 === a ? this.toArray() : this)._reverse()
        },
        uniq: function(a) {
            return this.inject([], function(b, c, e) {
                (0 == e || (a ? b.last() != c : !b.include(c))) && b.push(c);
                return b
            })
        },
        intersect: function(a) {
            return this.uniq().findAll(function(b) {
                return a.detect(function(a) {
                    return b === a
                })
            })
        },
        clone: b,
        toArray: b,
        size: function() {
            return this.length
        },
        inspect: function() {
            return "[" + this.map(Object.inspect).join(", ") +
                "]"
        }
    });
    if (function() {
            return 1 !== [].concat(arguments)[0][0]
        }(1, 2)) g.concat = f;
    if (!g.indexOf) g.indexOf = c;
    if (!g.lastIndexOf) g.lastIndexOf = e
})();

function $H(a) {
    return new Hash(a)
}
var Hash = Class.create(Enumerable, function() {
    function a() {
        return Object.clone(this._object)
    }
    return {
        initialize: function(a) {
            this._object = Object.isHash(a) ? a.toObject() : Object.clone(a)
        },
        _each: function(a) {
            for (var c in this._object) {
                var e = this._object[c],
                    f = [c, e];
                f.key = c;
                f.value = e;
                a(f)
            }
        },
        set: function(a, c) {
            return this._object[a] = c
        },
        get: function(a) {
            if (this._object[a] !== Object.prototype[a]) return this._object[a]
        },
        unset: function(a) {
            var c = this._object[a];
            delete this._object[a];
            return c
        },
        toObject: a,
        toTemplateReplacements: a,
        keys: function() {
            return this.pluck("key")
        },
        values: function() {
            return this.pluck("value")
        },
        index: function(a) {
            var c = this.detect(function(c) {
                return c.value === a
            });
            return c && c.key
        },
        merge: function(a) {
            return this.clone().update(a)
        },
        update: function(a) {
            return (new Hash(a)).inject(this, function(a, b) {
                a.set(b.key, b.value);
                return a
            })
        },
        toQueryString: function() {
            return this.inject([], function(a, c) {
                var e = encodeURIComponent(c.key),
                    f = c.value;
                if (f && "object" == typeof f) {
                    if (Object.isArray(f)) {
                        for (var g = [], h = 0, i = f.length, j; h <
                            i; h++) j = f[h], g.push(Object.isUndefined(j) ? e : e + "=" + encodeURIComponent(String.interpret(j)));
                        return a.concat(g)
                    }
                } else a.push(Object.isUndefined(f) ? e : e + "=" + encodeURIComponent(String.interpret(f)));
                return a
            }).join("&")
        },
        inspect: function() {
            return "#<Hash:{" + this.map(function(a) {
                return a.map(Object.inspect).join(": ")
            }).join(", ") + "}>"
        },
        toJSON: a,
        clone: function() {
            return new Hash(this)
        }
    }
}());
Hash.from = $H;
Object.extend(Number.prototype, function() {
    return {
        toColorPart: function() {
            return this.toPaddedString(2, 16)
        },
        succ: function() {
            return this + 1
        },
        times: function(a, b) {
            $R(0, this, !0).each(a, b);
            return this
        },
        toPaddedString: function(a, b) {
            var c = this.toString(b || 10);
            return "0".times(a - c.length) + c
        },
        abs: function() {
            return Math.abs(this)
        },
        round: function() {
            return Math.round(this)
        },
        ceil: function() {
            return Math.ceil(this)
        },
        floor: function() {
            return Math.floor(this)
        }
    }
}());

function $R(a, b, c) {
    return new ObjectRange(a, b, c)
}
var ObjectRange = Class.create(Enumerable, function() {
        return {
            initialize: function(a, b, c) {
                this.start = a;
                this.end = b;
                this.exclusive = c
            },
            _each: function(a) {
                for (var b = this.start; this.include(b);) a(b), b = b.succ()
            },
            include: function(a) {
                return a < this.start ? !1 : this.exclusive ? a < this.end : a <= this.end
            }
        }
    }()),
    Ajax = {
        getTransport: function() {
            return Try.these(function() {
                return new XMLHttpRequest
            }, function() {
                return new ActiveXObject("Msxml2.XMLHTTP")
            }, function() {
                return new ActiveXObject("Microsoft.XMLHTTP")
            }) || !1
        },
        activeRequestCount: 0,
        Responders: {
            responders: [],
            _each: function(a) {
                this.responders._each(a)
            },
            register: function(a) {
                this.include(a) || this.responders.push(a)
            },
            unregister: function(a) {
                this.responders = this.responders.without(a)
            },
            dispatch: function(a, b, c, e) {
                this.each(function(f) {
                    if (Object.isFunction(f[a])) try {
                        f[a].apply(f, [b, c, e])
                    } catch (g) {}
                })
            }
        }
    };
Object.extend(Ajax.Responders, Enumerable);
Ajax.Responders.register({
    onCreate: function() {
        Ajax.activeRequestCount++
    },
    onComplete: function() {
        Ajax.activeRequestCount--
    }
});
Ajax.Base = Class.create({
    initialize: function(a) {
        this.options = {
            method: "post",
            asynchronous: !0,
            contentType: "application/x-www-form-urlencoded",
            encoding: "UTF-8",
            parameters: "",
            evalJSON: !0,
            evalJS: !0
        };
        Object.extend(this.options, a || {});
        this.options.method = this.options.method.toLowerCase();
        if (Object.isHash(this.options.parameters)) this.options.parameters = this.options.parameters.toObject()
    }
});
Ajax.Request = Class.create(Ajax.Base, {
    _complete: !1,
    initialize: function($super, b, c) {
        $super(c);
        this.transport = Ajax.getTransport();
        this.request(b)
    },
    request: function(a) {
        this.url = a;
        this.method = this.options.method;
        a = Object.isString(this.options.parameters) ? this.options.parameters : Object.toQueryString(this.options.parameters);
        if (!["get", "post"].include(this.method)) a += (a ? "&" : "") + "_method=" + this.method, this.method = "post";
        a && "get" === this.method && (this.url += (this.url.include("?") ? "&" : "?") + a);
        this.parameters =
            a.toQueryParams();
        try {
            var b = new Ajax.Response(this);
            if (this.options.onCreate) this.options.onCreate(b);
            Ajax.Responders.dispatch("onCreate", this, b);
            this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);
            this.options.asynchronous && this.respondToReadyState.bind(this).defer(1);
            this.transport.onreadystatechange = this.onStateChange.bind(this);
            this.setRequestHeaders();
            this.body = "post" == this.method ? this.options.postBody || a : null;
            this.transport.send(this.body);
            if (!this.options.asynchronous &&
                this.transport.overrideMimeType) this.onStateChange()
        } catch (c) {
            this.dispatchException(c)
        }
    },
    onStateChange: function() {
        var a = this.transport.readyState;
        1 < a && !(4 == a && this._complete) && this.respondToReadyState(this.transport.readyState)
    },
    setRequestHeaders: function() {
        var a = {
            "X-Requested-With": "XMLHttpRequest",
            "X-Prototype-Version": Prototype.Version,
            Accept: "text/javascript, text/html, application/xml, text/xml, */*"
        };
        if ("post" == this.method && (a["Content-type"] = this.options.contentType + (this.options.encoding ?
                "; charset=" + this.options.encoding : ""), this.transport.overrideMimeType && 2005 > (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1])) a.Connection = "close";
        if ("object" == typeof this.options.requestHeaders) {
            var b = this.options.requestHeaders;
            if (Object.isFunction(b.push))
                for (var c = 0, e = b.length; c < e; c += 2) a[b[c]] = b[c + 1];
            else $H(b).each(function(b) {
                a[b.key] = b.value
            })
        }
        for (var f in a) this.transport.setRequestHeader(f, a[f])
    },
    success: function() {
        var a = this.getStatus();
        return !a || 200 <= a && 300 > a || 304 == a
    },
    getStatus: function() {
        try {
            return 1223 ===
                this.transport.status ? 204 : this.transport.status || 0
        } catch (a) {
            return 0
        }
    },
    respondToReadyState: function(a) {
        var a = Ajax.Request.Events[a],
            b = new Ajax.Response(this);
        if ("Complete" == a) {
            try {
                this._complete = !0, (this.options["on" + b.status] || this.options["on" + (this.success() ? "Success" : "Failure")] || Prototype.emptyFunction)(b, b.headerJSON)
            } catch (c) {
                this.dispatchException(c)
            }
            var e = b.getHeader("Content-type");
            ("force" == this.options.evalJS || this.options.evalJS && this.isSameOrigin() && e && e.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)) &&
            this.evalResponse()
        }
        try {
            (this.options["on" + a] || Prototype.emptyFunction)(b, b.headerJSON), Ajax.Responders.dispatch("on" + a, this, b, b.headerJSON)
        } catch (f) {
            this.dispatchException(f)
        }
        if ("Complete" == a) this.transport.onreadystatechange = Prototype.emptyFunction
    },
    isSameOrigin: function() {
        var a = this.url.match(/^\s*https?:\/\/[^\/]*/);
        return !a || a[0] == "#{protocol}//#{domain}#{port}".interpolate({
            protocol: location.protocol,
            domain: document.domain,
            port: location.port ? ":" + location.port : ""
        })
    },
    getHeader: function(a) {
        try {
            return this.transport.getResponseHeader(a) ||
                null
        } catch (b) {
            return null
        }
    },
    evalResponse: function() {
        try {
            return eval((this.transport.responseText || "").unfilterJSON())
        } catch (a) {
            this.dispatchException(a)
        }
    },
    dispatchException: function(a) {
        (this.options.onException || Prototype.emptyFunction)(this, a);
        Ajax.Responders.dispatch("onException", this, a)
    }
});
Ajax.Request.Events = ["Uninitialized", "Loading", "Loaded", "Interactive", "Complete"];
Ajax.Response = Class.create({
    initialize: function(a) {
        this.request = a;
        var a = this.transport = a.transport,
            b = this.readyState = a.readyState;
        if (2 < b && !Prototype.Browser.IE || 4 == b) this.status = this.getStatus(), this.statusText = this.getStatusText(), this.responseText = String.interpret(a.responseText), this.headerJSON = this._getHeaderJSON();
        if (4 == b) a = a.responseXML, this.responseXML = Object.isUndefined(a) ? null : a, this.responseJSON = this._getResponseJSON()
    },
    status: 0,
    statusText: "",
    getStatus: Ajax.Request.prototype.getStatus,
    getStatusText: function() {
        try {
            return this.transport.statusText ||
                ""
        } catch (a) {
            return ""
        }
    },
    getHeader: Ajax.Request.prototype.getHeader,
    getAllHeaders: function() {
        try {
            return this.getAllResponseHeaders()
        } catch (a) {
            return null
        }
    },
    getResponseHeader: function(a) {
        return this.transport.getResponseHeader(a)
    },
    getAllResponseHeaders: function() {
        return this.transport.getAllResponseHeaders()
    },
    _getHeaderJSON: function() {
        var a = this.getHeader("X-JSON");
        if (!a) return null;
        a = decodeURIComponent(escape(a));
        try {
            return a.evalJSON(this.request.options.sanitizeJSON || !this.request.isSameOrigin())
        } catch (b) {
            this.request.dispatchException(b)
        }
    },
    _getResponseJSON: function() {
        var a = this.request.options;
        if (!a.evalJSON || "force" != a.evalJSON && !(this.getHeader("Content-type") || "").include("application/json") || this.responseText.blank()) return null;
        try {
            return this.responseText.evalJSON(a.sanitizeJSON || !this.request.isSameOrigin())
        } catch (b) {
            this.request.dispatchException(b)
        }
    }
});
Ajax.Updater = Class.create(Ajax.Request, {
    initialize: function($super, b, c, e) {
        this.container = {
            success: b.success || b,
            failure: b.failure || (b.success ? null : b)
        };
        var e = Object.clone(e),
            f = e.onComplete;
        e.onComplete = function(b, c) {
            this.updateContent(b.responseText);
            Object.isFunction(f) && f(b, c)
        }.bind(this);
        $super(c, e)
    },
    updateContent: function(a) {
        var b = this.container[this.success() ? "success" : "failure"],
            c = this.options;
        c.evalScripts || (a = a.stripScripts());
        if (b = $(b))
            if (c.insertion)
                if (Object.isString(c.insertion)) {
                    var e = {};
                    e[c.insertion] = a;
                    b.insert(e)
                } else c.insertion(b, a);
        else b.update(a)
    }
});
Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
    initialize: function($super, b, c, e) {
        $super(e);
        this.onComplete = this.options.onComplete;
        this.frequency = this.options.frequency || 2;
        this.decay = this.options.decay || 1;
        this.updater = {};
        this.container = b;
        this.url = c;
        this.start()
    },
    start: function() {
        this.options.onComplete = this.updateComplete.bind(this);
        this.onTimerEvent()
    },
    stop: function() {
        this.updater.options.onComplete = void 0;
        clearTimeout(this.timer);
        (this.onComplete || Prototype.emptyFunction).apply(this, arguments)
    },
    updateComplete: function(a) {
        if (this.options.decay) this.decay = a.responseText == this.lastText ? this.decay * this.options.decay : 1, this.lastText = a.responseText;
        this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency)
    },
    onTimerEvent: function() {
        this.updater = new Ajax.Updater(this.container, this.url, this.options)
    }
});

function $(a) {
    if (1 < arguments.length) {
        for (var b = 0, c = [], e = arguments.length; b < e; b++) c.push($(arguments[b]));
        return c
    }
    Object.isString(a) && (a = document.getElementById(a));
    return Element.extend(a)
}
if (Prototype.BrowserFeatures.XPath) document._getElementsByXPath = function(a, b) {
    for (var c = [], e = document.evaluate(a, $(b) || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), f = 0, g = e.snapshotLength; f < g; f++) c.push(Element.extend(e.snapshotItem(f)));
    return c
};
if (!Node) var Node = {};
Node.ELEMENT_NODE || Object.extend(Node, {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
});
(function(a) {
    var b = function() {
            try {
                var a = document.createElement('<input name="x">');
                return "input" === a.tagName.toLowerCase() && "x" === a.name
            } catch (b) {
                return !1
            }
        }(),
        c = a.Element;
    a.Element = function(a, c) {
        var c = c || {},
            a = a.toLowerCase(),
            g = Element.cache;
        if (b && c.name) return a = "<" + a + ' name="' + c.name + '">', delete c.name, Element.writeAttribute(document.createElement(a), c);
        g[a] || (g[a] = Element.extend(document.createElement(a)));
        g = !("select" === a || "type" in c) ? g[a].cloneNode(!1) : document.createElement(a);
        return Element.writeAttribute(g,
            c)
    };
    Object.extend(a.Element, c || {});
    if (c) a.Element.prototype = c.prototype
})(this);
Element.idCounter = 1;
Element.cache = {};
Element._purgeElement = function(a) {
    var b = a._prototypeUID;
    if (b) Element.stopObserving(a), a._prototypeUID = void 0, delete Element.Storage[b]
};
Element.Methods = {
    visible: function(a) {
        return "none" != $(a).style.display
    },
    toggle: function(a) {
        a = $(a);
        Element[Element.visible(a) ? "hide" : "show"](a);
        return a
    },
    hide: function(a) {
        a = $(a);
        a.style.display = "none";
        return a
    },
    show: function(a) {
        a = $(a);
        a.style.display = "";
        return a
    },
    remove: function(a) {
        a = $(a);
        a.parentNode.removeChild(a);
        return a
    },
    update: function() {
        var a = function() {
                var a = document.createElement("select"),
                    b = !0;
                a.innerHTML = '<option value="test">test</option>';
                a.options && a.options[0] && (b = "OPTION" !== a.options[0].nodeName.toUpperCase());
                return b
            }(),
            b = function() {
                try {
                    var a = document.createElement("table");
                    if (a && a.tBodies) return a.innerHTML = "<tbody><tr><td>test</td></tr></tbody>", "undefined" == typeof a.tBodies[0]
                } catch (b) {
                    return !0
                }
            }(),
            c = function() {
                try {
                    var a = document.createElement("div");
                    a.innerHTML = "<link>";
                    return 0 === a.childNodes.length
                } catch (b) {
                    return !0
                }
            }(),
            e = a || b || c,
            f = function() {
                var a = document.createElement("script"),
                    b = !1;
                try {
                    a.appendChild(document.createTextNode("")), b = !a.firstChild || a.firstChild && 3 !== a.firstChild.nodeType
                } catch (c) {
                    b = !0
                }
                return b
            }();
        return function(a, b) {
            for (var a = $(a), i = Element._purgeElement, j = a.getElementsByTagName("*"), k = j.length; k--;) i(j[k]);
            b && b.toElement && (b = b.toElement());
            if (Object.isElement(b)) return a.update().insert(b);
            b = Object.toHTML(b);
            i = a.tagName.toUpperCase();
            if ("SCRIPT" === i && f) return a.text = b, a;
            if (e)
                if (i in Element._insertionTranslations.tags) {
                    for (; a.firstChild;) a.removeChild(a.firstChild);
                    Element._getContentFromAnonymousElement(i, b.stripScripts()).each(function(b) {
                        a.appendChild(b)
                    })
                } else if (c && Object.isString(b) &&
                -1 < b.indexOf("<link")) {
                for (; a.firstChild;) a.removeChild(a.firstChild);
                Element._getContentFromAnonymousElement(i, b.stripScripts(), !0).each(function(b) {
                    a.appendChild(b)
                })
            } else a.innerHTML = b.stripScripts();
            else a.innerHTML = b.stripScripts();
            b.evalScripts.bind(b).defer();
            return a
        }
    }(),
    replace: function(a, b) {
        a = $(a);
        if (b && b.toElement) b = b.toElement();
        else if (!Object.isElement(b)) {
            var b = Object.toHTML(b),
                c = a.ownerDocument.createRange();
            c.selectNode(a);
            b.evalScripts.bind(b).defer();
            b = c.createContextualFragment(b.stripScripts())
        }
        a.parentNode.replaceChild(b,
            a);
        return a
    },
    insert: function(a, b) {
        a = $(a);
        if (Object.isString(b) || Object.isNumber(b) || Object.isElement(b) || b && (b.toElement || b.toHTML)) b = {
            bottom: b
        };
        var c, e, f, g;
        for (g in b) c = b[g], g = g.toLowerCase(), e = Element._insertionTranslations[g], c && c.toElement && (c = c.toElement()), Object.isElement(c) ? e(a, c) : (c = Object.toHTML(c), f = ("before" == g || "after" == g ? a.parentNode : a).tagName.toUpperCase(), f = Element._getContentFromAnonymousElement(f, c.stripScripts()), ("top" == g || "after" == g) && f.reverse(), f.each(e.curry(a)), c.evalScripts.bind(c).defer());
        return a
    },
    wrap: function(a, b, c) {
        a = $(a);
        Object.isElement(b) ? $(b).writeAttribute(c || {}) : b = Object.isString(b) ? new Element(b, c) : new Element("div", b);
        a.parentNode && a.parentNode.replaceChild(b, a);
        b.appendChild(a);
        return b
    },
    inspect: function(a) {
        var a = $(a),
            b = "<" + a.tagName.toLowerCase();
        $H({
            id: "id",
            className: "class"
        }).each(function(c) {
            var e = c.first(),
                c = c.last();
            (e = (a[e] || "").toString()) && (b += " " + c + "=" + e.inspect(!0))
        });
        return b + ">"
    },
    recursivelyCollect: function(a, b, c) {
        for (var a = $(a), c = c || -1, e = [];
            (a = a[b]) && !(1 ==
                a.nodeType && e.push(Element.extend(a)), e.length == c););
        return e
    },
    ancestors: function(a) {
        return Element.recursivelyCollect(a, "parentNode")
    },
    descendants: function(a) {
        return Element.select(a, "*")
    },
    firstDescendant: function(a) {
        for (a = $(a).firstChild; a && 1 != a.nodeType;) a = a.nextSibling;
        return $(a)
    },
    immediateDescendants: function(a) {
        for (var b = [], a = $(a).firstChild; a;) 1 === a.nodeType && b.push(Element.extend(a)), a = a.nextSibling;
        return b
    },
    previousSiblings: function(a) {
        return Element.recursivelyCollect(a, "previousSibling")
    },
    nextSiblings: function(a) {
        return Element.recursivelyCollect(a, "nextSibling")
    },
    siblings: function(a) {
        a = $(a);
        return Element.previousSiblings(a).reverse().concat(Element.nextSiblings(a))
    },
    match: function(a, b) {
        a = $(a);
        return Object.isString(b) ? Prototype.Selector.match(a, b) : b.match(a)
    },
    up: function(a, b, c) {
        a = $(a);
        if (1 == arguments.length) return $(a.parentNode);
        var e = Element.ancestors(a);
        return Object.isNumber(b) ? e[b] : Prototype.Selector.find(e, b, c)
    },
    down: function(a, b, c) {
        a = $(a);
        return 1 == arguments.length ? Element.firstDescendant(a) :
            Object.isNumber(b) ? Element.descendants(a)[b] : Element.select(a, b)[c || 0]
    },
    previous: function(a, b, c) {
        a = $(a);
        Object.isNumber(b) && (c = b, b = !1);
        Object.isNumber(c) || (c = 0);
        return b ? Prototype.Selector.find(a.previousSiblings(), b, c) : a.recursivelyCollect("previousSibling", c + 1)[c]
    },
    next: function(a, b, c) {
        a = $(a);
        Object.isNumber(b) && (c = b, b = !1);
        Object.isNumber(c) || (c = 0);
        if (b) return Prototype.Selector.find(a.nextSiblings(), b, c);
        Object.isNumber(c);
        return a.recursivelyCollect("nextSibling", c + 1)[c]
    },
    select: function(a) {
        var a =
            $(a),
            b = Array.prototype.slice.call(arguments, 1).join(", ");
        return Prototype.Selector.select(b, a)
    },
    adjacent: function(a) {
        var a = $(a),
            b = Array.prototype.slice.call(arguments, 1).join(", ");
        return Prototype.Selector.select(b, a.parentNode).without(a)
    },
    identify: function(a) {
        var a = $(a),
            b = Element.readAttribute(a, "id");
        if (b) return b;
        do b = "anonymous_element_" + Element.idCounter++; while ($(b));
        Element.writeAttribute(a, "id", b);
        return b
    },
    readAttribute: function(a, b) {
        a = $(a);
        if (Prototype.Browser.IE) {
            var c = Element._attributeTranslations.read;
            if (c.values[b]) return c.values[b](a, b);
            c.names[b] && (b = c.names[b]);
            if (b.include(":")) return !a.attributes || !a.attributes[b] ? null : a.attributes[b].value
        }
        return a.getAttribute(b)
    },
    writeAttribute: function(a, b, c) {
        var a = $(a),
            e = {},
            f = Element._attributeTranslations.write;
        "object" == typeof b ? e = b : e[b] = Object.isUndefined(c) ? !0 : c;
        for (var g in e) b = f.names[g] || g, c = e[g], f.values[g] && (b = f.values[g](a, c)), !1 === c || null === c ? a.removeAttribute(b) : !0 === c ? a.setAttribute(b, b) : a.setAttribute(b, c);
        return a
    },
    getHeight: function(a) {
        return Element.getDimensions(a).height
    },
    getWidth: function(a) {
        return Element.getDimensions(a).width
    },
    classNames: function(a) {
        return new Element.ClassNames(a)
    },
    hasClassName: function(a, b) {
        if (a = $(a)) {
            var c = a.className;
            return 0 < c.length && (c == b || RegExp("(^|\\s)" + b + "(\\s|$)").test(c))
        }
    },
    addClassName: function(a, b) {
        if (a = $(a)) return Element.hasClassName(a, b) || (a.className += (a.className ? " " : "") + b), a
    },
    removeClassName: function(a, b) {
        if (a = $(a)) return a.className = a.className.replace(RegExp("(^|\\s+)" + b + "(\\s+|$)"), " ").strip(), a
    },
    toggleClassName: function(a,
        b) {
        return !(a = $(a)) ? void 0 : Element[Element.hasClassName(a, b) ? "removeClassName" : "addClassName"](a, b)
    },
    cleanWhitespace: function(a) {
        for (var a = $(a), b = a.firstChild; b;) {
            var c = b.nextSibling;
            3 == b.nodeType && !/\S/.test(b.nodeValue) && a.removeChild(b);
            b = c
        }
        return a
    },
    empty: function(a) {
        return $(a).innerHTML.blank()
    },
    descendantOf: function(a, b) {
        a = $(a);
        b = $(b);
        if (a.compareDocumentPosition) return 8 === (a.compareDocumentPosition(b) & 8);
        if (b.contains) return b.contains(a) && b !== a;
        for (; a = a.parentNode;)
            if (a == b) return !0;
        return !1
    },
    scrollTo: function(a) {
        var a = $(a),
            b = Element.cumulativeOffset(a);
        window.scrollTo(b[0], b[1]);
        return a
    },
    getStyle: function(a, b) {
        var a = $(a),
            b = "float" == b ? "cssFloat" : b.camelize(),
            c = a.style[b];
        if (!c || "auto" == c) c = (c = document.defaultView.getComputedStyle(a, null)) ? c[b] : null;
        return "opacity" == b ? c ? parseFloat(c) : 1 : "auto" == c ? null : c
    },
    getOpacity: function(a) {
        return $(a).getStyle("opacity")
    },
    setStyle: function(a, b) {
        var a = $(a),
            c = a.style;
        if (Object.isString(b)) return a.style.cssText += ";" + b, b.include("opacity") ? a.setOpacity(b.match(/opacity:\s*(\d?\.?\d*)/)[1]) :
            a;
        for (var e in b) "opacity" == e ? a.setOpacity(b[e]) : c["float" == e || "cssFloat" == e ? Object.isUndefined(c.styleFloat) ? "cssFloat" : "styleFloat" : e] = b[e];
        return a
    },
    setOpacity: function(a, b) {
        a = $(a);
        a.style.opacity = 1 == b || "" === b ? "" : 1.0E-5 > b ? 0 : b;
        return a
    },
    makePositioned: function(a) {
        var a = $(a),
            b = Element.getStyle(a, "position");
        if ("static" == b || !b)
            if (a._madePositioned = !0, a.style.position = "relative", Prototype.Browser.Opera) a.style.top = 0, a.style.left = 0;
        return a
    },
    undoPositioned: function(a) {
        a = $(a);
        if (a._madePositioned) a._madePositioned =
            void 0, a.style.position = a.style.top = a.style.left = a.style.bottom = a.style.right = "";
        return a
    },
    makeClipping: function(a) {
        a = $(a);
        if (a._overflow) return a;
        a._overflow = Element.getStyle(a, "overflow") || "auto";
        if ("hidden" !== a._overflow) a.style.overflow = "hidden";
        return a
    },
    undoClipping: function(a) {
        a = $(a);
        if (!a._overflow) return a;
        a.style.overflow = "auto" == a._overflow ? "" : a._overflow;
        a._overflow = null;
        return a
    },
    clonePosition: function(a, b, c) {
        var c = Object.extend({
                setLeft: !0,
                setTop: !0,
                setWidth: !0,
                setHeight: !0,
                offsetTop: 0,
                offsetLeft: 0
            }, c || {}),
            b = $(b),
            e = Element.viewportOffset(b),
            f = [0, 0],
            g = null,
            a = $(a);
        "absolute" == Element.getStyle(a, "position") && (g = Element.getOffsetParent(a), f = Element.viewportOffset(g));
        g == document.body && (f[0] -= document.body.offsetLeft, f[1] -= document.body.offsetTop);
        if (c.setLeft) a.style.left = e[0] - f[0] + c.offsetLeft + "px";
        if (c.setTop) a.style.top = e[1] - f[1] + c.offsetTop + "px";
        if (c.setWidth) a.style.width = b.offsetWidth + "px";
        if (c.setHeight) a.style.height = b.offsetHeight + "px";
        return a
    }
};
Object.extend(Element.Methods, {
    getElementsBySelector: Element.Methods.select,
    childElements: Element.Methods.immediateDescendants
});
Element._attributeTranslations = {
    write: {
        names: {
            className: "class",
            htmlFor: "for"
        },
        values: {}
    }
};
if (Prototype.Browser.Opera) Element.Methods.getStyle = Element.Methods.getStyle.wrap(function(a, b, c) {
    switch (c) {
        case "height":
        case "width":
            if (!Element.visible(b)) return null;
            var e = parseInt(a(b, c), 10);
            return e !== b["offset" + c.capitalize()] ? e + "px" : ("height" === c ? ["border-top-width", "padding-top", "padding-bottom", "border-bottom-width"] : ["border-left-width", "padding-left", "padding-right", "border-right-width"]).inject(e, function(c, e) {
                var h = a(b, e);
                return null === h ? c : c - parseInt(h, 10)
            }) + "px";
        default:
            return a(b,
                c)
    }
}), Element.Methods.readAttribute = Element.Methods.readAttribute.wrap(function(a, b, c) {
    return "title" === c ? b.title : a(b, c)
});
else if (Prototype.Browser.IE) Element.Methods.getStyle = function(a, b) {
        var a = $(a),
            b = "float" == b || "cssFloat" == b ? "styleFloat" : b.camelize(),
            c = a.style[b];
        !c && a.currentStyle && (c = a.currentStyle[b]);
        return "opacity" == b ? (c = (a.getStyle("filter") || "").match(/alpha\(opacity=(.*)\)/)) && c[1] ? parseFloat(c[1]) / 100 : 1 : "auto" == c ? ("width" == b || "height" == b) && "none" != a.getStyle("display") ? a["offset" + b.capitalize()] +
            "px" : null : c
    }, Element.Methods.setOpacity = function(a, b) {
        var a = $(a),
            c = a.currentStyle;
        if (c && !c.hasLayout || !c && "normal" == a.style.zoom) a.style.zoom = 1;
        var c = a.getStyle("filter"),
            e = a.style;
        if (1 == b || "" === b) return (c = c.replace(/alpha\([^\)]*\)/gi, "")) ? e.filter = c : e.removeAttribute("filter"), a;
        1.0E-5 > b && (b = 0);
        e.filter = c.replace(/alpha\([^\)]*\)/gi, "") + "alpha(opacity=" + 100 * b + ")";
        return a
    }, Element._attributeTranslations = function() {
        var a = "className",
            b = "for",
            c = document.createElement("div");
        c.setAttribute(a, "x");
        "x" !==
        c.className && (c.setAttribute("class", "x"), "x" === c.className && (a = "class"));
        c = null;
        c = document.createElement("label");
        c.setAttribute(b, "x");
        "x" !== c.htmlFor && (c.setAttribute("htmlFor", "x"), "x" === c.htmlFor && (b = "htmlFor"));
        c = null;
        return {
            read: {
                names: {
                    "class": a,
                    className: a,
                    "for": b,
                    htmlFor: b
                },
                values: {
                    _getAttr: function(a, b) {
                        return a.getAttribute(b)
                    },
                    _getAttr2: function(a, b) {
                        return a.getAttribute(b, 2)
                    },
                    _getAttrNode: function(a, b) {
                        var c = a.getAttributeNode(b);
                        return c ? c.value : ""
                    },
                    _getEv: function() {
                        var a = document.createElement("div"),
                            b;
                        a.onclick = Prototype.emptyFunction;
                        a = a.getAttribute("onclick"); - 1 < ("" + a).indexOf("{") ? b = function(a, b) {
                            b = a.getAttribute(b);
                            if (!b) return null;
                            b = b.toString();
                            b = b.split("{")[1];
                            b = b.split("}")[0];
                            return b.strip()
                        } : "" === a && (b = function(a, b) {
                            b = a.getAttribute(b);
                            return !b ? null : b.strip()
                        });
                        a = null;
                        return b
                    }(),
                    _flag: function(a, b) {
                        return $(a).hasAttribute(b) ? b : null
                    },
                    style: function(a) {
                        return a.style.cssText.toLowerCase()
                    },
                    title: function(a) {
                        return a.title
                    }
                }
            }
        }
    }(), Element._attributeTranslations.write = {
        names: Object.extend({
            cellpadding: "cellPadding",
            cellspacing: "cellSpacing"
        }, Element._attributeTranslations.read.names),
        values: {
            checked: function(a, b) {
                a.checked = !!b
            },
            style: function(a, b) {
                a.style.cssText = b ? b : ""
            }
        }
    }, Element._attributeTranslations.has = {}, $w("colSpan rowSpan vAlign dateTime accessKey tabIndex encType maxLength readOnly longDesc frameBorder").each(function(a) {
        Element._attributeTranslations.write.names[a.toLowerCase()] = a;
        Element._attributeTranslations.has[a.toLowerCase()] = a
    }),
    function(a) {
        Object.extend(a, {
            href: a._getAttr2,
            src: a._getAttr2,
            type: a._getAttr,
            action: a._getAttrNode,
            disabled: a._flag,
            checked: a._flag,
            readonly: a._flag,
            multiple: a._flag,
            onload: a._getEv,
            onunload: a._getEv,
            onclick: a._getEv,
            ondblclick: a._getEv,
            onmousedown: a._getEv,
            onmouseup: a._getEv,
            onmouseover: a._getEv,
            onmousemove: a._getEv,
            onmouseout: a._getEv,
            onfocus: a._getEv,
            onblur: a._getEv,
            onkeypress: a._getEv,
            onkeydown: a._getEv,
            onkeyup: a._getEv,
            onsubmit: a._getEv,
            onreset: a._getEv,
            onselect: a._getEv,
            onchange: a._getEv
        })
    }(Element._attributeTranslations.read.values), Prototype.BrowserFeatures.ElementExtensions &&
    function() {
        Element.Methods.down = function(a, b, c) {
            var a = $(a),
                e;
            if (1 == arguments.length) e = a.firstDescendant();
            else if (Object.isNumber(b)) {
                e = a.getElementsByTagName("*");
                for (var f = [], g = 0, h; h = e[g]; g++) "!" !== h.tagName && f.push(h);
                e = f[b]
            } else e = Element.select(a, b)[c || 0];
            return e
        }
    }();
else if (Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent)) Element.Methods.setOpacity = function(a, b) {
    a = $(a);
    a.style.opacity = 1 == b ? 0.999999 : "" === b ? "" : 1.0E-5 > b ? 0 : b;
    return a
};
else if (Prototype.Browser.WebKit) Element.Methods.setOpacity =
    function(a, b) {
        a = $(a);
        a.style.opacity = 1 == b || "" === b ? "" : 1.0E-5 > b ? 0 : b;
        if (1 == b)
            if ("IMG" == a.tagName.toUpperCase() && a.width) a.width++, a.width--;
            else try {
                var c = document.createTextNode(" ");
                a.appendChild(c);
                a.removeChild(c)
            } catch (e) {}
            return a
    };
if ("outerHTML" in document.documentElement) Element.Methods.replace = function(a, b) {
    a = $(a);
    b && b.toElement && (b = b.toElement());
    if (Object.isElement(b)) return a.parentNode.replaceChild(b, a), a;
    var b = Object.toHTML(b),
        c = a.parentNode,
        e = c.tagName.toUpperCase();
    if (Element._insertionTranslations.tags[e]) {
        var f = a.next(),
            e = Element._getContentFromAnonymousElement(e, b.stripScripts());
        c.removeChild(a);
        f ? e.each(function(a) {
            c.insertBefore(a, f)
        }) : e.each(function(a) {
            c.appendChild(a)
        })
    } else a.outerHTML = b.stripScripts();
    b.evalScripts.bind(b).defer();
    return a
};
Element._returnOffset = function(a, b) {
    var c = [a, b];
    c.left = a;
    c.top = b;
    return c
};
Element._getContentFromAnonymousElement = function(a, b, c) {
    var e = new Element("div"),
        a = Element._insertionTranslations.tags[a],
        f = !1;
    a ? f = !0 : c && (f = !0, a = ["", "", 0]);
    if (f) {
        e.innerHTML = "&nbsp;" + a[0] + b + a[1];
        e.removeChild(e.firstChild);
        for (b = a[2]; b--;) e = e.firstChild
    } else e.innerHTML = b;
    return $A(e.childNodes)
};
Element._insertionTranslations = {
    before: function(a, b) {
        a.parentNode.insertBefore(b, a)
    },
    top: function(a, b) {
        a.insertBefore(b, a.firstChild)
    },
    bottom: function(a, b) {
        a.appendChild(b)
    },
    after: function(a, b) {
        a.parentNode.insertBefore(b, a.nextSibling)
    },
    tags: {
        TABLE: ["<table>", "</table>", 1],
        TBODY: ["<table><tbody>", "</tbody></table>", 2],
        TR: ["<table><tbody><tr>", "</tr></tbody></table>", 3],
        TD: ["<table><tbody><tr><td>", "</td></tr></tbody></table>", 4],
        SELECT: ["<select>", "</select>", 1]
    }
};
(function() {
    var a = Element._insertionTranslations.tags;
    Object.extend(a, {
        THEAD: a.TBODY,
        TFOOT: a.TBODY,
        TH: a.TD
    })
})();
Element.Methods.Simulated = {
    hasAttribute: function(a, b) {
        var b = Element._attributeTranslations.has[b] || b,
            c = $(a).getAttributeNode(b);
        return !(!c || !c.specified)
    }
};
Element.Methods.ByTag = {};
Object.extend(Element, Element.Methods);
(function(a) {
    if (!Prototype.BrowserFeatures.ElementExtensions && a.__proto__) window.HTMLElement = {}, window.HTMLElement.prototype = a.__proto__, Prototype.BrowserFeatures.ElementExtensions = !0
})(document.createElement("div"));
Element.extend = function() {
    function a(a, b) {
        for (var c in b) {
            var e = b[c];
            Object.isFunction(e) && !(c in a) && (a[c] = e.methodize())
        }
    }
    var b = function(a) {
        if ("undefined" != typeof window.Element) {
            var b = window.Element.prototype;
            if (b) {
                var c = "_" + (Math.random() + "").slice(2),
                    a = document.createElement(a);
                b[c] = "x";
                a = "x" !== a[c];
                delete b[c];
                return a
            }
        }
        return !1
    }("object");
    if (Prototype.BrowserFeatures.SpecificElementExtensions) return b ? function(b) {
        if (b && "undefined" == typeof b._extendedByPrototype) {
            var c = b.tagName;
            c && /^(?:object|applet|embed)$/i.test(c) &&
                (a(b, Element.Methods), a(b, Element.Methods.Simulated), a(b, Element.Methods.ByTag[c.toUpperCase()]))
        }
        return b
    } : Prototype.K;
    var c = {},
        e = Element.Methods.ByTag,
        b = Object.extend(function(b) {
            if (!b || "undefined" != typeof b._extendedByPrototype || 1 != b.nodeType || b == window) return b;
            var g = Object.clone(c),
                h = b.tagName.toUpperCase();
            e[h] && Object.extend(g, e[h]);
            a(b, g);
            b._extendedByPrototype = Prototype.emptyFunction;
            return b
        }, {
            refresh: function() {
                Prototype.BrowserFeatures.ElementExtensions || (Object.extend(c, Element.Methods),
                    Object.extend(c, Element.Methods.Simulated))
            }
        });
    b.refresh();
    return b
}();
Element.hasAttribute = document.documentElement.hasAttribute ? function(a, b) {
    return a.hasAttribute(b)
} : Element.Methods.Simulated.hasAttribute;
Element.addMethods = function(a) {
    function b(b) {
        b = b.toUpperCase();
        Element.Methods.ByTag[b] || (Element.Methods.ByTag[b] = {});
        Object.extend(Element.Methods.ByTag[b], a)
    }

    function c(a, b, c) {
        var c = c || !1,
            e;
        for (e in a) {
            var f = a[e];
            if (Object.isFunction(f) && (!c || !(e in b))) b[e] = f.methodize()
        }
    }

    function e(a) {
        var b, c = {
            OPTGROUP: "OptGroup",
            TEXTAREA: "TextArea",
            P: "Paragraph",
            FIELDSET: "FieldSet",
            UL: "UList",
            OL: "OList",
            DL: "DList",
            DIR: "Directory",
            H1: "Heading",
            H2: "Heading",
            H3: "Heading",
            H4: "Heading",
            H5: "Heading",
            H6: "Heading",
            Q: "Quote",
            INS: "Mod",
            DEL: "Mod",
            A: "Anchor",
            IMG: "Image",
            CAPTION: "TableCaption",
            COL: "TableCol",
            COLGROUP: "TableCol",
            THEAD: "TableSection",
            TFOOT: "TableSection",
            TBODY: "TableSection",
            TR: "TableRow",
            TH: "TableCell",
            TD: "TableCell",
            FRAMESET: "FrameSet",
            IFRAME: "IFrame"
        };
        c[a] && (b = "HTML" + c[a] + "Element");
        if (window[b]) return window[b];
        b = "HTML" + a + "Element";
        if (window[b]) return window[b];
        b = "HTML" + a.capitalize() + "Element";
        if (window[b]) return window[b];
        a = document.createElement(a);
        return a.__proto__ || a.constructor.prototype
    }
    var f = Prototype.BrowserFeatures,
        g = Element.Methods.ByTag;
    a || (Object.extend(Form, Form.Methods), Object.extend(Form.Element, Form.Element.Methods), Object.extend(Element.Methods.ByTag, {
        FORM: Object.clone(Form.Methods),
        INPUT: Object.clone(Form.Element.Methods),
        SELECT: Object.clone(Form.Element.Methods),
        TEXTAREA: Object.clone(Form.Element.Methods),
        BUTTON: Object.clone(Form.Element.Methods)
    }));
    if (2 == arguments.length) var h = a,
        a = arguments[1];
    h ? Object.isArray(h) ? h.each(b) : b(h) : Object.extend(Element.Methods, a || {});
    h = window.HTMLElement ? HTMLElement.prototype : Element.prototype;
    f.ElementExtensions && (c(Element.Methods, h), c(Element.Methods.Simulated, h, !0));
    if (f.SpecificElementExtensions)
        for (var i in Element.Methods.ByTag) f = e(i), Object.isUndefined(f) || c(g[i], f.prototype);
    Object.extend(Element, Element.Methods);
    delete Element.ByTag;
    Element.extend.refresh && Element.extend.refresh();
    Element.cache = {}
};
document.viewport = {
    getDimensions: function() {
        return {
            width: this.getWidth(),
            height: this.getHeight()
        }
    },
    getScrollOffsets: function() {
        return Element._returnOffset(window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft, window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop)
    }
};
(function(a) {
    function b(b) {
        f || (f = c.WebKit && !e.evaluate ? document : c.Opera && 9.5 > window.parseFloat(window.opera.version()) ? document.body : document.documentElement);
        g[b] = "client" + b;
        a["get" + b] = function() {
            return f[g[b]]
        };
        return a["get" + b]()
    }
    var c = Prototype.Browser,
        e = document,
        f, g = {};
    a.getWidth = b.curry("Width");
    a.getHeight = b.curry("Height")
})(document.viewport);
Element.Storage = {
    UID: 1
};
Element.addMethods({
    getStorage: function(a) {
        if (a = $(a)) {
            if (a === window) a = 0;
            else {
                if ("undefined" === typeof a._prototypeUID) a._prototypeUID = Element.Storage.UID++;
                a = a._prototypeUID
            }
            Element.Storage[a] || (Element.Storage[a] = $H());
            return Element.Storage[a]
        }
    },
    store: function(a, b, c) {
        if (a = $(a)) return 2 === arguments.length ? Element.getStorage(a).update(b) : Element.getStorage(a).set(b, c), a
    },
    retrieve: function(a, b, c) {
        if (a = $(a)) {
            var a = Element.getStorage(a),
                e = a.get(b);
            Object.isUndefined(e) && (a.set(b, c), e = c);
            return e
        }
    },
    clone: function(a,
        b) {
        if (a = $(a)) {
            var c = a.cloneNode(b);
            c._prototypeUID = void 0;
            if (b)
                for (var e = Element.select(c, "*"), f = e.length; f--;) e[f]._prototypeUID = void 0;
            return Element.extend(c)
        }
    },
    purge: function(a) {
        if (a = $(a)) {
            var b = Element._purgeElement;
            b(a);
            for (var a = a.getElementsByTagName("*"), c = a.length; c--;) b(a[c]);
            return null
        }
    }
});
(function() {
    function a(a, b, c) {
        var e = null;
        Object.isElement(a) && (e = a, a = e.getStyle(b));
        if (null === a) return null;
        if (/^(?:-)?\d+(\.\d+)?(px)?$/i.test(a)) return window.parseFloat(a);
        var f = a.include("%"),
            g = c === document.viewport;
        if (/\d/.test(a) && e && e.runtimeStyle && (!f || !g)) return c = e.style.left, b = e.runtimeStyle.left, e.runtimeStyle.left = e.currentStyle.left, e.style.left = a || 0, a = e.style.pixelLeft, e.style.left = c, e.runtimeStyle.left = b, a;
        return e && f ? (c = c || e.parentNode, a = a.match(/^(\d+)%?$/i), a = !a ? null : Number(a[1]) /
            100, f = null, e.getStyle("position"), e = b.include("left") || b.include("right") || b.include("width"), b = b.include("top") || b.include("bottom") || b.include("height"), c === document.viewport ? e ? f = document.viewport.getWidth() : b && (f = document.viewport.getHeight()) : e ? f = $(c).measure("width") : b && (f = $(c).measure("height")), null === f ? 0 : f * a) : 0
    }

    function b(a) {
        a = $(a);
        if (a.nodeType === Node.DOCUMENT_NODE || f(a) || "BODY" === a.nodeName.toUpperCase() || "HTML" === a.nodeName.toUpperCase()) return $(document.body);
        if ("inline" !== Element.getStyle(a,
                "display") && a.offsetParent) return $(a.offsetParent);
        for (;
            (a = a.parentNode) && a !== document.body;)
            if ("static" !== Element.getStyle(a, "position")) return "HTML" === a.nodeName.toUpperCase() ? $(document.body) : $(a);
        return $(document.body)
    }

    function c(a) {
        var a = $(a),
            b = 0,
            c = 0;
        if (a.parentNode) {
            do b += a.offsetTop || 0, c += a.offsetLeft || 0, a = a.offsetParent; while (a)
        }
        return new Element.Offset(c, b)
    }

    function e(a) {
        var a = $(a),
            b = a.getLayout(),
            c = 0,
            e = 0;
        do
            if (c += a.offsetTop || 0, e += a.offsetLeft || 0, a = a.offsetParent) {
                if ("BODY" === a.nodeName.toUpperCase()) break;
                if ("static" !== Element.getStyle(a, "position")) break
            }
        while (a);
        e -= b.get("margin-top");
        c -= b.get("margin-left");
        return new Element.Offset(e, c)
    }

    function f(a) {
        return a !== document.body && !Element.descendantOf(a, document.body)
    }
    var g = Prototype.K;
    "currentStyle" in document.documentElement && (g = function(a) {
        if (!a.currentStyle.hasLayout) a.style.zoom = 1;
        return a
    });
    Element.Layout = Class.create(Hash, {
        initialize: function($super, a, b) {
            $super();
            this.element = $(a);
            Element.Layout.PROPERTIES.each(function(a) {
                    this._set(a, null)
                },
                this);
            if (b) this._preComputing = !0, this._begin(), Element.Layout.PROPERTIES.each(this._compute, this), this._end(), this._preComputing = !1
        },
        _set: function(a, b) {
            return Hash.prototype.set.call(this, a, b)
        },
        set: function() {
            throw "Properties of Element.Layout are read-only.";
        },
        get: function($super, a) {
            var b = $super(a);
            return null === b ? this._compute(a) : b
        },
        _begin: function() {
            if (!this._prepared) {
                var b = this.element,
                    c;
                a: {
                    for (c = b; c && c.parentNode;) {
                        if ("none" === c.getStyle("display")) {
                            c = !1;
                            break a
                        }
                        c = $(c.parentNode)
                    }
                    c = !0
                }
                if (!c) {
                    b.store("prototype_original_styles", {
                        position: b.style.position || "",
                        width: b.style.width || "",
                        visibility: b.style.visibility || "",
                        display: b.style.display || ""
                    });
                    c = b.getStyle("position");
                    var e = b.getStyle("width");
                    if ("0px" === e || null === e) b.style.display = "block", e = b.getStyle("width");
                    var f = "fixed" === c ? document.viewport : b.parentNode;
                    b.setStyle({
                        position: "absolute",
                        visibility: "hidden",
                        display: "block"
                    });
                    var g = b.getStyle("width");
                    c = e && g === e ? a(b, "width", f) : "absolute" === c || "fixed" === c ? a(b, "width", f) : $(b.parentNode).getLayout().get("width") - this.get("margin-left") -
                        this.get("border-left") - this.get("padding-left") - this.get("padding-right") - this.get("border-right") - this.get("margin-right");
                    b.setStyle({
                        width: c + "px"
                    })
                }
                this._prepared = !0
            }
        },
        _end: function() {
            var a = this.element,
                b = a.retrieve("prototype_original_styles");
            a.store("prototype_original_styles", null);
            a.setStyle(b);
            this._prepared = !1
        },
        _compute: function(a) {
            var b = Element.Layout.COMPUTATIONS;
            if (!(a in b)) throw "Property not found.";
            return this._set(a, b[a].call(this, this.element))
        },
        toObject: function() {
            var a = $A(arguments),
                b = {};
            (0 === a.length ? Element.Layout.PROPERTIES : a.join(" ").split(" ")).each(function(a) {
                if (Element.Layout.PROPERTIES.include(a)) {
                    var c = this.get(a);
                    null != c && (b[a] = c)
                }
            }, this);
            return b
        },
        toHash: function() {
            var a = this.toObject.apply(this, arguments);
            return new Hash(a)
        },
        toCSS: function() {
            var a = $A(arguments),
                b = {};
            (0 === a.length ? Element.Layout.PROPERTIES : a.join(" ").split(" ")).each(function(a) {
                if (Element.Layout.PROPERTIES.include(a) && !Element.Layout.COMPOSITE_PROPERTIES.include(a)) {
                    var c = this.get(a);
                    if (null !=
                        c) {
                        var e = b;
                        a.include("border") && (a += "-width");
                        a = a.camelize();
                        e[a] = c + "px"
                    }
                }
            }, this);
            return b
        },
        inspect: function() {
            return "#<Element.Layout>"
        }
    });
    Object.extend(Element.Layout, {
        PROPERTIES: $w("height width top left right bottom border-left border-right border-top border-bottom padding-left padding-right padding-top padding-bottom margin-top margin-bottom margin-left margin-right padding-box-width padding-box-height border-box-width border-box-height margin-box-width margin-box-height"),
        COMPOSITE_PROPERTIES: $w("padding-box-width padding-box-height margin-box-width margin-box-height border-box-width border-box-height"),
        COMPUTATIONS: {
            height: function() {
                this._preComputing || this._begin();
                var a = this.get("border-box-height");
                if (0 >= a) return this._preComputing || this._end(), 0;
                var b = this.get("border-top"),
                    c = this.get("border-bottom"),
                    e = this.get("padding-top"),
                    f = this.get("padding-bottom");
                this._preComputing || this._end();
                return a - b - c - e - f
            },
            width: function() {
                this._preComputing || this._begin();
                var a = this.get("border-box-width");
                if (0 >= a) return this._preComputing || this._end(), 0;
                var b = this.get("border-left"),
                    c = this.get("border-right"),
                    e = this.get("padding-left"),
                    f = this.get("padding-right");
                this._preComputing || this._end();
                return a - b - c - e - f
            },
            "padding-box-height": function() {
                var a = this.get("height"),
                    b = this.get("padding-top"),
                    c = this.get("padding-bottom");
                return a + b + c
            },
            "padding-box-width": function() {
                var a = this.get("width"),
                    b = this.get("padding-left"),
                    c = this.get("padding-right");
                return a + b + c
            },
            "border-box-height": function(a) {
                this._preComputing || this._begin();
                a = a.offsetHeight;
                this._preComputing || this._end();
                return a
            },
            "border-box-width": function(a) {
                this._preComputing ||
                    this._begin();
                a = a.offsetWidth;
                this._preComputing || this._end();
                return a
            },
            "margin-box-height": function() {
                var a = this.get("border-box-height"),
                    b = this.get("margin-top"),
                    c = this.get("margin-bottom");
                return 0 >= a ? 0 : a + b + c
            },
            "margin-box-width": function() {
                var a = this.get("border-box-width"),
                    b = this.get("margin-left"),
                    c = this.get("margin-right");
                return 0 >= a ? 0 : a + b + c
            },
            top: function(a) {
                return a.positionedOffset().top
            },
            bottom: function(a) {
                var b = a.positionedOffset(),
                    a = a.getOffsetParent().measure("height"),
                    c = this.get("border-box-height");
                return a - c - b.top
            },
            left: function(a) {
                return a.positionedOffset().left
            },
            right: function(a) {
                var b = a.positionedOffset(),
                    a = a.getOffsetParent().measure("width"),
                    c = this.get("border-box-width");
                return a - c - b.left
            },
            "padding-top": function(b) {
                return a(b, "paddingTop")
            },
            "padding-bottom": function(b) {
                return a(b, "paddingBottom")
            },
            "padding-left": function(b) {
                return a(b, "paddingLeft")
            },
            "padding-right": function(b) {
                return a(b, "paddingRight")
            },
            "border-top": function(b) {
                return a(b, "borderTopWidth")
            },
            "border-bottom": function(b) {
                return a(b,
                    "borderBottomWidth")
            },
            "border-left": function(b) {
                return a(b, "borderLeftWidth")
            },
            "border-right": function(b) {
                return a(b, "borderRightWidth")
            },
            "margin-top": function(b) {
                return a(b, "marginTop")
            },
            "margin-bottom": function(b) {
                return a(b, "marginBottom")
            },
            "margin-left": function(b) {
                return a(b, "marginLeft")
            },
            "margin-right": function(b) {
                return a(b, "marginRight")
            }
        }
    });
    "getBoundingClientRect" in document.documentElement && Object.extend(Element.Layout.COMPUTATIONS, {
        right: function(a) {
            var b = g(a.getOffsetParent()),
                a = a.getBoundingClientRect();
            return (b.getBoundingClientRect().right - a.right).round()
        },
        bottom: function(a) {
            var b = g(a.getOffsetParent()),
                a = a.getBoundingClientRect();
            return (b.getBoundingClientRect().bottom - a.bottom).round()
        }
    });
    Element.Offset = Class.create({
        initialize: function(a, b) {
            this.left = a.round();
            this.top = b.round();
            this[0] = this.left;
            this[1] = this.top
        },
        relativeTo: function(a) {
            return new Element.Offset(this.left - a.left, this.top - a.top)
        },
        inspect: function() {
            return "#<Element.Offset left: #{left} top: #{top}>".interpolate(this)
        },
        toString: function() {
            return "[#{left}, #{top}]".interpolate(this)
        },
        toArray: function() {
            return [this.left, this.top]
        }
    });
    Prototype.Browser.IE ? (b = b.wrap(function(a, b) {
        b = $(b);
        if (b.nodeType === Node.DOCUMENT_NODE || f(b) || "BODY" === b.nodeName.toUpperCase() || "HTML" === b.nodeName.toUpperCase()) return $(document.body);
        var c = b.getStyle("position");
        if ("static" !== c) return a(b);
        b.setStyle({
            position: "relative"
        });
        var e = a(b);
        b.setStyle({
            position: c
        });
        return e
    }), e = e.wrap(function(a, b) {
        b = $(b);
        if (!b.parentNode) return new Element.Offset(0, 0);
        var c = b.getStyle("position");
        if ("static" !== c) return a(b);
        var e = b.getOffsetParent();
        e && "fixed" === e.getStyle("position") && g(e);
        b.setStyle({
            position: "relative"
        });
        e = a(b);
        b.setStyle({
            position: c
        });
        return e
    })) : Prototype.Browser.Webkit && (c = function(a) {
        var a = $(a),
            b = 0,
            c = 0;
        do {
            b += a.offsetTop || 0;
            c += a.offsetLeft || 0;
            if (a.offsetParent == document.body && "absolute" == Element.getStyle(a, "position")) break;
            a = a.offsetParent
        } while (a);
        return new Element.Offset(c, b)
    });
    Element.addMethods({
        getLayout: function(a, b) {
            return new Element.Layout(a, b)
        },
        measure: function(a, b) {
            return $(a).getLayout().get(b)
        },
        getDimensions: function(a) {
            var a = $(a),
                b = Element.getStyle(a, "display");
            if (b && "none" !== b) return {
                width: a.offsetWidth,
                height: a.offsetHeight
            };
            var b = a.style,
                b = {
                    visibility: b.visibility,
                    position: b.position,
                    display: b.display
                },
                c = {
                    visibility: "hidden",
                    display: "block"
                };
            if ("fixed" !== b.position) c.position = "absolute";
            Element.setStyle(a, c);
            c = {
                width: a.offsetWidth,
                height: a.offsetHeight
            };
            Element.setStyle(a, b);
            return c
        },
        getOffsetParent: b,
        cumulativeOffset: c,
        positionedOffset: e,
        cumulativeScrollOffset: function(a) {
            var b = 0,
                c = 0;
            do b += a.scrollTop || 0, c += a.scrollLeft || 0, a = a.parentNode; while (a);
            return new Element.Offset(c, b)
        },
        viewportOffset: function(a) {
            $(f);
            var b = 0,
                c = 0,
                e = document.body,
                f = a;
            do
                if (b += f.offsetTop || 0, c += f.offsetLeft || 0, f.offsetParent == e && "absolute" == Element.getStyle(f, "position")) break;
            while (f = f.offsetParent);
            f = a;
            do f != e && (b -= f.scrollTop || 0, c -= f.scrollLeft || 0); while (f = f.parentNode);
            return new Element.Offset(c, b)
        },
        absolutize: function(a) {
            a = $(a);
            if ("absolute" === Element.getStyle(a, "position")) return a;
            var c = b(a),
                e = a.viewportOffset(),
                c = c.viewportOffset(),
                e = e.relativeTo(c),
                c = a.getLayout();
            a.store("prototype_absolutize_original_styles", {
                left: a.getStyle("left"),
                top: a.getStyle("top"),
                width: a.getStyle("width"),
                height: a.getStyle("height")
            });
            a.setStyle({
                position: "absolute",
                top: e.top + "px",
                left: e.left + "px",
                width: c.get("width") + "px",
                height: c.get("height") + "px"
            });
            return a
        },
        relativize: function(a) {
            a = $(a);
            if ("relative" === Element.getStyle(a, "position")) return a;
            var b = a.retrieve("prototype_absolutize_original_styles");
            b &&
                a.setStyle(b);
            return a
        }
    });
    "getBoundingClientRect" in document.documentElement && Element.addMethods({
        viewportOffset: function(a) {
            a = $(a);
            if (f(a)) return new Element.Offset(0, 0);
            var a = a.getBoundingClientRect(),
                b = document.documentElement;
            return new Element.Offset(a.left - b.clientLeft, a.top - b.clientTop)
        }
    })
})();
window.$$ = function() {
    var a = $A(arguments).join(", ");
    return Prototype.Selector.select(a, document)
};
Prototype.Selector = function() {
    function a(a) {
        for (var b = 0, f = a.length; b < f; b++) Element.extend(a[b]);
        return a
    }
    var b = Prototype.K;
    return {
        select: function() {
            throw Error('Method "Prototype.Selector.select" must be defined.');
        },
        match: function() {
            throw Error('Method "Prototype.Selector.match" must be defined.');
        },
        find: function(a, b, f) {
            var f = f || 0,
                g = Prototype.Selector.match,
                h = a.length,
                i = 0,
                j;
            for (j = 0; j < h; j++)
                if (g(a[j], b) && f == i++) return Element.extend(a[j])
        },
        extendElements: Element.extend === b ? b : a,
        extendElement: Element.extend
    }
}();
Prototype._original_property = window.Sizzle;
(function() {
    function a(a, b, c, e, f, g) {
        for (var f = "previousSibling" == a && !g, h = 0, i = e.length; h < i; h++) {
            var j = e[h];
            if (j) {
                if (f && 1 === j.nodeType) j.sizcache = c, j.sizset = h;
                for (var j = j[a], k = !1; j;) {
                    if (j.sizcache === c) {
                        k = e[j.sizset];
                        break
                    }
                    if (1 === j.nodeType && !g) j.sizcache = c, j.sizset = h;
                    if (j.nodeName === b) {
                        k = j;
                        break
                    }
                    j = j[a]
                }
                e[h] = k
            }
        }
    }

    function b(a, b, c, e, f, g) {
        for (var f = "previousSibling" == a && !g, h = 0, j = e.length; h < j; h++) {
            var k = e[h];
            if (k) {
                if (f && 1 === k.nodeType) k.sizcache = c, k.sizset = h;
                for (var k = k[a], l = !1; k;) {
                    if (k.sizcache === c) {
                        l =
                            e[k.sizset];
                        break
                    }
                    if (1 === k.nodeType) {
                        if (!g) k.sizcache = c, k.sizset = h;
                        if ("string" !== typeof b) {
                            if (k === b) {
                                l = !0;
                                break
                            }
                        } else if (0 < i.filter(b, [k]).length) {
                            l = k;
                            break
                        }
                    }
                    k = k[a]
                }
                e[h] = l
            }
        }
    }
    var c = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
        e = 0,
        f = Object.prototype.toString,
        g = !1,
        h = !0;
    [0, 0].sort(function() {
        h = !1;
        return 0
    });
    var i = function(a, b, e, g) {
        var e = e || [],
            h = b = b || document;
        if (1 !== b.nodeType && 9 !== b.nodeType) return [];
        if (!a || "string" !==
            typeof a) return e;
        for (var l = [], u, n, o, B, E = !0, D = r(b), F = a; null !== (c.exec(""), u = c.exec(F));)
            if (F = u[3], l.push(u[1]), u[2]) {
                B = u[3];
                break
            }
        if (1 < l.length && k.exec(a))
            if (2 === l.length && j.relative[l[0]]) n = s(l[0] + l[1], b);
            else
                for (n = j.relative[l[0]] ? [b] : i(l.shift(), b); l.length;) a = l.shift(), j.relative[a] && (a += l.shift()), n = s(a, n);
        else if (!g && 1 < l.length && 9 === b.nodeType && !D && j.match.ID.test(l[0]) && !j.match.ID.test(l[l.length - 1]) && (u = i.find(l.shift(), b, D), b = u.expr ? i.filter(u.expr, u.set)[0] : u.set[0]), b) {
            u = g ? {
                expr: l.pop(),
                set: m(g)
            } : i.find(l.pop(), 1 === l.length && ("~" === l[0] || "+" === l[0]) && b.parentNode ? b.parentNode : b, D);
            n = u.expr ? i.filter(u.expr, u.set) : u.set;
            for (0 < l.length ? o = m(n) : E = !1; l.length;) {
                var G = l.pop();
                u = G;
                j.relative[G] ? u = l.pop() : G = "";
                null == u && (u = b);
                j.relative[G](o, u, D)
            }
        } else o = [];
        o || (o = n);
        if (!o) throw "Syntax error, unrecognized expression: " + (G || a);
        if ("[object Array]" === f.call(o))
            if (E)
                if (b && 1 === b.nodeType)
                    for (a = 0; null != o[a]; a++) o[a] && (!0 === o[a] || 1 === o[a].nodeType && p(b, o[a])) && e.push(n[a]);
                else
                    for (a = 0; null != o[a]; a++) o[a] &&
                        1 === o[a].nodeType && e.push(n[a]);
        else e.push.apply(e, o);
        else m(o, e);
        B && (i(B, h, e, g), i.uniqueSort(e));
        return e
    };
    i.uniqueSort = function(a) {
        if (n && (g = h, a.sort(n), g))
            for (var b = 1; b < a.length; b++) a[b] === a[b - 1] && a.splice(b--, 1);
        return a
    };
    i.matches = function(a, b) {
        return i(a, null, null, b)
    };
    i.find = function(a, b, c) {
        var e, f;
        if (!a) return [];
        for (var g = 0, h = j.order.length; g < h; g++) {
            var i = j.order[g];
            if (f = j.leftMatch[i].exec(a)) {
                var k = f[1];
                f.splice(1, 1);
                if ("\\" !== k.substr(k.length - 1) && (f[1] = (f[1] || "").replace(/\\/g, ""), e = j.find[i](f,
                        b, c), null != e)) {
                    a = a.replace(j.match[i], "");
                    break
                }
            }
        }
        e || (e = b.getElementsByTagName("*"));
        return {
            set: e,
            expr: a
        }
    };
    i.filter = function(a, b, c, e) {
        for (var f = a, g = [], h = b, i, k, l = b && b[0] && r(b[0]); a && b.length;) {
            for (var m in j.filter)
                if (null != (i = j.match[m].exec(a))) {
                    var o = j.filter[m],
                        n, p;
                    k = !1;
                    h == g && (g = []);
                    if (j.preFilter[m])
                        if (i = j.preFilter[m](i, h, c, g, e, l)) {
                            if (!0 === i) continue
                        } else k = n = !0;
                    if (i)
                        for (var s = 0; null != (p = h[s]); s++)
                            if (p) {
                                n = o(p, i, s, h);
                                var I = e ^ !!n;
                                c && null != n ? I ? k = !0 : h[s] = !1 : I && (g.push(p), k = !0)
                            }
                    if (void 0 !== n) {
                        c ||
                            (h = g);
                        a = a.replace(j.match[m], "");
                        if (!k) return [];
                        break
                    }
                }
            if (a == f) {
                if (null == k) throw "Syntax error, unrecognized expression: " + a;
                break
            }
            f = a
        }
        return h
    };
    var j = i.selectors = {
            order: ["ID", "NAME", "TAG"],
            match: {
                ID: /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
                CLASS: /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,
                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
                TAG: /^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,
                CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
                PSEUDO: /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
            },
            leftMatch: {},
            attrMap: {
                "class": "className",
                "for": "htmlFor"
            },
            attrHandle: {
                href: function(a) {
                    return a.getAttribute("href")
                }
            },
            relative: {
                "+": function(a, b, c) {
                    var e = "string" === typeof b,
                        f = e && !/\W/.test(b),
                        e = e && !f;
                    f && !c && (b = b.toUpperCase());
                    for (var c = 0, f = a.length, g; c < f; c++)
                        if (g = a[c]) {
                            for (;
                                (g = g.previousSibling) && 1 !== g.nodeType;);
                            a[c] = e || g && g.nodeName === b ? g ||
                                !1 : g === b
                        }
                    e && i.filter(b, a, !0)
                },
                ">": function(a, b, c) {
                    var e = "string" === typeof b;
                    if (e && !/\W/.test(b))
                        for (var b = c ? b : b.toUpperCase(), c = 0, f = a.length; c < f; c++) {
                            var g = a[c];
                            if (g) e = g.parentNode, a[c] = e.nodeName === b ? e : !1
                        } else {
                            c = 0;
                            for (f = a.length; c < f; c++)(g = a[c]) && (a[c] = e ? g.parentNode : g.parentNode === b);
                            e && i.filter(b, a, !0)
                        }
                },
                "": function(c, f, g) {
                    var h = e++,
                        i = b;
                    if (!/\W/.test(f)) var j = f = g ? f : f.toUpperCase(),
                        i = a;
                    i("parentNode", f, h, c, j, g)
                },
                "~": function(c, f, g) {
                    var h = e++,
                        i = b;
                    if ("string" === typeof f && !/\W/.test(f)) var j = f = g ? f :
                        f.toUpperCase(),
                        i = a;
                    i("previousSibling", f, h, c, j, g)
                }
            },
            find: {
                ID: function(a, b, c) {
                    if ("undefined" !== typeof b.getElementById && !c) return (a = b.getElementById(a[1])) ? [a] : []
                },
                NAME: function(a, b) {
                    if ("undefined" !== typeof b.getElementsByName) {
                        for (var c = [], e = b.getElementsByName(a[1]), f = 0, g = e.length; f < g; f++) e[f].getAttribute("name") === a[1] && c.push(e[f]);
                        return 0 === c.length ? null : c
                    }
                },
                TAG: function(a, b) {
                    return b.getElementsByTagName(a[1])
                }
            },
            preFilter: {
                CLASS: function(a, b, c, e, f, g) {
                    a = " " + a[1].replace(/\\/g, "") + " ";
                    if (g) return a;
                    for (var g = 0, h; null != (h = b[g]); g++) h && (f ^ (h.className && 0 <= (" " + h.className + " ").indexOf(a)) ? c || e.push(h) : c && (b[g] = !1));
                    return !1
                },
                ID: function(a) {
                    return a[1].replace(/\\/g, "")
                },
                TAG: function(a, b) {
                    for (var c = 0; !1 === b[c]; c++);
                    return b[c] && r(b[c]) ? a[1] : a[1].toUpperCase()
                },
                CHILD: function(a) {
                    if ("nth" == a[1]) {
                        var b = /(-?)(\d*)n((?:\+|-)?\d*)/.exec("even" == a[2] && "2n" || "odd" == a[2] && "2n+1" || !/\D/.test(a[2]) && "0n+" + a[2] || a[2]);
                        a[2] = b[1] + (b[2] || 1) - 0;
                        a[3] = b[3] - 0
                    }
                    a[0] = e++;
                    return a
                },
                ATTR: function(a, b, c, e, f, g) {
                    b = a[1].replace(/\\/g,
                        "");
                    !g && j.attrMap[b] && (a[1] = j.attrMap[b]);
                    "~=" === a[2] && (a[4] = " " + a[4] + " ");
                    return a
                },
                PSEUDO: function(a, b, e, f, g) {
                    if ("not" === a[1])
                        if (1 < (c.exec(a[3]) || "").length || /^\w/.test(a[3])) a[3] = i(a[3], null, null, b);
                        else return a = i.filter(a[3], b, e, 1 ^ g), e || f.push.apply(f, a), !1;
                    else if (j.match.POS.test(a[0]) || j.match.CHILD.test(a[0])) return !0;
                    return a
                },
                POS: function(a) {
                    a.unshift(!0);
                    return a
                }
            },
            filters: {
                enabled: function(a) {
                    return !1 === a.disabled && "hidden" !== a.type
                },
                disabled: function(a) {
                    return !0 === a.disabled
                },
                checked: function(a) {
                    return !0 ===
                        a.checked
                },
                selected: function(a) {
                    return !0 === a.selected
                },
                parent: function(a) {
                    return !!a.firstChild
                },
                empty: function(a) {
                    return !a.firstChild
                },
                has: function(a, b, c) {
                    return !!i(c[3], a).length
                },
                header: function(a) {
                    return /h\d/i.test(a.nodeName)
                },
                text: function(a) {
                    return "text" === a.type
                },
                radio: function(a) {
                    return "radio" === a.type
                },
                checkbox: function(a) {
                    return "checkbox" === a.type
                },
                file: function(a) {
                    return "file" === a.type
                },
                password: function(a) {
                    return "password" === a.type
                },
                submit: function(a) {
                    return "submit" === a.type
                },
                image: function(a) {
                    return "image" ===
                        a.type
                },
                reset: function(a) {
                    return "reset" === a.type
                },
                button: function(a) {
                    return "button" === a.type || "BUTTON" === a.nodeName.toUpperCase()
                },
                input: function(a) {
                    return /input|select|textarea|button/i.test(a.nodeName)
                }
            },
            setFilters: {
                first: function(a, b) {
                    return 0 === b
                },
                last: function(a, b, c, e) {
                    return b === e.length - 1
                },
                even: function(a, b) {
                    return 0 === b % 2
                },
                odd: function(a, b) {
                    return 1 === b % 2
                },
                lt: function(a, b, c) {
                    return b < c[3] - 0
                },
                gt: function(a, b, c) {
                    return b > c[3] - 0
                },
                nth: function(a, b, c) {
                    return c[3] - 0 == b
                },
                eq: function(a, b, c) {
                    return c[3] -
                        0 == b
                }
            },
            filter: {
                PSEUDO: function(a, b, c, e) {
                    var f = b[1],
                        g = j.filters[f];
                    if (g) return g(a, c, b, e);
                    if ("contains" === f) return 0 <= (a.textContent || a.innerText || "").indexOf(b[3]);
                    if ("not" === f) {
                        b = b[3];
                        c = 0;
                        for (e = b.length; c < e; c++)
                            if (b[c] === a) return !1;
                        return !0
                    }
                },
                CHILD: function(a, b) {
                    var c = b[1],
                        e = a;
                    switch (c) {
                        case "only":
                        case "first":
                            for (; e = e.previousSibling;)
                                if (1 === e.nodeType) return !1;
                            if ("first" == c) return !0;
                            e = a;
                        case "last":
                            for (; e = e.nextSibling;)
                                if (1 === e.nodeType) return !1;
                            return !0;
                        case "nth":
                            var c = b[2],
                                f = b[3];
                            if (1 == c &&
                                0 == f) return !0;
                            var g = b[0],
                                h = a.parentNode;
                            if (h && (h.sizcache !== g || !a.nodeIndex)) {
                                for (var i = 0, e = h.firstChild; e; e = e.nextSibling)
                                    if (1 === e.nodeType) e.nodeIndex = ++i;
                                h.sizcache = g
                            }
                            e = a.nodeIndex - f;
                            return 0 == c ? 0 == e : 0 == e % c && 0 <= e / c
                    }
                },
                ID: function(a, b) {
                    return 1 === a.nodeType && a.getAttribute("id") === b
                },
                TAG: function(a, b) {
                    return "*" === b && 1 === a.nodeType || a.nodeName === b
                },
                CLASS: function(a, b) {
                    return -1 < (" " + (a.className || a.getAttribute("class")) + " ").indexOf(b)
                },
                ATTR: function(a, b) {
                    var c = b[1],
                        c = j.attrHandle[c] ? j.attrHandle[c](a) :
                        null != a[c] ? a[c] : a.getAttribute(c),
                        e = c + "",
                        f = b[2],
                        g = b[4];
                    return null == c ? "!=" === f : "=" === f ? e === g : "*=" === f ? 0 <= e.indexOf(g) : "~=" === f ? 0 <= (" " + e + " ").indexOf(g) : !g ? e && !1 !== c : "!=" === f ? e != g : "^=" === f ? 0 === e.indexOf(g) : "$=" === f ? e.substr(e.length - g.length) === g : "|=" === f ? e === g || e.substr(0, g.length + 1) === g + "-" : !1
                },
                POS: function(a, b, c, e) {
                    var f = j.setFilters[b[2]];
                    if (f) return f(a, c, b, e)
                }
            }
        },
        k = j.match.POS,
        l;
    for (l in j.match) j.match[l] = RegExp(j.match[l].source + /(?![^\[]*\])(?![^\(]*\))/.source), j.leftMatch[l] = RegExp(/(^(?:.|\r|\n)*?)/.source +
        j.match[l].source);
    var m = function(a, b) {
        a = Array.prototype.slice.call(a, 0);
        return b ? (b.push.apply(b, a), b) : a
    };
    try {
        Array.prototype.slice.call(document.documentElement.childNodes, 0)
    } catch (o) {
        m = function(a, b) {
            var c = b || [];
            if ("[object Array]" === f.call(a)) Array.prototype.push.apply(c, a);
            else if ("number" === typeof a.length)
                for (var e = 0, g = a.length; e < g; e++) c.push(a[e]);
            else
                for (e = 0; a[e]; e++) c.push(a[e]);
            return c
        }
    }
    var n;
    document.documentElement.compareDocumentPosition ? n = function(a, b) {
        if (!a.compareDocumentPosition ||
            !b.compareDocumentPosition) return a == b && (g = !0), 0;
        var c = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
        0 === c && (g = !0);
        return c
    } : "sourceIndex" in document.documentElement ? n = function(a, b) {
        if (!a.sourceIndex || !b.sourceIndex) return a == b && (g = !0), 0;
        var c = a.sourceIndex - b.sourceIndex;
        0 === c && (g = !0);
        return c
    } : document.createRange && (n = function(a, b) {
        if (!a.ownerDocument || !b.ownerDocument) return a == b && (g = !0), 0;
        var c = a.ownerDocument.createRange(),
            e = b.ownerDocument.createRange();
        c.setStart(a, 0);
        c.setEnd(a, 0);
        e.setStart(b,
            0);
        e.setEnd(b, 0);
        c = c.compareBoundaryPoints(Range.START_TO_END, e);
        0 === c && (g = !0);
        return c
    });
    (function() {
        var a = document.createElement("div"),
            b = "script" + (new Date).getTime();
        a.innerHTML = "<a name='" + b + "'/>";
        var c = document.documentElement;
        c.insertBefore(a, c.firstChild);
        if (document.getElementById(b)) j.find.ID = function(a, b, c) {
            if ("undefined" !== typeof b.getElementById && !c) return (b = b.getElementById(a[1])) ? b.id === a[1] || "undefined" !== typeof b.getAttributeNode && b.getAttributeNode("id").nodeValue === a[1] ? [b] : void 0 : []
        }, j.filter.ID = function(a, b) {
            var c = "undefined" !== typeof a.getAttributeNode && a.getAttributeNode("id");
            return 1 === a.nodeType && c && c.nodeValue === b
        };
        c.removeChild(a);
        c = a = null
    })();
    (function() {
        var a = document.createElement("div");
        a.appendChild(document.createComment(""));
        if (0 < a.getElementsByTagName("*").length) j.find.TAG = function(a, b) {
            var c = b.getElementsByTagName(a[1]);
            if ("*" === a[1]) {
                for (var e = [], f = 0; c[f]; f++) 1 === c[f].nodeType && e.push(c[f]);
                c = e
            }
            return c
        };
        a.innerHTML = "<a href='#'></a>";
        if (a.firstChild && "undefined" !==
            typeof a.firstChild.getAttribute && "#" !== a.firstChild.getAttribute("href")) j.attrHandle.href = function(a) {
            return a.getAttribute("href", 2)
        };
        a = null
    })();
    document.querySelectorAll && function() {
        var a = i,
            b = document.createElement("div");
        b.innerHTML = "<p class='TEST'></p>";
        if (!(b.querySelectorAll && 0 === b.querySelectorAll(".TEST").length)) {
            i = function(b, c, e, f) {
                c = c || document;
                if (!f && 9 === c.nodeType && !r(c)) try {
                    return m(c.querySelectorAll(b), e)
                } catch (g) {}
                return a(b, c, e, f)
            };
            for (var c in a) i[c] = a[c];
            b = null
        }
    }();
    document.getElementsByClassName &&
        document.documentElement.getElementsByClassName && function() {
            var a = document.createElement("div");
            a.innerHTML = "<div class='test e'></div><div class='test'></div>";
            if (0 !== a.getElementsByClassName("e").length && (a.lastChild.className = "e", 1 !== a.getElementsByClassName("e").length)) j.order.splice(1, 0, "CLASS"), j.find.CLASS = function(a, b, c) {
                if ("undefined" !== typeof b.getElementsByClassName && !c) return b.getElementsByClassName(a[1])
            }, a = null
        }();
    var p = document.compareDocumentPosition ? function(a, b) {
            return a.compareDocumentPosition(b) &
                16
        } : function(a, b) {
            return a !== b && (a.contains ? a.contains(b) : !0)
        },
        r = function(a) {
            return 9 === a.nodeType && "HTML" !== a.documentElement.nodeName || !!a.ownerDocument && "HTML" !== a.ownerDocument.documentElement.nodeName
        },
        s = function(a, b) {
            for (var c = [], e = "", f, g = b.nodeType ? [b] : b; f = j.match.PSEUDO.exec(a);) e += f[0], a = a.replace(j.match.PSEUDO, "");
            a = j.relative[a] ? a + "*" : a;
            f = 0;
            for (var h = g.length; f < h; f++) i(a, g[f], c);
            return i.filter(e, c)
        };
    window.Sizzle = i
})();
(function(a) {
    var b = Prototype.Selector.extendElements;
    Prototype.Selector.engine = a;
    Prototype.Selector.select = function(c, e) {
        return b(a(c, e || document))
    };
    Prototype.Selector.match = function(b, e) {
        return 1 == a.matches(e, [b]).length
    }
})(Sizzle);
window.Sizzle = Prototype._original_property;
delete Prototype._original_property;
var Form = {
    reset: function(a) {
        a = $(a);
        a.reset();
        return a
    },
    serializeElements: function(a, b) {
        if ("object" != typeof b) b = {
            hash: !!b
        };
        else if (Object.isUndefined(b.hash)) b.hash = !0;
        var c, e, f = !1,
            g = b.submit,
            h, i;
        b.hash ? (i = {}, h = function(a, b, c) {
            b in a ? (Object.isArray(a[b]) || (a[b] = [a[b]]), a[b].push(c)) : a[b] = c;
            return a
        }) : (i = "", h = function(a, b, c) {
            return a + (a ? "&" : "") + encodeURIComponent(b) + "=" + encodeURIComponent(c)
        });
        return a.inject(i, function(a, b) {
            if (!b.disabled && b.name && (c = b.name, e = $(b).getValue(), null != e && "file" != b.type &&
                    ("submit" != b.type || !f && !1 !== g && (!g || c == g) && (f = !0)))) a = h(a, c, e);
            return a
        })
    }
};
Form.Methods = {
    serialize: function(a, b) {
        return Form.serializeElements(Form.getElements(a), b)
    },
    getElements: function(a) {
        for (var a = $(a).getElementsByTagName("*"), b, c = [], e = Form.Element.Serializers, f = 0; b = a[f]; f++) c.push(b);
        return c.inject([], function(a, b) {
            e[b.tagName.toLowerCase()] && a.push(Element.extend(b));
            return a
        })
    },
    getInputs: function(a, b, c) {
        a = $(a);
        a = a.getElementsByTagName("input");
        if (!b && !c) return $A(a).map(Element.extend);
        for (var e = 0, f = [], g = a.length; e < g; e++) {
            var h = a[e];
            b && h.type != b || c && h.name != c ||
                f.push(Element.extend(h))
        }
        return f
    },
    disable: function(a) {
        a = $(a);
        Form.getElements(a).invoke("disable");
        return a
    },
    enable: function(a) {
        a = $(a);
        Form.getElements(a).invoke("enable");
        return a
    },
    findFirstElement: function(a) {
        var a = $(a).getElements().findAll(function(a) {
                return "hidden" != a.type && !a.disabled
            }),
            b = a.findAll(function(a) {
                return a.hasAttribute("tabIndex") && 0 <= a.tabIndex
            }).sortBy(function(a) {
                return a.tabIndex
            }).first();
        return b ? b : a.find(function(a) {
            return /^(?:input|select|textarea)$/i.test(a.tagName)
        })
    },
    focusFirstElement: function(a) {
        var a = $(a),
            b = a.findFirstElement();
        b && b.activate();
        return a
    },
    request: function(a, b) {
        a = $(a);
        b = Object.clone(b || {});
        var c = b.parameters,
            e = a.readAttribute("action") || "";
        if (e.blank()) e = window.location.href;
        b.parameters = a.serialize(!0);
        c && (Object.isString(c) && (c = c.toQueryParams()), Object.extend(b.parameters, c));
        if (a.hasAttribute("method") && !b.method) b.method = a.method;
        return new Ajax.Request(e, b)
    }
};
Form.Element = {
    focus: function(a) {
        $(a).focus();
        return a
    },
    select: function(a) {
        $(a).select();
        return a
    }
};
Form.Element.Methods = {
    serialize: function(a) {
        a = $(a);
        if (!a.disabled && a.name) {
            var b = a.getValue();
            if (void 0 != b) {
                var c = {};
                c[a.name] = b;
                return Object.toQueryString(c)
            }
        }
        return ""
    },
    getValue: function(a) {
        var a = $(a),
            b = a.tagName.toLowerCase();
        return Form.Element.Serializers[b](a)
    },
    setValue: function(a, b) {
        var a = $(a),
            c = a.tagName.toLowerCase();
        Form.Element.Serializers[c](a, b);
        return a
    },
    clear: function(a) {
        $(a).value = "";
        return a
    },
    present: function(a) {
        return "" != $(a).value
    },
    activate: function(a) {
        a = $(a);
        try {
            a.focus(), a.select &&
                ("input" != a.tagName.toLowerCase() || !/^(?:button|reset|submit)$/i.test(a.type)) && a.select()
        } catch (b) {}
        return a
    },
    disable: function(a) {
        a = $(a);
        a.disabled = !0;
        return a
    },
    enable: function(a) {
        a = $(a);
        a.disabled = !1;
        return a
    }
};
var Field = Form.Element,
    $F = Form.Element.Methods.getValue;
Form.Element.Serializers = function() {
    function a(a, b) {
        if (Object.isUndefined(b)) return a.checked ? a.value : null;
        a.checked = !!b
    }

    function b(a, b) {
        if (Object.isUndefined(b)) return a.value;
        a.value = b
    }

    function c(a) {
        var b = a.selectedIndex;
        return 0 <= b ? f(a.options[b]) : null
    }

    function e(a) {
        var b, c = a.length;
        if (!c) return null;
        var e = 0;
        for (b = []; e < c; e++) {
            var k = a.options[e];
            k.selected && b.push(f(k))
        }
        return b
    }

    function f(a) {
        return Element.hasAttribute(a, "value") ? a.value : a.text
    }
    return {
        input: function(c, e) {
            switch (c.type.toLowerCase()) {
                case "checkbox":
                case "radio":
                    return a(c,
                        e);
                default:
                    return b(c, e)
            }
        },
        inputSelector: a,
        textarea: b,
        select: function(a, b) {
            if (Object.isUndefined(b)) return ("select-one" === a.type ? c : e)(a);
            for (var f, j, k = !Object.isArray(b), l = 0, m = a.length; l < m; l++)
                if (f = a.options[l], j = this.optionValue(f), k) {
                    if (j == b) {
                        f.selected = !0;
                        break
                    }
                } else f.selected = b.include(j)
        },
        selectOne: c,
        selectMany: e,
        optionValue: f,
        button: b
    }
}();
Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
    initialize: function($super, b, c, e) {
        $super(e, c);
        this.element = $(b);
        this.lastValue = this.getValue()
    },
    execute: function() {
        var a = this.getValue();
        if (Object.isString(this.lastValue) && Object.isString(a) ? this.lastValue != a : "" + this.lastValue != "" + a) this.callback(this.element, a), this.lastValue = a
    }
});
Form.Element.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function() {
        return Form.Element.getValue(this.element)
    }
});
Form.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function() {
        return Form.serialize(this.element)
    }
});
Abstract.EventObserver = Class.create({
    initialize: function(a, b) {
        this.element = $(a);
        this.callback = b;
        this.lastValue = this.getValue();
        "form" == this.element.tagName.toLowerCase() ? this.registerFormCallbacks() : this.registerCallback(this.element)
    },
    onElementEvent: function() {
        var a = this.getValue();
        if (this.lastValue != a) this.callback(this.element, a), this.lastValue = a
    },
    registerFormCallbacks: function() {
        Form.getElements(this.element).each(this.registerCallback, this)
    },
    registerCallback: function(a) {
        if (a.type) switch (a.type.toLowerCase()) {
            case "checkbox":
            case "radio":
                Event.observe(a,
                    "click", this.onElementEvent.bind(this));
                break;
            default:
                Event.observe(a, "change", this.onElementEvent.bind(this))
        }
    }
});
Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function() {
        return Form.Element.getValue(this.element)
    }
});
Form.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function() {
        return Form.serialize(this.element)
    }
});
(function() {
    function a(a, b) {
        return a.which ? a.which === b + 1 : a.button === b
    }

    function b(a, b) {
        return a.button === s[b]
    }

    function c(a, b) {
        switch (b) {
            case 0:
                return 1 == a.which && !a.metaKey;
            case 1:
                return 2 == a.which || 1 == a.which && a.metaKey;
            case 2:
                return 3 == a.which;
            default:
                return !1
        }
    }

    function e(a) {
        var b = document.documentElement,
            c = document.body || {
                scrollLeft: 0
            };
        return a.pageX || a.clientX + (b.scrollLeft || c.scrollLeft) - (b.clientLeft || 0)
    }

    function f(a) {
        var b = document.documentElement,
            c = document.body || {
                scrollTop: 0
            };
        return a.pageY ||
            a.clientY + (b.scrollTop || c.scrollTop) - (b.clientTop || 0)
    }

    function g(a, b, c) {
        var e = Element.retrieve(a, "prototype_event_registry");
        Object.isUndefined(e) && (v.push(a), e = Element.retrieve(a, "prototype_event_registry", $H()));
        var f = e.get(b);
        Object.isUndefined(f) && (f = [], e.set(b, f));
        if (f.pluck("handler").include(c)) return !1;
        var g;
        if (b.include(":")) g = function(e) {
            if (Object.isUndefined(e.eventName) || e.eventName !== b) return !1;
            m.extend(e, a);
            c.call(a, e)
        };
        else if (!n && ("mouseenter" === b || "mouseleave" === b)) {
            if ("mouseenter" ===
                b || "mouseleave" === b) g = function(b) {
                m.extend(b, a);
                for (var e = b.relatedTarget; e && e !== a;) try {
                    e = e.parentNode
                } catch (f) {
                    e = a
                }
                e !== a && c.call(a, b)
            }
        } else g = function(b) {
            m.extend(b, a);
            c.call(a, b)
        };
        g.handler = c;
        f.push(g);
        return g
    }

    function h() {
        for (var a = 0, b = v.length; a < b; a++) m.stopObserving(v[a]), v[a] = null
    }

    function i(a, b, c) {
        a = $(a);
        c = g(a, b, c);
        if (!c) return a;
        b.include(":") ? a.addEventListener ? a.addEventListener("dataavailable", c, !1) : (a.attachEvent("ondataavailable", c), a.attachEvent("onlosecapture", c)) : (b = C(b), a.addEventListener ?
            a.addEventListener(b, c, !1) : a.attachEvent("on" + b, c));
        return a
    }

    function j(a, b, c) {
        var a = $(a),
            e = Element.retrieve(a, "prototype_event_registry");
        if (!e) return a;
        if (!b) return e.each(function(b) {
            j(a, b.key)
        }), a;
        var f = e.get(b);
        if (!f) return a;
        if (!c) return f.each(function(c) {
            j(a, b, c.handler)
        }), a;
        for (var g = f.length, h; g--;)
            if (f[g].handler === c) {
                h = f[g];
                break
            }
        if (!h) return a;
        b.include(":") ? a.removeEventListener ? a.removeEventListener("dataavailable", h, !1) : (a.detachEvent("ondataavailable", h), a.detachEvent("onlosecapture",
            h)) : (c = C(b), a.removeEventListener ? a.removeEventListener(c, h, !1) : a.detachEvent("on" + c, h));
        e.set(b, f.without(h));
        return a
    }

    function k(a, b, c, e) {
        a = $(a);
        Object.isUndefined(e) && (e = !0);
        if (a == document && document.createEvent && !a.dispatchEvent) a = document.documentElement;
        var f;
        document.createEvent ? (f = document.createEvent("HTMLEvents"), f.initEvent("dataavailable", e, !0)) : (f = document.createEventObject(), f.eventType = e ? "ondataavailable" : "onlosecapture");
        f.eventName = b;
        f.memo = c || {};
        document.createEvent ? a.dispatchEvent &&
            a.dispatchEvent(f) : a.fireEvent(f.eventType, f);
        return m.extend(f)
    }

    function l(a, b, c, e) {
        a = $(a);
        Object.isFunction(c) && Object.isUndefined(e) && (e = c, c = null);
        return (new m.Handler(a, b, c, e)).start()
    }
    var m = {
            KEY_BACKSPACE: 8,
            KEY_TAB: 9,
            KEY_RETURN: 13,
            KEY_ESC: 27,
            KEY_LEFT: 37,
            KEY_UP: 38,
            KEY_RIGHT: 39,
            KEY_DOWN: 40,
            KEY_DELETE: 46,
            KEY_HOME: 36,
            KEY_END: 35,
            KEY_PAGEUP: 33,
            KEY_PAGEDOWN: 34,
            KEY_INSERT: 45,
            cache: {}
        },
        o = document.documentElement,
        n = "onmouseenter" in o && "onmouseleave" in o,
        p = function() {
            return !1
        };
    window.attachEvent && (p = window.addEventListener ?
        function(a) {
            return !(a instanceof window.Event)
        } : function() {
            return !0
        });
    var r, s = {
        "0": 1,
        1: 4,
        2: 2
    };
    r = window.attachEvent ? window.addEventListener ? function(c, e) {
        return p(c) ? b(c, e) : a(c, e)
    } : b : Prototype.Browser.WebKit ? c : a;
    m.Methods = {
        isLeftClick: function(a) {
            return r(a, 0)
        },
        isMiddleClick: function(a) {
            return r(a, 1)
        },
        isRightClick: function(a) {
            return r(a, 2)
        },
        element: function(a) {
            var a = m.extend(a),
                b = a.target,
                c = a.type;
            if ((a = a.currentTarget) && a.tagName && ("load" === c || "error" === c || "click" === c && "input" === a.tagName.toLowerCase() &&
                    "radio" === a.type)) b = a;
            if (b.nodeType == Node.TEXT_NODE) b = b.parentNode;
            return Element.extend(b)
        },
        findElement: function(a, b) {
            var c = m.element(a);
            if (!b) return c;
            for (; c;) {
                if (Object.isElement(c) && Prototype.Selector.match(c, b)) return Element.extend(c);
                c = c.parentNode
            }
        },
        pointer: function(a) {
            return {
                x: e(a),
                y: f(a)
            }
        },
        pointerX: e,
        pointerY: f,
        stop: function(a) {
            m.extend(a);
            a.preventDefault();
            a.stopPropagation();
            a.stopped = !0
        }
    };
    var q = Object.keys(m.Methods).inject({}, function(a, b) {
        a[b] = m.Methods[b].methodize();
        return a
    });
    if (window.attachEvent) {
        var t =
            function(a) {
                switch (a.type) {
                    case "mouseover":
                    case "mouseenter":
                        a = a.fromElement;
                        break;
                    case "mouseout":
                    case "mouseleave":
                        a = a.toElement;
                        break;
                    default:
                        return null
                }
                return Element.extend(a)
            },
            z = {
                stopPropagation: function() {
                    this.cancelBubble = !0
                },
                preventDefault: function() {
                    this.returnValue = !1
                },
                inspect: function() {
                    return "[object Event]"
                }
            };
        m.extend = function(a, b) {
            if (!a) return !1;
            if (!p(a) || a._extendedByPrototype) return a;
            a._extendedByPrototype = Prototype.emptyFunction;
            var c = m.pointer(a);
            Object.extend(a, {
                target: a.srcElement ||
                    b,
                relatedTarget: t(a),
                pageX: c.x,
                pageY: c.y
            });
            Object.extend(a, q);
            Object.extend(a, z);
            return a
        }
    } else m.extend = Prototype.K;
    if (window.addEventListener) m.prototype = window.Event.prototype || document.createEvent("HTMLEvents").__proto__, Object.extend(m.prototype, q);
    var v = [];
    Prototype.Browser.IE && window.attachEvent("onunload", h);
    Prototype.Browser.WebKit && window.addEventListener("unload", Prototype.emptyFunction, !1);
    var C = Prototype.K,
        A = {
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        };
    n || (C = function(a) {
        return A[a] ||
            a
    });
    m.Handler = Class.create({
        initialize: function(a, b, c, e) {
            this.element = $(a);
            this.eventName = b;
            this.selector = c;
            this.callback = e;
            this.handler = this.handleEvent.bind(this)
        },
        start: function() {
            m.observe(this.element, this.eventName, this.handler);
            return this
        },
        stop: function() {
            m.stopObserving(this.element, this.eventName, this.handler);
            return this
        },
        handleEvent: function(a) {
            var b = m.findElement(a, this.selector);
            b && this.callback.call(this.element, a, b)
        }
    });
    Object.extend(m, m.Methods);
    Object.extend(m, {
        fire: k,
        observe: i,
        stopObserving: j,
        on: l
    });
    Element.addMethods({
        fire: k,
        observe: i,
        stopObserving: j,
        on: l
    });
    Object.extend(document, {
        fire: k.methodize(),
        observe: i.methodize(),
        stopObserving: j.methodize(),
        on: l.methodize(),
        loaded: !1
    });
    window.Event ? Object.extend(window.Event, m) : window.Event = m
})();
(function() {
    function a() {
        if (!document.loaded) e && window.clearTimeout(e), document.loaded = !0, document.fire("dom:loaded")
    }

    function b() {
        "complete" === document.readyState && (document.stopObserving("readystatechange", b), a())
    }

    function c() {
        try {
            document.documentElement.doScroll("left")
        } catch (b) {
            e = c.defer();
            return
        }
        a()
    }
    var e;
    document.addEventListener ? document.addEventListener("DOMContentLoaded", a, !1) : (document.observe("readystatechange", b), window == top && (e = c.defer()));
    Event.observe(window, "load", a)
})();
Element.addMethods();
Hash.toQueryString = Object.toQueryString;
var Toggle = {
    display: Element.toggle
};
Element.Methods.childOf = Element.Methods.descendantOf;
var Insertion = {
        Before: function(a, b) {
            return Element.insert(a, {
                before: b
            })
        },
        Top: function(a, b) {
            return Element.insert(a, {
                top: b
            })
        },
        Bottom: function(a, b) {
            return Element.insert(a, {
                bottom: b
            })
        },
        After: function(a, b) {
            return Element.insert(a, {
                after: b
            })
        }
    },
    $continue = Error('"throw $continue" is deprecated, use "return" instead'),
    Position = {
        includeScrollOffsets: !1,
        prepare: function() {
            this.deltaX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
            this.deltaY = window.pageYOffset || document.documentElement.scrollTop ||
                document.body.scrollTop || 0
        },
        within: function(a, b, c) {
            if (this.includeScrollOffsets) return this.withinIncludingScrolloffsets(a, b, c);
            this.xcomp = b;
            this.ycomp = c;
            this.offset = Element.cumulativeOffset(a);
            return c >= this.offset[1] && c < this.offset[1] + a.offsetHeight && b >= this.offset[0] && b < this.offset[0] + a.offsetWidth
        },
        withinIncludingScrolloffsets: function(a, b, c) {
            var e = Element.cumulativeScrollOffset(a);
            this.xcomp = b + e[0] - this.deltaX;
            this.ycomp = c + e[1] - this.deltaY;
            this.offset = Element.cumulativeOffset(a);
            return this.ycomp >=
                this.offset[1] && this.ycomp < this.offset[1] + a.offsetHeight && this.xcomp >= this.offset[0] && this.xcomp < this.offset[0] + a.offsetWidth
        },
        overlap: function(a, b) {
            if (!a) return 0;
            if ("vertical" == a) return (this.offset[1] + b.offsetHeight - this.ycomp) / b.offsetHeight;
            if ("horizontal" == a) return (this.offset[0] + b.offsetWidth - this.xcomp) / b.offsetWidth
        },
        cumulativeOffset: Element.Methods.cumulativeOffset,
        positionedOffset: Element.Methods.positionedOffset,
        absolutize: function(a) {
            Position.prepare();
            return Element.absolutize(a)
        },
        relativize: function(a) {
            Position.prepare();
            return Element.relativize(a)
        },
        realOffset: Element.Methods.cumulativeScrollOffset,
        offsetParent: Element.Methods.getOffsetParent,
        page: Element.Methods.viewportOffset,
        clone: function(a, b, c) {
            c = c || {};
            return Element.clonePosition(b, a, c)
        }
    };
if (!document.getElementsByClassName) document.getElementsByClassName = function(a) {
    function b(a) {
        return a.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + a + " ')]"
    }
    a.getElementsByClassName = Prototype.BrowserFeatures.XPath ? function(a, e) {
        var e = e.toString().strip(),
            f = /\s/.test(e) ? $w(e).map(b).join("") : b(e);
        return f ? document._getElementsByXPath(".//*" + f, a) : []
    } : function(a, b) {
        var b = b.toString().strip(),
            f = [],
            g = /\s/.test(b) ? $w(b) : null;
        if (!g && !b) return f;
        for (var h = $(a).getElementsByTagName("*"), b = " " + b + " ",
                i = 0, j, k; j = h[i]; i++) j.className && (k = " " + j.className + " ") && (k.include(b) || g && g.all(function(a) {
            return !a.toString().blank() && k.include(" " + a + " ")
        })) && f.push(Element.extend(j));
        return f
    };
    return function(a, b) {
        return $(b || document.body).getElementsByClassName(a)
    }
}(Element.Methods);
Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
    initialize: function(a) {
        this.element = $(a)
    },
    _each: function(a) {
        this.element.className.split(/\s+/).select(function(a) {
            return 0 < a.length
        })._each(a)
    },
    set: function(a) {
        this.element.className = a
    },
    add: function(a) {
        this.include(a) || this.set($A(this).concat(a).join(" "))
    },
    remove: function(a) {
        this.include(a) && this.set($A(this).without(a).join(" "))
    },
    toString: function() {
        return $A(this).join(" ")
    }
};
Object.extend(Element.ClassNames.prototype, Enumerable);
(function() {
    window.Selector = Class.create({
        initialize: function(a) {
            this.expression = a.strip()
        },
        findElements: function(a) {
            return Prototype.Selector.select(this.expression, a)
        },
        match: function(a) {
            return Prototype.Selector.match(a, this.expression)
        },
        toString: function() {
            return this.expression
        },
        inspect: function() {
            return "#<Selector: " + this.expression + ">"
        }
    });
    Object.extend(Selector, {
        matchElements: function(a, b) {
            for (var c = Prototype.Selector.match, e = [], f = 0, g = a.length; f < g; f++) {
                var h = a[f];
                c(h, b) && e.push(Element.extend(h))
            }
            return e
        },
        findElement: function(a, b, c) {
            for (var c = c || 0, e = 0, f, g = 0, h = a.length; g < h; g++)
                if (f = a[g], Prototype.Selector.match(f, b) && c === e++) return Element.extend(f)
        },
        findChildElements: function(a, b) {
            var c = b.toArray().join(", ");
            return Prototype.Selector.select(c, a || document)
        }
    })
})();
window.CanvasRenderingContext2D || function() {
    function a(a) {
        var b = a.srcElement;
        switch (a.propertyName) {
            case "width":
                b.style.width = b.attributes.width.nodeValue + "px";
                b.getContext().clearRect();
                break;
            case "height":
                b.style.height = b.attributes.height.nodeValue + "px", b.getContext().clearRect()
        }
    }

    function b(a) {
        a = a.srcElement;
        if (a.firstChild) a.firstChild.style.width = a.clientWidth + "px", a.firstChild.style.height = a.clientHeight + "px"
    }

    function c() {
        return [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]
    }

    function e(a, b) {
        for (var e = c(), f = 0; 3 >
            f; f++)
            for (var g = 0; 3 > g; g++) {
                for (var h = 0, i = 0; 3 > i; i++) h += a[f][i] * b[i][g];
                e[f][g] = h
            }
        return e
    }

    function f(a, b) {
        b.fillStyle = a.fillStyle;
        b.lineCap = a.lineCap;
        b.lineJoin = a.lineJoin;
        b.lineWidth = a.lineWidth;
        b.miterLimit = a.miterLimit;
        b.shadowBlur = a.shadowBlur;
        b.shadowColor = a.shadowColor;
        b.shadowOffsetX = a.shadowOffsetX;
        b.shadowOffsetY = a.shadowOffsetY;
        b.strokeStyle = a.strokeStyle;
        b.arcScaleX_ = a.arcScaleX_;
        b.arcScaleY_ = a.arcScaleY_
    }

    function g(a) {
        var b, c = 1,
            a = "" + a;
        if ("rgb" == a.substring(0, 3)) {
            b = a.indexOf("(", 3);
            var e =
                a.indexOf(")", b + 1),
                e = a.substring(b + 1, e).split(",");
            b = "#";
            for (var f = 0; 3 > f; f++) b += s[Number(e[f])];
            4 == e.length && "a" == a.substr(3, 1) && (c = e[3])
        } else b = a;
        return [b, c]
    }

    function h(a) {
        switch (a) {
            case "butt":
                return "flat";
            case "round":
                return "round";
            default:
                return "square"
        }
    }

    function i(a) {
        this.m_ = c();
        this.mStack_ = [];
        this.aStack_ = [];
        this.currentPath_ = [];
        this.fillStyle = this.strokeStyle = "#000";
        this.lineWidth = 1;
        this.lineJoin = "miter";
        this.lineCap = "butt";
        this.miterLimit = 1 * p;
        this.globalAlpha = 1;
        this.canvas = a;
        var b = a.ownerDocument.createElement("div");
        b.style.width = a.clientWidth + "px";
        b.style.height = a.clientHeight + "px";
        b.style.overflow = "hidden";
        b.style.position = "absolute";
        a.appendChild(b);
        this.element_ = b;
        this.arcScaleY_ = this.arcScaleX_ = 1
    }

    function j(a) {
        this.type_ = a;
        this.radius2_ = this.radius1_ = 0;
        this.colors_ = [];
        this.focus_ = {
            x: 0,
            y: 0
        }
    }

    function k() {}
    var l = Math,
        m = l.round,
        o = l.sin,
        n = l.cos,
        p = 10,
        r = p / 2,
        l = {
            init: function(a) {
                var b = a || document;
                if (/MSIE/.test(navigator.userAgent) && !window.opera) {
                    var c = this;
                    b.attachEvent("onreadystatechange", function() {
                        c.init_(b)
                    })
                }
            },
            init_: function(a) {
                if ("complete" == a.readyState) {
                    a.namespaces.g_vml_ || a.namespaces.add("g_vml_", "urn:schemas-microsoft-com:vml");
                    a.createStyleSheet().cssText = "canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}g_vml_\\:*{behavior:url(#default#VML)}";
                    for (var a = a.getElementsByTagName("canvas"), b = 0; b < a.length; b++) a[b].getContext || this.initElement(a[b])
                }
            },
            fixElement_: function(a) {
                var b = a.outerHTML,
                    c = a.ownerDocument.createElement(b);
                if ("/>" != b.slice(-2)) {
                    for (var b = "/" + a.tagName,
                            e;
                        (e = a.nextSibling) && e.tagName != b;) e.removeNode();
                    e && e.removeNode()
                }
                a.parentNode.replaceChild(c, a);
                return c
            },
            initElement: function(c) {
                c = this.fixElement_(c);
                c.getContext = function() {
                    return this.context_ ? this.context_ : this.context_ = new i(this)
                };
                c.attachEvent("onpropertychange", a);
                c.attachEvent("onresize", b);
                var e = c.attributes;
                e.width && e.width.specified ? c.style.width = e.width.nodeValue + "px" : c.width = c.clientWidth;
                e.height && e.height.specified ? c.style.height = e.height.nodeValue + "px" : c.height = c.clientHeight;
                return c
            }
        };
    l.init();
    for (var s = [], q = 0; 16 > q; q++)
        for (var t = 0; 16 > t; t++) s[16 * q + t] = q.toString(16) + t.toString(16);
    q = i.prototype;
    q.clearRect = function() {
        this.element_.innerHTML = "";
        this.currentPath_ = []
    };
    q.beginPath = function() {
        this.currentPath_ = []
    };
    q.moveTo = function(a, b) {
        this.currentPath_.push({
            type: "moveTo",
            x: a,
            y: b
        });
        this.currentX_ = a;
        this.currentY_ = b
    };
    q.lineTo = function(a, b) {
        this.currentPath_.push({
            type: "lineTo",
            x: a,
            y: b
        });
        this.currentX_ = a;
        this.currentY_ = b
    };
    q.bezierCurveTo = function(a, b, c, e, f, g) {
        this.currentPath_.push({
            type: "bezierCurveTo",
            cp1x: a,
            cp1y: b,
            cp2x: c,
            cp2y: e,
            x: f,
            y: g
        });
        this.currentX_ = f;
        this.currentY_ = g
    };
    q.quadraticCurveTo = function(a, b, c, e) {
        a = this.currentX_ + 2 / 3 * (a - this.currentX_);
        b = this.currentY_ + 2 / 3 * (b - this.currentY_);
        this.bezierCurveTo(a, b, a + (c - this.currentX_) / 3, b + (e - this.currentY_) / 3, c, e)
    };
    q.arc = function(a, b, c, e, f, g) {
        var c = c * p,
            h = g ? "at" : "wa",
            i = a + n(e) * c - r,
            e = b + o(e) * c - r,
            j = a + n(f) * c - r,
            f = b + o(f) * c - r;
        i == j && !g && (i += 0.125);
        this.currentPath_.push({
            type: h,
            x: a,
            y: b,
            radius: c,
            xStart: i,
            yStart: e,
            xEnd: j,
            yEnd: f
        })
    };
    q.rect = function(a, b, c, e) {
        this.moveTo(a,
            b);
        this.lineTo(a + c, b);
        this.lineTo(a + c, b + e);
        this.lineTo(a, b + e);
        this.closePath()
    };
    q.strokeRect = function(a, b, c, e) {
        this.beginPath();
        this.moveTo(a, b);
        this.lineTo(a + c, b);
        this.lineTo(a + c, b + e);
        this.lineTo(a, b + e);
        this.closePath();
        this.stroke()
    };
    q.fillRect = function(a, b, c, e) {
        this.beginPath();
        this.moveTo(a, b);
        this.lineTo(a + c, b);
        this.lineTo(a + c, b + e);
        this.lineTo(a, b + e);
        this.closePath();
        this.fill()
    };
    q.createLinearGradient = function() {
        return new j("gradient")
    };
    q.createRadialGradient = function(a, b, c, e, f, g) {
        e = new j("gradientradial");
        e.radius1_ = c;
        e.radius2_ = g;
        e.focus_.x = a;
        e.focus_.y = b;
        return e
    };
    q.drawImage = function(a, b) {
        var c, e, f, g, h, i, j, k;
        f = a.runtimeStyle.width;
        g = a.runtimeStyle.height;
        a.runtimeStyle.width = "auto";
        a.runtimeStyle.height = "auto";
        var l = a.width,
            o = a.height;
        a.runtimeStyle.width = f;
        a.runtimeStyle.height = g;
        if (3 == arguments.length) c = arguments[1], e = arguments[2], h = i = 0, j = f = l, k = g = o;
        else if (5 == arguments.length) c = arguments[1], e = arguments[2], f = arguments[3], g = arguments[4], h = i = 0, j = l, k = o;
        else if (9 == arguments.length) h = arguments[1], i =
            arguments[2], j = arguments[3], k = arguments[4], c = arguments[5], e = arguments[6], f = arguments[7], g = arguments[8];
        else throw "Invalid number of arguments";
        var n = this.getCoords_(c, e),
            q = [];
        q.push(" <g_vml_:group", ' coordsize="', 10 * p, ",", 10 * p, '"', ' coordorigin="0,0"', ' style="width:', 10, ";height:", 10, ";position:absolute;");
        if (1 != this.m_[0][0] || this.m_[0][1]) {
            var r = [];
            r.push("M11='", this.m_[0][0], "',", "M12='", this.m_[1][0], "',", "M21='", this.m_[0][1], "',", "M22='", this.m_[1][1], "',", "Dx='", m(n.x / p), "',", "Dy='", m(n.y /
                p), "'");
            var s = this.getCoords_(c + f, e),
                t = this.getCoords_(c, e + g);
            c = this.getCoords_(c + f, e + g);
            n.x = Math.max(n.x, s.x, t.x, c.x);
            n.y = Math.max(n.y, s.y, t.y, c.y);
            q.push("padding:0 ", m(n.x / p), "px ", m(n.y / p), "px 0;filter:progid:DXImageTransform.Microsoft.Matrix(", r.join(""), ", sizingmethod='clip');")
        } else q.push("top:", m(n.y / p), "px;left:", m(n.x / p), "px;");
        q.push(' ">', '<g_vml_:image src="', a.src, '"', ' style="width:', p * f, ";", " height:", p * g, ';"', ' cropleft="', h / l, '"', ' croptop="', i / o, '"', ' cropright="', (l - h - j) / l, '"',
            ' cropbottom="', (o - i - k) / o, '"', " />", "</g_vml_:group>");
        this.element_.insertAdjacentHTML("BeforeEnd", q.join(""))
    };
    q.stroke = function(a) {
        var b = [],
            c = g(a ? this.fillStyle : this.strokeStyle),
            e = c[0],
            c = c[1] * this.globalAlpha;
        b.push("<g_vml_:shape", ' fillcolor="', e, '"', ' filled="', Boolean(a), '"', ' style="position:absolute;width:', 10, ";height:", 10, ';"', ' coordorigin="0 0" coordsize="', 10 * p, " ", 10 * p, '"', ' stroked="', !a, '"', ' strokeweight="', this.lineWidth, '"', ' strokecolor="', e, '"', ' path="');
        for (var f = null, i = null,
                j = null, k = null, l = 0; l < this.currentPath_.length; l++) {
            var n = this.currentPath_[l];
            if ("moveTo" == n.type) {
                b.push(" m ");
                var o = this.getCoords_(n.x, n.y);
                b.push(m(o.x), ",", m(o.y))
            } else if ("lineTo" == n.type) b.push(" l "), o = this.getCoords_(n.x, n.y), b.push(m(o.x), ",", m(o.y));
            else if ("close" == n.type) b.push(" x ");
            else if ("bezierCurveTo" == n.type) {
                b.push(" c ");
                var o = this.getCoords_(n.x, n.y),
                    q = this.getCoords_(n.cp1x, n.cp1y),
                    n = this.getCoords_(n.cp2x, n.cp2y);
                b.push(m(q.x), ",", m(q.y), ",", m(n.x), ",", m(n.y), ",", m(o.x),
                    ",", m(o.y))
            } else if ("at" == n.type || "wa" == n.type) {
                b.push(" ", n.type, " ");
                var o = this.getCoords_(n.x, n.y),
                    q = this.getCoords_(n.xStart, n.yStart),
                    r = this.getCoords_(n.xEnd, n.yEnd);
                b.push(m(o.x - this.arcScaleX_ * n.radius), ",", m(o.y - this.arcScaleY_ * n.radius), " ", m(o.x + this.arcScaleX_ * n.radius), ",", m(o.y + this.arcScaleY_ * n.radius), " ", m(q.x), ",", m(q.y), " ", m(r.x), ",", m(r.y))
            }
            if (o) {
                if (null == f || o.x < f) f = o.x;
                if (null == j || o.x > j) j = o.x;
                if (null == i || o.y < i) i = o.y;
                if (null == k || o.y > k) k = o.y
            }
        }
        b.push(' ">');
        if ("object" == typeof this.fillStyle) {
            e =
                a = "50%";
            a = j - f;
            i = k - i;
            l = a > i ? a : i;
            a = m(100 * (this.fillStyle.focus_.x / a) + 50) + "%";
            e = m(100 * (this.fillStyle.focus_.y / i) + 50) + "%";
            i = [];
            "gradientradial" == this.fillStyle.type_ ? (k = 100 * (this.fillStyle.radius1_ / l), f = 100 * (this.fillStyle.radius2_ / l) - k) : (k = 0, f = 100);
            q = n = o = j = null;
            this.fillStyle.colors_.sort(function(a, b) {
                return a.offset - b.offset
            });
            for (l = 0; l < this.fillStyle.colors_.length; l++) {
                r = this.fillStyle.colors_[l];
                i.push(r.offset * f + k, "% ", r.color, ",");
                if (r.offset > j || null == j) j = r.offset, o = r.color;
                if (r.offset < n || null ==
                    n) n = r.offset, q = r.color
            }
            i.pop();
            b.push("<g_vml_:fill", ' color="', q, '"', ' color2="', o, '"', ' type="', this.fillStyle.type_, '"', ' focusposition="', a, ", ", e, '"', ' colors="', i.join(""), '"', ' opacity="', c, '" />')
        } else a ? b.push('<g_vml_:fill color="', e, '" opacity="', c, '" />') : b.push("<g_vml_:stroke", ' opacity="', c, '"', ' joinstyle="', this.lineJoin, '"', ' miterlimit="', this.miterLimit, '"', ' endcap="', h(this.lineCap), '"', ' weight="', this.lineWidth, 'px"', ' color="', e, '" />');
        b.push("</g_vml_:shape>");
        this.element_.insertAdjacentHTML("beforeEnd",
            b.join(""));
        this.currentPath_ = []
    };
    q.fill = function() {
        this.stroke(!0)
    };
    q.closePath = function() {
        this.currentPath_.push({
            type: "close"
        })
    };
    q.getCoords_ = function(a, b) {
        return {
            x: p * (a * this.m_[0][0] + b * this.m_[1][0] + this.m_[2][0]) - r,
            y: p * (a * this.m_[0][1] + b * this.m_[1][1] + this.m_[2][1]) - r
        }
    };
    q.save = function() {
        var a = {};
        f(this, a);
        this.aStack_.push(a);
        this.mStack_.push(this.m_);
        this.m_ = e(c(), this.m_)
    };
    q.restore = function() {
        f(this.aStack_.pop(), this);
        this.m_ = this.mStack_.pop()
    };
    q.translate = function(a, b) {
        this.m_ = e([
            [1,
                0, 0
            ],
            [0, 1, 0],
            [a, b, 1]
        ], this.m_)
    };
    q.rotate = function(a) {
        var b = n(a),
            a = o(a);
        this.m_ = e([
            [b, a, 0],
            [-a, b, 0],
            [0, 0, 1]
        ], this.m_)
    };
    q.scale = function(a, b) {
        this.arcScaleX_ *= a;
        this.arcScaleY_ *= b;
        this.m_ = e([
            [a, 0, 0],
            [0, b, 0],
            [0, 0, 1]
        ], this.m_)
    };
    q.clip = function() {};
    q.arcTo = function() {};
    q.createPattern = function() {
        return new k
    };
    j.prototype.addColorStop = function(a, b) {
        b = g(b);
        this.colors_.push({
            offset: 1 - a,
            color: b
        })
    };
    G_vmlCanvasManager = l;
    CanvasRenderingContext2D = i;
    CanvasGradient = j;
    CanvasPattern = k
}();

function drawWorld(a, b) {
    for (var c = a.m_jointList; c; c = c.m_next) drawJoint(c, b);
    for (c = a.m_bodyList; c; c = c.m_next)
        for (var e = c.GetShapeList(); null != e; e = e.GetNext()) drawShape(e, b)
}

function drawJoint(a, b) {
    var c = a.m_body1,
        e = a.m_body2,
        f = c.m_position,
        g = e.m_position,
        h = a.GetAnchor1(),
        i = a.GetAnchor2();
    b.strokeStyle = "#00eeee";
    b.beginPath();
    switch (a.m_type) {
        case b2Joint.e_distanceJoint:
            b.moveTo(h.x, h.y);
            b.lineTo(i.x, i.y);
            break;
        case b2Joint.e_pulleyJoint:
            break;
        default:
            c == world.m_groundBody ? (b.moveTo(h.x, h.y), b.lineTo(g.x, g.y)) : e == world.m_groundBody ? (b.moveTo(h.x, h.y), b.lineTo(f.x, f.y)) : (b.moveTo(f.x, f.y), b.lineTo(h.x, h.y), b.lineTo(g.x, g.y), b.lineTo(i.x, i.y))
    }
    b.stroke()
}

function drawShape(a, b) {
    b.strokeStyle = "#ffffff";
    b.beginPath();
    switch (a.m_type) {
        case b2Shape.e_circleShape:
            var c = a.m_position,
                e = a.m_radius,
                f = 0,
                g = 2 * Math.PI / 16;
            b.moveTo(c.x + e, c.y);
            for (var h = 0; 16 > h; h++) {
                var i = new b2Vec2(e * Math.cos(f), e * Math.sin(f)),
                    i = b2Math.AddVV(c, i);
                b.lineTo(i.x, i.y);
                f += g
            }
            b.lineTo(c.x + e, c.y);
            b.moveTo(c.x, c.y);
            h = a.m_R.col1;
            c = new b2Vec2(c.x + e * h.x, c.y + e * h.y);
            b.lineTo(c.x, c.y);
            break;
        case b2Shape.e_polyShape:
            c = b2Math.AddVV(a.m_position, b2Math.b2MulMV(a.m_R, a.m_vertices[0]));
            b.moveTo(c.x,
                c.y);
            for (h = 0; h < a.m_vertexCount; h++) i = b2Math.AddVV(a.m_position, b2Math.b2MulMV(a.m_R, a.m_vertices[h])), b.lineTo(i.x, i.y);
            b.lineTo(c.x, c.y)
    }
    b.stroke()
}
var b2Settings = Class.create();
b2Settings.prototype = {
    initialize: function() {}
};
b2Settings.USHRT_MAX = 65535;
b2Settings.b2_pi = Math.PI;
b2Settings.b2_massUnitsPerKilogram = 1;
b2Settings.b2_timeUnitsPerSecond = 1;
b2Settings.b2_lengthUnitsPerMeter = 30;
b2Settings.b2_maxManifoldPoints = 2;
b2Settings.b2_maxShapesPerBody = 64;
b2Settings.b2_maxPolyVertices = 8;
b2Settings.b2_maxProxies = 1024;
b2Settings.b2_maxPairs = 8 * b2Settings.b2_maxProxies;
b2Settings.b2_linearSlop = 0.0050 * b2Settings.b2_lengthUnitsPerMeter;
b2Settings.b2_angularSlop = 2 / 180 * b2Settings.b2_pi;
b2Settings.b2_velocityThreshold = 1 * b2Settings.b2_lengthUnitsPerMeter / b2Settings.b2_timeUnitsPerSecond;
b2Settings.b2_maxLinearCorrection = 0.2 * b2Settings.b2_lengthUnitsPerMeter;
b2Settings.b2_maxAngularCorrection = 8 / 180 * b2Settings.b2_pi;
b2Settings.b2_contactBaumgarte = 0.2;
b2Settings.b2_timeToSleep = 0.5 * b2Settings.b2_timeUnitsPerSecond;
b2Settings.b2_linearSleepTolerance = 0.01 * b2Settings.b2_lengthUnitsPerMeter / b2Settings.b2_timeUnitsPerSecond;
b2Settings.b2_angularSleepTolerance = 2 / 180 / b2Settings.b2_timeUnitsPerSecond;
b2Settings.b2Assert = function(a) {
    a || (void 0).x++
};
var b2Vec2 = Class.create();
b2Vec2.prototype = {
    initialize: function(a, b) {
        this.x = a;
        this.y = b
    },
    SetZero: function() {
        this.y = this.x = 0
    },
    Set: function(a, b) {
        this.x = a;
        this.y = b
    },
    SetV: function(a) {
        this.x = a.x;
        this.y = a.y
    },
    Negative: function() {
        return new b2Vec2(-this.x, -this.y)
    },
    Copy: function() {
        return new b2Vec2(this.x, this.y)
    },
    Add: function(a) {
        this.x += a.x;
        this.y += a.y
    },
    Subtract: function(a) {
        this.x -= a.x;
        this.y -= a.y
    },
    Multiply: function(a) {
        this.x *= a;
        this.y *= a
    },
    MulM: function(a) {
        var b = this.x;
        this.x = a.col1.x * b + a.col2.x * this.y;
        this.y = a.col1.y * b + a.col2.y *
            this.y
    },
    MulTM: function(a) {
        var b = b2Math.b2Dot(this, a.col1);
        this.y = b2Math.b2Dot(this, a.col2);
        this.x = b
    },
    CrossVF: function(a) {
        var b = this.x;
        this.x = a * this.y;
        this.y = -a * b
    },
    CrossFV: function(a) {
        var b = this.x;
        this.x = -a * this.y;
        this.y = a * b
    },
    MinV: function(a) {
        this.x = this.x < a.x ? this.x : a.x;
        this.y = this.y < a.y ? this.y : a.y
    },
    MaxV: function(a) {
        this.x = this.x > a.x ? this.x : a.x;
        this.y = this.y > a.y ? this.y : a.y
    },
    Abs: function() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y)
    },
    Length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    },
    Normalize: function() {
        var a = this.Length();
        if (a < Number.MIN_VALUE) return 0;
        var b = 1 / a;
        this.x *= b;
        this.y *= b;
        return a
    },
    IsValid: function() {
        return b2Math.b2IsValid(this.x) && b2Math.b2IsValid(this.y)
    },
    x: null,
    y: null
};
b2Vec2.Make = function(a, b) {
    return new b2Vec2(a, b)
};
var b2Mat22 = Class.create();
b2Mat22.prototype = {
    initialize: function(a, b, c) {
        null == a && (a = 0);
        this.col1 = new b2Vec2;
        this.col2 = new b2Vec2;
        null != b && null != c ? (this.col1.SetV(b), this.col2.SetV(c)) : (b = Math.cos(a), a = Math.sin(a), this.col1.x = b, this.col2.x = -a, this.col1.y = a, this.col2.y = b)
    },
    Set: function(a) {
        var b = Math.cos(a),
            a = Math.sin(a);
        this.col1.x = b;
        this.col2.x = -a;
        this.col1.y = a;
        this.col2.y = b
    },
    SetVV: function(a, b) {
        this.col1.SetV(a);
        this.col2.SetV(b)
    },
    Copy: function() {
        return new b2Mat22(0, this.col1, this.col2)
    },
    SetM: function(a) {
        this.col1.SetV(a.col1);
        this.col2.SetV(a.col2)
    },
    AddM: function(a) {
        this.col1.x += a.col1.x;
        this.col1.y += a.col1.y;
        this.col2.x += a.col2.x;
        this.col2.y += a.col2.y
    },
    SetIdentity: function() {
        this.col1.x = 1;
        this.col2.x = 0;
        this.col1.y = 0;
        this.col2.y = 1
    },
    SetZero: function() {
        this.col1.x = 0;
        this.col2.x = 0;
        this.col1.y = 0;
        this.col2.y = 0
    },
    Invert: function(a) {
        var b = this.col1.x,
            c = this.col2.x,
            e = this.col1.y,
            f = this.col2.y,
            g;
        g = 1 / (b * f - c * e);
        a.col1.x = g * f;
        a.col2.x = -g * c;
        a.col1.y = -g * e;
        a.col2.y = g * b;
        return a
    },
    Solve: function(a, b, c) {
        var e = this.col1.x,
            f = this.col2.x,
            g =
            this.col1.y,
            h = this.col2.y,
            i;
        i = 1 / (e * h - f * g);
        a.x = i * (h * b - f * c);
        a.y = i * (e * c - g * b);
        return a
    },
    Abs: function() {
        this.col1.Abs();
        this.col2.Abs()
    },
    col1: new b2Vec2,
    col2: new b2Vec2
};
var b2Math = Class.create();
b2Math.prototype = {
    initialize: function() {}
};
b2Math.b2IsValid = function(a) {
    return isFinite(a)
};
b2Math.b2Dot = function(a, b) {
    return a.x * b.x + a.y * b.y
};
b2Math.b2CrossVV = function(a, b) {
    return a.x * b.y - a.y * b.x
};
b2Math.b2CrossVF = function(a, b) {
    return new b2Vec2(b * a.y, -b * a.x)
};
b2Math.b2CrossFV = function(a, b) {
    return new b2Vec2(-a * b.y, a * b.x)
};
b2Math.b2MulMV = function(a, b) {
    return new b2Vec2(a.col1.x * b.x + a.col2.x * b.y, a.col1.y * b.x + a.col2.y * b.y)
};
b2Math.b2MulTMV = function(a, b) {
    return new b2Vec2(b2Math.b2Dot(b, a.col1), b2Math.b2Dot(b, a.col2))
};
b2Math.AddVV = function(a, b) {
    return new b2Vec2(a.x + b.x, a.y + b.y)
};
b2Math.SubtractVV = function(a, b) {
    return new b2Vec2(a.x - b.x, a.y - b.y)
};
b2Math.MulFV = function(a, b) {
    return new b2Vec2(a * b.x, a * b.y)
};
b2Math.AddMM = function(a, b) {
    return new b2Mat22(0, b2Math.AddVV(a.col1, b.col1), b2Math.AddVV(a.col2, b.col2))
};
b2Math.b2MulMM = function(a, b) {
    return new b2Mat22(0, b2Math.b2MulMV(a, b.col1), b2Math.b2MulMV(a, b.col2))
};
b2Math.b2MulTMM = function(a, b) {
    var c = new b2Vec2(b2Math.b2Dot(a.col1, b.col1), b2Math.b2Dot(a.col2, b.col1)),
        e = new b2Vec2(b2Math.b2Dot(a.col1, b.col2), b2Math.b2Dot(a.col2, b.col2));
    return new b2Mat22(0, c, e)
};
b2Math.b2Abs = function(a) {
    return 0 < a ? a : -a
};
b2Math.b2AbsV = function(a) {
    return new b2Vec2(b2Math.b2Abs(a.x), b2Math.b2Abs(a.y))
};
b2Math.b2AbsM = function(a) {
    return new b2Mat22(0, b2Math.b2AbsV(a.col1), b2Math.b2AbsV(a.col2))
};
b2Math.b2Min = function(a, b) {
    return a < b ? a : b
};
b2Math.b2MinV = function(a, b) {
    return new b2Vec2(b2Math.b2Min(a.x, b.x), b2Math.b2Min(a.y, b.y))
};
b2Math.b2Max = function(a, b) {
    return a > b ? a : b
};
b2Math.b2MaxV = function(a, b) {
    return new b2Vec2(b2Math.b2Max(a.x, b.x), b2Math.b2Max(a.y, b.y))
};
b2Math.b2Clamp = function(a, b, c) {
    return b2Math.b2Max(b, b2Math.b2Min(a, c))
};
b2Math.b2ClampV = function(a, b, c) {
    return b2Math.b2MaxV(b, b2Math.b2MinV(a, c))
};
b2Math.b2Swap = function(a, b) {
    var c = a[0];
    a[0] = b[0];
    b[0] = c
};
b2Math.b2Random = function() {
    return 2 * Math.random() - 1
};
b2Math.b2NextPowerOfTwo = function(a) {
    a |= a >> 1 & 2147483647;
    a |= a >> 2 & 1073741823;
    a |= a >> 4 & 268435455;
    a |= a >> 8 & 16777215;
    return (a | a >> 16 & 65535) + 1
};
b2Math.b2IsPowerOfTwo = function(a) {
    return 0 < a && 0 == (a & a - 1)
};
b2Math.tempVec2 = new b2Vec2;
b2Math.tempVec3 = new b2Vec2;
b2Math.tempVec4 = new b2Vec2;
b2Math.tempVec5 = new b2Vec2;
b2Math.tempMat = new b2Mat22;
var b2AABB = Class.create();
b2AABB.prototype = {
    IsValid: function() {
        var a = this.maxVertex.x,
            b = this.maxVertex.y,
            a = this.maxVertex.x,
            b = this.maxVertex.y,
            a = a - this.minVertex.x,
            b = b - this.minVertex.y;
        return a = 0 <= a && 0 <= b && this.minVertex.IsValid() && this.maxVertex.IsValid()
    },
    minVertex: new b2Vec2,
    maxVertex: new b2Vec2,
    initialize: function() {
        this.minVertex = new b2Vec2;
        this.maxVertex = new b2Vec2
    }
};
var b2Bound = Class.create();
b2Bound.prototype = {
    IsLower: function() {
        return 0 == (this.value & 1)
    },
    IsUpper: function() {
        return 1 == (this.value & 1)
    },
    Swap: function(a) {
        var b = this.value,
            c = this.proxyId,
            e = this.stabbingCount;
        this.value = a.value;
        this.proxyId = a.proxyId;
        this.stabbingCount = a.stabbingCount;
        a.value = b;
        a.proxyId = c;
        a.stabbingCount = e
    },
    value: 0,
    proxyId: 0,
    stabbingCount: 0,
    initialize: function() {}
};
var b2BoundValues = Class.create();
b2BoundValues.prototype = {
    lowerValues: [0, 0],
    upperValues: [0, 0],
    initialize: function() {
        this.lowerValues = [0, 0];
        this.upperValues = [0, 0]
    }
};
var b2Pair = Class.create();
b2Pair.prototype = {
    SetBuffered: function() {
        this.status |= b2Pair.e_pairBuffered
    },
    ClearBuffered: function() {
        this.status &= ~b2Pair.e_pairBuffered
    },
    IsBuffered: function() {
        return (this.status & b2Pair.e_pairBuffered) == b2Pair.e_pairBuffered
    },
    SetRemoved: function() {
        this.status |= b2Pair.e_pairRemoved
    },
    ClearRemoved: function() {
        this.status &= ~b2Pair.e_pairRemoved
    },
    IsRemoved: function() {
        return (this.status & b2Pair.e_pairRemoved) == b2Pair.e_pairRemoved
    },
    SetFinal: function() {
        this.status |= b2Pair.e_pairFinal
    },
    IsFinal: function() {
        return (this.status &
            b2Pair.e_pairFinal) == b2Pair.e_pairFinal
    },
    userData: null,
    proxyId1: 0,
    proxyId2: 0,
    next: 0,
    status: 0,
    initialize: function() {}
};
b2Pair.b2_nullPair = b2Settings.USHRT_MAX;
b2Pair.b2_nullProxy = b2Settings.USHRT_MAX;
b2Pair.b2_tableCapacity = b2Settings.b2_maxPairs;
b2Pair.b2_tableMask = b2Pair.b2_tableCapacity - 1;
b2Pair.e_pairBuffered = 1;
b2Pair.e_pairRemoved = 2;
b2Pair.e_pairFinal = 4;
var b2PairCallback = Class.create();
b2PairCallback.prototype = {
    PairAdded: function() {
        return null
    },
    PairRemoved: function() {},
    initialize: function() {}
};
var b2BufferedPair = Class.create();
b2BufferedPair.prototype = {
    proxyId1: 0,
    proxyId2: 0,
    initialize: function() {}
};
var b2PairManager = Class.create();
b2PairManager.prototype = {
    initialize: function() {
        var a = 0;
        this.m_hashTable = Array(b2Pair.b2_tableCapacity);
        for (a = 0; a < b2Pair.b2_tableCapacity; ++a) this.m_hashTable[a] = b2Pair.b2_nullPair;
        this.m_pairs = Array(b2Settings.b2_maxPairs);
        for (a = 0; a < b2Settings.b2_maxPairs; ++a) this.m_pairs[a] = new b2Pair;
        this.m_pairBuffer = Array(b2Settings.b2_maxPairs);
        for (a = 0; a < b2Settings.b2_maxPairs; ++a) this.m_pairBuffer[a] = new b2BufferedPair;
        for (a = 0; a < b2Settings.b2_maxPairs; ++a) this.m_pairs[a].proxyId1 = b2Pair.b2_nullProxy, this.m_pairs[a].proxyId2 =
            b2Pair.b2_nullProxy, this.m_pairs[a].userData = null, this.m_pairs[a].status = 0, this.m_pairs[a].next = a + 1;
        this.m_pairs[b2Settings.b2_maxPairs - 1].next = b2Pair.b2_nullPair;
        this.m_pairCount = 0
    },
    Initialize: function(a, b) {
        this.m_broadPhase = a;
        this.m_callback = b
    },
    AddBufferedPair: function(a, b) {
        var c = this.AddPair(a, b);
        if (!1 == c.IsBuffered()) c.SetBuffered(), this.m_pairBuffer[this.m_pairBufferCount].proxyId1 = c.proxyId1, this.m_pairBuffer[this.m_pairBufferCount].proxyId2 = c.proxyId2, ++this.m_pairBufferCount;
        c.ClearRemoved();
        b2BroadPhase.s_validate && this.ValidateBuffer()
    },
    RemoveBufferedPair: function(a, b) {
        var c = this.Find(a, b);
        if (null != c) {
            if (!1 == c.IsBuffered()) c.SetBuffered(), this.m_pairBuffer[this.m_pairBufferCount].proxyId1 = c.proxyId1, this.m_pairBuffer[this.m_pairBufferCount].proxyId2 = c.proxyId2, ++this.m_pairBufferCount;
            c.SetRemoved();
            b2BroadPhase.s_validate && this.ValidateBuffer()
        }
    },
    Commit: function() {
        for (var a = 0, b = 0, c = this.m_broadPhase.m_proxyPool, a = 0; a < this.m_pairBufferCount; ++a) {
            var e = this.Find(this.m_pairBuffer[a].proxyId1,
                this.m_pairBuffer[a].proxyId2);
            e.ClearBuffered();
            var f = c[e.proxyId1],
                g = c[e.proxyId2];
            if (e.IsRemoved()) !0 == e.IsFinal() && this.m_callback.PairRemoved(f.userData, g.userData, e.userData), this.m_pairBuffer[b].proxyId1 = e.proxyId1, this.m_pairBuffer[b].proxyId2 = e.proxyId2, ++b;
            else if (!1 == e.IsFinal()) e.userData = this.m_callback.PairAdded(f.userData, g.userData), e.SetFinal()
        }
        for (a = 0; a < b; ++a) this.RemovePair(this.m_pairBuffer[a].proxyId1, this.m_pairBuffer[a].proxyId2);
        this.m_pairBufferCount = 0;
        b2BroadPhase.s_validate &&
            this.ValidateTable()
    },
    AddPair: function(a, b) {
        if (a > b) var c = a,
            a = b,
            b = c;
        var c = b2PairManager.Hash(a, b) & b2Pair.b2_tableMask,
            e = e = this.FindHash(a, b, c);
        if (null != e) return e;
        var f = this.m_freePair,
            e = this.m_pairs[f];
        this.m_freePair = e.next;
        e.proxyId1 = a;
        e.proxyId2 = b;
        e.status = 0;
        e.userData = null;
        e.next = this.m_hashTable[c];
        this.m_hashTable[c] = f;
        ++this.m_pairCount;
        return e
    },
    RemovePair: function(a, b) {
        if (a > b) var c = a,
            a = b,
            b = c;
        for (var e = b2PairManager.Hash(a, b) & b2Pair.b2_tableMask, f = this.m_hashTable[e], g = null; f != b2Pair.b2_nullPair;) {
            if (b2PairManager.Equals(this.m_pairs[f],
                    a, b)) return c = f, g ? g.next = this.m_pairs[f].next : this.m_hashTable[e] = this.m_pairs[f].next, e = this.m_pairs[c], f = e.userData, e.next = this.m_freePair, e.proxyId1 = b2Pair.b2_nullProxy, e.proxyId2 = b2Pair.b2_nullProxy, e.userData = null, e.status = 0, this.m_freePair = c, --this.m_pairCount, f;
            g = this.m_pairs[f];
            f = g.next
        }
        return null
    },
    Find: function(a, b) {
        if (a > b) var c = a,
            a = b,
            b = c;
        c = b2PairManager.Hash(a, b) & b2Pair.b2_tableMask;
        return this.FindHash(a, b, c)
    },
    FindHash: function(a, b, c) {
        for (c = this.m_hashTable[c]; c != b2Pair.b2_nullPair && !1 ==
            b2PairManager.Equals(this.m_pairs[c], a, b);) c = this.m_pairs[c].next;
        return c == b2Pair.b2_nullPair ? null : this.m_pairs[c]
    },
    ValidateBuffer: function() {},
    ValidateTable: function() {},
    m_broadPhase: null,
    m_callback: null,
    m_pairs: null,
    m_freePair: 0,
    m_pairCount: 0,
    m_pairBuffer: null,
    m_pairBufferCount: 0,
    m_hashTable: null
};
b2PairManager.Hash = function(a, b) {
    var c = b << 16 & 4294901760 | a,
        c = ~c + (c << 15 & 4294934528),
        c = c ^ c >> 12 & 1048575,
        c = c + (c << 2 & 4294967292),
        c = 2057 * (c ^ c >> 4 & 268435455);
    return c ^ c >> 16 & 65535
};
b2PairManager.Equals = function(a, b, c) {
    return a.proxyId1 == b && a.proxyId2 == c
};
b2PairManager.EqualsPair = function(a, b) {
    return a.proxyId1 == b.proxyId1 && a.proxyId2 == b.proxyId2
};
var b2BroadPhase = Class.create();
b2BroadPhase.prototype = {
    initialize: function(a, b) {
        this.m_pairManager = new b2PairManager;
        this.m_proxyPool = Array(b2Settings.b2_maxPairs);
        this.m_bounds = Array(2 * b2Settings.b2_maxProxies);
        this.m_queryResults = Array(b2Settings.b2_maxProxies);
        this.m_quantizationFactor = new b2Vec2;
        var c = 0;
        this.m_pairManager.Initialize(this, b);
        this.m_worldAABB = a;
        for (c = this.m_proxyCount = 0; c < b2Settings.b2_maxProxies; c++) this.m_queryResults[c] = 0;
        this.m_bounds = Array(2);
        for (c = 0; 2 > c; c++) {
            this.m_bounds[c] = Array(2 * b2Settings.b2_maxProxies);
            for (var e = 0; e < 2 * b2Settings.b2_maxProxies; e++) this.m_bounds[c][e] = new b2Bound
        }
        c = a.maxVertex.x;
        e = a.maxVertex.y;
        c -= a.minVertex.x;
        e -= a.minVertex.y;
        this.m_quantizationFactor.x = b2Settings.USHRT_MAX / c;
        this.m_quantizationFactor.y = b2Settings.USHRT_MAX / e;
        for (c = 0; c < b2Settings.b2_maxProxies - 1; ++c) e = new b2Proxy, this.m_proxyPool[c] = e, e.SetNext(c + 1), e.timeStamp = 0, e.overlapCount = b2BroadPhase.b2_invalid, e.userData = null;
        e = new b2Proxy;
        this.m_proxyPool[b2Settings.b2_maxProxies - 1] = e;
        e.SetNext(b2Pair.b2_nullProxy);
        e.timeStamp =
            0;
        e.overlapCount = b2BroadPhase.b2_invalid;
        e.userData = null;
        this.m_freeProxy = 0;
        this.m_timeStamp = 1;
        this.m_queryResultCount = 0
    },
    InRange: function(a) {
        var b, c, e, f;
        b = a.minVertex.x;
        c = a.minVertex.y;
        b -= this.m_worldAABB.maxVertex.x;
        c -= this.m_worldAABB.maxVertex.y;
        e = this.m_worldAABB.minVertex.x;
        f = this.m_worldAABB.minVertex.y;
        e -= a.maxVertex.x;
        f -= a.maxVertex.y;
        b = b2Math.b2Max(b, e);
        c = b2Math.b2Max(c, f);
        return 0 > b2Math.b2Max(b, c)
    },
    GetProxy: function(a) {
        return a == b2Pair.b2_nullProxy || !1 == this.m_proxyPool[a].IsValid() ? null :
            this.m_proxyPool[a]
    },
    CreateProxy: function(a, b) {
        var c = 0,
            e, f = this.m_freeProxy;
        e = this.m_proxyPool[f];
        this.m_freeProxy = e.GetNext();
        e.overlapCount = 0;
        e.userData = b;
        e = 2 * this.m_proxyCount;
        var g = [],
            h = [];
        this.ComputeBounds(g, h, a);
        for (var i = 0; 2 > i; ++i) {
            var j = this.m_bounds[i],
                k = 0,
                l = 0,
                k = [k],
                l = [l];
            this.Query(k, l, g[i], h[i], j, e, i);
            for (var k = k[0], l = l[0], c = [], m = 0, o = e - l, n, p, m = 0; m < o; m++) c[m] = new b2Bound, n = c[m], p = j[l + m], n.value = p.value, n.proxyId = p.proxyId, n.stabbingCount = p.stabbingCount;
            for (var o = c.length, r = l + 2, m = 0; m < o; m++) p =
                c[m], n = j[r + m], n.value = p.value, n.proxyId = p.proxyId, n.stabbingCount = p.stabbingCount;
            c = [];
            o = l - k;
            for (m = 0; m < o; m++) c[m] = new b2Bound, n = c[m], p = j[k + m], n.value = p.value, n.proxyId = p.proxyId, n.stabbingCount = p.stabbingCount;
            o = c.length;
            r = k + 1;
            for (m = 0; m < o; m++) p = c[m], n = j[r + m], n.value = p.value, n.proxyId = p.proxyId, n.stabbingCount = p.stabbingCount;
            ++l;
            j[k].value = g[i];
            j[k].proxyId = f;
            j[l].value = h[i];
            j[l].proxyId = f;
            j[k].stabbingCount = 0 == k ? 0 : j[k - 1].stabbingCount;
            j[l].stabbingCount = j[l - 1].stabbingCount;
            for (c = k; c < l; ++c) j[c].stabbingCount++;
            for (c = k; c < e + 2; ++c) k = this.m_proxyPool[j[c].proxyId], j[c].IsLower() ? k.lowerBounds[i] = c : k.upperBounds[i] = c
        }++this.m_proxyCount;
        for (e = 0; e < this.m_queryResultCount; ++e) this.m_pairManager.AddBufferedPair(f, this.m_queryResults[e]);
        this.m_pairManager.Commit();
        this.m_queryResultCount = 0;
        this.IncrementTimeStamp();
        return f
    },
    DestroyProxy: function(a) {
        for (var b = this.m_proxyPool[a], c = 2 * this.m_proxyCount, e = 0; 2 > e; ++e) {
            for (var f = this.m_bounds[e], g = b.lowerBounds[e], h = b.upperBounds[e], i = f[g].value, j = f[h].value, k = [], l =
                    0, m = h - g - 1, o, n, l = 0; l < m; l++) k[l] = new b2Bound, o = k[l], n = f[g + 1 + l], o.value = n.value, o.proxyId = n.proxyId, o.stabbingCount = n.stabbingCount;
            for (var m = k.length, p = g, l = 0; l < m; l++) n = k[l], o = f[p + l], o.value = n.value, o.proxyId = n.proxyId, o.stabbingCount = n.stabbingCount;
            k = [];
            m = c - h - 1;
            for (l = 0; l < m; l++) k[l] = new b2Bound, o = k[l], n = f[h + 1 + l], o.value = n.value, o.proxyId = n.proxyId, o.stabbingCount = n.stabbingCount;
            m = k.length;
            p = h - 1;
            for (l = 0; l < m; l++) n = k[l], o = f[p + l], o.value = n.value, o.proxyId = n.proxyId, o.stabbingCount = n.stabbingCount;
            m = c -
                2;
            for (k = g; k < m; ++k) l = this.m_proxyPool[f[k].proxyId], f[k].IsLower() ? l.lowerBounds[e] = k : l.upperBounds[e] = k;
            for (m = h - 1; g < m; ++g) f[g].stabbingCount--;
            this.Query([0], [0], i, j, f, c - 2, e)
        }
        for (c = 0; c < this.m_queryResultCount; ++c) this.m_pairManager.RemoveBufferedPair(a, this.m_queryResults[c]);
        this.m_pairManager.Commit();
        this.m_queryResultCount = 0;
        this.IncrementTimeStamp();
        b.userData = null;
        b.overlapCount = b2BroadPhase.b2_invalid;
        b.lowerBounds[0] = b2BroadPhase.b2_invalid;
        b.lowerBounds[1] = b2BroadPhase.b2_invalid;
        b.upperBounds[0] =
            b2BroadPhase.b2_invalid;
        b.upperBounds[1] = b2BroadPhase.b2_invalid;
        b.SetNext(this.m_freeProxy);
        this.m_freeProxy = a;
        --this.m_proxyCount
    },
    MoveProxy: function(a, b) {
        var c = 0,
            e = 0,
            f, g, h = 0,
            i;
        if (!(a == b2Pair.b2_nullProxy || b2Settings.b2_maxProxies <= a || !1 == b.IsValid())) {
            var j = 2 * this.m_proxyCount,
                k = this.m_proxyPool[a],
                l = new b2BoundValues;
            this.ComputeBounds(l.lowerValues, l.upperValues, b);
            for (var m = new b2BoundValues, c = 0; 2 > c; ++c) m.lowerValues[c] = this.m_bounds[c][k.lowerBounds[c]].value, m.upperValues[c] = this.m_bounds[c][k.upperBounds[c]].value;
            for (c = 0; 2 > c; ++c) {
                var o = this.m_bounds[c],
                    n = k.lowerBounds[c],
                    p = k.upperBounds[c],
                    r = l.lowerValues[c],
                    s = l.upperValues[c],
                    q = r - o[n].value,
                    t = s - o[p].value;
                o[n].value = r;
                o[p].value = s;
                if (0 > q)
                    for (e = n; 0 < e && r < o[e - 1].value;) f = o[e], g = o[e - 1], h = g.proxyId, i = this.m_proxyPool[g.proxyId], g.stabbingCount++, !0 == g.IsUpper() ? (this.TestOverlap(l, i) && this.m_pairManager.AddBufferedPair(a, h), i.upperBounds[c] ++, f.stabbingCount++) : (i.lowerBounds[c] ++, f.stabbingCount--), k.lowerBounds[c] --, f.Swap(g), --e;
                if (0 < t)
                    for (e = p; e < j - 1 && o[e + 1].value <=
                        s;) f = o[e], g = o[e + 1], h = g.proxyId, i = this.m_proxyPool[h], g.stabbingCount++, !0 == g.IsLower() ? (this.TestOverlap(l, i) && this.m_pairManager.AddBufferedPair(a, h), i.lowerBounds[c] --, f.stabbingCount++) : (i.upperBounds[c] --, f.stabbingCount--), k.upperBounds[c] ++, f.Swap(g), e++;
                if (0 < q)
                    for (e = n; e < j - 1 && o[e + 1].value <= r;) f = o[e], g = o[e + 1], h = g.proxyId, i = this.m_proxyPool[h], g.stabbingCount--, g.IsUpper() ? (this.TestOverlap(m, i) && this.m_pairManager.RemoveBufferedPair(a, h), i.upperBounds[c] --, f.stabbingCount--) : (i.lowerBounds[c] --,
                        f.stabbingCount++), k.lowerBounds[c] ++, f.Swap(g), e++;
                if (0 > t)
                    for (e = p; 0 < e && s < o[e - 1].value;) f = o[e], g = o[e - 1], h = g.proxyId, i = this.m_proxyPool[h], g.stabbingCount--, !0 == g.IsLower() ? (this.TestOverlap(m, i) && this.m_pairManager.RemoveBufferedPair(a, h), i.lowerBounds[c] ++, f.stabbingCount--) : (i.upperBounds[c] ++, f.stabbingCount++), k.upperBounds[c] --, f.Swap(g), e--
            }
        }
    },
    Commit: function() {
        this.m_pairManager.Commit()
    },
    QueryAABB: function(a, b, c) {
        var e = [],
            f = [];
        this.ComputeBounds(e, f, a);
        var a = [0],
            g = [0];
        this.Query(a, g, e[0],
            f[0], this.m_bounds[0], 2 * this.m_proxyCount, 0);
        this.Query(a, g, e[1], f[1], this.m_bounds[1], 2 * this.m_proxyCount, 1);
        for (f = e = 0; f < this.m_queryResultCount && e < c; ++f, ++e) b[f] = this.m_proxyPool[this.m_queryResults[f]].userData;
        this.m_queryResultCount = 0;
        this.IncrementTimeStamp();
        return e
    },
    Validate: function() {
        for (var a = 0; 2 > a; ++a)
            for (var b = this.m_bounds[a], c = 2 * this.m_proxyCount, e = 0, f = 0; f < c; ++f) !0 == b[f].IsLower() ? e++ : e--
    },
    ComputeBounds: function(a, b, c) {
        var e = c.minVertex.x,
            f = c.minVertex.y,
            e = b2Math.b2Min(e, this.m_worldAABB.maxVertex.x),
            f = b2Math.b2Min(f, this.m_worldAABB.maxVertex.y),
            e = b2Math.b2Max(e, this.m_worldAABB.minVertex.x),
            f = b2Math.b2Max(f, this.m_worldAABB.minVertex.y),
            g = c.maxVertex.x,
            c = c.maxVertex.y,
            g = b2Math.b2Min(g, this.m_worldAABB.maxVertex.x),
            c = b2Math.b2Min(c, this.m_worldAABB.maxVertex.y),
            g = b2Math.b2Max(g, this.m_worldAABB.minVertex.x),
            c = b2Math.b2Max(c, this.m_worldAABB.minVertex.y);
        a[0] = this.m_quantizationFactor.x * (e - this.m_worldAABB.minVertex.x) & b2Settings.USHRT_MAX - 1;
        b[0] = this.m_quantizationFactor.x * (g - this.m_worldAABB.minVertex.x) &
            65535 | 1;
        a[1] = this.m_quantizationFactor.y * (f - this.m_worldAABB.minVertex.y) & b2Settings.USHRT_MAX - 1;
        b[1] = this.m_quantizationFactor.y * (c - this.m_worldAABB.minVertex.y) & 65535 | 1
    },
    TestOverlapValidate: function(a, b) {
        for (var c = 0; 2 > c; ++c) {
            var e = this.m_bounds[c];
            if (e[a.lowerBounds[c]].value > e[b.upperBounds[c]].value || e[a.upperBounds[c]].value < e[b.lowerBounds[c]].value) return !1
        }
        return !0
    },
    TestOverlap: function(a, b) {
        for (var c = 0; 2 > c; ++c) {
            var e = this.m_bounds[c];
            if (a.lowerValues[c] > e[b.upperBounds[c]].value || a.upperValues[c] <
                e[b.lowerBounds[c]].value) return !1
        }
        return !0
    },
    Query: function(a, b, c, e, f, g, h) {
        c = b2BroadPhase.BinarySearch(f, g, c);
        e = b2BroadPhase.BinarySearch(f, g, e);
        for (g = c; g < e; ++g) f[g].IsLower() && this.IncrementOverlapCount(f[g].proxyId);
        if (0 < c)
            for (var g = c - 1, i = f[g].stabbingCount; i;) f[g].IsLower() && c <= this.m_proxyPool[f[g].proxyId].upperBounds[h] && (this.IncrementOverlapCount(f[g].proxyId), --i), --g;
        a[0] = c;
        b[0] = e
    },
    IncrementOverlapCount: function(a) {
        var b = this.m_proxyPool[a];
        b.timeStamp < this.m_timeStamp ? (b.timeStamp = this.m_timeStamp,
            b.overlapCount = 1) : (b.overlapCount = 2, this.m_queryResults[this.m_queryResultCount] = a, ++this.m_queryResultCount)
    },
    IncrementTimeStamp: function() {
        if (this.m_timeStamp == b2Settings.USHRT_MAX) {
            for (var a = 0; a < b2Settings.b2_maxProxies; ++a) this.m_proxyPool[a].timeStamp = 0;
            this.m_timeStamp = 1
        } else ++this.m_timeStamp
    },
    m_pairManager: new b2PairManager,
    m_proxyPool: Array(b2Settings.b2_maxPairs),
    m_freeProxy: 0,
    m_bounds: Array(2 * b2Settings.b2_maxProxies),
    m_queryResults: Array(b2Settings.b2_maxProxies),
    m_queryResultCount: 0,
    m_worldAABB: null,
    m_quantizationFactor: new b2Vec2,
    m_proxyCount: 0,
    m_timeStamp: 0
};
b2BroadPhase.s_validate = !1;
b2BroadPhase.b2_invalid = b2Settings.USHRT_MAX;
b2BroadPhase.b2_nullEdge = b2Settings.USHRT_MAX;
b2BroadPhase.BinarySearch = function(a, b, c) {
    for (var e = 0, b = b - 1; e <= b;) {
        var f = Math.floor((e + b) / 2);
        if (a[f].value > c) b = f - 1;
        else if (a[f].value < c) e = f + 1;
        else return f
    }
    return e
};
var b2Collision = Class.create();
b2Collision.prototype = {
    initialize: function() {}
};
b2Collision.b2_nullFeature = 255;
b2Collision.ClipSegmentToLine = function(a, b, c, e) {
    var f = 0,
        g = b[0].v,
        h = b[1].v,
        i = b2Math.b2Dot(c, b[0].v) - e,
        c = b2Math.b2Dot(c, b[1].v) - e;
    0 >= i && (a[f++] = b[0]);
    0 >= c && (a[f++] = b[1]);
    if (0 > i * c) c = i / (i - c), e = a[f].v, e.x = g.x + c * (h.x - g.x), e.y = g.y + c * (h.y - g.y), a[f].id = 0 < i ? b[0].id : b[1].id, ++f;
    return f
};
b2Collision.EdgeSeparation = function(a, b, c) {
    for (var e = a.m_vertices, f = c.m_vertexCount, g = c.m_vertices, h = a.m_normals[b].x, i = a.m_normals[b].y, j = h, k = a.m_R, h = k.col1.x * j + k.col2.x * i, i = k.col1.y * j + k.col2.y * i, l = h, m = i, k = c.m_R, j = l * k.col1.x + m * k.col1.y, m = l * k.col2.x + m * k.col2.y, l = j, j = 0, k = Number.MAX_VALUE, o = 0; o < f; ++o) {
        var n = g[o],
            n = n.x * l + n.y * m;
        n < k && (k = n, j = o)
    }
    k = a.m_R;
    f = a.m_position.x + (k.col1.x * e[b].x + k.col2.x * e[b].y);
    a = a.m_position.y + (k.col1.y * e[b].x + k.col2.y * e[b].y);
    k = c.m_R;
    b = c.m_position.x + (k.col1.x * g[j].x + k.col2.x *
        g[j].y);
    c = c.m_position.y + (k.col1.y * g[j].x + k.col2.y * g[j].y);
    return (b - f) * h + (c - a) * i
};
b2Collision.FindMaxSeparation = function(a, b, c, e) {
    for (var f = b.m_vertexCount, g = c.m_position.x - b.m_position.x, h = c.m_position.y - b.m_position.y, i = g * b.m_R.col1.x + h * b.m_R.col1.y, h = g * b.m_R.col2.x + h * b.m_R.col2.y, g = 0, j = -Number.MAX_VALUE, k = 0; k < f; ++k) {
        var l = b.m_normals[k].x * i + b.m_normals[k].y * h;
        l > j && (j = l, g = k)
    }
    i = b2Collision.EdgeSeparation(b, g, c);
    if (0 < i && !1 == e) return i;
    k = 0 <= g - 1 ? g - 1 : f - 1;
    l = b2Collision.EdgeSeparation(b, k, c);
    if (0 < l && !1 == e) return l;
    var m = g + 1 < f ? g + 1 : 0,
        o = b2Collision.EdgeSeparation(b, m, c);
    if (0 < o && !1 == e) return o;
    j = h = 0;
    if (l > i && l > o) j = -1, h = k, k = l;
    else if (o > i) j = 1, h = m, k = o;
    else return a[0] = g, i;
    for (;;) {
        g = -1 == j ? 0 <= h - 1 ? h - 1 : f - 1 : h + 1 < f ? h + 1 : 0;
        i = b2Collision.EdgeSeparation(b, g, c);
        if (0 < i && !1 == e) return i;
        if (i > k) h = g, k = i;
        else break
    }
    a[0] = h;
    return k
};
b2Collision.FindIncidentEdge = function(a, b, c, e) {
    for (var f = b.m_vertices, g = e.m_vertexCount, h = e.m_vertices, i = f[c + 1 == b.m_vertexCount ? 0 : c + 1], j = i.x, k = i.y, i = f[c], j = j - i.x, k = k - i.y, i = j, j = k, k = -i, i = 1 / Math.sqrt(j * j + k * k), k = k * i, i = j * i, f = b.m_R, b = f.col1.x * i + f.col2.x * k, j = k = f.col1.y * i + f.col2.y * k, f = e.m_R, i = b * f.col1.x + j * f.col1.y, j = b * f.col2.x + j * f.col2.y, b = i, f = k = 0, l = Number.MAX_VALUE, m = 0; m < g; ++m) {
        var o = m,
            n = m + 1 < g ? m + 1 : 0,
            i = h[n],
            p = i.x,
            r = i.y,
            i = h[o],
            p = p - i.x,
            r = r - i.y,
            i = p,
            p = r,
            r = -i,
            i = 1 / Math.sqrt(p * p + r * r),
            p = p * i,
            r = r * i,
            i = p * b + r * j;
        i < l &&
            (l = i, k = o, f = n)
    }
    g = a[0];
    i = g.v;
    i.SetV(h[k]);
    i.MulM(e.m_R);
    i.Add(e.m_position);
    g.id.features.referenceFace = c;
    g.id.features.incidentEdge = k;
    g.id.features.incidentVertex = k;
    g = a[1];
    i = g.v;
    i.SetV(h[f]);
    i.MulM(e.m_R);
    i.Add(e.m_position);
    g.id.features.referenceFace = c;
    g.id.features.incidentEdge = k;
    g.id.features.incidentVertex = f
};
b2Collision.b2CollidePolyTempVec = new b2Vec2;
b2Collision.b2CollidePoly = function(a, b, c, e) {
    a.pointCount = 0;
    var f, g = [0],
        h = b2Collision.FindMaxSeparation(g, b, c, e);
    f = g[0];
    if (!(0 < h && !1 == e)) {
        var i, g = [0],
            j = b2Collision.FindMaxSeparation(g, c, b, e);
        i = g[0];
        if (!(0 < j && !1 == e)) {
            var k = 0,
                g = 0;
            j > 0.98 * h + 0.0010 ? (h = c, k = i, g = 1) : (h = b, b = c, k = f, g = 0);
            c = [new ClipVertex, new ClipVertex];
            b2Collision.FindIncidentEdge(c, h, k, b);
            var b = h.m_vertices,
                l = b[k],
                m = k + 1 < h.m_vertexCount ? b[k + 1] : b[0];
            f = m.x - l.x;
            i = m.y - l.y;
            var o = f,
                n = h.m_R;
            f = n.col1.x * o + n.col2.x * i;
            i = n.col1.y * o + n.col2.y * i;
            k = 1 / Math.sqrt(f *
                f + i * i);
            f *= k;
            i *= k;
            var o = f,
                k = i,
                b = -o,
                j = l.x,
                p = l.y,
                o = j,
                n = h.m_R,
                j = n.col1.x * o + n.col2.x * p,
                p = n.col1.y * o + n.col2.y * p,
                j = j + h.m_position.x,
                p = p + h.m_position.y,
                l = m.x,
                m = m.y,
                o = l,
                n = h.m_R,
                l = n.col1.x * o + n.col2.x * m,
                m = n.col1.y * o + n.col2.y * m,
                l = l + h.m_position.x,
                m = m + h.m_position.y,
                h = k * j + b * p,
                o = -(f * j + i * p),
                l = f * l + i * m,
                m = [new ClipVertex, new ClipVertex],
                j = [new ClipVertex, new ClipVertex],
                n = 0;
            b2Collision.b2CollidePolyTempVec.Set(-f, -i);
            n = b2Collision.ClipSegmentToLine(m, c, b2Collision.b2CollidePolyTempVec, o);
            if (!(2 > n) && (b2Collision.b2CollidePolyTempVec.Set(f,
                    i), n = b2Collision.ClipSegmentToLine(j, m, b2Collision.b2CollidePolyTempVec, l), !(2 > n))) {
                g ? a.normal.Set(-k, -b) : a.normal.Set(k, b);
                for (f = c = 0; f < b2Settings.b2_maxManifoldPoints; ++f)
                    if (i = j[f].v, i = k * i.x + b * i.y - h, 0 >= i || !0 == e) l = a.points[c], l.separation = i, l.position.SetV(j[f].v), l.id.Set(j[f].id), l.id.features.flip = g, ++c;
                a.pointCount = c
            }
        }
    }
};
b2Collision.b2CollideCircle = function(a, b, c, e) {
    a.pointCount = 0;
    var f = c.m_position.x - b.m_position.x,
        g = c.m_position.y - b.m_position.y,
        h = f * f + g * g,
        b = b.m_radius + c.m_radius;
    if (!(h > b * b && !1 == e)) h < Number.MIN_VALUE ? (e = -b, a.normal.Set(0, 1)) : (h = Math.sqrt(h), e = h - b, h = 1 / h, a.normal.x = h * f, a.normal.y = h * g), a.pointCount = 1, f = a.points[0], f.id.set_key(0), f.separation = e, f.position.x = c.m_position.x - c.m_radius * a.normal.x, f.position.y = c.m_position.y - c.m_radius * a.normal.y
};
b2Collision.b2CollidePolyAndCircle = function(a, b, c) {
    a.pointCount = 0;
    var e, f, g;
    f = c.m_position.x - b.m_position.x;
    g = c.m_position.y - b.m_position.y;
    var h = b.m_R,
        i = f * h.col1.x + g * h.col1.y;
    g = f * h.col2.x + g * h.col2.y;
    f = i;
    var j = 0,
        k = -Number.MAX_VALUE,
        i = c.m_radius;
    for (e = 0; e < b.m_vertexCount; ++e) {
        var l = b.m_normals[e].x * (f - b.m_vertices[e].x) + b.m_normals[e].y * (g - b.m_vertices[e].y);
        if (l > i) return;
        l > k && (k = l, j = e)
    }
    if (k < Number.MIN_VALUE) a.pointCount = 1, g = b.m_normals[j], a.normal.x = h.col1.x * g.x + h.col2.x * g.y, a.normal.y = h.col1.y * g.x +
        h.col2.y * g.y, e = a.points[0], e.id.features.incidentEdge = j, e.id.features.incidentVertex = b2Collision.b2_nullFeature, e.id.features.referenceFace = b2Collision.b2_nullFeature, e.id.features.flip = 0, e.position.x = c.m_position.x - i * a.normal.x, e.position.y = c.m_position.y - i * a.normal.y, e.separation = k - i;
    else {
        var k = j + 1 < b.m_vertexCount ? j + 1 : 0,
            m = b.m_vertices[k].x - b.m_vertices[j].x,
            l = b.m_vertices[k].y - b.m_vertices[j].y,
            o = Math.sqrt(m * m + l * l),
            m = m / o,
            l = l / o;
        if (o < Number.MIN_VALUE) {
            if (f -= b.m_vertices[j].x, g -= b.m_vertices[j].y,
                b = Math.sqrt(f * f + g * g), f /= b, g /= b, !(b > i)) a.pointCount = 1, a.normal.Set(h.col1.x * f + h.col2.x * g, h.col1.y * f + h.col2.y * g), e = a.points[0], e.id.features.incidentEdge = b2Collision.b2_nullFeature, e.id.features.incidentVertex = j, e.id.features.referenceFace = b2Collision.b2_nullFeature, e.id.features.flip = 0, e.position.x = c.m_position.x - i * a.normal.x, e.position.y = c.m_position.y - i * a.normal.y, e.separation = b - i
        } else {
            var n = (f - b.m_vertices[j].x) * m + (g - b.m_vertices[j].y) * l;
            e = a.points[0];
            e.id.features.incidentEdge = b2Collision.b2_nullFeature;
            e.id.features.incidentVertex = b2Collision.b2_nullFeature;
            e.id.features.referenceFace = b2Collision.b2_nullFeature;
            e.id.features.flip = 0;
            0 >= n ? (m = b.m_vertices[j].x, b = b.m_vertices[j].y, e.id.features.incidentVertex = j) : n >= o ? (m = b.m_vertices[k].x, b = b.m_vertices[k].y, e.id.features.incidentVertex = k) : (m = m * n + b.m_vertices[j].x, b = l * n + b.m_vertices[j].y, e.id.features.incidentEdge = j);
            f -= m;
            g -= b;
            b = Math.sqrt(f * f + g * g);
            f /= b;
            g /= b;
            if (!(b > i)) a.pointCount = 1, a.normal.Set(h.col1.x * f + h.col2.x * g, h.col1.y * f + h.col2.y * g), e.position.x =
                c.m_position.x - i * a.normal.x, e.position.y = c.m_position.y - i * a.normal.y, e.separation = b - i
        }
    }
};
b2Collision.b2TestOverlap = function(a, b) {
    var c = b.minVertex,
        e = a.maxVertex,
        f = c.x - e.x,
        g = c.y - e.y,
        c = a.minVertex,
        e = b.maxVertex,
        h = c.x - e.x,
        c = c.y - e.y;
    return 0 < f || 0 < g || 0 < h || 0 < c ? !1 : !0
};
var Features = Class.create();
Features.prototype = {
    set_referenceFace: function(a) {
        this._referenceFace = a;
        this._m_id._key = this._m_id._key & 4294967040 | this._referenceFace & 255
    },
    get_referenceFace: function() {
        return this._referenceFace
    },
    _referenceFace: 0,
    set_incidentEdge: function(a) {
        this._incidentEdge = a;
        this._m_id._key = this._m_id._key & 4294902015 | this._incidentEdge << 8 & 65280
    },
    get_incidentEdge: function() {
        return this._incidentEdge
    },
    _incidentEdge: 0,
    set_incidentVertex: function(a) {
        this._incidentVertex = a;
        this._m_id._key = this._m_id._key & 4278255615 |
            this._incidentVertex << 16 & 16711680
    },
    get_incidentVertex: function() {
        return this._incidentVertex
    },
    _incidentVertex: 0,
    set_flip: function(a) {
        this._flip = a;
        this._m_id._key = this._m_id._key & 16777215 | this._flip << 24 & 4278190080
    },
    get_flip: function() {
        return this._flip
    },
    _flip: 0,
    _m_id: null,
    initialize: function() {}
};
var b2ContactID = Class.create();
b2ContactID.prototype = {
    initialize: function() {
        this.features = new Features;
        this.features._m_id = this
    },
    Set: function(a) {
        this.set_key(a._key)
    },
    Copy: function() {
        var a = new b2ContactID;
        a.set_key(this._key);
        return a
    },
    get_key: function() {
        return this._key
    },
    set_key: function(a) {
        this._key = a;
        this.features._referenceFace = this._key & 255;
        this.features._incidentEdge = (this._key & 65280) >> 8 & 255;
        this.features._incidentVertex = (this._key & 16711680) >> 16 & 255;
        this.features._flip = (this._key & 4278190080) >> 24 & 255
    },
    features: new Features,
    _key: 0
};
var b2ContactPoint = Class.create();
b2ContactPoint.prototype = {
    position: new b2Vec2,
    separation: null,
    normalImpulse: null,
    tangentImpulse: null,
    id: new b2ContactID,
    initialize: function() {
        this.position = new b2Vec2;
        this.id = new b2ContactID
    }
};
var b2Distance = Class.create();
b2Distance.prototype = {
    initialize: function() {}
};
b2Distance.ProcessTwo = function(a, b, c, e, f) {
    var g = -f[1].x,
        h = -f[1].y,
        i = f[0].x - f[1].x,
        j = f[0].y - f[1].y,
        k = Math.sqrt(i * i + j * j),
        g = g * (i / k) + h * (j / k);
    if (0 >= g || k < Number.MIN_VALUE) return a.SetV(c[1]), b.SetV(e[1]), c[0].SetV(c[1]), e[0].SetV(e[1]), f[0].SetV(f[1]), 1;
    g /= k;
    a.x = c[1].x + g * (c[0].x - c[1].x);
    a.y = c[1].y + g * (c[0].y - c[1].y);
    b.x = e[1].x + g * (e[0].x - e[1].x);
    b.y = e[1].y + g * (e[0].y - e[1].y);
    return 2
};
b2Distance.ProcessThree = function(a, b, c, e, f) {
    var g = f[0].x,
        h = f[0].y,
        i = f[1].x,
        j = f[1].y,
        k = f[2].x,
        l = f[2].y,
        m = i - g,
        o = j - h,
        n = k - g,
        p = l - h,
        r = k - i,
        s = l - j,
        q = -(g * n + h * p),
        t = k * n + l * p,
        z = -(i * r + j * s),
        r = k * r + l * s;
    if (0 >= t && 0 >= r) return a.SetV(c[2]), b.SetV(e[2]), c[0].SetV(c[2]), e[0].SetV(e[2]), f[0].SetV(f[2]), 1;
    o = m * p - o * n;
    m = o * (g * j - h * i);
    i = o * (i * l - j * k);
    if (0 >= i && 0 <= z && 0 <= r) return q = z / (z + r), a.x = c[1].x + q * (c[2].x - c[1].x), a.y = c[1].y + q * (c[2].y - c[1].y), b.x = e[1].x + q * (e[2].x - e[1].x), b.y = e[1].y + q * (e[2].y - e[1].y), c[0].SetV(c[2]), e[0].SetV(e[2]),
        f[0].SetV(f[2]), 2;
    g = o * (k * h - l * g);
    if (0 >= g && 0 <= q && 0 <= t) return q /= q + t, a.x = c[0].x + q * (c[2].x - c[0].x), a.y = c[0].y + q * (c[2].y - c[0].y), b.x = e[0].x + q * (e[2].x - e[0].x), b.y = e[0].y + q * (e[2].y - e[0].y), c[1].SetV(c[2]), e[1].SetV(e[2]), f[1].SetV(f[2]), 2;
    q = 1 / (i + g + m);
    f = i * q;
    q *= g;
    t = 1 - f - q;
    a.x = f * c[0].x + q * c[1].x + t * c[2].x;
    a.y = f * c[0].y + q * c[1].y + t * c[2].y;
    b.x = f * e[0].x + q * e[1].x + t * e[2].x;
    b.y = f * e[0].y + q * e[1].y + t * e[2].y;
    return 3
};
b2Distance.InPoinsts = function(a, b, c) {
    for (var e = 0; e < c; ++e)
        if (a.x == b[e].x && a.y == b[e].y) return !0;
    return !1
};
b2Distance.Distance = function(a, b, c, e) {
    var f = Array(3),
        g = Array(3),
        h = Array(3),
        i = 0;
    a.SetV(c.m_position);
    b.SetV(e.m_position);
    for (var j = 0, k = 0; 20 > k; ++k) {
        var l = b.x - a.x,
            m = b.y - a.y,
            o = c.Support(l, m),
            n = e.Support(-l, -m),
            j = l * l + m * m,
            p = n.x - o.x,
            r = n.y - o.y;
        if (j - b2Dot(l * p + m * r) <= 0.01 * j) return 0 == i && (a.SetV(o), b.SetV(n)), b2Distance.g_GJK_Iterations = k, Math.sqrt(j);
        switch (i) {
            case 0:
                f[0].SetV(o);
                g[0].SetV(n);
                h[0] = w;
                a.SetV(f[0]);
                b.SetV(g[0]);
                ++i;
                break;
            case 1:
                f[1].SetV(o);
                g[1].SetV(n);
                h[1].x = p;
                h[1].y = r;
                i = b2Distance.ProcessTwo(a,
                    b, f, g, h);
                break;
            case 2:
                f[2].SetV(o), g[2].SetV(n), h[2].x = p, h[2].y = r, i = b2Distance.ProcessThree(a, b, f, g, h)
        }
        if (3 == i) return b2Distance.g_GJK_Iterations = k, 0;
        l = -Number.MAX_VALUE;
        for (m = 0; m < i; ++m) l = b2Math.b2Max(l, h[m].x * h[m].x + h[m].y * h[m].y);
        if (3 == i || j <= 100 * Number.MIN_VALUE * l) return b2Distance.g_GJK_Iterations = k, Math.sqrt(j)
    }
    b2Distance.g_GJK_Iterations = 20;
    return Math.sqrt(j)
};
b2Distance.g_GJK_Iterations = 0;
var b2Manifold = Class.create();
b2Manifold.prototype = {
    initialize: function() {
        this.points = Array(b2Settings.b2_maxManifoldPoints);
        for (var a = 0; a < b2Settings.b2_maxManifoldPoints; a++) this.points[a] = new b2ContactPoint;
        this.normal = new b2Vec2
    },
    points: null,
    normal: null,
    pointCount: 0
};
var b2OBB = Class.create();
b2OBB.prototype = {
    R: new b2Mat22,
    center: new b2Vec2,
    extents: new b2Vec2,
    initialize: function() {
        this.R = new b2Mat22;
        this.center = new b2Vec2;
        this.extents = new b2Vec2
    }
};
var b2Proxy = Class.create();
b2Proxy.prototype = {
    GetNext: function() {
        return this.lowerBounds[0]
    },
    SetNext: function(a) {
        this.lowerBounds[0] = a
    },
    IsValid: function() {
        return this.overlapCount != b2BroadPhase.b2_invalid
    },
    lowerBounds: [0, 0],
    upperBounds: [0, 0],
    overlapCount: 0,
    timeStamp: 0,
    userData: null,
    initialize: function() {
        this.lowerBounds = [0, 0];
        this.upperBounds = [0, 0]
    }
};
var ClipVertex = Class.create();
ClipVertex.prototype = {
    v: new b2Vec2,
    id: new b2ContactID,
    initialize: function() {
        this.v = new b2Vec2;
        this.id = new b2ContactID
    }
};
var b2Shape = Class.create();
b2Shape.prototype = {
    TestPoint: function() {
        return !1
    },
    GetUserData: function() {
        return this.m_userData
    },
    GetType: function() {
        return this.m_type
    },
    GetBody: function() {
        return this.m_body
    },
    GetPosition: function() {
        return this.m_position
    },
    GetRotationMatrix: function() {
        return this.m_R
    },
    ResetProxy: function() {},
    GetNext: function() {
        return this.m_next
    },
    initialize: function(a, b) {
        this.m_R = new b2Mat22;
        this.m_position = new b2Vec2;
        this.m_userData = a.userData;
        this.m_friction = a.friction;
        this.m_restitution = a.restitution;
        this.m_body =
            b;
        this.m_proxyId = b2Pair.b2_nullProxy;
        this.m_maxRadius = 0;
        this.m_categoryBits = a.categoryBits;
        this.m_maskBits = a.maskBits;
        this.m_groupIndex = a.groupIndex
    },
    DestroyProxy: function() {
        if (this.m_proxyId != b2Pair.b2_nullProxy) this.m_body.m_world.m_broadPhase.DestroyProxy(this.m_proxyId), this.m_proxyId = b2Pair.b2_nullProxy
    },
    Synchronize: function() {},
    QuickSync: function() {},
    Support: function() {},
    GetMaxRadius: function() {
        return this.m_maxRadius
    },
    m_next: null,
    m_R: new b2Mat22,
    m_position: new b2Vec2,
    m_type: 0,
    m_userData: null,
    m_body: null,
    m_friction: null,
    m_restitution: null,
    m_maxRadius: null,
    m_proxyId: 0,
    m_categoryBits: 0,
    m_maskBits: 0,
    m_groupIndex: 0
};
b2Shape.Create = function(a, b, c) {
    switch (a.type) {
        case b2Shape.e_circleShape:
            return new b2CircleShape(a, b, c);
        case b2Shape.e_boxShape:
        case b2Shape.e_polyShape:
            return new b2PolyShape(a, b, c)
    }
    return null
};
b2Shape.Destroy = function(a) {
    a.m_proxyId != b2Pair.b2_nullProxy && a.m_body.m_world.m_broadPhase.DestroyProxy(a.m_proxyId)
};
b2Shape.e_unknownShape = -1;
b2Shape.e_circleShape = 0;
b2Shape.e_boxShape = 1;
b2Shape.e_polyShape = 2;
b2Shape.e_meshShape = 3;
b2Shape.e_shapeTypeCount = 4;
b2Shape.PolyMass = function(a, b, c, e) {
    var f = new b2Vec2;
    f.SetZero();
    for (var g = 0, h = 0, i = new b2Vec2(0, 0), j = 1 / 3, k = 0; k < c; ++k) {
        var l = i,
            m = b[k],
            o = k + 1 < c ? b[k + 1] : b[0],
            n = b2Math.SubtractVV(m, l),
            p = b2Math.SubtractVV(o, l),
            r = b2Math.b2CrossVV(n, p),
            s = 0.5 * r,
            g = g + s,
            q = new b2Vec2;
        q.SetV(l);
        q.Add(m);
        q.Add(o);
        q.Multiply(j * s);
        f.Add(q);
        m = l.x;
        l = l.y;
        o = n.x;
        n = n.y;
        s = p.x;
        p = p.y;
        h += r * (j * (0.25 * (o * o + s * o + s * s) + (m * o + m * s)) + 0.5 * m * m + (j * (0.25 * (n * n + p * n + p * p) + (l * n + l * p)) + 0.5 * l * l))
    }
    a.mass = e * g;
    f.Multiply(1 / g);
    a.center = f;
    h = e * (h - g * b2Math.b2Dot(f, f));
    a.I =
        h
};
b2Shape.PolyCentroid = function(a, b, c) {
    for (var e = 0, f = 0, g = 0, h = 1 / 3, i = 0; i < b; ++i) var j = a[i].x,
        k = a[i].y,
        l = i + 1 < b ? a[i + 1].x : a[0].x,
        m = i + 1 < b ? a[i + 1].y : a[0].y,
        o = 0.5 * ((j - 0) * (m - 0) - (k - 0) * (l - 0)),
        g = g + o,
        e = e + o * h * (0 + j + l),
        f = f + o * h * (0 + k + m);
    c.Set(e * (1 / g), f * (1 / g))
};
var b2ShapeDef = Class.create();
b2ShapeDef.prototype = {
    initialize: function() {
        this.type = b2Shape.e_unknownShape;
        this.userData = null;
        this.localPosition = new b2Vec2(0, 0);
        this.localRotation = 0;
        this.friction = 0.2;
        this.density = this.restitution = 0;
        this.categoryBits = 1;
        this.maskBits = 65535;
        this.groupIndex = 0
    },
    ComputeMass: function(a) {
        a.center = new b2Vec2(0, 0);
        if (0 == this.density) a.mass = 0, a.center.Set(0, 0), a.I = 0;
        switch (this.type) {
            case b2Shape.e_circleShape:
                a.mass = this.density * b2Settings.b2_pi * this.radius * this.radius;
                a.center.Set(0, 0);
                a.I = 0.5 * a.mass *
                    this.radius * this.radius;
                break;
            case b2Shape.e_boxShape:
                a.mass = 4 * this.density * this.extents.x * this.extents.y;
                a.center.Set(0, 0);
                a.I = a.mass / 3 * b2Math.b2Dot(this.extents, this.extents);
                break;
            case b2Shape.e_polyShape:
                b2Shape.PolyMass(a, this.vertices, this.vertexCount, this.density);
                break;
            default:
                a.mass = 0, a.center.Set(0, 0), a.I = 0
        }
    },
    type: 0,
    userData: null,
    localPosition: null,
    localRotation: null,
    friction: null,
    restitution: null,
    density: null,
    categoryBits: 0,
    maskBits: 0,
    groupIndex: 0
};
var b2BoxDef = Class.create();
Object.extend(b2BoxDef.prototype, b2ShapeDef.prototype);
Object.extend(b2BoxDef.prototype, {
    initialize: function() {
        this.type = b2Shape.e_unknownShape;
        this.userData = null;
        this.localPosition = new b2Vec2(0, 0);
        this.localRotation = 0;
        this.friction = 0.2;
        this.density = this.restitution = 0;
        this.categoryBits = 1;
        this.maskBits = 65535;
        this.groupIndex = 0;
        this.type = b2Shape.e_boxShape;
        this.extents = new b2Vec2(1, 1)
    },
    extents: null
});
var b2CircleDef = Class.create();
Object.extend(b2CircleDef.prototype, b2ShapeDef.prototype);
Object.extend(b2CircleDef.prototype, {
    initialize: function() {
        this.type = b2Shape.e_unknownShape;
        this.userData = null;
        this.localPosition = new b2Vec2(0, 0);
        this.localRotation = 0;
        this.friction = 0.2;
        this.density = this.restitution = 0;
        this.categoryBits = 1;
        this.maskBits = 65535;
        this.groupIndex = 0;
        this.type = b2Shape.e_circleShape;
        this.radius = 1
    },
    radius: null
});
var b2CircleShape = Class.create();
Object.extend(b2CircleShape.prototype, b2Shape.prototype);
Object.extend(b2CircleShape.prototype, {
    TestPoint: function(a) {
        var b = new b2Vec2;
        b.SetV(a);
        b.Subtract(this.m_position);
        return b2Math.b2Dot(b, b) <= this.m_radius * this.m_radius
    },
    initialize: function(a, b, c) {
        this.m_R = new b2Mat22;
        this.m_position = new b2Vec2;
        this.m_userData = a.userData;
        this.m_friction = a.friction;
        this.m_restitution = a.restitution;
        this.m_body = b;
        this.m_proxyId = b2Pair.b2_nullProxy;
        this.m_maxRadius = 0;
        this.m_categoryBits = a.categoryBits;
        this.m_maskBits = a.maskBits;
        this.m_groupIndex = a.groupIndex;
        this.m_localPosition =
            new b2Vec2;
        this.m_localPosition.Set(a.localPosition.x - c.x, a.localPosition.y - c.y);
        this.m_type = b2Shape.e_circleShape;
        this.m_radius = a.radius;
        this.m_R.SetM(this.m_body.m_R);
        a = this.m_R.col1.x * this.m_localPosition.x + this.m_R.col2.x * this.m_localPosition.y;
        b = this.m_R.col1.y * this.m_localPosition.x + this.m_R.col2.y * this.m_localPosition.y;
        this.m_position.x = this.m_body.m_position.x + a;
        this.m_position.y = this.m_body.m_position.y + b;
        this.m_maxRadius = Math.sqrt(a * a + b * b) + this.m_radius;
        a = new b2AABB;
        a.minVertex.Set(this.m_position.x -
            this.m_radius, this.m_position.y - this.m_radius);
        a.maxVertex.Set(this.m_position.x + this.m_radius, this.m_position.y + this.m_radius);
        b = this.m_body.m_world.m_broadPhase;
        this.m_proxyId = b.InRange(a) ? b.CreateProxy(a, this) : b2Pair.b2_nullProxy;
        this.m_proxyId == b2Pair.b2_nullProxy && this.m_body.Freeze()
    },
    Synchronize: function(a, b, c, e) {
        this.m_R.SetM(e);
        this.m_position.x = e.col1.x * this.m_localPosition.x + e.col2.x * this.m_localPosition.y + c.x;
        this.m_position.y = e.col1.y * this.m_localPosition.x + e.col2.y * this.m_localPosition.y +
            c.y;
        if (this.m_proxyId != b2Pair.b2_nullProxy) {
            var c = a.x + (b.col1.x * this.m_localPosition.x + b.col2.x * this.m_localPosition.y),
                e = a.y + (b.col1.y * this.m_localPosition.x + b.col2.y * this.m_localPosition.y),
                a = Math.min(c, this.m_position.x),
                b = Math.min(e, this.m_position.y),
                c = Math.max(c, this.m_position.x),
                f = Math.max(e, this.m_position.y),
                e = new b2AABB;
            e.minVertex.Set(a - this.m_radius, b - this.m_radius);
            e.maxVertex.Set(c + this.m_radius, f + this.m_radius);
            a = this.m_body.m_world.m_broadPhase;
            a.InRange(e) ? a.MoveProxy(this.m_proxyId,
                e) : this.m_body.Freeze()
        }
    },
    QuickSync: function(a, b) {
        this.m_R.SetM(b);
        this.m_position.x = b.col1.x * this.m_localPosition.x + b.col2.x * this.m_localPosition.y + a.x;
        this.m_position.y = b.col1.y * this.m_localPosition.x + b.col2.y * this.m_localPosition.y + a.y
    },
    ResetProxy: function(a) {
        if (this.m_proxyId != b2Pair.b2_nullProxy) {
            a.GetProxy(this.m_proxyId);
            a.DestroyProxy(this.m_proxyId);
            var b = new b2AABB;
            b.minVertex.Set(this.m_position.x - this.m_radius, this.m_position.y - this.m_radius);
            b.maxVertex.Set(this.m_position.x + this.m_radius,
                this.m_position.y + this.m_radius);
            this.m_proxyId = a.InRange(b) ? a.CreateProxy(b, this) : b2Pair.b2_nullProxy;
            this.m_proxyId == b2Pair.b2_nullProxy && this.m_body.Freeze()
        }
    },
    Support: function(a, b, c) {
        var e = Math.sqrt(a * a + b * b);
        c.Set(this.m_position.x + this.m_radius * (a / e), this.m_position.y + this.m_radius * (b / e))
    },
    m_localPosition: new b2Vec2,
    m_radius: null
});
var b2MassData = Class.create();
b2MassData.prototype = {
    mass: 0,
    center: new b2Vec2(0, 0),
    I: 0,
    initialize: function() {
        this.center = new b2Vec2(0, 0)
    }
};
var b2PolyDef = Class.create();
Object.extend(b2PolyDef.prototype, b2ShapeDef.prototype);
Object.extend(b2PolyDef.prototype, {
    initialize: function() {
        this.type = b2Shape.e_unknownShape;
        this.userData = null;
        this.localPosition = new b2Vec2(0, 0);
        this.localRotation = 0;
        this.friction = 0.2;
        this.density = this.restitution = 0;
        this.categoryBits = 1;
        this.maskBits = 65535;
        this.groupIndex = 0;
        this.vertices = Array(b2Settings.b2_maxPolyVertices);
        this.type = b2Shape.e_polyShape;
        for (var a = this.vertexCount = 0; a < b2Settings.b2_maxPolyVertices; a++) this.vertices[a] = new b2Vec2
    },
    vertices: Array(b2Settings.b2_maxPolyVertices),
    vertexCount: 0
});
var b2PolyShape = Class.create();
Object.extend(b2PolyShape.prototype, b2Shape.prototype);
Object.extend(b2PolyShape.prototype, {
    TestPoint: function(a) {
        var b = new b2Vec2;
        b.SetV(a);
        b.Subtract(this.m_position);
        b.MulTM(this.m_R);
        for (a = 0; a < this.m_vertexCount; ++a) {
            var c = new b2Vec2;
            c.SetV(b);
            c.Subtract(this.m_vertices[a]);
            if (0 < b2Math.b2Dot(this.m_normals[a], c)) return !1
        }
        return !0
    },
    initialize: function(a, b, c) {
        this.m_R = new b2Mat22;
        this.m_position = new b2Vec2;
        this.m_userData = a.userData;
        this.m_friction = a.friction;
        this.m_restitution = a.restitution;
        this.m_body = b;
        this.m_proxyId = b2Pair.b2_nullProxy;
        this.m_maxRadius =
            0;
        this.m_categoryBits = a.categoryBits;
        this.m_maskBits = a.maskBits;
        this.m_groupIndex = a.groupIndex;
        this.syncAABB = new b2AABB;
        this.syncMat = new b2Mat22;
        this.m_localCentroid = new b2Vec2;
        this.m_localOBB = new b2OBB;
        var e = 0,
            f, b = new b2AABB;
        this.m_vertices = Array(b2Settings.b2_maxPolyVertices);
        this.m_coreVertices = Array(b2Settings.b2_maxPolyVertices);
        this.m_normals = Array(b2Settings.b2_maxPolyVertices);
        this.m_type = b2Shape.e_polyShape;
        var g = new b2Mat22(a.localRotation);
        if (a.type == b2Shape.e_boxShape) {
            this.m_localCentroid.x =
                a.localPosition.x - c.x;
            this.m_localCentroid.y = a.localPosition.y - c.y;
            this.m_vertexCount = 4;
            c = a.extents.x;
            f = a.extents.y;
            var a = Math.max(0, c - 2 * b2Settings.b2_linearSlop),
                h = Math.max(0, f - 2 * b2Settings.b2_linearSlop),
                e = this.m_vertices[0] = new b2Vec2;
            e.x = g.col1.x * c + g.col2.x * f;
            e.y = g.col1.y * c + g.col2.y * f;
            e = this.m_vertices[1] = new b2Vec2;
            e.x = g.col1.x * -c + g.col2.x * f;
            e.y = g.col1.y * -c + g.col2.y * f;
            e = this.m_vertices[2] = new b2Vec2;
            e.x = g.col1.x * -c + g.col2.x * -f;
            e.y = g.col1.y * -c + g.col2.y * -f;
            e = this.m_vertices[3] = new b2Vec2;
            e.x = g.col1.x *
                c + g.col2.x * -f;
            e.y = g.col1.y * c + g.col2.y * -f;
            e = this.m_coreVertices[0] = new b2Vec2;
            e.x = g.col1.x * a + g.col2.x * h;
            e.y = g.col1.y * a + g.col2.y * h;
            e = this.m_coreVertices[1] = new b2Vec2;
            e.x = g.col1.x * -a + g.col2.x * h;
            e.y = g.col1.y * -a + g.col2.y * h;
            e = this.m_coreVertices[2] = new b2Vec2;
            e.x = g.col1.x * -a + g.col2.x * -h;
            e.y = g.col1.y * -a + g.col2.y * -h;
            e = this.m_coreVertices[3] = new b2Vec2;
            e.x = g.col1.x * a + g.col2.x * -h;
            e.y = g.col1.y * a + g.col2.y * -h
        } else {
            this.m_vertexCount = a.vertexCount;
            b2Shape.PolyCentroid(a.vertices, a.vertexCount, b2PolyShape.tempVec);
            var h = b2PolyShape.tempVec.x,
                i = b2PolyShape.tempVec.y;
            this.m_localCentroid.x = a.localPosition.x + (g.col1.x * h + g.col2.x * i) - c.x;
            this.m_localCentroid.y = a.localPosition.y + (g.col1.y * h + g.col2.y * i) - c.y;
            for (e = 0; e < this.m_vertexCount; ++e) {
                this.m_vertices[e] = new b2Vec2;
                this.m_coreVertices[e] = new b2Vec2;
                c = a.vertices[e].x - h;
                f = a.vertices[e].y - i;
                this.m_vertices[e].x = g.col1.x * c + g.col2.x * f;
                this.m_vertices[e].y = g.col1.y * c + g.col2.y * f;
                c = this.m_vertices[e].x;
                f = this.m_vertices[e].y;
                var j = Math.sqrt(c * c + f * f);
                j > Number.MIN_VALUE &&
                    (c *= 1 / j, f *= 1 / j);
                this.m_coreVertices[e].x = this.m_vertices[e].x - 2 * b2Settings.b2_linearSlop * c;
                this.m_coreVertices[e].y = this.m_vertices[e].y - 2 * b2Settings.b2_linearSlop * f
            }
        }
        a = g = Number.MAX_VALUE;
        c = -Number.MAX_VALUE;
        f = -Number.MAX_VALUE;
        for (e = this.m_maxRadius = 0; e < this.m_vertexCount; ++e) h = this.m_vertices[e], g = Math.min(g, h.x), a = Math.min(a, h.y), c = Math.max(c, h.x), f = Math.max(f, h.y), this.m_maxRadius = Math.max(this.m_maxRadius, h.Length());
        this.m_localOBB.R.SetIdentity();
        this.m_localOBB.center.Set(0.5 * (g + c), 0.5 * (a +
            f));
        this.m_localOBB.extents.Set(0.5 * (c - g), 0.5 * (f - a));
        for (e = a = g = 0; e < this.m_vertexCount; ++e) this.m_normals[e] = new b2Vec2, g = e, a = e + 1 < this.m_vertexCount ? e + 1 : 0, this.m_normals[e].x = this.m_vertices[a].y - this.m_vertices[g].y, this.m_normals[e].y = -(this.m_vertices[a].x - this.m_vertices[g].x), this.m_normals[e].Normalize();
        for (e = 0; e < this.m_vertexCount; ++e);
        this.m_R.SetM(this.m_body.m_R);
        this.m_position.x = this.m_body.m_position.x + (this.m_R.col1.x * this.m_localCentroid.x + this.m_R.col2.x * this.m_localCentroid.y);
        this.m_position.y =
            this.m_body.m_position.y + (this.m_R.col1.y * this.m_localCentroid.x + this.m_R.col2.y * this.m_localCentroid.y);
        b2PolyShape.tAbsR.col1.x = this.m_R.col1.x * this.m_localOBB.R.col1.x + this.m_R.col2.x * this.m_localOBB.R.col1.y;
        b2PolyShape.tAbsR.col1.y = this.m_R.col1.y * this.m_localOBB.R.col1.x + this.m_R.col2.y * this.m_localOBB.R.col1.y;
        b2PolyShape.tAbsR.col2.x = this.m_R.col1.x * this.m_localOBB.R.col2.x + this.m_R.col2.x * this.m_localOBB.R.col2.y;
        b2PolyShape.tAbsR.col2.y = this.m_R.col1.y * this.m_localOBB.R.col2.x + this.m_R.col2.y *
            this.m_localOBB.R.col2.y;
        b2PolyShape.tAbsR.Abs();
        c = b2PolyShape.tAbsR.col1.x * this.m_localOBB.extents.x + b2PolyShape.tAbsR.col2.x * this.m_localOBB.extents.y;
        f = b2PolyShape.tAbsR.col1.y * this.m_localOBB.extents.x + b2PolyShape.tAbsR.col2.y * this.m_localOBB.extents.y;
        e = this.m_position.x + (this.m_R.col1.x * this.m_localOBB.center.x + this.m_R.col2.x * this.m_localOBB.center.y);
        g = this.m_position.y + (this.m_R.col1.y * this.m_localOBB.center.x + this.m_R.col2.y * this.m_localOBB.center.y);
        b.minVertex.x = e - c;
        b.minVertex.y = g - f;
        b.maxVertex.x = e + c;
        b.maxVertex.y = g + f;
        e = this.m_body.m_world.m_broadPhase;
        this.m_proxyId = e.InRange(b) ? e.CreateProxy(b, this) : b2Pair.b2_nullProxy;
        this.m_proxyId == b2Pair.b2_nullProxy && this.m_body.Freeze()
    },
    syncAABB: new b2AABB,
    syncMat: new b2Mat22,
    Synchronize: function(a, b, c, e) {
        this.m_R.SetM(e);
        this.m_position.x = this.m_body.m_position.x + (e.col1.x * this.m_localCentroid.x + e.col2.x * this.m_localCentroid.y);
        this.m_position.y = this.m_body.m_position.y + (e.col1.y * this.m_localCentroid.x + e.col2.y * this.m_localCentroid.y);
        if (this.m_proxyId != b2Pair.b2_nullProxy) {
            var f, g;
            f = b.col1;
            g = b.col2;
            var h = this.m_localOBB.R.col1,
                i = this.m_localOBB.R.col2;
            this.syncMat.col1.x = f.x * h.x + g.x * h.y;
            this.syncMat.col1.y = f.y * h.x + g.y * h.y;
            this.syncMat.col2.x = f.x * i.x + g.x * i.y;
            this.syncMat.col2.y = f.y * i.x + g.y * i.y;
            this.syncMat.Abs();
            f = this.m_localCentroid.x + this.m_localOBB.center.x;
            g = this.m_localCentroid.y + this.m_localOBB.center.y;
            h = a.x + (b.col1.x * f + b.col2.x * g);
            a = a.y + (b.col1.y * f + b.col2.y * g);
            f = this.syncMat.col1.x * this.m_localOBB.extents.x + this.syncMat.col2.x *
                this.m_localOBB.extents.y;
            g = this.syncMat.col1.y * this.m_localOBB.extents.x + this.syncMat.col2.y * this.m_localOBB.extents.y;
            this.syncAABB.minVertex.x = h - f;
            this.syncAABB.minVertex.y = a - g;
            this.syncAABB.maxVertex.x = h + f;
            this.syncAABB.maxVertex.y = a + g;
            f = e.col1;
            g = e.col2;
            h = this.m_localOBB.R.col1;
            i = this.m_localOBB.R.col2;
            this.syncMat.col1.x = f.x * h.x + g.x * h.y;
            this.syncMat.col1.y = f.y * h.x + g.y * h.y;
            this.syncMat.col2.x = f.x * i.x + g.x * i.y;
            this.syncMat.col2.y = f.y * i.x + g.y * i.y;
            this.syncMat.Abs();
            f = this.m_localCentroid.x + this.m_localOBB.center.x;
            g = this.m_localCentroid.y + this.m_localOBB.center.y;
            h = c.x + (e.col1.x * f + e.col2.x * g);
            a = c.y + (e.col1.y * f + e.col2.y * g);
            f = this.syncMat.col1.x * this.m_localOBB.extents.x + this.syncMat.col2.x * this.m_localOBB.extents.y;
            g = this.syncMat.col1.y * this.m_localOBB.extents.x + this.syncMat.col2.y * this.m_localOBB.extents.y;
            this.syncAABB.minVertex.x = Math.min(this.syncAABB.minVertex.x, h - f);
            this.syncAABB.minVertex.y = Math.min(this.syncAABB.minVertex.y, a - g);
            this.syncAABB.maxVertex.x = Math.max(this.syncAABB.maxVertex.x, h + f);
            this.syncAABB.maxVertex.y =
                Math.max(this.syncAABB.maxVertex.y, a + g);
            c = this.m_body.m_world.m_broadPhase;
            c.InRange(this.syncAABB) ? c.MoveProxy(this.m_proxyId, this.syncAABB) : this.m_body.Freeze()
        }
    },
    QuickSync: function(a, b) {
        this.m_R.SetM(b);
        this.m_position.x = a.x + (b.col1.x * this.m_localCentroid.x + b.col2.x * this.m_localCentroid.y);
        this.m_position.y = a.y + (b.col1.y * this.m_localCentroid.x + b.col2.y * this.m_localCentroid.y)
    },
    ResetProxy: function(a) {
        if (this.m_proxyId != b2Pair.b2_nullProxy) {
            a.GetProxy(this.m_proxyId);
            a.DestroyProxy(this.m_proxyId);
            var b = b2Math.b2MulMM(this.m_R, this.m_localOBB.R),
                b = b2Math.b2AbsM(b),
                b = b2Math.b2MulMV(b, this.m_localOBB.extents),
                c = b2Math.b2MulMV(this.m_R, this.m_localOBB.center);
            c.Add(this.m_position);
            var e = new b2AABB;
            e.minVertex.SetV(c);
            e.minVertex.Subtract(b);
            e.maxVertex.SetV(c);
            e.maxVertex.Add(b);
            this.m_proxyId = a.InRange(e) ? a.CreateProxy(e, this) : b2Pair.b2_nullProxy;
            this.m_proxyId == b2Pair.b2_nullProxy && this.m_body.Freeze()
        }
    },
    Support: function(a, b, c) {
        for (var e = a * this.m_R.col1.x + b * this.m_R.col1.y, a = a * this.m_R.col2.x +
                b * this.m_R.col2.y, b = 0, f = this.m_coreVertices[0].x * e + this.m_coreVertices[0].y * a, g = 1; g < this.m_vertexCount; ++g) {
            var h = this.m_coreVertices[g].x * e + this.m_coreVertices[g].y * a;
            h > f && (b = g, f = h)
        }
        c.Set(this.m_position.x + (this.m_R.col1.x * this.m_coreVertices[b].x + this.m_R.col2.x * this.m_coreVertices[b].y), this.m_position.y + (this.m_R.col1.y * this.m_coreVertices[b].x + this.m_R.col2.y * this.m_coreVertices[b].y))
    },
    m_localCentroid: new b2Vec2,
    m_localOBB: new b2OBB,
    m_vertices: null,
    m_coreVertices: null,
    m_vertexCount: 0,
    m_normals: null
});
b2PolyShape.tempVec = new b2Vec2;
b2PolyShape.tAbsR = new b2Mat22;
var b2Body = Class.create();
b2Body.prototype = {
    SetOriginPosition: function(a, b) {
        if (!this.IsFrozen()) {
            this.m_rotation = b;
            this.m_R.Set(this.m_rotation);
            this.m_position = b2Math.AddVV(a, b2Math.b2MulMV(this.m_R, this.m_center));
            this.m_position0.SetV(this.m_position);
            this.m_rotation0 = this.m_rotation;
            for (var c = this.m_shapeList; null != c; c = c.m_next) c.Synchronize(this.m_position, this.m_R, this.m_position, this.m_R);
            this.m_world.m_broadPhase.Commit()
        }
    },
    GetOriginPosition: function() {
        return b2Math.SubtractVV(this.m_position, b2Math.b2MulMV(this.m_R,
            this.m_center))
    },
    SetCenterPosition: function(a, b) {
        if (!this.IsFrozen()) {
            this.m_rotation = b;
            this.m_R.Set(this.m_rotation);
            this.m_position.SetV(a);
            this.m_position0.SetV(this.m_position);
            this.m_rotation0 = this.m_rotation;
            for (var c = this.m_shapeList; null != c; c = c.m_next) c.Synchronize(this.m_position, this.m_R, this.m_position, this.m_R);
            this.m_world.m_broadPhase.Commit()
        }
    },
    GetCenterPosition: function() {
        return this.m_position
    },
    GetRotation: function() {
        return this.m_rotation
    },
    GetRotationMatrix: function() {
        return this.m_R
    },
    SetLinearVelocity: function(a) {
        this.m_linearVelocity.SetV(a)
    },
    GetLinearVelocity: function() {
        return this.m_linearVelocity
    },
    SetAngularVelocity: function(a) {
        this.m_angularVelocity = a
    },
    GetAngularVelocity: function() {
        return this.m_angularVelocity
    },
    ApplyForce: function(a, b) {
        !1 == this.IsSleeping() && (this.m_force.Add(a), this.m_torque += b2Math.b2CrossVV(b2Math.SubtractVV(b, this.m_position), a))
    },
    ApplyTorque: function(a) {
        !1 == this.IsSleeping() && (this.m_torque += a)
    },
    ApplyImpulse: function(a, b) {
        !1 == this.IsSleeping() && (this.m_linearVelocity.Add(b2Math.MulFV(this.m_invMass,
            a)), this.m_angularVelocity += this.m_invI * b2Math.b2CrossVV(a, b2Math.SubtractVV(b, this.m_position)))
    },
    GetMass: function() {
        return this.m_mass
    },
    GetInertia: function() {
        return this.m_I
    },
    GetWorldPoint: function(a) {
        return b2Math.AddVV(this.m_position, b2Math.b2MulMV(this.m_R, a))
    },
    GetWorldVector: function(a) {
        return b2Math.b2MulMV(this.m_R, a)
    },
    GetLocalPoint: function(a) {
        return b2Math.b2MulTMV(this.m_R, b2Math.SubtractVV(a, this.m_position))
    },
    GetLocalVector: function(a) {
        return b2Math.b2MulTMV(this.m_R, a)
    },
    IsStatic: function() {
        return (this.m_flags &
            b2Body.e_staticFlag) == b2Body.e_staticFlag
    },
    IsFrozen: function() {
        return (this.m_flags & b2Body.e_frozenFlag) == b2Body.e_frozenFlag
    },
    IsSleeping: function() {
        return (this.m_flags & b2Body.e_sleepFlag) == b2Body.e_sleepFlag
    },
    AllowSleeping: function(a) {
        a ? this.m_flags |= b2Body.e_allowSleepFlag : (this.m_flags &= ~b2Body.e_allowSleepFlag, this.WakeUp())
    },
    WakeUp: function() {
        this.m_flags &= ~b2Body.e_sleepFlag;
        this.m_sleepTime = 0
    },
    GetShapeList: function() {
        return this.m_shapeList
    },
    GetContactList: function() {
        return this.m_contactList
    },
    GetJointList: function() {
        return this.m_jointList
    },
    GetNext: function() {
        return this.m_next
    },
    GetUserData: function() {
        return this.m_userData
    },
    initialize: function(a, b) {
        this.sMat0 = new b2Mat22;
        this.m_position = new b2Vec2;
        this.m_R = new b2Mat22(0);
        this.m_position0 = new b2Vec2;
        var c = 0,
            e, f;
        this.m_flags = 0;
        this.m_position.SetV(a.position);
        this.m_rotation = a.rotation;
        this.m_R.Set(this.m_rotation);
        this.m_position0.SetV(this.m_position);
        this.m_rotation0 = this.m_rotation;
        this.m_world = b;
        this.m_linearDamping = b2Math.b2Clamp(1 -
            a.linearDamping, 0, 1);
        this.m_angularDamping = b2Math.b2Clamp(1 - a.angularDamping, 0, 1);
        this.m_force = new b2Vec2(0, 0);
        this.m_mass = this.m_torque = 0;
        for (var g = Array(b2Settings.b2_maxShapesPerBody), c = 0; c < b2Settings.b2_maxShapesPerBody; c++) g[c] = new b2MassData;
        this.m_shapeCount = 0;
        this.m_center = new b2Vec2(0, 0);
        for (c = 0; c < b2Settings.b2_maxShapesPerBody; ++c) {
            e = a.shapes[c];
            if (null == e) break;
            f = g[c];
            e.ComputeMass(f);
            this.m_mass += f.mass;
            this.m_center.x += f.mass * (e.localPosition.x + f.center.x);
            this.m_center.y += f.mass * (e.localPosition.y +
                f.center.y);
            ++this.m_shapeCount
        }
        0 < this.m_mass ? (this.m_center.Multiply(1 / this.m_mass), this.m_position.Add(b2Math.b2MulMV(this.m_R, this.m_center))) : this.m_flags |= b2Body.e_staticFlag;
        for (c = this.m_I = 0; c < this.m_shapeCount; ++c) e = a.shapes[c], f = g[c], this.m_I += f.I, e = b2Math.SubtractVV(b2Math.AddVV(e.localPosition, f.center), this.m_center), this.m_I += f.mass * b2Math.b2Dot(e, e);
        this.m_invMass = 0 < this.m_mass ? 1 / this.m_mass : 0;
        this.m_invI = 0 < this.m_I && !1 == a.preventRotation ? 1 / this.m_I : this.m_I = 0;
        this.m_linearVelocity = b2Math.AddVV(a.linearVelocity,
            b2Math.b2CrossFV(a.angularVelocity, this.m_center));
        this.m_angularVelocity = a.angularVelocity;
        this.m_shapeList = this.m_next = this.m_prev = this.m_contactList = this.m_jointList = null;
        for (c = 0; c < this.m_shapeCount; ++c) e = a.shapes[c], f = b2Shape.Create(e, this, this.m_center), f.m_next = this.m_shapeList, this.m_shapeList = f;
        this.m_sleepTime = 0;
        a.allowSleep && (this.m_flags |= b2Body.e_allowSleepFlag);
        a.isSleeping && (this.m_flags |= b2Body.e_sleepFlag);
        if (this.m_flags & b2Body.e_sleepFlag || 0 == this.m_invMass) this.m_linearVelocity.Set(0,
            0), this.m_angularVelocity = 0;
        this.m_userData = a.userData
    },
    Destroy: function() {
        for (var a = this.m_shapeList; a;) {
            var b = a,
                a = a.m_next;
            b2Shape.Destroy(b)
        }
    },
    sMat0: new b2Mat22,
    SynchronizeShapes: function() {
        this.sMat0.Set(this.m_rotation0);
        for (var a = this.m_shapeList; null != a; a = a.m_next) a.Synchronize(this.m_position0, this.sMat0, this.m_position, this.m_R)
    },
    QuickSyncShapes: function() {
        for (var a = this.m_shapeList; null != a; a = a.m_next) a.QuickSync(this.m_position, this.m_R)
    },
    IsConnected: function(a) {
        for (var b = this.m_jointList; null !=
            b; b = b.next)
            if (b.other == a) return !1 == b.joint.m_collideConnected;
        return !1
    },
    Freeze: function() {
        this.m_flags |= b2Body.e_frozenFlag;
        this.m_linearVelocity.SetZero();
        this.m_angularVelocity = 0;
        for (var a = this.m_shapeList; null != a; a = a.m_next) a.DestroyProxy()
    },
    m_flags: 0,
    m_position: new b2Vec2,
    m_rotation: null,
    m_R: new b2Mat22(0),
    m_position0: new b2Vec2,
    m_rotation0: null,
    m_linearVelocity: null,
    m_angularVelocity: null,
    m_force: null,
    m_torque: null,
    m_center: null,
    m_world: null,
    m_prev: null,
    m_next: null,
    m_shapeList: null,
    m_shapeCount: 0,
    m_jointList: null,
    m_contactList: null,
    m_mass: null,
    m_invMass: null,
    m_I: null,
    m_invI: null,
    m_linearDamping: null,
    m_angularDamping: null,
    m_sleepTime: null,
    m_userData: null
};
b2Body.e_staticFlag = 1;
b2Body.e_frozenFlag = 2;
b2Body.e_islandFlag = 4;
b2Body.e_sleepFlag = 8;
b2Body.e_allowSleepFlag = 16;
b2Body.e_destroyFlag = 32;
var b2BodyDef = Class.create();
b2BodyDef.prototype = {
    initialize: function() {
        this.shapes = [];
        this.userData = null;
        for (var a = 0; a < b2Settings.b2_maxShapesPerBody; a++) this.shapes[a] = null;
        this.position = new b2Vec2(0, 0);
        this.rotation = 0;
        this.linearVelocity = new b2Vec2(0, 0);
        this.angularDamping = this.linearDamping = this.angularVelocity = 0;
        this.allowSleep = !0;
        this.preventRotation = this.isSleeping = !1
    },
    userData: null,
    shapes: [],
    position: null,
    rotation: null,
    linearVelocity: null,
    angularVelocity: null,
    linearDamping: null,
    angularDamping: null,
    allowSleep: null,
    isSleeping: null,
    preventRotation: null,
    AddShape: function(a) {
        for (var b = 0; b < b2Settings.b2_maxShapesPerBody; ++b)
            if (null == this.shapes[b]) {
                this.shapes[b] = a;
                break
            }
    }
};
var b2CollisionFilter = Class.create();
b2CollisionFilter.prototype = {
    ShouldCollide: function(a, b) {
        return a.m_groupIndex == b.m_groupIndex && 0 != a.m_groupIndex ? 0 < a.m_groupIndex : 0 != (a.m_maskBits & b.m_categoryBits) && 0 != (a.m_categoryBits & b.m_maskBits)
    },
    initialize: function() {}
};
b2CollisionFilter.b2_defaultFilter = new b2CollisionFilter;
var b2Island = Class.create();
b2Island.prototype = {
    initialize: function(a, b, c, e) {
        var f = 0;
        this.m_bodyCapacity = a;
        this.m_contactCapacity = b;
        this.m_jointCapacity = c;
        this.m_jointCount = this.m_contactCount = this.m_bodyCount = 0;
        this.m_bodies = Array(a);
        for (f = 0; f < a; f++) this.m_bodies[f] = null;
        this.m_contacts = Array(b);
        for (f = 0; f < b; f++) this.m_contacts[f] = null;
        this.m_joints = Array(c);
        for (f = 0; f < c; f++) this.m_joints[f] = null;
        this.m_allocator = e
    },
    Clear: function() {
        this.m_jointCount = this.m_contactCount = this.m_bodyCount = 0
    },
    Solve: function(a, b) {
        for (var c = 0, e, c =
                0; c < this.m_bodyCount; ++c)
            if (e = this.m_bodies[c], 0 != e.m_invMass) e.m_linearVelocity.Add(b2Math.MulFV(a.dt, b2Math.AddVV(b, b2Math.MulFV(e.m_invMass, e.m_force)))), e.m_angularVelocity += a.dt * e.m_invI * e.m_torque, e.m_linearVelocity.Multiply(e.m_linearDamping), e.m_angularVelocity *= e.m_angularDamping, e.m_position0.SetV(e.m_position), e.m_rotation0 = e.m_rotation;
        var f = new b2ContactSolver(this.m_contacts, this.m_contactCount, this.m_allocator);
        f.PreSolve();
        for (c = 0; c < this.m_jointCount; ++c) this.m_joints[c].PrepareVelocitySolver();
        for (c = 0; c < a.iterations; ++c) {
            f.SolveVelocityConstraints();
            for (e = 0; e < this.m_jointCount; ++e) this.m_joints[e].SolveVelocityConstraints(a)
        }
        for (c = 0; c < this.m_bodyCount; ++c) e = this.m_bodies[c], 0 != e.m_invMass && (e.m_position.x += a.dt * e.m_linearVelocity.x, e.m_position.y += a.dt * e.m_linearVelocity.y, e.m_rotation += a.dt * e.m_angularVelocity, e.m_R.Set(e.m_rotation));
        for (c = 0; c < this.m_jointCount; ++c) this.m_joints[c].PreparePositionSolver();
        if (b2World.s_enablePositionCorrection)
            for (b2Island.m_positionIterationCount = 0; b2Island.m_positionIterationCount <
                a.iterations; ++b2Island.m_positionIterationCount) {
                e = f.SolvePositionConstraints(b2Settings.b2_contactBaumgarte);
                for (var g = !0, c = 0; c < this.m_jointCount; ++c) var h = this.m_joints[c].SolvePositionConstraints(),
                    g = g && h;
                if (e && g) break
            }
        f.PostSolve();
        for (c = 0; c < this.m_bodyCount; ++c)
            if (e = this.m_bodies[c], 0 != e.m_invMass) e.m_R.Set(e.m_rotation), e.SynchronizeShapes(), e.m_force.Set(0, 0), e.m_torque = 0
    },
    UpdateSleep: function(a) {
        for (var b = 0, c, e = Number.MAX_VALUE, f = b2Settings.b2_linearSleepTolerance * b2Settings.b2_linearSleepTolerance,
                g = b2Settings.b2_angularSleepTolerance * b2Settings.b2_angularSleepTolerance, b = 0; b < this.m_bodyCount; ++b)
            if (c = this.m_bodies[b], 0 != c.m_invMass) {
                if (0 == (c.m_flags & b2Body.e_allowSleepFlag)) e = c.m_sleepTime = 0;
                0 == (c.m_flags & b2Body.e_allowSleepFlag) || c.m_angularVelocity * c.m_angularVelocity > g || b2Math.b2Dot(c.m_linearVelocity, c.m_linearVelocity) > f ? e = c.m_sleepTime = 0 : (c.m_sleepTime += a, e = b2Math.b2Min(e, c.m_sleepTime))
            }
        if (e >= b2Settings.b2_timeToSleep)
            for (b = 0; b < this.m_bodyCount; ++b)
                if (c = this.m_bodies[b], c.m_flags |=
                    b2Body.e_sleepFlag, c.onSleepCallback) c.onSleepCallback()
    },
    AddBody: function(a) {
        this.m_bodies[this.m_bodyCount++] = a
    },
    AddContact: function(a) {
        this.m_contacts[this.m_contactCount++] = a
    },
    AddJoint: function(a) {
        this.m_joints[this.m_jointCount++] = a
    },
    m_allocator: null,
    m_bodies: null,
    m_contacts: null,
    m_joints: null,
    m_bodyCount: 0,
    m_jointCount: 0,
    m_contactCount: 0,
    m_bodyCapacity: 0,
    m_contactCapacity: 0,
    m_jointCapacity: 0,
    m_positionError: null
};
b2Island.m_positionIterationCount = 0;
var b2TimeStep = Class.create();
b2TimeStep.prototype = {
    dt: null,
    inv_dt: null,
    iterations: 0,
    initialize: function() {}
};
var b2ContactNode = Class.create();
b2ContactNode.prototype = {
    other: null,
    contact: null,
    prev: null,
    next: null,
    initialize: function() {}
};

function invokeConactCallback(a, b, c) {
    a && a.contactCallback && a.contactCallback(c, b)
}
var b2Contact = Class.create();
b2Contact.prototype = {
    GetManifolds: function() {
        return null
    },
    GetManifoldCount: function() {
        return this.m_manifoldCount
    },
    GetNext: function() {
        return this.m_next
    },
    GetShape1: function() {
        return this.m_shape1
    },
    GetShape2: function() {
        return this.m_shape2
    },
    initialize: function(a, b) {
        this.m_node1 = new b2ContactNode;
        this.m_node2 = new b2ContactNode;
        this.m_flags = 0;
        !a || !b ? this.m_shape2 = this.m_shape1 = null : (this.m_shape1 = a, this.m_shape2 = b, this.m_manifoldCount = 0, this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction),
            this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution), this.m_next = this.m_prev = null, this.m_node1.contact = null, this.m_node1.prev = null, this.m_node1.next = null, this.m_node1.other = null, this.m_node2.contact = null, this.m_node2.prev = null, this.m_node2.next = null, this.m_node2.other = null)
    },
    Evaluate: function() {},
    m_flags: 0,
    m_prev: null,
    m_next: null,
    m_node1: new b2ContactNode,
    m_node2: new b2ContactNode,
    m_shape1: null,
    m_shape2: null,
    m_manifoldCount: 0,
    m_friction: null,
    m_restitution: null
};
b2Contact.e_islandFlag = 1;
b2Contact.e_destroyFlag = 2;
b2Contact.AddType = function(a, b, c, e) {
    b2Contact.s_registers[c][e].createFcn = a;
    b2Contact.s_registers[c][e].destroyFcn = b;
    b2Contact.s_registers[c][e].primary = !0;
    if (c != e) b2Contact.s_registers[e][c].createFcn = a, b2Contact.s_registers[e][c].destroyFcn = b, b2Contact.s_registers[e][c].primary = !1
};
b2Contact.InitializeRegisters = function() {
    b2Contact.s_registers = Array(b2Shape.e_shapeTypeCount);
    for (var a = 0; a < b2Shape.e_shapeTypeCount; a++) {
        b2Contact.s_registers[a] = Array(b2Shape.e_shapeTypeCount);
        for (var b = 0; b < b2Shape.e_shapeTypeCount; b++) b2Contact.s_registers[a][b] = new b2ContactRegister
    }
    b2Contact.AddType(b2CircleContact.Create, b2CircleContact.Destroy, b2Shape.e_circleShape, b2Shape.e_circleShape);
    b2Contact.AddType(b2PolyAndCircleContact.Create, b2PolyAndCircleContact.Destroy, b2Shape.e_polyShape, b2Shape.e_circleShape);
    b2Contact.AddType(b2PolyContact.Create, b2PolyContact.Destroy, b2Shape.e_polyShape, b2Shape.e_polyShape)
};
b2Contact.Create = function(a, b, c) {
    if (!1 == b2Contact.s_initialized) b2Contact.InitializeRegisters(), b2Contact.s_initialized = !0;
    var e = a.m_type,
        f = b.m_type,
        g = b2Contact.s_registers[e][f].createFcn;
    if (g) {
        if (b2Contact.s_registers[e][f].primary) return g(a, b, c);
        a = g(b, a, c);
        for (b = 0; b < a.GetManifoldCount(); ++b) c = a.GetManifolds()[b], c.normal = c.normal.Negative();
        return a
    }
    return null
};
b2Contact.Destroy = function(a, b) {
    0 < a.GetManifoldCount() && (a.m_shape1.m_body.WakeUp(), a.m_shape2.m_body.WakeUp());
    var c = b2Contact.s_registers[a.m_shape1.m_type][a.m_shape2.m_type].destroyFcn;
    c(a, b)
};
b2Contact.s_registers = null;
b2Contact.s_initialized = !1;
var b2ContactConstraint = Class.create();
b2ContactConstraint.prototype = {
    initialize: function() {
        this.normal = new b2Vec2;
        this.points = Array(b2Settings.b2_maxManifoldPoints);
        for (var a = 0; a < b2Settings.b2_maxManifoldPoints; a++) this.points[a] = new b2ContactConstraintPoint
    },
    points: null,
    normal: new b2Vec2,
    manifold: null,
    body1: null,
    body2: null,
    friction: null,
    restitution: null,
    pointCount: 0
};
var b2ContactConstraintPoint = Class.create();
b2ContactConstraintPoint.prototype = {
    localAnchor1: new b2Vec2,
    localAnchor2: new b2Vec2,
    normalImpulse: null,
    tangentImpulse: null,
    positionImpulse: null,
    normalMass: null,
    tangentMass: null,
    separation: null,
    velocityBias: null,
    initialize: function() {
        this.localAnchor1 = new b2Vec2;
        this.localAnchor2 = new b2Vec2
    }
};
var b2ContactRegister = Class.create();
b2ContactRegister.prototype = {
    createFcn: null,
    destroyFcn: null,
    primary: null,
    initialize: function() {}
};
var b2ContactSolver = Class.create();
b2ContactSolver.prototype = {
    initialize: function(a, b, c) {
        this.m_constraints = [];
        this.m_allocator = c;
        for (var c = 0, e, f, c = this.m_constraintCount = 0; c < b; ++c) this.m_constraintCount += a[c].GetManifoldCount();
        for (c = 0; c < this.m_constraintCount; c++) this.m_constraints[c] = new b2ContactConstraint;
        for (var g = 0, c = 0; c < b; ++c)
            for (var h = a[c], i = h.m_shape1.m_body, j = h.m_shape2.m_body, k = h.GetManifoldCount(), l = h.GetManifolds(), m = h.m_friction, h = h.m_restitution, o = i.m_linearVelocity.x, n = i.m_linearVelocity.y, p = j.m_linearVelocity.x, r =
                    j.m_linearVelocity.y, s = i.m_angularVelocity, q = j.m_angularVelocity, t = 0; t < k; ++t) {
                var z = l[t],
                    v = z.normal.x,
                    C = z.normal.y,
                    A = this.m_constraints[g];
                A.body1 = i;
                A.body2 = j;
                A.manifold = z;
                A.normal.x = v;
                A.normal.y = C;
                A.pointCount = z.pointCount;
                A.friction = m;
                A.restitution = h;
                for (var u = 0; u < A.pointCount; ++u) {
                    var y = z.points[u],
                        x = A.points[u];
                    x.normalImpulse = y.normalImpulse;
                    x.tangentImpulse = y.tangentImpulse;
                    x.separation = y.separation;
                    var B = y.position.x - i.m_position.x,
                        E = y.position.y - i.m_position.y,
                        D = y.position.x - j.m_position.x,
                        y = y.position.y - j.m_position.y;
                    e = x.localAnchor1;
                    f = i.m_R;
                    e.x = B * f.col1.x + E * f.col1.y;
                    e.y = B * f.col2.x + E * f.col2.y;
                    e = x.localAnchor2;
                    f = j.m_R;
                    e.x = D * f.col1.x + y * f.col1.y;
                    e.y = D * f.col2.x + y * f.col2.y;
                    e = B * B + E * E;
                    f = D * D + y * y;
                    var F = B * v + E * C,
                        G = D * v + y * C,
                        H = i.m_invMass + j.m_invMass,
                        H = H + (i.m_invI * (e - F * F) + j.m_invI * (f - G * G));
                    x.normalMass = 1 / H;
                    G = C;
                    H = -v;
                    F = B * G + E * H;
                    G = D * G + y * H;
                    H = i.m_invMass + j.m_invMass;
                    H += i.m_invI * (e - F * F) + j.m_invI * (f - G * G);
                    x.tangentMass = 1 / H;
                    x.velocityBias = 0;
                    if (0 < x.separation) x.velocityBias = -60 * x.separation;
                    B = A.normal.x *
                        (p + -q * y - o - -s * E) + A.normal.y * (r + q * D - n - s * B);
                    B < -b2Settings.b2_velocityThreshold && (x.velocityBias += -A.restitution * B)
                }++g
            }
    },
    PreSolve: function() {
        for (var a, b, c = 0; c < this.m_constraintCount; ++c) {
            var e = this.m_constraints[c],
                f = e.body1,
                g = e.body2,
                h = f.m_invMass,
                i = f.m_invI,
                j = g.m_invMass,
                k = g.m_invI,
                l = e.normal.x,
                m = e.normal.y,
                o = m,
                n = -l,
                p = 0,
                r = 0;
            if (b2World.s_enableWarmStarting) {
                r = e.pointCount;
                for (p = 0; p < r; ++p) {
                    var s = e.points[p],
                        q = s.normalImpulse * l + s.tangentImpulse * o,
                        t = s.normalImpulse * m + s.tangentImpulse * n;
                    b = f.m_R;
                    a = s.localAnchor1;
                    var z = b.col1.x * a.x + b.col2.x * a.y,
                        v = b.col1.y * a.x + b.col2.y * a.y;
                    b = g.m_R;
                    a = s.localAnchor2;
                    var C = b.col1.x * a.x + b.col2.x * a.y;
                    a = b.col1.y * a.x + b.col2.y * a.y;
                    f.m_angularVelocity -= i * (z * t - v * q);
                    f.m_linearVelocity.x -= h * q;
                    f.m_linearVelocity.y -= h * t;
                    g.m_angularVelocity += k * (C * t - a * q);
                    g.m_linearVelocity.x += j * q;
                    g.m_linearVelocity.y += j * t;
                    s.positionImpulse = 0
                }
            } else {
                r = e.pointCount;
                for (p = 0; p < r; ++p) f = e.points[p], f.normalImpulse = 0, f.tangentImpulse = 0, f.positionImpulse = 0
            }
        }
    },
    SolveVelocityConstraints: function() {
        for (var a = 0, b, c, e, f,
                g, h, i, j, k = 0; k < this.m_constraintCount; ++k) {
            for (var l = this.m_constraints[k], m = l.body1, o = l.body2, n = m.m_angularVelocity, p = m.m_linearVelocity, r = o.m_angularVelocity, s = o.m_linearVelocity, q = m.m_invMass, t = m.m_invI, z = o.m_invMass, v = o.m_invI, C = l.normal.x, A = l.normal.y, u = A, y = -C, x = l.pointCount, a = 0; a < x; ++a) b = l.points[a], g = m.m_R, h = b.localAnchor1, c = g.col1.x * h.x + g.col2.x * h.y, e = g.col1.y * h.x + g.col2.y * h.y, g = o.m_R, h = b.localAnchor2, f = g.col1.x * h.x + g.col2.x * h.y, g = g.col1.y * h.x + g.col2.y * h.y, h = s.x + -r * g - p.x - -n * e, i = s.y + r * f - p.y -
                n * c, h = -b.normalMass * (h * C + i * A - b.velocityBias), i = b2Math.b2Max(b.normalImpulse + h, 0), h = i - b.normalImpulse, j = h * C, h *= A, p.x -= q * j, p.y -= q * h, n -= t * (c * h - e * j), s.x += z * j, s.y += z * h, r += v * (f * h - g * j), b.normalImpulse = i, h = s.x + -r * g - p.x - -n * e, i = s.y + r * f - p.y - n * c, h = b.tangentMass * -(h * u + i * y), i = l.friction * b.normalImpulse, i = b2Math.b2Clamp(b.tangentImpulse + h, -i, i), h = i - b.tangentImpulse, j = h * u, h *= y, p.x -= q * j, p.y -= q * h, n -= t * (c * h - e * j), s.x += z * j, s.y += z * h, r += v * (f * h - g * j), b.tangentImpulse = i;
            m.m_angularVelocity = n;
            o.m_angularVelocity = r
        }
    },
    SolvePositionConstraints: function(a) {
        for (var b =
                0, c, e, f = 0; f < this.m_constraintCount; ++f) {
            for (var g = this.m_constraints[f], h = g.body1, i = g.body2, j = h.m_position, k = h.m_rotation, l = i.m_position, m = i.m_rotation, o = h.m_invMass, n = h.m_invI, p = i.m_invMass, r = i.m_invI, s = g.normal.x, q = g.normal.y, t = g.pointCount, z = 0; z < t; ++z) {
                var v = g.points[z];
                c = h.m_R;
                e = v.localAnchor1;
                var C = c.col1.x * e.x + c.col2.x * e.y,
                    A = c.col1.y * e.x + c.col2.y * e.y;
                c = i.m_R;
                e = v.localAnchor2;
                var u = c.col1.x * e.x + c.col2.x * e.y;
                c = c.col1.y * e.x + c.col2.y * e.y;
                e = (l.x + u - (j.x + C)) * s + (l.y + c - (j.y + A)) * q + v.separation;
                b = b2Math.b2Min(b,
                    e);
                e = a * b2Math.b2Clamp(e + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0);
                e *= -v.normalMass;
                var y = v.positionImpulse;
                v.positionImpulse = b2Math.b2Max(y + e, 0);
                e = v.positionImpulse - y;
                v = e * s;
                e *= q;
                j.x -= o * v;
                j.y -= o * e;
                k -= n * (C * e - A * v);
                h.m_R.Set(k);
                l.x += p * v;
                l.y += p * e;
                m += r * (u * e - c * v);
                i.m_R.Set(m)
            }
            h.m_rotation = k;
            i.m_rotation = m
        }
        return b >= -b2Settings.b2_linearSlop
    },
    PostSolve: function() {
        for (var a = 0; a < this.m_constraintCount; ++a)
            for (var b = this.m_constraints[a], c = b.manifold, e = 0; e < b.pointCount; ++e) {
                var f = c.points[e],
                    g = b.points[e];
                f.normalImpulse = g.normalImpulse;
                f.tangentImpulse = g.tangentImpulse
            }
    },
    m_allocator: null,
    m_constraints: [],
    m_constraintCount: 0
};
var b2CircleContact = Class.create();
Object.extend(b2CircleContact.prototype, b2Contact.prototype);
Object.extend(b2CircleContact.prototype, {
    initialize: function(a, b) {
        this.m_node1 = new b2ContactNode;
        this.m_node2 = new b2ContactNode;
        this.m_flags = 0;
        !a || !b ? this.m_shape2 = this.m_shape1 = null : (this.m_shape1 = a, this.m_shape2 = b, this.m_manifoldCount = 0, this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction), this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution), this.m_next = this.m_prev = null, this.m_node1.contact = null, this.m_node1.prev = null, this.m_node1.next =
            null, this.m_node1.other = null, this.m_node2.contact = null, this.m_node2.prev = null, this.m_node2.next = null, this.m_node2.other = null, this.m_manifold = [new b2Manifold], this.m_manifold[0].pointCount = 0, this.m_manifold[0].points[0].normalImpulse = 0, this.m_manifold[0].points[0].tangentImpulse = 0)
    },
    Evaluate: function() {
        b2Collision.b2CollideCircle(this.m_manifold[0], this.m_shape1, this.m_shape2, !1);
        this.m_manifoldCount = 0 < this.m_manifold[0].pointCount ? 1 : 0
    },
    GetManifolds: function() {
        return this.m_manifold
    },
    m_manifold: [new b2Manifold]
});
b2CircleContact.Create = function(a, b) {
    return new b2CircleContact(a, b)
};
b2CircleContact.Destroy = function() {};
var b2Conservative = Class.create();
b2Conservative.prototype = {
    initialize: function() {}
};
b2Conservative.R1 = new b2Mat22;
b2Conservative.R2 = new b2Mat22;
b2Conservative.x1 = new b2Vec2;
b2Conservative.x2 = new b2Vec2;
b2Conservative.Conservative = function(a, b) {
    var c = a.GetBody(),
        e = b.GetBody(),
        f = c.m_position.x - c.m_position0.x,
        g = c.m_position.y - c.m_position0.y,
        h = c.m_rotation - c.m_rotation0,
        i = e.m_position.x - e.m_position0.x,
        j = e.m_position.y - e.m_position0.y,
        k = e.m_rotation - e.m_rotation0,
        l = a.GetMaxRadius(),
        m = b.GetMaxRadius(),
        o = c.m_position0.x,
        n = c.m_position0.y,
        p = c.m_rotation0,
        r = e.m_position0.x,
        s = e.m_position0.y,
        q = e.m_rotation0,
        t = o,
        z = n,
        v = p,
        C = r,
        A = s,
        u = q;
    b2Conservative.R1.Set(v);
    b2Conservative.R2.Set(u);
    a.QuickSync(p1, b2Conservative.R1);
    b.QuickSync(p2, b2Conservative.R2);
    var y = 0,
        x, B;
    x = 0;
    for (var E = !0, D = 0; 10 > D; ++D) {
        var F = b2Distance.Distance(b2Conservative.x1, b2Conservative.x2, a, b);
        if (F < b2Settings.b2_linearSlop) {
            E = 0 == D ? !1 : !0;
            break
        }
        if (0 == D) {
            x = b2Conservative.x2.x - b2Conservative.x1.x;
            B = b2Conservative.x2.y - b2Conservative.x1.y;
            Math.sqrt(x * x + B * B);
            x = x * (f - i) + B * (g - j) + Math.abs(h) * l + Math.abs(k) * m;
            if (Math.abs(x) < Number.MIN_VALUE) {
                E = !1;
                break
            }
            x = 1 / x
        }
        F = y + F * x;
        if (0 > F || 1 < F) {
            E = !1;
            break
        }
        if (F < (1 + 100 * Number.MIN_VALUE) * y) {
            E = !0;
            break
        }
        y = F;
        t = o + y * v1.x;
        z = n + y * v1.y;
        v = p + y * h;
        C = r + y * v2.x;
        A = s + y * v2.y;
        u = q + y * k;
        b2Conservative.R1.Set(v);
        b2Conservative.R2.Set(u);
        a.QuickSync(p1, b2Conservative.R1);
        b.QuickSync(p2, b2Conservative.R2)
    }
    if (E) return x = b2Conservative.x2.x - b2Conservative.x1.x, B = b2Conservative.x2.y - b2Conservative.x1.y, f = Math.sqrt(x * x + B * B), f > FLT_EPSILON && (d *= b2_linearSlop / f), c.IsStatic() ? (c.m_position.x = t, c.m_position.y = z) : (c.m_position.x = t - x, c.m_position.y = z - B), c.m_rotation = v, c.m_R.Set(v), c.QuickSyncShapes(), e.IsStatic() ? (e.m_position.x = C, e.m_position.y = A) : (e.m_position.x =
        C + x, e.m_position.y = A + B), e.m_position.x = C + x, e.m_position.y = A + B, e.m_rotation = u, e.m_R.Set(u), e.QuickSyncShapes(), !0;
    a.QuickSync(c.m_position, c.m_R);
    b.QuickSync(e.m_position, e.m_R);
    return !1
};
var b2NullContact = Class.create();
Object.extend(b2NullContact.prototype, b2Contact.prototype);
Object.extend(b2NullContact.prototype, {
    initialize: function(a, b) {
        this.m_node1 = new b2ContactNode;
        this.m_node2 = new b2ContactNode;
        this.m_flags = 0;
        !a || !b ? this.m_shape2 = this.m_shape1 = null : (this.m_shape1 = a, this.m_shape2 = b, this.m_manifoldCount = 0, this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction), this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution), this.m_next = this.m_prev = null, this.m_node1.contact = null, this.m_node1.prev = null, this.m_node1.next = null,
            this.m_node1.other = null, this.m_node2.contact = null, this.m_node2.prev = null, this.m_node2.next = null, this.m_node2.other = null)
    },
    Evaluate: function() {},
    GetManifolds: function() {
        return null
    }
});
var b2PolyAndCircleContact = Class.create();
Object.extend(b2PolyAndCircleContact.prototype, b2Contact.prototype);
Object.extend(b2PolyAndCircleContact.prototype, {
    initialize: function(a, b) {
        this.m_node1 = new b2ContactNode;
        this.m_node2 = new b2ContactNode;
        this.m_flags = 0;
        !a || !b ? this.m_shape2 = this.m_shape1 = null : (this.m_shape1 = a, this.m_shape2 = b, this.m_manifoldCount = 0, this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction), this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution), this.m_next = this.m_prev = null, this.m_node1.contact = null, this.m_node1.prev = null, this.m_node1.next =
            null, this.m_node1.other = null, this.m_node2.contact = null, this.m_node2.prev = null, this.m_node2.next = null, this.m_node2.other = null, this.m_manifold = [new b2Manifold], b2Settings.b2Assert(this.m_shape1.m_type == b2Shape.e_polyShape), b2Settings.b2Assert(this.m_shape2.m_type == b2Shape.e_circleShape), this.m_manifold[0].pointCount = 0, this.m_manifold[0].points[0].normalImpulse = 0, this.m_manifold[0].points[0].tangentImpulse = 0)
    },
    Evaluate: function() {
        b2Collision.b2CollidePolyAndCircle(this.m_manifold[0], this.m_shape1, this.m_shape2, !1);
        this.m_manifoldCount = 0 < this.m_manifold[0].pointCount ? 1 : 0
    },
    GetManifolds: function() {
        return this.m_manifold
    },
    m_manifold: [new b2Manifold]
});
b2PolyAndCircleContact.Create = function(a, b) {
    return new b2PolyAndCircleContact(a, b)
};
b2PolyAndCircleContact.Destroy = function() {};
var b2PolyContact = Class.create();
Object.extend(b2PolyContact.prototype, b2Contact.prototype);
Object.extend(b2PolyContact.prototype, {
    initialize: function(a, b) {
        this.m_node1 = new b2ContactNode;
        this.m_node2 = new b2ContactNode;
        this.m_flags = 0;
        !a || !b ? this.m_shape2 = this.m_shape1 = null : (this.m_shape1 = a, this.m_shape2 = b, this.m_manifoldCount = 0, this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction), this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution), this.m_next = this.m_prev = null, this.m_node1.contact = null, this.m_node1.prev = null, this.m_node1.next = null,
            this.m_node1.other = null, this.m_node2.contact = null, this.m_node2.prev = null, this.m_node2.next = null, this.m_node2.other = null, this.m0 = new b2Manifold, this.m_manifold = [new b2Manifold], this.m_manifold[0].pointCount = 0)
    },
    m0: new b2Manifold,
    Evaluate: function() {
        for (var a = this.m_manifold[0], b = this.m0.points, c = 0; c < a.pointCount; c++) {
            var e = b[c],
                f = a.points[c];
            e.normalImpulse = f.normalImpulse;
            e.tangentImpulse = f.tangentImpulse;
            e.id = f.id.Copy()
        }
        this.m0.pointCount = a.pointCount;
        b2Collision.b2CollidePoly(a, this.m_shape1, this.m_shape2, !1);
        if (0 < a.pointCount) {
            b = [!1, !1];
            for (c = 0; c < a.pointCount; ++c) {
                e = a.points[c];
                e.normalImpulse = 0;
                e.tangentImpulse = 0;
                for (var f = e.id.key, g = 0; g < this.m0.pointCount; ++g)
                    if (!0 != b[g]) {
                        var h = this.m0.points[g];
                        if (h.id.key == f) {
                            b[g] = !0;
                            e.normalImpulse = h.normalImpulse;
                            e.tangentImpulse = h.tangentImpulse;
                            break
                        }
                    }
            }
            this.m_manifoldCount = 1
        } else this.m_manifoldCount = 0
    },
    GetManifolds: function() {
        return this.m_manifold
    },
    m_manifold: [new b2Manifold]
});
b2PolyContact.Create = function(a, b) {
    return new b2PolyContact(a, b)
};
b2PolyContact.Destroy = function() {};
var b2ContactManager = Class.create();
Object.extend(b2ContactManager.prototype, b2PairCallback.prototype);
Object.extend(b2ContactManager.prototype, {
    initialize: function() {
        this.m_nullContact = new b2NullContact;
        this.m_world = null;
        this.m_destroyImmediate = !1
    },
    PairAdded: function(a, b) {
        var c = a,
            e = b,
            f = c.m_body,
            g = e.m_body;
        if (f.IsStatic() && g.IsStatic() || c.m_body == e.m_body || g.IsConnected(f) || null != this.m_world.m_filter && !1 == this.m_world.m_filter.ShouldCollide(c, e)) return this.m_nullContact;
        0 == g.m_invMass && (f = c, c = e, e = f);
        c = b2Contact.Create(c, e, this.m_world.m_blockAllocator);
        if (null == c) return this.m_nullContact;
        c.m_prev =
            null;
        c.m_next = this.m_world.m_contactList;
        if (null != this.m_world.m_contactList) this.m_world.m_contactList.m_prev = c;
        this.m_world.m_contactList = c;
        this.m_world.m_contactCount++;
        return c
    },
    PairRemoved: function(a, b, c) {
        null != c && c != this.m_nullContact && (!0 == this.m_destroyImmediate ? this.DestroyContact(c) : c.m_flags |= b2Contact.e_destroyFlag)
    },
    DestroyContact: function(a) {
        if (a.m_prev) a.m_prev.m_next = a.m_next;
        if (a.m_next) a.m_next.m_prev = a.m_prev;
        if (a == this.m_world.m_contactList) this.m_world.m_contactList = a.m_next;
        if (0 < a.GetManifoldCount()) {
            var b = a.m_shape1.m_body,
                c = a.m_shape2.m_body,
                e = a.m_node1,
                f = a.m_node2;
            b.WakeUp();
            c.WakeUp();
            if (e.prev) e.prev.next = e.next;
            if (e.next) e.next.prev = e.prev;
            if (e == b.m_contactList) b.m_contactList = e.next;
            e.prev = null;
            e.next = null;
            if (f.prev) f.prev.next = f.next;
            if (f.next) f.next.prev = f.prev;
            if (f == c.m_contactList) c.m_contactList = f.next;
            f.prev = null;
            f.next = null
        }
        b2Contact.Destroy(a, this.m_world.m_blockAllocator);
        --this.m_world.m_contactCount
    },
    CleanContactList: function() {
        for (var a = this.m_world.m_contactList; null !=
            a;) {
            var b = a,
                a = a.m_next;
            b.m_flags & b2Contact.e_destroyFlag && this.DestroyContact(b)
        }
    },
    Collide: function() {
        for (var a, b, c, e, f = this.m_world.m_contactList; null != f; f = f.m_next)
            if (!f.m_shape1.m_body.IsSleeping() || !f.m_shape2.m_body.IsSleeping())
                if (a = f.GetManifoldCount(), f.Evaluate(), invokeConactCallback(f.m_shape1, f, f.m_shape2), invokeConactCallback(f.m_shape2, f, f.m_shape1), b = f.GetManifoldCount(), 0 == a && 0 < b) {
                    a = f.m_shape1.m_body;
                    b = f.m_shape2.m_body;
                    c = f.m_node1;
                    e = f.m_node2;
                    c.contact = f;
                    c.other = b;
                    c.prev = null;
                    c.next =
                        a.m_contactList;
                    if (null != c.next) c.next.prev = f.m_node1;
                    a.m_contactList = f.m_node1;
                    e.contact = f;
                    e.other = a;
                    e.prev = null;
                    e.next = b.m_contactList;
                    if (null != e.next) e.next.prev = e;
                    b.m_contactList = e
                } else if (0 < a && 0 == b) {
            a = f.m_shape1.m_body;
            b = f.m_shape2.m_body;
            c = f.m_node1;
            e = f.m_node2;
            if (c.prev) c.prev.next = c.next;
            if (c.next) c.next.prev = c.prev;
            if (c == a.m_contactList) a.m_contactList = c.next;
            c.prev = null;
            c.next = null;
            if (e.prev) e.prev.next = e.next;
            if (e.next) e.next.prev = e.prev;
            if (e == b.m_contactList) b.m_contactList = e.next;
            e.prev =
                null;
            e.next = null
        }
    },
    m_world: null,
    m_nullContact: new b2NullContact,
    m_destroyImmediate: null
});
var b2World = Class.create();
b2World.prototype = {
    initialize: function(a, b, c) {
        this.step = new b2TimeStep;
        this.m_contactManager = new b2ContactManager;
        this.m_listener = null;
        this.m_filter = b2CollisionFilter.b2_defaultFilter;
        this.m_jointList = this.m_contactList = this.m_bodyList = null;
        this.m_jointCount = this.m_contactCount = this.m_bodyCount = 0;
        this.m_bodyDestroyList = null;
        this.m_allowSleep = c;
        this.m_gravity = b;
        this.m_contactManager.m_world = this;
        this.m_broadPhase = new b2BroadPhase(a, this.m_contactManager);
        this.m_groundBody = this.CreateBody(new b2BodyDef)
    },
    SetListener: function(a) {
        this.m_listener = a
    },
    SetFilter: function(a) {
        this.m_filter = a
    },
    CreateBody: function(a) {
        a = new b2Body(a, this);
        a.m_prev = null;
        if (a.m_next = this.m_bodyList) this.m_bodyList.m_prev = a;
        this.m_bodyList = a;
        ++this.m_bodyCount;
        return a
    },
    DestroyBody: function(a) {
        if (!(a.m_flags & b2Body.e_destroyFlag)) {
            if (a.m_prev) a.m_prev.m_next = a.m_next;
            if (a.m_next) a.m_next.m_prev = a.m_prev;
            if (a == this.m_bodyList) this.m_bodyList = a.m_next;
            a.m_flags |= b2Body.e_destroyFlag;
            --this.m_bodyCount;
            a.m_prev = null;
            a.m_next = this.m_bodyDestroyList;
            this.m_bodyDestroyList = a
        }
    },
    CleanBodyList: function() {
        this.m_contactManager.m_destroyImmediate = !0;
        for (var a = this.m_bodyDestroyList; a;) {
            for (var b = a, a = a.m_next, c = b.m_jointList; c;) {
                var e = c,
                    c = c.next;
                this.m_listener && this.m_listener.NotifyJointDestroyed(e.joint);
                this.DestroyJoint(e.joint)
            }
            b.Destroy()
        }
        this.m_bodyDestroyList = null;
        this.m_contactManager.m_destroyImmediate = !1
    },
    CreateJoint: function(a) {
        var b = b2Joint.Create(a, this.m_blockAllocator);
        b.m_prev = null;
        if (b.m_next = this.m_jointList) this.m_jointList.m_prev =
            b;
        this.m_jointList = b;
        ++this.m_jointCount;
        b.m_node1.joint = b;
        b.m_node1.other = b.m_body2;
        b.m_node1.prev = null;
        if (b.m_node1.next = b.m_body1.m_jointList) b.m_body1.m_jointList.prev = b.m_node1;
        b.m_body1.m_jointList = b.m_node1;
        b.m_node2.joint = b;
        b.m_node2.other = b.m_body1;
        b.m_node2.prev = null;
        if (b.m_node2.next = b.m_body2.m_jointList) b.m_body2.m_jointList.prev = b.m_node2;
        b.m_body2.m_jointList = b.m_node2;
        if (!1 == a.collideConnected)
            for (a = (a.body1.m_shapeCount < a.body2.m_shapeCount ? a.body1 : a.body2).m_shapeList; a; a = a.m_next) a.ResetProxy(this.m_broadPhase);
        return b
    },
    DestroyJoint: function(a) {
        var b = a.m_collideConnected;
        if (a.m_prev) a.m_prev.m_next = a.m_next;
        if (a.m_next) a.m_next.m_prev = a.m_prev;
        if (a == this.m_jointList) this.m_jointList = a.m_next;
        var c = a.m_body1,
            e = a.m_body2;
        c.WakeUp();
        e.WakeUp();
        if (a.m_node1.prev) a.m_node1.prev.next = a.m_node1.next;
        if (a.m_node1.next) a.m_node1.next.prev = a.m_node1.prev;
        if (a.m_node1 == c.m_jointList) c.m_jointList = a.m_node1.next;
        a.m_node1.prev = null;
        a.m_node1.next = null;
        if (a.m_node2.prev) a.m_node2.prev.next = a.m_node2.next;
        if (a.m_node2.next) a.m_node2.next.prev =
            a.m_node2.prev;
        if (a.m_node2 == e.m_jointList) e.m_jointList = a.m_node2.next;
        a.m_node2.prev = null;
        a.m_node2.next = null;
        b2Joint.Destroy(a, this.m_blockAllocator);
        --this.m_jointCount;
        if (!1 == b)
            for (a = (c.m_shapeCount < e.m_shapeCount ? c : e).m_shapeList; a; a = a.m_next) a.ResetProxy(this.m_broadPhase)
    },
    GetGroundBody: function() {
        return this.m_groundBody
    },
    step: new b2TimeStep,
    Step: function(a, b) {
        var c, e;
        this.step.dt = a;
        this.step.iterations = b;
        this.step.inv_dt = 0 < a ? 1 / a : 0;
        this.m_positionIterationCount = 0;
        this.m_contactManager.CleanContactList();
        this.CleanBodyList();
        this.m_contactManager.Collide();
        var f = new b2Island(this.m_bodyCount, this.m_contactCount, this.m_jointCount, this.m_stackAllocator);
        for (c = this.m_bodyList; null != c; c = c.m_next) c.m_flags &= ~b2Body.e_islandFlag;
        for (var g = this.m_contactList; null != g; g = g.m_next) g.m_flags &= ~b2Contact.e_islandFlag;
        for (g = this.m_jointList; null != g; g = g.m_next) g.m_islandFlag = !1;
        for (var g = Array(this.m_bodyCount), h = 0; h < this.m_bodyCount; h++) g[h] = null;
        for (h = this.m_bodyList; null != h; h = h.m_next)
            if (!(h.m_flags & (b2Body.e_staticFlag |
                    b2Body.e_islandFlag | b2Body.e_sleepFlag | b2Body.e_frozenFlag))) {
                f.Clear();
                var i = 0;
                g[i++] = h;
                for (h.m_flags |= b2Body.e_islandFlag; 0 < i;)
                    if (c = g[--i], f.AddBody(c), c.m_flags &= ~b2Body.e_sleepFlag, !(c.m_flags & b2Body.e_staticFlag)) {
                        for (var j = c.m_contactList; null != j; j = j.next)
                            if (!(j.contact.m_flags & b2Contact.e_islandFlag)) f.AddContact(j.contact), j.contact.m_flags |= b2Contact.e_islandFlag, e = j.other, e.m_flags & b2Body.e_islandFlag || (g[i++] = e, e.m_flags |= b2Body.e_islandFlag);
                        for (c = c.m_jointList; null != c; c = c.next)
                            if (!0 !=
                                c.joint.m_islandFlag) f.AddJoint(c.joint), c.joint.m_islandFlag = !0, e = c.other, e.m_flags & b2Body.e_islandFlag || (g[i++] = e, e.m_flags |= b2Body.e_islandFlag)
                    }
                f.Solve(this.step, this.m_gravity);
                this.m_positionIterationCount = b2Math.b2Max(this.m_positionIterationCount, b2Island.m_positionIterationCount);
                this.m_allowSleep && f.UpdateSleep(a);
                for (e = 0; e < f.m_bodyCount; ++e) c = f.m_bodies[e], c.m_flags & b2Body.e_staticFlag && (c.m_flags &= ~b2Body.e_islandFlag), c.IsFrozen() && this.m_listener && this.m_listener.NotifyBoundaryViolated(c) ==
                    b2WorldListener.b2_destroyBody && (this.DestroyBody(c), f.m_bodies[e] = null)
            }
        this.m_broadPhase.Commit()
    },
    Query: function(a, b, c) {
        for (var e = [], a = this.m_broadPhase.QueryAABB(a, e, c), c = 0; c < a; ++c) b[c] = e[c];
        return a
    },
    GetBodyList: function() {
        return this.m_bodyList
    },
    GetJointList: function() {
        return this.m_jointList
    },
    GetContactList: function() {
        return this.m_contactList
    },
    m_blockAllocator: null,
    m_stackAllocator: null,
    m_broadPhase: null,
    m_contactManager: new b2ContactManager,
    m_bodyList: null,
    m_contactList: null,
    m_jointList: null,
    m_bodyCount: 0,
    m_contactCount: 0,
    m_jointCount: 0,
    m_bodyDestroyList: null,
    m_gravity: null,
    m_allowSleep: null,
    m_groundBody: null,
    m_listener: null,
    m_filter: null,
    m_positionIterationCount: 0
};
b2World.s_enablePositionCorrection = 1;
b2World.s_enableWarmStarting = 1;
var b2WorldListener = Class.create();
b2WorldListener.prototype = {
    NotifyJointDestroyed: function() {},
    NotifyBoundaryViolated: function() {
        return b2WorldListener.b2_freezeBody
    },
    initialize: function() {}
};
b2WorldListener.b2_freezeBody = 0;
b2WorldListener.b2_destroyBody = 1;
var b2JointNode = Class.create();
b2JointNode.prototype = {
    other: null,
    joint: null,
    prev: null,
    next: null,
    initialize: function() {}
};
var b2Joint = Class.create();
b2Joint.prototype = {
    GetType: function() {
        return this.m_type
    },
    GetAnchor1: function() {
        return null
    },
    GetAnchor2: function() {
        return null
    },
    GetReactionForce: function() {
        return null
    },
    GetReactionTorque: function() {
        return 0
    },
    GetBody1: function() {
        return this.m_body1
    },
    GetBody2: function() {
        return this.m_body2
    },
    GetNext: function() {
        return this.m_next
    },
    GetUserData: function() {
        return this.m_userData
    },
    initialize: function(a) {
        this.m_node1 = new b2JointNode;
        this.m_node2 = new b2JointNode;
        this.m_type = a.type;
        this.m_next = this.m_prev = null;
        this.m_body1 = a.body1;
        this.m_body2 = a.body2;
        this.m_collideConnected = a.collideConnected;
        this.m_islandFlag = !1;
        this.m_userData = a.userData
    },
    PrepareVelocitySolver: function() {},
    SolveVelocityConstraints: function() {},
    PreparePositionSolver: function() {},
    SolvePositionConstraints: function() {
        return !1
    },
    m_type: 0,
    m_prev: null,
    m_next: null,
    m_node1: new b2JointNode,
    m_node2: new b2JointNode,
    m_body1: null,
    m_body2: null,
    m_islandFlag: null,
    m_collideConnected: null,
    m_userData: null
};
b2Joint.Create = function(a) {
    var b = null;
    switch (a.type) {
        case b2Joint.e_distanceJoint:
            b = new b2DistanceJoint(a);
            break;
        case b2Joint.e_mouseJoint:
            b = new b2MouseJoint(a);
            break;
        case b2Joint.e_prismaticJoint:
            b = new b2PrismaticJoint(a);
            break;
        case b2Joint.e_revoluteJoint:
            b = new b2RevoluteJoint(a);
            break;
        case b2Joint.e_pulleyJoint:
            b = new b2PulleyJoint(a);
            break;
        case b2Joint.e_gearJoint:
            b = new b2GearJoint(a)
    }
    return b
};
b2Joint.Destroy = function() {};
b2Joint.e_unknownJoint = 0;
b2Joint.e_revoluteJoint = 1;
b2Joint.e_prismaticJoint = 2;
b2Joint.e_distanceJoint = 3;
b2Joint.e_pulleyJoint = 4;
b2Joint.e_mouseJoint = 5;
b2Joint.e_gearJoint = 6;
b2Joint.e_inactiveLimit = 0;
b2Joint.e_atLowerLimit = 1;
b2Joint.e_atUpperLimit = 2;
b2Joint.e_equalLimits = 3;
var b2JointDef = Class.create();
b2JointDef.prototype = {
    initialize: function() {
        this.type = b2Joint.e_unknownJoint;
        this.body2 = this.body1 = this.userData = null;
        this.collideConnected = !1
    },
    type: 0,
    userData: null,
    body1: null,
    body2: null,
    collideConnected: null
};
var b2DistanceJoint = Class.create();
Object.extend(b2DistanceJoint.prototype, b2Joint.prototype);
Object.extend(b2DistanceJoint.prototype, {
    initialize: function(a) {
        this.m_node1 = new b2JointNode;
        this.m_node2 = new b2JointNode;
        this.m_type = a.type;
        this.m_next = this.m_prev = null;
        this.m_body1 = a.body1;
        this.m_body2 = a.body2;
        this.m_collideConnected = a.collideConnected;
        this.m_islandFlag = !1;
        this.m_userData = a.userData;
        this.m_localAnchor1 = new b2Vec2;
        this.m_localAnchor2 = new b2Vec2;
        this.m_u = new b2Vec2;
        var b, c, e;
        b = this.m_body1.m_R;
        c = a.anchorPoint1.x - this.m_body1.m_position.x;
        e = a.anchorPoint1.y - this.m_body1.m_position.y;
        this.m_localAnchor1.x = c * b.col1.x + e * b.col1.y;
        this.m_localAnchor1.y = c * b.col2.x + e * b.col2.y;
        b = this.m_body2.m_R;
        c = a.anchorPoint2.x - this.m_body2.m_position.x;
        e = a.anchorPoint2.y - this.m_body2.m_position.y;
        this.m_localAnchor2.x = c * b.col1.x + e * b.col1.y;
        this.m_localAnchor2.y = c * b.col2.x + e * b.col2.y;
        c = a.anchorPoint2.x - a.anchorPoint1.x;
        e = a.anchorPoint2.y - a.anchorPoint1.y;
        this.m_length = Math.sqrt(c * c + e * e);
        this.m_impulse = 0
    },
    PrepareVelocitySolver: function() {
        var a;
        a = this.m_body1.m_R;
        var b = a.col1.x * this.m_localAnchor1.x +
            a.col2.x * this.m_localAnchor1.y,
            c = a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y;
        a = this.m_body2.m_R;
        var e = a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y;
        a = a.col1.y * this.m_localAnchor2.x + a.col2.y * this.m_localAnchor2.y;
        this.m_u.x = this.m_body2.m_position.x + e - this.m_body1.m_position.x - b;
        this.m_u.y = this.m_body2.m_position.y + a - this.m_body1.m_position.y - c;
        var f = Math.sqrt(this.m_u.x * this.m_u.x + this.m_u.y * this.m_u.y);
        f > b2Settings.b2_linearSlop ? this.m_u.Multiply(1 / f) : this.m_u.SetZero();
        var f = b * this.m_u.y - c * this.m_u.x,
            g = e * this.m_u.y - a * this.m_u.x;
        this.m_mass = this.m_body1.m_invMass + this.m_body1.m_invI * f * f + this.m_body2.m_invMass + this.m_body2.m_invI * g * g;
        this.m_mass = 1 / this.m_mass;
        b2World.s_enableWarmStarting ? (f = this.m_impulse * this.m_u.x, g = this.m_impulse * this.m_u.y, this.m_body1.m_linearVelocity.x -= this.m_body1.m_invMass * f, this.m_body1.m_linearVelocity.y -= this.m_body1.m_invMass * g, this.m_body1.m_angularVelocity -= this.m_body1.m_invI * (b * g - c * f), this.m_body2.m_linearVelocity.x += this.m_body2.m_invMass *
            f, this.m_body2.m_linearVelocity.y += this.m_body2.m_invMass * g, this.m_body2.m_angularVelocity += this.m_body2.m_invI * (e * g - a * f)) : this.m_impulse = 0
    },
    SolveVelocityConstraints: function() {
        var a;
        a = this.m_body1.m_R;
        var b = a.col1.x * this.m_localAnchor1.x + a.col2.x * this.m_localAnchor1.y,
            c = a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y;
        a = this.m_body2.m_R;
        var e = a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y;
        a = a.col1.y * this.m_localAnchor2.x + a.col2.y * this.m_localAnchor2.y;
        var f = -this.m_mass *
            (this.m_u.x * (this.m_body2.m_linearVelocity.x + -this.m_body2.m_angularVelocity * a - (this.m_body1.m_linearVelocity.x + -this.m_body1.m_angularVelocity * c)) + this.m_u.y * (this.m_body2.m_linearVelocity.y + this.m_body2.m_angularVelocity * e - (this.m_body1.m_linearVelocity.y + this.m_body1.m_angularVelocity * b)));
        this.m_impulse += f;
        var g = f * this.m_u.x,
            f = f * this.m_u.y;
        this.m_body1.m_linearVelocity.x -= this.m_body1.m_invMass * g;
        this.m_body1.m_linearVelocity.y -= this.m_body1.m_invMass * f;
        this.m_body1.m_angularVelocity -= this.m_body1.m_invI *
            (b * f - c * g);
        this.m_body2.m_linearVelocity.x += this.m_body2.m_invMass * g;
        this.m_body2.m_linearVelocity.y += this.m_body2.m_invMass * f;
        this.m_body2.m_angularVelocity += this.m_body2.m_invI * (e * f - a * g)
    },
    SolvePositionConstraints: function() {
        var a;
        a = this.m_body1.m_R;
        var b = a.col1.x * this.m_localAnchor1.x + a.col2.x * this.m_localAnchor1.y,
            c = a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y;
        a = this.m_body2.m_R;
        var e = a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y;
        a = a.col1.y * this.m_localAnchor2.x +
            a.col2.y * this.m_localAnchor2.y;
        var f = this.m_body2.m_position.x + e - this.m_body1.m_position.x - b,
            g = this.m_body2.m_position.y + a - this.m_body1.m_position.y - c,
            h = Math.sqrt(f * f + g * g),
            f = f / h,
            g = g / h,
            h = h - this.m_length,
            h = b2Math.b2Clamp(h, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection),
            i = -this.m_mass * h;
        this.m_u.Set(f, g);
        f = i * this.m_u.x;
        g = i * this.m_u.y;
        this.m_body1.m_position.x -= this.m_body1.m_invMass * f;
        this.m_body1.m_position.y -= this.m_body1.m_invMass * g;
        this.m_body1.m_rotation -= this.m_body1.m_invI *
            (b * g - c * f);
        this.m_body2.m_position.x += this.m_body2.m_invMass * f;
        this.m_body2.m_position.y += this.m_body2.m_invMass * g;
        this.m_body2.m_rotation += this.m_body2.m_invI * (e * g - a * f);
        this.m_body1.m_R.Set(this.m_body1.m_rotation);
        this.m_body2.m_R.Set(this.m_body2.m_rotation);
        return b2Math.b2Abs(h) < b2Settings.b2_linearSlop
    },
    GetAnchor1: function() {
        return b2Math.AddVV(this.m_body1.m_position, b2Math.b2MulMV(this.m_body1.m_R, this.m_localAnchor1))
    },
    GetAnchor2: function() {
        return b2Math.AddVV(this.m_body2.m_position, b2Math.b2MulMV(this.m_body2.m_R,
            this.m_localAnchor2))
    },
    GetReactionForce: function(a) {
        var b = new b2Vec2;
        b.SetV(this.m_u);
        b.Multiply(this.m_impulse * a);
        return b
    },
    GetReactionTorque: function() {
        return 0
    },
    m_localAnchor1: new b2Vec2,
    m_localAnchor2: new b2Vec2,
    m_u: new b2Vec2,
    m_impulse: null,
    m_mass: null,
    m_length: null
});
var b2DistanceJointDef = Class.create();
Object.extend(b2DistanceJointDef.prototype, b2JointDef.prototype);
Object.extend(b2DistanceJointDef.prototype, {
    initialize: function() {
        this.type = b2Joint.e_unknownJoint;
        this.body2 = this.body1 = this.userData = null;
        this.collideConnected = !1;
        this.anchorPoint1 = new b2Vec2;
        this.anchorPoint2 = new b2Vec2;
        this.type = b2Joint.e_distanceJoint
    },
    anchorPoint1: new b2Vec2,
    anchorPoint2: new b2Vec2
});
var b2Jacobian = Class.create();
b2Jacobian.prototype = {
    linear1: new b2Vec2,
    angular1: null,
    linear2: new b2Vec2,
    angular2: null,
    SetZero: function() {
        this.linear1.SetZero();
        this.angular1 = 0;
        this.linear2.SetZero();
        this.angular2 = 0
    },
    Set: function(a, b, c, e) {
        this.linear1.SetV(a);
        this.angular1 = b;
        this.linear2.SetV(c);
        this.angular2 = e
    },
    Compute: function(a, b, c, e) {
        return this.linear1.x * a.x + this.linear1.y * a.y + this.angular1 * b + (this.linear2.x * c.x + this.linear2.y * c.y) + this.angular2 * e
    },
    initialize: function() {
        this.linear1 = new b2Vec2;
        this.linear2 = new b2Vec2
    }
};
var b2GearJoint = Class.create();
Object.extend(b2GearJoint.prototype, b2Joint.prototype);
Object.extend(b2GearJoint.prototype, {
    GetAnchor1: function() {
        var a = this.m_body1.m_R;
        return new b2Vec2(this.m_body1.m_position.x + (a.col1.x * this.m_localAnchor1.x + a.col2.x * this.m_localAnchor1.y), this.m_body1.m_position.y + (a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y))
    },
    GetAnchor2: function() {
        var a = this.m_body2.m_R;
        return new b2Vec2(this.m_body2.m_position.x + (a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y), this.m_body2.m_position.y + (a.col1.y * this.m_localAnchor2.x + a.col2.y *
            this.m_localAnchor2.y))
    },
    GetReactionForce: function() {
        return new b2Vec2
    },
    GetReactionTorque: function() {
        return 0
    },
    GetRatio: function() {
        return this.m_ratio
    },
    initialize: function(a) {
        this.m_node1 = new b2JointNode;
        this.m_node2 = new b2JointNode;
        this.m_type = a.type;
        this.m_next = this.m_prev = null;
        this.m_body1 = a.body1;
        this.m_body2 = a.body2;
        this.m_collideConnected = a.collideConnected;
        this.m_islandFlag = !1;
        this.m_userData = a.userData;
        this.m_groundAnchor1 = new b2Vec2;
        this.m_groundAnchor2 = new b2Vec2;
        this.m_localAnchor1 = new b2Vec2;
        this.m_localAnchor2 = new b2Vec2;
        this.m_J = new b2Jacobian;
        this.m_prismatic2 = this.m_revolute2 = this.m_prismatic1 = this.m_revolute1 = null;
        var b, c;
        this.m_ground1 = a.joint1.m_body1;
        this.m_body1 = a.joint1.m_body2;
        a.joint1.m_type == b2Joint.e_revoluteJoint ? (this.m_revolute1 = a.joint1, this.m_groundAnchor1.SetV(this.m_revolute1.m_localAnchor1), this.m_localAnchor1.SetV(this.m_revolute1.m_localAnchor2), b = this.m_revolute1.GetJointAngle()) : (this.m_prismatic1 = a.joint1, this.m_groundAnchor1.SetV(this.m_prismatic1.m_localAnchor1),
            this.m_localAnchor1.SetV(this.m_prismatic1.m_localAnchor2), b = this.m_prismatic1.GetJointTranslation());
        this.m_ground2 = a.joint2.m_body1;
        this.m_body2 = a.joint2.m_body2;
        a.joint2.m_type == b2Joint.e_revoluteJoint ? (this.m_revolute2 = a.joint2, this.m_groundAnchor2.SetV(this.m_revolute2.m_localAnchor1), this.m_localAnchor2.SetV(this.m_revolute2.m_localAnchor2), c = this.m_revolute2.GetJointAngle()) : (this.m_prismatic2 = a.joint2, this.m_groundAnchor2.SetV(this.m_prismatic2.m_localAnchor1), this.m_localAnchor2.SetV(this.m_prismatic2.m_localAnchor2),
            c = this.m_prismatic2.GetJointTranslation());
        this.m_ratio = a.ratio;
        this.m_constant = b + this.m_ratio * c;
        this.m_impulse = 0
    },
    PrepareVelocitySolver: function() {
        var a = this.m_ground1,
            b = this.m_ground2,
            c = this.m_body1,
            e = this.m_body2,
            f, g, h, i = 0;
        this.m_J.SetZero();
        this.m_revolute1 ? (this.m_J.angular1 = -1, i += c.m_invI) : (h = a.m_R, f = this.m_prismatic1.m_localXAxis1, a = h.col1.x * f.x + h.col2.x * f.y, f = h.col1.y * f.x + h.col2.y * f.y, h = c.m_R, g = h.col1.x * this.m_localAnchor1.x + h.col2.x * this.m_localAnchor1.y, h = h.col1.y * this.m_localAnchor1.x +
            h.col2.y * this.m_localAnchor1.y, g = g * f - h * a, this.m_J.linear1.Set(-a, -f), this.m_J.angular1 = -g, i += c.m_invMass + c.m_invI * g * g);
        this.m_revolute2 ? (this.m_J.angular2 = -this.m_ratio, i += this.m_ratio * this.m_ratio * e.m_invI) : (h = b.m_R, f = this.m_prismatic2.m_localXAxis1, a = h.col1.x * f.x + h.col2.x * f.y, f = h.col1.y * f.x + h.col2.y * f.y, h = e.m_R, g = h.col1.x * this.m_localAnchor2.x + h.col2.x * this.m_localAnchor2.y, h = h.col1.y * this.m_localAnchor2.x + h.col2.y * this.m_localAnchor2.y, g = g * f - h * a, this.m_J.linear2.Set(-this.m_ratio * a, -this.m_ratio *
            f), this.m_J.angular2 = -this.m_ratio * g, i += this.m_ratio * this.m_ratio * (e.m_invMass + e.m_invI * g * g));
        this.m_mass = 1 / i;
        c.m_linearVelocity.x += c.m_invMass * this.m_impulse * this.m_J.linear1.x;
        c.m_linearVelocity.y += c.m_invMass * this.m_impulse * this.m_J.linear1.y;
        c.m_angularVelocity += c.m_invI * this.m_impulse * this.m_J.angular1;
        e.m_linearVelocity.x += e.m_invMass * this.m_impulse * this.m_J.linear2.x;
        e.m_linearVelocity.y += e.m_invMass * this.m_impulse * this.m_J.linear2.y;
        e.m_angularVelocity += e.m_invI * this.m_impulse * this.m_J.angular2
    },
    SolveVelocityConstraints: function() {
        var a = this.m_body1,
            b = this.m_body2,
            c = -this.m_mass * this.m_J.Compute(a.m_linearVelocity, a.m_angularVelocity, b.m_linearVelocity, b.m_angularVelocity);
        this.m_impulse += c;
        a.m_linearVelocity.x += a.m_invMass * c * this.m_J.linear1.x;
        a.m_linearVelocity.y += a.m_invMass * c * this.m_J.linear1.y;
        a.m_angularVelocity += a.m_invI * c * this.m_J.angular1;
        b.m_linearVelocity.x += b.m_invMass * c * this.m_J.linear2.x;
        b.m_linearVelocity.y += b.m_invMass * c * this.m_J.linear2.y;
        b.m_angularVelocity += b.m_invI * c *
            this.m_J.angular2
    },
    SolvePositionConstraints: function() {
        var a = this.m_body1,
            b = this.m_body2,
            c, e;
        c = this.m_revolute1 ? this.m_revolute1.GetJointAngle() : this.m_prismatic1.GetJointTranslation();
        e = this.m_revolute2 ? this.m_revolute2.GetJointAngle() : this.m_prismatic2.GetJointTranslation();
        c = -this.m_mass * (this.m_constant - (c + this.m_ratio * e));
        a.m_position.x += a.m_invMass * c * this.m_J.linear1.x;
        a.m_position.y += a.m_invMass * c * this.m_J.linear1.y;
        a.m_rotation += a.m_invI * c * this.m_J.angular1;
        b.m_position.x += b.m_invMass * c * this.m_J.linear2.x;
        b.m_position.y += b.m_invMass * c * this.m_J.linear2.y;
        b.m_rotation += b.m_invI * c * this.m_J.angular2;
        a.m_R.Set(a.m_rotation);
        b.m_R.Set(b.m_rotation);
        return 0 < b2Settings.b2_linearSlop
    },
    m_ground1: null,
    m_ground2: null,
    m_revolute1: null,
    m_prismatic1: null,
    m_revolute2: null,
    m_prismatic2: null,
    m_groundAnchor1: new b2Vec2,
    m_groundAnchor2: new b2Vec2,
    m_localAnchor1: new b2Vec2,
    m_localAnchor2: new b2Vec2,
    m_J: new b2Jacobian,
    m_constant: null,
    m_ratio: null,
    m_mass: null,
    m_impulse: null
});
var b2GearJointDef = Class.create();
Object.extend(b2GearJointDef.prototype, b2JointDef.prototype);
Object.extend(b2GearJointDef.prototype, {
    initialize: function() {
        this.type = b2Joint.e_gearJoint;
        this.joint2 = this.joint1 = null;
        this.ratio = 1
    },
    joint1: null,
    joint2: null,
    ratio: null
});
var b2MouseJoint = Class.create();
Object.extend(b2MouseJoint.prototype, b2Joint.prototype);
Object.extend(b2MouseJoint.prototype, {
    GetAnchor1: function() {
        return this.m_target
    },
    GetAnchor2: function() {
        var a = b2Math.b2MulMV(this.m_body2.m_R, this.m_localAnchor);
        a.Add(this.m_body2.m_position);
        return a
    },
    GetReactionForce: function(a) {
        var b = new b2Vec2;
        b.SetV(this.m_impulse);
        b.Multiply(a);
        return b
    },
    GetReactionTorque: function() {
        return 0
    },
    SetTarget: function(a) {
        this.m_body2.WakeUp();
        this.m_target = a
    },
    initialize: function(a) {
        this.m_node1 = new b2JointNode;
        this.m_node2 = new b2JointNode;
        this.m_type = a.type;
        this.m_next =
            this.m_prev = null;
        this.m_body1 = a.body1;
        this.m_body2 = a.body2;
        this.m_collideConnected = a.collideConnected;
        this.m_islandFlag = !1;
        this.m_userData = a.userData;
        this.K = new b2Mat22;
        this.K1 = new b2Mat22;
        this.K2 = new b2Mat22;
        this.m_localAnchor = new b2Vec2;
        this.m_target = new b2Vec2;
        this.m_impulse = new b2Vec2;
        this.m_ptpMass = new b2Mat22;
        this.m_C = new b2Vec2;
        this.m_target.SetV(a.target);
        var b = this.m_target.x - this.m_body2.m_position.x,
            c = this.m_target.y - this.m_body2.m_position.y;
        this.m_localAnchor.x = b * this.m_body2.m_R.col1.x +
            c * this.m_body2.m_R.col1.y;
        this.m_localAnchor.y = b * this.m_body2.m_R.col2.x + c * this.m_body2.m_R.col2.y;
        this.m_maxForce = a.maxForce;
        this.m_impulse.SetZero();
        var c = this.m_body2.m_mass,
            e = 2 * b2Settings.b2_pi * a.frequencyHz,
            b = 2 * c * a.dampingRatio * e,
            c = c * e * e;
        this.m_gamma = 1 / (b + a.timeStep * c);
        this.m_beta = a.timeStep * c / (b + a.timeStep * c)
    },
    K: new b2Mat22,
    K1: new b2Mat22,
    K2: new b2Mat22,
    PrepareVelocitySolver: function() {
        var a = this.m_body2,
            b;
        b = a.m_R;
        var c = b.col1.x * this.m_localAnchor.x + b.col2.x * this.m_localAnchor.y;
        b = b.col1.y *
            this.m_localAnchor.x + b.col2.y * this.m_localAnchor.y;
        var e = a.m_invMass,
            f = a.m_invI;
        this.K1.col1.x = e;
        this.K1.col2.x = 0;
        this.K1.col1.y = 0;
        this.K1.col2.y = e;
        this.K2.col1.x = f * b * b;
        this.K2.col2.x = -f * c * b;
        this.K2.col1.y = -f * c * b;
        this.K2.col2.y = f * c * c;
        this.K.SetM(this.K1);
        this.K.AddM(this.K2);
        this.K.col1.x += this.m_gamma;
        this.K.col2.y += this.m_gamma;
        this.K.Invert(this.m_ptpMass);
        this.m_C.x = a.m_position.x + c - this.m_target.x;
        this.m_C.y = a.m_position.y + b - this.m_target.y;
        a.m_angularVelocity *= 0.98;
        var g = this.m_impulse.x,
            h =
            this.m_impulse.y;
        a.m_linearVelocity.x += e * g;
        a.m_linearVelocity.y += e * h;
        a.m_angularVelocity += f * (c * h - b * g)
    },
    SolveVelocityConstraints: function(a) {
        var b = this.m_body2,
            c;
        c = b.m_R;
        var e = c.col1.x * this.m_localAnchor.x + c.col2.x * this.m_localAnchor.y,
            f = c.col1.y * this.m_localAnchor.x + c.col2.y * this.m_localAnchor.y,
            g = b.m_linearVelocity.x + -b.m_angularVelocity * f,
            h = b.m_linearVelocity.y + b.m_angularVelocity * e;
        c = this.m_ptpMass;
        var g = g + this.m_beta * a.inv_dt * this.m_C.x + this.m_gamma * this.m_impulse.x,
            i = h + this.m_beta * a.inv_dt * this.m_C.y +
            this.m_gamma * this.m_impulse.y,
            h = -(c.col1.x * g + c.col2.x * i),
            i = -(c.col1.y * g + c.col2.y * i);
        c = this.m_impulse.x;
        g = this.m_impulse.y;
        this.m_impulse.x += h;
        this.m_impulse.y += i;
        h = this.m_impulse.Length();
        h > a.dt * this.m_maxForce && this.m_impulse.Multiply(a.dt * this.m_maxForce / h);
        h = this.m_impulse.x - c;
        i = this.m_impulse.y - g;
        b.m_linearVelocity.x += b.m_invMass * h;
        b.m_linearVelocity.y += b.m_invMass * i;
        b.m_angularVelocity += b.m_invI * (e * i - f * h)
    },
    SolvePositionConstraints: function() {
        return !0
    },
    m_localAnchor: new b2Vec2,
    m_target: new b2Vec2,
    m_impulse: new b2Vec2,
    m_ptpMass: new b2Mat22,
    m_C: new b2Vec2,
    m_maxForce: null,
    m_beta: null,
    m_gamma: null
});
var b2MouseJointDef = Class.create();
Object.extend(b2MouseJointDef.prototype, b2JointDef.prototype);
Object.extend(b2MouseJointDef.prototype, {
    initialize: function() {
        this.type = b2Joint.e_unknownJoint;
        this.body2 = this.body1 = this.userData = null;
        this.collideConnected = !1;
        this.target = new b2Vec2;
        this.type = b2Joint.e_mouseJoint;
        this.maxForce = 0;
        this.frequencyHz = 5;
        this.dampingRatio = 0.7;
        this.timeStep = 1 / 60
    },
    target: new b2Vec2,
    maxForce: null,
    frequencyHz: null,
    dampingRatio: null,
    timeStep: null
});
var b2PrismaticJoint = Class.create();
Object.extend(b2PrismaticJoint.prototype, b2Joint.prototype);
Object.extend(b2PrismaticJoint.prototype, {
    GetAnchor1: function() {
        var a = this.m_body1,
            b = new b2Vec2;
        b.SetV(this.m_localAnchor1);
        b.MulM(a.m_R);
        b.Add(a.m_position);
        return b
    },
    GetAnchor2: function() {
        var a = this.m_body2,
            b = new b2Vec2;
        b.SetV(this.m_localAnchor2);
        b.MulM(a.m_R);
        b.Add(a.m_position);
        return b
    },
    GetJointTranslation: function() {
        var a = this.m_body1,
            b = this.m_body2,
            c;
        c = a.m_R;
        var e = c.col1.x * this.m_localAnchor1.x + c.col2.x * this.m_localAnchor1.y,
            f = c.col1.y * this.m_localAnchor1.x + c.col2.y * this.m_localAnchor1.y;
        c = b.m_R;
        e = b.m_position.x + (c.col1.x * this.m_localAnchor2.x + c.col2.x * this.m_localAnchor2.y) - (a.m_position.x + e);
        b = b.m_position.y + (c.col1.y * this.m_localAnchor2.x + c.col2.y * this.m_localAnchor2.y) - (a.m_position.y + f);
        c = a.m_R;
        return (c.col1.x * this.m_localXAxis1.x + c.col2.x * this.m_localXAxis1.y) * e + (c.col1.y * this.m_localXAxis1.x + c.col2.y * this.m_localXAxis1.y) * b
    },
    GetJointSpeed: function() {
        var a = this.m_body1,
            b = this.m_body2,
            c;
        c = a.m_R;
        var e = c.col1.x * this.m_localAnchor1.x + c.col2.x * this.m_localAnchor1.y,
            f = c.col1.y * this.m_localAnchor1.x +
            c.col2.y * this.m_localAnchor1.y;
        c = b.m_R;
        var g = c.col1.x * this.m_localAnchor2.x + c.col2.x * this.m_localAnchor2.y,
            h = c.col1.y * this.m_localAnchor2.x + c.col2.y * this.m_localAnchor2.y,
            i = b.m_position.x + g - (a.m_position.x + e),
            j = b.m_position.y + h - (a.m_position.y + f);
        c = a.m_R;
        var k = c.col1.x * this.m_localXAxis1.x + c.col2.x * this.m_localXAxis1.y;
        c = c.col1.y * this.m_localXAxis1.x + c.col2.y * this.m_localXAxis1.y;
        var l = a.m_linearVelocity,
            m = b.m_linearVelocity,
            a = a.m_angularVelocity,
            b = b.m_angularVelocity;
        return i * -a * c + j * a * k + (k * (m.x +
            -b * h - l.x - -a * f) + c * (m.y + b * g - l.y - a * e))
    },
    GetMotorForce: function(a) {
        return a * this.m_motorImpulse
    },
    SetMotorSpeed: function(a) {
        this.m_motorSpeed = a
    },
    SetMotorForce: function(a) {
        this.m_maxMotorForce = a
    },
    GetReactionForce: function(a) {
        var a = a * this.m_limitImpulse,
            b;
        b = this.m_body1.m_R;
        return new b2Vec2(a * (b.col1.x * this.m_localXAxis1.x + b.col2.x * this.m_localXAxis1.y) + a * (b.col1.x * this.m_localYAxis1.x + b.col2.x * this.m_localYAxis1.y), a * (b.col1.y * this.m_localXAxis1.x + b.col2.y * this.m_localXAxis1.y) + a * (b.col1.y * this.m_localYAxis1.x +
            b.col2.y * this.m_localYAxis1.y))
    },
    GetReactionTorque: function(a) {
        return a * this.m_angularImpulse
    },
    initialize: function(a) {
        this.m_node1 = new b2JointNode;
        this.m_node2 = new b2JointNode;
        this.m_type = a.type;
        this.m_next = this.m_prev = null;
        this.m_body1 = a.body1;
        this.m_body2 = a.body2;
        this.m_collideConnected = a.collideConnected;
        this.m_islandFlag = !1;
        this.m_userData = a.userData;
        this.m_localAnchor1 = new b2Vec2;
        this.m_localAnchor2 = new b2Vec2;
        this.m_localXAxis1 = new b2Vec2;
        this.m_localYAxis1 = new b2Vec2;
        this.m_linearJacobian =
            new b2Jacobian;
        this.m_motorJacobian = new b2Jacobian;
        var b, c, e;
        b = this.m_body1.m_R;
        c = a.anchorPoint.x - this.m_body1.m_position.x;
        e = a.anchorPoint.y - this.m_body1.m_position.y;
        this.m_localAnchor1.Set(c * b.col1.x + e * b.col1.y, c * b.col2.x + e * b.col2.y);
        b = this.m_body2.m_R;
        c = a.anchorPoint.x - this.m_body2.m_position.x;
        e = a.anchorPoint.y - this.m_body2.m_position.y;
        this.m_localAnchor2.Set(c * b.col1.x + e * b.col1.y, c * b.col2.x + e * b.col2.y);
        b = this.m_body1.m_R;
        c = a.axis.x;
        e = a.axis.y;
        this.m_localXAxis1.Set(c * b.col1.x + e * b.col1.y, c *
            b.col2.x + e * b.col2.y);
        this.m_localYAxis1.x = -this.m_localXAxis1.y;
        this.m_localYAxis1.y = this.m_localXAxis1.x;
        this.m_initialAngle = this.m_body2.m_rotation - this.m_body1.m_rotation;
        this.m_linearJacobian.SetZero();
        this.m_angularImpulse = this.m_angularMass = this.m_linearImpulse = this.m_linearMass = 0;
        this.m_motorJacobian.SetZero();
        this.m_limitPositionImpulse = this.m_limitImpulse = this.m_motorImpulse = this.m_motorMass = 0;
        this.m_lowerTranslation = a.lowerTranslation;
        this.m_upperTranslation = a.upperTranslation;
        this.m_maxMotorForce =
            a.motorForce;
        this.m_motorSpeed = a.motorSpeed;
        this.m_enableLimit = a.enableLimit;
        this.m_enableMotor = a.enableMotor
    },
    PrepareVelocitySolver: function() {
        var a = this.m_body1,
            b = this.m_body2,
            c;
        c = a.m_R;
        var e = c.col1.x * this.m_localAnchor1.x + c.col2.x * this.m_localAnchor1.y,
            f = c.col1.y * this.m_localAnchor1.x + c.col2.y * this.m_localAnchor1.y;
        c = b.m_R;
        var g = c.col1.x * this.m_localAnchor2.x + c.col2.x * this.m_localAnchor2.y,
            h = c.col1.y * this.m_localAnchor2.x + c.col2.y * this.m_localAnchor2.y,
            i = a.m_invMass,
            j = b.m_invMass,
            k = a.m_invI,
            l =
            b.m_invI;
        c = a.m_R;
        var m = c.col1.x * this.m_localYAxis1.x + c.col2.x * this.m_localYAxis1.y;
        c = c.col1.y * this.m_localYAxis1.x + c.col2.y * this.m_localYAxis1.y;
        var o = b.m_position.x + g - a.m_position.x,
            n = b.m_position.y + h - a.m_position.y;
        this.m_linearJacobian.linear1.x = -m;
        this.m_linearJacobian.linear1.y = -c;
        this.m_linearJacobian.linear2.x = m;
        this.m_linearJacobian.linear2.y = c;
        this.m_linearJacobian.angular1 = -(o * c - n * m);
        this.m_linearJacobian.angular2 = g * c - h * m;
        this.m_linearMass = i + k * this.m_linearJacobian.angular1 * this.m_linearJacobian.angular1 +
            j + l * this.m_linearJacobian.angular2 * this.m_linearJacobian.angular2;
        this.m_linearMass = 1 / this.m_linearMass;
        this.m_angularMass = 1 / (k + l);
        if (this.m_enableLimit || this.m_enableMotor)
            if (c = a.m_R, m = c.col1.x * this.m_localXAxis1.x + c.col2.x * this.m_localXAxis1.y, c = c.col1.y * this.m_localXAxis1.x + c.col2.y * this.m_localXAxis1.y, this.m_motorJacobian.linear1.x = -m, this.m_motorJacobian.linear1.y = -c, this.m_motorJacobian.linear2.x = m, this.m_motorJacobian.linear2.y = c, this.m_motorJacobian.angular1 = -(o * c - n * m), this.m_motorJacobian.angular2 =
                g * c - h * m, this.m_motorMass = i + k * this.m_motorJacobian.angular1 * this.m_motorJacobian.angular1 + j + l * this.m_motorJacobian.angular2 * this.m_motorJacobian.angular2, this.m_motorMass = 1 / this.m_motorMass, this.m_enableLimit)
                if (e = m * (o - e) + c * (n - f), b2Math.b2Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2 * b2Settings.b2_linearSlop) this.m_limitState = b2Joint.e_equalLimits;
                else if (e <= this.m_lowerTranslation) {
            if (this.m_limitState != b2Joint.e_atLowerLimit) this.m_limitImpulse = 0;
            this.m_limitState = b2Joint.e_atLowerLimit
        } else if (e >=
            this.m_upperTranslation) {
            if (this.m_limitState != b2Joint.e_atUpperLimit) this.m_limitImpulse = 0;
            this.m_limitState = b2Joint.e_atUpperLimit
        } else this.m_limitState = b2Joint.e_inactiveLimit, this.m_limitImpulse = 0;
        if (!1 == this.m_enableMotor) this.m_motorImpulse = 0;
        if (!1 == this.m_enableLimit) this.m_limitImpulse = 0;
        b2World.s_enableWarmStarting ? (e = this.m_linearImpulse * this.m_linearJacobian.linear1.y + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.linear1.y, f = this.m_linearImpulse * this.m_linearJacobian.linear2.x +
            (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.linear2.x, g = this.m_linearImpulse * this.m_linearJacobian.linear2.y + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.linear2.y, h = this.m_linearImpulse * this.m_linearJacobian.angular1 - this.m_angularImpulse + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.angular1, o = this.m_linearImpulse * this.m_linearJacobian.angular2 + this.m_angularImpulse + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.angular2, a.m_linearVelocity.x +=
            i * (this.m_linearImpulse * this.m_linearJacobian.linear1.x + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.linear1.x), a.m_linearVelocity.y += i * e, a.m_angularVelocity += k * h, b.m_linearVelocity.x += j * f, b.m_linearVelocity.y += j * g, b.m_angularVelocity += l * o) : this.m_motorImpulse = this.m_limitImpulse = this.m_angularImpulse = this.m_linearImpulse = 0;
        this.m_limitPositionImpulse = 0
    },
    SolveVelocityConstraints: function(a) {
        var b = this.m_body1,
            c = this.m_body2,
            e = b.m_invMass,
            f = c.m_invMass,
            g = b.m_invI,
            h = c.m_invI,
            i = -this.m_linearMass *
            this.m_linearJacobian.Compute(b.m_linearVelocity, b.m_angularVelocity, c.m_linearVelocity, c.m_angularVelocity);
        this.m_linearImpulse += i;
        b.m_linearVelocity.x += e * i * this.m_linearJacobian.linear1.x;
        b.m_linearVelocity.y += e * i * this.m_linearJacobian.linear1.y;
        b.m_angularVelocity += g * i * this.m_linearJacobian.angular1;
        c.m_linearVelocity.x += f * i * this.m_linearJacobian.linear2.x;
        c.m_linearVelocity.y += f * i * this.m_linearJacobian.linear2.y;
        c.m_angularVelocity += h * i * this.m_linearJacobian.angular2;
        i = -this.m_angularMass * (c.m_angularVelocity -
            b.m_angularVelocity);
        this.m_angularImpulse += i;
        b.m_angularVelocity -= g * i;
        c.m_angularVelocity += h * i;
        if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
            var i = -this.m_motorMass * (this.m_motorJacobian.Compute(b.m_linearVelocity, b.m_angularVelocity, c.m_linearVelocity, c.m_angularVelocity) - this.m_motorSpeed),
                j = this.m_motorImpulse;
            this.m_motorImpulse = b2Math.b2Clamp(this.m_motorImpulse + i, -a.dt * this.m_maxMotorForce, a.dt * this.m_maxMotorForce);
            i = this.m_motorImpulse - j;
            b.m_linearVelocity.x += e * i * this.m_motorJacobian.linear1.x;
            b.m_linearVelocity.y += e * i * this.m_motorJacobian.linear1.y;
            b.m_angularVelocity += g * i * this.m_motorJacobian.angular1;
            c.m_linearVelocity.x += f * i * this.m_motorJacobian.linear2.x;
            c.m_linearVelocity.y += f * i * this.m_motorJacobian.linear2.y;
            c.m_angularVelocity += h * i * this.m_motorJacobian.angular2
        }
        if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
            i = -this.m_motorMass * this.m_motorJacobian.Compute(b.m_linearVelocity, b.m_angularVelocity, c.m_linearVelocity, c.m_angularVelocity);
            if (this.m_limitState == b2Joint.e_equalLimits) this.m_limitImpulse +=
                i;
            else if (this.m_limitState == b2Joint.e_atLowerLimit) a = this.m_limitImpulse, this.m_limitImpulse = b2Math.b2Max(this.m_limitImpulse + i, 0), i = this.m_limitImpulse - a;
            else if (this.m_limitState == b2Joint.e_atUpperLimit) a = this.m_limitImpulse, this.m_limitImpulse = b2Math.b2Min(this.m_limitImpulse + i, 0), i = this.m_limitImpulse - a;
            b.m_linearVelocity.x += e * i * this.m_motorJacobian.linear1.x;
            b.m_linearVelocity.y += e * i * this.m_motorJacobian.linear1.y;
            b.m_angularVelocity += g * i * this.m_motorJacobian.angular1;
            c.m_linearVelocity.x +=
                f * i * this.m_motorJacobian.linear2.x;
            c.m_linearVelocity.y += f * i * this.m_motorJacobian.linear2.y;
            c.m_angularVelocity += h * i * this.m_motorJacobian.angular2
        }
    },
    SolvePositionConstraints: function() {
        var a, b, c = this.m_body1,
            e = this.m_body2,
            f = c.m_invMass,
            g = e.m_invMass,
            h = c.m_invI,
            i = e.m_invI;
        a = c.m_R;
        var j = a.col1.x * this.m_localAnchor1.x + a.col2.x * this.m_localAnchor1.y,
            k = a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y;
        a = e.m_R;
        var l = a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y;
        a = a.col1.y * this.m_localAnchor2.x +
            a.col2.y * this.m_localAnchor2.y;
        var j = c.m_position.x + j,
            k = c.m_position.y + k,
            l = e.m_position.x + l,
            m = e.m_position.y + a;
        a = c.m_R;
        var o = (a.col1.x * this.m_localYAxis1.x + a.col2.x * this.m_localYAxis1.y) * (l - j) + (a.col1.y * this.m_localYAxis1.x + a.col2.y * this.m_localYAxis1.y) * (m - k),
            o = b2Math.b2Clamp(o, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection);
        b = -this.m_linearMass * o;
        c.m_position.x += f * b * this.m_linearJacobian.linear1.x;
        c.m_position.y += f * b * this.m_linearJacobian.linear1.y;
        c.m_rotation += h * b * this.m_linearJacobian.angular1;
        e.m_position.x += g * b * this.m_linearJacobian.linear2.x;
        e.m_position.y += g * b * this.m_linearJacobian.linear2.y;
        e.m_rotation += i * b * this.m_linearJacobian.angular2;
        o = b2Math.b2Abs(o);
        b = e.m_rotation - c.m_rotation - this.m_initialAngle;
        b = b2Math.b2Clamp(b, -b2Settings.b2_maxAngularCorrection, b2Settings.b2_maxAngularCorrection);
        var n = -this.m_angularMass * b;
        c.m_rotation -= c.m_invI * n;
        c.m_R.Set(c.m_rotation);
        e.m_rotation += e.m_invI * n;
        e.m_R.Set(e.m_rotation);
        n = b2Math.b2Abs(b);
        if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
            a =
                c.m_R;
            j = a.col1.x * this.m_localAnchor1.x + a.col2.x * this.m_localAnchor1.y;
            k = a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y;
            a = e.m_R;
            l = a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y;
            a = a.col1.y * this.m_localAnchor2.x + a.col2.y * this.m_localAnchor2.y;
            j = c.m_position.x + j;
            k = c.m_position.y + k;
            l = e.m_position.x + l;
            m = e.m_position.y + a;
            a = c.m_R;
            j = (a.col1.x * this.m_localXAxis1.x + a.col2.x * this.m_localXAxis1.y) * (l - j) + (a.col1.y * this.m_localXAxis1.x + a.col2.y * this.m_localXAxis1.y) * (m - k);
            a = 0;
            if (this.m_limitState ==
                b2Joint.e_equalLimits) a = b2Math.b2Clamp(j, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection), a *= -this.m_motorMass, o = b2Math.b2Max(o, b2Math.b2Abs(b));
            else if (this.m_limitState == b2Joint.e_atLowerLimit) a = j - this.m_lowerTranslation, o = b2Math.b2Max(o, -a), a = b2Math.b2Clamp(a + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0), a *= -this.m_motorMass, b = this.m_limitPositionImpulse, this.m_limitPositionImpulse = b2Math.b2Max(this.m_limitPositionImpulse + a, 0), a = this.m_limitPositionImpulse -
                b;
            else if (this.m_limitState == b2Joint.e_atUpperLimit) a = j - this.m_upperTranslation, o = b2Math.b2Max(o, a), a = b2Math.b2Clamp(a - b2Settings.b2_linearSlop, 0, b2Settings.b2_maxLinearCorrection), a *= -this.m_motorMass, b = this.m_limitPositionImpulse, this.m_limitPositionImpulse = b2Math.b2Min(this.m_limitPositionImpulse + a, 0), a = this.m_limitPositionImpulse - b;
            c.m_position.x += f * a * this.m_motorJacobian.linear1.x;
            c.m_position.y += f * a * this.m_motorJacobian.linear1.y;
            c.m_rotation += h * a * this.m_motorJacobian.angular1;
            c.m_R.Set(c.m_rotation);
            e.m_position.x += g * a * this.m_motorJacobian.linear2.x;
            e.m_position.y += g * a * this.m_motorJacobian.linear2.y;
            e.m_rotation += i * a * this.m_motorJacobian.angular2;
            e.m_R.Set(e.m_rotation)
        }
        return o <= b2Settings.b2_linearSlop && n <= b2Settings.b2_angularSlop
    },
    m_localAnchor1: new b2Vec2,
    m_localAnchor2: new b2Vec2,
    m_localXAxis1: new b2Vec2,
    m_localYAxis1: new b2Vec2,
    m_initialAngle: null,
    m_linearJacobian: new b2Jacobian,
    m_linearMass: null,
    m_linearImpulse: null,
    m_angularMass: null,
    m_angularImpulse: null,
    m_motorJacobian: new b2Jacobian,
    m_motorMass: null,
    m_motorImpulse: null,
    m_limitImpulse: null,
    m_limitPositionImpulse: null,
    m_lowerTranslation: null,
    m_upperTranslation: null,
    m_maxMotorForce: null,
    m_motorSpeed: null,
    m_enableLimit: null,
    m_enableMotor: null,
    m_limitState: 0
});
var b2PrismaticJointDef = Class.create();
Object.extend(b2PrismaticJointDef.prototype, b2JointDef.prototype);
Object.extend(b2PrismaticJointDef.prototype, {
    initialize: function() {
        this.type = b2Joint.e_unknownJoint;
        this.body2 = this.body1 = this.userData = null;
        this.collideConnected = !1;
        this.type = b2Joint.e_prismaticJoint;
        this.anchorPoint = new b2Vec2(0, 0);
        this.axis = new b2Vec2(0, 0);
        this.motorSpeed = this.motorForce = this.upperTranslation = this.lowerTranslation = 0;
        this.enableMotor = this.enableLimit = !1
    },
    anchorPoint: null,
    axis: null,
    lowerTranslation: null,
    upperTranslation: null,
    motorForce: null,
    motorSpeed: null,
    enableLimit: null,
    enableMotor: null
});
var b2PulleyJoint = Class.create();
Object.extend(b2PulleyJoint.prototype, b2Joint.prototype);
Object.extend(b2PulleyJoint.prototype, {
    GetAnchor1: function() {
        var a = this.m_body1.m_R;
        return new b2Vec2(this.m_body1.m_position.x + (a.col1.x * this.m_localAnchor1.x + a.col2.x * this.m_localAnchor1.y), this.m_body1.m_position.y + (a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y))
    },
    GetAnchor2: function() {
        var a = this.m_body2.m_R;
        return new b2Vec2(this.m_body2.m_position.x + (a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y), this.m_body2.m_position.y + (a.col1.y * this.m_localAnchor2.x + a.col2.y *
            this.m_localAnchor2.y))
    },
    GetGroundPoint1: function() {
        return new b2Vec2(this.m_ground.m_position.x + this.m_groundAnchor1.x, this.m_ground.m_position.y + this.m_groundAnchor1.y)
    },
    GetGroundPoint2: function() {
        return new b2Vec2(this.m_ground.m_position.x + this.m_groundAnchor2.x, this.m_ground.m_position.y + this.m_groundAnchor2.y)
    },
    GetReactionForce: function() {
        return new b2Vec2
    },
    GetReactionTorque: function() {
        return 0
    },
    GetLength1: function() {
        var a;
        a = this.m_body1.m_R;
        var b = this.m_body1.m_position.x + (a.col1.x * this.m_localAnchor1.x +
            a.col2.x * this.m_localAnchor1.y) - (this.m_ground.m_position.x + this.m_groundAnchor1.x);
        a = this.m_body1.m_position.y + (a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y) - (this.m_ground.m_position.y + this.m_groundAnchor1.y);
        return Math.sqrt(b * b + a * a)
    },
    GetLength2: function() {
        var a;
        a = this.m_body2.m_R;
        var b = this.m_body2.m_position.x + (a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y) - (this.m_ground.m_position.x + this.m_groundAnchor2.x);
        a = this.m_body2.m_position.y + (a.col1.y * this.m_localAnchor2.x +
            a.col2.y * this.m_localAnchor2.y) - (this.m_ground.m_position.y + this.m_groundAnchor2.y);
        return Math.sqrt(b * b + a * a)
    },
    GetRatio: function() {
        return this.m_ratio
    },
    initialize: function(a) {
        this.m_node1 = new b2JointNode;
        this.m_node2 = new b2JointNode;
        this.m_type = a.type;
        this.m_next = this.m_prev = null;
        this.m_body1 = a.body1;
        this.m_body2 = a.body2;
        this.m_collideConnected = a.collideConnected;
        this.m_islandFlag = !1;
        this.m_userData = a.userData;
        this.m_groundAnchor1 = new b2Vec2;
        this.m_groundAnchor2 = new b2Vec2;
        this.m_localAnchor1 = new b2Vec2;
        this.m_localAnchor2 = new b2Vec2;
        this.m_u1 = new b2Vec2;
        this.m_u2 = new b2Vec2;
        var b, c, e;
        this.m_ground = this.m_body1.m_world.m_groundBody;
        this.m_groundAnchor1.x = a.groundPoint1.x - this.m_ground.m_position.x;
        this.m_groundAnchor1.y = a.groundPoint1.y - this.m_ground.m_position.y;
        this.m_groundAnchor2.x = a.groundPoint2.x - this.m_ground.m_position.x;
        this.m_groundAnchor2.y = a.groundPoint2.y - this.m_ground.m_position.y;
        b = this.m_body1.m_R;
        c = a.anchorPoint1.x - this.m_body1.m_position.x;
        e = a.anchorPoint1.y - this.m_body1.m_position.y;
        this.m_localAnchor1.x = c * b.col1.x + e * b.col1.y;
        this.m_localAnchor1.y = c * b.col2.x + e * b.col2.y;
        b = this.m_body2.m_R;
        c = a.anchorPoint2.x - this.m_body2.m_position.x;
        e = a.anchorPoint2.y - this.m_body2.m_position.y;
        this.m_localAnchor2.x = c * b.col1.x + e * b.col1.y;
        this.m_localAnchor2.y = c * b.col2.x + e * b.col2.y;
        this.m_ratio = a.ratio;
        c = a.groundPoint1.x - a.anchorPoint1.x;
        e = a.groundPoint1.y - a.anchorPoint1.y;
        b = Math.sqrt(c * c + e * e);
        c = a.groundPoint2.x - a.anchorPoint2.x;
        e = a.groundPoint2.y - a.anchorPoint2.y;
        c = Math.sqrt(c * c + e * e);
        e = b2Math.b2Max(0.5 *
            b2PulleyJoint.b2_minPulleyLength, b);
        c = b2Math.b2Max(0.5 * b2PulleyJoint.b2_minPulleyLength, c);
        this.m_constant = e + this.m_ratio * c;
        this.m_maxLength1 = b2Math.b2Clamp(a.maxLength1, e, this.m_constant - this.m_ratio * b2PulleyJoint.b2_minPulleyLength);
        this.m_maxLength2 = b2Math.b2Clamp(a.maxLength2, c, (this.m_constant - b2PulleyJoint.b2_minPulleyLength) / this.m_ratio);
        this.m_limitImpulse2 = this.m_limitImpulse1 = this.m_pulleyImpulse = 0
    },
    PrepareVelocitySolver: function() {
        var a = this.m_body1,
            b = this.m_body2,
            c;
        c = a.m_R;
        var e = c.col1.x *
            this.m_localAnchor1.x + c.col2.x * this.m_localAnchor1.y,
            f = c.col1.y * this.m_localAnchor1.x + c.col2.y * this.m_localAnchor1.y;
        c = b.m_R;
        var g = c.col1.x * this.m_localAnchor2.x + c.col2.x * this.m_localAnchor2.y;
        c = c.col1.y * this.m_localAnchor2.x + c.col2.y * this.m_localAnchor2.y;
        var h = b.m_position.x + g,
            i = b.m_position.y + c,
            j = this.m_ground.m_position.x + this.m_groundAnchor2.x,
            k = this.m_ground.m_position.y + this.m_groundAnchor2.y;
        this.m_u1.Set(a.m_position.x + e - (this.m_ground.m_position.x + this.m_groundAnchor1.x), a.m_position.y +
            f - (this.m_ground.m_position.y + this.m_groundAnchor1.y));
        this.m_u2.Set(h - j, i - k);
        h = this.m_u1.Length();
        i = this.m_u2.Length();
        h > b2Settings.b2_linearSlop ? this.m_u1.Multiply(1 / h) : this.m_u1.SetZero();
        i > b2Settings.b2_linearSlop ? this.m_u2.Multiply(1 / i) : this.m_u2.SetZero();
        h < this.m_maxLength1 ? (this.m_limitState1 = b2Joint.e_inactiveLimit, this.m_limitImpulse1 = 0) : (this.m_limitState1 = b2Joint.e_atUpperLimit, this.m_limitPositionImpulse1 = 0);
        i < this.m_maxLength2 ? (this.m_limitState2 = b2Joint.e_inactiveLimit, this.m_limitImpulse2 =
            0) : (this.m_limitState2 = b2Joint.e_atUpperLimit, this.m_limitPositionImpulse2 = 0);
        h = e * this.m_u1.y - f * this.m_u1.x;
        i = g * this.m_u2.y - c * this.m_u2.x;
        this.m_limitMass1 = a.m_invMass + a.m_invI * h * h;
        this.m_limitMass2 = b.m_invMass + b.m_invI * i * i;
        this.m_pulleyMass = this.m_limitMass1 + this.m_ratio * this.m_ratio * this.m_limitMass2;
        this.m_limitMass1 = 1 / this.m_limitMass1;
        this.m_limitMass2 = 1 / this.m_limitMass2;
        this.m_pulleyMass = 1 / this.m_pulleyMass;
        h = (-this.m_pulleyImpulse - this.m_limitImpulse1) * this.m_u1.x;
        i = (-this.m_pulleyImpulse -
            this.m_limitImpulse1) * this.m_u1.y;
        j = (-this.m_ratio * this.m_pulleyImpulse - this.m_limitImpulse2) * this.m_u2.x;
        k = (-this.m_ratio * this.m_pulleyImpulse - this.m_limitImpulse2) * this.m_u2.y;
        a.m_linearVelocity.x += a.m_invMass * h;
        a.m_linearVelocity.y += a.m_invMass * i;
        a.m_angularVelocity += a.m_invI * (e * i - f * h);
        b.m_linearVelocity.x += b.m_invMass * j;
        b.m_linearVelocity.y += b.m_invMass * k;
        b.m_angularVelocity += b.m_invI * (g * k - c * j)
    },
    SolveVelocityConstraints: function() {
        var a = this.m_body1,
            b = this.m_body2,
            c;
        c = a.m_R;
        var e = c.col1.x * this.m_localAnchor1.x +
            c.col2.x * this.m_localAnchor1.y,
            f = c.col1.y * this.m_localAnchor1.x + c.col2.y * this.m_localAnchor1.y;
        c = b.m_R;
        var g = c.col1.x * this.m_localAnchor2.x + c.col2.x * this.m_localAnchor2.y;
        c = c.col1.y * this.m_localAnchor2.x + c.col2.y * this.m_localAnchor2.y;
        var h, i, j, k;
        h = a.m_linearVelocity.x + -a.m_angularVelocity * f;
        i = a.m_linearVelocity.y + a.m_angularVelocity * e;
        j = b.m_linearVelocity.x + -b.m_angularVelocity * c;
        k = b.m_linearVelocity.y + b.m_angularVelocity * g;
        h = -(this.m_u1.x * h + this.m_u1.y * i) - this.m_ratio * (this.m_u2.x * j + this.m_u2.y *
            k);
        k = -this.m_pulleyMass * h;
        this.m_pulleyImpulse += k;
        h = -k * this.m_u1.x;
        i = -k * this.m_u1.y;
        j = -this.m_ratio * k * this.m_u2.x;
        k = -this.m_ratio * k * this.m_u2.y;
        a.m_linearVelocity.x += a.m_invMass * h;
        a.m_linearVelocity.y += a.m_invMass * i;
        a.m_angularVelocity += a.m_invI * (e * i - f * h);
        b.m_linearVelocity.x += b.m_invMass * j;
        b.m_linearVelocity.y += b.m_invMass * k;
        b.m_angularVelocity += b.m_invI * (g * k - c * j);
        if (this.m_limitState1 == b2Joint.e_atUpperLimit) h = a.m_linearVelocity.x + -a.m_angularVelocity * f, i = a.m_linearVelocity.y + a.m_angularVelocity *
            e, h = -(this.m_u1.x * h + this.m_u1.y * i), k = -this.m_limitMass1 * h, h = this.m_limitImpulse1, this.m_limitImpulse1 = b2Math.b2Max(0, this.m_limitImpulse1 + k), k = this.m_limitImpulse1 - h, h = -k * this.m_u1.x, i = -k * this.m_u1.y, a.m_linearVelocity.x += a.m_invMass * h, a.m_linearVelocity.y += a.m_invMass * i, a.m_angularVelocity += a.m_invI * (e * i - f * h);
        if (this.m_limitState2 == b2Joint.e_atUpperLimit) j = b.m_linearVelocity.x + -b.m_angularVelocity * c, k = b.m_linearVelocity.y + b.m_angularVelocity * g, h = -(this.m_u2.x * j + this.m_u2.y * k), k = -this.m_limitMass2 *
            h, h = this.m_limitImpulse2, this.m_limitImpulse2 = b2Math.b2Max(0, this.m_limitImpulse2 + k), k = this.m_limitImpulse2 - h, j = -k * this.m_u2.x, k = -k * this.m_u2.y, b.m_linearVelocity.x += b.m_invMass * j, b.m_linearVelocity.y += b.m_invMass * k, b.m_angularVelocity += b.m_invI * (g * k - c * j)
    },
    SolvePositionConstraints: function() {
        var a = this.m_body1,
            b = this.m_body2,
            c, e = this.m_ground.m_position.x + this.m_groundAnchor1.x,
            f = this.m_ground.m_position.y + this.m_groundAnchor1.y,
            g = this.m_ground.m_position.x + this.m_groundAnchor2.x,
            h = this.m_ground.m_position.y +
            this.m_groundAnchor2.y,
            i, j, k, l, m, o, n, p = 0;
        c = a.m_R;
        i = c.col1.x * this.m_localAnchor1.x + c.col2.x * this.m_localAnchor1.y;
        j = c.col1.y * this.m_localAnchor1.x + c.col2.y * this.m_localAnchor1.y;
        c = b.m_R;
        k = c.col1.x * this.m_localAnchor2.x + c.col2.x * this.m_localAnchor2.y;
        c = c.col1.y * this.m_localAnchor2.x + c.col2.y * this.m_localAnchor2.y;
        l = a.m_position.x + i;
        m = a.m_position.y + j;
        o = b.m_position.x + k;
        n = b.m_position.y + c;
        this.m_u1.Set(l - e, m - f);
        this.m_u2.Set(o - g, n - h);
        l = this.m_u1.Length();
        m = this.m_u2.Length();
        l > b2Settings.b2_linearSlop ?
            this.m_u1.Multiply(1 / l) : this.m_u1.SetZero();
        m > b2Settings.b2_linearSlop ? this.m_u2.Multiply(1 / m) : this.m_u2.SetZero();
        l = this.m_constant - l - this.m_ratio * m;
        p = b2Math.b2Max(p, Math.abs(l));
        l = b2Math.b2Clamp(l, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection);
        n = -this.m_pulleyMass * l;
        l = -n * this.m_u1.x;
        m = -n * this.m_u1.y;
        o = -this.m_ratio * n * this.m_u2.x;
        n = -this.m_ratio * n * this.m_u2.y;
        a.m_position.x += a.m_invMass * l;
        a.m_position.y += a.m_invMass * m;
        a.m_rotation += a.m_invI * (i * m - j * l);
        b.m_position.x += b.m_invMass *
            o;
        b.m_position.y += b.m_invMass * n;
        b.m_rotation += b.m_invI * (k * n - c * o);
        a.m_R.Set(a.m_rotation);
        b.m_R.Set(b.m_rotation);
        if (this.m_limitState1 == b2Joint.e_atUpperLimit) c = a.m_R, i = c.col1.x * this.m_localAnchor1.x + c.col2.x * this.m_localAnchor1.y, j = c.col1.y * this.m_localAnchor1.x + c.col2.y * this.m_localAnchor1.y, l = a.m_position.x + i, m = a.m_position.y + j, this.m_u1.Set(l - e, m - f), l = this.m_u1.Length(), l > b2Settings.b2_linearSlop ? (this.m_u1.x *= 1 / l, this.m_u1.y *= 1 / l) : this.m_u1.SetZero(), l = this.m_maxLength1 - l, p = b2Math.b2Max(p, -l),
            l = b2Math.b2Clamp(l + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0), n = -this.m_limitMass1 * l, e = this.m_limitPositionImpulse1, this.m_limitPositionImpulse1 = b2Math.b2Max(0, this.m_limitPositionImpulse1 + n), n = this.m_limitPositionImpulse1 - e, l = -n * this.m_u1.x, m = -n * this.m_u1.y, a.m_position.x += a.m_invMass * l, a.m_position.y += a.m_invMass * m, a.m_rotation += a.m_invI * (i * m - j * l), a.m_R.Set(a.m_rotation);
        if (this.m_limitState2 == b2Joint.e_atUpperLimit) c = b.m_R, k = c.col1.x * this.m_localAnchor2.x + c.col2.x * this.m_localAnchor2.y,
            c = c.col1.y * this.m_localAnchor2.x + c.col2.y * this.m_localAnchor2.y, o = b.m_position.x + k, n = b.m_position.y + c, this.m_u2.Set(o - g, n - h), m = this.m_u2.Length(), m > b2Settings.b2_linearSlop ? (this.m_u2.x *= 1 / m, this.m_u2.y *= 1 / m) : this.m_u2.SetZero(), l = this.m_maxLength2 - m, p = b2Math.b2Max(p, -l), l = b2Math.b2Clamp(l + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0), n = -this.m_limitMass2 * l, e = this.m_limitPositionImpulse2, this.m_limitPositionImpulse2 = b2Math.b2Max(0, this.m_limitPositionImpulse2 + n), n = this.m_limitPositionImpulse2 -
            e, o = -n * this.m_u2.x, n = -n * this.m_u2.y, b.m_position.x += b.m_invMass * o, b.m_position.y += b.m_invMass * n, b.m_rotation += b.m_invI * (k * n - c * o), b.m_R.Set(b.m_rotation);
        return p < b2Settings.b2_linearSlop
    },
    m_ground: null,
    m_groundAnchor1: new b2Vec2,
    m_groundAnchor2: new b2Vec2,
    m_localAnchor1: new b2Vec2,
    m_localAnchor2: new b2Vec2,
    m_u1: new b2Vec2,
    m_u2: new b2Vec2,
    m_constant: null,
    m_ratio: null,
    m_maxLength1: null,
    m_maxLength2: null,
    m_pulleyMass: null,
    m_limitMass1: null,
    m_limitMass2: null,
    m_pulleyImpulse: null,
    m_limitImpulse1: null,
    m_limitImpulse2: null,
    m_limitPositionImpulse1: null,
    m_limitPositionImpulse2: null,
    m_limitState1: 0,
    m_limitState2: 0
});
b2PulleyJoint.b2_minPulleyLength = b2Settings.b2_lengthUnitsPerMeter;
var b2PulleyJointDef = Class.create();
Object.extend(b2PulleyJointDef.prototype, b2JointDef.prototype);
Object.extend(b2PulleyJointDef.prototype, {
    initialize: function() {
        this.type = b2Joint.e_unknownJoint;
        this.body2 = this.body1 = this.userData = null;
        this.collideConnected = !1;
        this.groundPoint1 = new b2Vec2;
        this.groundPoint2 = new b2Vec2;
        this.anchorPoint1 = new b2Vec2;
        this.anchorPoint2 = new b2Vec2;
        this.type = b2Joint.e_pulleyJoint;
        this.groundPoint1.Set(-1, 1);
        this.groundPoint2.Set(1, 1);
        this.anchorPoint1.Set(-1, 0);
        this.anchorPoint2.Set(1, 0);
        this.maxLength1 = 0.5 * b2PulleyJoint.b2_minPulleyLength;
        this.maxLength2 = 0.5 * b2PulleyJoint.b2_minPulleyLength;
        this.ratio = 1;
        this.collideConnected = !0
    },
    groundPoint1: new b2Vec2,
    groundPoint2: new b2Vec2,
    anchorPoint1: new b2Vec2,
    anchorPoint2: new b2Vec2,
    maxLength1: null,
    maxLength2: null,
    ratio: null
});
var b2RevoluteJoint = Class.create();
Object.extend(b2RevoluteJoint.prototype, b2Joint.prototype);
Object.extend(b2RevoluteJoint.prototype, {
    GetAnchor1: function() {
        var a = this.m_body1.m_R;
        return new b2Vec2(this.m_body1.m_position.x + (a.col1.x * this.m_localAnchor1.x + a.col2.x * this.m_localAnchor1.y), this.m_body1.m_position.y + (a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y))
    },
    GetAnchor2: function() {
        var a = this.m_body2.m_R;
        return new b2Vec2(this.m_body2.m_position.x + (a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y), this.m_body2.m_position.y + (a.col1.y * this.m_localAnchor2.x + a.col2.y *
            this.m_localAnchor2.y))
    },
    GetJointAngle: function() {
        return this.m_body2.m_rotation - this.m_body1.m_rotation
    },
    GetJointSpeed: function() {
        return this.m_body2.m_angularVelocity - this.m_body1.m_angularVelocity
    },
    GetMotorTorque: function(a) {
        return a * this.m_motorImpulse
    },
    SetMotorSpeed: function(a) {
        this.m_motorSpeed = a
    },
    SetMotorTorque: function(a) {
        this.m_maxMotorTorque = a
    },
    GetReactionForce: function(a) {
        var b = this.m_ptpImpulse.Copy();
        b.Multiply(a);
        return b
    },
    GetReactionTorque: function(a) {
        return a * this.m_limitImpulse
    },
    initialize: function(a) {
        this.m_node1 = new b2JointNode;
        this.m_node2 = new b2JointNode;
        this.m_type = a.type;
        this.m_next = this.m_prev = null;
        this.m_body1 = a.body1;
        this.m_body2 = a.body2;
        this.m_collideConnected = a.collideConnected;
        this.m_islandFlag = !1;
        this.m_userData = a.userData;
        this.K = new b2Mat22;
        this.K1 = new b2Mat22;
        this.K2 = new b2Mat22;
        this.K3 = new b2Mat22;
        this.m_localAnchor1 = new b2Vec2;
        this.m_localAnchor2 = new b2Vec2;
        this.m_ptpImpulse = new b2Vec2;
        this.m_ptpMass = new b2Mat22;
        var b, c, e;
        b = this.m_body1.m_R;
        c = a.anchorPoint.x -
            this.m_body1.m_position.x;
        e = a.anchorPoint.y - this.m_body1.m_position.y;
        this.m_localAnchor1.x = c * b.col1.x + e * b.col1.y;
        this.m_localAnchor1.y = c * b.col2.x + e * b.col2.y;
        b = this.m_body2.m_R;
        c = a.anchorPoint.x - this.m_body2.m_position.x;
        e = a.anchorPoint.y - this.m_body2.m_position.y;
        this.m_localAnchor2.x = c * b.col1.x + e * b.col1.y;
        this.m_localAnchor2.y = c * b.col2.x + e * b.col2.y;
        this.m_intialAngle = this.m_body2.m_rotation - this.m_body1.m_rotation;
        this.m_ptpImpulse.Set(0, 0);
        this.m_limitPositionImpulse = this.m_limitImpulse = this.m_motorImpulse =
            0;
        this.m_lowerAngle = a.lowerAngle;
        this.m_upperAngle = a.upperAngle;
        this.m_maxMotorTorque = a.motorTorque;
        this.m_motorSpeed = a.motorSpeed;
        this.m_enableLimit = a.enableLimit;
        this.m_enableMotor = a.enableMotor
    },
    K: new b2Mat22,
    K1: new b2Mat22,
    K2: new b2Mat22,
    K3: new b2Mat22,
    PrepareVelocitySolver: function() {
        var a = this.m_body1,
            b = this.m_body2,
            c;
        c = a.m_R;
        var e = c.col1.x * this.m_localAnchor1.x + c.col2.x * this.m_localAnchor1.y,
            f = c.col1.y * this.m_localAnchor1.x + c.col2.y * this.m_localAnchor1.y;
        c = b.m_R;
        var g = c.col1.x * this.m_localAnchor2.x +
            c.col2.x * this.m_localAnchor2.y;
        c = c.col1.y * this.m_localAnchor2.x + c.col2.y * this.m_localAnchor2.y;
        var h = a.m_invMass,
            i = b.m_invMass,
            j = a.m_invI,
            k = b.m_invI;
        this.K1.col1.x = h + i;
        this.K1.col2.x = 0;
        this.K1.col1.y = 0;
        this.K1.col2.y = h + i;
        this.K2.col1.x = j * f * f;
        this.K2.col2.x = -j * e * f;
        this.K2.col1.y = -j * e * f;
        this.K2.col2.y = j * e * e;
        this.K3.col1.x = k * c * c;
        this.K3.col2.x = -k * g * c;
        this.K3.col1.y = -k * g * c;
        this.K3.col2.y = k * g * g;
        this.K.SetM(this.K1);
        this.K.AddM(this.K2);
        this.K.AddM(this.K3);
        this.K.Invert(this.m_ptpMass);
        this.m_motorMass =
            1 / (j + k);
        if (!1 == this.m_enableMotor) this.m_motorImpulse = 0;
        if (this.m_enableLimit) {
            var l = b.m_rotation - a.m_rotation - this.m_intialAngle;
            if (b2Math.b2Abs(this.m_upperAngle - this.m_lowerAngle) < 2 * b2Settings.b2_angularSlop) this.m_limitState = b2Joint.e_equalLimits;
            else if (l <= this.m_lowerAngle) {
                if (this.m_limitState != b2Joint.e_atLowerLimit) this.m_limitImpulse = 0;
                this.m_limitState = b2Joint.e_atLowerLimit
            } else if (l >= this.m_upperAngle) {
                if (this.m_limitState != b2Joint.e_atUpperLimit) this.m_limitImpulse = 0;
                this.m_limitState =
                    b2Joint.e_atUpperLimit
            } else this.m_limitState = b2Joint.e_inactiveLimit, this.m_limitImpulse = 0
        } else this.m_limitImpulse = 0;
        b2World.s_enableWarmStarting ? (a.m_linearVelocity.x -= h * this.m_ptpImpulse.x, a.m_linearVelocity.y -= h * this.m_ptpImpulse.y, a.m_angularVelocity -= j * (e * this.m_ptpImpulse.y - f * this.m_ptpImpulse.x + this.m_motorImpulse + this.m_limitImpulse), b.m_linearVelocity.x += i * this.m_ptpImpulse.x, b.m_linearVelocity.y += i * this.m_ptpImpulse.y, b.m_angularVelocity += k * (g * this.m_ptpImpulse.y - c * this.m_ptpImpulse.x +
            this.m_motorImpulse + this.m_limitImpulse)) : (this.m_ptpImpulse.SetZero(), this.m_limitImpulse = this.m_motorImpulse = 0);
        this.m_limitPositionImpulse = 0
    },
    SolveVelocityConstraints: function(a) {
        var b = this.m_body1,
            c = this.m_body2,
            e;
        e = b.m_R;
        var f = e.col1.x * this.m_localAnchor1.x + e.col2.x * this.m_localAnchor1.y,
            g = e.col1.y * this.m_localAnchor1.x + e.col2.y * this.m_localAnchor1.y;
        e = c.m_R;
        var h = e.col1.x * this.m_localAnchor2.x + e.col2.x * this.m_localAnchor2.y;
        e = e.col1.y * this.m_localAnchor2.x + e.col2.y * this.m_localAnchor2.y;
        var i =
            c.m_linearVelocity.x + -c.m_angularVelocity * e - b.m_linearVelocity.x - -b.m_angularVelocity * g,
            j = c.m_linearVelocity.y + c.m_angularVelocity * h - b.m_linearVelocity.y - b.m_angularVelocity * f,
            k = -(this.m_ptpMass.col1.x * i + this.m_ptpMass.col2.x * j),
            i = -(this.m_ptpMass.col1.y * i + this.m_ptpMass.col2.y * j);
        this.m_ptpImpulse.x += k;
        this.m_ptpImpulse.y += i;
        b.m_linearVelocity.x -= b.m_invMass * k;
        b.m_linearVelocity.y -= b.m_invMass * i;
        b.m_angularVelocity -= b.m_invI * (f * i - g * k);
        c.m_linearVelocity.x += c.m_invMass * k;
        c.m_linearVelocity.y += c.m_invMass *
            i;
        c.m_angularVelocity += c.m_invI * (h * i - e * k);
        if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) f = -this.m_motorMass * (c.m_angularVelocity - b.m_angularVelocity - this.m_motorSpeed), g = this.m_motorImpulse, this.m_motorImpulse = b2Math.b2Clamp(this.m_motorImpulse + f, -a.dt * this.m_maxMotorTorque, a.dt * this.m_maxMotorTorque), f = this.m_motorImpulse - g, b.m_angularVelocity -= b.m_invI * f, c.m_angularVelocity += c.m_invI * f;
        if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
            f = -this.m_motorMass * (c.m_angularVelocity -
                b.m_angularVelocity);
            if (this.m_limitState == b2Joint.e_equalLimits) this.m_limitImpulse += f;
            else if (this.m_limitState == b2Joint.e_atLowerLimit) a = this.m_limitImpulse, this.m_limitImpulse = b2Math.b2Max(this.m_limitImpulse + f, 0), f = this.m_limitImpulse - a;
            else if (this.m_limitState == b2Joint.e_atUpperLimit) a = this.m_limitImpulse, this.m_limitImpulse = b2Math.b2Min(this.m_limitImpulse + f, 0), f = this.m_limitImpulse - a;
            b.m_angularVelocity -= b.m_invI * f;
            c.m_angularVelocity += c.m_invI * f
        }
    },
    SolvePositionConstraints: function() {
        var a,
            b = this.m_body1,
            c = this.m_body2,
            e = 0,
            e = b.m_R,
            f = e.col1.x * this.m_localAnchor1.x + e.col2.x * this.m_localAnchor1.y,
            g = e.col1.y * this.m_localAnchor1.x + e.col2.y * this.m_localAnchor1.y,
            e = c.m_R;
        a = e.col1.x * this.m_localAnchor2.x + e.col2.x * this.m_localAnchor2.y;
        var h = e.col1.y * this.m_localAnchor2.x + e.col2.y * this.m_localAnchor2.y,
            i = c.m_position.x + a - (b.m_position.x + f),
            j = c.m_position.y + h - (b.m_position.y + g),
            e = Math.sqrt(i * i + j * j),
            k = b.m_invMass,
            l = c.m_invMass,
            m = b.m_invI,
            o = c.m_invI;
        this.K1.col1.x = k + l;
        this.K1.col2.x = 0;
        this.K1.col1.y =
            0;
        this.K1.col2.y = k + l;
        this.K2.col1.x = m * g * g;
        this.K2.col2.x = -m * f * g;
        this.K2.col1.y = -m * f * g;
        this.K2.col2.y = m * f * f;
        this.K3.col1.x = o * h * h;
        this.K3.col2.x = -o * a * h;
        this.K3.col1.y = -o * a * h;
        this.K3.col2.y = o * a * a;
        this.K.SetM(this.K1);
        this.K.AddM(this.K2);
        this.K.AddM(this.K3);
        this.K.Solve(b2RevoluteJoint.tImpulse, -i, -j);
        i = b2RevoluteJoint.tImpulse.x;
        j = b2RevoluteJoint.tImpulse.y;
        b.m_position.x -= b.m_invMass * i;
        b.m_position.y -= b.m_invMass * j;
        b.m_rotation -= b.m_invI * (f * j - g * i);
        b.m_R.Set(b.m_rotation);
        c.m_position.x += c.m_invMass *
            i;
        c.m_position.y += c.m_invMass * j;
        c.m_rotation += c.m_invI * (a * j - h * i);
        c.m_R.Set(c.m_rotation);
        f = 0;
        if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
            a = c.m_rotation - b.m_rotation - this.m_intialAngle;
            g = 0;
            if (this.m_limitState == b2Joint.e_equalLimits) a = b2Math.b2Clamp(a, -b2Settings.b2_maxAngularCorrection, b2Settings.b2_maxAngularCorrection), g = -this.m_motorMass * a, f = b2Math.b2Abs(a);
            else if (this.m_limitState == b2Joint.e_atLowerLimit) a -= this.m_lowerAngle, f = b2Math.b2Max(0, -a), a = b2Math.b2Clamp(a + b2Settings.b2_angularSlop, -b2Settings.b2_maxAngularCorrection, 0), g = -this.m_motorMass * a, a = this.m_limitPositionImpulse, this.m_limitPositionImpulse = b2Math.b2Max(this.m_limitPositionImpulse + g, 0), g = this.m_limitPositionImpulse - a;
            else if (this.m_limitState == b2Joint.e_atUpperLimit) a -= this.m_upperAngle, f = b2Math.b2Max(0, a), a = b2Math.b2Clamp(a - b2Settings.b2_angularSlop, 0, b2Settings.b2_maxAngularCorrection), g = -this.m_motorMass * a, a = this.m_limitPositionImpulse, this.m_limitPositionImpulse = b2Math.b2Min(this.m_limitPositionImpulse + g, 0), g = this.m_limitPositionImpulse -
                a;
            b.m_rotation -= b.m_invI * g;
            b.m_R.Set(b.m_rotation);
            c.m_rotation += c.m_invI * g;
            c.m_R.Set(c.m_rotation)
        }
        return e <= b2Settings.b2_linearSlop && f <= b2Settings.b2_angularSlop
    },
    m_localAnchor1: new b2Vec2,
    m_localAnchor2: new b2Vec2,
    m_ptpImpulse: new b2Vec2,
    m_motorImpulse: null,
    m_limitImpulse: null,
    m_limitPositionImpulse: null,
    m_ptpMass: new b2Mat22,
    m_motorMass: null,
    m_intialAngle: null,
    m_lowerAngle: null,
    m_upperAngle: null,
    m_maxMotorTorque: null,
    m_motorSpeed: null,
    m_enableLimit: null,
    m_enableMotor: null,
    m_limitState: 0
});
b2RevoluteJoint.tImpulse = new b2Vec2;
var b2RevoluteJointDef = Class.create();
Object.extend(b2RevoluteJointDef.prototype, b2JointDef.prototype);
Object.extend(b2RevoluteJointDef.prototype, {
    initialize: function() {
        this.type = b2Joint.e_unknownJoint;
        this.body2 = this.body1 = this.userData = null;
        this.collideConnected = !1;
        this.type = b2Joint.e_revoluteJoint;
        this.anchorPoint = new b2Vec2(0, 0);
        this.motorSpeed = this.motorTorque = this.upperAngle = this.lowerAngle = 0;
        this.enableMotor = this.enableLimit = !1
    },
    anchorPoint: null,
    lowerAngle: null,
    upperAngle: null,
    motorTorque: null,
    motorSpeed: null,
    enableLimit: null,
    enableMotor: null
});