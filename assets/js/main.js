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

  /* ---------- site intro splash ---------- */
  var introEl = doc.getElementById('site-intro');
  if (introEl && !root.classList.contains('tk-intro-skip')) {
    var autoTimer;

    function dismissIntro(fast) {
      clearTimeout(autoTimer);
      introEl.removeEventListener('click', onIntroClick);
      if (fast) {
        /* manual skip: snap fade in 500ms, zoom starts almost immediately */
        introEl.style.transition = 'opacity .5s var(--ease)';
        introEl.classList.add('si-out');
        setTimeout(function () { root.classList.remove('tk-intro-on'); }, 80);
        setTimeout(function () { introEl.style.display = 'none'; }, 550);
      } else {
        /* auto dismiss: original timing */
        introEl.classList.add('si-out');
        setTimeout(function () { root.classList.remove('tk-intro-on'); }, 2900);
        setTimeout(function () { introEl.style.display = 'none'; }, 4000);
      }
    }

    function onIntroClick() { dismissIntro(true); }
    introEl.addEventListener('click', onIntroClick);

    autoTimer = setTimeout(function () { dismissIntro(false); }, 1000);
  }

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
    doc.querySelectorAll('[data-en-html]').forEach(function (el) {
      if (el.dataset.elHtml === undefined) el.dataset.elHtml = el.innerHTML;
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
    doc.querySelectorAll('[data-en-html]').forEach(function (el) {
      el.innerHTML = en ? el.dataset.enHtml : el.dataset.elHtml;
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

  /* ---------- scroll reveal (one-time: animate in once, stay visible) ---------- */
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

  /* ---------- footer brand: two-way reveal (fires ~100px before entering view) ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var repeatEls = doc.querySelectorAll('[data-reveal-repeat]');
    if (repeatEls.length) {
      var ioRepeat = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle('in', entry.isIntersecting);
        });
      }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });
      /* threshold 0.05: fires as soon as the top edge of the element crosses
         into the viewport - animation starts exactly on entry, not before */
      repeatEls.forEach(function (el) { ioRepeat.observe(el); });
    }
  }

  /* ---------- hero zoom: restart animation when any .hero re-enters viewport ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    doc.querySelectorAll('.hero').forEach(function (section) {
      var img = section.querySelector('.hero-bg img');
      if (!img) return;
      var seen = false;
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && seen) {
            img.style.animation = 'none';
            img.getBoundingClientRect();
            img.style.animation = '';
            img.style.animationPlayState = 'running';
          }
          if (entry.isIntersecting) seen = true;
        });
      }, { threshold: 0.1 }).observe(section);
    });
  }

  /* ---------- cookie / GDPR banner ---------- */
  var cookieBar = doc.getElementById('cookie-bar');
  if (cookieBar) {
    var COOKIE_KEY = 'tk-cookie';
    var accepted = false;
    try { accepted = !!localStorage.getItem(COOKIE_KEY); } catch (e) {}
    if (!accepted) {
      setTimeout(function () { cookieBar.classList.add('visible'); }, 500);
    }
    var cookieBtn = doc.getElementById('cookie-ok');
    if (cookieBtn) {
      cookieBtn.addEventListener('click', function () {
        cookieBar.classList.remove('visible');
        setTimeout(function () { cookieBar.hidden = true; }, 420);
        try { localStorage.setItem(COOKIE_KEY, '1'); } catch (e) {}
      });
    }
  }

  /* ---------- footer year ---------- */
  var yEl = doc.getElementById('year');
  if (yEl) yEl.textContent = new Date().getFullYear();

  /* ---------- phone input: digits, +, spaces only (no letters) ---------- */
  var phoneInput = doc.getElementById('r-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      var pos = this.selectionStart;
      var cleaned = this.value
        .replace(/[^\d+\s]/g, '')   /* strip anything that is not digit, +, or space */
        .replace(/(?!^)\+/g, '');   /* + only allowed at position 0 */
      if (cleaned !== this.value) {
        this.value = cleaned;
        try { this.setSelectionRange(pos - 1, pos - 1); } catch (e) {}
      }
    });
  }

  /* ---------- gallery lightbox carousel ---------- */
  var gFigures = doc.querySelectorAll('.masonry .g-item');
  if (gFigures.length) {
    var figs = Array.prototype.slice.call(gFigures);

    var lb = doc.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Gallery');
    lb.innerHTML =
      '<div class="lb-stage"><div class="lb-track">' +
        '<div class="lb-slide"><img alt="" draggable="false"></div>' +
        '<div class="lb-slide"><img alt="" draggable="false"></div>' +
        '<div class="lb-slide"><img alt="" draggable="false"></div>' +
      '</div></div>' +
      '<div class="lb-counter"></div>' +
      '<div class="lb-cap"></div>' +
      '<button class="lb-close" aria-label="Close">✕</button>' +
      '<button class="lb-prev" aria-label="Previous">‹</button>' +
      '<button class="lb-next" aria-label="Next">›</button>';
    doc.body.appendChild(lb);

    var stage = lb.querySelector('.lb-stage');
    var track = lb.querySelector('.lb-track');
    var slideImgs = lb.querySelectorAll('.lb-slide img');
    var counterEl = lb.querySelector('.lb-counter');
    var capEl = lb.querySelector('.lb-cap');
    var idx = 0, animating = false;

    function wrap(i) { return (i + figs.length) % figs.length; }
    function srcOf(i) { var im = figs[wrap(i)].querySelector('img'); return im ? im.getAttribute('src') : ''; }
    function capOf(i) {
      var f = figs[wrap(i)];
      var en = root.getAttribute('lang') === 'en';
      var c = en ? (f.getAttribute('data-cap-en') || f.getAttribute('data-cap'))
                 : (f.getAttribute('data-cap') || f.getAttribute('data-cap-en'));
      if (!c) { var im = f.querySelector('img'); c = im ? (im.getAttribute('alt') || '') : ''; }
      return c || '';
    }
    function placeTrack() {
      track.classList.remove('anim');
      track.style.transform = 'translateX(' + (-stage.clientWidth) + 'px)';
    }
    function render() {
      slideImgs[0].src = srcOf(idx - 1);
      slideImgs[1].src = srcOf(idx);
      slideImgs[2].src = srcOf(idx + 1);
      slideImgs[1].alt = capOf(idx);
      counterEl.textContent = (idx + 1) + ' / ' + figs.length;
      capEl.textContent = capOf(idx);
      placeTrack();
    }
    function slide(delta) { // -1 prev, +1 next, 0 snap back
      if (animating) return;
      var w = stage.clientWidth;
      animating = true;
      track.classList.add('anim');
      track.style.transform = 'translateX(' + (-w - delta * w) + 'px)';
      setTimeout(function () {
        if (delta) idx = wrap(idx + delta);
        render();
        animating = false;
      }, reduce ? 20 : 430);
    }
    function open(i) {
      idx = wrap(i);
      lb.classList.add('open');
      doc.body.style.overflow = 'hidden';
      render();
    }
    function close() {
      lb.classList.remove('open');
      doc.body.style.overflow = '';
    }

    figs.forEach(function (f, i) {
      f.setAttribute('tabindex', '0');
      f.setAttribute('role', 'button');
      f.addEventListener('click', function () { open(i); });
      f.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); slide(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); slide(1); });
    stage.addEventListener('click', function (e) { if (e.target.classList.contains('lb-slide')) close(); });
    window.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') slide(-1);
      else if (e.key === 'ArrowRight') slide(1);
    });
    window.addEventListener('resize', function () { if (lb.classList.contains('open') && !animating) placeTrack(); });

    /* live touch-drag: the neighbour peeks in before the slide snaps */
    var downX = null, downY = null, dragging = false, dx = 0;
    stage.addEventListener('touchstart', function (e) {
      if (animating) return;
      var t = e.changedTouches[0];
      downX = t.clientX; downY = t.clientY; dragging = true; dx = 0;
      track.classList.remove('anim');
    }, { passive: true });
    stage.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      var t = e.changedTouches[0];
      var mx = t.clientX - downX, my = t.clientY - downY;
      if (Math.abs(mx) < Math.abs(my) && Math.abs(dx) < 6) return;
      dx = mx;
      track.style.transform = 'translateX(' + (-stage.clientWidth + mx) + 'px)';
    }, { passive: true });
    stage.addEventListener('touchend', function () {
      if (!dragging) return;
      dragging = false;
      var threshold = Math.min(70, stage.clientWidth * 0.16);
      if (dx <= -threshold) slide(1);
      else if (dx >= threshold) slide(-1);
      else slide(0);
      downX = downY = null; dx = 0;
    }, { passive: true });

    /* keep caption in sync if language is toggled while open */
    doc.querySelectorAll('.lang-toggle button').forEach(function (b) {
      b.addEventListener('click', function () {
        if (lb.classList.contains('open')) { capEl.textContent = capOf(idx); slideImgs[1].alt = capOf(idx); }
      });
    });
  }

  /* ---------- team member modal (click a card to read the full story) ---------- */
  var teamCards = doc.querySelectorAll('.team-card');
  if (teamCards.length) {
    var personIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>';
    var tm = doc.createElement('div');
    tm.className = 'team-modal';
    tm.setAttribute('role', 'dialog');
    tm.setAttribute('aria-modal', 'true');
    tm.innerHTML =
      '<div class="tm-panel">' +
        '<button class="tm-close" aria-label="Close">✕</button>' +
        '<div class="tm-photo"></div>' +
        '<div class="tm-body">' +
          '<span class="tm-role"></span>' +
          '<h3 class="tm-name"></h3>' +
          '<div class="tm-story"></div>' +
        '</div>' +
      '</div>';
    doc.body.appendChild(tm);
    var tmPhoto = tm.querySelector('.tm-photo');
    var tmRole = tm.querySelector('.tm-role');
    var tmName = tm.querySelector('.tm-name');
    var tmStory = tm.querySelector('.tm-story');
    var tmPanel = tm.querySelector('.tm-panel');

    function openTeam(card) {
      var roleEl = card.querySelector('.team-role');
      var nameEl = card.querySelector('.team-name');
      var storyEl = card.querySelector('.team-story');
      tmRole.textContent = roleEl ? roleEl.textContent : '';
      tmName.textContent = nameEl ? nameEl.textContent : '';
      tmStory.textContent = storyEl ? storyEl.textContent : '';
      var photo = card.getAttribute('data-photo');
      tmPhoto.innerHTML = photo
        ? '<img alt="' + (nameEl ? nameEl.textContent : '') + '" src="' + photo + '">'
        : personIcon;
      tm.classList.add('open');
      doc.body.style.overflow = 'hidden';
      tmPanel.scrollTop = 0;
    }
    function closeTeam() { tm.classList.remove('open'); doc.body.style.overflow = ''; }

    teamCards.forEach(function (card) {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('click', function () { openTeam(card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openTeam(card); }
      });
    });
    tm.querySelector('.tm-close').addEventListener('click', closeTeam);
    tm.addEventListener('click', function (e) { if (e.target === tm) closeTeam(); });
    window.addEventListener('keydown', function (e) {
      if (tm.classList.contains('open') && e.key === 'Escape') closeTeam();
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
