/**
 * Website enquiries → Google Sheet.
 *
 * Setup (once):
 *   1. Create a Google Sheet (e.g. "RK Enterprises – Enquiries").
 *   2. Extensions → Apps Script, replace the code with this file, Save.
 *   3. Deploy → New deployment → type "Web app"
 *        Execute as: Me    Who has access: Anyone
 *      Authorise when asked, then copy the Web app URL (ends in /exec).
 *   4. Paste that URL into `enquirySheet.endpoint` in src/lib/site.ts and push.
 *
 * After editing this script, use Deploy → Manage deployments → Edit → New version,
 * so the /exec URL stays the same.
 */

// Optional: also email each enquiry here. Leave empty to turn off.
const NOTIFY = "";

const SHEET = "Enquiries";

// [column header, field posted by the website]. "Status" and "Notes" are for you to fill in.
const COLUMNS = [
  ["Received", "_received"],
  ["Status", "_status"],
  ["Name", "name"],
  ["Phone", "phone"],
  ["Email", "email"],
  ["Items (Art. No.)", "items"],
  ["Message", "message"],
  ["Notes", "_notes"],
  ["Source", "utm_source"],
  ["Medium", "utm_medium"],
  ["Campaign", "utm_campaign"],
  ["Term", "utm_term"],
  ["Content", "utm_content"],
  ["Google click ID", "gclid"],
  ["Facebook click ID", "fbclid"],
  ["Referrer", "referrer"],
  ["Landing page", "landingPage"],
  ["Submitted from", "page"],
  ["First visit", "firstVisit"],
  ["First referrer", "firstReferrer"],
  ["First landing page", "firstLanding"],
  ["Device", "userAgent"],
  ["Language", "language"],
  ["Screen", "screen"],
  ["Timezone", "timezone"],
];

function doPost(e) {
  const p = (e && e.parameter) || {};
  // Bots fill every field; the site never sends this one.
  if (p.website) return ok();

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet();
    const values = Object.assign({ _received: new Date(), _status: "New", _notes: "" }, p);
    // Write by header name, so columns can be reordered or added in the sheet.
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const keyOf = Object.fromEntries(COLUMNS);
    sheet.appendRow(headers.map((h) => clean(values[keyOf[h]])));
  } finally {
    lock.releaseLock();
  }

  if (NOTIFY) {
    MailApp.sendEmail({
      to: NOTIFY,
      replyTo: p.email || undefined,
      subject: `Website enquiry: ${p.name || "(no name)"}`,
      body: [
        `Name: ${p.name}`,
        `Phone: ${p.phone}`,
        `Email: ${p.email}`,
        "",
        p.message,
        "",
        `Source: ${p.utm_source || p.referrer || "direct"}`,
        `Sheet: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}`,
      ].join("\n"),
    });
  }
  return ok();
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET);
  if (!sheet) sheet = ss.insertSheet(SHEET);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map((c) => c[0]));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
  }
  return sheet;
}

// Stop values like "=HYPERLINK(...)" or "+91..." being run as formulas.
function clean(v) {
  if (v === undefined || v === null) return "";
  if (typeof v === "string" && /^[=+\-@]/.test(v)) return "'" + v;
  return v;
}

function ok() {
  return ContentService.createTextOutput("ok");
}
