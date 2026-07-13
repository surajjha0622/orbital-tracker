const params = new URLSearchParams(location.search);

const RAW_NAME = params.get("name") || "Agent";
const RAW_AGE = params.get("age") || "Unknown";
const RAW_CITY = params.get("location") || "Delhi";

// Escape anything before it ever touches innerHTML — prevents
// ?name=<script>...</script> style injection via the URL.
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

const NAME = escapeHtml(RAW_NAME);
const CITY = escapeHtml(RAW_CITY);

// Age is just for display ("Orbit Count") — fall back cleanly if it's not a number.
const parsedAge = parseInt(RAW_AGE, 10);
const AGE = Number.isFinite(parsedAge) ? parsedAge : escapeHtml(RAW_AGE);

const term = document.getElementById("terminal");
const loadingEl = document.getElementById("loading");

function log(t) {
  const line = document.createElement("div");
  line.textContent = "> " + t;
  term.appendChild(line);
  term.scrollTop = term.scrollHeight;
}

const globe = Globe()
  (document.getElementById("globe"))
  .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
  .backgroundColor("#000")
  .onGlobeReady(() => {
    loadingEl.classList.add("hidden");
  });

// Safety net in case onGlobeReady never fires (slow network, blocked CDN, etc.)
setTimeout(() => loadingEl.classList.add("hidden"), 6000);

fetch("https://nominatim.openstreetmap.org/search?format=json&q=" + encodeURIComponent(RAW_CITY) + ",India")
  .then(r => {
    if (!r.ok) throw new Error("Geocoding request failed: " + r.status);
    return r.json();
  })
  .then(data => runSequence(data))
  .catch(err => {
    console.warn("Geocoding failed, falling back to Delhi:", err);
    runSequence([]);
  });

function runSequence(data) {
  let lat = 28.6;
  let lng = 77.2;

  if (data.length) {
    lat = parseFloat(data[0].lat);
    lng = parseFloat(data[0].lon);
  }

  globe.pointOfView({ lat: 20, lng: 80, altitude: 2.8 }, 0);

  const logs = [
    "Connecting to satellite constellation...",
    "Authenticating secure channel...",
    "Loading ISRO orbital database...",
    "Searching target...",
    "Location parameter received...",
    "CITY = " + RAW_CITY,
    "Finding coordinates...",
    "Coordinates Locked.",
    "Beginning orbital descent..."
  ];

  let i = 0;
  const timer = setInterval(() => {
    if (i < logs.length) {
      log(logs[i]);
      i++;
    } else {
      clearInterval(timer);

      globe.pointOfView({ lat, lng, altitude: 0.45 }, 4000);
      globe.labelsData([{ lat, lng, text: RAW_CITY, color: "lime" }]);
      globe.pointsData([{ lat, lng, size: 0.5, color: "red" }]);

      setTimeout(() => {
        document.getElementById("final").innerHTML = `
          <hr>
          <h1>🎉 TARGET ACQUIRED 🎉</h1>
          <h2>Happy Birthday ${NAME}!</h2>
          <b>Location:</b> ${CITY}<br>
          <b>Orbit Count:</b> ${AGE}<br><br>
          Mission Status : SUCCESS ✅
        `;
        confetti();
        playRevealChime();
      }, 5000);
    }
  }, 900);
}

function confetti() {
  for (let i = 0; i < 180; i++) {
    const c = document.createElement("div");
    c.style.position = "fixed";
    c.style.left = Math.random() * 100 + "vw";
    c.style.top = "-10px";
    c.style.width = "8px";
    c.style.height = "8px";
    c.style.background = `hsl(${Math.random() * 360},100%,50%)`;
    document.body.appendChild(c);

    let y = 0;
    const drift = Math.random() * 4 - 2;
    const id = setInterval(() => {
      y += 5;
      c.style.transform = `translate(${drift * y}px,${y}px) rotate(${y}deg)`;
      if (y > innerHeight) {
        clearInterval(id);
        c.remove();
      }
    }, 20);
  }
}

// Small ascending chime using Web Audio API — no external mp3/library needed.
function playRevealChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const startTime = ctx.currentTime + idx * 0.15;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  } catch (e) {
    // Autoplay/audio restrictions shouldn't break the prank if sound can't play
    console.warn("Chime skipped:", e);
  }
}