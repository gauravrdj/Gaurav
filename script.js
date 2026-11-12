/* =========================================================
   ✏️  EDIT YOUR LINKS HERE
   Any link left as "" is hidden on the page.
   ========================================================= */
const LINKS = {
  resume: "resume.pdf",                 // drop your resume PDF next to index.html
  email: "mailto:ssparasher16@gmail.com",
  linkedin: "https://www.linkedin.com/in/little-krishna",
  github: "https://github.com/gauravrdj",
  leetcode: "https://leetcode.com/u/little_krishna/",
  codechef: "https://www.codechef.com/users/little_krishna",
  codeforces: "https://codeforces.com/profile/gauravsharma2002",
  gfg: "",                              // e.g. "https://www.geeksforgeeks.org/user/your-username"

  paymentsGithub: "https://github.com/gauravrdj/PaymentsApp_Advanced",
  paymentsLive: "",
  mediumGithub: "https://github.com/gauravrdj/Medium",
  mediumLive: "",
  profileGithub: "https://github.com/gauravrdj/profileManager",
  profileLive: "",
};

/* =========================================================
   🧒  CHARACTER SPOTS
   Drop transparent PNGs into an  img/  folder with these names
   (or change the paths). Missing images fall back to built-in doodles.
   Click a character to make it talk; edit the lines below.
   ========================================================= */
// shape: "cutout" = transparent PNG, "round" = circular sticker
const BUDDIES = {
  hero:     { img: "img/hero.png",     shape: "cutout", fallback: "kid",   say: ["Hiii! Hire him, he's sooo good!", "He codes. I nap. Teamwork!", "Psst… see his projects ↓"] },
  about:    { img: "img/about.jpg",    shape: "round",  fallback: "kid",   say: ["Cool engineer, cooler shades 😎", "Seller data? Easy peasy.", "I'm his manager. (I'm not.)"] },
  dog:      { img: "img/dog.png",      shape: "cutout", fallback: "puppy", say: ["Woof! (that means Java)", "Fetch… the data!", "*wags tail in TypeScript*"] },
  projects: { img: "img/projects.jpg", shape: "round",  fallback: "apple", say: ["It works on my machine 🤷", "Bugs? What bugs?", "Tai-yaa! Ship it!"] },
  report:   { img: "img/report.jpg",   shape: "round",  fallback: "apple", say: ["Hohoho! Top marks!", "600+ problems?! Show-off 😆", "Gold star, well earned ⭐"] },
  wave:     { img: "img/contact.jpg",  shape: "round",  fallback: "kid",   say: ["Write to him! Pleeease!", "Don't be shy, say hi!", "Inbox is open 📬"] },
  footer:   { img: "img/footer.jpg",   shape: "round",  fallback: "kid",   say: ["Thanks for visiting 🫶", "Come back soon!", "Byeee~"] },
};

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};

/* ---------- links ---------- */
$$("[data-link]").forEach((a) => {
  const url = LINKS[a.dataset.link];
  if (url) a.href = url;
  else a.hidden = true;
});
$$(".pol-links, .coding-links").forEach((box) => {
  if ($$("a", box).every((a) => a.hidden)) box.hidden = true;
});

/* ---------- year ---------- */
$("#year").textContent = new Date().getFullYear();

/* ---------- theme ---------- */
const root = document.documentElement;
const themeBtn = $(".theme-btn");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
const currentTheme = () => root.dataset.theme || (systemDark.matches ? "dark" : "light");
function applyTheme(t) {
  root.dataset.theme = t;
  themeBtn.textContent = t === "dark" ? "☀️" : "🌙";
  themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to day" : "Switch to night");
}
const saved = store.get("theme");
if (saved) applyTheme(saved);
else themeBtn.textContent = currentTheme() === "dark" ? "☀️" : "🌙";
themeBtn.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  store.set("theme", next);
  toast(next === "dark" ? "Bedtime already?! 😴" : "Good morning! ☀️");
});

/* ---------- mobile menu ---------- */
const menuBtn = $(".menu-btn");
const links = $(".links");
menuBtn.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.textContent = open ? "✕" : "☰";
});
$$(".links a").forEach((a) => a.addEventListener("click", () => {
  links.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.textContent = "☰";
}));

/* ---------- night-sky stars ---------- */
const stars = $(".stars");
for (let i = 0; i < 45; i++) {
  const s = document.createElement("i");
  s.style.left = Math.random() * 100 + "%";
  s.style.top = Math.random() * 70 + "%";
  s.style.animationDelay = (Math.random() * 2.5).toFixed(2) + "s";
  const size = 2 + Math.random() * 4;
  s.style.width = s.style.height = size + "px";
  stars.appendChild(s);
}

/* ---------- count-up numbers ---------- */
function countUp(el) {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) return;
  const dur = 1200;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    $$("[data-count]", e.target).forEach(countUp);
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
$$(".reveal").forEach((el) => io.observe(el));

/* ---------- active nav link ---------- */
const navLinks = $$(".links a[href^='#']");
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
$$("main section[id]").forEach((s) => spy.observe(s));

/* ---------- toast ---------- */
const toastEl = document.createElement("div");
toastEl.className = "toast";
toastEl.setAttribute("role", "status");
document.body.appendChild(toastEl);
let toastTimer;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

/* ---------- emoji burst ---------- */
function burst(x, y, emojis) {
  if (reduceMotion) return;
  for (let i = 0; i < 14; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.textContent = emojis[i % emojis.length];
    const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
    const dist = 70 + Math.random() * 70;
    p.style.left = x - 12 + "px";
    p.style.top = y - 12 + "px";
    p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    p.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    p.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
    document.body.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }
}

/* ---------- gold stickers ---------- */
const cheers = [
  "Gold star! I'm sooo amazing~ 😎",
  "Teacher says I'm the best! (She didn't.) 🙈",
  "Yay! Snack break earned! 🍪",
  "Hehe, did you see that? 💃",
  "Another sticker for my collection! ⭐",
  "Wow, I impressed myself again! 🤩",
];
$$(".gold").forEach((btn, i) => btn.addEventListener("click", (e) => {
  const r = btn.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, ["⭐", "🌟", "✨", btn.textContent.trim()]);
  toast(cheers[(i + Math.floor(Math.random() * cheers.length)) % cheers.length]);
}));

/* ---------- character buddies ---------- */
const INK = "#2B2622";
const DOODLES = {
  // Original doodle kid: bowl-cut hair, teal tee, navy shorts, waving.
  kid: `<svg viewBox="0 0 120 160" filter="url(#crayon)">
    <g stroke="${INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M44 128 L42 150 M76 128 L78 150" fill="none"/>
      <ellipse cx="40" cy="152" rx="9" ry="5" fill="#fff"/><ellipse cx="80" cy="152" rx="9" ry="5" fill="#fff"/>
      <path d="M32 112 Q60 104 88 112 L86 132 L64 132 L60 124 L56 132 L34 132 Z" fill="#2E4A8B"/>
      <path d="M34 82 Q60 70 86 82 L90 114 Q60 122 30 114 Z" fill="#3FB8AF"/>
      <path d="M34 86 Q20 96 24 112" fill="none"/>
      <path class="wave-arm" d="M86 86 Q102 74 104 54" fill="none"/>
      <circle cx="104" cy="50" r="7" fill="#FFE0C2"/>
      <circle cx="24" cy="114" r="7" fill="#FFE0C2"/>
      <circle cx="60" cy="48" r="32" fill="#FFE0C2"/>
      <path d="M28 46 Q28 14 60 14 Q92 14 92 46 Q84 34 72 38 Q66 28 58 36 Q46 28 40 40 Q32 36 28 46 Z" fill="#3A2A20"/>
    </g>
    <circle cx="48" cy="52" r="4" fill="${INK}"/><circle cx="72" cy="52" r="4" fill="${INK}"/>
    <circle cx="40" cy="62" r="5" fill="#FF9EC4" opacity=".8"/><circle cx="80" cy="62" r="5" fill="#FF9EC4" opacity=".8"/>
    <path d="M50 64 Q60 74 70 64" stroke="${INK}" stroke-width="3.5" fill="#E63B2E" stroke-linecap="round"/>
  </svg>`,
  // Original doodle puppy: tan, floppy brown ears, wagging tail.
  puppy: `<svg viewBox="0 0 130 110" filter="url(#crayon)">
    <g stroke="${INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <path class="tail" d="M100 72 Q120 60 116 42" fill="none"/>
      <ellipse cx="74" cy="80" rx="32" ry="20" fill="#F2C48D"/>
      <path d="M56 96 L56 104 M88 96 L88 104" fill="none"/>
      <circle cx="44" cy="50" r="28" fill="#F2C48D"/>
      <path d="M20 34 Q8 46 16 66 Q26 60 26 42 Z" fill="#9A5B34"/>
      <path d="M66 32 Q80 44 72 64 Q62 58 62 40 Z" fill="#9A5B34"/>
      <ellipse cx="44" cy="62" rx="12" ry="9" fill="#FFF3E0"/>
    </g>
    <circle cx="34" cy="48" r="3.5" fill="${INK}"/><circle cx="54" cy="48" r="3.5" fill="${INK}"/>
    <ellipse cx="44" cy="58" rx="4.5" ry="3.5" fill="${INK}"/>
    <path d="M40 66 Q44 76 48 66" fill="#FF7A8A" stroke="${INK}" stroke-width="2.5"/>
  </svg>`,
  // Original doodle: a smiling apple wearing glasses (the "teacher").
  apple: `<svg viewBox="0 0 120 130" filter="url(#crayon)">
    <g stroke="${INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M60 30 Q64 14 74 8" fill="none"/>
      <path d="M64 22 Q82 10 92 22 Q78 32 64 22 Z" fill="#7BC950"/>
      <path d="M60 34 Q40 20 22 38 Q6 62 22 96 Q38 124 60 112 Q82 124 98 96 Q114 62 98 38 Q80 20 60 34 Z" fill="#E63B2E"/>
      <circle cx="44" cy="64" r="11" fill="#fff"/><circle cx="76" cy="64" r="11" fill="#fff"/>
      <path d="M55 64 L65 64" fill="none"/>
    </g>
    <circle cx="44" cy="65" r="3.5" fill="${INK}"/><circle cx="76" cy="65" r="3.5" fill="${INK}"/>
    <path d="M48 86 Q60 96 72 86" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  </svg>`,
};

$$(".buddy").forEach((el) => {
  const cfg = BUDDIES[el.dataset.buddy];
  if (!cfg) return;
  const art = $(".buddy-art", el);
  const bubble = $(".buddy-bubble", el);
  const useDoodle = () => { el.classList.remove("round"); art.innerHTML = DOODLES[cfg.fallback] || ""; };
  if (cfg.img) {
    const img = new Image();
    img.alt = "";
    img.onload = () => { if (cfg.shape === "round") el.classList.add("round"); art.replaceChildren(img); };
    img.onerror = useDoodle;
    img.src = cfg.img;
  } else useDoodle();

  let line = 0, hideTimer;
  const talk = () => {
    bubble.textContent = cfg.say[line++ % cfg.say.length];
    el.classList.remove("wiggle"); void el.offsetWidth; el.classList.add("wiggle");
    el.classList.add("talk");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => el.classList.remove("talk"), 2600);
  };
  el.addEventListener("click", talk);
  el.addEventListener("mouseenter", () => { if (!el.classList.contains("talk")) talk(); });
  if (el.dataset.buddy === "hero") setTimeout(talk, 1200);
});

/* ---------- click the sun ---------- */
$(".sun").addEventListener("click", (e) => {
  burst(e.clientX, e.clientY, currentTheme() === "dark" ? ["🌙", "⭐", "💤"] : ["☀️", "🌈", "😎"]);
  toast(currentTheme() === "dark" ? "Shhh… the moon is sleeping 💤" : "Hello, Mr. Sun! 👋");
});

/* ---------- easter egg: type "cookie" ---------- */
let typed = "";
window.addEventListener("keydown", (e) => {
  if (e.key.length !== 1) return;
  typed = (typed + e.key.toLowerCase()).slice(-6);
  if (typed === "cookie") cookieRain();
});
function cookieRain() {
  toast("Snack time!! 🍪🍪🍪");
  if (reduceMotion) return;
  for (let i = 0; i < 40; i++) {
    const c = document.createElement("span");
    c.className = "rain";
    c.textContent = Math.random() > 0.2 ? "🍪" : "🍫";
    c.style.left = Math.random() * 100 + "vw";
    c.style.animationDuration = 2 + Math.random() * 2.5 + "s";
    c.style.animationDelay = Math.random() * 1.2 + "s";
    document.body.appendChild(c);
    c.addEventListener("animationend", () => c.remove());
  }
}
