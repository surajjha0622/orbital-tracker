# orbital-tracker

A fake "satellite orbital tracking" website — plays it completely straight with a spinning 3D globe and a fake terminal log, then flips into a "Happy Birthday" reveal with confetti.

---

## How it works

Send someone a link with their details baked into the URL:

```
https://your-domain.com/?name=Rahul&age=21&location=Mumbai
```

- `name` → shown in the final birthday message
- `age` → displayed as "Orbit Count" (their age, played as a stat)
- `location` → geocoded and used as the "target" city on the globe

**Sequence:**
1. A 3D earth (via [globe.gl](https://github.com/vasturiano/globe.gl)) loads, camera parked over India
2. A fake terminal types out lines like `Connecting to satellite constellation...`, `Authenticating secure channel...`, `Loading ISRO orbital database...`
3. `location` is geocoded through the OpenStreetMap Nominatim API (defaults to Delhi if lookup fails)
4. Camera zooms into that city on the globe, drops a red marker + green label
5. After a beat, "🎉 TARGET ACQUIRED 🎉 — Happy Birthday {name}!" appears with the location and "orbit count," plus a homemade confetti animation (~180 falling divs, no library)

---

## Tech Stack

- Vanilla JS, HTML, CSS — no build step, no framework
- [globe.gl](https://github.com/vasturiano/globe.gl) + [three.js](https://threejs.org/) (via unpkg CDN) for the 3D globe
- [Nominatim (OpenStreetMap)](https://nominatim.org/) for free geocoding — no API key needed
- Confetti effect is hand-rolled (no library)

---

## Run Locally

No build step — just open it, or serve it:

```
git clone https://github.com/surajjha0622/orbital-tracker.git
cd orbital-tracker
python3 -m http.server 8000
# visit http://localhost:8000/?name=YourFriend&age=22&location=Bengaluru
```

---

## Notes / Known Limitations

- Nominatim has usage limits and no SLA — fine for sending a link to a few friends, not for heavy traffic
- No input sanitization on `name`/`location` — they're injected straight into `innerHTML`, so don't expose this publicly as a form (it's fine as a personal prank link you control)
- City geocoding is scoped to India (`,India` appended to the search query) — change this in `script.js` if pranking someone outside India

---

## Demo

🔗 **Live:** _(Not Live Yet)_

---

## License

This project is licensed under the MIT License.
