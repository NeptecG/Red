/* ============================================================
   Trágos Kokkinos · site behaviour
   ============================================================ */
(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;

  /* ---------- sticky header ---------- */
  var header = doc.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var navToggle = doc.querySelector('.nav-toggle');
  function setMenu(open) {
    doc.body.classList.toggle('nav-open', open);
    if (navToggle) navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      setMenu(!doc.body.classList.contains('nav-open'));
    });
  }
  doc.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  /* ---------- i18n (Greek default, English toggle) ---------- */
  var LANG_KEY = 'tk-lang';

  function captureBase() {
    doc.querySelectorAll('[data-en]').forEach(function (el) {
      if (el.dataset.el === undefined) el.dataset.el = (el.textContent || '').trim();
    });
    doc.querySelectorAll('[data-en-placeholder]').forEach(function (el) {
      if (el.dataset.elPlaceholder === undefined) el.dataset.elPlaceholder = el.getAttribute('placeholder') || '';
    });
    doc.querySelectorAll('[data-en-aria]').forEach(function (el) {
      if (el.dataset.elAria === undefined) el.dataset.elAria = el.getAttribute('aria-label') || '';
    });
    doc.querySelectorAll('[data-en-content]').forEach(function (el) {
      if (el.dataset.elContent === undefined) el.dataset.elContent = el.getAttribute('content') || '';
    });
  }

  function setLang(lang) {
    var en = lang === 'en';
    root.setAttribute('lang', en ? 'en' : 'el');
    doc.querySelectorAll('[data-en]').forEach(function (el) {
      el.textContent = en ? el.dataset.en : el.dataset.el;
    });
    doc.querySelectorAll('[data-en-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', en ? el.dataset.enPlaceholder : el.dataset.elPlaceholder);
    });
    doc.querySelectorAll('[data-en-aria]').forEach(function (el) {
      el.setAttribute('aria-label', en ? el.dataset.enAria : el.dataset.elAria);
    });
    doc.querySelectorAll('[data-en-content]').forEach(function (el) {
      el.setAttribute('content', en ? el.dataset.enContent : el.dataset.elContent);
    });
    doc.querySelectorAll('.lang-toggle button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === lang);
      b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false');
    });
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }

  captureBase();
  var saved = 'el';
  try { saved = localStorage.getItem(LANG_KEY) || 'el'; } catch (e) {}
  setLang(saved === 'en' ? 'en' : 'el');

  doc.querySelectorAll('.lang-toggle button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });

  /* ---------- scroll reveal ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealables = doc.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- map scroll-zoom guard ---------- */
  var mapGuard = doc.getElementById('map-guard');
  if (mapGuard) {
    mapGuard.addEventListener('click', function () {
      mapGuard.classList.add('dismissed');
    });
  }

  /* ---------- footer year ---------- */
  var yEl = doc.getElementById('year');
  if (yEl) yEl.textContent = new Date().getFullYear();

  /* ---------- gallery lightbox ---------- */
  var gItems = doc.querySelectorAll('.masonry .g-item img');
  if (gItems.length) {
    var imgs = Array.prototype.map.call(gItems, function (im) {
      return { src: im.getAttribute('src'), alt: im.getAttribute('alt') || '' };
    });
    var lb = doc.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML =
      '<button class="lb-close" aria-label="Close">✕</button>' +
      '<button class="lb-prev" aria-label="Previous">‹</button>' +
      '<img alt="">' +
      '<button class="lb-next" aria-label="Next">›</button>';
    doc.body.appendChild(lb);
    var lbImg = lb.querySelector('img');
    var idx = 0;
    function show(i) {
      idx = (i + imgs.length) % imgs.length;
      lbImg.setAttribute('src', imgs[idx].src);
      lbImg.setAttribute('alt', imgs[idx].alt);
    }
    function open(i) { show(i); lb.classList.add('open'); doc.body.style.overflow = 'hidden'; }
    function close() { lb.classList.remove('open'); doc.body.style.overflow = ''; }
    gItems.forEach(function (im, i) {
      im.parentElement.addEventListener('click', function () { open(i); });
      im.parentElement.setAttribute('tabindex', '0');
      im.parentElement.setAttribute('role', 'button');
      im.parentElement.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    window.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---------- reservation form ---------- */
  var form = doc.querySelector('form.reserve-form');
  if (form) {
    var feedback = form.querySelector('.form-feedback');
    var dateInput = form.querySelector('input[type="date"]');
    if (dateInput) {
      var t = new Date();
      dateInput.min = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
    }
    var action = form.getAttribute('action') || '';
    var configured = action.indexOf('formspree.io') > -1 && action.indexOf('YOUR_FORM_ID') === -1;

    function fbMsg(name) {
      var en = root.getAttribute('lang') === 'en';
      return form.getAttribute('data-' + (en ? 'en' : 'el') + '-' + name) || '';
    }
    function showFeedback(kind, html) {
      if (!feedback) return;
      feedback.className = 'form-feedback show ' + kind;
      feedback.innerHTML = html;
    }
    function validate() {
      var ok = true, firstBad = null;
      form.querySelectorAll('input,select,textarea').forEach(function (el) {
        if (!el.willValidate) return;
        var field = el.closest('.field');
        var good = el.checkValidity();
        if (field) field.classList.toggle('invalid', !good);
        if (!good && !firstBad) firstBad = el;
        if (!good) ok = false;
      });
      if (firstBad) firstBad.focus();
      return ok;
    }
    form.querySelectorAll('input,select,textarea').forEach(function (el) {
      el.addEventListener('blur', function () {
        var field = el.closest('.field');
        if (field && el.value) field.classList.toggle('invalid', !el.checkValidity());
      });
    });

    form.addEventListener('submit', function (e) {
      if (!validate()) {
        e.preventDefault();
        showFeedback('bad', fbMsg('invalid'));
        return;
      }
      if (!configured) {
        e.preventDefault();
        var data = new FormData(form), parts = [];
        data.forEach(function (v, k) { if (v && k.charAt(0) !== '_') parts.push(k + ': ' + v); });
        var en = root.getAttribute('lang') === 'en';
        var mail = 'mailto:hello@tragoskokkinos.gr?subject=' +
          encodeURIComponent('Reservation / Κράτηση · Τράγος Κόκκινος') + '&body=' + encodeURIComponent(parts.join('\n'));
        showFeedback('warn', fbMsg('demo') +
          ' <a href="' + mail + '" style="color:inherit;text-decoration:underline;font-weight:600">' +
          (en ? 'Email us' : 'Στείλτε email') + '</a>.');
        return;
      }
      // real Formspree endpoint
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      if (btn) btn.disabled = true;
      fetch(action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (r.ok) { showFeedback('ok', fbMsg('ok')); form.reset(); }
          else { showFeedback('bad', fbMsg('error')); }
        })
        .catch(function () { showFeedback('bad', fbMsg('error')); })
        .finally(function () { if (btn) btn.disabled = false; });
    });
  }
})();
