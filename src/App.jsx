import React, { useState, useEffect, useRef } from "react";

/*
  SWISS HOMECARE — rebuilt to match the client's Figma reference, then
  recolored to match the client's actual logo (navy + crimson red on white).
  Serves families in Uganda (Kampala, Entebbe, Jinja & beyond).

  Tokens (sampled directly from the logo file):
    cream     #FFFFFF   background
    ink       #0A2540   headings / body text — the logo's navy
    green     #0A2540   primary accent — nav mark, buttons, section labels (same navy)
    greenLt   #E7ECF2   soft icon backgrounds — light navy tint
    terracotta#C41220   secondary accent — badges, stars, "Est." card — the logo's red
    stone     #F1F3F5   alternating section background / borders

  No stats or testimonials are included yet — the company is new and none
  of those numbers exist. Placeholders are clearly marked so they're easy
  to swap for real photography and quotes once available.
*/

const C = {
  cream: "#FFFFFF",
  ink: "#0A2540",
  green: "#0A2540",
  greenDark: "#071A2E",
  greenLt: "#E7ECF2",
  terracotta: "#C41220",
  terracottaDark: "#8F0D17",
  stone: "#F1F3F5",
  stoneLine: "#DDE2E7",
};

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* Photo panel — renders a real photo when `src` is supplied, otherwise
   falls back to a labelled placeholder block for spots not filled yet. */
function PhotoPlaceholder({ height = 420, radius = 20, label = "Photo placeholder", src, alt }) {
  const [hover, setHover] = useState(false);
  if (src) {
    return (
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ height, borderRadius: radius, border: `1px solid ${C.stoneLine}`, overflow: "hidden", position: "relative" }}
      >
        <img
          src={src}
          alt={alt || ""}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hover ? "scale(1.04)" : "scale(1)",
            transition: "transform .6s ease",
            display: "block",
          }}
        />
      </div>
    );
  }
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height,
        borderRadius: radius,
        background: `linear-gradient(155deg, ${C.greenLt} 0%, ${C.stone} 55%, #DCE6DD 100%)`,
        border: `1px solid ${C.stoneLine}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        transform: hover ? "scale(1.012)" : "scale(1)",
        transition: "transform .5s ease",
      }}
    >
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="1.2" opacity="0.55">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10" r="1.6" />
        <path d="M21 16l-5.2-5.2a1.5 1.5 0 0 0-2.1 0L4 19" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ position: "absolute", bottom: 16, fontFamily: "'Inter',sans-serif", fontSize: 12, letterSpacing: 1, color: C.green, opacity: 0.6 }}>
        {label}
      </span>
    </div>
  );
}

/* A worked example of a tailored care plan — built as a real document
   mockup rather than a stock photo, since "an example of a care plan"
   isn't something a photograph can show. */
function CarePlanMockup({ height = 380 }) {
  const rows = [
    { time: "07:00", task: "Morning routine & medication" },
    { time: "12:30", task: "Lunch & mobility exercises" },
    { time: "16:00", task: "Companionship visit" },
    { time: "20:00", task: "Evening check-in & medication" },
  ];
  return (
    <div
      style={{
        height,
        borderRadius: 20,
        background: "#fff",
        border: `1px solid ${C.stoneLine}`,
        padding: "28px 30px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 24px 44px -30px rgba(10,37,64,0.35)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div>
          <p style={{ fontSize: 11.5, letterSpacing: 1.5, color: C.terracotta, fontWeight: 600, marginBottom: 6 }}>
            SAMPLE CARE PLAN
          </p>
          <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 600 }}>Grace N.'s Weekly Plan</h3>
        </div>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: C.greenLt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {ICONS.check({ width: 17, height: 17 })}
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, marginBottom: 20, paddingBottom: 18, borderBottom: `1px solid ${C.stoneLine}` }}>
        {[
          ["Care level", "Personal + companionship"],
          ["Visits", "4x daily"],
          ["Reviewed", "Every 4 weeks"],
        ].map(([label, value]) => (
          <div key={label}>
            <p style={{ fontSize: 11, opacity: 0.5, marginBottom: 3 }}>{label}</p>
            <p style={{ fontSize: 13, fontWeight: 600 }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {rows.map((r) => (
          <div key={r.time} style={{ display: "flex", alignItems: "center", gap: 14, background: C.stone, borderRadius: 10, padding: "10px 14px" }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 600, color: C.green, minWidth: 46 }}>{r.time}</span>
            <span style={{ fontSize: 13.5, opacity: 0.8 }}>{r.task}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11.5, opacity: 0.45, marginTop: 16 }}>
        Just an example. Every plan is written around the individual.
      </p>
    </div>
  );
}

const ICONS = {
  heart: (p) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={C.green} strokeWidth="1.6" {...p}>
      <path d="M12 20s-7-4.4-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5c-2.5 4.6-9.5 9-9.5 9Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  shield: (p) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={C.green} strokeWidth="1.6" {...p}>
      <path d="M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  clock: (p) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={C.green} strokeWidth="1.6" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  star: (p) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={C.green} strokeWidth="1.6" {...p}>
      <path d="M12 3.5l2.6 5.4 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.9 2.6-5.4Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={C.green} strokeWidth="1.8" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  phone: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={C.green} strokeWidth="1.6" {...p}>
      <path d="M6.5 3.5h3l1.5 4-2 1.7a12 12 0 0 0 5.8 5.8l1.7-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 5 6.6a1.5 1.5 0 0 1 1.5-1.6Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  mail: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={C.green} strokeWidth="1.6" {...p}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="M4 6.5l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  pin: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={C.green} strokeWidth="1.6" {...p}>
      <path d="M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  ),
  arrow: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const SERVICES = [
  { icon: "heart", title: "Personal care", copy: "Help with bathing, dressing and daily routines, delivered with dignity and patience." },
  { icon: "shield", title: "Medical support", copy: "Medication management, wound care and vital-sign monitoring from trained professionals." },
  { icon: "clock", title: "24/7 companionship", copy: "Round-the-clock presence for those who need continuous support and someone nearby." },
  { icon: "star", title: "Post-hospital care", copy: "Structured recovery support after discharge, easing the transition back to home life." },
];

const STEPS = [
  { n: "01", title: "Free home assessment", copy: "A coordinator visits and listens, understanding the household before proposing anything." },
  { n: "02", title: "A care plan, tailored", copy: "Hours, tasks and the right caregiver are matched to the person, not a generic package." },
  { n: "03", title: "Care begins at home", copy: "Your caregiver arrives on schedule. The plan is reviewed regularly as needs change." },
];

// Free-to-use Unsplash photos (Unsplash License — free for commercial use,
// no attribution required). Swap these for your brother's own photography
// whenever it's ready; just replace the URL strings below.
const PHOTOS = {
  hero: "https://images.unsplash.com/photo-1666887360680-9dc27a1d2753?fm=jpg&q=80&w=1200&auto=format&fit=crop",
  about: "https://images.unsplash.com/photo-1678225894029-ac0fe99cc047?fm=jpg&q=80&w=1200&auto=format&fit=crop",
};

const AREAS = ["Kampala", "Entebbe", "Jinja", "Mukono", "Wakiso", "and beyond"];

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function NavLink({ children, href }) {
  const [hover, setHover] = useState(false);
  const id = href.replace("#", "");
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        scrollToId(id);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ color: C.ink, textDecoration: "none", fontSize: 14.5, opacity: hover ? 1 : 0.72, position: "relative", paddingBottom: 4, transition: "opacity .2s", cursor: "pointer" }}
    >
      {children}
      <span style={{ position: "absolute", left: 0, right: hover ? 0 : "100%", bottom: 0, height: 1, background: C.terracotta, transition: "right .25s ease" }} />
    </a>
  );
}

function Button({ children, variant = "primary", href = "#", type, onClick, full, disabled }) {
  const [hover, setHover] = useState(false);
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "14px 26px",
    borderRadius: 999,
    fontSize: 14.5,
    fontFamily: "'Inter',sans-serif",
    fontWeight: 500,
    textDecoration: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    opacity: disabled ? 0.65 : 1,
    transition: "transform .18s ease, box-shadow .18s ease, background .18s ease",
    transform: hover && !disabled ? "translateY(-2px)" : "translateY(0)",
    width: full ? "100%" : "auto",
  };
  const styles = {
    primary: { background: hover && !disabled ? C.greenDark : C.green, color: C.cream, boxShadow: hover && !disabled ? "0 10px 24px -8px rgba(10,37,64,0.55)" : "0 4px 14px -8px rgba(10,37,64,0.4)" },
    outline: { background: "transparent", color: C.ink, border: `1px solid ${C.stoneLine}`, boxShadow: hover && !disabled ? "0 6px 16px -10px rgba(0,0,0,0.25)" : "none" },
  };
  const isHash = typeof href === "string" && href.startsWith("#");
  const El = href ? "a" : "button";
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (isHash) {
      e.preventDefault();
      scrollToId(href.replace("#", ""));
    }
    if (onClick) onClick(e);
  };
  return (
    <El
      href={disabled ? undefined : href}
      type={type}
      disabled={El === "button" ? disabled : undefined}
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...styles[variant] }}
    >
      {children}
    </El>
  );
}

function ServiceCard({ s, i }) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={i * 70}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: "30px 26px",
          height: "100%",
          border: `1px solid ${C.stoneLine}`,
          transform: hover ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hover ? "0 20px 34px -20px rgba(10,37,64,0.25)" : "0 1px 0 rgba(0,0,0,0)",
          transition: "transform .25s ease, box-shadow .25s ease",
        }}
      >
        <div style={{ width: 46, height: 46, borderRadius: 12, background: C.greenLt, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
          {ICONS[s.icon]()}
        </div>
        <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 19, marginBottom: 8 }}>{s.title}</h3>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, opacity: 0.68 }}>{s.copy}</p>
      </div>
    </Reveal>
  );
}

function StepCard({ s, i, active, onClick }) {
  return (
    <Reveal delay={i * 80}>
      <button
        onClick={onClick}
        style={{
          textAlign: "left",
          width: "100%",
          background: active ? "#fff" : "transparent",
          border: `1px solid ${active ? C.stoneLine : "transparent"}`,
          borderRadius: 16,
          padding: "22px 22px",
          cursor: "pointer",
          boxShadow: active ? "0 16px 30px -22px rgba(10,37,64,0.3)" : "none",
          transition: "all .25s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: active ? 10 : 0 }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 600, color: C.terracotta }}>{s.n}</span>
          <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600 }}>{s.title}</h3>
        </div>
        <div style={{ maxHeight: active ? 120 : 0, overflow: "hidden", transition: "max-height .3s ease" }}>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, opacity: 0.68, paddingLeft: 40 }}>{s.copy}</p>
        </div>
      </button>
    </Reveal>
  );
}

const inputStyle = {
  width: "100%",
  padding: "11px 13px",
  borderRadius: 10,
  border: `1px solid ${C.stoneLine}`,
  background: C.cream,
  fontFamily: "'Inter',sans-serif",
  fontSize: 14,
  outline: "none",
};

export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", company: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const Emph = ({ children }) => <em style={{ fontStyle: "italic", color: C.green }}>{children}</em>;

  return (
    <div style={{ background: C.cream, color: C.ink, fontFamily: "'Inter',sans-serif", minHeight: "100vh" }}>
      {/* NAV */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: `${C.cream}ee`, backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.stoneLine}` }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6" style={{ height: 76 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo-icon-transparent.png" alt="Swiss Homecare" style={{ height: 40, width: 40, objectFit: "contain" }} />
            <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 19 }}>Swiss Homecare</span>
          </div>
          <nav className="hidden md:flex items-center gap-9">
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#how">How it works</NavLink>
            <NavLink href="#about">About us</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </nav>
          <div className="hidden md:block">
            <Button href="#contact">Book a consultation</Button>
          </div>
          <button className="md:hidden" onClick={() => setNavOpen(!navOpen)} style={{ background: "none", border: "none", fontSize: 22 }} aria-label="Menu">
            {navOpen ? "×" : "☰"}
          </button>
        </div>
        {navOpen && (
          <div className="md:hidden px-6 pb-6 flex flex-col gap-4">
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#how">How it works</NavLink>
            <NavLink href="#about">About us</NavLink>
            <NavLink href="#contact">Contact</NavLink>
            <Button href="#contact" onClick={() => setNavOpen(false)}>Book a consultation</Button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6" style={{ paddingTop: 64, paddingBottom: 80 }}>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.greenLt, padding: "8px 16px", borderRadius: 999, marginBottom: 26 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} />
              <span style={{ fontSize: 13, color: C.greenDark }}>Serving Uganda, including {AREAS.slice(0, 3).join(", ")} and beyond</span>
            </div>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(2.4rem,5vw,3.6rem)", lineHeight: 1.08, fontWeight: 600, marginBottom: 26 }}>
              Professional care,
              <br />
              <Emph>at your door.</Emph>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.7, opacity: 0.7, maxWidth: 460, marginBottom: 34 }}>
              Swiss Homecare brings trained, compassionate caregivers directly to families across Uganda, so your loved ones can thrive at home instead of in a facility.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              <Button href="#contact">Get a free assessment <span>{ICONS.arrow()}</span></Button>
              <Button href="tel:+256775868791" variant="outline">{ICONS.phone()} Call us now</Button>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div style={{ position: "relative" }}>
              <PhotoPlaceholder height={440} src={PHOTOS.hero} alt="Caregiver assisting a client at home" />
              <div style={{ position: "absolute", left: -18, bottom: -22, background: "#fff", borderRadius: 16, padding: "16px 20px", display: "flex", gap: 12, alignItems: "center", maxWidth: 300, boxShadow: "0 20px 40px -20px rgba(10,37,64,0.35)", border: `1px solid ${C.stoneLine}` }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.greenLt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {ICONS.check()}
                </div>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>Trained & vetted caregivers</p>
                  <p style={{ fontSize: 12.5, opacity: 0.6, lineHeight: 1.4 }}>Clinical training and background checks, every time.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="max-w-6xl mx-auto px-6" style={{ paddingTop: 40, paddingBottom: 96 }}>
        <Reveal>
          <p style={{ fontSize: 13, letterSpacing: 2, color: C.terracotta, marginBottom: 14, fontWeight: 600 }}>OUR SERVICES</p>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 600, maxWidth: 560, marginBottom: 50 }}>
            Care designed around <Emph>your loved one</Emph>
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-4 gap-6">
          {SERVICES.map((s, i) => (
            <ServiceCard s={s} i={i} key={s.title} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ background: C.stone, borderTop: `1px solid ${C.stoneLine}`, borderBottom: `1px solid ${C.stoneLine}` }}>
        <div className="max-w-6xl mx-auto px-6" style={{ paddingTop: 96, paddingBottom: 96 }}>
          <Reveal>
            <p style={{ fontSize: 13, letterSpacing: 2, color: C.terracotta, marginBottom: 14, fontWeight: 600 }}>THE PROCESS</p>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 600, maxWidth: 560, marginBottom: 50 }}>
              From first call to care <Emph>starting at home</Emph>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="flex flex-col gap-3">
              {STEPS.map((s, i) => (
                <StepCard key={s.n} s={s} i={i} active={activeStep === i} onClick={() => setActiveStep(i)} />
              ))}
            </div>
            <Reveal delay={200}>
              <CarePlanMockup height={380} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="max-w-6xl mx-auto px-6" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div style={{ position: "relative" }}>
              <PhotoPlaceholder height={460} src={PHOTOS.about} alt="A caregiver sharing a warm moment with an elderly couple" />
              <div style={{ position: "absolute", right: -16, bottom: -20, background: C.terracotta, color: "#fff", borderRadius: 14, padding: "18px 22px", maxWidth: 220, boxShadow: "0 20px 36px -18px rgba(196,18,32,0.5)" }}>
                <p style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 600, marginBottom: 2 }}>Est. 2026</p>
                <p style={{ fontSize: 12.5, opacity: 0.9, lineHeight: 1.4 }}>Newly launched, built to serve Ugandan families from day one.</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p style={{ fontSize: 13, letterSpacing: 2, color: C.terracotta, marginBottom: 14, fontWeight: 600 }}>ABOUT SWISS HOMECARE</p>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 600, marginBottom: 22 }}>
              Built on the belief that <Emph>home is where healing happens</Emph>
            </h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.75, opacity: 0.72, marginBottom: 16 }}>
              Swiss Homecare was founded to bring hospital-quality care into the home, combining clinical training with genuine, patient compassion for families across Uganda.
            </p>
            <p style={{ fontSize: 15.5, lineHeight: 1.75, opacity: 0.72, marginBottom: 28 }}>
              Our caregivers are chosen not only for their skills, but for their character. Who cares for your loved one matters as much as how they do it.
            </p>
            <div className="flex flex-col gap-3">
              {["Fully licensed and insured care services", "Continuous caregiver training and supervision", "Transparent pricing with no hidden fees", "Regular family updates and care reports"].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {ICONS.check()}
                  <span style={{ fontSize: 14.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICE AREA STRIP */}
      <section style={{ background: C.green, color: C.cream }}>
        <div style={{ display: "flex", gap: 48, padding: "22px 0" }} className="max-w-6xl mx-auto px-6 justify-center flex-wrap">
          {AREAS.map((a) => (
            <span key={a} style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: 16, opacity: 0.9 }}>
              {a}
            </span>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="max-w-6xl mx-auto px-6" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div className="grid md:grid-cols-2 gap-16">
          <Reveal>
            <p style={{ fontSize: 13, letterSpacing: 2, color: C.terracotta, marginBottom: 14, fontWeight: 600 }}>GET IN TOUCH</p>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 600, marginBottom: 22 }}>
              Let us care for your <Emph>family</Emph>
            </h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.75, opacity: 0.72, marginBottom: 32, maxWidth: 420 }}>
              Reach out for a free, no-obligation home assessment. We'll walk you through your options and design a care plan that truly fits.
            </p>
            <div className="flex flex-col gap-5">
              {[
                { icon: "phone", label: "Phone", value: "+256 775 868 791" },
                { icon: "mail", label: "Email", value: "hello@swisshome.care" },
                { icon: "pin", label: "Headquarters", value: "Bunga, Kampala, Uganda" },
              ].map((c) => (
                <div key={c.label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: C.greenLt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {ICONS[c.icon]()}
                  </div>
                  <div>
                    <p style={{ fontSize: 12.5, opacity: 0.55, marginBottom: 2 }}>{c.label}</p>
                    <p style={{ fontSize: 15, fontWeight: 500 }}>{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            {sent ? (
              <div style={{ background: "#fff", borderRadius: 20, padding: 40, border: `1px solid ${C.stoneLine}` }}>
                <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 600, marginBottom: 10 }}>Thank you.</h3>
                <p style={{ fontSize: 14.5, opacity: 0.7 }}>Our team will be in touch within one business day.</p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ background: "#fff", borderRadius: 20, padding: 34, border: `1px solid ${C.stoneLine}` }}>
                <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 600, marginBottom: 22 }}>Book a free consultation</h3>
                <div className="grid md:grid-cols-2 gap-4" style={{ marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, marginBottom: 6, opacity: 0.6 }}>Full name</label>
                    <input required placeholder="Amina Nakato" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, marginBottom: 6, opacity: 0.6 }}>Phone number</label>
                    <input required placeholder="+256 7XX XXX XXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
                  </div>
                </div>
                <label style={{ display: "block", fontSize: 13, marginBottom: 6, opacity: 0.6 }}>Email address</label>
                <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ ...inputStyle, marginBottom: 16 }} />
                <label style={{ display: "block", fontSize: 13, marginBottom: 6, opacity: 0.6 }}>Tell us about your care needs</label>
                <textarea rows={4} placeholder="My father needs post-operative care after his surgery…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, marginBottom: 22, resize: "vertical" }} />
                {/* Honeypot — hidden from real visitors via CSS, but a bot filling
                    every field will fill this too, which the backend treats as spam. */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                  aria-hidden="true"
                />
                {error && (
                  <p style={{ fontSize: 13.5, color: C.terracotta, marginBottom: 14 }}>{error}</p>
                )}
                <Button href={null} type="submit" full disabled={sending}>
                  {sending ? "Sending…" : <>Send message <span>{ICONS.arrow()}</span></>}
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.ink, color: C.cream }}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10" style={{ paddingTop: 56, paddingBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <img src="/logo-icon-transparent.png" alt="Swiss Homecare" style={{ height: 36, width: 36, objectFit: "contain" }} />
              <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 17 }}>Swiss Homecare</span>
            </div>
            <p style={{ fontSize: 13.5, opacity: 0.6, lineHeight: 1.7, maxWidth: 260 }}>
              Door-to-door care services for families across Uganda. Compassionate, professional, reliable.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 12.5, letterSpacing: 1.5, opacity: 0.5, marginBottom: 16 }}>QUICK LINKS</p>
            <div className="flex flex-col gap-2.5" style={{ fontSize: 14 }}>
              {[
                ["services", "Services"],
                ["how", "How it works"],
                ["about", "About us"],
                ["contact", "Contact"],
              ].map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(id);
                  }}
                  style={{ color: C.cream, opacity: 0.75, textDecoration: "none", cursor: "pointer" }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 12.5, letterSpacing: 1.5, opacity: 0.5, marginBottom: 16 }}>CONTACT</p>
            <div className="flex flex-col gap-2.5" style={{ fontSize: 14, opacity: 0.75 }}>
              <span>+256 775 868 791</span>
              <span>hello@swisshome.care</span>
              <span>Bunga, Kampala, Uganda</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", textAlign: "center", padding: "18px 0", fontSize: 12.5, opacity: 0.45 }}>
          © 2026 Swiss Homecare. Licensed home care provider.
        </div>
      </footer>
    </div>
  );
}