document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var links = document.querySelector('nav.links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('mobile-open');
    });
  }

  var reveals = document.querySelectorAll('.reveal');

  // Stagger reveals within each section so they cascade in sequence
  // rather than all fading in at once.
  document.querySelectorAll('section, .hero').forEach(function (section) {
    var items = section.querySelectorAll('.reveal');
    items.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 90, 450) + 'ms';
    });
  });
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  var parallaxImg = document.getElementById('hero-parallax-img');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (parallaxImg && !reduceMotion) {
    var ticking = false;
    function updateParallax() {
      var offset = window.scrollY * 0.18;
      parallaxImg.style.transform = 'translateY(' + offset + 'px)';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
    updateParallax();
  }

  // Count-up animation for stat numbers (e.g. "1,400+" counts up from 0)
  var statNums = document.querySelectorAll('.stat .num');
  function animateCount(el) {
    var text = el.textContent.trim();
    var match = text.match(/^([\d,]+)(.*)$/);
    if (!match) return; // non-numeric stats (e.g. "IIM+") stay static
    var target = parseInt(match[1].replace(/,/g, ''), 10);
    var suffix = match[2];
    var duration = 1100;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    }
    window.requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && statNums.length && !reduceMotion) {
    var statIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statNums.forEach(function (el) { statIo.observe(el); });
  }
});
