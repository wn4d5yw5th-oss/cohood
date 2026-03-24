import { useState, useEffect, useRef } from "react";
import { supabase } from './supabase';
import { saveComment, getComments } from './comments';
import { createPost, getPosts } from './posts';
import { sendMessage, getMessages } from './messages';
import { toggleLike, getLikes, getUserLikes } from './likes';
import { signUp, signIn, resetPassword } from './auth';
import CoHoodIntro from './CoHoodIntro';
import CoHoodOnboarding from './CoHoodOnboarding';




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

const Av = ({ ini, size=40, col=G, ver=false, imgUrl=null }) => (
  <span style={{ position:"relative", display:"inline-flex", flexShrink:0 }}>
    <span style={{ width:size, height:size, borderRadius:"50%", background:col, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.33, fontWeight:700, color:"#fff", fontFamily:"DM Sans,sans-serif", overflow:"hidden" }}>
      {imgUrl ? <img src={imgUrl} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : ini}
    </span>
    {ver && <span style={{ position:"absolute", bottom:-2, right:-2 }}><VerBadge size={size*.42}/></span>}
  </span>
);

const POSTS = { EN:[], NL:[] };

const TXT = {
  EN:{
    tagline:"Neighborhood Solidarity Platform",
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
    errPass:"Password must be at least 8 characters with uppercase, number and symbol",errPassMatch:"Passwords do not match",
    errHood:"Please select your neighborhood",
    offersList:["Translation","Cooking","Gardening","Transport","Repairs","Childcare","Other"],
    referralTitle:"Refer a neighbor, earn 200 Co-Points",
    referralNote:"Points are awarded after your neighbor's ID verification.",
    referralCopy:"Copy",
    termsText:"I agree to the ",
    termsLink:"Terms & Conditions",
    termsError:"Please accept the terms to continue.",
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
    errPass:"Wachtwoord moet minimaal 8 tekens, hoofdletter, cijfer en symbool bevatten",errPassMatch:"Wachtwoorden komen niet overeen",
    errHood:"Kies je buurt",
    offersList:["Vertaling","Koken","Tuinieren","Vervoer","Reparaties","Kinderopvang","Anders"],
    referralTitle:"Verwijs een buur, verdien 200 Co-Points",
    referralNote:"Punten worden toegekend na ID-verificatie van je buur.",
    referralCopy:"Kopiëren",
    termsText:"Ik ga akkoord met de ",
    termsLink:"Gebruiksvoorwaarden",
    termsError:"Accepteer de voorwaarden om door te gaan.",
  },
};

const TCAT = { help:{color:R,bg:RL}, event:{color:G,bg:GL}, announce:{color:BL,bg:BLL} };
const CAT_ICONS = {
  "Repair":"tool","Shopping":"bag","Transport":"car","Childcare":"baby","Garden":"leaf","Cooking":"star","Translation":"globe","Other":"msg",
"Reparatie":"tool","Boodschappen":"bag","Vervoer":"car","Kinderopvang":"baby","Tuin":"leaf","Koken":"star","Vertaling":"globe","Anders":"msg"
};

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

function VerifyModal({ t, dm, onClose, onVerified, user, profile }) {
  const [step, setStep] = useState("intro");
  const [why, setWhy] = useState(false);
  const [idFile, setIdFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [phone, setPhone] = useState(profile?.phone||"");
  const [loading, setLoading] = useState(false);

  const bg = dm?"#232018":"#fff";
  const ink = dm?"#EDE7D9":"#2C2416";
  const mid = dm?"#9A8E7A":"#6B5E4E";
  const bdr = dm?"#33291E":"#E2D9CC";
  const warm = dm?"#2C2820":"#F0EBE1";

  const handleFile = (file, type) => {
    if(!file) return;
    const reader = new FileReader();
    reader.onload = e => type==='id' ? setIdPreview(e.target.result) : setSelfiePreview(e.target.result);
    reader.readAsDataURL(file);
    type==='id' ? setIdFile(file) : setSelfieFile(file);
  };

  const submit = async() => {
    if(!phone.trim()){ alert("Please enter your phone number"); return; }
    if(!idFile||!selfieFile){ alert("Please upload both ID card and selfie"); return; }
    setLoading(true);
    try {
      const uid = user?.id;
      const idExt = idFile.name.split('.').pop();
      const selfieExt = selfieFile.name.split('.').pop();
      const idPath = `${uid}/id_${Date.now()}.${idExt}`;
      const selfiePath = `${uid}/selfie_${Date.now()}.${selfieExt}`;
      await supabase.storage.from('verifications').upload(idPath, idFile, {upsert:true});
      await supabase.storage.from('verifications').upload(selfiePath, selfieFile, {upsert:true});
      const {data:{publicUrl:idUrl}} = supabase.storage.from('verifications').getPublicUrl(idPath);
      const {data:{publicUrl:selfieUrl}} = supabase.storage.from('verifications').getPublicUrl(selfiePath);
      await supabase.from('profiles').update({
        verification_status:'pending',
        id_photo_url: idUrl,
        selfie_url: selfieUrl,
        phone: phone||null
      }).eq('id', uid);
      setStep("pending");
    } catch(e) {
      alert("Upload failed, please try again");
    }
    setLoading(false);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-end", justifyContent:"center", backdropFilter:"blur(4px)" }} onClick={onClose}>
      <div style={{ background:bg, borderRadius:"20px 20px 0 0", width:"100%", maxWidth:480, maxHeight:"90vh", overflowY:"auto", padding:"8px 20px 40px", fontFamily:"DM Sans,sans-serif" }} onClick={e=>e.stopPropagation()}>
        <div style={{ width:36, height:4, background:bdr, borderRadius:2, margin:"14px auto 20px" }}/>

        {step==="intro"&&(
          <div>
            <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
              <div style={{ width:48, height:48, background:GL, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon n="shield" size={24} color={G}/>
              </div>
              <div>
                <div style={{ fontSize:17, fontWeight:700, color:ink }}>{t.verTitle}</div>
                <div style={{ fontSize:13, color:mid, marginTop:2 }}>{t.verSub}</div>
              </div>
            </div>
            <button onClick={()=>setWhy(!why)} style={{ width:"100%", padding:"11px 14px", background:warm, border:"1px solid "+bdr, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", marginBottom:4 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Icon n="info" size={15} color={G}/>
                <span style={{ fontSize:13, fontWeight:600, color:ink }}>{t.verWhy}</span>
              </div>
              <Icon n={why?"chevronDown":"chevronRight"} size={15} color={mid}/>
            </button>
            {why&&(
              <div style={{ background:GL, borderRadius:"0 0 12px 12px", padding:"12px 14px", marginBottom:12 }}>
                <p style={{ margin:0, fontSize:13, color:G, lineHeight:1.6 }}>{t.verWhyTxt}</p>
              </div>
            )}
            <div style={{ display:"flex", flexDirection:"column", gap:12, margin:"16px 0 20px" }}>
              {[[1,"shield",t.verS1,t.verS1d],[2,"camera",t.verS2,t.verS2d],[3,"check",t.verS3,t.verS3d]].map(([num,icon,title,desc])=>(
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
              <Icon n="shield" size={16} color="#fff"/> {t.verStart}
            </button>
            <button onClick={onClose} style={{ width:"100%", padding:"12px 0", background:"transparent", border:"none", color:mid, fontSize:14, cursor:"pointer", marginTop:8 }}>{t.verSkip}</button>
          </div>
        )}

        {step==="upload"&&(
          <div>
            <div style={{ fontSize:17, fontWeight:700, color:ink, marginBottom:6 }}>{t.verTitle}</div>
            <div style={{ fontSize:13, color:mid, marginBottom:16 }}>Upload your documents to verify your identity.</div>

            {/* Phone */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:12, fontWeight:700, color:mid, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Phone number </div>
              <div style={{ display:"flex", alignItems:"center", gap:10, background:warm, border:"1.5px solid "+bdr, borderRadius:12, padding:"11px 14px" }}>
                <Icon n="msg" size={15} color={mid}/>
                <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+31 6 12345678" style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:14, color:ink, fontFamily:"DM Sans,sans-serif" }}/>
              </div>
            </div>

            {/* ID Upload */}
            <label style={{ display:"block", marginBottom:10 }}>
              <input type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0],'id')}/>
              <div style={{ border:"2px dashed "+(idFile?G:bdr), borderRadius:14, padding:"20px 16px", textAlign:"center", cursor:"pointer", background:idFile?GL:"transparent", transition:"all .2s" }}>
                {idPreview ? (
                  <img src={idPreview} alt="" style={{ width:"100%", maxHeight:140, objectFit:"cover", borderRadius:8 }}/>
                ):(
                  <div>
                    <Icon n="shield" size={26} color="#A8997E"/>
                    <div style={{ fontSize:14, fontWeight:600, color:ink, marginTop:8 }}>{t.verUpId}</div>
                    <div style={{ fontSize:12, color:mid, marginTop:4 }}>{t.verS1d}</div>
                  </div>
                )}
              </div>
            </label>

            {/* Selfie Upload */}
            <label style={{ display:"block", marginBottom:20 }}>
              <input type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0],'selfie')}/>
              <div style={{ border:"2px dashed "+(selfieFile?G:bdr), borderRadius:14, padding:"20px 16px", textAlign:"center", cursor:"pointer", background:selfieFile?GL:"transparent", transition:"all .2s" }}>
                {selfiePreview ? (
                  <img src={selfiePreview} alt="" style={{ width:"100%", maxHeight:140, objectFit:"cover", borderRadius:8 }}/>
                ):(
                  <div>
                    <Icon n="camera" size={26} color="#A8997E"/>
                    <div style={{ fontSize:14, fontWeight:600, color:ink, marginTop:8 }}>{t.verUpSelf}</div>
                    <div style={{ fontSize:12, color:mid, marginTop:4 }}>{t.verS2d}</div>
                  </div>
                )}
              </div>
            </label>

            <button onClick={submit} disabled={loading||!idFile||!selfieFile} style={{ width:"100%", padding:"14px 0", background:idFile&&selfieFile?G:"#ccc", color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:idFile&&selfieFile?"pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {loading ? <div style={{ width:20, height:20, border:"3px solid #fff", borderTopColor:"transparent", borderRadius:"50%", animation:"spin .8s linear infinite" }}/> : <><Icon n="shield" size={16} color="#fff"/> {t.verStart}</>}
            </button>
          </div>
        )}

        {step==="pending"&&(
          <div style={{ textAlign:"center", padding:"48px 0" }}>
            <div style={{ width:60, height:60, borderRadius:"50%", background:warm, border:"2px solid "+bdr, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <div style={{ width:24, height:24, border:"3px solid "+G, borderTopColor:"transparent", borderRadius:"50%", animation:"spin .8s linear infinite" }}/>
            </div>
            <div style={{ fontSize:17, fontWeight:700, color:ink }}>{t.verPend}</div>
            <div style={{ fontSize:13, color:mid, marginTop:8, lineHeight:1.6 }}>{t.verPendTxt}</div>
            <div style={{ fontSize:12, color:mid, marginTop:12, background:warm, borderRadius:12, padding:"12px 16px" }}>
              Your documents have been submitted. Our team will review and approve within 24 hours.
            </div>
            <button onClick={onClose} style={{ marginTop:20, padding:"12px 24px", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:14, fontWeight:700, cursor:"pointer" }}>Done</button>
          </div>
        )}
      </div>
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
    </div>
  );
}

const Wrap = ({ children }) => (
    <div style={{ minHeight:"100vh", background:"#F7F4EF", fontFamily:"DM Sans,sans-serif", width:"100%", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column", position:"relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>
      {children}
      <div style={{ textAlign:"center", padding:"24px 0 8px", fontSize:11, color:"#A8997E", letterSpacing:1 }}>
  © 2026 CoHood · Amsterdam · All rights reserved
</div>
    </div>
  );

  const LangPicker = ({ lang, setLang }) => {
  const [langOpen, setLangOpen] = useState(false);
  return (
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
};

  const Logo = ({ tagline }) => (
  <div style={{ background:"linear-gradient(160deg,#F0EBE1,#E8E0D0)", height:"200px", padding:"0 32px", position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
    {[[160,-40,120,.06],[280,60,80,.04],[-20,40,60,.05]].map(([x,y,s,o],i)=>(
      <div key={i} style={{ position:"absolute", left:x, top:y, width:s, height:s, borderRadius:"50%", background:"rgba(61,107,53,"+o+")" }}/>
    ))}
    <div style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:6 }}>
      <img src="/CoHoodLogo.png" alt="CoHood" style={{ width:"80%", maxWidth:"350px", height:"150px", objectFit:"contain" }}/>
      <div style={{ color:"#6B5E4E", fontSize:15 }}>{tagline}</div>
    </div>
  </div>
);

  const TabSwitch = ({ active, onSwitch, loginLabel, registerLabel }) => (
  <div style={{ display:"flex", background:"#F0EBE1", borderRadius:12, padding:4, marginBottom:20, border:"1px solid #E2D9CC" }}>
    {[["login",loginLabel],["register",registerLabel]].map(([m,lbl])=>(
      <button key={m} onClick={()=>onSwitch(m)} style={{ flex:1, padding:"10px 0", borderRadius:9, border:"none", cursor:"pointer", background:active===m?"#fff":"transparent", color:active===m?"#2C2416":"#6B5E4E", fontWeight:active===m?700:500, fontSize:14, fontFamily:"DM Sans,sans-serif", transition:"all .2s" }}>{lbl}</button>
    ))}
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
  const [code, setCode] = useState(["","","","","",""]);
  const [onbStep, setOnbStep] = useState(0);
  const [offers, setOffers] = useState([]);
  const [offerOther, setOfferOther] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  

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
    if (!pass||pass.length<8) { alert(t.errPass); return; }
const hasUpper = /[A-Z]/.test(pass);
const hasNumber = /[0-9]/.test(pass);
const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass);
if (!hasUpper || !hasNumber || !hasSymbol) {
  alert(lang==="NL" ? "Wachtwoord moet minimaal 8 tekens, een hoofdletter, een cijfer en een symbool bevatten." : "Password must be at least 8 characters and include an uppercase letter, a number, and a symbol.");
  return;
}
    if (pass!==pass2) { alert(t.errPassMatch); return; }
    if (!hood) { alert(t.errHood); return; }
    if (!termsAccepted) { alert(t.termsError); return; }
    setLoading(true);
    const { error } = await signUp(email, pass, name, hood, referralCode.trim());
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



  if (screen==="login") return (
    <Wrap>
      <LangPicker lang={lang} setLang={setLang}/>
      <Logo tagline={t.tagline}/>
      <div style={{ flex:1, padding:"24px 24px 40px" }}>
        <TabSwitch active="login" onSwitch={setScreen} loginLabel={t.login} registerLabel={t.register}/>
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
      <LangPicker lang={lang} setLang={setLang}/>
      <Logo tagline={t.tagline}/>
      <div style={{ flex:1, padding:"24px 24px 40px" }}>
        <TabSwitch active="register" onSwitch={setScreen} loginLabel={t.login} registerLabel={t.register}/>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <InputField icon="user" ph={t.namePh} val={name} onChange={e=>setName(e.target.value)}/>
          <InputField icon="mail" ph={t.emailPh} val={email} onChange={e=>setEmail(e.target.value)}/>
          <InputField icon="lock" ph={t.passPh} val={pass} onChange={e=>setPass(e.target.value)} isPass/>
          <InputField icon="lock" ph={t.confirmPh} val={pass2} onChange={e=>setPass2(e.target.value)} isPass/>
          <InputField icon="users" ph="Referral code (optional)" val={referralCode} onChange={e=>setReferralCode(e.target.value.toUpperCase())}/>
         
          <select value={hood} onChange={e=>setHood(e.target.value)} style={{ padding:"12px 14px", background:"#F0EBE1", border:"1.5px solid #E2D9CC", borderRadius:12, fontSize:14, color:hood?"#2C2416":"#A8997E", fontFamily:"DM Sans,sans-serif", outline:"none", cursor:"pointer" }}>
            <option value="" disabled>{t.hoodPh}</option>
            {AMSTERDAM_HOODS.map(h=><option key={h} value={h}>{h}</option>)}
          </select>

 <div style={{ display:"flex", alignItems:"center", gap:10, padding:"4px 0" }}>
  <input type="checkbox" id="terms" checked={termsAccepted} onChange={e=>setTermsAccepted(e.target.checked)} style={{ width:18, height:18, cursor:"pointer", accentColor:G }}/>
  <label htmlFor="terms" style={{ fontSize:13, color:"#6B5E4E", fontFamily:"DM Sans,sans-serif" }}>
    {t.termsText}
    <button onClick={()=>setShowTerms(true)} style={{ background:"none", border:"none", color:G, fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"DM Sans,sans-serif", padding:0 }}>{t.termsLink}</button>
  </label>
</div>

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

{showTerms && (
  <div style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(0,0,0,.5)", display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={()=>setShowTerms(false)}>
    <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", width:"100%", maxWidth:480, padding:"20px 24px 40px", maxHeight:"80vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
      <div style={{ width:36, height:4, background:"#E2D9CC", borderRadius:2, margin:"0 auto 20px" }}/>
      <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:20, fontWeight:700, color:"#2C2416", margin:"0 0 16px" }}>Terms & Conditions</h2>
<p style={{ fontSize:13, color:"#6B5E4E", lineHeight:1.8, marginBottom:16 }}>Welcome to CoHood. By creating an account and using this platform, you agree to be bound by the following terms and conditions. Please read them carefully.</p>

<p style={{ fontSize:13, fontWeight:700, color:"#2C2416", marginBottom:4 }}>1. Eligibility</p>
<p style={{ fontSize:13, color:"#6B5E4E", lineHeight:1.8, marginBottom:12 }}>You must be at least 18 years old to use CoHood. Each person may only hold one account. Creating multiple accounts is strictly prohibited and may result in permanent suspension.</p>

<p style={{ fontSize:13, fontWeight:700, color:"#2C2416", marginBottom:4 }}>2. Community Standards</p>
<p style={{ fontSize:13, color:"#6B5E4E", lineHeight:1.8, marginBottom:12 }}>CoHood is built on trust and mutual respect. All members must treat each other with dignity. Harassment, hate speech, discriminatory behavior, spam, or commercial advertising is strictly prohibited and will result in immediate removal.</p>

<p style={{ fontSize:13, fontWeight:700, color:"#2C2416", marginBottom:4 }}>3. Identity Verification</p>
<p style={{ fontSize:13, color:"#6B5E4E", lineHeight:1.8, marginBottom:12 }}>To ensure community safety, members may be required to verify their identity using a valid government-issued ID. Providing false or misleading information during verification is strictly prohibited and constitutes grounds for permanent account termination.</p>

<p style={{ fontSize:13, fontWeight:700, color:"#2C2416", marginBottom:4 }}>4. Privacy & Data</p>
<p style={{ fontSize:13, color:"#6B5E4E", lineHeight:1.8, marginBottom:12 }}>We collect only the data necessary to provide our service, including your name, email address, neighborhood, profile photo, and verification documents. Your data is stored securely on EU-based servers (Supabase). CoHood complies with the General Data Protection Regulation (GDPR). Your data may be used to improve the platform and user experience. You may request deletion of your account and associated data at any time by contacting us.</p>

<p style={{ fontSize:13, fontWeight:700, color:"#2C2416", marginBottom:4 }}>5. Content Responsibility</p>
<p style={{ fontSize:13, color:"#6B5E4E", lineHeight:1.8, marginBottom:12 }}>You are solely responsible for the content you post on CoHood. You may not post illegal, harmful, misleading, or offensive content. CoHood reserves the right to remove any content that violates these terms without prior notice.</p>

<p style={{ fontSize:13, fontWeight:700, color:"#2C2416", marginBottom:4 }}>6. Co-Points</p>
<p style={{ fontSize:13, color:"#6B5E4E", lineHeight:1.8, marginBottom:12 }}>Co-Points are earned through genuine community participation. CoHood reserves the right to modify the value, earning rules, and redemption options of Co-Points at any time as the platform evolves. In cases of fraud or manipulation, all Co-Points associated with the offending account may be permanently revoked. Co-Points are non-transferable between accounts.</p>

<p style={{ fontSize:13, fontWeight:700, color:"#2C2416", marginBottom:4 }}>7. Account Suspension</p>
<p style={{ fontSize:13, color:"#6B5E4E", lineHeight:1.8, marginBottom:12 }}>CoHood reserves the right to suspend or permanently terminate any account that violates these terms, without prior warning. Suspended accounts forfeit all accumulated Co-Points. Appeals may be submitted via email.</p>

<p style={{ fontSize:13, fontWeight:700, color:"#2C2416", marginBottom:4 }}>8. Disclaimer of Liability</p>
<p style={{ fontSize:13, color:"#6B5E4E", lineHeight:1.8, marginBottom:12 }}>CoHood is a community platform and does not mediate, guarantee, or take responsibility for interactions, agreements, or disputes between members. Any help, services, or exchanges arranged through the platform are solely between the participating members. CoHood is not liable for any damages, losses, or injuries arising from such interactions.</p>

<p style={{ fontSize:13, fontWeight:700, color:"#2C2416", marginBottom:4 }}>9. Platform Availability</p>
<p style={{ fontSize:13, color:"#6B5E4E", lineHeight:1.8, marginBottom:12 }}>CoHood does not guarantee uninterrupted access to the platform. We reserve the right to modify, suspend, or discontinue any part of the service at any time without liability.</p>

<p style={{ fontSize:13, fontWeight:700, color:"#2C2416", marginBottom:4 }}>10. Changes to These Terms</p>
<p style={{ fontSize:13, color:"#6B5E4E", lineHeight:1.8, marginBottom:24 }}>CoHood may update these Terms & Conditions at any time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify users of significant changes where possible.</p>
      <button onClick={()=>setShowTerms(false)} style={{ width:"100%", padding:"13px 0", background:"#3D6B35", color:"#fff", border:"none", borderRadius:14, fontSize:14, fontWeight:700, cursor:"pointer" }}>Close</button>
    </div>
  </div>
)}

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
        <button onClick={async()=>{ const {error}=await supabase.auth.verifyOtp({email,token:code.join(""),type:"signup"}); if(error) alert(error.message); else setScreen("profile"); }} style={{ width:"100%", padding:"14px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", marginBottom:16 }}>{t.verifyBtn}</button>
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
function CoSpotsCanvas(){
  const ref = useRef(null);
  useEffect(()=>{
    const canvas = ref.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const NODES = [
      {x:.50,y:.45},{x:.50,y:.28},{x:.65,y:.32},{x:.70,y:.45},{x:.65,y:.58},{x:.50,y:.63},{x:.35,y:.58},{x:.30,y:.45},{x:.35,y:.32},
      {x:.50,y:.14},{x:.68,y:.18},{x:.78,y:.32},{x:.82,y:.48},{x:.75,y:.63},{x:.60,y:.74},{x:.50,y:.77},{x:.40,y:.74},{x:.25,y:.63},{x:.18,y:.48},{x:.22,y:.32},{x:.32,y:.18},
      {x:.50,y:.04},{x:.72,y:.08},{x:.88,y:.20},{x:.94,y:.42},{x:.86,y:.68},{x:.65,y:.84},{x:.50,y:.88},{x:.35,y:.84},{x:.14,y:.68},{x:.06,y:.42},{x:.12,y:.20},{x:.28,y:.08},
      {x:.58,y:.22},{x:.74,y:.38},{x:.72,y:.56},{x:.56,y:.70},{x:.42,y:.70},{x:.28,y:.56},{x:.26,y:.38},{x:.42,y:.22},
    ];
    const EDGES = [
      [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],
      [1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,1],
      [1,9],[2,33],[2,10],[3,11],[3,34],[4,12],[4,35],[5,13],[5,36],[6,14],[6,37],[7,15],[7,38],[7,16],[8,39],[8,17],[1,40],[8,41],
      [9,10],[10,11],[11,12],[12,13],[13,14],[14,15],[15,16],[16,17],[17,18],[18,19],[19,20],[20,9],
      [9,21],[10,22],[11,23],[12,24],[13,25],[14,26],[15,27],[16,28],[17,29],[18,30],[19,31],[20,32],
      [21,22],[22,23],[23,24],[25,26],[26,27],[27,28],[29,30],[30,31],[31,32],[32,21],
      [33,34],[34,35],[35,36],[36,37],[37,38],[38,39],[39,40],[40,41],[41,33],
    ];
    const state = NODES.map(()=>({ green:0, timer:Math.random()*600, speed:0.004+Math.random()*0.003 }));
    let raf;
    const draw = ()=>{
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const W=canvas.width, H=canvas.height, oy=-H*0.04;
      ctx.clearRect(0,0,W,H);
      state.forEach((s)=>{ s.timer--; if(s.timer<=0){s.green=1;s.timer=500+Math.random()*800;} if(s.green>0)s.green-=s.speed; if(s.green<0)s.green=0; });
      EDGES.forEach(([ai,bi])=>{ if(ai>=NODES.length||bi>=NODES.length)return; const a=NODES[ai],b=NODES[bi]; const ax=a.x*W,ay=oy+a.y*H,bx=b.x*W,by=oy+b.y*H; const g=Math.max(state[ai].green,state[bi].green); ctx.beginPath(); ctx.moveTo(ax,ay); ctx.quadraticCurveTo((ax+bx)/2,(ay+by)/2,bx,by); ctx.strokeStyle=g>0.05?`rgba(61,107,53,${0.04+g*0.10})`:'rgba(44,36,22,0.055)'; ctx.lineWidth=g>0.05?1:0.7; ctx.stroke(); });
      NODES.forEach((n,i)=>{ const x=n.x*W,y=oy+n.y*H,g=state[i].green; if(g>0.05){ctx.beginPath();ctx.arc(x,y,2+g*6,0,Math.PI*2);ctx.fillStyle=`rgba(61,107,53,${g*0.08})`;ctx.fill();} ctx.beginPath();ctx.arc(x,y,g>0.05?2.2:1.4,0,Math.PI*2);ctx.fillStyle=g>0.05?`rgba(61,107,53,${0.18+g*0.28})`:'rgba(44,36,22,0.1)';ctx.fill(); });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return ()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.5 }}/>;
}

function CoCommonsCanvas(){
  const ref = useRef(null);
  useEffect(()=>{
    const canvas = ref.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const PARTICLE_COUNT=28;
    const particles=[];
    function mkParticle(){ const angle=Math.random()*Math.PI*2; const dist=0.3+Math.random()*0.45; return {angle,dist,speed:0.0003+Math.random()*0.0004,shrink:0.0008+Math.random()*0.0006,size:1+Math.random()*1.5,alpha:0.05+Math.random()*0.1,amber:Math.random()>0.6}; }
    for(let i=0;i<PARTICLE_COUNT;i++) particles.push(mkParticle());
    const RINGS=[0.12,0.22,0.34];
    let raf;
    const draw=()=>{
      canvas.width=canvas.offsetWidth||window.innerWidth;
      canvas.height=canvas.offsetHeight||window.innerHeight;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const W=canvas.width,H=canvas.height,cx=W*0.5,cy=H*0.46,base=Math.min(W,H);
      RINGS.forEach((r,i)=>{ ctx.beginPath(); ctx.arc(cx,cy,base*r,0,Math.PI*2); ctx.strokeStyle=`rgba(186,117,23,${0.04+i*0.015})`; ctx.lineWidth=0.6; ctx.stroke(); });
      particles.forEach((p,i)=>{
        p.angle+=p.speed; p.dist-=p.shrink*0.015;
        if(p.dist<0.02){ particles[i]=mkParticle(); return; }
        const x=cx+Math.cos(p.angle)*base*p.dist;
        const y=cy+Math.sin(p.angle)*base*p.dist*0.55;
        const tx=cx+Math.cos(p.angle-0.08)*base*(p.dist+0.015);
        const ty=cy+Math.sin(p.angle-0.08)*base*(p.dist+0.015)*0.55;
        ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(x,y);
        ctx.strokeStyle=p.amber?`rgba(186,117,23,${p.alpha*0.9})`:`rgba(44,36,22,${p.alpha*0.5})`;
        ctx.lineWidth=p.size*0.6; ctx.stroke();
        ctx.beginPath(); ctx.arc(x,y,p.size,0,Math.PI*2);
        ctx.fillStyle=p.amber?`rgba(186,117,23,${p.alpha*1.4})`:`rgba(44,36,22,${p.alpha})`;
        ctx.fill();
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.5 }}/>;
}

function EventStarsCanvas(){
  const ref = useRef(null);
  useEffect(()=>{
    const canvas = ref.current; if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = ()=>{ canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight; };
    resize();
    const COLORS=['rgba(255,220,100,','rgba(160,230,160,','rgba(180,200,255,','rgba(255,180,180,','rgba(200,255,220,'];
    const stars = Array.from({length:30},()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.3+.4,a:Math.random()*.35,da:(Math.random()*.005+.002)*(Math.random()>.5?1:-1),col:COLORS[Math.floor(Math.random()*COLORS.length)]}));
    let shooting={active:false,x:0,y:0,vx:0,vy:0,a:0};
    const launch=()=>{ shooting={active:true,x:Math.random()*canvas.width*.5,y:Math.random()*canvas.height*.3,vx:2.5+Math.random()*2,vy:1+Math.random()*1.5,a:1}; };
    const interval = setInterval(launch, 5500);
    let raf;
    const draw=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      stars.forEach(s=>{ s.a+=s.da; if(s.a>.38||s.a<.03)s.da*=-1; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle=s.col+s.a+')'; ctx.fill(); });
      if(shooting.active){ shooting.x+=shooting.vx; shooting.y+=shooting.vy; shooting.a-=0.025; const tx=shooting.x-shooting.vx*20,ty=shooting.y-shooting.vy*20; const grad=ctx.createLinearGradient(tx,ty,shooting.x,shooting.y); grad.addColorStop(0,'rgba(255,255,255,0)'); grad.addColorStop(1,`rgba(255,255,255,${Math.max(0,shooting.a)})`); ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(shooting.x,shooting.y); ctx.strokeStyle=grad; ctx.lineWidth=1.5; ctx.stroke(); if(shooting.a<=0||shooting.x>canvas.width||shooting.y>canvas.height)shooting.active=false; }
      raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{ cancelAnimationFrame(raf); clearInterval(interval); };
  },[]);
  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}/>;
}

function EventBlobCanvas(){
  const ref=useRef(null);
  useEffect(()=>{
    const canvas=ref.current; if(!canvas) return;
    const ctx=canvas.getContext('2d');
    const blobs=Array.from({length:8},()=>({x:Math.random()*300,y:Math.random()*200,r:35+Math.random()*55,a:0.07+Math.random()*0.07,da:(Math.random()*.003+.001)*(Math.random()>.5?1:-1),dx:(Math.random()-.5)*.2,dy:(Math.random()-.5)*.15}));
    let raf;
    const draw=()=>{
      canvas.width=canvas.offsetWidth||300; canvas.height=canvas.offsetHeight||180;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#EBF3E8'; ctx.fillRect(0,0,canvas.width,canvas.height);
      blobs.forEach(b=>{
        b.x+=b.dx; b.y+=b.dy; b.a+=b.da;
        if(b.a>.14||b.a<.03)b.da*=-1;
        if(b.x<-b.r)b.x=canvas.width+b.r; if(b.x>canvas.width+b.r)b.x=-b.r;
        if(b.y<-b.r)b.y=canvas.height+b.r; if(b.y>canvas.height+b.r)b.y=-b.r;
        const g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);
        g.addColorStop(0,`rgba(61,107,53,${b.a})`); g.addColorStop(1,'rgba(61,107,53,0)');
        ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}/>;
}

function EventFeedCard({ ev, userId, attending, attendees, onAttend, onCancel, eventAttendeesMap, lang }){
  const evDate = new Date(ev.event_date);
  const dateStr = evDate.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
  const timeStr = evDate.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',hour12:true});
  const joining = attending?.status==='joining';
  const cantgo  = attending?.status==='cant';
  const joiningAttendees = (attendees||[]).filter(a=>a.status==='joining');
  const isOrganizer = ev.user_id === userId;
  const [showMenu, setShowMenu] = useState(false);
  const typeIcons = {"Urban Farming":"leaf","Neighborhood Clean":"sun","Tea Meetup":"msg","Workshop":"star","Celebration":"bell","Other":"info","Stadslandbouw":"leaf","Buurtschoonmaak":"sun","Thee bijeenkomst":"msg","Feest":"bell","Overig":"info"};

  return (
    <div style={{ position:"relative", borderRadius:14, overflow:"hidden", border:"1.5px solid #b8d4b0", marginBottom:12 }}>
      <EventBlobCanvas/>
      <div style={{ position:"relative", zIndex:1, padding:"11px 14px", background:"rgba(235,243,232,0.65)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8, position:"relative" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#3D6B35", borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:700, color:"#fff" }}>
            <Icon n={typeIcons[ev.type]||"leaf"} size={10} color="#fff"/> {ev.type}
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <span style={{ fontSize:12, fontWeight:700, color:"#2C2416" }}>{dateStr}</span>
            <span style={{ color:"#C8D8C4" }}>·</span>
            <span style={{ fontSize:11, fontWeight:600, color:"#3D6B35" }}>{timeStr}</span>
            {isOrganizer&&(
              <div style={{ position:"relative" }}>
                <button onClick={(e)=>{ e.stopPropagation(); setShowMenu(m=>!m); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#3D6B35", padding:"2px 4px", fontSize:14, lineHeight:1, fontWeight:700 }}>···</button>
                {showMenu&&(
                  <div style={{ position:"absolute", right:0, top:24, background:"#fff", border:"1px solid #E2D9CC", borderRadius:10, zIndex:50, minWidth:225, boxShadow:"0 4px 12px rgba(0,0,0,.08)" }}>
                    <button onClick={async(e)=>{ e.stopPropagation(); if(!window.confirm(lang==="NL"?"Als u dit evenement annuleert, verliest u 300 Co-Points. Weet u het zeker?":"Cancelling this event will cost you 300 Co-Points. Are you sure?")) return; await supabase.from('events').update({status:'cancelled'}).eq('id',ev.id); await supabase.from('notifications').insert((eventAttendeesMap[ev.id]||[]).filter(a=>a.status==='joining'&&a.user_id!==userId).map(a=>({ user_id:a.user_id, from_user_id:userId, from_user_name:ev.organizer_name, from_avatar_url:ev.organizer_avatar||null, type:'event_cancelled', post_id:String(ev.id), post_body:ev.title, read:false }))); setShowMenu(false); onCancel(ev.id); }} style={{ width:"100%", padding:"11px 14px", background:"none", border:"none", cursor:"pointer", fontSize:11, color:"#C44B1A", fontWeight:600, textAlign:"left", display:"flex", alignItems:"center", gap:8 }}>
                      <Icon n="alert" size={14} color="#C44B1A"/> Cancel Event (−300 Co-Points)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
          <span style={{ width:32, height:32, borderRadius:"50%", background:"#3D6B35", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff", flexShrink:0, overflow:"hidden" }}>
            {ev.organizer_avatar?<img src={ev.organizer_avatar} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>:(ev.organizer_name||'?')[0].toUpperCase()}
          </span>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:"#2C2416" }}>{ev.organizer_name}</div>
            <div style={{ fontSize:11, color:"#A8997E" }}>{ev.neighborhood} · {ev.time}</div>
          </div>
        </div>

        <div style={{ fontSize:14, fontWeight:700, color:"#2C2416", lineHeight:1.3, marginBottom:4 }}>{ev.title}</div>

        <div style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:"#6B5E4E", marginBottom:6 }}>
          <Icon n="mapPin" size={10} color="#3D6B35"/> {ev.location}
        </div>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:2 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:3, background:"#EBF3E8", border:"1px solid rgba(61,107,53,0.2)", borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:700, color:"#3D6B35" }}>
            <Icon n="star" size={10} color="#3D6B35" sw={2.5}/> {lang==="NL"?"Deelnemen · +200 Co-Points":"Join · +200 Co-Points"}
          </div>
          {joiningAttendees.length>0&&(
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ display:"flex" }}>
                {joiningAttendees.slice(0,4).map((a,i)=>(
                  <span key={a.id} style={{ width:18, height:18, borderRadius:"50%", border:"1.5px solid #fff", marginLeft:i===0?0:-4, background:"#3D6B35", display:"flex", alignItems:"center", justifyContent:"center", fontSize:7, fontWeight:700, color:"#fff", overflow:"hidden", flexShrink:0 }}>
                    {a.avatar_url?<img src={a.avatar_url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>:(a.user_name||'?')[0].toUpperCase()}
                  </span>
                ))}
              </div>
              <span style={{ fontSize:10, color:"#A8997E" }}>{joiningAttendees.length} {lang==="NL"?"aanwezig":"attending"}</span>
            </div>
          )}
        </div>

        {isOrganizer?(
          <div style={{ marginTop:8, padding:"7px 12px", background:"#EBF3E8", borderRadius:8, fontSize:12, color:"#3D6B35", fontWeight:600 }}>
            {lang==="NL"?"Jouw evenement · "+joiningAttendees.length+" aanwezig":"Your event · "+joiningAttendees.length+" attending"}
          </div>
        ):(
          <div style={{ display:"flex", gap:6, marginTop:8 }}>
            <button onClick={()=>onAttend('joining')} style={{ flex:1, padding:"7px 0", background:joining?"#2A5228":"#3D6B35", border:"none", borderRadius:8, fontSize:12, fontWeight:700, color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontFamily:"DM Sans,sans-serif" }}>
              <Icon n="check" size={11} color="#fff" sw={2.5}/>
              {joining?(lang==="NL"?"Aangemeld ✓":"Attending ✓"):(lang==="NL"?"Ik ga":"I'm attending")}
            </button>
            <button onClick={()=>onAttend('cant')} style={{ flex:1, padding:"7px 0", background:cantgo?"#fcebeb":"transparent", border:"1.5px solid "+(cantgo?"#f09595":"#C8D8C4"), borderRadius:8, fontSize:12, fontWeight:600, color:cantgo?"#A32D2D":"#6B5E4E", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontFamily:"DM Sans,sans-serif" }}>
              <Icon n="alert" size={11} color={cantgo?"#A32D2D":"#6B5E4E"}/>
              {cantgo?(lang==="NL"?"Niet aanwezig":"Not going"):(lang==="NL"?"Kan niet":"Can't go")}
            </button>
          </div>
        )}
      </div>
    </div>
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
  const [tierUpModal, setTierUpModal] = useState(null);
  const [adminAnnTitle, setAdminAnnTitle] = useState("");
  const [adminAnnBody, setAdminAnnBody] = useState("");
  const [adminAnnouncements, setAdminAnnouncements] = useState([]);
  useEffect(()=>{
  if(posts.length){
    [...posts,...realPosts].forEach(p=>{
      supabase.from("comments").select("*").eq("post_id",p.id).order("created_at").then(({data})=>{
        if(data&&data.length){ 
  const uids=[...new Set(data.map(c=>c.user_id).filter(Boolean))];
  supabase.from('profiles').select('id,avatar_url').in('id',uids).then(({data:profs})=>{
    const pm={};
    if(profs) profs.forEach(p=>pm[p.id]=p.avatar_url);
    setCmtList(prev=>({...prev,[p.id]:data.map(c=>({txt:c.content,name:c.full_name,ini:c.full_name?c.full_name[0]:"?",col:G,imgUrl:pm[c.user_id]||c.avatar_url}))}));
  });
}
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
  const [evAmPm, setEvAmPm] = useState("AM");
  const [evHour, setEvHour] = useState(null);
  const [evCalOpen, setEvCalOpen] = useState(false);
  const [evTimeOpen, setEvTimeOpen] = useState(false);
  const [evMonth, setEvMonth] = useState(new Date().getMonth());
  const [evYear, setEvYear] = useState(new Date().getFullYear());
  const [evDay, setEvDay] = useState(null);
  const [evName, setEvName] = useState("");
  const [evDate, setEvDate] = useState("");
  const [evLoc, setEvLoc] = useState("");
  const [success, setSuccess] = useState(null);
  const [langOpen, setLangOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [realPosts, setRealPosts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [neighborCount, setNeighborCount] = useState(0);
  const [neighborhoodPop, setNeighborhoodPop] = useState(0);
  const [realMessages, setRealMessages] = useState([]);
  const [convMessages, setConvMessages] = useState([]);
  const convEndRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [helpTab, setHelpTab] = useState("given");
  const [postMenu, setPostMenu] = useState(null);
  const [helpRequests, setHelpRequests] = useState([]);
  const [helpNotifCount, setHelpNotifCount] = useState(0);
  const [realEvents, setRealEvents] = useState([]);
  const [attendingMap, setAttendingMap] = useState({});
  const [eventAttendeesMap, setEventAttendeesMap] = useState({});
  const [confirmModal, setConfirmModal] = useState(null);

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
  setProfile(prev => {
    const prevPoints = prev?.points || 0;
    const newPoints = data?.points || 0;
    const getTier = (pts) => pts <= 500 ? 1 : pts <= 2500 ? 2 : pts <= 7500 ? 3 : pts <= 20000 ? 4 : pts <= 50000 ? 5 : pts <= 150000 ? 6 : 7;
    const prevTier = getTier(prevPoints);
    const newTier = getTier(newPoints);
    if (newTier > prevTier && prevPoints > 0) setTierUpModal(newTier);
    return data;
  });
      } else {
        // Profil yok, oluştur
        supabase.from("profiles").insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
          neighborhood: user.user_metadata?.neighborhood || "",
          verified: false
        }).then(()=>{
          setProfile({ full_name: user.user_metadata?.full_name || "", neighborhood: user.user_metadata?.neighborhood || "" });
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
  const fetchPosts = () => {
  if(!displayHood) return;
  getPosts(displayHood).then(({data})=>{
    if(data){
      const userIds = [...new Set(data.map(p=>p.user_id).filter(Boolean))];
      supabase.from("profiles").select("id,points").in("id",userIds).then(({data:profiles})=>{
        const ptsMap = {};
        if(profiles) profiles.forEach(pr=>ptsMap[pr.id]=pr.points||0);
        data.sort((a,b)=> (b.pinned?1:0) - (a.pinned?1:0));
        setRealPosts(data.map(p=>({
          id:p.id, user_id:p.user_id, type:p.type||"help", user:p.full_name||"User",
          ini:(p.full_name||"U")[0].toUpperCase(), ver:false,
          time: (() => { const diff = Math.floor((Date.now() - new Date(p.created_at).getTime()) / 60000); if(diff < 1) return "just now"; if(diff < 60) return diff + " min"; if(diff < 1440) return Math.floor(diff/60) + " hr"; return Math.floor(diff/1440) + " days"; })(),
          cat:p.category||"", icon:CAT_ICONS[p.category]||"tool",
          offer_category:p.offer_category||"",
          offer_icon:CAT_ICONS[p.offer_category]||"",
          body:p.body, offer:p.offer, likes:0, replies:0, pinned:p.pinned,
          urgent:p.urgent, hood:p.neighborhood,
          avatar_url:p.avatar_url,
          user_points: ptsMap[p.user_id] ?? p.user_points ?? 0
        })));
      });
      data.forEach(p=>{
        getLikes(p.id).then(count=>{ setLikeCounts(prev=>({...prev,[p.id]:count})); });
        supabase.from("comments").select("*").eq("post_id",String(p.id)).order("created_at").then(({data:c})=>{
          if(c&&c.length) setCmtList(prev=>({...prev,[p.id]:c.map(x=>({txt:x.content,name:x.full_name,ini:x.full_name?x.full_name[0]:"?",col:G,imgUrl:x.avatar_url}))}));
        });
      });
    }
  });
};

useEffect(()=>{
  if(displayHood){
    supabase.from('profiles').select('id', {count:'exact'}).eq('neighborhood', displayHood).then(({count})=>setNeighborCount(count||0));
    supabase.from('neighborhood_populations').select('population').eq('neighborhood', displayHood).then(({data})=>{ if(data&&data.length>0) setNeighborhoodPop(data[0].population); });
    supabase.from('announcements').select('*').eq('neighborhood', displayHood).order('created_at', {ascending:false}).then(({data})=>{ if(data) setAnnouncements(data); });
    supabase.from('admin_announcements').select('*').eq('neighborhood', displayHood).order('created_at', {ascending:false}).then(({data})=>{ if(data) setAdminAnnouncements(data); });
    fetchPosts();

    const channel = supabase.channel('posts-realtime-'+displayHood)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts', filter: 'neighborhood=eq.'+displayHood }, ()=>{
        fetchPosts();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }
},[profile?.neighborhood]);
useEffect(()=>{
  if(user?.id){
    getMessages(user.id).then(({data})=>{
      if(data){
        setRealMessages(data);
        setUnreadCount(data.filter(m=>m.receiver_id===user.id&&!m.read).length);
      }
    });
  }
},[user]);
useEffect(()=>{
  if(user?.id){
    supabase.from('notifications').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).then(({data})=>{
      if(data){ setNotifications(data); setNotifCount(data.filter(n=>!n.read).length); }
    });
  }
},[user]);
useEffect(()=>{
  if(user?.id){
    supabase.from('help_requests').select('*')
      .or('requester_id.eq.'+user.id+',helper_id.eq.'+user.id)
      .order('created_at',{ascending:false})
      .then(({data})=>{
        if(data){
          setHelpRequests(data);
          setHelpNotifCount(data.filter(r=>
  new Date(r.show_after) <= new Date() &&
  ((r.requester_id===user.id && !r.read_by_requester) ||
  (r.helper_id===user.id && !r.read_by_helper))
).length);
        }
      });
  }
},[user]);

useEffect(()=>{
  if(displayHood){
    supabase.from('events').select('*').eq('neighborhood',displayHood).eq('status','active').order('created_at',{ascending:false}).then(({data})=>{ if(data) setRealEvents(data); });
  }
},[profile?.neighborhood]);

useEffect(()=>{
  if(user?.id && realEvents.length>0){
    supabase.from('event_attendees').select('*').in('event_id',realEvents.map(e=>e.id)).then(({data})=>{
      if(data){
        const aMap={},eaMap={};
        data.forEach(a=>{
          if(a.user_id===user.id) aMap[a.event_id]={status:a.status,id:a.id,attendee_confirmed:a.attendee_confirmed};
          if(!eaMap[a.event_id]) eaMap[a.event_id]=[];
          eaMap[a.event_id].push(a);
        });
        setAttendingMap(aMap); setEventAttendeesMap(eaMap);
      }
    });
  }
},[realEvents,user?.id]);

useEffect(()=>{
  if(activeConv?.id){
    const otherId=activeConv.sender_id===user?.id?activeConv.receiver_id:activeConv.sender_id;
    supabase.from("messages").select("*").or("and(sender_id.eq."+user?.id+",receiver_id.eq."+otherId+"),and(sender_id.eq."+otherId+",receiver_id.eq."+user?.id+")").order("created_at").then(({data})=>{ if(data) setConvMessages(data); });
  }
},[activeConv]);
useEffect(()=>{
  convEndRef.current?.scrollIntoView({behavior:"smooth"});
},[convMessages]);

useEffect(()=>{
  if(!tierUpModal) return;
  const canvas = document.getElementById("confetti-canvas");
  if(!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const pieces = Array.from({length:120}, ()=>({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height - canvas.height,
    r: 6+Math.random()*6,
    d: 2+Math.random()*3,
    color: ["#3D6B35","#FFD700","#5A3A7A","#E05A1A","#2A5A8A"][Math.floor(Math.random()*5)],
    tilt: Math.random()*10-10,
    tiltAngle: 0,
    tiltSpeed: 0.1+Math.random()*0.1
  }));
  let rafId;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      p.tiltAngle += p.tiltSpeed;
      p.y += p.d;
      p.tilt = Math.sin(p.tiltAngle)*12;
      if(p.y > canvas.height) { p.y=-10; p.x=Math.random()*canvas.width; }
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x+p.tilt, p.y, p.r, p.r*0.4);
    });
    rafId = requestAnimationFrame(draw);
  }
  draw();
  return ()=>cancelAnimationFrame(rafId);
},[tierUpModal]);

  const displayIni = displayName[0]?.toUpperCase()||"U";

  const requireVer = (fn) => {
  if(verified || profile?.verification_status==='approved') fn();
  else if(profile?.verification_status==='pending'){
    alert(lang==="NL"?"Je verificatie wordt beoordeeld. Even geduld.":"Your verification is pending review. Please wait.");
  } else setShowVer(true);
};
  const doTranslate = async(id,body,offer) => {
  setTranslating(p=>({...p,[id]:true}));
  const srcLang = lang==="NL"?"nl":"en";
  const targetLang = lang==="NL"?"en":"nl";
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(body)}&langpair=nl|en`);
const data = await res.json();
let translatedBody = data.responseData.translatedText;
if(translatedBody.toLowerCase()===body.toLowerCase()){
  const res3 = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(body)}&langpair=en|nl`);
  const data3 = await res3.json();
  translatedBody = data3.responseData.translatedText;
}
let translatedOffer = offer;
if(offer){
  const res2 = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(offer)}&langpair=nl|en`);
  const data2 = await res2.json();
  translatedOffer = data2.responseData.translatedText;
}
setTranslated(p=>({...p,[id]:{body:translatedBody, offer:translatedOffer}}));
  } catch(e) {
    setTranslated(p=>({...p,[id]:{body:body+" [translated]", offer:offer}}));
  }
  setTranslating(p=>({...p,[id]:false}));
};
  const submitHelp = () => requireVer(async()=>{
  if(needCat===null){ alert(lang==="NL"?"Selecteer een categorie voor je hulpvraag":"Please select a category for your help request"); return; }
  if(!needTxt.trim()){ alert(lang==="NL"?"Beschrijf je hulpvraag":"Please describe what you need"); return; }
  if(offerCat===null){ alert(lang==="NL"?"Selecteer een categorie voor je aanbod":"Please select a category for your support offer"); return; }
  if(!offerTxt.trim()){ alert(lang==="NL"?"Beschrijf wat je kunt aanbieden":"Please describe what you can offer"); return; }
  await createPost(user?.id, displayName, displayHood, "help", t.helpCats[needCat]||"", needTxt, offerTxt, isUrgent, t.helpCats[offerCat]||"");
  setSuccess("help");
  setTimeout(()=>{ setSuccess(null); setTab("feed"); setNeedCat(null); setNeedTxt(""); setOfferCat(null); setOfferTxt(""); setIsUrgent(false); },2000);
});
const submitEv = () => requireVer(async()=>{
  const evTypes = lang==="NL"
    ? ["Stadslandbouw","Buurtschoonmaak","Thee bijeenkomst","Workshop","Feest","Overig"]
    : ["Urban Farming","Neighborhood Clean","Tea Meetup","Workshop","Celebration","Other"];
  if(evType===null){ alert(lang==="NL"?"Selecteer een type":"Please select an event type"); return; }
  if(!evName.trim()){ alert("Please enter an event name"); return; }
  if(!evDay){ alert("Please select a date"); return; }
  if(!evHour){ alert("Please select a time"); return; }
  if(!evLoc.trim()){ alert("Please enter a location"); return; }
  const h = evAmPm==="PM"&&evHour!==12?evHour+12:evAmPm==="AM"&&evHour===12?0:evHour;
  const eventDate = new Date(evYear,evMonth,evDay,h,0);
  const {data,error} = await supabase.from('events').insert({ user_id:user?.id, organizer_name:displayName, organizer_avatar:profile?.avatar_url||null, neighborhood:displayHood, type:evTypes[evType], title:evName, location:evLoc, event_date:eventDate.toISOString(), status:'active' }).select().single();
  
  if(!error&&data){
    
    setRealEvents(prev=>[{...data,time:"just now",hood:displayHood},...prev]);
  }
  setSuccess("ev");
  setTimeout(()=>{ setSuccess(null); setTab("feed"); setEvType(null); setEvName(""); setEvDate(""); setEvLoc(""); setEvDay(null); setEvHour(null); },2000);
});
  const handleEventAttend = async(eventId, status) => {
  const existing = attendingMap[eventId];
  if(existing){
    if(existing.status===status){
      await supabase.from('event_attendees').delete().eq('id',existing.id);
      setAttendingMap(prev=>{ const n={...prev}; delete n[eventId]; return n; });
      setEventAttendeesMap(prev=>({...prev,[eventId]:(prev[eventId]||[]).filter(a=>a.user_id!==user.id)}));
    } else {
      await supabase.from('event_attendees').update({status}).eq('id',existing.id);
      setAttendingMap(prev=>({...prev,[eventId]:{...prev[eventId],status}}));
      setEventAttendeesMap(prev=>({...prev,[eventId]:(prev[eventId]||[]).map(a=>a.user_id===user.id?{...a,status}:a)}));
    }
  } else {
    const {data, error} = await supabase.from('event_attendees').insert({ event_id:eventId, user_id:user.id, user_name:displayName, avatar_url:profile?.avatar_url||null, status }).select().single();
    if(error?.code==='23505'){
      const {data:ex} = await supabase.from('event_attendees').select('*').eq('event_id',eventId).eq('user_id',user.id).single();
      if(ex){ setAttendingMap(prev=>({...prev,[eventId]:{status:ex.status,id:ex.id,attendee_confirmed:false}})); }
    } else if(data){
      setAttendingMap(prev=>({...prev,[eventId]:{status,id:data.id,attendee_confirmed:false}}));
      setEventAttendeesMap(prev=>({...prev,[eventId]:[...(prev[eventId]||[]).filter(a=>a.user_id!==user.id),data]}));
    }
  }
};
const sendDm = async() => { if(dmText.trim()){ await sendMessage(user?.id, dmPost?.user_id||dmPost?.id, displayName, dmPost?.user||"User", dmPost?.id, dmText, profile?.avatar_url); if(dmPost?.user_id && dmPost?.user_id !== user?.id){const {data:hd, error:he} = await supabase.from('help_requests').insert({ post_id:String(dmPost?.id), post_body:dmPost?.body, requester_id:dmPost?.user_id, requester_name:dmPost?.user, helper_id:user?.id, helper_name:displayName, status:'pending', offer_body:dmPost?.offer, show_after: new Date(Date.now() + 12*60*60*1000).toISOString() }); } setDmSent(true); setTimeout(()=>{ setDmSent(false); setDmPost(null); setDmText(""); },1800); } };
const userHood = profile?.neighborhood || user?.user_metadata?.neighborhood;
const eventsAsPosts = realEvents.map(e=>({...e, isEvent:true, user:e.organizer_name, ini:(e.organizer_name||'E')[0].toUpperCase(), avatar_url:e.organizer_avatar, time:(()=>{ const diff=Math.floor((Date.now()-new Date(e.created_at).getTime())/60000); if(diff<1) return "just now"; if(diff<60) return diff+" min"; if(diff<1440) return Math.floor(diff/60)+" hr"; return Math.floor(diff/1440)+" days"; })(), hood:e.neighborhood, type:e.type }));
const allPosts = [...realPosts, ...eventsAsPosts, ...posts.filter(p=>p.hood===displayHood||p.hood==="All Neighborhood"||p.hood==="Hele Buurt")].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));   
const filtPosts = allPosts.filter(p=>{
  if(filter==="all") return true;
  if(filter==="help") return p.type==="help" && !p.isEvent;
  if(filter==="event") return p.isEvent || p.type==="event";
  return true;
});

  const NavBtn = ({ k, icon, label, badge }) => (
    <button onClick={()=>{ setTab(k); if(k==="messages"){ supabase.from("messages").update({read:true}).eq("receiver_id",user?.id).eq("read",false).then(()=>setUnreadCount(0)); } if(k==="profile"){
  supabase.from('help_requests').update({read_by_requester:true}).eq('requester_id',user?.id).then();
  supabase.from('help_requests').update({read_by_helper:true}).eq('helper_id',user?.id).then(()=>setHelpNotifCount(0));
} }} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"7px 0 8px", border:"none", background:"transparent", cursor:"pointer", color:tab===k?G:mid, position:"relative" }}>
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
    <div style={{ minHeight:"100vh", background:bg, fontFamily:"DM Sans,sans-serif", width:"100%", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>
      <div style={{ background:dm?"#1A1510":"#fff", borderBottom:"1px solid "+bdr, padding:"13px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <img src="/CoHoodLogo.png" alt="CoHood" style={{ height:30, width:"auto", objectFit:"contain" }}/> </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {verified&&(
            <div style={{ display:"flex", alignItems:"center", gap:5, background:GL, padding:"3px 10px", borderRadius:20 }}>
              <VerBadge size={14}/><span style={{ fontSize:11, fontWeight:700, color:G }}>{t.verBadge}</span>
            </div>
          )}
          <button onClick={()=>setTab("messages")} style={{ background:"none", border:"none", cursor:"pointer", color:mid, padding:4, position:"relative" }}>
  <Icon n="msg" size={18}/>
  {unreadCount>0&&<span style={{ position:"absolute", top:-4, right:-4, width:16, height:16, borderRadius:"50%", background:R, fontSize:9, fontWeight:700, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>{unreadCount}</span>}
</button>
          <button onClick={()=>setNotifOpen(!notifOpen)} style={{ background:"none", border:"none", cursor:"pointer", color:mid, padding:4, position:"relative" }}>
           <Icon n="bell" size={18}/>
           {notifCount>0&&<span style={{ position:"absolute", top:-4, right:-4, width:16, height:16, borderRadius:"50%", background:"#E53935", fontSize:9, fontWeight:700, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>{notifCount}</span>}
          </button>
          {notifOpen&&(
            <div style={{ position:"absolute", top:56, right:16, width:300, background:card, border:"1px solid "+bdr, borderRadius:16, boxShadow:"0 4px 20px rgba(0,0,0,.1)", zIndex:200, maxHeight:400, overflowY:"auto" }}>
              <div style={{ padding:"14px 16px", borderBottom:"1px solid "+bdr, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:15, fontWeight:700, color:ink }}>{t.notif||"Notifications"}</span>
                <button onClick={()=>{ supabase.from('notifications').delete().eq('user_id',user?.id).then(()=>{ setNotifications([]); setNotifCount(0); }); setNotifOpen(false); }} style={{ background:"none", border:"none", fontSize:11, color:G, cursor:"pointer", fontWeight:600 }}>Clear all</button>
            </div>
            {notifications.length===0?(
              <div style={{ padding:"24px 16px", textAlign:"center", color:mid, fontSize:13 }}>No notifications yet</div>
            ):notifications.map((n,i)=>(
              <div key={n.id} onClick={()=>{ setNotifOpen(false); setTab("feed"); }} style={{ display:"flex", gap:10, padding:"12px 16px", borderBottom:"1px solid "+bdr, cursor:"pointer", background:n.read?"transparent":GL }}>
                <Av ini={(n.from_user_name||"?")[0]} size={36} col={G} imgUrl={n.from_avatar_url}/>
                <div style={{ flex:1 }}>
                  <span style={{ fontSize:13, color:ink, fontWeight:600 }}>{n.from_user_name}</span>
                  <span style={{ fontSize:13, color:mid }}>
  {n.type==="likes"?" liked your post":
   n.type==="event_confirm_organizer"?" — confirm attendance for your event":
   n.type==="event_confirm_attendee"?" — did you attend this event?":
   n.type==="event_cancelled"?" cancelled an event you were attending":
   " commented on your post"}
</span>
                  <div style={{ fontSize:11, color:mid, marginTop:2 }}>{n.post_body?.substring(0,40)}...</div>
                </div>
              </div>
            ))}
          </div>
        )}
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
                <span style={{ fontSize:12, color:G, fontWeight:600 }}>{neighborCount} {t.neighbors}</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:16, alignItems:"center", flexWrap:"wrap" }}>
  {[["all",t.all],["help",t.helpF]].map(([k,lbl])=>(
  <button key={k} onClick={()=>setFilter(k)} style={{ padding:"6px 14px", borderRadius:20, border:"1.5px solid "+(filter==="event"||filter===k?filter===k?G:bdr:bdr), background:filter===k?G:"transparent", color:filter===k?"#fff":mid, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .2s" }}>{lbl}</button>
))}
<div onClick={()=>setFilter("event")} style={{ position:"relative", borderRadius:20, overflow:"hidden", cursor:"pointer" }}>
  <div style={{ position:"absolute", inset:0, background:filter==="event"?G:"#EBF3E8" }}/>
  <div style={{ position:"absolute", inset:0, background:"linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.15) 50%,transparent 60%)", animation:"shimmer 2.5s infinite" }}/>
  <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:6, padding:"7px 14px" }}>
    <div style={{ width:7, height:7, borderRadius:"50%", background:filter==="event"?"#fff":"#3D6B35", animation:"evPulse 1.4s infinite" }}/>
    <span style={{ fontSize:13, fontWeight:700, color:filter==="event"?"#fff":"#3D6B35", fontFamily:"DM Sans,sans-serif" }}>{t.eventF}</span>
    {realEvents.length>0&&<span style={{ background:filter==="event"?"rgba(255,255,255,0.2)":"rgba(61,107,53,0.15)", borderRadius:20, padding:"1px 6px", fontSize:10, fontWeight:700, color:filter==="event"?"#fff":"#3D6B35" }}>{realEvents.length}</span>}
  </div>
</div>
<style>{"@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}} @keyframes evPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}"}</style>
  {(()=>{
    const pct = neighborhoodPop>0 ? Math.max(1, Math.round((neighborCount/neighborhoodPop)*100)) : 1;
    const stages=[{pct:10,icon:"🌱",name:"Seedling"},{pct:25,icon:"🌿",name:"Sprout"},{pct:50,icon:"🌸",name:"Bloom"},{pct:75,icon:"🌾",name:"Harvest"},{pct:100,icon:"🏆",name:"Resilience Hub"}];
    const stage=stages.slice().reverse().find(s=>pct>=s.pct)||stages[0];
    return (
      <div style={{ marginLeft:"auto", display:"flex", flexDirection:"column", alignItems:"flex-start", gap:3, minWidth:120 }}>
  <span style={{ fontSize:10, color:mid, fontWeight:600, whiteSpace:"nowrap" }}>{stage.icon} {displayHood} · {stage.name} · {pct}%</span>
  <div style={{ width:"100%", height:5, background:"#D0CCC4", borderRadius:20, overflow:"hidden" }}>
    <div style={{ width:pct+"%", height:"100%", background:G, borderRadius:20 }}/>
  </div>
</div>
    );
  })()}
</div>

            {announcements.map((a)=>(
  <div key={a.id} style={{ position:"relative", marginBottom:12 }}>
  <div ref={el=>{
    if(el){
      const w=el.offsetWidth, h=el.offsetHeight;
      const svg=el.querySelector('.ann-svg');
      if(svg){
        svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
        svg.querySelectorAll('animateMotion').forEach(am=>{
          am.setAttribute('path',`M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`);
        });
      }
    }
  }} className="breaking-card" style={{ border:"2.5px solid #E05A1A", borderRadius:16, padding:16, background:card, animation:"borderGlow 1.5s infinite" }}>
    <svg className="ann-svg" style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none", overflow:"visible", zIndex:5 }} viewBox="0 0 300 100">
      <text fontSize="18" textAnchor="middle" dominantBaseline="middle">🔥<animateMotion dur="8s" repeatCount="indefinite" path="M 0 0 L 300 0 L 300 100 L 0 100 Z"/></text>
      <text fontSize="18" textAnchor="middle" dominantBaseline="middle">🔥<animateMotion dur="8s" begin="-4s" repeatCount="indefinite" path="M 0 0 L 300 0 L 300 100 L 0 100 Z"/></text>
    </svg>
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
      <div style={{ background:"#E05A1A", borderRadius:6, padding:"3px 10px", fontSize:10, fontWeight:700, color:"#fff", animation:"breakingPulse 1.2s infinite" }}>{lang==="NL"?"🔴 NIEUWS":"🔴 BREAKING"}</div>
      <span style={{ fontSize:11, color:mid, marginLeft:"auto" }}>{(()=>{ const diff=Math.floor((Date.now()-new Date(a.created_at).getTime())/60000); if(diff<1) return "just now"; if(diff<60) return diff+" min"; if(diff<1440) return Math.floor(diff/60)+" hr"; return Math.floor(diff/1440)+" days"; })()}</span>
    </div>
    <p style={{ margin:0, fontSize:14, color:ink, lineHeight:1.6 }}>{a.body}</p>
  </div>
</div>
))}

{adminAnnouncements.map((a)=>(
  <div key={a.id} style={{ marginBottom:12, background:card, border:"2px solid "+G, borderRadius:16, padding:16 }}>
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
      <div style={{ background:G, borderRadius:6, padding:"3px 10px", fontSize:10, fontWeight:700, color:"#fff" }}>📢 COHOOD</div>
      <span style={{ fontSize:11, color:mid, marginLeft:"auto" }}>{(()=>{ const diff=Math.floor((Date.now()-new Date(a.created_at).getTime())/60000); if(diff<1) return "just now"; if(diff<60) return diff+" min"; if(diff<1440) return Math.floor(diff/60)+" hr"; return Math.floor(diff/1440)+" days"; })()}</span>
    </div>
    {a.title && <div style={{ fontSize:14, fontWeight:700, color:ink, marginBottom:4 }}>{a.title}</div>}
    <p style={{ margin:0, fontSize:13, color:ink, lineHeight:1.6 }}>{a.body}</p>
  </div>
))}

<div
  onClick={()=>setTab("share")}
  style={{ background:card, border:"1px solid "+bdr, borderRadius:16, padding:"12px 14px", marginBottom:12, display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}
>
  <span style={{ width:36, height:36, borderRadius:"50%", background:G, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", flexShrink:0, overflow:"hidden" }}>
    {profile?.avatar_url
      ? <img src={profile.avatar_url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
      : displayIni}
  </span>
  <div style={{ flex:1, background:warm, borderRadius:20, padding:"9px 14px", fontSize:13, color:mid }}>
    {lang==="NL" ? "Wat heb je vandaag nodig?" : "What do you need today?"}
  </div>
</div>

            {filtPosts.map((p,i)=>{
  if(p.isEvent){
    return <EventFeedCard key={"ev-"+p.id} ev={p} userId={user?.id} attending={attendingMap[p.id]} attendees={eventAttendeesMap[p.id]||[]} onAttend={(status)=>handleEventAttend(p.id,status)} onCancel={(id)=>{ setRealEvents(prev=>prev.filter(e=>e.id!==id)); const newPts = Math.max(0,(profile?.points||0)-300); supabase.from('profiles').update({points:newPts}).eq('id',user?.id).then(()=>setProfile(prev=>({...prev,points:newPts}))); }} eventAttendeesMap={eventAttendeesMap} lang={lang}/>;
  }
  const tc=TCAT[p.type]||TCAT.announce;
  const ac = AVC[p.user?.charCodeAt(0)%AVC.length||0];
  return (
    <div key={p.id} style={{ background:card, border:"1px solid "+bdr, borderRadius:16, padding:16, marginBottom:12, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
                  <div style={{ display:"flex", gap:10, marginBottom:10 }}>
                    <Av ini={p.ini} size={42} col={ac} ver={p.ver} imgUrl={p.avatar_url}/>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", justifyContent:"space-between" }}>
                        <div>
                          <div style={{ fontSize:14, fontWeight:700, color:ink }}>{p.user} <span style={{ fontSize:11, fontWeight:400, color:mid }}>{(()=>{ const pts=p.user_points||0; const levels=[{max:500,icon:"🌱",name:"Newcomer"},{max:2500,icon:"👁️",name:"Observer"},{max:7500,icon:"🤝",name:"Neighbor"},{max:20000,icon:"⭐",name:"Contributor"},{max:50000,icon:"🔗",name:"Connector"},{max:150000,icon:"🛡️",name:"Steward"},{max:Infinity,icon:"👑",name:"Urban Visionary"}]; const idx=levels.findIndex(x=>pts<=x.max); const lvl=idx===-1?7:idx+1; const l=levels[idx]||levels[0]; return "("+l.icon+" "+l.name+" · Tier "+lvl+")"; })()}</span></div>
                          <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
                            <Icon n="mapPin" size={11} color={mid}/><span style={{ fontSize:12, color:mid }}>{p.hood}</span>
                            <span style={{ color:bdr }}>·</span>
                            <Icon n="clock" size={11} color={mid}/><span style={{ fontSize:12, color:mid }}>{p.time}</span>
                          </div>
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
  {(p.user_id===user?.id || profile?.role==="admin") &&(
  <div style={{ position:"relative" }}>
    <button onClick={(e)=>{ e.stopPropagation(); setPostMenu(postMenu===p.id?null:p.id); }} style={{ background:"none", border:"none", cursor:"pointer", color:mid, padding:"2px 6px", fontSize:16, lineHeight:1 }}>···</button>
    {postMenu===p.id&&(
      <div style={{ position:"absolute", right:0, top:24, background:card, border:"1px solid "+bdr, borderRadius:10, zIndex:50, minWidth:130, boxShadow:"0 4px 12px rgba(0,0,0,.08)" }}>
        {profile?.role==="admin" && (
  <button onClick={async(e)=>{ e.stopPropagation(); await supabase.from("posts").update({pinned:!p.pinned}).eq("id",p.id); setRealPosts(prev=>prev.map(x=>x.id===p.id?{...x,pinned:!p.pinned}:x)); setPostMenu(null); }} style={{ width:"100%", padding:"11px 14px", background:"none", border:"none", cursor:"pointer", fontSize:13, color:p.pinned?R:G, fontWeight:600, textAlign:"left", display:"flex", alignItems:"center", gap:8 }}>
    <Icon n="star" size={14} color={p.pinned?R:G}/> {p.pinned ? "Unpin post" : "Pin post"}
  </button>
)}
        <button onClick={async(e)=>{ e.stopPropagation(); await supabase.from("posts").delete().eq("id",p.id); setRealPosts(prev=>prev.filter(x=>x.id!==p.id)); setPostMenu(null); }} style={{ width:"100%", padding:"11px 14px", background:"none", border:"none", cursor:"pointer", fontSize:13, color:R, fontWeight:600, textAlign:"left", display:"flex", alignItems:"center", gap:8 }}>
          <Icon n="alert" size={14} color={R}/> {lang==="NL"?"Verwijderen":"Delete post"}
        </button>
      </div>
    )}
  </div>
)}
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
                  <p style={{ margin:"0 0 8px", fontSize:14, color:mid, lineHeight:1.6 }}>{translated[p.id]?.body||p.body}</p>
                  {p.offer&&(
                    <div style={{ background:dm?"rgba(90,58,122,.15)":PUL, border:"1px solid "+PU+"20", borderRadius:10, padding:"10px 12px", marginBottom:8 }}>
  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      <Icon n="hands" size={13} color={PU}/>
      <span style={{ fontSize:11, fontWeight:700, color:PU, letterSpacing:.5 }}>{t.offerTitle.toUpperCase()}</span>
    </div>
    {(p.offer_icon||p.icon)&&(
  <div style={{ display:"flex", alignItems:"center", gap:4, background:PU+"22", padding:"3px 8px", borderRadius:20 }}>
    <Icon n={p.offer_icon||p.icon} size={11} color={PU}/>
    <span style={{ fontSize:11, fontWeight:700, color:PU }}>{p.offer_category||p.cat}</span>
  </div>
)}
  </div>
  <p style={{ margin:0, fontSize:13, color:dm?"#C4B0D8":PU, lineHeight:1.5 }}>{translated[p.id]?.offer||p.offer}</p>
</div>
                  )}
                  {p.date&&(
                    <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:GL, padding:"5px 12px", borderRadius:20, marginBottom:8 }}>
                      <Icon n="calendar" size={12} color={G}/><span style={{ fontSize:12, color:G, fontWeight:600 }}>{p.date}</span>
                    </div>
                  )}
                  {!translated[p.id]?(
                    <button onClick={()=>doTranslate(p.id, p.body, p.offer)} style={{ display:"flex", alignItems:"center", gap:5, marginBottom:10, padding:"4px 10px", borderRadius:20, border:"1px solid "+bdr, background:"transparent", color:mid, cursor:"pointer", fontSize:11, fontWeight:600 }}>
                      <Icon n="globe" size={12} color={mid}/> {translating[p.id]?t.translating:t.translate}
                    </button>
                  ):(
                    <button onClick={()=>setTranslated(prev=>({...prev,[p.id]:null}))} style={{ display:"flex", alignItems:"center", gap:5, marginBottom:10, padding:"4px 10px", borderRadius:20, border:"1px solid "+G+"40", background:GL, color:G, cursor:"pointer", fontSize:11, fontWeight:600 }}>
                      <Icon n="globe" size={12} color={G}/> {t.original}
                    </button>
                  )}
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <button onClick={async()=>{ const newState = await toggleLike(p.id, user?.id); setLiked(prev=>({...prev,[p.id]:newState})); setLikeCounts(prev=>({...prev,[p.id]:(prev[p.id]||0)+(newState?1:-1)})); if(newState && p.user_id && p.user_id !== user?.id){ supabase.from('notifications').insert({ user_id:p.user_id, from_user_id:user?.id, from_user_name:displayName, from_avatar_url:profile?.avatar_url, type:'like', post_id:String(p.id), post_body:p.body }); } }} style={{ display:"flex", alignItems:"center", gap:4, padding:"6px 12px", borderRadius:20, border:"1.5px solid "+(liked[p.id]?"#E53935":bdr), background:liked[p.id]?"#FFF0F0":"transparent", color:liked[p.id]?"#E53935":mid, cursor:"pointer", fontSize:12, fontWeight:600, transition:"all .2s" }}>
                      {liked[p.id]?(<svg width="13" height="13" viewBox="0 0 24 24" fill="#E53935"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>):(<Icon n="heart" size={13} color={mid}/>)}
                      {likeCounts[p.id]||0}
                    </button>
                    <button onClick={()=>setComments(prev=>({...prev,[p.id]:!prev[p.id]}))} style={{ display:"flex", alignItems:"center", gap:4, padding:"6px 12px", borderRadius:20, border:"1.5px solid "+(comments[p.id]?G:bdr), background:comments[p.id]?GL:"transparent", color:comments[p.id]?G:mid, cursor:"pointer", fontSize:12, fontWeight:600, transition:"all .2s" }}>
                      <Icon n="msg" size={13} color={comments[p.id]?G:mid}/> {(cmtList[p.id]||[]).length}
                    </button>
                  
                  
                    {p.user_id !== user?.id && !helpRequests.some(h=>h.post_id===String(p.id)&&h.helper_id===user?.id) && <button onClick={()=>{ setDmPost(p); supabase.from('help_requests').insert({ post_id:String(p.id), post_body:p.body, requester_id:p.user_id, requester_name:p.user, helper_id:user?.id, helper_name:displayName, status:'pending', show_after: new Date(Date.now() + 12*60*60*1000).toISOString() }); }} style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5, padding:"6px 14px", borderRadius:20, border:"none", background:G, color:"#fff", cursor:"pointer", fontSize:12, fontWeight:700 }}>
                      {p.type==="event"?t.join:t.respond}<Icon n="chevronRight" size={13} color="#fff"/>
                    </button>}
                  </div>
                  {comments[p.id]&&(
                    <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid "+bdr }}>
                      {(cmtList[p.id]||[]).map((c,ci)=>(
                        <div key={ci} style={{ display:"flex", gap:8, marginBottom:10 }}>
                          <Av ini={c.ini} size={28} col={c.col} imgUrl={c.imgUrl}/>
                          <div style={{ flex:1 }}>
                            <div style={{ background:warm, borderRadius:"4px 12px 12px 12px", padding:"8px 12px" }}>
                              <div style={{ fontSize:11, fontWeight:700, color:G, marginBottom:4 }}>{c.name||c.ini}</div>
                              <p style={{ margin:0, fontSize:13, color:ink, lineHeight:1.5 }}>{c.txt}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <Av ini={displayIni} size={28} col={G} imgUrl={profile?.avatar_url}/>
                        <div style={{ flex:1, display:"flex", gap:6, background:warm, border:"1.5px solid "+bdr, borderRadius:20, padding:"6px 6px 6px 12px", alignItems:"center" }}>
                          <input value={cmtInput[p.id]||""} onChange={e=>setCmtInput(prev=>({...prev,[p.id]:e.target.value}))} placeholder={lang==="NL"?"Schrijf een reactie...":"Write a comment..."} style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:13, color:ink, fontFamily:"DM Sans,sans-serif" }}/>
                          <button onClick={()=>{ if(cmtInput[p.id]?.trim()){ saveComment(p.id,user?.id,displayName,cmtInput[p.id],profile?.avatar_url); setCmtList(prev=>({...prev,[p.id]:[...(prev[p.id]||[]),{txt:cmtInput[p.id],ini:displayIni,name:displayName,col:G,imgUrl:profile?.avatar_url}]})); if(p.user_id && p.user_id !== user?.id){ supabase.from('notifications').insert({ user_id:p.user_id, from_user_id:user?.id, from_user_name:displayName, from_avatar_url:profile?.avatar_url, type:'comment', post_id:String(p.id), post_body:p.body }); } setCmtInput(prev=>({...prev,[p.id]:""})); } }} style={{ width:28, height:28, borderRadius:"50%", background:G, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
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
                {!verified && profile?.verification_status !== 'approved' && (
  profile?.verification_status === 'pending' ? (
    <div style={{ background:"#FAEEDA", border:"1px solid #BA751730", borderRadius:12, padding:"11px 14px", marginBottom:14, display:"flex", gap:10, alignItems:"center" }}>
      <Icon n="shield" size={18} color="#BA7517"/>
      <span style={{ flex:1, fontSize:13, fontWeight:600, color:"#BA7517" }}>⏳ Your verification is pending review</span>
    </div>
  ) : (
    <div style={{ background:GL, border:"1px solid "+G+"30", borderRadius:12, padding:"11px 14px", marginBottom:14, display:"flex", gap:10, alignItems:"center" }}>
      <Icon n="shield" size={18} color={G}/>
      <span style={{ flex:1, fontSize:13, fontWeight:600, color:G }}>{t.verReq}</span>
      <button onClick={()=>setShowVer(true)} style={{ padding:"5px 12px", background:G, color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>{t.verNow}</button>
    </div>
  )
)}
                <button onClick={submitHelp} style={{ width:"100%", padding:"14px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  <Icon n="send" size={16} color="#fff"/> {t.submitLbl}
                </button>
              </div>
            )}
          </div>
        )}

        {tab==="events"&&(
  (()=>{
    const userPoints = profile?.points || 0;
    const isLocked = userPoints < 10000;
    const pct = Math.min(100, (userPoints / 10000) * 100);
    const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const today = new Date();
    const minDate = new Date(today); minDate.setDate(today.getDate()+1);
    const evTypes = lang==="NL"
      ? [{n:"Stadslandbouw",i:"leaf"},{n:"Buurtschoonmaak",i:"sun"},{n:"Thee bijeenkomst",i:"msg"},{n:"Workshop",i:"star"},{n:"Feest",i:"bell"},{n:"Overig",i:"info"}]
      : [{n:"Urban Farming",i:"leaf"},{n:"Neighborhood Clean",i:"sun"},{n:"Tea Meetup",i:"msg"},{n:"Workshop",i:"star"},{n:"Celebration",i:"bell"},{n:"Other",i:"info"}];

    if(isLocked) return (
      <div style={{ minHeight:"calc(100vh - 120px)", background:"#0f0e0c", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 24px", gap:20 }}>
        <div style={{ width:72, height:72, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon n="lock" size={28} color="rgba(255,255,255,0.35)"/>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:20, fontWeight:700, color:"#fff", fontFamily:"Playfair Display,serif", marginBottom:8 }}>{lang==="NL"?"Een mysterieuze plek":"A mysterious place"}</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", lineHeight:1.7, maxWidth:260 }}>{lang==="NL"?"Dit gebied opent voor actieve buren met 10.000 Co‑Points.":"This area unlocks for active neighbors with 10,000 Co‑Points."}</div>
        </div>
        <div style={{ width:"100%", maxWidth:280 }}>
          <div style={{ height:5, background:"rgba(255,255,255,0.07)", borderRadius:3, overflow:"hidden" }}>
            <div style={{ width:pct+"%", height:"100%", background:G, borderRadius:3, transition:"width .4s" }}/>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:11, color:"rgba(255,255,255,0.25)" }}>
            <span>{userPoints.toLocaleString()} pts</span><span>10.000 pts</span>
          </div>
        </div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.2)" }}>{lang==="NL"?`Nog ${(10000-userPoints).toLocaleString()} punten nodig`:`${(10000-userPoints).toLocaleString()} more points to unlock`}</div>
      </div>
    );

    return (
      <div style={{ padding:"20px 16px 40px", background:bg }}>
        <h2 style={{ margin:"0 0 2px", fontSize:22, fontWeight:700, color:ink, fontFamily:"Playfair Display,serif" }}>{t.evTitle}</h2>
        <div style={{ fontSize:13, color:mid, marginBottom:2 }}>Bring your neighborhood together</div>
        <div style={{ fontSize:12, color:mid, marginBottom:20 }}><span style={{ color:G, fontWeight:600 }}>+500 Co-Points</span> for creating · <span style={{ color:G, fontWeight:600 }}>+50 Co-Points</span> per attendee</div>

        {success==="ev" ? (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ width:64, height:64, background:GL, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
              <Icon n="check" size={28} color={G} sw={2.5}/>
            </div>
            <div style={{ fontSize:18, fontWeight:700, color:ink }}>{t.okEv}</div>
            <div style={{ fontSize:14, color:mid, marginTop:6 }}>{t.okEvSub}</div>
          </div>
        ) : (
          <div>
            {/* Tip seçimi */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:20 }}>
              {evTypes.map((ev,i)=>(
                <button key={i} onClick={()=>setEvType(i)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"12px 8px", borderRadius:14, border:"1.5px solid "+(evType===i?G:bdr), background:evType===i?GL:card, cursor:"pointer" }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:evType===i?G:warm, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon n={ev.i} size={16} color={evType===i?"#fff":mid}/>
                  </div>
                  <span style={{ fontSize:11, fontWeight:600, color:evType===i?G:mid, textAlign:"center", lineHeight:1.3 }}>{ev.n}</span>
                </button>
              ))}
            </div>

            {/* Event name */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:mid, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Event name</div>
              <div style={{ display:"flex", alignItems:"center", gap:10, background:card, border:"1.5px solid "+bdr, borderRadius:12, padding:"12px 14px" }}>
                <Icon n="send" size={15} color={mid}/>
                <input value={evName} onChange={e=>setEvName(e.target.value)} placeholder="Give your event a name..." style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:14, color:ink, fontFamily:"DM Sans,sans-serif" }}/>
              </div>
            </div>

            {/* Date & Time */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:mid, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Date & Time</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                <button onClick={()=>{ setEvCalOpen(!evCalOpen); setEvTimeOpen(false); }} style={{ display:"flex", alignItems:"center", gap:8, background:card, border:"1.5px solid "+(evCalOpen?G:bdr), borderRadius:12, padding:"12px 14px", cursor:"pointer" }}>
                  <Icon n="calendar" size={15} color={mid}/>
                  <span style={{ fontSize:13, color:evDay?ink:mid, fontWeight:evDay?500:400 }}>{evDay ? MONTHS[evMonth].slice(0,3)+" "+evDay+", "+evYear : "Select date"}</span>
                </button>
                <button onClick={()=>{ setEvTimeOpen(!evTimeOpen); setEvCalOpen(false); }} style={{ display:"flex", alignItems:"center", gap:8, background:card, border:"1.5px solid "+(evTimeOpen?G:bdr), borderRadius:12, padding:"12px 14px", cursor:"pointer" }}>
                  <Icon n="clock" size={15} color={mid}/>
                  <span style={{ fontSize:13, color:evHour?ink:mid, fontWeight:evHour?500:400 }}>{evHour ? evHour+":00 "+evAmPm : "Select time"}</span>
                </button>
              </div>

              {/* Calendar dropdown */}
              {evCalOpen&&(
                <div style={{ background:card, border:"1.5px solid "+bdr, borderRadius:14, padding:14, marginTop:8 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                    <button onClick={()=>{ let m=evMonth-1,y=evYear; if(m<0){m=11;y--;} setEvMonth(m);setEvYear(y); }} style={{ background:"none", border:"none", cursor:"pointer", color:mid, fontSize:16, padding:"2px 6px" }}>‹</button>
                    <span style={{ fontSize:13, fontWeight:700, color:ink }}>{MONTHS[evMonth]} {evYear}</span>
                    <button onClick={()=>{ let m=evMonth+1,y=evYear; if(m>11){m=0;y++;} setEvMonth(m);setEvYear(y); }} style={{ background:"none", border:"none", cursor:"pointer", color:mid, fontSize:16, padding:"2px 6px" }}>›</button>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:6 }}>
                    {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d=><div key={d} style={{ textAlign:"center", fontSize:10, fontWeight:600, color:mid, padding:"4px 0" }}>{d}</div>)}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
                    {Array.from({length:(new Date(evYear,evMonth,1).getDay()||7)-1}).map((_,i)=><div key={"e"+i}/>)}
                    {Array.from({length:new Date(evYear,evMonth+1,0).getDate()}).map((_,i)=>{
                      const d=i+1, thisDate=new Date(evYear,evMonth,d), disabled=thisDate<minDate, sel=evDay===d&&evMonth===new Date().getMonth()&&evYear===new Date().getFullYear();
                      return <div key={d} onClick={()=>{ if(disabled)return; setEvDay(d); setEvCalOpen(false); }} style={{ textAlign:"center", padding:"6px 2px", fontSize:12, color:disabled?"#D3D1C7":sel?"#fff":ink, background:sel?G:"transparent", borderRadius:8, cursor:disabled?"default":"pointer", fontWeight:sel?700:400 }}>{d}</div>;
                    })}
                  </div>
                </div>
              )}

              {/* Time dropdown */}
              {evTimeOpen&&(
                <div style={{ background:card, border:"1.5px solid "+bdr, borderRadius:14, padding:14, marginTop:8, display:"flex", flexDirection:"column", gap:12 }}>
                  <div>
                    <div style={{ fontSize:11, fontWeight:600, color:mid, marginBottom:6 }}>Hour</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(h=>(
                        <button key={h} onClick={()=>setEvHour(h)} style={{ padding:"6px 11px", borderRadius:20, border:"1px solid "+(evHour===h?G:bdr), background:evHour===h?G:card, color:evHour===h?"#fff":mid, fontSize:12, fontWeight:600, cursor:"pointer" }}>{h}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize:11, fontWeight:600, color:mid, marginBottom:6 }}>AM / PM</div>
                    <div style={{ display:"flex", gap:8 }}>
                      {["AM","PM"].map(v=>(
                        <button key={v} onClick={()=>setEvAmPm(v)} style={{ flex:1, padding:"8px 0", borderRadius:10, border:"1.5px solid "+(evAmPm===v?G:bdr), background:evAmPm===v?G:card, color:evAmPm===v?"#fff":mid, fontSize:13, fontWeight:700, cursor:"pointer" }}>{v}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Location */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:mid, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Location</div>
              <div style={{ display:"flex", alignItems:"center", gap:10, background:card, border:"1.5px solid "+bdr, borderRadius:12, padding:"12px 14px" }}>
                <Icon n="mapPin" size={15} color={mid}/>
                <input value={evLoc} onChange={e=>setEvLoc(e.target.value)} placeholder="Where is it happening?" style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:14, color:ink, fontFamily:"DM Sans,sans-serif" }}/>
              </div>
            </div>

            {/* Surprise box */}
            <div style={{ position:"relative", borderRadius:14, padding:16, marginBottom:16, overflow:"hidden", background:"#5C7A55", border:"1px solid rgba(120,200,100,0.25)" }}>
              <EventStarsCanvas/>
              <div style={{ position:"relative", zIndex:1 }}>
                <div style={{ fontSize:9, fontWeight:700, letterSpacing:2, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", marginBottom:8 }}>✦ CoHood</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", lineHeight:1.7 }}><strong style={{ color:"#fff" }}>The CoHood team might just surprise you.</strong> Events that bring the neighborhood together can unlock something unexpected — keep an eye out.</div>
              </div>
            </div>

            {/* Create button */}
            <div style={{ display:"flex", justifyContent:"center" }}>
              <button onClick={submitEv} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"10px 22px", background:warm, color:ink, border:"1px solid "+bdr, borderRadius:20, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
                <Icon n="leaf" size={14} color={ink}/> {t.evSubmit}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  })()
)}

{tab==="spots"&&(
  <div style={{ position:"relative", minHeight:"78vh", overflow:"hidden", background:bg }}>
    <CoSpotsCanvas/>
    <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", minHeight:"78vh", padding:"20px 16px" }}>
      <div style={{ marginBottom:32 }}>
        <h2 style={{ fontSize:22, fontWeight:700, color:ink, fontFamily:"Playfair Display,serif", margin:0 }}>Co-Spots</h2>
        <div style={{ fontSize:11, color:mid, marginTop:2 }}>{displayHood}, Amsterdam</div>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:28, paddingBottom:40, textAlign:"center" }}>
        <div style={{ position:"relative", width:88, height:88, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1px solid rgba(61,107,53,0.25)", animation:"pulseRing 2.8s ease-out infinite" }}/>
          <div style={{ position:"absolute", inset:-14, borderRadius:"50%", border:"1px solid rgba(61,107,53,0.1)", animation:"pulseRing 2.8s ease-out infinite", animationDelay:".7s" }}/>
          <div style={{ width:88, height:88, borderRadius:"50%", background:GL, border:"1.5px solid rgba(61,107,53,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon n="mapPin" size={34} color={G} sw={1.5}/>
          </div>
        </div>
        <div>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:2.5, color:mid, textTransform:"uppercase" }}>Coming soon</div>
          <div style={{ fontSize:24, fontWeight:700, color:ink, fontFamily:"Playfair Display,serif", lineHeight:1.35, marginTop:8 }}>Kindness has a map.</div>
          <div style={{ fontSize:13, color:mid, lineHeight:1.75, maxWidth:255, margin:"12px auto 0" }}>The places where your neighborhood shows up for each other.</div>
        </div>
      </div>
    </div>
    <style>{"@keyframes pulseRing{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.6);opacity:0}}"}</style>
  </div>
)}

{tab==="commons"&&(
  <div style={{ position:"relative", minHeight:"78vh", overflow:"hidden", background:bg }}>
    <CoCommonsCanvas/>
    <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", minHeight:"78vh", padding:"20px 16px" }}>
      <div style={{ marginBottom:32 }}>
        <h2 style={{ fontSize:22, fontWeight:700, color:ink, fontFamily:"Playfair Display,serif", margin:0 }}>Co-Commons</h2>
        <div style={{ fontSize:11, color:mid, marginTop:2 }}>{displayHood}, Amsterdam</div>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:28, paddingBottom:40, textAlign:"center" }}>
        <div style={{ position:"relative", width:88, height:88, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1px solid rgba(186,117,23,0.25)", animation:"pulseRing 2.8s ease-out infinite" }}/>
          <div style={{ position:"absolute", inset:-14, borderRadius:"50%", border:"1px solid rgba(186,117,23,0.1)", animation:"pulseRing 2.8s ease-out infinite", animationDelay:".7s" }}/>
          <div style={{ width:88, height:88, borderRadius:"50%", background:"#FAEEDA", border:"1.5px solid rgba(186,117,23,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon n="bag" size={34} color="#854F0B" sw={1.5}/>
          </div>
        </div>
        <div>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:2.5, color:mid, textTransform:"uppercase" }}>Coming soon</div>
          <div style={{ fontSize:24, fontWeight:700, color:ink, fontFamily:"Playfair Display,serif", lineHeight:1.35, marginTop:8 }}>Your points,<br/>made real.</div>
          <div style={{ fontSize:13, color:mid, lineHeight:1.75, maxWidth:255, margin:"12px auto 0" }}>Every connection makes the neighborhood stronger.</div>
        </div>
      </div>
    </div>
    <style>{"@keyframes pulseRing{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.6);opacity:0}}"}</style>
  </div>
)}

        {tab==="messages"&&(
          <div style={{ padding:"18px 16px" }}>
            <h2 style={{ margin:"0 0 18px", fontSize:20, fontWeight:700, color:ink, fontFamily:"Playfair Display,serif" }}>{t.msgTitle}</h2>
            {realMessages.length>0?realMessages.map((m,i)=>(
  <div key={m.id} onClick={()=>{ setActiveConv(m); if(!m.read&&m.receiver_id===user?.id){ supabase.from("messages").update({read:true}).eq("id",m.id).then(()=>setUnreadCount(prev=>Math.max(0,prev-1))); } }} style={{ display:"flex", gap:12, alignItems:"center", padding:"13px 0", borderBottom:"1px solid "+bdr, cursor:"pointer" }}>
    <Av ini={(m.sender_id===user?.id?m.receiver_name||"?":m.sender_name||"?")[0]?.toUpperCase()||"?"} size={46} col={AVC[i%AVC.length]} ver={false} imgUrl={m.other_avatar}/>
    <div style={{ flex:1, minWidth:0 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontSize:14, fontWeight:!m.read&&m.receiver_id===user?.id?700:600, color:ink }}>{m.sender_id===user?.id ? m.receiver_name||"User" : m.sender_name||"User"}</span>
        <span style={{ fontSize:11, color:mid }}>{new Date(m.created_at).toLocaleDateString()}</span>
      </div>
      <span style={{ fontSize:13, color:!m.read&&m.receiver_id===user?.id?ink:mid, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block", maxWidth:210 }}>{m.content}</span>
    </div>
    {!m.read&&m.receiver_id===user?.id&&(
      <div style={{ width:20, height:20, borderRadius:"50%", background:G, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <span style={{ fontSize:11, fontWeight:700, color:"#fff" }}>1</span>
      </div>
    )}
  </div>
)):<div style={{ textAlign:"center", padding:"40px 0", color:mid, fontSize:14 }}>No messages yet</div>}
          </div>
        )}

        {tab==="profile"&&(
          <div style={{ padding:"18px 16px" }}>
            <div style={{ background:"linear-gradient(135deg,"+G+",#5A8E52)", borderRadius:20, padding:"26px 22px", marginBottom:14, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", right:-20, top:-20, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,.07)" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ position:"relative", display:"inline-flex" }}>
  <Av ini={displayIni} size={54} col="rgba(255,255,255,.2)" ver={verified} imgUrl={profile?.avatar_url}/>
  <label htmlFor="profile-photo" style={{ position:"absolute", bottom:-4, right:-4, width:22, height:22, background:G, borderRadius:"50%", border:"2px solid #fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
    <Icon n="camera" size={11} color="#fff"/>
  </label>
  <input id="profile-photo" type="file" accept="image/*" style={{ display:"none" }} onChange={async(e)=>{
    const file=e.target.files[0]; if(!file) return;
    const ext=file.name.split('.').pop();
    const fileName=user?.id+'/'+Date.now()+'.'+ext;
    const {error}=await supabase.storage.from('avatars').upload(fileName,file,{upsert:true});
    
    if(!error){ const {data}=supabase.storage.from('avatars').getPublicUrl(fileName); setProfile(prev=>({...prev,avatar_url:data.publicUrl})); await supabase.from('profiles').update({avatar_url:data.publicUrl}).eq('id',user?.id); await supabase.from('posts').update({avatar_url:data.publicUrl}).eq('user_id',user?.id); }
    else alert(error.message);
  }}/>
</div>
                  <div style={{ fontSize:20, fontWeight:700, color:"#fff", marginTop:10, fontFamily:"Playfair Display,serif" }}>{displayName}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:4, color:"rgba(255,255,255,.75)", fontSize:13 }}>
                    <Icon n="mapPin" size={13} color="rgba(255,255,255,.75)"/> {displayHood}, Amsterdam
                  </div>
                </div>
                {verified||profile?.verification_status==='approved'?(
                  <div style={{ background:"rgba(255,255,255,.15)", borderRadius:12, padding:"7px 12px", display:"flex", alignItems:"center", gap:5 }}>
                    <VerBadge size={16}/><span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{t.verified}</span>
                  </div>
                ):profile?.verification_status==='pending'?(
                  <div style={{ background:"rgba(186,117,23,.3)", border:"1.5px solid rgba(186,117,23,.5)", borderRadius:12, padding:"7px 12px", display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>⏳ Pending</span>
                  </div>
                ):(
                  <button onClick={()=>setShowVer(true)} style={{ background:"rgba(255,255,255,.2)", border:"1.5px solid rgba(255,255,255,.4)", borderRadius:12, padding:"7px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                    <Icon n="shield" size={14} color="#fff"/><span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{t.idVer}</span>
                  </button>
                )}
              </div>
            </div>
            <button onClick={()=>setShowEditProfile(true)} style={{ marginBottom:12, width:"100%", padding:"11px 0", background:"transparent", border:"1.5px solid #E2D9CC", borderRadius:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, color:ink }}><Icon n="user" size={15} color={ink}/><span style={{ fontSize:13, fontWeight:600 }}>Edit Profile</span></button>
            {(()=>{
  const pts = profile?.points||0;
  const levels = [
    {min:0, max:500, level:1, name:"Newcomer", desc:"Verified entry. Exploring the neighborhood ecosystem.", icon:"🌱"},
    {min:501, max:2500, level:2, name:"Observer", desc:"Initial social contributions. Gaining community recognition.", icon:"👀"},
    {min:2501, max:7500, level:3, name:"Neighbor", desc:"Reliable community member. Authorized for micro-resource sharing.", icon:"🤝"},
    {min:7501, max:20000, level:4, name:"Contributor", desc:"CORE MEMBER. Active problem solver and verified volunteer.", icon:"⭐"},
    {min:20001, max:50000, level:5, name:"Connector", desc:"Integration bridge. Expert in fostering diverse social bonds.", icon:"🔗"},
    {min:50001, max:150000, level:6, name:"Steward", desc:"Neighborhood Guardian. High-trust arbiter for local disputes.", icon:"🛡️"},
    {min:150000, max:Infinity, level:7, name:"Urban Visionary", desc:"ZIRVE. Digital architect of urban resilience and policy advisor.", icon:"👑"},
  ];
  const cur = levels.find(l=>pts>=l.min&&pts<=l.max)||levels[0];
  const next = levels[cur.level]||null;
  const progress = next ? Math.min(100, Math.round((pts-cur.min)/(next.min-cur.min)*100)) : 100;
  return (
    <div style={{ background:card, border:"1px solid "+bdr, borderRadius:16, padding:16, marginBottom:12 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <span style={{ fontSize:28 }}>{cur.icon}</span>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:15, fontWeight:700, color:ink }}>Tier {cur.level} — {cur.name}</span>
            <span style={{ fontSize:12, fontWeight:700, color:G }}>{pts} Co-Points</span>
          </div>
          <div style={{ fontSize:11, color:mid, marginTop:2 }}>{cur.desc}</div>
        </div>
      </div>
      <div style={{ background:warm, borderRadius:20, height:6, overflow:"hidden" }}>
        <div style={{ width:progress+"%", height:"100%", background:G, borderRadius:20, transition:"width .5s" }}/>
      </div>
      {next&&<div style={{ fontSize:10, color:mid, marginTop:4, textAlign:"right" }}>{next.min-pts} pts to {next.name}</div>}
    </div>
  );
})()}
            <div style={{ background:card, border:"1px solid "+bdr, borderRadius:16, padding:14, marginBottom:12 }}>
  <div style={{ display:"flex", gap:8, marginBottom:14 }}>
    <button onClick={()=>setHelpTab("given")} style={{ flex:1, padding:"8px 0", borderRadius:10, border:"none", background:helpTab==="given"?G:"transparent", color:helpTab==="given"?"#fff":mid, fontWeight:700, fontSize:12, cursor:"pointer" }}>{lang==="NL"?"Verleend":"Given"}</button>
    <button onClick={()=>setHelpTab("received")} style={{ flex:1, padding:"8px 0", borderRadius:10, border:"none", background:helpTab==="received"?G:"transparent", color:helpTab==="received"?"#fff":mid, fontWeight:700, fontSize:12, cursor:"pointer" }}>{lang==="NL"?"Ontvangen":"Received"}</button>
  </div>
  {helpRequests.filter(h=>new Date(h.show_after) <= new Date() && (helpTab==="given"?h.helper_id===user?.id&&h.helper_confirmed===null:h.requester_id===user?.id&&h.requester_confirmed===null)).length===0?(
    <div style={{ textAlign:"center", padding:"20px 0", color:mid, fontSize:13 }}>{lang==="NL"?"Nog geen yardımlar":"No help yet"}</div>
  ):helpRequests.filter(h=>new Date(h.show_after) <= new Date() && (helpTab==="given"?h.helper_id===user?.id&&h.helper_confirmed===null:h.requester_id===user?.id&&h.requester_confirmed===null)).map(h=>(
    <div key={h.id} style={{ background:warm, borderRadius:12, padding:"12px 14px", marginBottom:8 }}>
      <div style={{ fontSize:13, color:ink, marginBottom:8 }}>{helpTab==="given"?(h.offer_body||h.post_body)?.substring(0,60):h.post_body?.substring(0,60)}...</div>
      <div style={{ fontSize:11, color:mid, marginBottom:8 }}>{helpTab==="given"?h.requester_name:h.helper_name}</div>
      {h.status==="pending" && (
        <div style={{ display:"flex", gap:6 }}>
          <button onClick={async()=>{ supabase.from('help_requests').update({[helpTab==="given"?"helper_confirmed":"requester_confirmed"]:true}).eq('id',h.id) .then(()=>{}) ; await supabase.rpc('increment_points', {user_id: helpTab==="given"?h.requester_id:h.helper_id}); setHelpRequests(prev=>prev.filter(x=>x.id!==h.id)); }} style={{ flex:1, padding:"7px 0", borderRadius:10, border:"none", background:G, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>{lang==="NL"?"✓ Geholpen":"✓ Helped"}</button>
          <button onClick={()=>{ supabase.from('help_requests').update({[helpTab==="given"?"helper_confirmed":"requester_confirmed"]:false}).eq('id',h.id) .then(()=>{}) ; setHelpRequests(prev=>prev.filter(x=>x.id!==h.id)); }} style={{ flex:1, padding:"7px 0", borderRadius:10, border:"none", background:"#FFF0F0", color:"#E53935", fontSize:12, fontWeight:700, cursor:"pointer" }}>{lang==="NL"?"✗ Niet":"✗ Not helped"}</button>
        </div>
      )}
      {h.status==="completed"&&<div style={{ fontSize:12, color:G, fontWeight:600 }}>✓ {lang==="NL"?"Voltooid":"Completed"}</div>}
      {h.status==="cancelled"&&<div style={{ fontSize:12, color:"#E53935", fontWeight:600 }}>✗ {lang==="NL"?"Geannuleerd":"Cancelled"}</div>}
    </div>
  ))}
</div>

<div style={{ margin:"16px 0", padding:"16px", background:GL, borderRadius:16, border:"1px solid "+G+"30" }}>
  <div style={{ fontSize:12, color:G, fontWeight:700, marginBottom:0 }}>
    {t.referralTitle}
  </div>
  <div style={{ fontSize:11, color:G, opacity:0.7, marginBottom:0 }}>
    {t.referralNote}
  </div>
  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
    <span style={{ fontSize:22, fontWeight:800, color:ink, letterSpacing:4, fontFamily:"DM Sans,sans-serif" }}>
      {profile?.referral_code || "—"}
    </span>
    <button
      onClick={()=>navigator.clipboard.writeText(profile?.referral_code || "")}
      style={{ background:G, color:"#fff", border:"none", borderRadius:10, padding:"8px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}
    >
      {t.referralCopy}
    </button>
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
                <div style={{ display:"flex", alignItems:"center", gap:10 }}><Icon n="shield" size={17} color={G}/><span style={{ fontSize:14, fontWeight:500, color:ink }}>{t.idVer}</span></div>
                {verified||profile?.verification_status==='approved'
  ?<div style={{ display:"flex", alignItems:"center", gap:5 }}><VerBadge size={16}/><span style={{ fontSize:12, fontWeight:700, color:G }}>{t.verified}</span></div>
  :profile?.verification_status==='pending'
  ?<span style={{ fontSize:12, color:"#BA7517", fontWeight:600 }}>⏳ Pending review</span>
  :<button onClick={()=>setShowVer(true)} style={{ padding:"5px 12px", background:G, color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.verNow}</button>
}
              </div>
            
            </div>
            {profile?.role === 'admin' && (
  <button onClick={()=>setTab('admin')} style={{ width:"100%", marginBottom:10, padding:"13px 0", background:"#1A1510", color:"#FFD700", border:"1.5px solid #FFD70030", borderRadius:14, fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
    <Icon n="shield" size={16} color="#FFD700"/> Admin Panel
  </button>
)}
            <button onClick={onLogout} style={{ width:"100%", padding:"13px 0", background:"transparent", color:R, border:"1.5px solid "+R+"30", borderRadius:14, fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <Icon n="back" size={16} color={R}/> {t.logout}
            </button>
          
<div style={{ height:10 }}/>

          <div style={{ background:card, border:"1px solid "+bdr, borderRadius:16, padding:"14px 16px", marginBottom:12, display:"flex", alignItems:"center", gap:12 }}>
  <div style={{ width:40, height:40, borderRadius:12, background:GL, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
    <Icon n="mail" size={18} color={G}/>
  </div>
  <div style={{ flex:1 }}>
    <div style={{ fontSize:13, fontWeight:700, color:ink, marginBottom:2 }}>We're listening</div>
    <div style={{ fontSize:12, color:mid }}>Share your feedback or suggestions.</div>
  </div>
  <button onClick={()=>{ window.location.href="mailto:info@cohood.nl"; }} style={{ background:G, color:"#fff", border:"none", borderRadius:10, padding:"8px 14px", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
    Contact
  </button>
</div>
          
          </div>
      
        )}
      </div>



      <div style={{ textAlign:"center", padding:"24px 0 8px", fontSize:11, color:mid, letterSpacing:1 }}>
  © 2026 CoHood · Amsterdam · All rights reserved
</div>

      {tab==="admin" && profile?.role==="admin" &&(
  <div style={{ padding:"18px 16px" }}>
    <h2 style={{ margin:"0 0 4px", fontSize:20, fontWeight:700, color:ink, fontFamily:"Playfair Display,serif" }}>Admin Panel</h2>
    <p style={{ color:mid, fontSize:13, margin:"0 0 20px" }}>Manage CoHood</p>

    {/* Announcement */}
    <div style={{ background:card, border:"1px solid "+bdr, borderRadius:16, padding:16, marginBottom:12 }}>
      <div style={{ fontSize:13, fontWeight:700, color:ink, marginBottom:10 }}>📢 Send Announcement</div>
      <input value={adminAnnTitle||""} onChange={e=>setAdminAnnTitle(e.target.value)} placeholder="Title..." style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1.5px solid "+bdr, background:warm, color:ink, fontSize:13, fontFamily:"DM Sans,sans-serif", outline:"none", boxSizing:"border-box", marginBottom:8 }}/>
      <textarea value={adminAnnBody||""} onChange={e=>setAdminAnnBody(e.target.value)} placeholder="Message..." style={{ width:"100%", minHeight:80, padding:"10px 12px", borderRadius:10, border:"1.5px solid "+bdr, background:warm, color:ink, fontSize:13, fontFamily:"DM Sans,sans-serif", resize:"none", outline:"none", boxSizing:"border-box", marginBottom:10 }}/>
      <button onClick={async()=>{
        if(!adminAnnTitle?.trim()||!adminAnnBody?.trim()) return;
        await supabase.from('admin_announcements').insert({ title:adminAnnTitle, body:adminAnnBody, neighborhood:displayHood, created_by:user?.id });
        setAdminAnnTitle(""); setAdminAnnBody("");
        alert("Announcement sent!");
      }} style={{ width:"100%", padding:"11px 0", background:G, color:"#fff", border:"none", borderRadius:12, fontSize:13, fontWeight:700, cursor:"pointer" }}>
        Send
      </button>
    </div>
    </div>
)}

      <div style={{ background:dm?"#1A1510":"#fff", borderTop:"1px solid "+bdr, display:"flex", padding:"8px 0 4px", position:"sticky", bottom:0, zIndex:50 }}>
        <NavBtn k="feed" icon="home" label={t.feed}/>
        <NavBtn k="events" icon="calendar" label={t.events}/>
        <NavBtn k="spots" icon="mapPin" label="Co-Spots"/>
        <NavBtn k="commons" icon="bag" label="Co-Commons"/>
        <NavBtn k="profile" icon="user" label={t.profile} badge={helpNotifCount}/>
      </div>

      {activeConv&&(
        <div style={{ position:"fixed", inset:0, zIndex:200, background:bg, maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column" }}>
          <div style={{ background:dm?"#1A1510":"#fff", borderBottom:"1px solid "+bdr, padding:"13px 16px", display:"flex", alignItems:"center", gap:10 }}>
            <button onClick={()=>setActiveConv(null)} style={{ border:"none", background:"none", cursor:"pointer", padding:4, display:"flex" }}>
              <Icon n="back" size={20} color={ink}/>
            </button>
            <Av ini={(activeConv.sender_id===user?.id?activeConv.receiver_name||"?":activeConv.sender_name||"?")[0]?.toUpperCase()||"?"} size={36} col={G} ver={false} imgUrl={activeConv.other_avatar}/>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:ink }}>{activeConv.sender_id===user?.id ? activeConv.receiver_name||"User" : activeConv.sender_name||"User"}</div>
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:10 }}>
            {[
              ...convMessages.map(m=>({txt:m.content, mine:m.sender_id===user?.id})),
            ].map((m,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:m.mine?"flex-end":"flex-start" }}>
                <div style={{ maxWidth:"75%", background:m.mine?G:card, border:m.mine?"none":"1px solid "+bdr, borderRadius:m.mine?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"10px 14px" }}>
                  <p style={{ margin:0, fontSize:13, color:m.mine?"#fff":ink, lineHeight:1.5 }}>{m.txt}</p>
                  {m.mine&&<div style={{ display:"flex", justifyContent:"flex-end", marginTop:4 }}><Icon n="check" size={11} color="rgba(255,255,255,.7)" sw={2.5}/></div>}
                </div>
              </div>
            ))}
            <div ref={convEndRef}/>
          </div>
          <div style={{ background:dm?"#1A1510":"#fff", borderTop:"1px solid "+bdr, padding:"12px 16px", display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ flex:1, background:warm, border:"1.5px solid "+bdr, borderRadius:24, padding:"10px 16px" }}>
              <input value={convMsg} onChange={e=>setConvMsg(e.target.value)} placeholder={t.msgPh} style={{ width:"100%", border:"none", outline:"none", background:"transparent", fontSize:14, color:ink, fontFamily:"DM Sans,sans-serif" }}/>
            </div>
            <button onClick={async()=>{ if(convMsg.trim()){ await sendMessage(user?.id, activeConv.sender_id===user?.id?activeConv.receiver_id:activeConv.sender_id, displayName, activeConv.sender_id===user?.id?activeConv.receiver_name||"User":activeConv.sender_name||"User", null, convMsg, profile?.avatar_url); setConvMessages(prev=>[...prev,{id:Date.now(),sender_id:user?.id,receiver_id:activeConv.sender_id===user?.id?activeConv.receiver_id:activeConv.sender_id,content:convMsg,created_at:new Date().toISOString()}]); setConvMsg(""); } }} style={{ width:42, height:42, borderRadius:"50%", background:G, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
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
                  <Av ini={dmPost.ini} size={36} col={AVC[(dmPost.id-1)%AVC.length]} ver={dmPost.ver} imgUrl={dmPost.avatar_url}/>
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
        <VerifyModal t={t} dm={dm} onClose={()=>setShowVer(false)} onVerified={()=>{setVerified(true);setShowVer(false);}} user={user} profile={profile}/>
      )}

{tierUpModal && (
  <div style={{ position:"fixed", inset:0, zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)" }} onClick={()=>setTierUpModal(null)}>
    <div style={{ background:card, borderRadius:24, padding:"36px 28px", maxWidth:320, width:"90%", textAlign:"center", position:"relative" }} onClick={e=>e.stopPropagation()}>
      <div style={{ fontSize:56, marginBottom:12 }}>
        {["🌱","👀","🤝","⭐","🔗","🛡️","👑"][tierUpModal-1]}
      </div>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:G, textTransform:"uppercase", marginBottom:6 }}>Tier {tierUpModal} Unlocked</div>
      <div style={{ fontSize:22, fontWeight:700, color:ink, fontFamily:"Playfair Display,serif", marginBottom:12 }}>
        {["Newcomer","Observer","Neighbor","Contributor","Connector","Steward","Urban Visionary"][tierUpModal-1]}
      </div>
      <div style={{ fontSize:14, color:mid, lineHeight:1.7, marginBottom:24 }}>
        {[
          "Welcome to the neighborhood. Every great community starts with one step.",
          "You're paying attention. The neighborhood notices.",
          "You're no longer just a resident. You're a neighbor.",
          "Your hands have built something real here.",
          "You bring people together. That's a rare gift.",
          "The neighborhood trusts you. Guard it well.",
          "You didn't just join a community. You helped build one."
        ][tierUpModal-1]}
      </div>
      <button onClick={()=>setTierUpModal(null)} style={{ width:"100%", padding:"13px 0", background:G, color:"#fff", border:"none", borderRadius:14, fontSize:14, fontWeight:700, cursor:"pointer" }}>
        Continue
      </button>
    </div>
    <canvas id="confetti-canvas" style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:1000, width:"100%", height:"100%" }}/>
  </div>
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
    await supabase.from("profiles").upsert({ id:user.id, full_name:name, neighborhood:hood, bio:bio, avatar_url:profile?.avatar_url });
    onSave({ full_name:name, neighborhood:hood, bio:bio, avatar_url:profile?.avatar_url });
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
  const [authed, setAuthed] = useState(false); const [showIntro, setShowIntro] = useState(()=>{
  return !sessionStorage.getItem("introSeen");
});
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("EN");
  const [dm, setDm] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(()=>{
  return !sessionStorage.getItem("onboardingSeen");
});

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session){ setUser(session.user); setAuthed(true); supabase.from("profiles").update({last_seen:new Date().toISOString()}).eq("id",session.user.id); }
    });
    const { data:{ subscription } } = supabase.auth.onAuthStateChange((_,session)=>{
      if(session){ setUser(session.user); setAuthed(true); }
      else{ setUser(null); setAuthed(false); }
    });
    return ()=>subscription.unsubscribe();
  },[]);

  const handleLogout = async() => { await supabase.auth.signOut(); setAuthed(false); setUser(null); };
  
 if(showIntro) {
  window.__cohoodFinish = () => setShowIntro(false);
  return <CoHoodIntro onFinish={()=>{ sessionStorage.setItem("introSeen","1"); setShowIntro(false); }}/>; }
  if(showOnboarding) return <CoHoodOnboarding onFinish={()=>{ sessionStorage.setItem("onboardingSeen","1"); setShowOnboarding(false); }} lang={lang}/>;
  if(!authed) return <Auth onLogin={(u)=>{ setUser(u); setAuthed(true); }} lang={lang} setLang={setLang}/>;
  return <App2 lang={lang} setLang={setLang} onLogout={handleLogout} dm={dm} setDm={setDm} verified={verified} setVerified={setVerified} user={user}/>;
}
