// PersuaRL project page — minimal page behaviour (no dependencies).

(function () {
  'use strict';

  // --- copy BibTeX -----------------------------------------------------
  var copyBtn = document.querySelector('.copy-btn');
  var bibtex = document.getElementById('bibtex-code');

  function flash(label) {
    var text = copyBtn.querySelector('.copy-label');
    copyBtn.classList.add('copied');
    text.textContent = label;
    setTimeout(function () {
      copyBtn.classList.remove('copied');
      text.textContent = 'Copy';
    }, 2000);
  }

  if (copyBtn && bibtex) {
    copyBtn.addEventListener('click', function () {
      var source = bibtex.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(source)
          .then(function () { flash('Copied'); })
          .catch(function () { flash('Press Ctrl+C'); });
      } else {
        var area = document.createElement('textarea');
        area.value = source;
        document.body.appendChild(area);
        area.select();
        try { document.execCommand('copy'); flash('Copied'); }
        catch (e) { flash('Press Ctrl+C'); }
        document.body.removeChild(area);
      }
    });
  }

  // --- back to top -----------------------------------------------------
  var toTop = document.querySelector('.to-top');
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('visible', window.pageYOffset > 400);
    }, { passive: true });
  }

  // --- top bar: short name at the top, full title once scrolled --------
  var masthead = document.querySelector('.masthead');
  var pageTitle = document.querySelector('.paper-title');

  if (masthead && pageTitle) {
    var barTicking = false;

    function syncMasthead() {
      barTicking = false;
      // swap as soon as the page title has passed behind the bar
      var passed = pageTitle.getBoundingClientRect().bottom <= masthead.offsetHeight;
      masthead.classList.toggle('is-scrolled', passed);
    }

    window.addEventListener('scroll', function () {
      if (barTicking) return;
      barTicking = true;
      window.requestAnimationFrame(syncMasthead);
    }, { passive: true });

    syncMasthead();
  }

  // --- tabbed panels ---------------------------------------------------
  Array.prototype.forEach.call(document.querySelectorAll('.tabs'), function (bar) {
    var tabs = Array.prototype.slice.call(bar.querySelectorAll('.tab'));

    function show(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (panel) panel.hidden = !on;
      });
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { show(tab); });
      tab.addEventListener('keydown', function (e) {
        var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        var next = tabs[(i + step + tabs.length) % tabs.length];
        show(next);
        next.focus();
      });
    });
  });

  // --- highlight the section currently in view -------------------------
  // Marks the matching link in the top nav and in the side contents rail
  // with .is-active; each stylesheet decides what that looks like.
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.masthead-nav a[href^="#"], .side-toc a[href^="#"]')
  );

  var targets = links
    .map(function (a) {
      var el = document.getElementById(a.getAttribute('href').slice(1));
      return el ? { link: a, section: el } : null;
    })
    .filter(Boolean);

  if (targets.length) {
    var ticking = false;
    var current = null;

    function activate() {
      ticking = false;

      // the section whose top has most recently passed the reading line
      var line = 140;
      var active = targets[0].section;
      targets.forEach(function (t) {
        if (t.section.getBoundingClientRect().top <= line) active = t.section;
      });

      // pin the last entry once the page is scrolled to the bottom
      var atEnd = window.innerHeight + window.pageYOffset >=
                  document.documentElement.scrollHeight - 4;
      if (atEnd) active = targets[targets.length - 1].section;

      if (active === current) return;
      current = active;

      targets.forEach(function (t) {
        t.link.classList.toggle('is-active', t.section === active);
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(activate);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    activate();
  }
})();
