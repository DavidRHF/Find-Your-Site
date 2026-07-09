/* ============================================================
   inquiry-discount.js  (v2)

   Add this file to your repo, then add ONE line to
   custom-inquiry.html, right before </body>:

       <script src="inquiry-discount.js" defer></script>

   TEST IT: open
       custom-inquiry.html?discount=TEST-1234&reward=10%25%20Off
   You should see a green banner and the discount inside the form.
   If you DON'T, the script isn't loading — check the filename/path
   and that the <script> line above is on the page.
   ============================================================ */
(function () {
  "use strict";

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function run() {
    var params = new URLSearchParams(window.location.search);
    var code = params.get("discount");
    var reward = params.get("reward");
    if (!code) return; // arrived without a discount — do nothing

    /* 1) A clear banner near the top of the page */
    var banner = document.createElement("div");
    banner.setAttribute("role", "status");
    banner.style.cssText =
      "max-width:1100px;margin:16px auto;width:92%;background:#e6f4f0;border:2px solid #147d74;" +
      "color:#0f5f58;border-radius:14px;padding:14px 18px;font-family:system-ui,-apple-system,sans-serif;" +
      "line-height:1.5;box-shadow:0 8px 24px -16px rgba(12,79,73,.5)";
    banner.innerHTML =
      '<div style="font-weight:800;font-size:1.1rem">\uD83C\uDF89 ' +
      (reward ? esc(reward) : "Discount") + " unlocked!</div>" +
      '<div style="margin-top:2px">Your code <b style="letter-spacing:.06em">' + esc(code) +
      "</b> is attached to this inquiry \u2014 I'll apply it when I reply.</div>";

    var header = document.querySelector("header, nav, .nav, .navbar");
    if (header && header.parentNode) {
      header.parentNode.insertBefore(banner, header.nextSibling);
    } else {
      var host = document.querySelector("main") || document.body;
      host.insertBefore(banner, host.firstChild);
    }

    /* 2) Show it inside the form + attach it for submission */
    var form = document.querySelector("form");
    if (form) {
      if (!form.querySelector("[data-fys-box]")) {
        var box = document.createElement("div");
        box.setAttribute("data-fys-box", "1");
        box.style.cssText =
          "margin:0 0 14px;padding:10px 12px;border:1.5px dashed #147d74;border-radius:12px;" +
          "background:#f3faf8;font-family:system-ui,sans-serif";
        box.innerHTML =
          '<div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:#5c6873;font-weight:700;margin-bottom:2px">Your discount</div>' +
          '<div style="font-weight:700;color:#0f5f58">' +
          (reward ? esc(reward) + " \u2014 " : "") + esc(code) + "</div>";
        form.insertBefore(box, form.firstChild);
      }

      if (!form.querySelector('[name="discount_code"]')) {
        var hid = document.createElement("input");
        hid.type = "hidden";
        hid.name = "discount_code";
        hid.value = code + (reward ? " (" + reward + ")" : "");
        form.appendChild(hid);
      }

      var f = form.querySelector('input[name*="discount" i],input[name*="promo" i],input[name*="code" i]');
      if (f) {
        f.value = code;
      } else {
        var ta = form.querySelector("textarea");
        if (ta && ta.value.indexOf(code) === -1) {
          ta.value = "Discount code: " + code + (reward ? " (" + reward + ")" : "") + "\n\n" + ta.value;
        }
      }
    }

    try { banner.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
