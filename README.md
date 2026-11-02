# Home Visit Planner

Route planner for home visits on the Gold Coast. Import a client list (CSV, Excel or Cliniko), plan up to 4 weeks ahead with different clients and working days each week, and it builds an optimised day-by-day schedule with a live street map. The Month tab lists every client's visit times with a ready-made message to copy, email or text.

- Everything runs in the browser. Client details stay in that browser's local storage and are never uploaded.
- The map, address lookup and road network are bundled in `data/` (built from Overture Maps / OpenStreetMap data, © OpenStreetMap contributors).
- Drive times use typical road speeds plus an estimated peak-hour slowdown, not live traffic.

Hosted with GitHub Pages: open `index.html`.

## Cliniko

Clients can be imported from Cliniko either with a patient CSV export (no setup) or live via **Import from Cliniko**, which needs a small free proxy. See [`cliniko-proxy/`](cliniko-proxy/README.md).
