(function () {
  'use strict';

  if (document.URL.indexOf('://lumo.proton.me') === -1) return;

  var A = 'data-h';
  var CARDS = '.composer-notification-card, .sidebar-upsell-section, [class*="upsell"]';
  var HEADER = 'header:not(.header-lumo)';
  var PROMO = 'a[href*="account.proton.me/lumo"]';
  var GUARD = 'textarea, form, [contenteditable="true"]';

  function hide(el) {
    if (!el || el.nodeType !== 1 || el === document.body || el === document.documentElement) return;
    if (el.getAttribute(A) || el.querySelector(GUARD)) return;
    el.setAttribute(A, '1');
    el.style.setProperty('display', 'none', 'important');
  }

  function fallback(link) {
    var n = link.parentElement;
    while (n && n !== document.body) {
      if (n.querySelector(GUARD)) break;
      if (n.querySelectorAll(PROMO).length >= 2) return n;
      n = n.parentElement;
    }
    return link;
  }

  function run() {
    try {
      var i, ns;

      ns = document.querySelectorAll(CARDS);
      for (i = 0; i < ns.length; i++) hide(ns[i]);

      ns = document.querySelectorAll(HEADER);
      for (i = 0; i < ns.length; i++) {
        if (ns[i].querySelector(PROMO)) hide(ns[i]);
      }

      ns = document.querySelectorAll(PROMO);
      for (i = 0; i < ns.length; i++) {
        var l = ns[i];
        if (l.closest('[' + A + '="1"]')) continue;
        hide(fallback(l));
      }
    } catch (e) { /* still */ }
  }

  var scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 100); };
    raf(function () { scheduled = false; run(); });
  }

  function boot() {
    run();
    new MutationObserver(schedule).observe(document.documentElement, {
      childList: true, subtree: true
    });
    var t = 0, iv = setInterval(function () {
      run();
      if (++t > 30) clearInterval(iv);
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
