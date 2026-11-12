
/* =========================================================
   GAGAN M. PORTFOLIO
   Interactive features using plain JavaScript
   ========================================================= */

(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;

  var reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;


  /* ---------- 1. LIGHT / DARK THEME ---------- */

  var themeBtn = document.getElementById('themeBtn');
  var themeLabel = themeBtn
    ? themeBtn.querySelector('.theme-btn__label')
    : null;

  function updateThemeLabel() {
    var isDark = root.getAttribute('data-theme') === 'dark';

    if (themeLabel) {
      themeLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
    }

    if (themeBtn) {
      themeBtn.setAttribute(
        'aria-label',
        isDark ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }

  updateThemeLabel();

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var currentTheme = root.getAttribute('data-theme');
      var nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

      root.setAttribute('data-theme', nextTheme);

      try {
        localStorage.setItem('theme', nextTheme);
      } catch (error) {
        console.log('Unable to save theme preference.');
      }

      updateThemeLabel();
    });
  }


  /* ---------- 2. SCROLL REVEAL ANIMATIONS ---------- */

  var revealObserver = null;

  function revealElement(element) {
    element.classList.add('in');
  }

  function startReveals() {

    // Animate the large hero words.
    document.querySelectorAll('.w').forEach(function (word) {
      revealElement(word);
    });

    var revealItems = document.querySelectorAll('[data-reveal]');

    // Fallback for browsers without IntersectionObserver.
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach(revealElement);
      return;
    }

    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealElement(entry.target);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealItems.forEach(function (element) {
      revealObserver.observe(element);
    });
  }


  /* ---------- 3. INTRO ANIMATION ---------- */

  var intro = document.getElementById('intro');
  var introDone = false;

  function endIntro() {

    if (introDone) return;

    introDone = true;

    if (intro) {
      intro.classList.add('out');
    }

    body.classList.remove('is-loading');

    // Start page animations after intro begins disappearing.
    setTimeout(startReveals, 350);

    if (intro) {
      setTimeout(function () {
        intro.style.display = 'none';
      }, 1000);
    }
  }

  if (reduceMotion || !intro) {

    if (intro) {
      intro.style.display = 'none';
    }

    body.classList.remove('is-loading');
    startReveals();

  } else {

    // Automatically finish the intro.
    setTimeout(endIntro, 2400);

    // Visitors can click to skip the intro.
    intro.addEventListener('click', endIntro);

    // Press any key to skip.
    window.addEventListener('keydown', endIntro, {
      once: true
    });

  }


  /* ---------- 4. MOBILE NAVIGATION ---------- */

  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  var panel = document.querySelector('.panel');

  function setMenu(open) {

    if (!menuBtn || !nav || !panel) return;

    nav.classList.toggle('open', open);
    panel.classList.toggle('menu-open', open);

    menuBtn.setAttribute('aria-expanded', String(open));

    menuBtn.setAttribute(
      'aria-label',
      open ? 'Close menu' : 'Open menu'
    );

    // Prevent background scrolling while menu is open.
    body.classList.toggle('is-loading', open);

  }

  if (menuBtn && nav) {

    menuBtn.addEventListener('click', function () {

      var isOpen =
        menuBtn.getAttribute('aria-expanded') === 'true';

      setMenu(!isOpen);

    });

    // Close menu after selecting a navigation link.
    nav.querySelectorAll('a').forEach(function (link) {

      link.addEventListener('click', function () {
        setMenu(false);
      });

    });

    // Close menu using Escape.
    window.addEventListener('keydown', function (event) {

      if (event.key === 'Escape') {
        setMenu(false);
      }

    });

    // Close mobile menu when returning to desktop size.
    window.addEventListener('resize', function () {

      if (window.innerWidth > 960) {
        setMenu(false);
      }

    });

  }


  /* ---------- 5. ACTIVE NAVIGATION ON SCROLL ---------- */

  var links = document.querySelectorAll('.nav a');

  function activateLink(sectionId) {

    links.forEach(function (link) {

      var isActive =
        link.getAttribute('href') === '#' + sectionId;

      link.classList.toggle('active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }

    });

  }

  if ('IntersectionObserver' in window) {

    var sectionObserver = new IntersectionObserver(

      function (entries) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {
            activateLink(entry.target.id);
          }

        });

      },

      {
        rootMargin: '-40% 0px -50% 0px',
        threshold: 0
      }

    );

    document.querySelectorAll('main section[id]').forEach(
      function (section) {
        sectionObserver.observe(section);
      }
    );

  }


  /* ---------- 6. CUSTOM CURSOR ---------- */

  var cursor = document.querySelector('.cursor');

  var finePointer = window.matchMedia(
    '(hover: hover) and (pointer: fine)'
  ).matches;

  if (cursor && finePointer && !reduceMotion) {

    var x = 0;
    var y = 0;

    var targetX = 0;
    var targetY = 0;

    window.addEventListener('mousemove', function (event) {

      targetX = event.clientX;
      targetY = event.clientY;

      cursor.classList.add('on');

    });

    document.addEventListener('mouseleave', function () {
      cursor.classList.remove('on');
    });

    // Smooth cursor movement.
    function followCursor() {

      x += (targetX - x) * 0.2;
      y += (targetY - y) * 0.2;

      cursor.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

      requestAnimationFrame(followCursor);

    }

    followCursor();

    // Enlarge cursor over interactive elements.
    document.querySelectorAll(
      'a, button, .project, .skill li, .w2'
    ).forEach(function (element) {

      element.addEventListener('mouseenter', function () {
        cursor.classList.add('big');
      });

      element.addEventListener('mouseleave', function () {
        cursor.classList.remove('big');
      });

    });

  }


  /* ---------- 7. COPY EMAIL BUTTON ---------- */

  var copyBtn = document.getElementById('copyBtn');
  var copyStatus = document.getElementById('copyStatus');

  var email = 'gagangag98@gmail.com';

  if (copyBtn) {

    copyBtn.addEventListener('click', function () {

      var label = copyBtn.querySelector('span');

      if (!label) return;

      function showResult(success) {

        var message = success
          ? 'Email copied!'
          : 'Copy failed. Please select the email manually.';

        label.textContent = message;

        if (copyStatus) {
          copyStatus.textContent = message;
        }

        copyBtn.classList.toggle('copied', success);

        setTimeout(function () {

          label.textContent = 'Copy email address';
          copyBtn.classList.remove('copied');

        }, 2000);

      }

      // Modern clipboard support.
      if (navigator.clipboard && window.isSecureContext) {

        navigator.clipboard.writeText(email)
          .then(function () {
            showResult(true);
          })
          .catch(function () {
            showResult(false);
          });

      } else {

        // Fallback for browsers without clipboard support.
        var temporaryInput = document.createElement('textarea');

        temporaryInput.value = email;
        temporaryInput.style.position = 'fixed';
        temporaryInput.style.opacity = '0';

        body.appendChild(temporaryInput);

        temporaryInput.select();

        var copied = false;

        try {
          copied = document.execCommand('copy');
        } catch (error) {
          copied = false;
        }

        body.removeChild(temporaryInput);

        showResult(copied);

      }

    });

  }


  /* ---------- 8. FOOTER YEAR ---------- */

  var year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  /* ---------- 9. PROJECT HOVER FEEDBACK ---------- */

  document.querySelectorAll('.project').forEach(function (project) {

    project.addEventListener('mouseenter', function () {
      project.classList.add('project-hover');
    });

    project.addEventListener('mouseleave', function () {
      project.classList.remove('project-hover');
    });

  });


  /* ---------- 10. PAGE READY ---------- */

  console.log('Gagan M. Portfolio loaded successfully!');

})();
