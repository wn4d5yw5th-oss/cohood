import { useState } from "react";
import { signUp, signIn, signOut, resetPassword } from './auth';
// ── Icon renderer ─────────────────────────────────────────────────────────
const P = {
  home:"M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z M9 21V12h6v9",
  heart:"M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  calendar:"M3 4h18a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2z M16 2v4 M8 2v4 M3 10h18",
  user:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 3a4 4 0 110 8 4 4 0 010-8z",
  users:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 3a4 4 0 110 8 4 4 0 010-8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  mapPin:"M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z M12 7a3 3 0 110 6 3 3 0 010-6z",
  clock:"M12 3a9 9 0 110 18A9 9 0 0112 3z M12 7v5l3 3",
  chevronRight:"M9 18l6-6-6-6",
  chevronDown:"M6 9l6 6 6-6",
  alert:"M12 2a10 10 0 110 20A10 10 0 0112 2z M12 8v4 M12 16h.01",
  leaf:"M17 8C8 10 5.9 16.17 3.82 19.31a1 1 0 001.68 1.08C7.23 17.68 10.12 16 12 16c3.31 0 6-2.69 6-6a6 6 0 00-1-3.27 M12.41 8.83C11.81 4.86 9.2 2.6 3 2c0 5.2 2.8 8.4 9.41 6.83z",
  tool:"M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",
  bag:"M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0",
  car:"M5 17H3v-5l2-5h14l2 5v5h-2 M5 17a2 2 0 104 0 M15 17a2 2 0 104 0",
  baby:"M12 4a4 4 0 110 8 4 4 0 010-8z M6 20v-2a6 6 0 0112 0v2",
  msg:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  bell:"M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  globe:"M12 2a10 10 0 110 20A10 10 0 0112 2z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
  sun:"M12 2a5 5 0 110 10A5 5 0 0112 2z M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42",
  moon:"M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  back:"M19 12H5 M12 19l-7-7 7-7",
  check:"M20 6L9 17l-5-5",
  send:"M22 2L11 13 M22 2L15 22l-4-9-9-4 20-7z",
  mail:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  lock:"M7 11V7a5 5 0 0110 0v4 M3 11h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V11z",
  eye:"M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z M12 9a3 3 0 110 6 3 3 0 010-6z",
  eyeOff:"M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94 M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24 M1 1l22 22",
  star:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  card:"M1 4h22a2 2 0 012 2v12a2 2 0 01-2 2H1a2 2 0 01-2-2V6a2 2 0 012-2z M1 10h22",
  camera:"M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 9a4 4 0 110 8 4 4 0 010-8z",
  hands:"M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z",
  plus:"M12 5v14 M5 12h14",
  info:"M12 2a10 10 0 110 20A10 10 0 0112 2z M12 16v-4 M12 8h.01",
};

const Icon = ({ n, size=18, color="currentColor", sw=1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(P[n]||"").split(" M").map((seg, i) => (
      <path key={i} d={i === 0 ? seg : "M" + seg} />
    ))}
  </svg>
);

const VerBadge = ({ size=16 }) => (
  <span style={{ position:"relative", display:"inline-flex", width:size, height:size, flexShrink:0 }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#3D6B35" stroke="none">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
    <svg width={size*0.55} height={size*0.55} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ position:"absolute", top:"22%", left:"22%" }}>
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  </span>
);

// Design tokens
const G = "#3D6B35"; const GL = "#EBF3E8";
const R = "#C44B1A"; const RL = "#FDF0EB";
const PU = "#5A3A7A"; const PUL = "#F3EEF8";
const BL = "#2A5A8A"; const BLL = "#EBF0F8";
const AVC = ["#3D6B35","#7A4F3A","#2A5A8A","#7A6B2A","#5A3A7A","#2A7A6B"];

const Av = ({ ini, size=40, col=G, ver=false }) => (
  <span style={{ position:"relative", display:"inline-flex", flexShrink:0 }}>
    <span style={{ width:size, height:size, borderRadius:"50%", background:col, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.33, fontWeight:700, color:"#fff", fontFamily:"DM Sans,sans-serif", letterSpacing:.5 }}>{ini}</span>
    {ver && <span style={{ position:"absolute", bottom:-2, right:-2 }}><VerBadge size={size*.42}/></span>}
  </span>
);

// Lang data
const LANGS = { EN:"EN", NL:"NL" };
const FLAGS = { EN:"EN", NL:"NL" };

const POSTS = {
  EN:[
    { id:1, type:"help", user:"Fatma K.", ini:"FK", ver:true, time:"12 min", cat:"Repair", icon:"tool", body:"Kitchen faucet is dripping, can anyone help with plumbing?", offer:"I can help with Turkish-Dutch translation.", likes:4, replies:2, urgent:true, hood:"De Pijp" },
    { id:2, type:"event", user:"Jan V.", ini:"JV", ver:true, time:"1 hr", cat:"Urban Farming", icon:"leaf", body:"This Saturday we are planting tomatoes on the rooftop garden. All supplies provided!", offer:null, likes:14, replies:7, urgent:false, hood:"Jordaan", date:"Sat 14:00" },
    { id:3, type:"help", user:"Maria S.", ini:"MS", ver:false, time:"2 hr", cat:"Shopping", icon:"bag", body:"Down with the flu, could someone pick up my groceries?", offer:"I love cooking and can bring meals to neighbors.", likes:9, replies:5, urgent:true, hood:"Oud-West" },
    { id:4, type:"announce", user:"CoHood Admin", ini:"CA", ver:true, time:"Yesterday", cat:"Announcement", icon:"bell", body:"Neighborhood meeting Thursday 19:00 at Gemeentehuis. Agenda: park renovation.", offer:null, likes:28, replies:12, urgent:false, hood:"All Neighborhood" },
  ],
  NL:[
    { id:1, type:"help", user:"Fatma K.", ini:"FK", ver:true, time:"12 min", cat:"Reparatie", icon:"tool", body:"Keukenkraan lekt, kan iemand helpen met loodgieterwerk?", offer:"Ik kan helpen met Turks-Nederlands vertaalwerk.", likes:4, replies:2, urgent:true, hood:"De Pijp" },
    { id:2, type:"event", user:"Jan V.", ini:"JV", ver:true, time:"1 uur", cat:"Stadslandbouw", icon:"leaf", body:"Deze zaterdag planten we tomaten op de dakmoestuin. Alle spullen aanwezig!", offer:null, likes:14, replies:7, urgent:false, hood:"Jordaan", date:"Za 14:00" },
    { id:3, type:"help", user:"Maria S.", ini:"MS", ver:false, time:"2 uur", cat:"Boodschappen", icon:"bag", body:"Ik lig ziek, kan iemand mijn boodschappen doen?", offer:"Ik kook graag en kan maaltijden brengen.", likes:9, replies:5, urgent:true, hood:"Oud-West" },
    { id:4, type:"announce", user:"CoHood Admin", ini:"CA", ver:true, time:"Gisteren", cat:"Aankondiging", icon:"bell", body:"Buurtbijeenkomst donderdag 19:00 in Gemeentehuis. Agenda: parkrenovatie.", offer:null, likes:28, replies:12, urgent:false, hood:"Hele Buurt" },
  ],
};

const CONVS = [
  { id:1, ini:"FK", col:AVC[0], name:"Fatma K.", ver:true, unread:2, mine:false },
  { id:2, ini:"JV", col:AVC[1], name:"Jan V.", ver:true, unread:0, mine:false },
  { id:3, ini:"MS", col:AVC[2], name:"Maria S.", ver:false, unread:0, mine:true },
  { id:4, ini:"CA", col:AVC[3], name:"CoHood Admin", ver:true, unread:1, mine:false },
];

const TXT = {
  EN:{ tagline:"Neighborhood solidarity platform", feed:"Feed", share:"Share", events:"Events", messages:"Messages", profile:"Profile", login:"Sign In", register:"Sign Up", loginBtn:"Sign In", registerBtn:"Create Account", or:"or", emailPh:"Email address", passPh:"Password", namePh:"Full Name", hoodPh:"Neighborhood", forgot:"Forgot password", noAcc:"Don't have an account?", hasAcc:"Already a member?", verNote:"After creating your account, you will need to verify your identity.", all:"All", helpF:"Help", eventF:"Events", feedTitle:"Neighborhood Feed", neighbors:"neighbors", needTitle:"I need help", needDesc:"What kind of help do you need?", offerTitle:"I can offer support", offerDesc:"What support can you offer your neighbors?", needPh:"Describe the situation...", offerPh:"Describe what you can offer...", urgentLbl:"Mark as urgent", submitLbl:"Share", formTitle:"Help and Support Sharing", formSub:"Share your need and what you can offer.", evTitle:"Create Event", evTypes:["Urban Farming","Neighborhood Clean","Tea Meetup","Workshop","Celebration"], evIcons:["leaf","sun","msg","star","bell"], evName:"Event name", evDate:"Date and time", evLoc:"Location", evSubmit:"Create Event", helpCats:["Repair","Shopping","Transport","Childcare","Garden","Cooking","Translation","Other"], helpIcons:["tool","bag","car","baby","leaf","star","globe","msg"], verTitle:"Identity Verification", verSub:"You need to verify your identity to use this feature.", verWhy:"Why is this required?", verWhyTxt:"Identity verification ensures all CoHood users are real people, creating a safe solidarity network.", verS1:"Upload ID Card", verS1d:"Photo of national ID or passport (front)", verS2:"Take a Selfie", verS2d:"Take a selfie holding your ID card", verS3:"Review", verS3d:"Usually approved within 24 hours", verUpId:"Upload ID Card", verUpSelf:"Upload Selfie", verStart:"Start Verification", verPend:"Verification pending...", verPendTxt:"We are reviewing your documents. You will hear back within 24 hours.", verDone:"Identity verified!", verDoneTxt:"You now have access to all features.", verSkip:"Not now", verBadge:"Verified", verReq:"Identity verification required for this feature", verNow:"Verify Now", respond:"Respond", join:"Join", urgent:"Urgent", okHelp:"Shared!", okHelpSub:"Your neighbors have been notified.", okEv:"Event created!", okEvSub:"Neighborhood has been invited.", msgTitle:"Messages", online:"Online", msgPh:"Write a message...", sendLbl:"Send", translate:"Translate", translating:"Translating...", original:"Original", profHood:"De Pijp, Amsterdam", helped:"Helped", evLabel:"Events", conns:"Connections", myOffers:"My Support Offers", addOffer:"Add Offer", langPref:"Language", darkMode:"Dark Mode", notif:"Notifications", idVer:"ID Verification", verified:"Verified", notVer:"Not verified", logout:"Sign Out", convLast:["Available tomorrow!","Are you joining the event?","I can help","Thanks for attending"], convTime:["12 min","1 hr","Yesterday","2 days"] },
  NL:{ tagline:"Platform voor buurtsolidariteit", feed:"Feed", share:"Delen", events:"Evenementen", messages:"Berichten", profile:"Profiel", login:"Inloggen", register:"Registreren", loginBtn:"Inloggen", registerBtn:"Account Aanmaken", or:"of", emailPh:"E-mailadres", passPh:"Wachtwoord", namePh:"Voor- en achternaam", hoodPh:"Buurt / Wijk", forgot:"Wachtwoord vergeten", noAcc:"Nog geen account?", hasAcc:"Al lid?", verNote:"Na het aanmaken van je account moet je je identiteit verifiëren.", all:"Alles", helpF:"Hulp", eventF:"Evenementen", feedTitle:"Buurtfeed", neighbors:"buren", needTitle:"Ik heb hulp nodig", needDesc:"Wat voor hulp heb je nodig?", offerTitle:"Ik kan ondersteuning bieden", offerDesc:"Wat kun je je buren aanbieden?", needPh:"Beschrijf de situatie...", offerPh:"Beschrijf wat je kunt aanbieden...", urgentLbl:"Markeren als urgent", submitLbl:"Delen", formTitle:"Hulp en Ondersteuning Delen", formSub:"Deel je behoefte en wat je kunt aanbieden.", evTitle:"Evenement Aanmaken", evTypes:["Stadslandbouw","Buurtschoonmaak","Thee bijeenkomst","Workshop","Feest"], evIcons:["leaf","sun","msg","star","bell"], evName:"Naam evenement", evDate:"Datum en tijd", evLoc:"Locatie", evSubmit:"Evenement Aanmaken", helpCats:["Reparatie","Boodschappen","Vervoer","Kinderopvang","Tuin","Koken","Vertaling","Overig"], helpIcons:["tool","bag","car","baby","leaf","star","globe","msg"], verTitle:"Identiteitsverificatie", verSub:"Je moet je identiteit verifiëren om deze functie te gebruiken.", verWhy:"Waarom is dit vereist?", verWhyTxt:"Identiteitsverificatie zorgt ervoor dat alle CoHood gebruikers echte mensen zijn.", verS1:"ID-kaart uploaden", verS1d:"Foto van identiteitsbewijs (voorzijde)", verS2:"Selfie maken", verS2d:"Maak een selfie met je ID-kaart", verS3:"Beoordeling", verS3d:"Meestal binnen 24 uur goedgekeurd", verUpId:"ID-kaart uploaden", verUpSelf:"Selfie uploaden", verStart:"Verificatie starten", verPend:"Verificatie in behandeling...", verPendTxt:"We beoordelen je documenten. Je ontvangt binnen 24 uur een melding.", verDone:"Identiteit geverifieerd!", verDoneTxt:"Je hebt nu toegang tot alle functies.", verSkip:"Niet nu", verBadge:"Geverifieerd", verReq:"Identiteitsverificatie vereist voor deze functie", verNow:"Nu verifiëren", respond:"Reageren", join:"Meedoen", urgent:"Urgent", okHelp:"Gedeeld!", okHelpSub:"Je buren zijn op de hoogte.", okEv:"Evenement aangemaakt!", okEvSub:"Buurt is uitgenodigd.", msgTitle:"Berichten", online:"Online", msgPh:"Schrijf een bericht...", sendLbl:"Versturen", translate:"Vertalen", translating:"Vertalen...", original:"Origineel", profHood:"De Pijp, Amsterdam", helped:"Geholpen", evLabel:"Evenementen", conns:"Verbindingen", myOffers:"Mijn Aanbod", addOffer:"Aanbod Toevoegen", langPref:"Taal", darkMode:"Donkere modus", notif:"Meldingen", idVer:"ID-verificatie", verified:"Geverifieerd", notVer:"Niet geverifieerd", logout:"Uitloggen", convLast:["Morgen beschikbaar!","Doe je mee?","Ik kan helpen","Bedankt voor deelname"], convTime:["12 min","1 uur","Gisteren","2 dagen"] },
};

const TCAT = { help:{ color:R, bg:RL }, event:{ color:G, bg:GL }, announce:{ color:BL, bg:BLL } };

// ── Verify Modal ──────────────────────────────────────────────────────────
function VerifyModal({ t, dm, onClose, onVerified }) {
  const [step, setStep] = useState("intro");
  const [idDone, setIdDone] = useState(false);
  const [selDone, setSelDone] = useState(false);
  const [why, setWhy] = useState(false);
  const bg = dm ? "#1E1A14" : "#fff";
  const ink = dm ? "#EDE7D9" : "#2C2416";
  const mid = dm ? "#9A8E7A" : "#6B5E4E";
  const bdr = dm ? "#33291E" : "#E2D9CC";
  const warm = dm ? "#2C2820" : "#F0EBE1";

  const submit = () => {
    setStep("pending");
    setTimeout(() => setStep("done"), 2000);
  };
  const finish = () => { onVerified(); onClose(); };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-end", justifyContent:"center", backdropFilter:"blur(4px)" }} onClick={onClose}>
      <div style={{ background:bg, borderRadius:"20px 20px 0 0", width:"100%", maxWidth:480, maxHeight:"90vh", overflowY:"auto", padding:"8px 20px 40px", fontFamily:"DM Sans,sans-serif" }} onClick={e => e.stopPropagation()}>
        <div style={{ width:36, height:4, background:bdr, borderRadius:2, margin:"14px auto 20px" }} />

        {step === "intro" && (
          <div>
            <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
              <div style={{ width:48, height:48, background:GL, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon n="shield" size={24} color={G} />
              </div>
              <div>
                <div style={{ fontSize:17, fontWeight:700, color:ink }}>{t.verTitle}</div>
                <div style={{ fontSize:13, color:mid, marginTop:2 }}>{t.verSub}</div>
              </div>
            </div>

            <button onClick={() => setWhy(!why)} style={{ width:"100%", padding:"11px 14px", background:warm, border:`1px solid ${bdr}`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", marginBottom:4 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Icon n="info" size={15} color={G} />
                <span style={{ fontSize:13, fontWeight:600, color:ink }}>{t.verWhy}</span>
              </div>
              <Icon n={why ? "chevronDown" : "chevronRight"} size={15} color={mid} />
            </button>
            {why && (
              <div style={{ background:GL, borderRadius:"0 0 12px 12px", padding:"12px 14px", marginBottom:12 }}>
                <p style={{ margin:0, fontSize:13, color:G, lineHeight:1.6 }}>{t.verWhyTxt}</p>
              </div>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:12, margin:"16px 0 20px" }}>
              {[[1,"card",t.verS1,t.verS1d],[2,"camera",t.verS2,t.verS2d],[3,"check",t.verS3,t.verS3d]].map(([num,icon,title,desc]) => (
                <div key={num} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <div style={{ width:30, height:30, borderRadius:"50%", background:GL, border:`1.5px solid ${G}40`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:12, fontWeight:800, color:G }}>{num}</span>
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:ink }}>{title}</div>
                    <div style={{ fontSize:12, color:mid, marginTop:2, lineHeight:1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setStep("upload")} style={{ width:"100%", padding:"14px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <Icon n="shield" size={16} color="#fff" />
              {t.verStart}
            </button>
            <button onClick={onClose} style={{ width:"100%", padding:"12px 0", background:"transparent", border:"none", color:mid, fontSize:14, cursor:"pointer", marginTop:8 }}>{t.verSkip}</button>
          </div>
        )}

        {step === "upload" && (
          <div>
            <div style={{ fontSize:17, fontWeight:700, color:ink, marginBottom:18 }}>{t.verTitle}</div>
            {[
              { done:idDone, set:setIdDone, icon:"card", label:t.verUpId, desc:t.verS1d },
              { done:selDone, set:setSelDone, icon:"camera", label:t.verUpSelf, desc:t.verS2d },
            ].map((item, i) => (
              <div key={i} onClick={() => item.set(true)} style={{ border:`2px dashed ${item.done ? G : bdr}`, borderRadius:14, padding:"22px 16px", textAlign:"center", cursor:"pointer", marginBottom:12, background:item.done ? GL : "transparent", transition:"all .2s" }}>
                {item.done ? (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                    <VerBadge size={20} />
                    <span style={{ fontSize:14, fontWeight:700, color:G }}>{item.label} ✓</span>
                  </div>
                ) : (
                  <div>
                    <Icon n={item.icon} size={26} color="#A8997E" />
                    <div style={{ fontSize:14, fontWeight:600, color:ink, marginTop:8 }}>{item.label}</div>
                    <div style={{ fontSize:12, color:mid, marginTop:4 }}>{item.desc}</div>
                  </div>
                )}
              </div>
            ))}
            <button onClick={submit} disabled={!idDone || !selDone} style={{ width:"100%", padding:"14px 0", background:idDone && selDone ? G : "#ccc", color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:idDone && selDone ? "pointer" : "not-allowed" }}>
              {t.verStart}
            </button>
          </div>
        )}

        {step === "pending" && (
          <div style={{ textAlign:"center", padding:"48px 0" }}>
            <div style={{ width:60, height:60, borderRadius:"50%", background:warm, border:`2px solid ${bdr}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <div style={{ width:24, height:24, border:`3px solid ${G}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin .8s linear infinite" }} />
            </div>
            <div style={{ fontSize:17, fontWeight:700, color:ink }}>{t.verPend}</div>
            <div style={{ fontSize:13, color:mid, marginTop:8, lineHeight:1.6 }}>{t.verPendTxt}</div>
          </div>
        )}

        {step === "done" && (
          <div style={{ textAlign:"center", padding:"32px 0" }}>
            <div style={{ width:72, height:72, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <VerBadge size={72} />
            </div>
            <div style={{ fontSize:18, fontWeight:700, color:ink, marginBottom:6 }}>{t.verDone}</div>
            <div style={{ fontSize:13, color:mid, marginBottom:24 }}>{t.verDoneTxt}</div>
            <button onClick={finish} style={{ padding:"13px 32px", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer" }}>
              {t.verBadge} →
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── Auth ──────────────────────────────────────────────────────────────────
function Auth({ onLogin, lang, setLang }) {
  const t = TXT[lang];
  // screen: login | register | forgot | forgot-sent | verify-email | profile | onboarding
  const [screen, setScreen] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [name, setName] = useState("");
  const [hood, setHood] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [code, setCode] = useState(["","","","","",""]);
  const [onbStep, setOnbStep] = useState(0);
  const [offers, setOffers] = useState([]);
  const [offerOther, setOfferOther] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);

  const [bio, setBio] = useState("");

  const isNL = lang === "NL";

  const Field = ({ icon, ph, val, set, isPass, type="text" }) => {
    const [focused, setFocused] = useState(false);
    return (
      <div style={{ display:"flex", alignItems:"center", gap:10, background:focused?"#fff":"#F0EBE1", border:`1.5px solid ${focused?G:"#E2D9CC"}`, borderRadius:12, padding:"12px 14px", transition:"all .2s" }}>
        <Icon n={icon} size={16} color={focused?G:"#A8997E"} />
        <input type={isPass&&!showPass?"password":type} placeholder={ph} value={val} onChange={e=>set(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:14, color:"#2C2416", fontFamily:"DM Sans,sans-serif" }} />
        {isPass && (
          <button onClick={()=>setShowPass(!showPass)} style={{ border:"none", background:"none", cursor:"pointer", padding:0, display:"flex", color:"#A8997E" }}>
            <Icon n={showPass?"eyeOff":"eye"} size={15} />
          </button>
        )}
      </div>
    );
  };

  const Logo = () => (
    <div style={{ background:"linear-gradient(160deg,#F0EBE1,#E8E0D0)", padding:"48px 32px 32px", position:"relative", overflow:"hidden" }}>
      {[[160,-40,120,.06],[280,60,80,.04],[-20,40,60,.05]].map(([x,y,s,o],i)=>(
        <div key={i} style={{ position:"absolute", left:x, top:y, width:s, height:s, borderRadius:"50%", background:`rgba(61,107,53,${o})` }}/>
      ))}
      <div style={{ width:52, height:52, background:G, borderRadius:15, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16, boxShadow:"0 8px 24px rgba(61,107,53,.25)" }}>
        <Icon n="users" size={24} color="#fff" sw={1.6}/>
      </div>
      <div style={{ fontFamily:"Playfair Display,serif", fontSize:28, fontWeight:700, color:"#2C2416", letterSpacing:-.5 }}>CoHood</div>
      <div style={{ color:"#6B5E4E", fontSize:13, marginTop:4 }}>{t.tagline}</div>
    </div>
  );

  const LangPicker = () => (
    <div style={{ position:"absolute", top:16, right:16, zIndex:10 }}>
      <button onClick={()=>setLangOpen(!langOpen)} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,.8)", border:"1px solid #E2D9CC", borderRadius:20, padding:"5px 11px", cursor:"pointer", fontSize:12, color:"#6B5E4E", backdropFilter:"blur(4px)" }}>
        <Icon n="globe" size={12} color="#6B5E4E"/> {lang}
      </button>
      {langOpen && (
        <div style={{ position:"absolute", right:0, top:34, background:"#fff", border:"1px solid #E2D9CC", borderRadius:12, overflow:"hidden", boxShadow:"0 8px 24px rgba(0,0,0,.1)", minWidth:140, zIndex:20 }}>
          {["EN","NL"].map(l=>(
            <button key={l} onClick={()=>{setLang(l);setLangOpen(false);}} style={{ width:"100%", padding:"10px 14px", border:"none", background:lang===l?GL:"transparent", cursor:"pointer", textAlign:"left", fontSize:13, color:lang===l?G:"#2C2416", fontFamily:"DM Sans,sans-serif", fontWeight:lang===l?700:400 }}>
              {l==="EN"?"EN — English":"NL — Nederlands"}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // ── LOGIN ──
  if (screen === "login") return (
    <div style={{ minHeight:"100vh", background:"#F7F4EF", fontFamily:"DM Sans,sans-serif", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column", position:"relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>
      <LangPicker/>
      <Logo/>
      <div style={{ flex:1, padding:"24px 24px 40px" }}>
        <div style={{ display:"flex", background:"#F0EBE1", borderRadius:12, padding:4, marginBottom:20, border:"1px solid #E2D9CC" }}>
          {[["login",t.login],["register",t.register]].map(([m,lbl])=>(
            <button key={m} onClick={()=>setScreen(m)} style={{ flex:1, padding:"10px 0", borderRadius:9, border:"none", cursor:"pointer", background:screen===m?"#fff":"transparent", color:screen===m?"#2C2416":"#6B5E4E", fontWeight:screen===m?700:500, fontSize:14, fontFamily:"DM Sans,sans-serif", boxShadow:screen===m?"0 1px 4px rgba(0,0,0,.08)":"none", transition:"all .2s" }}>{lbl}</button>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <Field icon="mail" ph={t.emailPh} val={email} set={setEmail}/>
          <Field icon="lock" ph={t.passPh} val={pass} set={setPass} isPass/>
        </div>
        <div style={{ textAlign:"right", marginTop:8 }}>
          <button onClick={()=>setScreen("forgot")} style={{ background:"none", border:"none", color:G, fontSize:13, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>{t.forgot}</button>
        </div>
        <button onClick={()=>onLogin()} style={{ width:"100%", marginTop:18, padding:"14px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(61,107,53,.3)" }}>{t.loginBtn}</button>
        <div style={{ display:"flex", alignItems:"center", gap:12, margin:"16px 0" }}>
          <div style={{ flex:1, height:1, background:"#E2D9CC" }}/><span style={{ color:"#A8997E", fontSize:12 }}>{t.or}</span><div style={{ flex:1, height:1, background:"#E2D9CC" }}/>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button style={{ flex:1, padding:"11px 0", background:"#fff", border:"1.5px solid #E2D9CC", borderRadius:12, cursor:"pointer", fontSize:13, color:"#2C2416", fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <svg width="17" height="17" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Gmail
          </button>
          <button style={{ flex:1, padding:"11px 0", background:"#fff", border:"1.5px solid #E2D9CC", borderRadius:12, cursor:"pointer", fontSize:13, color:"#2C2416", fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <svg width="15" height="17" viewBox="0 0 814 1000" fill="#2C2416"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-127.4C46.7 790.7 0 663 0 541.8c0-207.3 136.4-317 272.8-317 70.1 0 128.4 46.4 172.1 46.4 41.8 0 107.2-49.1 185.6-49.1zm-194.3-86.5c33.3-40.4 57.3-96.4 57.3-152.4 0-7.8-.6-15.6-2-22.4-54.4 2-118.8 36.3-157.8 79.4-31.4 35.1-59.1 90.3-59.1 147.1 0 8.4 1.4 16.9 2 19.5 3.2.6 8.4 1.3 13.6 1.3 48.7 0 109.3-32.7 145.9-72.5z"/></svg>
            iCloud
          </button>
        </div>
        <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:"#6B5E4E" }}>
          {t.noAcc}{" "}
          <button onClick={()=>setScreen("register")} style={{ background:"none", border:"none", color:G, fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"DM Sans,sans-serif" }}>{t.register}</button>
        </div>
      </div>
    </div>
  );

  // ── REGISTER ──
  if (screen === "register") return (
    <div style={{ minHeight:"100vh", background:"#F7F4EF", fontFamily:"DM Sans,sans-serif", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column", position:"relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>
      <LangPicker/>
      <Logo/>
      <div style={{ flex:1, padding:"24px 24px 40px" }}>
        <div style={{ display:"flex", background:"#F0EBE1", borderRadius:12, padding:4, marginBottom:20, border:"1px solid #E2D9CC" }}>
          {[["login",t.login],["register",t.register]].map(([m,lbl])=>(
            <button key={m} onClick={()=>setScreen(m)} style={{ flex:1, padding:"10px 0", borderRadius:9, border:"none", cursor:"pointer", background:screen===m?"#fff":"transparent", color:screen===m?"#2C2416":"#6B5E4E", fontWeight:screen===m?700:500, fontSize:14, fontFamily:"DM Sans,sans-serif", boxShadow:screen===m?"0 1px 4px rgba(0,0,0,.08)":"none", transition:"all .2s" }}>{lbl}</button>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <Field icon="user" ph={t.namePh} val={name} set={setName}/>
          <Field icon="mail" ph={t.emailPh} val={email} set={setEmail}/>
          <Field icon="lock" ph={t.passPh} val={pass} set={setPass} isPass/>
          <Field icon="lock" ph={isNL?"Wachtwoord bevestigen":"Confirm password"} val={pass2} set={setPass2} isPass/>
          <Field icon="mapPin" ph={t.hoodPh} val={hood} set={setHood}/>
        </div>
        <div style={{ marginTop:12, padding:"12px 14px", background:GL, borderRadius:12, display:"flex", gap:8 }}>
          <Icon n="mail" size={16} color={G}/>
          <p style={{ margin:0, fontSize:12, color:G, lineHeight:1.6 }}>
            {isNL?"Na registratie ontvang je een bevestigingsmail. Klik op de link om je account te activeren.":"After registration you'll receive a confirmation email. Click the link to activate your account."}
          </p>
        </div>
        <button onClick={async()=>{ const {error} = await signUp(email,pass,name,hood); if(error) alert(error.message); else setScreen("verify-email"); }} style={{ width:"100%", marginTop:18, padding:"14px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(61,107,53,.3)" }}>{t.registerBtn}</button>
        <div style={{ textAlign:"center", marginTop:16, fontSize:13, color:"#6B5E4E" }}>
          {t.hasAcc}{" "}
          <button onClick={()=>setScreen("login")} style={{ background:"none", border:"none", color:G, fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"DM Sans,sans-serif" }}>{t.login}</button>
        </div>
      </div>
    </div>
  );

  // ── FORGOT PASSWORD ──
  if (screen === "forgot") return (
    <div style={{ minHeight:"100vh", background:"#F7F4EF", fontFamily:"DM Sans,sans-serif", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>
      <div style={{ padding:"20px 20px 0" }}>
        <button onClick={()=>setScreen("login")} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", color:"#6B5E4E", fontSize:14, fontFamily:"DM Sans,sans-serif" }}>
          <Icon n="back" size={18} color="#6B5E4E"/> {isNL?"Terug":"Back"}
        </button>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 24px 60px" }}>
        <div style={{ width:64, height:64, background:GL, borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
          <Icon n="lock" size={28} color={G}/>
        </div>
        <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:24, fontWeight:700, color:"#2C2416", margin:"0 0 8px", letterSpacing:-.3 }}>
          {isNL?"Wachtwoord vergeten":"Forgot Password"}
        </h2>
        <p style={{ color:"#6B5E4E", fontSize:14, margin:"0 0 28px", lineHeight:1.6 }}>
          {isNL?"Voer je e-mailadres in. We sturen je een link om je wachtwoord opnieuw in te stellen.":"Enter your email address. We'll send you a link to reset your password."}
        </p>
        <Field icon="mail" ph={t.emailPh} val={email} set={setEmail}/>
        <button onClick={()=>setScreen("forgot-sent")} style={{ width:"100%", marginTop:16, padding:"14px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <Icon n="send" size={16} color="#fff"/>
          {isNL?"Link versturen":"Send Reset Link"}
        </button>
      </div>
    </div>
  );

  // ── FORGOT SENT ──
  if (screen === "forgot-sent") return (
    <div style={{ minHeight:"100vh", background:"#F7F4EF", fontFamily:"DM Sans,sans-serif", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"0 32px" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>
      <div style={{ width:80, height:80, background:GL, borderRadius:24, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24, boxShadow:"0 8px 24px rgba(61,107,53,.15)" }}>
        <Icon n="mail" size={36} color={G}/>
      </div>
      <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:24, fontWeight:700, color:"#2C2416", margin:"0 0 12px", textAlign:"center" }}>
        {isNL?"E-mail verstuurd!":"Email Sent!"}
      </h2>
      <p style={{ color:"#6B5E4E", fontSize:14, textAlign:"center", lineHeight:1.7, margin:"0 0 8px" }}>
        {isNL?"We hebben een wachtwoord reset link gestuurd naar":"We sent a password reset link to"}
      </p>
      <p style={{ color:G, fontWeight:700, fontSize:15, margin:"0 0 32px" }}>{email || "your@email.com"}</p>
      <div style={{ background:"#fff", border:"1px solid #E2D9CC", borderRadius:16, padding:"16px 18px", width:"100%", marginBottom:28 }}>
        <div style={{ fontSize:13, color:"#6B5E4E", lineHeight:1.7 }}>
          {isNL?"Controleer je inbox en spam-map. De link is 24 uur geldig.":"Check your inbox and spam folder. The link is valid for 24 hours."}
        </div>
      </div>
      <button onClick={()=>setScreen("login")} style={{ width:"100%", padding:"13px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:14, fontWeight:700, cursor:"pointer" }}>
        {isNL?"Terug naar inloggen":"Back to Sign In"}
      </button>
      <button onClick={()=>setScreen("forgot")} style={{ marginTop:12, background:"none", border:"none", color:"#6B5E4E", fontSize:13, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
        {isNL?"Link opnieuw versturen":"Resend link"}
      </button>
    </div>
  );

  // ── EMAIL VERIFICATION ──
  if (screen === "verify-email") return (
    <div style={{ minHeight:"100vh", background:"#F7F4EF", fontFamily:"DM Sans,sans-serif", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>
      <div style={{ background:"linear-gradient(160deg,#F0EBE1,#E8E0D0)", padding:"48px 32px 32px", position:"relative", overflow:"hidden" }}>
        {[[160,-40,100,.06]].map(([x,y,s,o],i)=>(
          <div key={i} style={{ position:"absolute", left:x, top:y, width:s, height:s, borderRadius:"50%", background:`rgba(61,107,53,${o})` }}/>
        ))}
        <div style={{ width:64, height:64, background:G, borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18, boxShadow:"0 8px 24px rgba(61,107,53,.25)" }}>
          <Icon n="mail" size={30} color="#fff"/>
        </div>
        <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:24, fontWeight:700, color:"#2C2416", margin:"0 0 8px", letterSpacing:-.3 }}>
          {isNL?"Controleer je e-mail":"Check your email"}
        </h2>
        <p style={{ color:"#6B5E4E", fontSize:13, margin:0, lineHeight:1.6 }}>
          {isNL?"We hebben een 6-cijferige code gestuurd naar":"We sent a 6-digit code to"}{" "}
          <strong style={{ color:"#2C2416" }}>{email || "your@email.com"}</strong>
        </p>
      </div>

      <div style={{ flex:1, padding:"28px 24px 40px" }}>
        <p style={{ color:"#6B5E4E", fontSize:14, marginBottom:20, marginTop:0 }}>
          {isNL?"Voer de verificatiecode in:":"Enter the verification code:"}
        </p>

        <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:28 }}>
          {code.map((c, i) => (
            <input key={i} maxLength={1} value={c}
              onChange={e => {
                const v = e.target.value.replace(/\D/g,"");
                const nc = [...code]; nc[i] = v;
                setCode(nc);
                if (v && i < 5) document.getElementById(`code-${i+1}`)?.focus();
              }}
              id={`code-${i}`}
              style={{ width:44, height:52, textAlign:"center", fontSize:22, fontWeight:700, border:`2px solid ${c?"#3D6B35":"#E2D9CC"}`, borderRadius:12, background:c?GL:"#fff", color:"#2C2416", outline:"none", fontFamily:"DM Sans,sans-serif", transition:"all .2s" }}
            />
          ))}
        </div>

        <button onClick={()=>setScreen("profile")} style={{ width:"100%", padding:"14px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", marginBottom:16 }}>
          {isNL?"Bevestigen":"Verify"}
        </button>

        <div style={{ background:"#fff", border:"1px solid #E2D9CC", borderRadius:14, padding:"14px 16px" }}>
          <div style={{ fontSize:13, color:"#6B5E4E", lineHeight:1.7 }}>
            {isNL?"Geen e-mail ontvangen? Controleer je spam-map of":"Didn't receive an email? Check your spam folder or"}{" "}
            <button onClick={async()=>{ const {error} = await supabase.auth.resend({ type:"signup", email:email }); if(error) alert(error.message); else alert(isNL?"Code opnieuw verstuurd!":"Code resent!"); }} style={{ background:"none", border:"none", color:G, fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"DM Sans,sans-serif" }}>
              {isNL?"stuur opnieuw":"resend"}
            </button>
          </div>
        </div>

        <div style={{ marginTop:16, padding:"12px 14px", background:"#FDF0EB", border:"1px solid #C44B1A20", borderRadius:12, display:"flex", gap:8, alignItems:"flex-start" }}>
          <Icon n="info" size={15} color="#C44B1A"/>
          <p style={{ margin:0, fontSize:12, color:"#C44B1A", lineHeight:1.6 }}>
            {isNL?"Demo modus: voer een willekeurige code in en klik op Bevestigen.":"Demo mode: enter any code and click Verify."}
          </p>
        </div>
      </div>
    </div>
  );

  // ── PROFILE COMPLETION ──
   if (screen === "profile") return (
    <div style={{ minHeight:"100vh", background:"#F7F4EF", fontFamily:"DM Sans,sans-serif", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>

      {/* Header */}
      <div style={{ background:"linear-gradient(160deg,#F0EBE1,#E8E0D0)", padding:"40px 32px 28px", position:"relative", overflow:"hidden" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontFamily:"Playfair Display,serif", fontSize:22, fontWeight:700, color:"#2C2416" }}>CoHood</div>
          <div style={{ fontSize:12, color:"#6B5E4E", background:"rgba(255,255,255,.6)", padding:"4px 12px", borderRadius:20 }}>
            {isNL?"Stap 3 van 3":"Step 3 of 3"}
          </div>
        </div>
        <div style={{ display:"flex", gap:6, marginBottom:16 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ flex:1, height:4, borderRadius:2, background:"#3D6B35" }}/>
          ))}
        </div>
        <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:22, fontWeight:700, color:"#2C2416", margin:"0 0 4px" }}>
          {isNL?"Profiel aanmaken":"Complete your profile"}
        </h2>
        <p style={{ color:"#6B5E4E", fontSize:13, margin:0 }}>
          {isNL?"Vertel je buren iets over jezelf":"Tell your neighbors a bit about yourself"}
        </p>
      </div>

      <div style={{ flex:1, padding:"24px 24px 40px", overflowY:"auto" }}>

        {/* Avatar upload */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
          <div style={{ position:"relative" }}>
            <div style={{ width:88, height:88, borderRadius:"50%", background: avatarUrl ? "transparent" : "#3D6B35", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, fontWeight:700, color:"#fff", overflow:"hidden", border:"3px solid #EBF3E8" }}>
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                : <span>{name ? name[0].toUpperCase() : "?"}</span>
              }
            </div>
            <label htmlFor="avatar-upload" style={{ position:"absolute", bottom:0, right:0, width:28, height:28, background:"#3D6B35", borderRadius:"50%", border:"2px solid #F7F4EF", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 9a4 4 0 110 8 4 4 0 010-8z"/>
              </svg>
            </label>
            <input id="avatar-upload" type="file" accept="image/*" style={{ display:"none" }} onChange={async(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const fileExt = file.name.split('.').pop();
              const fileName = Math.random() + '.' + fileExt;
              const { error } = await supabase.storage.from('avatars').upload(fileName, file);
              if (!error) {
                const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
                setAvatarUrl(data.publicUrl);
              } else {
                alert(error.message);
              }
            }}/>
          </div>
        </div>

        {/* Name field */}
        <div style={{ display:"flex", alignItems:"center", gap:10, background:"#F0EBE1", border:"1.5px solid #E2D9CC", borderRadius:12, padding:"12px 14px", marginBottom:10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A8997E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 3a4 4 0 110 8 4 4 0 010-8z"/>
          </svg>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder={isNL?"Voornaam":"First name"}
            style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:14, color:"#2C2416", fontFamily:"DM Sans,sans-serif" }}/>
        </div>

        {/* Neighborhood dropdown */}
        <div style={{ marginBottom:10 }}>
          <select value={hood} onChange={e=>setHood(e.target.value)} style={{ width:"100%", padding:"12px 14px", background:"#F0EBE1", border:"1.5px solid #E2D9CC", borderRadius:12, fontSize:14, color: hood ? "#2C2416" : "#A8997E", fontFamily:"DM Sans,sans-serif", outline:"none", appearance:"none", cursor:"pointer" }}>
            <option value="" disabled>{isNL?"Kies jouw buurt":"Select your neighborhood"}</option>
            {[
              "Centrum","De Pijp","Jordaan","Oud-West","Oud-Zuid","Oost","Noord","West","Nieuw-West","Zuidoost",
              "Watergraafsmeer","Indische Buurt","Dapperbuurt","Baarsjes","Westerpark","Bos en Lommer",
              "Slotervaart","Geuzenveld","Osdorp","Slotermeer","Bijlmer","Gaasperdam","IJburg",
              "Zeeburg","Rivierenbuurt","Buitenveldert","Amstelveen-Noord","De Aker","Sloten",
              "Overtoomse Veld","Landlust","Staatsliedenbuurt","Spaarndammerbuurt","Haarlemmerbuurt",
              "Grachtengordel","Nieuwmarkt","Plantage","Weesperbuurt","Knsm-eiland","Java-eiland",
              "Borneo-eiland","Overhoeks","Buiksloterham","Tuindorp Oostzaan","Nieuwendam","Volendam"
            ].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        {/* Bio */}
        <div style={{ background:"#F0EBE1", border:"1.5px solid #E2D9CC", borderRadius:12, padding:"12px 14px", marginBottom:16 }}>
          <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder={isNL?"Korte bio (optioneel)...":"Short bio (optional)..."}
            style={{ width:"100%", border:"none", outline:"none", background:"transparent", fontSize:14, color:"#2C2416", fontFamily:"DM Sans,sans-serif", resize:"none", minHeight:70, boxSizing:"border-box" }}/>
        </div>

        {/* Offers */}
        <div style={{ marginBottom:20 }}>
          <p style={{ fontSize:13, fontWeight:600, color:"#2C2416", margin:"0 0 10px" }}>
            {isNL?"Wat kun je aanbieden aan je buren?":"What can you offer your neighbors?"}
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:10 }}>
            {(isNL
              ? ["Vertaling","Koken","Tuinieren","Vervoer","Reparaties","Kinderopvang","Anders"]
              : ["Translation","Cooking","Gardening","Transport","Repairs","Childcare","Other"]
            ).map(o=>(
              <button key={o} onClick={()=>setOffers(prev=>prev.includes(o)?prev.filter(x=>x!==o):[...prev,o])}
                style={{ padding:"7px 14px", borderRadius:20, border:"1.5px solid " + (offers.includes(o)?"#3D6B35":"#E2D9CC"), background:offers.includes(o)?"#EBF3E8":"#fff", color:offers.includes(o)?"#3D6B35":"#6B5E4E", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .2s" }}>
                {o}
              </button>
            ))}
          </div>
          {/* Other text input */}
          {(offers.includes("Other") || offers.includes("Anders")) && (
            <div style={{ background:"#F0EBE1", border:"1.5px solid #3D6B35", borderRadius:12, padding:"10px 14px" }}>
              <input value={offerOther} onChange={e=>setOfferOther(e.target.value)}
                placeholder={isNL?"Beschrijf wat je kunt aanbieden...":"Describe what you can offer..."}
                style={{ width:"100%", border:"none", outline:"none", background:"transparent", fontSize:13, color:"#2C2416", fontFamily:"DM Sans,sans-serif" }}/>
            </div>
          )}
        </div>

        <button onClick={()=>setScreen("onboarding")} style={{ width:"100%", padding:"14px 0", background:"#3D6B35", color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer" }}>
          {isNL?"Doorgaan":"Continue"}
        </button>
        <button onClick={()=>setScreen("onboarding")} style={{ width:"100%", marginTop:10, padding:"10px 0", background:"transparent", border:"none", color:"#6B5E4E", fontSize:13, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
          {isNL?"Overslaan":"Skip for now"}
        </button>
      </div>
    </div>
  );

  // ── ONBOARDING ──
  const onbSlides = [
    {
      icon:"users", bg:"#EBF3E8", color:G,
      title: isNL?"Welkom bij CoHood!":"Welcome to CoHood!",
      desc: isNL?"Verbind met je buren. Vraag hulp, bied ondersteuning en organiseer buurtactiviteiten.":"Connect with your neighbors. Ask for help, offer support and organize neighborhood activities.",
    },
    {
      icon:"shield", bg:GL, color:G,
      title: isNL?"Veilige gemeenschap":"Safe Community",
      desc: isNL?"Alle leden worden geverifieerd met een geldig ID. Zo weet je zeker dat je met echte buren communiceert.":"All members are verified with a valid ID. This ensures you're communicating with real neighbors.",
    },
    {
      icon:"hands", bg:"#F3EEF8", color:PU,
      title: isNL?"Geef en ontvang":"Give and Receive",
      desc: isNL?"Deel je behoeften en wat je kunt aanbieden in één bericht. Samen zijn we sterker!":"Share your needs and what you can offer in one post. Together we're stronger!",
    },
  ];

  const slide = onbSlides[onbStep];
  return (
    <div style={{ minHeight:"100vh", background:"#F7F4EF", fontFamily:"DM Sans,sans-serif", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>

      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"40px 32px" }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:40 }}>
          <div style={{ width:120, height:120, background:slide.bg, borderRadius:36, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 16px 48px ${slide.color}30` }}>
            <Icon n={slide.icon} size={52} color={slide.color} sw={1.5}/>
          </div>
        </div>

        <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:26, fontWeight:700, color:"#2C2416", margin:"0 0 14px", textAlign:"center", letterSpacing:-.3 }}>
          {slide.title}
        </h2>
        <p style={{ color:"#6B5E4E", fontSize:15, lineHeight:1.7, textAlign:"center", margin:"0 0 40px" }}>
          {slide.desc}
        </p>

        <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:40 }}>
          {onbSlides.map((_,i)=>(
            <div key={i} style={{ width:i===onbStep?24:8, height:8, borderRadius:4, background:i===onbStep?G:"#E2D9CC", transition:"all .3s" }}/>
          ))}
        </div>

        <button onClick={()=>{ if(onbStep<2) setOnbStep(onbStep+1); else onLogin(); }}
          style={{ width:"100%", padding:"14px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(61,107,53,.3)" }}>
          {onbStep < 2 ? (isNL?"Volgende":"Next") : (isNL?"Aan de slag!":"Get Started!")}
        </button>
        {onbStep < 2 && (
          <button onClick={()=>onLogin()} style={{ marginTop:12, background:"none", border:"none", color:"#6B5E4E", fontSize:13, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
            {isNL?"Overslaan":"Skip"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────
function App2({ lang, setLang, onLogout, dm, setDm, verified, setVerified }) {
  const t = TXT[lang];
  const posts = POSTS[lang] || POSTS.EN;
  const [tab, setTab] = useState("feed");
  const [filter, setFilter] = useState("all");
  const [liked, setLiked] = useState({});
  const [comments, setComments] = useState({});
  const [cmtInput, setCmtInput] = useState({});
  const [translated, setTranslated] = useState({});
  const [translating, setTranslating] = useState({});
  const [dmPost, setDmPost] = useState(null);
  const [dmText, setDmText] = useState("");
  const [dmSent, setDmSent] = useState(false);
  const [activeConv, setActiveConv] = useState(null);
  const [convMsg, setConvMsg] = useState("");
  const [showVer, setShowVer] = useState(false);
  const [needCat, setNeedCat] = useState(null);
  const [needTxt, setNeedTxt] = useState("");
  const [offerCat, setOfferCat] = useState(null);
  const [offerTxt, setOfferTxt] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [evType, setEvType] = useState(null);
  const [evName, setEvName] = useState("");
  const [evDate, setEvDate] = useState("");
  const [evLoc, setEvLoc] = useState("");
  const [success, setSuccess] = useState(null);
  const [langOpen, setLangOpen] = useState(false);

  const bg = dm ? "#181510" : "#F7F4EF";
  const card = dm ? "#232018" : "#FFFFFF";
  const ink = dm ? "#EDE7D9" : "#2C2416";
  const mid = dm ? "#9A8E7A" : "#6B5E4E";
  const bdr = dm ? "#33291E" : "#E2D9CC";
  const warm = dm ? "#2C2820" : "#F0EBE1";

  const requireVer = (fn) => { if (verified) fn(); else setShowVer(true); };

  const doTranslate = (id, body) => {
    setTranslating(p => ({ ...p, [id]: true }));
    setTimeout(() => {
      setTranslated(p => ({ ...p, [id]: body + " [" + t.translate + "d]" }));
      setTranslating(p => ({ ...p, [id]: false }));
    }, 900);
  };

  const submitHelp = () => requireVer(() => {
    setSuccess("help");
    setTimeout(() => { setSuccess(null); setTab("feed"); setNeedCat(null); setNeedTxt(""); setOfferCat(null); setOfferTxt(""); setIsUrgent(false); }, 2000);
  });

  const submitEv = () => requireVer(() => {
    setSuccess("ev");
    setTimeout(() => { setSuccess(null); setTab("feed"); setEvType(null); setEvName(""); setEvDate(""); setEvLoc(""); }, 2000);
  });

  const sendDm = () => { setDmSent(true); setTimeout(() => { setDmSent(false); setDmPost(null); setDmText(""); }, 1800); };

  const filtPosts = posts.filter(p => filter === "all" || (filter === "help" && p.type === "help") || (filter === "event" && p.type === "event"));

  const NavBtn = ({ k, icon, label, badge }) => (
    <button onClick={() => setTab(k)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"7px 0 8px", border:"none", background:"transparent", cursor:"pointer", color:tab===k ? G : mid, position:"relative" }}>
      <span style={{ position:"relative" }}>
        <Icon n={icon} size={20} color={tab===k ? G : mid} sw={tab===k ? 2.2 : 1.6} />
        {badge && tab !== "messages" && (
          <span style={{ position:"absolute", top:-4, right:-6, width:16, height:16, borderRadius:"50%", background:R, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:9, fontWeight:700, color:"#fff" }}>{badge}</span>
          </span>
        )}
      </span>
      <span style={{ fontSize:10, fontWeight:tab===k ? 700 : 500, fontFamily:"DM Sans,sans-serif" }}>{label}</span>
    </button>
  );

  return (
    <div style={{ minHeight:"100vh", background:bg, fontFamily:"DM Sans,sans-serif", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background:dm ? "#1A1510" : "#fff", borderBottom:`1px solid ${bdr}`, padding:"13px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, background:G, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon n="users" size={17} color="#fff" />
          </div>
          <span style={{ fontFamily:"Playfair Display,serif", fontSize:17, fontWeight:700, color:ink, letterSpacing:-.3 }}>CoHood</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {verified && (
            <div style={{ display:"flex", alignItems:"center", gap:5, background:GL, padding:"3px 10px", borderRadius:20 }}>
              <VerBadge size={14} />
              <span style={{ fontSize:11, fontWeight:700, color:G }}>{t.verBadge}</span>
            </div>
          )}
          <button style={{ background:"none", border:"none", cursor:"pointer", color:mid, padding:4 }}><Icon n="bell" size={18} /></button>
          <button onClick={() => setDm(!dm)} style={{ background:"none", border:"none", cursor:"pointer", color:mid, padding:4 }}><Icon n={dm ? "sun" : "moon"} size={18} /></button>
        </div>
      </div>

      {/* Screens */}
      <div style={{ flex:1, overflowY:"auto" }}>

        {/* FEED */}
        {tab === "feed" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div>
                <h2 style={{ margin:0, fontSize:20, fontWeight:700, color:ink, fontFamily:"Playfair Display,serif", letterSpacing:-.3 }}>{t.feedTitle}</h2>
                <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:4, color:mid, fontSize:12 }}>
                  <Icon n="mapPin" size={12} color={mid} /> Amsterdam
                </div>
              </div>
              <div style={{ background:GL, borderRadius:20, padding:"4px 12px", display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:G }} />
                <span style={{ fontSize:12, color:G, fontWeight:600 }}>89 {t.neighbors}</span>
              </div>
            </div>

            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {[["all",t.all],["help",t.helpF],["event",t.eventF]].map(([k,lbl]) => (
                <button key={k} onClick={() => setFilter(k)} style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${filter===k ? G : bdr}`, background:filter===k ? G : "transparent", color:filter===k ? "#fff" : mid, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .2s" }}>{lbl}</button>
              ))}
            </div>

            {filtPosts.map((p, i) => {
              const tc = TCAT[p.type] || TCAT.announce;
              const ac = AVC[i % AVC.length];
              return (
                <div key={p.id} style={{ background:card, border:`1px solid ${bdr}`, borderRadius:16, padding:16, marginBottom:12, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
                  <div style={{ display:"flex", gap:10, marginBottom:10 }}>
                    <Av ini={p.ini} size={42} col={ac} ver={p.ver} />
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", justifyContent:"space-between" }}>
                        <div>
                          <div style={{ fontSize:14, fontWeight:700, color:ink }}>{p.user}</div>
                          <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
                            <Icon n="mapPin" size={11} color={mid} />
                            <span style={{ fontSize:12, color:mid }}>{p.hood}</span>
                            <span style={{ color:bdr }}>·</span>
                            <Icon n="clock" size={11} color={mid} />
                            <span style={{ fontSize:12, color:mid }}>{p.time}</span>
                          </div>
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:4, background:tc.bg, padding:"3px 8px", borderRadius:20 }}>
                            <Icon n={p.icon} size={11} color={tc.color} />
                            <span style={{ fontSize:11, fontWeight:700, color:tc.color }}>{p.cat}</span>
                          </div>
                          {p.urgent && (
                            <div style={{ display:"flex", alignItems:"center", gap:4, background:RL, padding:"3px 8px", borderRadius:20 }}>
                              <div style={{ width:5, height:5, borderRadius:"50%", background:R, animation:"pulse 1.2s infinite" }} />
                              <span style={{ fontSize:10, fontWeight:700, color:R, letterSpacing:.5 }}>{t.urgent.toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p style={{ margin:"0 0 8px", fontSize:14, color:mid, lineHeight:1.6 }}>
                    {translated[p.id] || p.body}
                  </p>

                  {p.offer && (
                    <div style={{ background:dm ? "rgba(90,58,122,.15)" : PUL, border:`1px solid ${PU}20`, borderRadius:10, padding:"10px 12px", marginBottom:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                        <Icon n="hands" size={13} color={PU} />
                        <span style={{ fontSize:11, fontWeight:700, color:PU, letterSpacing:.5 }}>{t.offerTitle.toUpperCase()}</span>
                      </div>
                      <p style={{ margin:0, fontSize:13, color:dm ? "#C4B0D8" : PU, lineHeight:1.5 }}>{p.offer}</p>
                    </div>
                  )}

                  {p.date && (
                    <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:GL, padding:"5px 12px", borderRadius:20, marginBottom:8 }}>
                      <Icon n="calendar" size={12} color={G} />
                      <span style={{ fontSize:12, color:G, fontWeight:600 }}>{p.date}</span>
                    </div>
                  )}

                  {!translated[p.id] ? (
                    <button onClick={() => doTranslate(p.id, p.body)} style={{ display:"flex", alignItems:"center", gap:5, marginBottom:10, padding:"4px 10px", borderRadius:20, border:`1px solid ${bdr}`, background:"transparent", color:mid, cursor:"pointer", fontSize:11, fontWeight:600 }}>
                      <Icon n="globe" size={12} color={mid} />
                      {translating[p.id] ? t.translating : t.translate}
                    </button>
                  ) : (
                    <button onClick={() => setTranslated(prev => ({ ...prev, [p.id]: null }))} style={{ display:"flex", alignItems:"center", gap:5, marginBottom:10, padding:"4px 10px", borderRadius:20, border:`1px solid ${G}40`, background:GL, color:G, cursor:"pointer", fontSize:11, fontWeight:600 }}>
                      <Icon n="globe" size={12} color={G} />
                      {t.original}
                    </button>
                  )}

                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <button onClick={() => setLiked(prev => ({ ...prev, [p.id]: !prev[p.id] }))} style={{ display:"flex", alignItems:"center", gap:4, padding:"6px 12px", borderRadius:20, border:`1.5px solid ${liked[p.id] ? "#E53935" : bdr}`, background:liked[p.id] ? "#FFF0F0" : "transparent", color:liked[p.id] ? "#E53935" : mid, cursor:"pointer", fontSize:12, fontWeight:600, transition:"all .2s" }}>
                      {liked[p.id] ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="#E53935"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                      ) : (
                        <Icon n="heart" size={13} color={mid} />
                      )}
                      {p.likes + (liked[p.id] ? 1 : 0)}
                    </button>

                    <button onClick={() => setComments(prev => ({ ...prev, [p.id]: !prev[p.id] }))} style={{ display:"flex", alignItems:"center", gap:4, padding:"6px 12px", borderRadius:20, border:`1.5px solid ${comments[p.id] ? G : bdr}`, background:comments[p.id] ? GL : "transparent", color:comments[p.id] ? G : mid, cursor:"pointer", fontSize:12, fontWeight:600, transition:"all .2s" }}>
                      <Icon n="msg" size={13} color={comments[p.id] ? G : mid} />
                      {p.replies}
                    </button>

                    <button onClick={() => setDmPost(p)} style={{ display:"flex", alignItems:"center", gap:4, padding:"6px 12px", borderRadius:20, border:`1.5px solid ${bdr}`, background:"transparent", color:mid, cursor:"pointer", fontSize:12, fontWeight:600 }}>
                      <Icon n="send" size={13} color={mid} />
                    </button>

                    <button style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5, padding:"6px 14px", borderRadius:20, border:"none", background:G, color:"#fff", cursor:"pointer", fontSize:12, fontWeight:700 }}>
                      {p.type === "event" ? t.join : t.respond}
                      <Icon n="chevronRight" size={13} color="#fff" />
                    </button>
                  </div>

                  {comments[p.id] && (
                    <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${bdr}` }}>
                      {[
                        { ini:"JV", col:AVC[1], txt: lang==="NL" ? "Morgen beschikbaar!" : "Available tomorrow, can help!" },
                        { ini:"MS", col:AVC[2], txt: lang==="NL" ? "Beterschap!" : "Hope it gets resolved soon!" },
                      ].map((c, ci) => (
                        <div key={ci} style={{ display:"flex", gap:8, marginBottom:10 }}>
                          <div style={{ width:28, height:28, borderRadius:"50%", background:c.col, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", flexShrink:0 }}>{c.ini}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ background:warm, borderRadius:"4px 12px 12px 12px", padding:"8px 12px" }}>
                              <p style={{ margin:0, fontSize:13, color:ink, lineHeight:1.5 }}>{c.txt}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <div style={{ width:28, height:28, borderRadius:"50%", background:G, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", flexShrink:0 }}>FK</div>
                        <div style={{ flex:1, display:"flex", gap:6, background:warm, border:`1.5px solid ${bdr}`, borderRadius:20, padding:"6px 6px 6px 12px", alignItems:"center" }}>
                          <input value={cmtInput[p.id] || ""} onChange={e => setCmtInput(prev => ({ ...prev, [p.id]: e.target.value }))} placeholder={lang==="NL" ? "Schrijf een reactie..." : "Write a comment..."} style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:13, color:ink, fontFamily:"DM Sans,sans-serif" }} />
                          <button style={{ width:28, height:28, borderRadius:"50%", background:G, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <Icon n="send" size={13} color="#fff" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* SHARE / HELP */}
        {tab === "share" && (
          <div style={{ padding:"18px 16px" }}>
            <h2 style={{ margin:"0 0 4px", fontSize:20, fontWeight:700, color:ink, fontFamily:"Playfair Display,serif" }}>{t.formTitle}</h2>
            <p style={{ color:mid, fontSize:13, margin:"0 0 18px" }}>{t.formSub}</p>

            {success === "help" ? (
              <div style={{ textAlign:"center", padding:"60px 0" }}>
                <div style={{ width:64, height:64, background:GL, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                  <Icon n="check" size={28} color={G} sw={2.5} />
                </div>
                <div style={{ fontSize:18, fontWeight:700, color:ink }}>{t.okHelp}</div>
                <div style={{ fontSize:14, color:mid, marginTop:6 }}>{t.okHelpSub}</div>
              </div>
            ) : (
              <div>
                <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:16, padding:16, marginBottom:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                    <div style={{ width:28, height:28, background:RL, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon n="alert" size={15} color={R} />
                    </div>
                    <span style={{ fontSize:15, fontWeight:700, color:ink }}>{t.needTitle}</span>
                  </div>
                  <p style={{ color:mid, fontSize:13, margin:"0 0 10px" }}>{t.needDesc}</p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                    {t.helpCats.map((cat, i) => (
                      <button key={i} onClick={() => setNeedCat(i)} style={{ padding:"9px 8px", borderRadius:12, border:`1.5px solid ${needCat===i ? R : bdr}`, background:needCat===i ? RL : warm, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:7, transition:"all .15s" }}>
                        <Icon n={t.helpIcons[i]} size={14} color={needCat===i ? R : mid} />
                        <span style={{ fontWeight:600, color:needCat===i ? R : ink, textAlign:"left", lineHeight:1.3 }}>{cat}</span>
                      </button>
                    ))}
                  </div>
                  <textarea value={needTxt} onChange={e => setNeedTxt(e.target.value)} placeholder={t.needPh} style={{ width:"100%", minHeight:80, padding:"10px 12px", borderRadius:10, border:`1.5px solid ${bdr}`, background:warm, color:ink, fontSize:13, fontFamily:"DM Sans,sans-serif", resize:"vertical", outline:"none", boxSizing:"border-box" }} />
                  <button onClick={() => setIsUrgent(!isUrgent)} style={{ marginTop:10, display:"flex", alignItems:"center", gap:8, padding:"7px 14px", borderRadius:10, border:`1.5px solid ${isUrgent ? R : bdr}`, background:isUrgent ? RL : warm, cursor:"pointer" }}>
                    <Icon n="alert" size={15} color={isUrgent ? R : mid} />
                    <span style={{ fontSize:13, fontWeight:600, color:isUrgent ? R : mid }}>{t.urgentLbl}</span>
                  </button>
                </div>

                <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:16, padding:16, marginBottom:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                    <div style={{ width:28, height:28, background:PUL, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon n="hands" size={15} color={PU} />
                    </div>
                    <span style={{ fontSize:15, fontWeight:700, color:ink }}>{t.offerTitle}</span>
                  </div>
                  <p style={{ color:mid, fontSize:13, margin:"0 0 10px" }}>{t.offerDesc}</p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                    {t.helpCats.map((cat, i) => (
                      <button key={i} onClick={() => setOfferCat(offerCat===i ? null : i)} style={{ padding:"9px 8px", borderRadius:12, border:`1.5px solid ${offerCat===i ? PU : bdr}`, background:offerCat===i ? PUL : warm, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:7, transition:"all .15s" }}>
                        <Icon n={t.helpIcons[i]} size={14} color={offerCat===i ? PU : mid} />
                        <span style={{ fontWeight:600, color:offerCat===i ? PU : ink, textAlign:"left", lineHeight:1.3 }}>{cat}</span>
                      </button>
                    ))}
                  </div>
                  <textarea value={offerTxt} onChange={e => setOfferTxt(e.target.value)} placeholder={t.offerPh} style={{ width:"100%", minHeight:80, padding:"10px 12px", borderRadius:10, border:`1.5px solid ${bdr}`, background:warm, color:ink, fontSize:13, fontFamily:"DM Sans,sans-serif", resize:"vertical", outline:"none", boxSizing:"border-box" }} />
                </div>

                {!verified && (
                  <div style={{ background:GL, border:`1px solid ${G}30`, borderRadius:12, padding:"11px 14px", marginBottom:14, display:"flex", gap:10, alignItems:"center" }}>
                    <Icon n="shield" size={18} color={G} />
                    <span style={{ flex:1, fontSize:13, fontWeight:600, color:G }}>{t.verReq}</span>
                    <button onClick={() => setShowVer(true)} style={{ padding:"5px 12px", background:G, color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>{t.verNow}</button>
                  </div>
                )}

                <button onClick={submitHelp} style={{ width:"100%", padding:"14px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  <Icon n="send" size={16} color="#fff" />
                  {t.submitLbl}
                </button>
              </div>
            )}
          </div>
        )}

        {/* EVENTS */}
        {tab === "events" && (
          <div style={{ padding:"18px 16px" }}>
            <h2 style={{ margin:"0 0 18px", fontSize:20, fontWeight:700, color:ink, fontFamily:"Playfair Display,serif" }}>{t.evTitle}</h2>
            {success === "ev" ? (
              <div style={{ textAlign:"center", padding:"60px 0" }}>
                <div style={{ width:64, height:64, background:GL, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                  <Icon n="check" size={28} color={G} sw={2.5} />
                </div>
                <div style={{ fontSize:18, fontWeight:700, color:ink }}>{t.okEv}</div>
                <div style={{ fontSize:14, color:mid, marginTop:6 }}>{t.okEvSub}</div>
              </div>
            ) : (
              <div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:18 }}>
                  {t.evTypes.map((ev, i) => (
                    <button key={i} onClick={() => setEvType(i)} style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", borderRadius:20, border:`1.5px solid ${evType===i ? G : bdr}`, background:evType===i ? GL : card, cursor:"pointer", transition:"all .2s" }}>
                      <Icon n={t.evIcons[i]} size={14} color={evType===i ? G : mid} />
                      <span style={{ fontSize:13, fontWeight:600, color:evType===i ? G : ink }}>{ev}</span>
                    </button>
                  ))}
                </div>
                {[["calendar",t.evName,evName,setEvName],["clock",t.evDate,evDate,setEvDate],["mapPin",t.evLoc,evLoc,setEvLoc]].map(([icon,ph,val,set],i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, background:card, border:`1.5px solid ${bdr}`, borderRadius:12, padding:"12px 14px", marginBottom:10 }}>
                    <Icon n={icon} size={16} color={mid} />
                    <input value={val} onChange={e => set(e.target.value)} placeholder={ph} style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:14, color:ink, fontFamily:"DM Sans,sans-serif" }} />
                  </div>
                ))}
                {!verified && (
                  <div style={{ background:GL, border:`1px solid ${G}30`, borderRadius:12, padding:"11px 14px", marginBottom:14, display:"flex", gap:10, alignItems:"center" }}>
                    <Icon n="shield" size={18} color={G} />
                    <span style={{ flex:1, fontSize:13, fontWeight:600, color:G }}>{t.verReq}</span>
                    <button onClick={() => setShowVer(true)} style={{ padding:"5px 12px", background:G, color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>{t.verNow}</button>
                  </div>
                )}
                <button onClick={submitEv} style={{ width:"100%", padding:"14px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  <Icon n="leaf" size={16} color="#fff" />
                  {t.evSubmit}
                </button>
              </div>
            )}
          </div>
        )}

        {/* MESSAGES */}
        {tab === "messages" && (
          <div style={{ padding:"18px 16px" }}>
            <h2 style={{ margin:"0 0 18px", fontSize:20, fontWeight:700, color:ink, fontFamily:"Playfair Display,serif" }}>{t.msgTitle}</h2>
            {CONVS.map((c, i) => (
              <div key={c.id} onClick={() => setActiveConv(c)} style={{ display:"flex", gap:12, alignItems:"center", padding:"13px 0", borderBottom:`1px solid ${bdr}`, cursor:"pointer" }}>
                <Av ini={c.ini} size={46} col={c.col} ver={c.ver} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:14, fontWeight:c.unread ? 700 : 600, color:ink }}>{c.name}</span>
                    <span style={{ fontSize:11, color:mid }}>{t.convTime[i]}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    {c.mine && <Icon n="check" size={12} color={G} sw={2.5} />}
                    <span style={{ fontSize:13, color:c.unread ? ink : mid, fontWeight:c.unread ? 600 : 400, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:210 }}>{t.convLast[i]}</span>
                  </div>
                </div>
                {c.unread > 0 && (
                  <div style={{ width:20, height:20, borderRadius:"50%", background:G, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:"#fff" }}>{c.unread}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* PROFILE */}
        {tab === "profile" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ background:`linear-gradient(135deg,${G},#5A8E52)`, borderRadius:20, padding:"26px 22px", marginBottom:14, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", right:-20, top:-20, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,.07)" }} />
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <Av ini="FK" size={54} col="rgba(255,255,255,.2)" ver={verified} />
                  <div style={{ fontSize:20, fontWeight:700, color:"#fff", marginTop:10, fontFamily:"Playfair Display,serif" }}>Fatma K.</div>
                  <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:4, color:"rgba(255,255,255,.75)", fontSize:13 }}>
                    <Icon n="mapPin" size={13} color="rgba(255,255,255,.75)" />
                    {t.profHood}
                  </div>
                </div>
                {verified ? (
                  <div style={{ background:"rgba(255,255,255,.15)", borderRadius:12, padding:"7px 12px", display:"flex", alignItems:"center", gap:5 }}>
                    <VerBadge size={16} />
                    <span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{t.verified}</span>
                  </div>
                ) : (
                  <button onClick={() => setShowVer(true)} style={{ background:"rgba(255,255,255,.2)", border:"1.5px solid rgba(255,255,255,.4)", borderRadius:12, padding:"7px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                    <Icon n="shield" size={14} color="#fff" />
                    <span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{t.idVer}</span>
                  </button>
                )}
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:12 }}>
              {[[12,t.helped,"heart"],[5,t.evLabel,"calendar"],[89,t.conns,"users"]].map(([n,lbl,icon]) => (
                <div key={lbl} style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"13px 8px", textAlign:"center" }}>
                  <div style={{ display:"flex", justifyContent:"center", marginBottom:5, color:G }}><Icon n={icon} size={18} /></div>
                  <div style={{ fontSize:22, fontWeight:800, color:ink }}>{n}</div>
                  <div style={{ fontSize:11, color:mid, marginTop:1 }}>{lbl}</div>
                </div>
              ))}
            </div>

            <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:16, padding:14, marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <Icon n="hands" size={16} color={PU} />
                  <span style={{ fontSize:14, fontWeight:700, color:ink }}>{t.myOffers}</span>
                </div>
                <button style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 10px", background:PUL, border:`1px solid ${PU}20`, borderRadius:8, cursor:"pointer" }}>
                  <Icon n="plus" size={13} color={PU} />
                  <span style={{ fontSize:12, fontWeight:700, color:PU }}>{t.addOffer}</span>
                </button>
              </div>
              <div style={{ background:PUL, borderRadius:10, padding:"10px 12px" }}>
                <p style={{ margin:0, fontSize:13, color:PU, lineHeight:1.5 }}>
                  {lang==="NL" ? "Ik kan helpen met Turks-Nederlands vertaalwerk." : "I can help with Dutch-English translation."}
                </p>
              </div>
            </div>

            <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:16, overflow:"hidden", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", borderBottom:`1px solid ${bdr}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <Icon n="globe" size={17} color={G} />
                  <span style={{ fontSize:14, fontWeight:500, color:ink }}>{t.langPref}</span>
                </div>
                <div style={{ position:"relative" }}>
                  <button onClick={() => setLangOpen(!langOpen)} style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", background:GL, border:`1px solid ${G}30`, borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:700, color:G }}>
                    {lang} <Icon n="chevronDown" size={12} color={G} />
                  </button>
                  {langOpen && (
                    <div style={{ position:"absolute", right:0, top:32, background:card, border:`1px solid ${bdr}`, borderRadius:10, overflow:"hidden", boxShadow:"0 8px 24px rgba(0,0,0,.1)", zIndex:20, minWidth:120 }}>
                      {Object.keys(LANGS).map(l => (
                        <button key={l} onClick={() => { setLang(l); setLangOpen(false); }} style={{ width:"100%", padding:"9px 12px", border:"none", background:lang===l ? GL : "transparent", cursor:"pointer", textAlign:"left", fontSize:13, color:lang===l ? G : ink, fontWeight:lang===l ? 700 : 500, fontFamily:"DM Sans,sans-serif" }}>{l}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", borderBottom:`1px solid ${bdr}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <Icon n="moon" size={17} color={G} />
                  <span style={{ fontSize:14, fontWeight:500, color:ink }}>{t.darkMode}</span>
                </div>
                <button onClick={() => setDm(!dm)} style={{ width:44, height:24, borderRadius:12, border:"none", background:dm ? G : bdr, cursor:"pointer", position:"relative", transition:"all .2s" }}>
                  <div style={{ position:"absolute", top:2, left:dm ? 22 : 2, width:20, height:20, borderRadius:"50%", background:"#fff", transition:"all .2s" }} />
                </button>
              </div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", borderBottom:`1px solid ${bdr}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <Icon n="shield" size={17} color={G} />
                  <span style={{ fontSize:14, fontWeight:500, color:ink }}>{t.idVer}</span>
                </div>
                {verified
                  ? <div style={{ display:"flex", alignItems:"center", gap:5 }}><VerBadge size={16} /><span style={{ fontSize:12, fontWeight:700, color:G }}>{t.verified}</span></div>
                  : <button onClick={() => setShowVer(true)} style={{ padding:"5px 12px", background:G, color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.verNow}</button>
                }
              </div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <Icon n="bell" size={17} color={G} />
                  <span style={{ fontSize:14, fontWeight:500, color:ink }}>{t.notif}</span>
                </div>
                <Icon n="chevronRight" size={16} color={mid} />
              </div>
            </div>

            <button onClick={onLogout} style={{ width:"100%", padding:"13px 0", background:"transparent", color:R, border:`1.5px solid ${R}30`, borderRadius:14, fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <Icon n="back" size={16} color={R} />
              {t.logout}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ background:dm ? "#1A1510" : "#fff", borderTop:`1px solid ${bdr}`, display:"flex", padding:"8px 0 4px", position:"sticky", bottom:0, zIndex:50 }}>
        <NavBtn k="feed" icon="home" label={t.feed} />
        <NavBtn k="share" icon="send" label={t.share} />
        <NavBtn k="events" icon="calendar" label={t.events} />
        <NavBtn k="messages" icon="msg" label={t.messages} badge={3} />
        <NavBtn k="profile" icon="user" label={t.profile} />
      </div>

      {/* Conversation Modal */}
      {activeConv && (
        <div style={{ position:"fixed", inset:0, zIndex:200, background:bg, maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column" }}>
          <div style={{ background:dm ? "#1A1510" : "#fff", borderBottom:`1px solid ${bdr}`, padding:"13px 16px", display:"flex", alignItems:"center", gap:10 }}>
            <button onClick={() => setActiveConv(null)} style={{ border:"none", background:"none", cursor:"pointer", padding:4, display:"flex" }}>
              <Icon n="back" size={20} color={ink} />
            </button>
            <Av ini={activeConv.ini} size={36} col={activeConv.col} ver={activeConv.ver} />
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:ink }}>{activeConv.name}</div>
              <div style={{ fontSize:11, color:G, fontWeight:600 }}>{t.online}</div>
            </div>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { txt: lang==="NL" ? "Hallo! Ik zag je bericht, hoe kan ik helpen?" : "Hi! I saw your post, how can I help?", mine:false },
              { txt: lang==="NL" ? "Bedankt! Ben je morgen beschikbaar?" : "Thanks! Are you free tomorrow afternoon?", mine:true },
              { txt: lang==="NL" ? "Ja, ik ben beschikbaar! Hoe laat?" : "Yes, I'm free! What time works for you?", mine:false },
            ].map((m, i) => (
              <div key={i} style={{ display:"flex", justifyContent:m.mine ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth:"75%", background:m.mine ? G : card, border:m.mine ? "none" : `1px solid ${bdr}`, borderRadius:m.mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding:"10px 14px" }}>
                  <p style={{ margin:0, fontSize:13, color:m.mine ? "#fff" : ink, lineHeight:1.5 }}>{m.txt}</p>
                  {m.mine && (
                    <div style={{ display:"flex", justifyContent:"flex-end", marginTop:4 }}>
                      <Icon n="check" size={11} color="rgba(255,255,255,.7)" sw={2.5} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ background:dm ? "#1A1510" : "#fff", borderTop:`1px solid ${bdr}`, padding:"12px 16px", display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ flex:1, background:warm, border:`1.5px solid ${bdr}`, borderRadius:24, padding:"10px 16px" }}>
              <input value={convMsg} onChange={e => setConvMsg(e.target.value)} placeholder={t.msgPh} style={{ width:"100%", border:"none", outline:"none", background:"transparent", fontSize:14, color:ink, fontFamily:"DM Sans,sans-serif" }} />
            </div>
            <button onClick={() => setConvMsg("")} style={{ width:42, height:42, borderRadius:"50%", background:G, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon n="send" size={16} color="#fff" />
            </button>
          </div>
        </div>
      )}

      {/* DM Modal */}
      {dmPost && (
        <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", backdropFilter:"blur(4px)" }} onClick={() => setDmPost(null)}>
          <div style={{ background:card, borderRadius:"20px 20px 0 0", width:"100%", maxWidth:480, padding:"8px 20px 36px" }} onClick={e => e.stopPropagation()}>
            <div style={{ width:36, height:4, background:bdr, borderRadius:2, margin:"14px auto 20px" }} />
            {dmSent ? (
              <div style={{ textAlign:"center", padding:"24px 0" }}>
                <div style={{ width:52, height:52, background:GL, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                  <Icon n="check" size={24} color={G} sw={2.5} />
                </div>
                <div style={{ fontSize:16, fontWeight:700, color:ink }}>{lang==="TR" ? "Mesaj gonderildi!" : lang==="NL" ? "Bericht verzonden!" : lang==="ES" ? "Mensaje enviado!" : "Message sent!"}</div>
              </div>
            ) : (
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                  <Av ini={dmPost.ini} size={36} col={AVC[(dmPost.id-1) % AVC.length]} ver={dmPost.ver} />
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:ink }}>{dmPost.user}</div>
                    <div style={{ fontSize:12, color:mid }}>{lang==="NL" ? "Direct bericht" : "Direct message"}</div>
                  </div>
                </div>
                <textarea value={dmText} onChange={e => setDmText(e.target.value)} placeholder={lang==="TR" ? "Mesajini yaz..." : lang==="NL" ? "Schrijf je bericht..." : lang==="ES" ? "Escribe tu mensaje..." : "Write your message..."} style={{ width:"100%", minHeight:100, padding:"12px 14px", borderRadius:12, border:`1.5px solid ${bdr}`, background:warm, color:ink, fontSize:14, fontFamily:"DM Sans,sans-serif", resize:"none", outline:"none", boxSizing:"border-box", marginBottom:12 }} />
                <button onClick={sendDm} style={{ width:"100%", padding:"13px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  <Icon n="send" size={15} color="#fff" />
                  {lang==="NL" ? "Versturen" : "Send"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Verify Modal */}
      {showVer && (
        <VerifyModal t={t} dm={dm} onClose={() => setShowVer(false)} onVerified={() => { setVerified(true); setShowVer(false); }} />
      )}

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
        button:active{transform:scale(.97)}
      `}</style>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────
export default function Root() {
  const [authed, setAuthed] = useState(false);
  const [lang, setLang] = useState("EN");
  const [dm, setDm] = useState(false);
  const [verified, setVerified] = useState(false);

  if (!authed) return <Auth onLogin={() => setAuthed(true)} lang={lang} setLang={setLang} />;
  return <App2 lang={lang} setLang={setLang} onLogout={() => setAuthed(false)} dm={dm} setDm={setDm} verified={verified} setVerified={setVerified} />;
}
