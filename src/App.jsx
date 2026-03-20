import { useState, useEffect } from "react";
import { supabase } from './supabase';
import { saveComment, getComments } from './comments';
import { createPost, getPosts } from './posts';
import { toggleLike, getLikes, getUserLikes } from './likes';
import { signUp, signIn, resetPassword } from './auth';

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

const G = "#3D6B35"; const GL = "#EBF3E8";
const R = "#C44B1A"; const RL = "#FDF0EB";
const PU = "#5A3A7A"; const PUL = "#F3EEF8";
const BL = "#2A5A8A"; const BLL = "#EBF0F8";
const AVC = ["#3D6B35","#7A4F3A","#2A5A8A","#7A6B2A","#5A3A7A","#2A7A6B"];

const AMSTERDAM_HOODS = [
  "Centrum","De Pijp","Jordaan","Oud-West","Oud-Zuid","Oost","Noord","West","Nieuw-West","Zuidoost",
  "Watergraafsmeer","Indische Buurt","Dapperbuurt","Baarsjes","Westerpark","Bos en Lommer",
  "Slotervaart","Geuzenveld","Osdorp","Slotermeer","Bijlmer","Gaasperdam","IJburg",
  "Zeeburg","Rivierenbuurt","Buitenveldert","De Aker","Sloten","Overtoomse Veld",
  "Landlust","Staatsliedenbuurt","Spaarndammerbuurt","Haarlemmerbuurt",
  "Grachtengordel","Nieuwmarkt","Plantage","Weesperbuurt","Java-eiland",
  "Borneo-eiland","Overhoeks","Buiksloterham","Nieuwendam"
];

const Av = ({ ini, size=40, col=G, ver=false }) => (
  <span style={{ position:"relative", display:"inline-flex", flexShrink:0 }}>
    <span style={{ width:size, height:size, borderRadius:"50%", background:col, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.33, fontWeight:700, color:"#fff", fontFamily:"DM Sans,sans-serif" }}>
      {ini}
    </span>
    {ver && <span style={{ position:"absolute", bottom:0, right:-4 }}><VerBadge size={size*.42}/></span>}
  </span>
);

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
  EN:{
    tagline:"Neighborhood solidarity platform",
    feed:"Feed",share:"Share",events:"Events",messages:"Messages",profile:"Profile",
    login:"Sign In",register:"Sign Up",loginBtn:"Sign In",registerBtn:"Create Account",
    or:"or",emailPh:"Email address",passPh:"Password",confirmPh:"Confirm password",
    namePh:"Full Name",hoodPh:"Select your neighborhood",
    forgot:"Forgot password",noAcc:"Don't have an account?",hasAcc:"Already a member?",
    emailNote:"After registration you will receive a confirmation email.",
    all:"All",helpF:"Help",eventF:"Events",feedTitle:"Neighborhood Feed",neighbors:"neighbors",
    needTitle:"I need help",needDesc:"What kind of help do you need?",
    offerTitle:"I can offer support",offerDesc:"What support can you offer?",
    needPh:"Describe the situation...",offerPh:"Describe what you can offer...",
    urgentLbl:"Mark as urgent",submitLbl:"Share",
    formTitle:"Help and Support Sharing",formSub:"Share your need and what you can offer.",
    evTitle:"Create Event",
    evTypes:["Urban Farming","Neighborhood Clean","Tea Meetup","Workshop","Celebration"],
    evIcons:["leaf","sun","msg","star","bell"],
    evName:"Event name",evDate:"Date and time",evLoc:"Location",evSubmit:"Create Event",
    helpCats:["Repair","Shopping","Transport","Childcare","Garden","Cooking","Translation","Other"],
    helpIcons:["tool","bag","car","baby","leaf","star","globe","msg"],
    verTitle:"Identity Verification",verSub:"Verify your identity to use this feature.",
    verWhy:"Why is this required?",verWhyTxt:"Verification ensures all CoHood users are real people.",
    verS1:"Upload ID Card",verS1d:"Photo of national ID or passport (front)",
    verS2:"Take a Selfie",verS2d:"Take a selfie holding your ID card",
    verS3:"Review",verS3d:"Usually approved within 24 hours",
    verUpId:"Upload ID Card",verUpSelf:"Upload Selfie",verStart:"Start Verification",
    verPend:"Verification pending...",verPendTxt:"We are reviewing your documents.",
    verDone:"Identity verified!",verDoneTxt:"You now have access to all features.",
    verSkip:"Not now",verBadge:"Verified",verReq:"Identity verification required",verNow:"Verify Now",
    respond:"Respond",join:"Join",urgent:"Urgent",
    okHelp:"Shared!",okHelpSub:"Your neighbors have been notified.",
    okEv:"Event created!",okEvSub:"Neighborhood has been invited.",
    msgTitle:"Messages",online:"Online",msgPh:"Write a message...",sendLbl:"Send",
    translate:"Translate",translating:"Translating...",original:"Original",
    helped:"Helped",evLabel:"Events",conns:"Connections",
    myOffers:"My Support Offers",addOffer:"Add Offer",
    langPref:"Language",darkMode:"Dark Mode",notif:"Notifications",
    idVer:"ID Verification",verified:"Verified",notVer:"Not verified",logout:"Sign Out",
    convLast:["Available tomorrow!","Are you joining?","I can help","Thanks for attending"],
    convTime:["12 min","1 hr","Yesterday","2 days"],
    checkEmail:"Check your email",checkEmailDesc:"We sent a 6-digit code to",
    enterCode:"Enter the verification code:",verifyBtn:"Verify",
    noEmail:"Did not receive an email? Check spam or",resendCode:"resend",
    forgotTitle:"Forgot Password",forgotDesc:"Enter your email to get a reset link.",
    sendLink:"Send Reset Link",emailSent:"Email Sent!",emailSentDesc:"We sent a reset link to",
    checkInbox:"Check your inbox and spam. Link valid for 24 hours.",
    backToLogin:"Back to Sign In",resendLink:"Resend link",
    profileStep:"Step 3 of 3",profileHeading:"Complete your profile",
    profileSubheading:"Tell your neighbors about yourself",
    profileName:"First name",profileHood:"Select your neighborhood",
    profileBio:"Short bio (optional)...",profileOffers:"What can you offer your neighbors?",
    offerOtherPh:"Describe what you can offer...",
    continueBtn:"Continue",skipBtn:"Skip for now",
    welcomeTitle:"Welcome to CoHood!",
    welcomeDesc:"Connect with your neighbors. Ask for help, offer support and organize activities.",
    safeTitle:"Safe Community",
    safeDesc:"All members are verified with a valid ID.",
    giveTitle:"Give and Receive",
    giveDesc:"Share your needs and what you can offer. Together we are stronger!",
    nextBtn:"Next",getStarted:"Get Started!",
    errName:"Please enter your name",errEmail:"Please enter a valid email",
    errPass:"Password must be at least 6 characters",errPassMatch:"Passwords do not match",
    errHood:"Please select your neighborhood",
    offersList:["Translation","Cooking","Gardening","Transport","Repairs","Childcare","Other"],
  },
  NL:{
    tagline:"Platform voor buurtsolidariteit",
    feed:"Feed",share:"Delen",events:"Evenementen",messages:"Berichten",profile:"Profiel",
    login:"Inloggen",register:"Registreren",loginBtn:"Inloggen",registerBtn:"Account Aanmaken",
    or:"of",emailPh:"E-mailadres",passPh:"Wachtwoord",confirmPh:"Wachtwoord bevestigen",
    namePh:"Voor- en achternaam",hoodPh:"Kies jouw buurt",
    forgot:"Wachtwoord vergeten",noAcc:"Nog geen account?",hasAcc:"Al lid?",
    emailNote:"Na registratie ontvang je een bevestigingsmail.",
    all:"Alles",helpF:"Hulp",eventF:"Evenementen",feedTitle:"Buurtfeed",neighbors:"buren",
    needTitle:"Ik heb hulp nodig",needDesc:"Wat voor hulp heb je nodig?",
    offerTitle:"Ik kan ondersteuning bieden",offerDesc:"Wat kun je je buren aanbieden?",
    needPh:"Beschrijf de situatie...",offerPh:"Beschrijf wat je kunt aanbieden...",
    urgentLbl:"Markeren als urgent",submitLbl:"Delen",
    formTitle:"Hulp en Ondersteuning Delen",formSub:"Deel je behoefte en aanbod.",
    evTitle:"Evenement Aanmaken",
    evTypes:["Stadslandbouw","Buurtschoonmaak","Thee bijeenkomst","Workshop","Feest"],
    evIcons:["leaf","sun","msg","star","bell"],
    evName:"Naam evenement",evDate:"Datum en tijd",evLoc:"Locatie",evSubmit:"Evenement Aanmaken",
    helpCats:["Reparatie","Boodschappen","Vervoer","Kinderopvang","Tuin","Koken","Vertaling","Overig"],
    helpIcons:["tool","bag","car","baby","leaf","star","globe","msg"],
    verTitle:"Identiteitsverificatie",verSub:"Verifieer je identiteit om deze functie te gebruiken.",
    verWhy:"Waarom is dit vereist?",verWhyTxt:"Verificatie zorgt ervoor dat alle CoHood gebruikers echte mensen zijn.",
    verS1:"ID-kaart uploaden",verS1d:"Foto van identiteitsbewijs (voorzijde)",
    verS2:"Selfie maken",verS2d:"Maak een selfie met je ID-kaart",
    verS3:"Beoordeling",verS3d:"Meestal binnen 24 uur goedgekeurd",
    verUpId:"ID-kaart uploaden",verUpSelf:"Selfie uploaden",verStart:"Verificatie starten",
    verPend:"Verificatie in behandeling...",verPendTxt:"We beoordelen je documenten.",
    verDone:"Identiteit geverifieerd!",verDoneTxt:"Je hebt nu toegang tot alle functies.",
    verSkip:"Niet nu",verBadge:"Geverifieerd",verReq:"Identiteitsverificatie vereist",verNow:"Nu verifiëren",
    respond:"Reageren",join:"Meedoen",urgent:"Urgent",
    okHelp:"Gedeeld!",okHelpSub:"Je buren zijn op de hoogte.",
    okEv:"Evenement aangemaakt!",okEvSub:"Buurt is uitgenodigd.",
    msgTitle:"Berichten",online:"Online",msgPh:"Schrijf een bericht...",sendLbl:"Versturen",
    translate:"Vertalen",translating:"Vertalen...",original:"Origineel",
    helped:"Geholpen",evLabel:"Evenementen",conns:"Verbindingen",
    myOffers:"Mijn Aanbod",addOffer:"Aanbod Toevoegen",
    langPref:"Taal",darkMode:"Donkere modus",notif:"Meldingen",
    idVer:"ID-verificatie",verified:"Geverifieerd",notVer:"Niet geverifieerd",logout:"Uitloggen",
    convLast:["Morgen beschikbaar!","Doe je mee?","Ik kan helpen","Bedankt voor deelname"],
    convTime:["12 min","1 uur","Gisteren","2 dagen"],
    checkEmail:"Controleer je e-mail",checkEmailDesc:"We hebben een 6-cijferige code gestuurd naar",
    enterCode:"Voer de verificatiecode in:",verifyBtn:"Bevestigen",
    noEmail:"Geen e-mail ontvangen? Controleer spam of",resendCode:"stuur opnieuw",
    forgotTitle:"Wachtwoord vergeten",forgotDesc:"Voer je e-mailadres in voor een resetlink.",
    sendLink:"Link versturen",emailSent:"E-mail verstuurd!",emailSentDesc:"We hebben een resetlink gestuurd naar",
    checkInbox:"Controleer je inbox en spam. Link is 24 uur geldig.",
    backToLogin:"Terug naar inloggen",resendLink:"Link opnieuw versturen",
    profileStep:"Stap 3 van 3",profileHeading:"Profiel aanmaken",
    profileSubheading:"Vertel je buren iets over jezelf",
    profileName:"Voornaam",profileHood:"Kies jouw buurt",
    profileBio:"Korte bio (optioneel)...",profileOffers:"Wat kun je aanbieden aan je buren?",
    offerOtherPh:"Beschrijf wat je kunt aanbieden...",
    continueBtn:"Doorgaan",skipBtn:"Overslaan",
    welcomeTitle:"Welkom bij CoHood!",
    welcomeDesc:"Verbind met je buren. Vraag hulp, bied ondersteuning en organiseer activiteiten.",
    safeTitle:"Veilige gemeenschap",
    safeDesc:"Alle leden worden geverifieerd met een geldig ID.",
    giveTitle:"Geef en ontvang",
    giveDesc:"Deel je behoeften en aanbod. Samen zijn we sterker!",
    nextBtn:"Volgende",getStarted:"Aan de slag!",
    errName:"Vul je naam in",errEmail:"Voer een geldig e-mailadres in",
    errPass:"Wachtwoord moet minimaal 6 tekens zijn",errPassMatch:"Wachtwoorden komen niet overeen",
    errHood:"Kies je buurt",
    offersList:["Vertaling","Koken","Tuinieren","Vervoer","Reparaties","Kinderopvang","Anders"],
  },
};

const TCAT = { help:{color:R,bg:RL}, event:{color:G,bg:GL}, announce:{color:BL,bg:BLL} };

function InputField({ icon, ph, val, onChange, isPass }) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, background:focused?"#fff":"#F0EBE1", border:"1.5px solid "+(focused?G:"#E2D9CC"), borderRadius:12, padding:"12px 14px", transition:"all .2s" }}>
      <Icon n={icon} size={16} color={focused?G:"#A8997E"} />
      <input
        type={isPass&&!show?"password":"text"}
        placeholder={ph}
        value={val}
        onChange={onChange}
        onFocus={()=>setFocused(true)}
        onBlur={()=>setFocused(false)}
        style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:14, color:"#2C2416", fontFamily:"DM Sans,sans-serif" }}
      />
      {isPass && (
        <button onClick={()=>setShow(!show)} style={{ border:"none", background:"none", cursor:"pointer", padding:0, display:"flex", color:"#A8997E" }}>
          <Icon n={show?"eyeOff":"eye"} size={15} />
        </button>
      )}
    </div>
  );
}

function VerifyModal({ t, dm, onClose, onVerified }) {
  const [step, setStep] = useState("intro");
  const [idDone, setIdDone] = useState(false);
  const [selDone, setSelDone] = useState(false);
  const [why, setWhy] = useState(false);
  const bg = dm?"#1E1A14":"#fff";
  const ink = dm?"#EDE7D9":"#2C2416";
  const mid = dm?"#9A8E7A":"#6B5E4E";
  const bdr = dm?"#33291E":"#E2D9CC";
  const warm = dm?"#2C2820":"#F0EBE1";
  const submit = () => { setStep("pending"); setTimeout(()=>setStep("done"),2000); };
  const finish = () => { onVerified(); onClose(); };
  return (
    <div style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-end", justifyContent:"center", backdropFilter:"blur(4px)" }} onClick={onClose}>
      <div style={{ background:bg, borderRadius:"20px 20px 0 0", width:"100%", maxWidth:480, maxHeight:"90vh", overflowY:"auto", padding:"8px 20px 40px", fontFamily:"DM Sans,sans-serif" }} onClick={e=>e.stopPropagation()}>
        <div style={{ width:36, height:4, background:bdr, borderRadius:2, margin:"14px auto 20px" }} />
        {step==="intro" && (
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
            <button onClick={()=>setWhy(!why)} style={{ width:"100%", padding:"11px 14px", background:warm, border:"1px solid "+bdr, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", marginBottom:4 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Icon n="info" size={15} color={G} />
                <span style={{ fontSize:13, fontWeight:600, color:ink }}>{t.verWhy}</span>
              </div>
              <Icon n={why?"chevronDown":"chevronRight"} size={15} color={mid} />
            </button>
            {why && (
              <div style={{ background:GL, borderRadius:"0 0 12px 12px", padding:"12px 14px", marginBottom:12 }}>
                <p style={{ margin:0, fontSize:13, color:G, lineHeight:1.6 }}>{t.verWhyTxt}</p>
              </div>
            )}
            <div style={{ display:"flex", flexDirection:"column", gap:12, margin:"16px 0 20px" }}>
              {[[1,"card",t.verS1,t.verS1d],[2,"camera",t.verS2,t.verS2d],[3,"check",t.verS3,t.verS3d]].map(([num,icon,title,desc])=>(
                <div key={num} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <div style={{ width:30, height:30, borderRadius:"50%", background:GL, border:"1.5px solid "+G+"40", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:12, fontWeight:800, color:G }}>{num}</span>
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:ink }}>{title}</div>
                    <div style={{ fontSize:12, color:mid, marginTop:2, lineHeight:1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={()=>setStep("upload")} style={{ width:"100%", padding:"14px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <Icon n="shield" size={16} color="#fff" /> {t.verStart}
            </button>
            <button onClick={onClose} style={{ width:"100%", padding:"12px 0", background:"transparent", border:"none", color:mid, fontSize:14, cursor:"pointer", marginTop:8 }}>{t.verSkip}</button>
          </div>
        )}
        {step==="upload" && (
          <div>
            <div style={{ fontSize:17, fontWeight:700, color:ink, marginBottom:18 }}>{t.verTitle}</div>
            {[{done:idDone,set:setIdDone,icon:"card",label:t.verUpId,desc:t.verS1d},{done:selDone,set:setSelDone,icon:"camera",label:t.verUpSelf,desc:t.verS2d}].map((item,i)=>(
              <div key={i} onClick={()=>item.set(true)} style={{ border:"2px dashed "+(item.done?G:bdr), borderRadius:14, padding:"22px 16px", textAlign:"center", cursor:"pointer", marginBottom:12, background:item.done?GL:"transparent", transition:"all .2s" }}>
                {item.done ? (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                    <VerBadge size={20} /><span style={{ fontSize:14, fontWeight:700, color:G }}>{item.label} ok</span>
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
            <button onClick={submit} disabled={!idDone||!selDone} style={{ width:"100%", padding:"14px 0", background:idDone&&selDone?G:"#ccc", color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:idDone&&selDone?"pointer":"not-allowed" }}>{t.verStart}</button>
          </div>
        )}
        {step==="pending" && (
          <div style={{ textAlign:"center", padding:"48px 0" }}>
            <div style={{ width:60, height:60, borderRadius:"50%", background:warm, border:"2px solid "+bdr, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <div style={{ width:24, height:24, border:"3px solid "+G, borderTopColor:"transparent", borderRadius:"50%", animation:"spin .8s linear infinite" }} />
            </div>
            <div style={{ fontSize:17, fontWeight:700, color:ink }}>{t.verPend}</div>
            <div style={{ fontSize:13, color:mid, marginTop:8, lineHeight:1.6 }}>{t.verPendTxt}</div>
          </div>
        )}
        {step==="done" && (
          <div style={{ textAlign:"center", padding:"32px 0" }}>
            <div style={{ width:72, height:72, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <VerBadge size={72} />
            </div>
            <div style={{ fontSize:18, fontWeight:700, color:ink, marginBottom:6 }}>{t.verDone}</div>
            <div style={{ fontSize:13, color:mid, marginBottom:24 }}>{t.verDoneTxt}</div>
            <button onClick={finish} style={{ padding:"13px 32px", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer" }}>{t.verBadge}</button>
          </div>
        )}
      </div>
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
    </div>
  );
}

const Wrap = ({ children }) => (
    <div style={{ minHeight:"100vh", background:"#F7F4EF", fontFamily:"DM Sans,sans-serif", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column", position:"relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>
      {children}
    </div>
  );

function Auth({ onLogin, lang, setLang }) {
  const t = TXT[lang];
  const [screen, setScreen] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [name, setName] = useState("");
  const [hood, setHood] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const [code, setCode] = useState(["","","","","",""]);
  const [onbStep, setOnbStep] = useState(0);
  const [offers, setOffers] = useState([]);
  const [offerOther, setOfferOther] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const onbSlides = [
    { icon:"users", bg:GL, color:G, title:t.welcomeTitle, desc:t.welcomeDesc },
    { icon:"shield", bg:GL, color:G, title:t.safeTitle, desc:t.safeDesc },
    { icon:"hands", bg:PUL, color:PU, title:t.giveTitle, desc:t.giveDesc },
  ];

  const handleLogin = async () => {
    if (!email||!email.includes("@")) { alert(t.errEmail); return; }
    if (!pass||pass.length<6) { alert(t.errPass); return; }
    setLoading(true);
    const { data, error } = await signIn(email, pass);
    setLoading(false);
    if (error) { alert(error.message); return; }
    onLogin(data.user);
  };

  const handleRegister = async () => {
    if (!name.trim()) { alert(t.errName); return; }
    if (!email||!email.includes("@")) { alert(t.errEmail); return; }
    if (!pass||pass.length<6) { alert(t.errPass); return; }
    if (pass!==pass2) { alert(t.errPassMatch); return; }
    if (!hood) { alert(t.errHood); return; }
    setLoading(true);
    const { error } = await signUp(email, pass, name, hood);
    setLoading(false);
    if (error) { alert(error.message); return; }
    setScreen("verify-email");
  };

  const handleForgot = async () => {
    if (!email||!email.includes("@")) { alert(t.errEmail); return; }
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) { alert(error.message); return; }
    setScreen("forgot-sent");
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider:"google", options:{ redirectTo:"https://cohood.nl" } });
  };

  

  const LangPicker = () => (
    <div style={{ position:"absolute", top:16, right:16, zIndex:10 }}>
      <button onClick={()=>setLangOpen(!langOpen)} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,.8)", border:"1px solid #E2D9CC", borderRadius:20, padding:"5px 11px", cursor:"pointer", fontSize:12, color:"#6B5E4E", backdropFilter:"blur(4px)" }}>
        <Icon n="globe" size={12} color="#6B5E4E"/> {lang}
      </button>
      {langOpen && (
        <div style={{ position:"absolute", right:0, top:34, background:"#fff", border:"1px solid #E2D9CC", borderRadius:12, overflow:"hidden", boxShadow:"0 8px 24px rgba(0,0,0,.1)", minWidth:140, zIndex:20 }}>
          {["EN","NL"].map(l=>(
            <button key={l} onClick={()=>{setLang(l);setLangOpen(false);}} style={{ width:"100%", padding:"10px 14px", border:"none", background:lang===l?GL:"transparent", cursor:"pointer", textAlign:"left", fontSize:13, color:lang===l?G:"#2C2416", fontFamily:"DM Sans,sans-serif", fontWeight:lang===l?700:400 }}>
              {l==="EN"?"EN - English":"NL - Nederlands"}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const Logo = () => (
    <div style={{ background:"linear-gradient(160deg,#F0EBE1,#E8E0D0)", padding:"48px 32px 32px", position:"relative", overflow:"hidden" }}>
      {[[160,-40,120,.06],[280,60,80,.04],[-20,40,60,.05]].map(([x,y,s,o],i)=>(
        <div key={i} style={{ position:"absolute", left:x, top:y, width:s, height:s, borderRadius:"50%", background:"rgba(61,107,53,"+o+")" }}/>
      ))}
      <div style={{ width:52, height:52, background:G, borderRadius:15, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16, boxShadow:"0 8px 24px rgba(61,107,53,.25)" }}>
        <Icon n="users" size={24} color="#fff" sw={1.6}/>
      </div>
      <div style={{ fontFamily:"Playfair Display,serif", fontSize:28, fontWeight:700, color:"#2C2416", letterSpacing:-.5 }}>CoHood</div>
      <div style={{ color:"#6B5E4E", fontSize:13, marginTop:4 }}>{t.tagline}</div>
    </div>
  );

  const TabSwitch = ({ active }) => (
    <div style={{ display:"flex", background:"#F0EBE1", borderRadius:12, padding:4, marginBottom:20, border:"1px solid #E2D9CC" }}>
      {[["login",t.login],["register",t.register]].map(([m,lbl])=>(
        <button key={m} onClick={()=>setScreen(m)} style={{ flex:1, padding:"10px 0", borderRadius:9, border:"none", cursor:"pointer", background:active===m?"#fff":"transparent", color:active===m?"#2C2416":"#6B5E4E", fontWeight:active===m?700:500, fontSize:14, fontFamily:"DM Sans,sans-serif", transition:"all .2s" }}>{lbl}</button>
      ))}
    </div>
  );

  if (screen==="login") return (
    <Wrap>
      <LangPicker/>
      <Logo/>
      <div style={{ flex:1, padding:"24px 24px 40px" }}>
        <TabSwitch active="login"/>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <InputField icon="mail" ph={t.emailPh} val={email} onChange={e=>setEmail(e.target.value)}/>
          <InputField icon="lock" ph={t.passPh} val={pass} onChange={e=>setPass(e.target.value)} isPass/>
        </div>
        <div style={{ textAlign:"right", marginTop:8 }}>
          <button onClick={()=>setScreen("forgot")} style={{ background:"none", border:"none", color:G, fontSize:13, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>{t.forgot}</button>
        </div>
        <button onClick={handleLogin} disabled={loading} style={{ width:"100%", marginTop:18, padding:"14px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", opacity:loading?.7:1 }}>
          {loading?"...":t.loginBtn}
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:12, margin:"16px 0" }}>
          <div style={{ flex:1, height:1, background:"#E2D9CC" }}/><span style={{ color:"#A8997E", fontSize:12 }}>{t.or}</span><div style={{ flex:1, height:1, background:"#E2D9CC" }}/>
        </div>
        <button onClick={handleGoogleLogin} style={{ width:"100%", padding:"11px 0", background:"#fff", border:"1.5px solid #E2D9CC", borderRadius:12, cursor:"pointer", fontSize:13, color:"#2C2416", fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <svg width="17" height="17" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
        <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:"#6B5E4E" }}>
          {t.noAcc}{" "}<button onClick={()=>setScreen("register")} style={{ background:"none", border:"none", color:G, fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"DM Sans,sans-serif" }}>{t.register}</button>
        </div>
      </div>
    </Wrap>
  );

  if (screen==="register") return (
    <Wrap>
      <LangPicker/>
      <Logo/>
      <div style={{ flex:1, padding:"24px 24px 40px" }}>
        <TabSwitch active="register"/>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <InputField icon="user" ph={t.namePh} val={name} onChange={e=>setName(e.target.value)}/>
          <InputField icon="mail" ph={t.emailPh} val={email} onChange={e=>setEmail(e.target.value)}/>
          <InputField icon="lock" ph={t.passPh} val={pass} onChange={e=>setPass(e.target.value)} isPass/>
          <InputField icon="lock" ph={t.confirmPh} val={pass2} onChange={e=>setPass2(e.target.value)} isPass/>
          <select value={hood} onChange={e=>setHood(e.target.value)} style={{ padding:"12px 14px", background:"#F0EBE1", border:"1.5px solid #E2D9CC", borderRadius:12, fontSize:14, color:hood?"#2C2416":"#A8997E", fontFamily:"DM Sans,sans-serif", outline:"none", cursor:"pointer" }}>
            <option value="" disabled>{t.hoodPh}</option>
            {AMSTERDAM_HOODS.map(h=><option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <div style={{ marginTop:12, padding:"12px 14px", background:GL, borderRadius:12, display:"flex", gap:8 }}>
          <Icon n="mail" size={16} color={G}/>
          <p style={{ margin:0, fontSize:12, color:G, lineHeight:1.6 }}>{t.emailNote}</p>
        </div>
        <button onClick={handleRegister} disabled={loading} style={{ width:"100%", marginTop:18, padding:"14px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", opacity:loading?.7:1 }}>
          {loading?"...":t.registerBtn}
        </button>
        <div style={{ textAlign:"center", marginTop:16, fontSize:13, color:"#6B5E4E" }}>
          {t.hasAcc}{" "}<button onClick={()=>setScreen("login")} style={{ background:"none", border:"none", color:G, fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"DM Sans,sans-serif" }}>{t.login}</button>
        </div>
      </div>
    </Wrap>
  );

  if (screen==="forgot") return (
    <Wrap>
      <div style={{ padding:"20px 20px 0" }}>
        <button onClick={()=>setScreen("login")} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", color:"#6B5E4E", fontSize:14, fontFamily:"DM Sans,sans-serif" }}>
          <Icon n="back" size={18} color="#6B5E4E"/> {lang==="NL"?"Terug":"Back"}
        </button>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 24px 60px" }}>
        <div style={{ width:64, height:64, background:GL, borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
          <Icon n="lock" size={28} color={G}/>
        </div>
        <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:24, fontWeight:700, color:"#2C2416", margin:"0 0 8px" }}>{t.forgotTitle}</h2>
        <p style={{ color:"#6B5E4E", fontSize:14, margin:"0 0 28px", lineHeight:1.6 }}>{t.forgotDesc}</p>
        <InputField icon="mail" ph={t.emailPh} val={email} onChange={e=>setEmail(e.target.value)}/>
        <button onClick={handleForgot} disabled={loading} style={{ width:"100%", marginTop:16, padding:"14px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity:loading?.7:1 }}>
          <Icon n="send" size={16} color="#fff"/> {loading?"...":t.sendLink}
        </button>
      </div>
    </Wrap>
  );

  if (screen==="forgot-sent") return (
    <Wrap>
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"0 32px" }}>
        <div style={{ width:80, height:80, background:GL, borderRadius:24, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
          <Icon n="mail" size={36} color={G}/>
        </div>
        <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:24, fontWeight:700, color:"#2C2416", margin:"0 0 12px", textAlign:"center" }}>{t.emailSent}</h2>
        <p style={{ color:"#6B5E4E", fontSize:14, textAlign:"center", lineHeight:1.7, margin:"0 0 8px" }}>{t.emailSentDesc}</p>
        <p style={{ color:G, fontWeight:700, fontSize:15, margin:"0 0 32px" }}>{email}</p>
        <div style={{ background:"#fff", border:"1px solid #E2D9CC", borderRadius:16, padding:"16px 18px", width:"100%", marginBottom:28 }}>
          <div style={{ fontSize:13, color:"#6B5E4E", lineHeight:1.7 }}>{t.checkInbox}</div>
        </div>
        <button onClick={()=>setScreen("login")} style={{ width:"100%", padding:"13px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:14, fontWeight:700, cursor:"pointer" }}>{t.backToLogin}</button>
        <button onClick={()=>setScreen("forgot")} style={{ marginTop:12, background:"none", border:"none", color:"#6B5E4E", fontSize:13, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>{t.resendLink}</button>
      </div>
    </Wrap>
  );

  if (screen==="verify-email") return (
    <Wrap>
      <div style={{ background:"linear-gradient(160deg,#F0EBE1,#E8E0D0)", padding:"48px 32px 32px" }}>
        <div style={{ width:64, height:64, background:G, borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>
          <Icon n="mail" size={30} color="#fff"/>
        </div>
        <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:24, fontWeight:700, color:"#2C2416", margin:"0 0 8px" }}>{t.checkEmail}</h2>
        <p style={{ color:"#6B5E4E", fontSize:13, margin:0, lineHeight:1.6 }}>
          {t.checkEmailDesc}{" "}<strong style={{ color:"#2C2416" }}>{email}</strong>
        </p>
      </div>
      <div style={{ flex:1, padding:"28px 24px 40px" }}>
        <p style={{ color:"#6B5E4E", fontSize:14, marginBottom:20, marginTop:0 }}>{t.enterCode}</p>
        <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:28 }}>
          {code.map((c,i)=>(
            <input key={i} maxLength={1} value={c}
              onChange={e=>{
                const v=e.target.value.replace(/\D/g,"");
                const nc=[...code]; nc[i]=v; setCode(nc);
                if(v&&i<5) document.getElementById("code-"+(i+1))?.focus();
              }}
              id={"code-"+i}
              style={{ width:44, height:52, textAlign:"center", fontSize:22, fontWeight:700, border:"2px solid "+(c?G:"#E2D9CC"), borderRadius:12, background:c?GL:"#fff", color:"#2C2416", outline:"none", fontFamily:"DM Sans,sans-serif", transition:"all .2s" }}
            />
          ))}
        </div>
        <button onClick={()=>setScreen("profile")} style={{ width:"100%", padding:"14px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", marginBottom:16 }}>{t.verifyBtn}</button>
        <div style={{ background:"#fff", border:"1px solid #E2D9CC", borderRadius:14, padding:"14px 16px" }}>
          <div style={{ fontSize:13, color:"#6B5E4E", lineHeight:1.7 }}>
            {t.noEmail}{" "}
            <button onClick={async()=>{ const r=await supabase.auth.resend({type:"signup",email:email}); if(r.error) alert(r.error.message); else alert(lang==="NL"?"Code verstuurd!":"Code resent!"); }} style={{ background:"none", border:"none", color:G, fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"DM Sans,sans-serif" }}>{t.resendCode}</button>
          </div>
        </div>
      </div>
    </Wrap>
  );

  if (screen==="profile") return (
    <Wrap>
      <div style={{ background:"linear-gradient(160deg,#F0EBE1,#E8E0D0)", padding:"40px 32px 28px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontFamily:"Playfair Display,serif", fontSize:22, fontWeight:700, color:"#2C2416" }}>CoHood</div>
          <div style={{ fontSize:12, color:"#6B5E4E", background:"rgba(255,255,255,.6)", padding:"4px 12px", borderRadius:20 }}>{t.profileStep}</div>
        </div>
        <div style={{ display:"flex", gap:6, marginBottom:16 }}>
          {[1,2,3].map(s=><div key={s} style={{ flex:1, height:4, borderRadius:2, background:G }}/>)}
        </div>
        <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:22, fontWeight:700, color:"#2C2416", margin:"0 0 4px" }}>{t.profileHeading}</h2>
        <p style={{ color:"#6B5E4E", fontSize:13, margin:0 }}>{t.profileSubheading}</p>
      </div>
      <div style={{ flex:1, padding:"24px 24px 40px", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
          <div style={{ position:"relative" }}>
            <div style={{ width:88, height:88, borderRadius:"50%", background:avatarUrl?"transparent":G, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, fontWeight:700, color:"#fff", overflow:"hidden", border:"3px solid #EBF3E8" }}>
              {avatarUrl?<img src={avatarUrl} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>:<span>{name?name[0].toUpperCase():"?"}</span>}
            </div>
            <label htmlFor="avatar-upload" style={{ position:"absolute", bottom:0, right:0, width:28, height:28, background:G, borderRadius:"50%", border:"2px solid #F7F4EF", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <Icon n="camera" size={13} color="#fff"/>
            </label>
            <input id="avatar-upload" type="file" accept="image/*" style={{ display:"none" }} onChange={async(e)=>{
              const file=e.target.files[0]; if(!file) return;
              const ext=file.name.split(".").pop();
              const name2=Math.random()+"."+ext;
              const r=await supabase.storage.from("avatars").upload(name2,file,{upsert:true});
              if(!r.error){ const d=supabase.storage.from("avatars").getPublicUrl(name2); setAvatarUrl(d.data.publicUrl); }
              else alert(r.error.message);
            }}/>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
          <InputField icon="user" ph={t.profileName} val={name} onChange={e=>setName(e.target.value)}/>
          <select value={hood} onChange={e=>setHood(e.target.value)} style={{ padding:"12px 14px", background:"#F0EBE1", border:"1.5px solid #E2D9CC", borderRadius:12, fontSize:14, color:hood?"#2C2416":"#A8997E", fontFamily:"DM Sans,sans-serif", outline:"none", cursor:"pointer" }}>
            <option value="" disabled>{t.profileHood}</option>
            {AMSTERDAM_HOODS.map(h=><option key={h} value={h}>{h}</option>)}
          </select>
          <div style={{ background:"#F0EBE1", border:"1.5px solid #E2D9CC", borderRadius:12, padding:"12px 14px" }}>
            <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder={t.profileBio} style={{ width:"100%", border:"none", outline:"none", background:"transparent", fontSize:14, color:"#2C2416", fontFamily:"DM Sans,sans-serif", resize:"none", minHeight:70, boxSizing:"border-box" }}/>
          </div>
        </div>
        <div style={{ marginBottom:20 }}>
          <p style={{ fontSize:13, fontWeight:600, color:"#2C2416", margin:"0 0 10px" }}>{t.profileOffers}</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:10 }}>
            {t.offersList.map(o=>(
              <button key={o} onClick={()=>setOffers(prev=>prev.includes(o)?prev.filter(x=>x!==o):[...prev,o])} style={{ padding:"7px 14px", borderRadius:20, border:"1.5px solid "+(offers.includes(o)?G:"#E2D9CC"), background:offers.includes(o)?GL:"#fff", color:offers.includes(o)?G:"#6B5E4E", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .2s" }}>
                {o}
              </button>
            ))}
          </div>
          {(offers.includes("Other")||offers.includes("Anders")) && (
            <div style={{ background:"#F0EBE1", border:"1.5px solid "+G, borderRadius:12, padding:"10px 14px" }}>
              <input value={offerOther} onChange={e=>setOfferOther(e.target.value)} placeholder={t.offerOtherPh} style={{ width:"100%", border:"none", outline:"none", background:"transparent", fontSize:13, color:"#2C2416", fontFamily:"DM Sans,sans-serif" }}/>
            </div>
          )}
        </div>
        <button onClick={()=>setScreen("onboarding")} style={{ width:"100%", padding:"14px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer" }}>{t.continueBtn}</button>
        <button onClick={()=>setScreen("onboarding")} style={{ width:"100%", marginTop:10, padding:"10px 0", background:"transparent", border:"none", color:"#6B5E4E", fontSize:13, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>{t.skipBtn}</button>
      </div>
    </Wrap>
  );

  const slide = onbSlides[onbStep];
  return (
    <Wrap>
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"40px 32px" }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:40 }}>
          <div style={{ width:120, height:120, background:slide.bg, borderRadius:36, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 16px 48px "+slide.color+"30" }}>
            <Icon n={slide.icon} size={52} color={slide.color} sw={1.5}/>
          </div>
        </div>
        <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:26, fontWeight:700, color:"#2C2416", margin:"0 0 14px", textAlign:"center", letterSpacing:-.3 }}>{slide.title}</h2>
        <p style={{ color:"#6B5E4E", fontSize:15, lineHeight:1.7, textAlign:"center", margin:"0 0 40px" }}>{slide.desc}</p>
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:40 }}>
          {onbSlides.map((_,i)=>(
            <div key={i} style={{ width:i===onbStep?24:8, height:8, borderRadius:4, background:i===onbStep?G:"#E2D9CC", transition:"all .3s" }}/>
          ))}
        </div>
        <button onClick={()=>{ if(onbStep<2) setOnbStep(onbStep+1); else onLogin(null); }} style={{ width:"100%", padding:"14px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(61,107,53,.3)" }}>
          {onbStep<2?t.nextBtn:t.getStarted}
        </button>
        {onbStep<2 && <button onClick={()=>onLogin(null)} style={{ marginTop:12, background:"none", border:"none", color:"#6B5E4E", fontSize:13, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>{t.skipBtn}</button>}
      </div>
    </Wrap>
  );
}

function App2({ lang, setLang, onLogout, dm, setDm, verified, setVerified, user }) {
  const t = TXT[lang];
  const posts = POSTS[lang]||POSTS.EN;
  const [tab, setTab] = useState("feed");
  const [filter, setFilter] = useState("all");
  const [liked, setLiked] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [comments, setComments] = useState({});
  const [cmtInput, setCmtInput] = useState({});
  const [cmtList, setCmtList] = useState({});
  useEffect(()=>{
  if(posts.length){
    [...posts,...realPosts].forEach(p=>{
      supabase.from("comments").select("*").eq("post_id",p.id).order("created_at").then(({data})=>{
        if(data&&data.length) setCmtList(prev=>({...prev,[p.id]:data.map(c=>({txt:c.content,name:c.full_name,ini:c.full_name?c.full_name[0]:"?",col:G}))}));
      });
    });
  }
},[]);
useEffect(()=>{
  if(user?.id){
    getUserLikes(user.id).then(likedPosts=>{
      const obj={};
      likedPosts.forEach(id=>{obj[String(id)]=true;});
      setLiked(obj);
    });
    [...posts,...realPosts].forEach(p=>{
      getLikes(p.id).then(count=>{
        setLikeCounts(prev=>({...prev,[p.id]:count}));
      });
    });
  }
},[user]);
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
  const [profile, setProfile] = useState(null);
  const [realPosts, setRealPosts] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const bg = dm?"#181510":"#F7F4EF";
  const card = dm?"#232018":"#FFFFFF";
  const ink = dm?"#EDE7D9":"#2C2416";
  const mid = dm?"#9A8E7A":"#6B5E4E";
  const bdr = dm?"#33291E":"#E2D9CC";
  const warm = dm?"#2C2820":"#F0EBE1";

  useEffect(()=>{
  if(user?.id){
    supabase.from("profiles").select("*").eq("id",user.id).single().then(({data, error})=>{
      if(data){
        setProfile(data);
      } else {
        // Profil yok, oluştur
        supabase.from("profiles").insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
          neighborhood: "",
          verified: false
        }).then(()=>{
          setProfile({ full_name: user.user_metadata?.full_name || "", neighborhood: "" });
        });
      }
      setProfileLoading(false);
    });
  } else {
    setProfileLoading(false);
  }
},[user]);

  const displayName = profile?.full_name||user?.user_metadata?.full_name||"User";
  const displayHood = profile?.neighborhood||user?.user_metadata?.neighborhood||"Amsterdam";
  useEffect(()=>{
  if(displayHood){
    getPosts(displayHood).then(({data})=>{
      if(data) setRealPosts(data.map(p=>({
        id:p.id, type:p.type||"help", user:p.full_name||"User",
        ini:(p.full_name||"U")[0].toUpperCase(), ver:false,
        time: (() => { const diff = Math.floor((Date.now() - new Date(p.created_at).getTime()) / 60000); if(diff < 1) return "just now"; if(diff < 60) return diff + " min"; if(diff < 1440) return Math.floor(diff/60) + " hr"; return Math.floor(diff/1440) + " days"; })(), cat:p.category||"", icon:"tool",
        body:p.body, offer:p.offer, likes:0, replies:0,
        urgent:p.urgent, hood:p.neighborhood
      })));
      if(data) data.forEach(p=>{
  getLikes(p.id).then(count=>{ setLikeCounts(prev=>({...prev,[p.id]:count})); });
  supabase.from("comments").select("*").eq("post_id",p.id).order("created_at").then(({data:c})=>{
    if(c&&c.length) setCmtList(prev=>({...prev,[p.id]:c.map(x=>({txt:x.content,name:x.full_name,ini:x.full_name?x.full_name[0]:"?",col:G}))}));
  });
});
    });
  }
},[displayHood]);
  const displayIni = displayName[0]?.toUpperCase()||"U";

  const requireVer = (fn) => { if(verified) fn(); else setShowVer(true); };
  const doTranslate = (id,body) => {
    setTranslating(p=>({...p,[id]:true}));
    setTimeout(()=>{ setTranslated(p=>({...p,[id]:body+" ["+t.translate+"d]"})); setTranslating(p=>({...p,[id]:false})); },900);
  };
  const submitHelp = () => requireVer(async()=>{ await createPost(user?.id, displayName, displayHood, "help", t.helpCats[needCat]||"", needTxt, offerTxt, isUrgent); setSuccess("help"); setTimeout(()=>{ setSuccess(null); setTab("feed"); setNeedCat(null); setNeedTxt(""); setOfferCat(null); setOfferTxt(""); setIsUrgent(false); },2000); });  const submitEv = () => requireVer(()=>{ setSuccess("ev"); setTimeout(()=>{ setSuccess(null); setTab("feed"); setEvType(null); setEvName(""); setEvDate(""); setEvLoc(""); },2000); });
  const sendDm = () => { setDmSent(true); setTimeout(()=>{ setDmSent(false); setDmPost(null); setDmText(""); },1800); };
const userHood = profile?.neighborhood || user?.user_metadata?.neighborhood;
const allPosts = [...realPosts, ...posts.filter(p=>p.hood===displayHood||p.hood==="All Neighborhood"||p.hood==="Hele Buurt")];  
const filtPosts = allPosts.filter(p=>{
  const typeMatch = filter==="all"||(filter==="help"&&p.type==="help")||(filter==="event"&&p.type==="event");
  return typeMatch;
});

  const NavBtn = ({ k, icon, label, badge }) => (
    <button onClick={()=>setTab(k)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"7px 0 8px", border:"none", background:"transparent", cursor:"pointer", color:tab===k?G:mid, position:"relative" }}>
      <span style={{ position:"relative" }}>
        <Icon n={icon} size={20} color={tab===k?G:mid} sw={tab===k?2.2:1.6}/>
        {badge&&tab!=="messages"&&(
          <span style={{ position:"absolute", top:-4, right:-6, width:16, height:16, borderRadius:"50%", background:R, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:9, fontWeight:700, color:"#fff" }}>{badge}</span>
          </span>
        )}
      </span>
      <span style={{ fontSize:10, fontWeight:tab===k?700:500, fontFamily:"DM Sans,sans-serif" }}>{label}</span>
    </button>
  );

  return (
    <div style={{ minHeight:"100vh", background:bg, fontFamily:"DM Sans,sans-serif", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>
      <div style={{ background:dm?"#1A1510":"#fff", borderBottom:"1px solid "+bdr, padding:"13px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, background:G, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon n="users" size={17} color="#fff"/>
          </div>
          <span style={{ fontFamily:"Playfair Display,serif", fontSize:17, fontWeight:700, color:ink, letterSpacing:-.3 }}>CoHood</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {verified&&(
            <div style={{ display:"flex", alignItems:"center", gap:5, background:GL, padding:"3px 10px", borderRadius:20 }}>
              <VerBadge size={14}/><span style={{ fontSize:11, fontWeight:700, color:G }}>{t.verBadge}</span>
            </div>
          )}
          <button style={{ background:"none", border:"none", cursor:"pointer", color:mid, padding:4 }}><Icon n="bell" size={18}/></button>
          <button onClick={()=>setDm(!dm)} style={{ background:"none", border:"none", cursor:"pointer", color:mid, padding:4 }}><Icon n={dm?"sun":"moon"} size={18}/></button>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto" }}>
        {tab==="feed"&&(
          <div style={{ padding:"18px 16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div>
                <h2 style={{ margin:0, fontSize:20, fontWeight:700, color:ink, fontFamily:"Playfair Display,serif", letterSpacing:-.3 }}>{t.feedTitle}</h2>
                <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:4, color:mid, fontSize:12 }}>
                  <Icon n="mapPin" size={12} color={mid}/> {userHood || "Amsterdam"}
                </div>
              </div>
              <div style={{ background:GL, borderRadius:20, padding:"4px 12px", display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:G }}/>
                <span style={{ fontSize:12, color:G, fontWeight:600 }}>89 {t.neighbors}</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {[["all",t.all],["help",t.helpF],["event",t.eventF]].map(([k,lbl])=>(
                <button key={k} onClick={()=>setFilter(k)} style={{ padding:"6px 14px", borderRadius:20, border:"1.5px solid "+(filter===k?G:bdr), background:filter===k?G:"transparent", color:filter===k?"#fff":mid, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .2s" }}>{lbl}</button>
              ))}
            </div>
            {filtPosts.map((p,i)=>{
              const tc=TCAT[p.type]||TCAT.announce;
              const ac=AVC[i%AVC.length];
              return (
                <div key={p.id} style={{ background:card, border:"1px solid "+bdr, borderRadius:16, padding:16, marginBottom:12, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
                  <div style={{ display:"flex", gap:10, marginBottom:10 }}>
                    <Av ini={p.ini} size={42} col={ac} ver={p.ver}/>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", justifyContent:"space-between" }}>
                        <div>
                          <div style={{ fontSize:14, fontWeight:700, color:ink }}>{p.user}</div>
                          <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
                            <Icon n="mapPin" size={11} color={mid}/><span style={{ fontSize:12, color:mid }}>{p.hood}</span>
                            <span style={{ color:bdr }}>·</span>
                            <Icon n="clock" size={11} color={mid}/><span style={{ fontSize:12, color:mid }}>{p.time}</span>
                          </div>
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:4, background:tc.bg, padding:"3px 8px", borderRadius:20 }}>
                            <Icon n={p.icon} size={11} color={tc.color}/><span style={{ fontSize:11, fontWeight:700, color:tc.color }}>{p.cat}</span>
                          </div>
                          {p.urgent&&(
                            <div style={{ display:"flex", alignItems:"center", gap:4, background:RL, padding:"3px 8px", borderRadius:20 }}>
                              <div style={{ width:5, height:5, borderRadius:"50%", background:R, animation:"pulse 1.2s infinite" }}/>
                              <span style={{ fontSize:10, fontWeight:700, color:R, letterSpacing:.5 }}>{t.urgent.toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p style={{ margin:"0 0 8px", fontSize:14, color:mid, lineHeight:1.6 }}>{translated[p.id]||p.body}</p>
                  {p.offer&&(
                    <div style={{ background:dm?"rgba(90,58,122,.15)":PUL, border:"1px solid "+PU+"20", borderRadius:10, padding:"10px 12px", marginBottom:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                        <Icon n="hands" size={13} color={PU}/><span style={{ fontSize:11, fontWeight:700, color:PU, letterSpacing:.5 }}>{t.offerTitle.toUpperCase()}</span>
                      </div>
                      <p style={{ margin:0, fontSize:13, color:dm?"#C4B0D8":PU, lineHeight:1.5 }}>{p.offer}</p>
                    </div>
                  )}
                  {p.date&&(
                    <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:GL, padding:"5px 12px", borderRadius:20, marginBottom:8 }}>
                      <Icon n="calendar" size={12} color={G}/><span style={{ fontSize:12, color:G, fontWeight:600 }}>{p.date}</span>
                    </div>
                  )}
                  {!translated[p.id]?(
                    <button onClick={()=>doTranslate(p.id,p.body)} style={{ display:"flex", alignItems:"center", gap:5, marginBottom:10, padding:"4px 10px", borderRadius:20, border:"1px solid "+bdr, background:"transparent", color:mid, cursor:"pointer", fontSize:11, fontWeight:600 }}>
                      <Icon n="globe" size={12} color={mid}/> {translating[p.id]?t.translating:t.translate}
                    </button>
                  ):(
                    <button onClick={()=>setTranslated(prev=>({...prev,[p.id]:null}))} style={{ display:"flex", alignItems:"center", gap:5, marginBottom:10, padding:"4px 10px", borderRadius:20, border:"1px solid "+G+"40", background:GL, color:G, cursor:"pointer", fontSize:11, fontWeight:600 }}>
                      <Icon n="globe" size={12} color={G}/> {t.original}
                    </button>
                  )}
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <button onClick={async()=>{ const newState = await toggleLike(p.id, user?.id); setLiked(prev=>({...prev,[p.id]:newState})); setLikeCounts(prev=>({...prev,[p.id]:(prev[p.id]||0)+(newState?1:-1)})); }} style={{ display:"flex", alignItems:"center", gap:4, padding:"6px 12px", borderRadius:20, border:"1.5px solid "+(liked[p.id]?"#E53935":bdr), background:liked[p.id]?"#FFF0F0":"transparent", color:liked[p.id]?"#E53935":mid, cursor:"pointer", fontSize:12, fontWeight:600, transition:"all .2s" }}>
                      {liked[p.id]?(<svg width="13" height="13" viewBox="0 0 24 24" fill="#E53935"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>):(<Icon n="heart" size={13} color={mid}/>)}
                      {likeCounts[p.id]||0}
                    </button>
                    <button onClick={()=>setComments(prev=>({...prev,[p.id]:!prev[p.id]}))} style={{ display:"flex", alignItems:"center", gap:4, padding:"6px 12px", borderRadius:20, border:"1.5px solid "+(comments[p.id]?G:bdr), background:comments[p.id]?GL:"transparent", color:comments[p.id]?G:mid, cursor:"pointer", fontSize:12, fontWeight:600, transition:"all .2s" }}>
                      <Icon n="msg" size={13} color={comments[p.id]?G:mid}/> {(cmtList[p.id]||[]).length}
                    </button>
                    <button onClick={()=>setDmPost(p)} style={{ display:"flex", alignItems:"center", gap:4, padding:"6px 12px", borderRadius:20, border:"1.5px solid "+bdr, background:"transparent", color:mid, cursor:"pointer", fontSize:12, fontWeight:600 }}>
                      <Icon n="send" size={13} color={mid}/>
                    </button>
                    <button style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5, padding:"6px 14px", borderRadius:20, border:"none", background:G, color:"#fff", cursor:"pointer", fontSize:12, fontWeight:700 }}>
                      {p.type==="event"?t.join:t.respond}<Icon n="chevronRight" size={13} color="#fff"/>
                    </button>
                  </div>
                  {comments[p.id]&&(
                    <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid "+bdr }}>
                      {(cmtList[p.id]||[]).map((c,ci)=>(
                        <div key={ci} style={{ display:"flex", gap:8, marginBottom:10 }}>
                          <div style={{ width:28, height:28, borderRadius:"50%", background:c.col, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", flexShrink:0 }}>{c.ini}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ background:warm, borderRadius:"4px 12px 12px 12px", padding:"8px 12px" }}>
                              <div style={{ fontSize:11, fontWeight:700, color:G, marginBottom:4 }}>{c.name||c.ini}</div>
                              <p style={{ margin:0, fontSize:13, color:ink, lineHeight:1.5 }}>{c.txt}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <div style={{ width:28, height:28, borderRadius:"50%", background:G, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", flexShrink:0 }}>{displayIni}</div>
                        <div style={{ flex:1, display:"flex", gap:6, background:warm, border:"1.5px solid "+bdr, borderRadius:20, padding:"6px 6px 6px 12px", alignItems:"center" }}>
                          <input value={cmtInput[p.id]||""} onChange={e=>setCmtInput(prev=>({...prev,[p.id]:e.target.value}))} placeholder={lang==="NL"?"Schrijf een reactie...":"Write a comment..."} style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:13, color:ink, fontFamily:"DM Sans,sans-serif" }}/>
                          <button onClick={()=>{ if(cmtInput[p.id]?.trim()){ saveComment(p.id,user?.id,displayName,cmtInput[p.id]); setCmtList(prev=>({...prev,[p.id]:[...(prev[p.id]||[]),{txt:cmtInput[p.id],ini:displayIni,name:displayName,col:G}]})); setCmtInput(prev=>({...prev,[p.id]:""})); } }} style={{ width:28, height:28, borderRadius:"50%", background:G, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <Icon n="send" size={13} color="#fff"/>
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

        {tab==="share"&&(
          <div style={{ padding:"18px 16px" }}>
            <h2 style={{ margin:"0 0 4px", fontSize:20, fontWeight:700, color:ink, fontFamily:"Playfair Display,serif" }}>{t.formTitle}</h2>
            <p style={{ color:mid, fontSize:13, margin:"0 0 18px" }}>{t.formSub}</p>
            {success==="help"?(
              <div style={{ textAlign:"center", padding:"60px 0" }}>
                <div style={{ width:64, height:64, background:GL, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                  <Icon n="check" size={28} color={G} sw={2.5}/>
                </div>
                <div style={{ fontSize:18, fontWeight:700, color:ink }}>{t.okHelp}</div>
                <div style={{ fontSize:14, color:mid, marginTop:6 }}>{t.okHelpSub}</div>
              </div>
            ):(
              <div>
                <div style={{ background:card, border:"1px solid "+bdr, borderRadius:16, padding:16, marginBottom:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                    <div style={{ width:28, height:28, background:RL, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}><Icon n="alert" size={15} color={R}/></div>
                    <span style={{ fontSize:15, fontWeight:700, color:ink }}>{t.needTitle}</span>
                  </div>
                  <p style={{ color:mid, fontSize:13, margin:"0 0 10px" }}>{t.needDesc}</p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                    {t.helpCats.map((cat,i)=>(
                      <button key={i} onClick={()=>setNeedCat(i)} style={{ padding:"9px 8px", borderRadius:12, border:"1.5px solid "+(needCat===i?R:bdr), background:needCat===i?RL:warm, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:7, transition:"all .15s" }}>
                        <Icon n={t.helpIcons[i]} size={14} color={needCat===i?R:mid}/>
                        <span style={{ fontWeight:600, color:needCat===i?R:ink, textAlign:"left", lineHeight:1.3 }}>{cat}</span>
                      </button>
                    ))}
                  </div>
                  <textarea value={needTxt} onChange={e=>setNeedTxt(e.target.value)} placeholder={t.needPh} style={{ width:"100%", minHeight:80, padding:"10px 12px", borderRadius:10, border:"1.5px solid "+bdr, background:warm, color:ink, fontSize:13, fontFamily:"DM Sans,sans-serif", resize:"vertical", outline:"none", boxSizing:"border-box" }}/>
                  <button onClick={()=>setIsUrgent(!isUrgent)} style={{ marginTop:10, display:"flex", alignItems:"center", gap:8, padding:"7px 14px", borderRadius:10, border:"1.5px solid "+(isUrgent?R:bdr), background:isUrgent?RL:warm, cursor:"pointer" }}>
                    <Icon n="alert" size={15} color={isUrgent?R:mid}/><span style={{ fontSize:13, fontWeight:600, color:isUrgent?R:mid }}>{t.urgentLbl}</span>
                  </button>
                </div>
                <div style={{ background:card, border:"1px solid "+bdr, borderRadius:16, padding:16, marginBottom:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                    <div style={{ width:28, height:28, background:PUL, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}><Icon n="hands" size={15} color={PU}/></div>
                    <span style={{ fontSize:15, fontWeight:700, color:ink }}>{t.offerTitle}</span>
                  </div>
                  <p style={{ color:mid, fontSize:13, margin:"0 0 10px" }}>{t.offerDesc}</p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                    {t.helpCats.map((cat,i)=>(
                      <button key={i} onClick={()=>setOfferCat(offerCat===i?null:i)} style={{ padding:"9px 8px", borderRadius:12, border:"1.5px solid "+(offerCat===i?PU:bdr), background:offerCat===i?PUL:warm, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:7, transition:"all .15s" }}>
                        <Icon n={t.helpIcons[i]} size={14} color={offerCat===i?PU:mid}/>
                        <span style={{ fontWeight:600, color:offerCat===i?PU:ink, textAlign:"left", lineHeight:1.3 }}>{cat}</span>
                      </button>
                    ))}
                  </div>
                  <textarea value={offerTxt} onChange={e=>setOfferTxt(e.target.value)} placeholder={t.offerPh} style={{ width:"100%", minHeight:80, padding:"10px 12px", borderRadius:10, border:"1.5px solid "+bdr, background:warm, color:ink, fontSize:13, fontFamily:"DM Sans,sans-serif", resize:"vertical", outline:"none", boxSizing:"border-box" }}/>
                </div>
                {!verified&&(
                  <div style={{ background:GL, border:"1px solid "+G+"30", borderRadius:12, padding:"11px 14px", marginBottom:14, display:"flex", gap:10, alignItems:"center" }}>
                    <Icon n="shield" size={18} color={G}/>
                    <span style={{ flex:1, fontSize:13, fontWeight:600, color:G }}>{t.verReq}</span>
                    <button onClick={()=>setShowVer(true)} style={{ padding:"5px 12px", background:G, color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>{t.verNow}</button>
                  </div>
                )}
                <button onClick={submitHelp} style={{ width:"100%", padding:"14px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  <Icon n="send" size={16} color="#fff"/> {t.submitLbl}
                </button>
              </div>
            )}
          </div>
        )}

        {tab==="events"&&(
          <div style={{ padding:"18px 16px" }}>
            <h2 style={{ margin:"0 0 18px", fontSize:20, fontWeight:700, color:ink, fontFamily:"Playfair Display,serif" }}>{t.evTitle}</h2>
            {success==="ev"?(
              <div style={{ textAlign:"center", padding:"60px 0" }}>
                <div style={{ width:64, height:64, background:GL, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                  <Icon n="check" size={28} color={G} sw={2.5}/>
                </div>
                <div style={{ fontSize:18, fontWeight:700, color:ink }}>{t.okEv}</div>
                <div style={{ fontSize:14, color:mid, marginTop:6 }}>{t.okEvSub}</div>
              </div>
            ):(
              <div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:18 }}>
                  {t.evTypes.map((ev,i)=>(
                    <button key={i} onClick={()=>setEvType(i)} style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", borderRadius:20, border:"1.5px solid "+(evType===i?G:bdr), background:evType===i?GL:card, cursor:"pointer", transition:"all .2s" }}>
                      <Icon n={t.evIcons[i]} size={14} color={evType===i?G:mid}/><span style={{ fontSize:13, fontWeight:600, color:evType===i?G:ink }}>{ev}</span>
                    </button>
                  ))}
                </div>
                {[["calendar",t.evName,evName,setEvName],["clock",t.evDate,evDate,setEvDate],["mapPin",t.evLoc,evLoc,setEvLoc]].map(([icon,ph,val,set],i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, background:card, border:"1.5px solid "+bdr, borderRadius:12, padding:"12px 14px", marginBottom:10 }}>
                    <Icon n={icon} size={16} color={mid}/><input value={val} onChange={e=>set(e.target.value)} placeholder={ph} style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:14, color:ink, fontFamily:"DM Sans,sans-serif" }}/>
                  </div>
                ))}
                {!verified&&(
                  <div style={{ background:GL, border:"1px solid "+G+"30", borderRadius:12, padding:"11px 14px", marginBottom:14, display:"flex", gap:10, alignItems:"center" }}>
                    <Icon n="shield" size={18} color={G}/>
                    <span style={{ flex:1, fontSize:13, fontWeight:600, color:G }}>{t.verReq}</span>
                    <button onClick={()=>setShowVer(true)} style={{ padding:"5px 12px", background:G, color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>{t.verNow}</button>
                  </div>
                )}
                <button onClick={submitEv} style={{ width:"100%", padding:"14px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  <Icon n="leaf" size={16} color="#fff"/> {t.evSubmit}
                </button>
              </div>
            )}
          </div>
        )}

        {tab==="messages"&&(
          <div style={{ padding:"18px 16px" }}>
            <h2 style={{ margin:"0 0 18px", fontSize:20, fontWeight:700, color:ink, fontFamily:"Playfair Display,serif" }}>{t.msgTitle}</h2>
            {CONVS.map((c,i)=>(
              <div key={c.id} onClick={()=>setActiveConv(c)} style={{ display:"flex", gap:12, alignItems:"center", padding:"13px 0", borderBottom:"1px solid "+bdr, cursor:"pointer" }}>
                <Av ini={c.ini} size={46} col={c.col} ver={c.ver}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:14, fontWeight:c.unread?700:600, color:ink }}>{c.name}</span>
                    <span style={{ fontSize:11, color:mid }}>{t.convTime[i]}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    {c.mine&&<Icon n="check" size={12} color={G} sw={2.5}/>}
                    <span style={{ fontSize:13, color:c.unread?ink:mid, fontWeight:c.unread?600:400, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:210 }}>{t.convLast[i]}</span>
                  </div>
                </div>
                {c.unread>0&&(
                  <div style={{ width:20, height:20, borderRadius:"50%", background:G, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:"#fff" }}>{c.unread}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab==="profile"&&(
          <div style={{ padding:"18px 16px" }}>
            <div style={{ background:"linear-gradient(135deg,"+G+",#5A8E52)", borderRadius:20, padding:"26px 22px", marginBottom:14, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", right:-20, top:-20, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,.07)" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <Av ini={displayIni} size={54} col="rgba(255,255,255,.2)" ver={verified}/>
                  <div style={{ fontSize:20, fontWeight:700, color:"#fff", marginTop:10, fontFamily:"Playfair Display,serif" }}>{displayName}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:4, color:"rgba(255,255,255,.75)", fontSize:13 }}>
                    <Icon n="mapPin" size={13} color="rgba(255,255,255,.75)"/> {displayHood}, Amsterdam
                  </div>
                </div>
                {verified?(
                  <div style={{ background:"rgba(255,255,255,.15)", borderRadius:12, padding:"7px 12px", display:"flex", alignItems:"center", gap:5 }}>
                    <VerBadge size={16}/><span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{t.verified}</span>
                  </div>
                ):(
                  <button onClick={()=>setShowVer(true)} style={{ background:"rgba(255,255,255,.2)", border:"1.5px solid rgba(255,255,255,.4)", borderRadius:12, padding:"7px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                    <Icon n="shield" size={14} color="#fff"/><span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{t.idVer}</span>
                  </button>
                )}
              </div>
            </div>
            <button onClick={()=>setShowEditProfile(true)} style={{ marginBottom:12, width:"100%", padding:"11px 0", background:"transparent", border:"1.5px solid #E2D9CC", borderRadius:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, color:ink }}><Icon n="user" size={15} color={ink}/><span style={{ fontSize:13, fontWeight:600 }}>Edit Profile</span></button>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:12 }}>
              {[[12,t.helped,"heart"],[5,t.evLabel,"calendar"],[89,t.conns,"users"]].map(([n,lbl,icon])=>(
                <div key={lbl} style={{ background:card, border:"1px solid "+bdr, borderRadius:14, padding:"13px 8px", textAlign:"center" }}>
                  <div style={{ display:"flex", justifyContent:"center", marginBottom:5, color:G }}><Icon n={icon} size={18}/></div>
                  <div style={{ fontSize:22, fontWeight:800, color:ink }}>{n}</div>
                  <div style={{ fontSize:11, color:mid, marginTop:1 }}>{lbl}</div>
                </div>
              ))}
            </div>
            <div style={{ background:card, border:"1px solid "+bdr, borderRadius:16, padding:14, marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <Icon n="hands" size={16} color={PU}/>
                  <span style={{ fontSize:14, fontWeight:700, color:ink }}>{t.myOffers}</span>
                </div>
                <button style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 10px", background:PUL, border:"1px solid "+PU+"20", borderRadius:8, cursor:"pointer" }}>
                  <Icon n="plus" size={13} color={PU}/><span style={{ fontSize:12, fontWeight:700, color:PU }}>{t.addOffer}</span>
                </button>
              </div>
              <div style={{ background:PUL, borderRadius:10, padding:"10px 12px" }}>
                <p style={{ margin:0, fontSize:13, color:PU, lineHeight:1.5 }}>
                  {lang==="NL"?"Ik kan helpen met vertaalwerk.":"I can help with translation."}
                </p>
              </div>
            </div>
            <div style={{ background:card, border:"1px solid "+bdr, borderRadius:16, overflow:"hidden", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", borderBottom:"1px solid "+bdr }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}><Icon n="globe" size={17} color={G}/><span style={{ fontSize:14, fontWeight:500, color:ink }}>{t.langPref}</span></div>
                <div style={{ position:"relative" }}>
                  <button onClick={()=>setLangOpen(!langOpen)} style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", background:GL, border:"1px solid "+G+"30", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:700, color:G }}>
                    {lang} <Icon n="chevronDown" size={12} color={G}/>
                  </button>
                  {langOpen&&(
                    <div style={{ position:"absolute", right:0, top:32, background:card, border:"1px solid "+bdr, borderRadius:10, overflow:"hidden", boxShadow:"0 8px 24px rgba(0,0,0,.1)", zIndex:20, minWidth:120 }}>
                      {["EN","NL"].map(l=>(
                        <button key={l} onClick={()=>{setLang(l);setLangOpen(false);}} style={{ width:"100%", padding:"9px 12px", border:"none", background:lang===l?GL:"transparent", cursor:"pointer", textAlign:"left", fontSize:13, color:lang===l?G:ink, fontWeight:lang===l?700:500, fontFamily:"DM Sans,sans-serif" }}>{l}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", borderBottom:"1px solid "+bdr }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}><Icon n="moon" size={17} color={G}/><span style={{ fontSize:14, fontWeight:500, color:ink }}>{t.darkMode}</span></div>
                <button onClick={()=>setDm(!dm)} style={{ width:44, height:24, borderRadius:12, border:"none", background:dm?G:bdr, cursor:"pointer", position:"relative", transition:"all .2s" }}>
                  <div style={{ position:"absolute", top:2, left:dm?22:2, width:20, height:20, borderRadius:"50%", background:"#fff", transition:"all .2s" }}/>
                </button>
              </div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", borderBottom:"1px solid "+bdr }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}><Icon n="shield" size={17} color={G}/><span style={{ fontSize:14, fontWeight:500, color:ink }}>{t.idVer}</span></div>
                {verified
                  ?<div style={{ display:"flex", alignItems:"center", gap:5 }}><VerBadge size={16}/><span style={{ fontSize:12, fontWeight:700, color:G }}>{t.verified}</span></div>
                  :<button onClick={()=>setShowVer(true)} style={{ padding:"5px 12px", background:G, color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.verNow}</button>
                }
              </div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}><Icon n="bell" size={17} color={G}/><span style={{ fontSize:14, fontWeight:500, color:ink }}>{t.notif}</span></div>
                <Icon n="chevronRight" size={16} color={mid}/>
              </div>
            </div>
            <button onClick={onLogout} style={{ width:"100%", padding:"13px 0", background:"transparent", color:R, border:"1.5px solid "+R+"30", borderRadius:14, fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <Icon n="back" size={16} color={R}/> {t.logout}
            </button>
          </div>
        )}
      </div>

      <div style={{ background:dm?"#1A1510":"#fff", borderTop:"1px solid "+bdr, display:"flex", padding:"8px 0 4px", position:"sticky", bottom:0, zIndex:50 }}>
        <NavBtn k="feed" icon="home" label={t.feed}/>
        <NavBtn k="share" icon="send" label={t.share}/>
        <NavBtn k="events" icon="calendar" label={t.events}/>
        <NavBtn k="messages" icon="msg" label={t.messages} badge={3}/>
        <NavBtn k="profile" icon="user" label={t.profile}/>
      </div>

      {activeConv&&(
        <div style={{ position:"fixed", inset:0, zIndex:200, background:bg, maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column" }}>
          <div style={{ background:dm?"#1A1510":"#fff", borderBottom:"1px solid "+bdr, padding:"13px 16px", display:"flex", alignItems:"center", gap:10 }}>
            <button onClick={()=>setActiveConv(null)} style={{ border:"none", background:"none", cursor:"pointer", padding:4, display:"flex" }}>
              <Icon n="back" size={20} color={ink}/>
            </button>
            <Av ini={activeConv.ini} size={36} col={activeConv.col} ver={activeConv.ver}/>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:ink }}>{activeConv.name}</div>
              <div style={{ fontSize:11, color:G, fontWeight:600 }}>{t.online}</div>
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:10 }}>
            {[
              {txt:lang==="NL"?"Hallo! Hoe kan ik helpen?":"Hi! How can I help?",mine:false},
              {txt:lang==="NL"?"Bedankt! Ben je morgen beschikbaar?":"Thanks! Are you free tomorrow?",mine:true},
              {txt:lang==="NL"?"Ja! Hoe laat?":"Yes! What time?",mine:false},
            ].map((m,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:m.mine?"flex-end":"flex-start" }}>
                <div style={{ maxWidth:"75%", background:m.mine?G:card, border:m.mine?"none":"1px solid "+bdr, borderRadius:m.mine?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"10px 14px" }}>
                  <p style={{ margin:0, fontSize:13, color:m.mine?"#fff":ink, lineHeight:1.5 }}>{m.txt}</p>
                  {m.mine&&<div style={{ display:"flex", justifyContent:"flex-end", marginTop:4 }}><Icon n="check" size={11} color="rgba(255,255,255,.7)" sw={2.5}/></div>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:dm?"#1A1510":"#fff", borderTop:"1px solid "+bdr, padding:"12px 16px", display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ flex:1, background:warm, border:"1.5px solid "+bdr, borderRadius:24, padding:"10px 16px" }}>
              <input value={convMsg} onChange={e=>setConvMsg(e.target.value)} placeholder={t.msgPh} style={{ width:"100%", border:"none", outline:"none", background:"transparent", fontSize:14, color:ink, fontFamily:"DM Sans,sans-serif" }}/>
            </div>
            <button onClick={()=>setConvMsg("")} style={{ width:42, height:42, borderRadius:"50%", background:G, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon n="send" size={16} color="#fff"/>
            </button>
          </div>
        </div>
      )}

      {dmPost&&(
        <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", backdropFilter:"blur(4px)" }} onClick={()=>setDmPost(null)}>
          <div style={{ background:card, borderRadius:"20px 20px 0 0", width:"100%", maxWidth:480, padding:"8px 20px 36px" }} onClick={e=>e.stopPropagation()}>
            <div style={{ width:36, height:4, background:bdr, borderRadius:2, margin:"14px auto 20px" }}/>
            {dmSent?(
              <div style={{ textAlign:"center", padding:"24px 0" }}>
                <div style={{ width:52, height:52, background:GL, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                  <Icon n="check" size={24} color={G} sw={2.5}/>
                </div>
                <div style={{ fontSize:16, fontWeight:700, color:ink }}>{lang==="NL"?"Bericht verzonden!":"Message sent!"}</div>
              </div>
            ):(
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                  <Av ini={dmPost.ini} size={36} col={AVC[(dmPost.id-1)%AVC.length]} ver={dmPost.ver}/>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:ink }}>{dmPost.user}</div>
                    <div style={{ fontSize:12, color:mid }}>{lang==="NL"?"Direct bericht":"Direct message"}</div>
                  </div>
                </div>
                <textarea value={dmText} onChange={e=>setDmText(e.target.value)} placeholder={lang==="NL"?"Schrijf je bericht...":"Write your message..."} style={{ width:"100%", minHeight:100, padding:"12px 14px", borderRadius:12, border:"1.5px solid "+bdr, background:warm, color:ink, fontSize:14, fontFamily:"DM Sans,sans-serif", resize:"none", outline:"none", boxSizing:"border-box", marginBottom:12 }}/>
                <button onClick={sendDm} style={{ width:"100%", padding:"13px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  <Icon n="send" size={15} color="#fff"/> {lang==="NL"?"Versturen":"Send"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

{showEditProfile&&(
  <EditProfileModal user={user} profile={profile} onClose={()=>setShowEditProfile(false)} onSave={(data)=>setProfile(prev=>({...prev,...data}))} lang={lang}/>
)}

      {showVer&&(
        <VerifyModal t={t} dm={dm} onClose={()=>setShowVer(false)} onVerified={()=>{setVerified(true);setShowVer(false);}}/>
      )}

      <style>{"@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}} @keyframes spin{to{transform:rotate(360deg)}} button:active{transform:scale(.97)}"}</style>
    </div>
  );
}

function EditProfileModal({ user, profile, onClose, onSave, lang }) {
  const t = TXT[lang];
  const [name, setName] = useState(profile?.full_name || user?.user_metadata?.full_name || "");
  const [hood, setHood] = useState(profile?.neighborhood || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const save = async () => {
    await supabase.from("profiles").upsert({ id:user.id, full_name:name, neighborhood:hood, bio:bio });
    onSave({ full_name:name, neighborhood:hood, bio:bio });
    onClose();
  };
  return (
    <div style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(0,0,0,.5)", display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", width:"100%", maxWidth:480, padding:"20px 24px 40px" }} onClick={e=>e.stopPropagation()}>
        <div style={{ width:36, height:4, background:"#E2D9CC", borderRadius:2, margin:"0 auto 20px" }}/>
        <h3 style={{ margin:"0 0 16px", fontSize:18, fontWeight:700, color:"#2C2416", fontFamily:"Playfair Display,serif" }}>Edit Profile</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
          <InputField icon="user" ph="Full name" val={name} onChange={e=>setName(e.target.value)}/>
          <select value={hood} onChange={e=>setHood(e.target.value)} style={{ padding:"12px 14px", background:"#F0EBE1", border:"1.5px solid #E2D9CC", borderRadius:12, fontSize:14, color:hood?"#2C2416":"#A8997E", fontFamily:"DM Sans,sans-serif", outline:"none", cursor:"pointer" }}>
            <option value="" disabled>Select neighborhood</option>
            {AMSTERDAM_HOODS.map(h=><option key={h} value={h}>{h}</option>)}
          </select>
          <div style={{ background:"#F0EBE1", border:"1.5px solid #E2D9CC", borderRadius:12, padding:"12px 14px" }}>
            <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Short bio..." style={{ width:"100%", border:"none", outline:"none", background:"transparent", fontSize:14, color:"#2C2416", fontFamily:"DM Sans,sans-serif", resize:"none", minHeight:70, boxSizing:"border-box" }}/>
          </div>
        </div>
        <button onClick={save} style={{ width:"100%", padding:"14px 0", background:"#3D6B35", color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer" }}>Save</button>
      </div>
    </div>
  );
}

export default function Root() {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("EN");
  const [dm, setDm] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session){ setUser(session.user); setAuthed(true); }
    });
    const { data:{ subscription } } = supabase.auth.onAuthStateChange((_,session)=>{
      if(session){ setUser(session.user); setAuthed(true); }
      else{ setUser(null); setAuthed(false); }
    });
    return ()=>subscription.unsubscribe();
  },[]);

  const handleLogout = async() => { await supabase.auth.signOut(); setAuthed(false); setUser(null); };

  if(!authed) return <Auth onLogin={(u)=>{ setUser(u); setAuthed(true); }} lang={lang} setLang={setLang}/>;
  return <App2 lang={lang} setLang={setLang} onLogout={handleLogout} dm={dm} setDm={setDm} verified={verified} setVerified={setVerified} user={user}/>;
}
