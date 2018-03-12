(function (k) { if ("function" === typeof define && define.amd) define(k); else if ("object" === typeof exports) module.exports = k(); else { var g = window.Cookies, c = window.Cookies = k(); c.noConflict = function () { window.Cookies = g; return c; }; } })(function () {
  function k() { for (var c = 0, b = {}; c < arguments.length; c++) { var a = arguments[c], f; for (f in a) b[f] = a[f]; } return b; } function g(c) {
    function b(a, f, d) {
      var h; if ("undefined" !== typeof document) {
        if (1 < arguments.length) {
          d = k({ path: "/" }, b.defaults, d); if ("number" === typeof d.expires) {
            var l = new Date;
            l.setMilliseconds(l.getMilliseconds() + 864E5 * d.expires); d.expires = l;
          } try { h = JSON.stringify(f), /^[\{\[]/.test(h) && (f = h); } catch (g) { } f = c.write ? c.write(f, a) : encodeURIComponent(String(f)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent); a = encodeURIComponent(String(a)); a = a.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent); a = a.replace(/[\(\)]/g, escape); return document.cookie = [a, "=", f, d.expires ? "; expires=" + d.expires.toUTCString() : "", d.path ? "; path=" + d.path : "", d.domain ?
            "; domain=" + d.domain : "", d.secure ? "; secure" : ""].join("");
        } a || (h = {}); for (var l = document.cookie ? document.cookie.split("; ") : [], p = /(%[0-9A-Z]{2})+/g, n = 0; n < l.length; n++) { var q = l[n].split("="), e = q.slice(1).join("="); "\"" === e.charAt(0) && (e = e.slice(1, -1)); try { var m = q[0].replace(p, decodeURIComponent), e = c.read ? c.read(e, m) : c(e, m) || e.replace(p, decodeURIComponent); if (this.json) try { e = JSON.parse(e); } catch (g) { } if (a === m) { h = e; break; } a || (h[m] = e); } catch (g) { } } return h;
      }
    } b.set = b; b.get = function (a) { return b.call(b, a); }; b.getJSON =
      function () { return b.apply({ json: !0 }, [].slice.call(arguments)); }; b.defaults = {}; b.remove = function (a, c) { b(a, "", k(c, { expires: -1 })); }; b.withConverter = g; return b;
  } return g(function () { });
});