# Cliniko connection for Home Visit Planner

The planner's **Import from Cliniko** button needs a small pass-through (`worker.js`) because Cliniko's API can't be called straight from a web page. It runs free on Cloudflare Workers, stores nothing, only allows read requests for patients and appointments, and only answers the planner's own website.

## Set up (about 10 minutes, once)

1. Sign up at [dash.cloudflare.com](https://dash.cloudflare.com) (free plan is fine).
2. **Workers & Pages → Create → Create Worker**. Name it e.g. `cliniko-proxy`, deploy, then **Edit code**, replace everything with the contents of `worker.js`, and **Deploy**.
3. **Settings → Variables and Secrets**, add:
   - `ALLOWED_ORIGIN` = `https://angus-byte.github.io`
   - `CONTACT_EMAIL` = the practice's email address
4. Copy the Worker's address (e.g. `https://cliniko-proxy.yourname.workers.dev`).

## Use

1. In Cliniko: **My info → Manage API keys → Add an API key**. Copy it.
2. In the planner: **Client list → Import from Cliniko**, paste the key and the Worker address.
3. Pick **Patients with appointments in the planning week** (they get ticked for planning) or **All active patients**.

## Privacy

- Only names, addresses and phone numbers are saved, in that browser only. Clinical notes are never requested.
- The API key isn't saved unless "Remember the key on this device" is ticked. It acts with the permissions of the Cliniko user who made it, so revoke it in Cliniko if a device is lost.
- No proxy? Export patients from Cliniko (Settings → Data exports → Patients) and use **Import CSV or Excel** instead; the export's columns are recognised.
