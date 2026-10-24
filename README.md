# RK Enterprises

Website for RK Enterprises, Jugsalai, Jamshedpur: valves, pipes & fittings and industrial hardware.

Next.js (static export) + Tailwind CSS 4, deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

```sh
npm install
npm run dev     # http://localhost:3000
npm run build   # static site in ./out
```

## Content

- **Business details, product range, enquiry form IDs**: `src/lib/site.ts`
- **Catalogue**: read from the published Google Sheet (`SHEET_CSV` in `src/lib/site.ts`).
  Columns: `Company, Art. No., Product Description, Connection Type, HSN Code, TDR Link`.
  A snapshot is baked in at build time and the page refreshes it from the sheet on load,
  so sheet edits appear without a redeploy.
- **Enquiries**: saved to a Google Sheet by the Apps Script in `scripts/enquiries.gs` (setup steps at the
  top of that file). Each row has the enquiry, a Status/Notes column for follow-up, and tracking info:
  UTM source/medium/campaign, Google/Facebook click IDs, referrer, landing page, first-visit date, device.
  Paste the web app URL into `enquirySheet.endpoint` in `src/lib/site.ts`; while it's empty, enquiries
  go to the Google Form in `enquiryForm` instead.
