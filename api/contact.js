// /api/contact — Vercel serverless function (Node.js runtime).
// Handles the contact form: validates the submission, saves it to
// Supabase (Postgres), and emails a notification via Resend.
//
// Required environment variables (set in Vercel → Project → Settings →
// Environment Variables, and in a local .env.local for `vercel dev`):
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY   ← the *service role* key, not the anon key.
//                                 This must never be exposed to the browser;
//                                 it only ever lives here, server-side.
//   RESEND_API_KEY
//   NOTIFY_EMAIL                ← where new-submission emails get sent
//   RESEND_FROM_EMAIL           ← e.g. "Swiss Homecare <hello@swisshome.care>"
//                                 (must be a domain verified in Resend)

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(v, maxLen) {
  return typeof v === "string" && v.trim().length > 0 && v.trim().length <= maxLen;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const { name, phone, email, message, company } = body;

  // Honeypot: a hidden field real visitors never fill in. If it's
  // present, silently pretend success so bots don't learn to avoid it.
  if (company) return res.status(200).json({ ok: true });

  if (!isNonEmptyString(name, 120)) {
    return res.status(400).json({ error: "Please enter your name." });
  }
  if (!isNonEmptyString(phone, 40)) {
    return res.status(400).json({ error: "Please enter a phone number." });
  }
  if (email && (typeof email !== "string" || !EMAIL_RE.test(email) || email.length > 200)) {
    return res.status(400).json({ error: "That email address doesn't look right." });
  }
  if (message && (typeof message !== "string" || message.length > 4000)) {
    return res.status(400).json({ error: "Message is too long." });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase environment variables");
    return res.status(500).json({ error: "Server isn't configured yet. Please try again later." });
  }

  const record = {
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : null,
    message: message ? message.trim() : null,
  };

  try {
    const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/care_requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(record),
    });

    if (!dbRes.ok) {
      const text = await dbRes.text();
      console.error("Supabase insert failed:", dbRes.status, text);
      return res.status(502).json({ error: "Couldn't save your request. Please try again." });
    }
  } catch (err) {
    console.error("Supabase insert error:", err);
    return res.status(502).json({ error: "Couldn't save your request. Please try again." });
  }

  // Email notification is best-effort — if it fails, the submission is
  // still safely saved in the database, so we don't fail the request.
  if (RESEND_API_KEY && NOTIFY_EMAIL && RESEND_FROM_EMAIL) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: RESEND_FROM_EMAIL,
          to: [NOTIFY_EMAIL],
          reply_to: record.email || undefined,
          subject: `New care request — ${record.name}`,
          text: [
            `Name: ${record.name}`,
            `Phone: ${record.phone}`,
            `Email: ${record.email || "(not provided)"}`,
            "",
            "Message:",
            record.message || "(none)",
          ].join("\n"),
        }),
      });
    } catch (err) {
      console.error("Resend notification failed:", err);
    }
  }

  return res.status(200).json({ ok: true });
}
