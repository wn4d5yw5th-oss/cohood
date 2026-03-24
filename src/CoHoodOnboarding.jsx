import { useState } from "react";
export default function CoHoodOnboarding({ onFinish, lang = "EN" }) {
  const slides = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(200,180,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
        </svg>
      ),
      iconBg: "rgba(90,75,110,0.3)",
      headline: lang === "NL" ? '"Je buurt leeft."' : '"Your neighborhood\nis alive."',
      sub: lang === "NL"
        ? "Zie wat er om je heen gebeurt — behoeften, aanbiedingen en evenementen — in realtime."
        : "See what's happening around you — needs, offers, and events — all in real time.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(150,210,150,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      ),
      iconBg: "rgba(61,107,53,0.25)",
      headline: lang === "NL" ? '"Vraag. Bied aan.\nVerbind."' : '"Ask. Offer.\nConnect."',
      sub: lang === "NL"
        ? "Help een buur iets te repareren. Geef een lift. Deel een maaltijd. Kleine daden, grote impact."
        : "Help a neighbor fix something. Get a ride. Share a meal. Small acts, big impact.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(200,160,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
      iconBg: "rgba(90,60,120,0.3)",
      headline: lang === "NL" ? '"Elke daad van\nvriendelijkheid loont."' : '"Every act of kindness\nearns Co-Points."',
      sub: lang === "NL"
        ? "Je goede daden worden erkend en beloond. Zet gemeenschapsinspanning om in echte waarde."
        : "Your good deeds are recognized and rewarded. Turn community effort into real value.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(130,180,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      iconBg: "rgba(42,90,138,0.3)",
      headline: lang === "NL" ? '"Alleen geverifieerde\nburen."' : '"Verified neighbors\nonly."',
      sub: lang === "NL"
        ? "Elk lid is een echte persoon met een echte identiteit. Een veilige ruimte gebouwd op vertrouwen."
        : "Every member is a real person with a real identity. A safe space built on trust.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(150,210,150,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
        </svg>
      ),
      iconBg: "rgba(61,107,53,0.25)",
      headline: lang === "NL" ? '"De wereld wordt beter\nstraat voor straat."' : '"The world gets better\nblock by block."',
      sub: lang === "NL"
        ? "Je buurt is waar het allemaal begint. Stap de CoHood-wereld in."
        : "Your neighborhood is where it all starts. Step into the CoHood world.",
    },
  ];

  const [cur, setCur] = useState(0);
  const isLast = cur === slides.length - 1;

  return (
    <div style={{ width:"100%", minHeight:"100vh", background:"#080608", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", fontFamily:"Georgia, serif", position:"relative" }}>

      {/* Slide */}
      <div key={cur} style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", maxWidth:340, animation:"fadeUp 0.5s ease" }}>

        {/* Icon */}
        <div style={{ width:64, height:64, borderRadius:"50%", background:slides[cur].iconBg, border:"1px solid rgba(200,180,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:28 }}>
          {slides[cur].icon}
        </div>

        {/* Headline */}
        <div style={{ fontSize:22, color:"rgba(235,225,255,0.95)", fontWeight:"normal", lineHeight:1.35, marginBottom:14, letterSpacing:-0.3, whiteSpace:"pre-line" }}>
          {slides[cur].headline}
        </div>

        {/* Sub */}
        <div style={{ fontSize:13, color:"rgba(180,160,220,0.65)", lineHeight:1.7, fontFamily:"DM Sans, sans-serif", letterSpacing:0.2 }}>
          {slides[cur].sub}
        </div>
      </div>

      {/* Dots */}
      <div style={{ display:"flex", gap:8, margin:"36px 0 28px" }}>
        {slides.map((_, i) => (
          <div key={i} onClick={()=>setCur(i)} style={{ height:6, width: i===cur ? 20 : 6, borderRadius: i===cur ? 3 : "50%", background: i===cur ? "rgba(200,180,255,0.8)" : "rgba(200,180,255,0.2)", transition:"all 0.3s", cursor:"pointer" }}/>
        ))}
      </div>

      {/* Next / Join button */}
      <button
        onClick={()=>{ if(isLast) onFinish(); else setCur(c=>c+1); }}
        style={{ background:"rgba(61,107,53,0.9)", color:"#fff", border:"none", borderRadius:14, padding:"13px 36px", fontSize:14, fontFamily:"DM Sans, sans-serif", fontWeight:700, cursor:"pointer", letterSpacing:0.3 }}
      >
        {isLast ? (lang==="NL" ? "CoHood'a katıl →" : "Join CoHood →") : (lang==="NL" ? "Volgende" : "Next")}
      </button>

      {/* Skip */}
      {!isLast && (
        <button
          onClick={onFinish}
          style={{ background:"none", border:"none", color:"rgba(180,160,220,0.4)", fontSize:12, fontFamily:"DM Sans, sans-serif", cursor:"pointer", marginTop:12, letterSpacing:2, textTransform:"uppercase" }}
        >
          {lang==="NL" ? "overslaan" : "skip"}
        </button>
      )}

      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
