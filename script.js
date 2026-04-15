/* =========================================
   SUNSHINE CLUB — script.js
   ========================================= */

// ── Nav: .scrolled on scroll ──────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


// ── Scroll-triggered reveal ───────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.moment-card, .merch-item, .moments__header, .merch__header, .contact__inner'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 0.1}s`;
  revealObserver.observe(el);
});


// ── Carousels (moments + merch) ───────────
document.querySelectorAll('.moment-card__carousel, .merch-item__carousel').forEach(function(carousel) {
  var track     = carousel.querySelector('.carousel__track');
  var slides    = carousel.querySelectorAll('.carousel__slide');
  var prevBtn   = carousel.querySelector('.carousel__btn--prev');
  var nextBtn   = carousel.querySelector('.carousel__btn--next');
  var total     = slides.length;
  var current   = 0;
  var autoTimer = null;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
  }

  function startAuto() {
    if (autoTimer) return;
    autoTimer = setInterval(function() { goTo(current + 1); }, 1800);
  }

  function stopAuto() {
    clearInterval(autoTimer);
    autoTimer = null;
  }

  carousel.addEventListener('mouseenter', startAuto);
  carousel.addEventListener('mouseleave', stopAuto);

  nextBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    goTo(current + 1);
  });
  prevBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    goTo(current - 1);
  });
});



const quotes = {
  looking: [
    "Good. The best things happen to those who wander in without a plan.",
    "Vienna is watching. Take your time.",
    "You don't need a reason to be here. Neither do we.",
    "Observers shape the room. Don't underestimate yourself.",
    "The window-shopper often ends up staying the longest.",
  ],
  motivation: [
    "You're not lost — just early.",
    "The sun doesn't wait. Neither should you.",
    "Whatever you're building, it already exists somewhere. Go find it.",
    "Hesitation is just excitement with bad PR.",
    "This is the sign. You were looking for a sign. This is it.",
    "Nobody with a story this interesting gives up now.",
  ],
  cosmic: [
    "Mercury is in retrograde, but frankly so is everyone.",
    "The stars didn't align. They outsourced it to you.",
    "Somewhere, a version of you already did the thing. Check in with them.",
    "Your chart says: stop googling your chart.",
    "The universe is not mysterious — it's just a slow emailer.",
    "Today's energy: chaotic neutral with good taste.",
    "You were born in the right decade. That's already statistically impressive.",
  ],
};

const labelMap = {
  looking:    "Just looking",
  motivation: "Need motivation",
  cosmic:     "Tell me something cosmic",
};

function getTodayContext() {
  const now  = new Date();
  const day  = now.toLocaleDateString('en-US', { weekday: 'long' });
  const date = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  return { day, date };
}

function buildMessage(type, city) {
  const pool  = quotes[type];
  const quote = pool[Math.floor(Math.random() * pool.length)];
  const { day, date } = getTodayContext();
  const intros = [
    `${day} in ${city} —`,
    `It's ${date} in ${city}.`,
    `${city}, ${date}.`,
    `Today in ${city}:`,
  ];
  const intro = intros[Math.floor(Math.random() * intros.length)];
  return `${intro} ${quote}`;
}

function getUserCity(callback) {
  if (!navigator.geolocation) { callback('Vienna'); return; }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`)
        .then(r => r.json())
        .then(d => callback(d.address.city || d.address.town || d.address.village || 'Vienna'))
        .catch(() => callback('Vienna'));
    },
    () => callback('Vienna')
  );
}


// ── Oracle Popup ──────────────────────────
const fab        = document.getElementById('oracleFab');
const popup      = document.getElementById('oraclePopup');
const backdrop   = document.getElementById('oracleBackdrop');
const closeBtn   = document.getElementById('oracleClose');
const messagesEl = document.getElementById('oracleMessages');
const optionsEl  = document.getElementById('oracleOptions');
const againWrap  = document.getElementById('oracleAgainWrap');
const againBtn   = document.getElementById('oracleAgain');
const navOracle  = document.getElementById('navOracle');

let cachedCity  = null;
let currentType = null;

function openPopup() {
  popup.classList.add('open');
  popup.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePopup() {
  popup.classList.remove('open');
  popup.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

fab.addEventListener('click', openPopup);
if (navOracle) navOracle.addEventListener('click', (e) => { e.preventDefault(); openPopup(); });
closeBtn.addEventListener('click', closePopup);
backdrop.addEventListener('click', closePopup);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopup(); });

function addMessage(text, role) {
  const msg = document.createElement('div');
  msg.className = `oracle-msg oracle-msg--${role}`;
  const p = document.createElement('p');
  p.textContent = text;
  msg.appendChild(p);
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showTypingThenMessage(text, delay) {
  delay = delay || 1200;
  const typingEl = document.createElement('div');
  typingEl.className = 'oracle-msg oracle-msg--bot oracle-typing';
  const p = document.createElement('p');
  typingEl.appendChild(p);
  messagesEl.appendChild(typingEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  setTimeout(function() {
    messagesEl.removeChild(typingEl);
    const msgEl = document.createElement('div');
    msgEl.className = 'oracle-msg oracle-msg--bot oracle-msg--response';
    const rp = document.createElement('p');
    rp.textContent = text;
    msgEl.appendChild(rp);
    messagesEl.appendChild(msgEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    againWrap.style.display = 'block';
  }, delay);
}

optionsEl.addEventListener('click', function(e) {
  const btn = e.target.closest('.oracle-option-btn');
  if (!btn) return;

  currentType = btn.dataset.type;
  addMessage(labelMap[currentType], 'user');
  optionsEl.style.display = 'none';

  function respond(city) {
    cachedCity = city;
    showTypingThenMessage(buildMessage(currentType, city));
  }

  if (cachedCity) {
    respond(cachedCity);
  } else {
    getUserCity(respond);
  }
});

againBtn.addEventListener('click', function() {
  if (!currentType) return;
  addMessage(labelMap[currentType], 'user');
  showTypingThenMessage(buildMessage(currentType, cachedCity || 'Vienna'));
});


// ── Smooth anchor scroll ──────────────────
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var href = this.getAttribute('href');
    if (href === '#') return;
    var target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ── Previous Events Carousel ──────────────
(function() {
  var cards      = Array.from(document.querySelectorAll('.prev-card'));
  var dotsWrap   = document.getElementById('previousDots');
  var btnBack    = document.getElementById('prevCarouselBack');
  var btnNext    = document.getElementById('prevCarouselNext');

  if (!cards.length || !dotsWrap) return;

  var perPage  = window.innerWidth <= 560 ? 1 : window.innerWidth <= 900 ? 2 : 3;
  var pages    = Math.ceil(cards.length / perPage);
  var current  = 0;

  // Build dots
  for (var i = 0; i < pages; i++) {
    var dot = document.createElement('div');
    dot.className = 'prev-dot' + (i === 0 ? ' active' : '');
    dot.dataset.page = i;
    dotsWrap.appendChild(dot);
  }

  function show(page) {
    current = (page + pages) % pages;
    cards.forEach(function(c, idx) {
      var inPage = idx >= current * perPage && idx < (current + 1) * perPage;
      c.classList.toggle('active', inPage);
    });
    document.querySelectorAll('.prev-dot').forEach(function(d, idx) {
      d.classList.toggle('active', idx === current);
    });
  }

  show(0);

  btnNext.addEventListener('click', function() { show(current + 1); });
  btnBack.addEventListener('click', function() { show(current - 1); });

  dotsWrap.addEventListener('click', function(e) {
    var dot = e.target.closest('.prev-dot');
    if (dot) show(parseInt(dot.dataset.page));
  });
})();
