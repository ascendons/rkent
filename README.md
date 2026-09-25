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
- **Enquiries**: posted to the Google Form in `enquiryForm`; responses land in that form's sheet.
