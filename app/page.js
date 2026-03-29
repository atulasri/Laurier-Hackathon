"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  BookOpen, Calendar, ArrowRight, ArrowLeft, Check,
  ChevronRight, Clock, Zap, LogOut, User,
  Settings, Bell, Eye, EyeOff, Loader2,
  Heart, X, Send, MessageCircle, Target,
  ChevronDown, ChevronUp, Star, UserPlus,
  Users, Plus, Trash2
} from "lucide-react";

// ─── LAURIER DATA ────────────────────────────────────────────────────────────

const PROGRAMS_BY_FACULTY = {
  "Lazarides School of Business & Economics": [
    "Business Administration (BBA)","Accounting & Financial Management",
    "Business Technology Management","Economics","Finance","Marketing",
    "Human Resource Management","Supply Chain Management","Entrepreneurship",
  ],
  "Faculty of Science": [
    "Computer Science","Mathematics","Statistics","Biology","Chemistry",
    "Physics","Biochemistry","Environmental Science",
    "Kinesiology & Physical Education","Neuroscience","Health Sciences",
  ],
  "Faculty of Arts": [
    "Communication Studies","English","History","Philosophy","Political Science",
    "Psychology","Sociology","Religion & Culture","Cultural Studies",
    "Global Studies","Indigenous Studies","Women & Gender Studies",
    "French","Geography","Theatre & Film Studies",
  ],
  "Faculty of Music": ["Music (Performance)","Music (Education)","Music Therapy"],
  "Faculty of Social Work": ["Social Work"],
  "Brantford Campus": [
    "Criminology","Law & Society","Digital Media & Journalism",
    "Human Rights & Human Diversity","Game Design & Development",
    "Policing","Concurrent Education",
  ],
};

const COURSES_BY_PROGRAM = {
  "Computer Science": ["CP104","CP114","CP164","CP213","CP214","CP216","CP264","CP312","CP317","CP321","CP363","CP372","CP386","CP414","CP431","CP440","CP468","CP470","CP476","CS110","CS115","CS116","CS203","CS230","CS235"],
  "Mathematics": ["MA100","MA103","MA104","MA110","MA121","MA122","MA129","MA170","MA205","MA225","MA238","MA240","MA250","MA270","MA271","MA307","MA340","MA341","MA350","MA371","MA405","MA460"],
  "Statistics": ["MA240","MA121","MA122","ST259","ST260","ST361","ST362","ST461","ST462"],
  "Business Administration (BBA)": ["BU111","BU121","BU127","BU131","BU231","BU233","BU247","BU248","BU252","BU253","BU275","BU281","BU283","BU284","BU288","BU352","BU353","BU354","BU355","BU362","BU385","BU395","BU411","BU413","BU421","BU450","BU481"],
  "Accounting & Financial Management": ["BU111","BU121","BU127","BU231","BU247","BU248","BU253","BU283","BU284","BU354","BU355","BU395","BU413","BU450"],
  "Economics": ["EC120","EC140","EC238","EC250","EC255","EC260","EC295","EC355","EC360","EC380","EC395","EC455","EC460","MA121","MA122"],
  "Finance": ["BU111","BU121","BU127","BU231","BU247","BU281","BU288","BU352","BU353","BU362","BU411","BU421"],
  "Marketing": ["BU111","BU121","BU127","BU231","BU252","BU275","BU288","BU352","BU385","BU413","BU421","BU481"],
  "Psychology": ["PS101","PS102","PS200","PS261","PS262","PS270","PS275","PS282","PS295","PS365","PS380","PS381","PS395","PS461","PS481"],
  "Biology": ["BI110","BI111","BI201","BI202","BI236","BI237","BI265","BI266","BI307","BI308","BI328","BI342","BI365","BI366","CH110","CH111","MA121"],
  "Chemistry": ["CH110","CH111","CH202","CH203","CH212","CH213","CH302","CH303","CH350","CH351","MA121","MA122"],
  "Physics": ["PH110","PH111","PH121","PH202","PH203","PH304","PH305","MA121","MA122","MA240"],
  "Biochemistry": ["BI110","BI111","CH110","CH111","CH202","CH203","CH212","CH302","BI201","BI202","MA121"],
  "Kinesiology & Physical Education": ["KP103","KP104","KP205","KP214","KP215","KP222","KP231","KP232","KP304","KP305","KP316","KP322","KP331","KP404","BI110","PS101"],
  "Neuroscience": ["BI110","BI111","CH110","PS101","PS102","PS261","PS275","BI265","KP205","BI307","PS365","PS380","BI342"],
  "Health Sciences": ["HS100","HS102","HS200","HS201","HS210","HS220","HS300","HS310","HS320","HS400","KP103","BI110","PS101"],
  "Environmental Science": ["ES100","ES200","ES201","ES210","ES220","ES300","ES310","ES320","ES400","BI110","CH110","MA121"],
  "Communication Studies": ["CC100","CC110","CC200","CC210","CC220","CC236","CC260","CC300","CC310","CC320","CC340","CC360","CC380","CC400"],
  "English": ["EN100","EN110","EN200","EN210","EN220","EN240","EN260","EN280","EN300","EN320","EN340","EN360","EN380"],
  "History": ["HI100","HI111","HI121","HI200","HI215","HI230","HI260","HI280","HI300","HI320","HI340","HI360","HI380"],
  "Philosophy": ["PL100","PL110","PL130","PL200","PL211","PL221","PL231","PL241","PL300","PL311","PL321","PL401"],
  "Political Science": ["PO101","PO110","PO201","PO210","PO215","PO220","PO261","PO295","PO301","PO321","PO331","PO341","PO361","PO381"],
  "Sociology": ["SO100","SO110","SO200","SO215","SO240","SO260","SO280","SO300","SO310","SO360","SO380","SO400"],
  "Religion & Culture": ["RE100","RE110","RE200","RE210","RE220","RE240","RE260","RE300","RE320","RE340","RE360","RE400"],
  "Cultural Studies": ["CS100","CS200","CS210","CS220","CS240","CS300","CS320","CS400"],
  "Global Studies": ["GS100","GS201","GS210","GS220","GS280","GS300","GS301","GS380","GS400"],
  "Indigenous Studies": ["IS100","IS200","IS210","IS220","IS300","IS320","IS400"],
  "Women & Gender Studies": ["WS100","WS200","WS210","WS220","WS300","WS320","WS400"],
  "French": ["FR100","FR110","FR200","FR210","FR220","FR300","FR310","FR400"],
  "Geography": ["GG100","GG110","GG200","GG210","GG220","GG300","GG310","GG400"],
  "Theatre & Film Studies": ["TF100","TF110","TF200","TF210","TF220","TF300","TF320","TF400"],
  "Music (Performance)": ["MU100","MU110","MU120","MU200","MU210","MU220","MU230","MU240","MU300","MU310","MU320","MU340"],
  "Music (Education)": ["MU100","MU110","MU200","MU230","MU240","MU300","MU320","MU340","MU400"],
  "Music Therapy": ["MU100","MU110","MU200","MU210","MU300","MU310","MU340","MU400","MU410"],
  "Social Work": ["SW101","SW200","SW201","SW211","SW221","SW301","SW311","SW321","SW331","SW401"],
  "Criminology": ["CR100","CR200","CR210","CR220","CR240","CR300","CR310","CR320","CR400","CR410","SO100","PO101"],
  "Law & Society": ["LS100","LS200","LS210","LS220","LS300","LS310","LS320","LS400"],
  "Digital Media & Journalism": ["DJ100","DJ110","DJ200","DJ210","DJ220","DJ300","DJ310","DJ320","DJ400"],
  "Human Rights & Human Diversity": ["HR100","HR200","HR210","HR220","HR300","HR320","HR400"],
  "Game Design & Development": ["GD100","GD110","GD200","GD210","GD220","GD300","GD320","GD400","CP104","CP164"],
  "Policing": ["PL100","PL200","PL210","PL220","PL300","PL310","PL400","CR100","CR200"],
  "Human Resource Management": ["BU111","BU121","BU127","BU231","BU288","BU352","BU353","BU362","BU385","BU421"],
  "Supply Chain Management": ["BU111","BU121","BU127","BU231","BU247","BU252","BU288","BU352","BU395","BU421"],
  "Entrepreneurship": ["BU111","BU121","BU127","BU231","BU275","BU288","BU352","BU385","BU421","BU481"],
  "Business Technology Management": ["BU111","BU121","BU127","BU231","BU247","BU288","CP104","CP164","BU352","BU395"],
  "Concurrent Education": ["ED100","ED200","ED210","ED220","ED300","ED310","ED320","ED400"],
};

const YEARS            = ["1st Year","2nd Year","3rd Year","4th Year","Graduate","Exchange Student"];
const MOTIVATIONS      = ["Ace the midterm","Prepare for finals","Complete assignments together","Understand concepts deeply","Get ahead of the material","Improve my grades","Stay accountable","Practice problems","Review lecture notes","Meet new people","Build study habits","Teach & reinforce my knowledge","Survive the semester"];
const GENDERS          = ["Man","Woman","Non-binary","Prefer not to say"];
const GENDER_PREFS     = ["No preference","Men only","Women only","Non-binary only","Men & Women","Any"];
const AVAILABILITY_SLOTS = ["Mon Morning","Mon Afternoon","Mon Evening","Tue Morning","Tue Afternoon","Tue Evening","Wed Morning","Wed Afternoon","Wed Evening","Thu Morning","Thu Afternoon","Thu Evening","Fri Morning","Fri Afternoon","Fri Evening","Sat Morning","Sat Afternoon","Sat Evening","Sun Morning","Sun Afternoon","Sun Evening"];
const ALL_COURSES      = [...new Set(Object.values(COURSES_BY_PROGRAM).flat())].sort();

// ─── MATCHING LOGIC ──────────────────────────────────────────────────────────

function scoreMatch(myProfile, theirProfile) {
  const sharedCourses = (myProfile.courses || []).filter(c => (theirProfile.courses || []).includes(c));
  if (sharedCourses.length === 0) return 0;
  let score = 0;
  const mySlots = new Set(myProfile.availability || []);
  const theirSlots = theirProfile.availability || [];
  score += (theirSlots.filter(s => mySlots.has(s)).length / Math.max(mySlots.size, theirSlots.length, 1)) * 30;
  if (myProfile.meeting_preference && theirProfile.meeting_preference) {
    if (myProfile.meeting_preference === theirProfile.meeting_preference) score += 25;
    else if (myProfile.meeting_preference === "Hybrid" || theirProfile.meeting_preference === "Hybrid") score += 12;
  }
  const myMotivs = new Set(myProfile.motivations || []);
  const theirMotivs = theirProfile.motivations || [];
  score += (theirMotivs.filter(m => myMotivs.has(m)).length / Math.max(myMotivs.size, theirMotivs.length, 1)) * 20;
  score += Math.min(sharedCourses.length / Math.max((myProfile.courses || []).length, 1), 1) * 15;
  if (myProfile.year    && myProfile.year    === theirProfile.year)    score += 5;
  if (myProfile.program && myProfile.program === theirProfile.program) score += 5;
  return Math.min(Math.round(score), 100);
}

function meetsGenderPreference(myProfile, theirProfile) {
  const pref = myProfile.gender_preference;
  if (!pref || pref === "No preference" || pref === "Any") return true;
  const g = theirProfile.gender;
  if (!g) return true;
  if (pref === "Men only")        return g === "Man";
  if (pref === "Women only")      return g === "Woman";
  if (pref === "Non-binary only") return g === "Non-binary";
  if (pref === "Men & Women")     return ["Man","Woman"].includes(g);
  return true;
}

// ─── SMALL REUSABLE COMPONENTS ───────────────────────────────────────────────

function AvatarBubble({ initials = "??", size = "md" }) {
  const sizes    = { sm:"w-8 h-8 text-xs", md:"w-11 h-11 text-sm", lg:"w-16 h-16 text-xl", xl:"w-20 h-20 text-2xl" };
  const palettes = ["from-indigo-500 to-violet-600","from-cyan-500 to-blue-600","from-emerald-500 to-teal-600","from-rose-500 to-pink-600","from-amber-500 to-orange-600"];
  const palette  = palettes[(initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % palettes.length];
  return (
    <div className={`${sizes[size]} bg-gradient-to-br ${palette} rounded-full flex items-center justify-center text-white font-black flex-shrink-0`}>
      {initials}
    </div>
  );
}

function MatchBadge({ score }) {
  const style = score >= 80 ? "text-emerald-300 bg-emerald-400/10 border-emerald-400/25"
    : score >= 60 ? "text-amber-300 bg-amber-400/10 border-amber-400/25"
    : "text-pink-100/70 bg-pink-200/10 border-pink-200/15";
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${style}`}>{score}% match</span>;
}

function Chip({ children, selected, onClick }) {
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
      selected
        ? "bg-pink-600 text-white border-pink-500 shadow-lg shadow-pink-500/20"
        : "bg-pink-200/10 text-pink-100/75 border-pink-200/10 hover:border-pink-400/50 hover:text-white"
    }`}>
      {children}
    </button>
  );
}

function Tag({ children }) {
  return <span className="text-xs bg-pink-500/10 text-pink-200 border border-pink-400/20 px-2 py-0.5 rounded-full">{children}</span>;
}

function Card({ children, className = "" }) {
  return <div className={`bg-pink-500/10 border border-pink-200/15 rounded-2xl backdrop-blur-xl ${className}`}>{children}</div>;
}

function InputField({ label, type = "text", value, onChange, placeholder, rightElement }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-pink-100/70 mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          className="w-full bg-white/10 border border-pink-200/10 focus:border-pink-400 text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder-pink-100/30 pr-12" />
        {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>}
      </div>
    </div>
  );
}

// ─── BOTTOM NAVBAR ───────────────────────────────────────────────────────────
// FIX: restored "Friends" tab that was missing from the merged version

function Navbar({ currentPage, onNavigate, unreadCount = 0 }) {
  const tabs = [
    { id:"browse",        label:"Discover",  emoji:"🔍" },
    { id:"notifications", label:"Alerts",    emoji:"🔔", badge: unreadCount },
    { id:"friends",       label:"Friends",   emoji:"👥" },
    { id:"chats",         label:"Messages",  emoji:"💬" },
    { id:"account",       label:"Profile",   emoji:"👤" },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1b0718]/85 backdrop-blur-xl border-t border-pink-200/10 flex">
      {tabs.map(({ id, label, emoji, badge }) => {
        const active = currentPage === id;
        return (
          <button key={id} onClick={() => onNavigate(id)} className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-all relative ${active ? "text-pink-400" : "text-pink-100/35 hover:text-pink-100/70"}`}>
            <span className="text-base leading-none">{emoji}</span>
            <span className="text-[9px] font-medium">{label}</span>
            {badge > 0 && (
              <span className="absolute top-1.5 right-[14%] w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                {badge > 9 ? "9+" : badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ─── PAGE: LANDING ───────────────────────────────────────────────────────────

function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-950 via-fuchsia-950 to-pink-950 text-white flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-pink-500/12 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-16 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl" />
      </div>
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-black text-lg tracking-tight">StudySync</span>
        </div>
        <button onClick={onGetStarted} className="text-sm text-pink-200/80 hover:text-white transition-colors">Sign In →</button>
      </header>
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center pb-16">
        <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-400/20 rounded-full px-4 py-1.5 text-pink-300 text-xs font-medium mb-8">
          <Heart size={12} className="text-amber-400 fill-amber-400" /> Made for Laurier study matches
        </div>
        <h1 className="text-5xl md:text-6xl font-black mb-5 leading-[1.05] tracking-tight max-w-4xl">
          Find your perfect<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-400 to-fuchsia-400">study match</span>
        </h1>
        <p className="text-pink-100/70 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Match with classmates who share your courses, schedule, and study vibe. Find your perfect study partner and never study alone again.
        </p>
        <button onClick={onGetStarted} className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white font-bold px-8 py-4 rounded-2xl transition-all text-base shadow-xl shadow-pink-500/25 hover:-translate-y-0.5">
          Find My Match <ArrowRight size={18} />
        </button>
        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto mt-16">
          {[
            { emoji:"💖", step:"01", title:"Make your profile",  desc:"Add your courses, vibe, and schedule" },
            { emoji:"🔎", step:"02", title:"Discover matches",   desc:"Find students you actually click with" },
            { emoji:"💬", step:"03", title:"Start chatting",     desc:"Message, meet up, and study together" },
          ].map(({ emoji, step, title, desc }) => (
            <div key={step} className="bg-white/[0.04] border border-pink-300/10 rounded-2xl p-4 text-center backdrop-blur-sm">
              <div className="text-2xl mb-2">{emoji}</div>
              <div className="text-pink-400 text-[10px] font-bold mb-1">{step}</div>
              <div className="text-white text-xs font-semibold mb-0.5">{title}</div>
              <div className="text-pink-100/45 text-[10px]">{desc}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ─── PAGE: LOGIN / SIGN UP ───────────────────────────────────────────────────

function LoginPage({ onAuthSuccess }) {
  const [mode,        setMode]        = useState("signin");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [info,        setInfo]        = useState("");
  const isSignUp = mode === "signup";

  const handleSubmit = async () => {
    setError(""); setInfo("");
    if (!email || !password)             { setError("Please fill in all fields."); return; }
    if (isSignUp && !displayName.trim()) { setError("Please enter your name."); return; }
    if (password.length < 6)            { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    if (isSignUp) {
      const { data, error: err } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName.trim() } } });
      if (err) { setError(err.message); setLoading(false); return; }
      if (data?.user?.identities?.length === 0) setError("An account with this email already exists.");
      else if (data?.session) onAuthSuccess(data.session.user);
      else { setInfo("Account created! Check your email to confirm, then sign in."); setMode("signin"); }
    } else {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError(err.message); setLoading(false); return; }
      onAuthSuccess(data.user);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-950 via-fuchsia-950 to-pink-950 flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-pink-600 to-rose-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-pink-500/30">
            <Zap size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">{isSignUp ? "Create your study match profile" : "Welcome back"}</h1>
          <p className="text-pink-100/60 text-sm mt-1">{isSignUp ? "Create your profile and start matching with study partners" : "Sign in to reconnect with your study matches"}</p>
        </div>
        <Card className="p-6 space-y-4">
          {isSignUp && <InputField label="Your Name" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="e.g. Alex Chen" />}
          <InputField label="Student Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@mylaurier.ca" />
          <InputField label="Password" type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
            placeholder={isSignUp ? "Choose a password (6+ chars)" : "Your password"}
            rightElement={<button onClick={() => setShowPass(p => !p)} className="text-pink-100/40 hover:text-pink-200 transition-colors">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
          />
          {error && <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-2.5 text-red-400 text-xs">{error}</div>}
          {info  && <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-4 py-2.5 text-emerald-400 text-xs">{info}</div>}
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Please wait…" : isSignUp ? "Create Account" : "Sign In →"}
          </button>
        </Card>
        <p className="text-center text-pink-100/55 text-sm mt-5">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => { setMode(isSignUp ? "signin" : "signup"); setError(""); setInfo(""); }} className="text-pink-400 hover:text-pink-300 font-semibold">{isSignUp ? "Sign in" : "Sign up"}</button>
        </p>
        <p className="text-center text-pink-100/25 text-xs mt-3">Powered by Supabase Auth · data is real and saved</p>
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────

const TOTAL_STEPS = 6;

function StepHeader({ step, title, subtitle, icon: Icon }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-1 mb-5">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < step ? "bg-pink-500" : "bg-pink-200/10"}`} />
        ))}
      </div>
      <div className="flex items-center gap-2 mb-1">
        <Icon size={15} className="text-pink-400" />
        <span className="text-pink-400 text-xs font-bold uppercase tracking-widest">Step {step} of {TOTAL_STEPS}</span>
      </div>
      <h2 className="text-2xl font-black text-white">{title}</h2>
      {subtitle && <p className="text-pink-100/60 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

function NavButtons({ onBack, onNext, canNext, nextLabel = "Continue" }) {
  return (
    <div className="flex gap-3 mt-6">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-pink-200/15 text-pink-100/65 hover:text-white hover:border-pink-300/40 transition-all text-sm font-medium">
          <ArrowLeft size={15} /> Back
        </button>
      )}
      <button onClick={onNext} disabled={!canNext}
        className="flex-1 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-500 disabled:bg-pink-900/40 disabled:text-pink-100/30 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all text-sm shadow-lg shadow-pink-500/20">
        {nextLabel} <ArrowRight size={16} />
      </button>
    </div>
  );
}

// ─── COURSE PICKER STEP ──────────────────────────────────────────────────────

function CoursePickerStep({ courses, setCourses, program, onBack, onNext }) {
  const [search,      setSearch]      = useState("");
  const [customInput, setCustomInput] = useState("");
  const [showAll,     setShowAll]     = useState(false);

  const programCourses = COURSES_BY_PROGRAM[program] || [];
  const pool     = showAll || programCourses.length === 0 ? ALL_COURSES : programCourses;
  const filtered = search.trim() ? ALL_COURSES.filter(c => c.toLowerCase().includes(search.toLowerCase())) : pool;

  const toggleCourse = c => setCourses(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const addCustom = () => {
    const val = customInput.trim().toUpperCase().replace(/\s+/g, "");
    if (!val) return;
    if (!courses.includes(val)) setCourses(prev => [...prev, val]);
    setCustomInput("");
  };

  return (
    <div>
      <StepHeader step={3} icon={BookOpen} title="Which courses are you in?" subtitle="Select from the list or type any course code." />

      {/* Search */}
      <div className="relative mb-3">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search course codes…"
          className="w-full bg-white/10 border border-pink-200/10 focus:border-pink-400 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors placeholder-pink-100/30 pr-10" />
        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-100/40 hover:text-white"><X size={14} /></button>}
      </div>

      {/* Toggle all / program only */}
      {programCourses.length > 0 && !search && (
        <button onClick={() => setShowAll(a => !a)}
          className="text-pink-400 hover:text-pink-300 text-xs font-semibold mb-3 flex items-center gap-1 transition-colors">
          {showAll ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {showAll ? `Show ${program} courses only` : "Browse all Laurier courses"}
        </button>
      )}

      {!search && (
        <p className="text-pink-100/40 text-[10px] font-bold uppercase tracking-widest mb-2">
          {showAll || programCourses.length === 0 ? "All Laurier Courses" : `${program} Courses`}
        </p>
      )}

      {/* Course chips */}
      <div className="flex flex-wrap gap-2 max-h-[35vh] overflow-y-auto pr-1 mb-4">
        {filtered.length === 0
          ? <p className="text-pink-100/40 text-sm">No matches for "{search}". Add it manually below.</p>
          : filtered.map(c => <Chip key={c} selected={courses.includes(c)} onClick={() => toggleCourse(c)}>{c}</Chip>)
        }
      </div>

      {/* Custom course input */}
      <div className="mb-1">
        <p className="text-pink-100/50 text-xs font-semibold uppercase tracking-wider mb-2">Add any course manually</p>
        <div className="flex gap-2">
          <input value={customInput} onChange={e => setCustomInput(e.target.value.toUpperCase())}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
            placeholder="e.g. CP999" maxLength={8}
            className="flex-1 bg-white/10 border border-pink-200/10 focus:border-pink-400 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors placeholder-pink-100/30" />
          <button onClick={addCustom} disabled={!customInput.trim()}
            className="px-4 py-2.5 bg-pink-600 hover:bg-pink-500 disabled:opacity-30 text-white text-sm font-bold rounded-xl transition-all flex-shrink-0">
            Add
          </button>
        </div>
      </div>

      {/* Selected summary — tap to remove */}
      {courses.length > 0 && (
        <div className="mt-3">
          <p className="text-pink-400 text-xs font-semibold mb-2">{courses.length} selected (tap to remove):</p>
          <div className="flex flex-wrap gap-1.5">
            {courses.map(c => (
              <button key={c} onClick={() => toggleCourse(c)}
                className="flex items-center gap-1 text-xs bg-pink-600/20 text-pink-300 border border-pink-500/30 px-2.5 py-1 rounded-full hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all">
                {c} <X size={10} />
              </button>
            ))}
          </div>
        </div>
      )}

      <NavButtons onBack={onBack} onNext={onNext} canNext={courses.length > 0} />
    </div>
  );
}

// ─── ONBOARDING FLOW ─────────────────────────────────────────────────────────
// FIX: step 3 now uses <CoursePickerStep> instead of the old limited chip list

function OnboardingFlow({ savedProfile, onComplete }) {
  const s = savedProfile || {};
  const [step,         setStep]         = useState(1);
  const [program,      setProgram]      = useState(s.program            || "");
  const [year,         setYear]         = useState(s.year               || "");
  const [courses,      setCourses]      = useState(s.courses            || []);
  const [motivations,  setMotivations]  = useState(s.motivations        || []);
  const [meetingPref,  setMeetingPref]  = useState(s.meeting_preference || "");
  const [availability, setAvailability] = useState(s.availability       || []);
  const [gender,       setGender]       = useState(s.gender             || "");
  const [genderPref,   setGenderPref]   = useState(s.gender_preference  || "No preference");
  const [saving,       setSaving]       = useState(false);

  const toggleArr = (setter, val) => setter(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  const finish = async () => {
    setSaving(true);
    await onComplete({ program, year, courses, motivations, meeting_preference: meetingPref, availability, gender, gender_preference: genderPref });
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-950 via-fuchsia-950 to-pink-950 text-white pb-10">
      <div className="max-w-lg mx-auto px-5 pt-10">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 bg-pink-600 rounded-lg flex items-center justify-center"><Zap size={13} className="text-white" /></div>
          <span className="font-black text-base tracking-tight">StudySync</span>
        </div>

        {step === 1 && (
          <div>
            <StepHeader step={1} icon={User} title="What's your program?" subtitle="Select your degree at Laurier." />
            <div className="space-y-5 max-h-[55vh] overflow-y-auto pr-1">
              {Object.entries(PROGRAMS_BY_FACULTY).map(([faculty, programs]) => (
                <div key={faculty}>
                  <p className="text-pink-100/40 text-[10px] font-bold uppercase tracking-widest mb-2">{faculty}</p>
                  <div className="flex flex-wrap gap-2">
                    {programs.map(p => <Chip key={p} selected={program === p} onClick={() => setProgram(p)}>{p}</Chip>)}
                  </div>
                </div>
              ))}
            </div>
            <NavButtons onNext={() => setStep(2)} canNext={!!program} />
          </div>
        )}

        {step === 2 && (
          <div>
            <StepHeader step={2} icon={User} title="What year are you in?" subtitle="Helps match you with students at a similar stage." />
            <div className="flex flex-wrap gap-3">{YEARS.map(y => <Chip key={y} selected={year === y} onClick={() => setYear(y)}>{y}</Chip>)}</div>
            <NavButtons onBack={() => setStep(1)} onNext={() => setStep(3)} canNext={!!year} />
          </div>
        )}

        {step === 3 && (
          <CoursePickerStep
            courses={courses} setCourses={setCourses} program={program}
            onBack={() => setStep(2)} onNext={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <div>
            <StepHeader step={4} icon={Target} title="Why do you want to study?" subtitle="Pick everything that applies. You'll match with people who share your goals." />
            <div className="flex flex-wrap gap-2">
              {MOTIVATIONS.map(m => <Chip key={m} selected={motivations.includes(m)} onClick={() => toggleArr(setMotivations, m)}>{m}</Chip>)}
            </div>
            {motivations.length > 0 && <p className="text-pink-400 text-xs mt-3">{motivations.length} selected</p>}
            <NavButtons onBack={() => setStep(3)} onNext={() => setStep(5)} canNext={motivations.length > 0} />
          </div>
        )}

        {step === 5 && (
          <div>
            <StepHeader step={5} icon={Calendar} title="Schedule & format" subtitle="Where do you want to meet, and when are you free?" />
            <p className="text-pink-100/50 text-xs font-semibold uppercase tracking-wider mb-2">Meeting Format</p>
            <div className="flex gap-2 mb-6">
              {["In-Person","Online","Hybrid"].map(p => <Chip key={p} selected={meetingPref === p} onClick={() => setMeetingPref(p)}>{p}</Chip>)}
            </div>
            <p className="text-pink-100/50 text-xs font-semibold uppercase tracking-wider mb-2">Availability</p>
            <div className="flex flex-wrap gap-2 max-h-[38vh] overflow-y-auto pr-1">
              {AVAILABILITY_SLOTS.map(s => <Chip key={s} selected={availability.includes(s)} onClick={() => toggleArr(setAvailability, s)}>{s}</Chip>)}
            </div>
            {availability.length > 0 && <p className="text-pink-400 text-xs mt-3">{availability.length} slot{availability.length > 1 ? "s" : ""} selected</p>}
            <NavButtons onBack={() => setStep(4)} onNext={() => setStep(6)} canNext={!!meetingPref && availability.length > 0} />
          </div>
        )}

        {step === 6 && (
          <div>
            <StepHeader step={6} icon={User} title="A couple more things" subtitle="Optional — helps with comfort and preferences." />
            <p className="text-pink-100/50 text-xs font-semibold uppercase tracking-wider mb-2">Your Gender</p>
            <div className="flex flex-wrap gap-2 mb-6">{GENDERS.map(g => <Chip key={g} selected={gender === g} onClick={() => setGender(g)}>{g}</Chip>)}</div>
            <p className="text-pink-100/50 text-xs font-semibold uppercase tracking-wider mb-2">Study Partner Gender Preference</p>
            <div className="flex flex-wrap gap-2">{GENDER_PREFS.map(p => <Chip key={p} selected={genderPref === p} onClick={() => setGenderPref(p)}>{p}</Chip>)}</div>
            <NavButtons onBack={() => setStep(5)} onNext={finish} canNext={true} nextLabel={saving ? "Saving…" : "Find My Matches ✦"} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PAGE: BROWSE MATCHES ────────────────────────────────────────────────────
// FIX: restored "Add Friend" secondary button that was dropped in the merge

function BrowseMatchesPage({ myProfile, myUserId }) {
  const [candidates,    setCandidates]    = useState([]);
  const [idx,           setIdx]           = useState(0);
  const [loading,       setLoading]       = useState(true);
  const [expanded,      setExpanded]      = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [friendLoading, setFriendLoading] = useState(false);
  const [toast,         setToast]         = useState(null);
  const [friendedIds,   setFriendedIds]   = useState(new Set());

  useEffect(() => {
    if (!myProfile) return;
    (async () => {
      setLoading(true);
      const { data: profiles }       = await supabase.from("profiles").select("*").neq("id", myUserId);
      const { data: existingMatches} = await supabase.from("matches").select("sender_id, receiver_id, status, updated_at").or(`sender_id.eq.${myUserId},receiver_id.eq.${myUserId}`);
      const { data: existingFriends} = await supabase.from("friendships").select("sender_id, receiver_id, status").or(`sender_id.eq.${myUserId},receiver_id.eq.${myUserId}`);

      const excludeIds = new Set();
      const TWO_WEEKS  = 14 * 24 * 60 * 60 * 1000;
      const now        = Date.now();
      (existingMatches || []).forEach(m => {
        const otherId = m.sender_id === myUserId ? m.receiver_id : m.sender_id;
        if (m.status === "accepted" || m.status === "pending") excludeIds.add(otherId);
        else if (m.status === "declined" && now - new Date(m.updated_at).getTime() < TWO_WEEKS) excludeIds.add(otherId);
      });

      const fIds = new Set();
      (existingFriends || []).forEach(f => {
        fIds.add(f.sender_id === myUserId ? f.receiver_id : f.sender_id);
      });
      setFriendedIds(fIds);

      const scored = (profiles || [])
        .filter(p => !excludeIds.has(p.id))
        .filter(p => meetsGenderPreference(myProfile, p))
        .map(p => ({ ...p, score: scoreMatch(myProfile, p) }))
        .filter(p => p.score > 0)
        .sort((a, b) => b.score - a.score);

      setCandidates(scored);
      setLoading(false);
    })();
  }, [myProfile, myUserId]);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const sendMatchRequest = async (toProfile) => {
    setActionLoading(true);
    const { data: match, error } = await supabase
      .from("matches").insert({ sender_id: myUserId, receiver_id: toProfile.id, status: "pending" }).select().single();
    if (!error && match) {
      await supabase.from("notifications").insert({ user_id: toProfile.id, type: "match_request", from_user_id: myUserId, match_id: match.id });
      showToast(`Match request sent to ${toProfile.display_name || "them"}! 🎉`);
    }
    setActionLoading(false); setIdx(i => i + 1); setExpanded(false);
  };

  const sendFriendRequest = async (toProfile) => {
    if (friendedIds.has(toProfile.id)) { showToast("Friend request already sent!"); return; }
    setFriendLoading(true);
    const { data: friendship, error } = await supabase
      .from("friendships").insert({ sender_id: myUserId, receiver_id: toProfile.id, status: "pending" }).select().single();
    if (!error && friendship) {
      await supabase.from("notifications").insert({ user_id: toProfile.id, type: "friend_request", from_user_id: myUserId, match_id: friendship.id });
      setFriendedIds(prev => new Set([...prev, toProfile.id]));
      showToast(`Friend request sent to ${toProfile.display_name || "them"}! 👋`);
    }
    setFriendLoading(false);
  };

  const skip = () => { setIdx(i => i + 1); setExpanded(false); };

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 size={28} className="text-pink-500 animate-spin" /></div>;
  if (!myProfile?.courses?.length) return <div className="py-20 text-center px-8"><p className="text-pink-100/60 text-sm">Complete your profile to see matches.</p></div>;

  const current = candidates[idx];
  if (!current) {
    return (
      <div className="py-20 text-center px-8">
        <div className="text-5xl mb-4">🎓</div>
        <h3 className="text-white font-bold text-lg mb-2">You've seen everyone!</h3>
        <p className="text-pink-100/55 text-sm max-w-xs mx-auto">New students join every day. Check back soon.</p>
      </div>
    );
  }

  const initials      = (current.display_name || "??").slice(0, 2).toUpperCase();
  const sharedCourses = (myProfile.courses || []).filter(c => (current.courses || []).includes(c));
  const alreadyFriended = friendedIds.has(current.id);

  return (
    <div className="relative max-w-lg mx-auto px-5 pb-6">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl shadow-xl animate-bounce">{toast}</div>
      )}

      <div className="flex items-center justify-between mb-4">
        <span className="text-pink-100/45 text-xs">{idx + 1} / {candidates.length} potential matches</span>
        <MatchBadge score={current.score} />
      </div>

      <div className="bg-gradient-to-br from-pink-400/10 to-rose-400/10 border border-pink-200/15 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl shadow-pink-900/20">
        <div className="bg-gradient-to-br from-pink-500/15 via-rose-500/10 to-transparent px-6 py-8 flex flex-col items-center text-center">
          <AvatarBubble initials={initials} size="xl" />
          <h2 className="text-xl font-black text-white mt-4">{current.display_name || "Student"}</h2>
          <p className="text-pink-100/65 text-sm mt-0.5">{current.program} · {current.year}</p>
          {current.bio && <p className="text-pink-100/80 text-sm mt-3 leading-relaxed max-w-xs">{current.bio}</p>}
        </div>
        <div className="px-6 pb-5 space-y-4">
          <div>
            <p className="text-pink-100/45 text-[10px] font-bold uppercase tracking-widest mb-2">Shared Courses</p>
            <div className="flex flex-wrap gap-1.5">{sharedCourses.map(c => <Tag key={c}>{c}</Tag>)}</div>
          </div>
          {(current.motivations || []).length > 0 && (
            <div>
              <p className="text-pink-100/45 text-[10px] font-bold uppercase tracking-widest mb-2">Goals</p>
              <div className="flex flex-wrap gap-1.5">{(current.motivations || []).slice(0, 4).map(m => <Tag key={m}>{m}</Tag>)}</div>
            </div>
          )}
          <div className="flex gap-4 text-xs text-pink-100/55">
            <span>📍 {current.meeting_preference || "—"}</span>
            <span>🕐 {(current.availability || []).length} slots free</span>
          </div>
          <button onClick={() => setExpanded(e => !e)} className="flex items-center gap-1 text-pink-400 text-xs font-medium">
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />} {expanded ? "Hide" : "Show"} availability
          </button>
          {expanded && <div className="flex flex-wrap gap-1.5">{(current.availability || []).map(s => <Tag key={s}>{s}</Tag>)}</div>}
        </div>
      </div>

      {/* Primary actions */}
      <div className="flex gap-3 mt-4">
        <button onClick={skip} disabled={actionLoading}
          className="flex-1 flex items-center justify-center gap-2 border border-pink-200/15 hover:border-pink-300/40 hover:bg-pink-500/5 text-pink-100/70 hover:text-white font-semibold py-3.5 rounded-2xl transition-all">
          <X size={18} /> Skip
        </button>
        <button onClick={() => sendMatchRequest(current)} disabled={actionLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-pink-500/20">
          {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Heart size={18} />} Match
        </button>
      </div>

      {/* Secondary: Add Friend */}
      <div className="flex justify-center mt-3">
        <button onClick={() => sendFriendRequest(current)} disabled={friendLoading || alreadyFriended}
          className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-all border ${
            alreadyFriended
              ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5 cursor-default"
              : "border-pink-200/15 hover:border-pink-400/40 text-pink-100/60 hover:text-pink-300 hover:bg-pink-500/5"
          }`}>
          {friendLoading ? <Loader2 size={12} className="animate-spin" /> : <UserPlus size={13} />}
          {alreadyFriended ? "Friend request sent" : "Add Friend"}
        </button>
      </div>
    </div>
  );
}

// ─── PAGE: NOTIFICATIONS ─────────────────────────────────────────────────────
// FIX: removed rogue "groups" tab code that had leaked in from FriendsPage
// FIX: added friend_request / friend_accepted / friend_declined / group_invite handling

function NotificationsPage({ myUserId, onOpenChat }) {
  const [tab,           setTab]           = useState("inbox");
  const [notifications, setNotifications] = useState([]);
  const [pending,       setPending]       = useState([]);
  const [loading,       setLoading]       = useState(true);

  const loadInbox = async () => {
    const { data } = await supabase
      .from("notifications")
      .select("*, from_profile:from_user_id(display_name, program, year)")
      .eq("user_id", myUserId).order("created_at", { ascending: false });
    setNotifications(data || []);
  };

  const loadPending = async () => {
    const { data } = await supabase
      .from("matches")
      .select("*, receiver:receiver_id(display_name, program, year, courses, meeting_preference)")
      .eq("sender_id", myUserId).eq("status", "pending").order("created_at", { ascending: false });
    setPending(data || []);
  };

  const load = async () => { setLoading(true); await Promise.all([loadInbox(), loadPending()]); setLoading(false); };

  useEffect(() => {
    load();
    const notifCh = supabase.channel("notifs:" + myUserId)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${myUserId}` }, () => loadInbox())
      .subscribe();
    const matchCh = supabase.channel("pending-matches:" + myUserId)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "matches" }, () => loadPending())
      .subscribe();
    return () => { supabase.removeChannel(notifCh); supabase.removeChannel(matchCh); };
  }, [myUserId]);

  const markRead = async id => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  };

  const acceptMatch = async (notif) => {
    await supabase.from("matches").update({ status: "accepted", updated_at: new Date().toISOString() }).eq("id", notif.match_id);
    await supabase.from("notifications").insert({ user_id: notif.from_user_id, type: "match_accepted", from_user_id: myUserId, match_id: notif.match_id });
    await markRead(notif.id); load();
  };

  const declineMatch = async (notif) => {
    await supabase.from("matches").update({ status: "declined", updated_at: new Date().toISOString() }).eq("id", notif.match_id);
    await supabase.from("notifications").insert({ user_id: notif.from_user_id, type: "match_declined", from_user_id: myUserId, match_id: notif.match_id });
    await markRead(notif.id); load();
  };

  const acceptFriend = async (notif) => {
    await supabase.from("friendships").update({ status: "accepted", updated_at: new Date().toISOString() }).eq("id", notif.match_id);
    await supabase.from("notifications").insert({ user_id: notif.from_user_id, type: "friend_accepted", from_user_id: myUserId, match_id: notif.match_id });
    await markRead(notif.id); loadInbox();
  };

  const declineFriend = async (notif) => {
    await supabase.from("friendships").update({ status: "declined", updated_at: new Date().toISOString() }).eq("id", notif.match_id);
    await markRead(notif.id); loadInbox();
  };

  const cancelRequest = async (matchId) => {
    await supabase.from("matches").delete().eq("id", matchId);
    setPending(p => p.filter(m => m.id !== matchId));
  };

  const inboxUnread = notifications.filter(n => !n.read).length;

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={24} className="text-pink-500 animate-spin" /></div>;

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-1 bg-pink-200/10 p-1 rounded-xl mb-5 border border-pink-200/10 backdrop-blur-xl">
        <button onClick={() => setTab("inbox")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${tab === "inbox" ? "bg-pink-600 text-white shadow" : "text-pink-100/55 hover:text-white"}`}>
          Inbox {inboxUnread > 0 && <span className="w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">{inboxUnread > 9 ? "9+" : inboxUnread}</span>}
        </button>
        <button onClick={() => setTab("pending")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${tab === "pending" ? "bg-pink-600 text-white shadow" : "text-pink-100/55 hover:text-white"}`}>
          Pending {pending.length > 0 && <span className={`w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center ${tab === "pending" ? "bg-white/20" : "bg-amber-500"}`}>{pending.length}</span>}
        </button>
      </div>

      {/* ── INBOX ── */}
      {tab === "inbox" && (
        <>
          {notifications.length === 0 ? (
            <div className="py-20 text-center px-8"><div className="text-4xl mb-3">🔔</div><p className="text-pink-100/55 text-sm">No notifications yet. Start discovering people!</p></div>
          ) : (
            <div className="space-y-3">
              {notifications.map(n => {
                const name     = n.from_profile?.display_name || "Someone";
                const initials = name.slice(0, 2).toUpperCase();
                const unread   = !n.read;
                return (
                  <div key={n.id} className={`bg-pink-500/10 border rounded-2xl p-4 transition-all backdrop-blur-xl ${unread ? "border-pink-500/30" : "border-pink-200/10"}`}>
                    <div className="flex items-start gap-3">
                      <AvatarBubble initials={initials} size="sm" />
                      <div className="flex-1 min-w-0">
                        {/* Study match request */}
                        {n.type === "match_request" && (<>
                          <p className="text-white text-sm font-semibold">{name} wants to study with you!</p>
                          <p className="text-pink-100/55 text-xs mt-0.5">{n.from_profile?.program} · {n.from_profile?.year}</p>
                          <div className="flex gap-2 mt-3">
                            <button onClick={() => acceptMatch(n)} className="flex items-center gap-1.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all"><Check size={12} /> Accept</button>
                            <button onClick={() => declineMatch(n)} className="flex items-center gap-1.5 border border-pink-200/15 hover:border-red-500/40 text-pink-100/60 hover:text-red-400 text-xs font-medium px-3 py-1.5 rounded-xl transition-all"><X size={12} /> Decline</button>
                          </div>
                        </>)}
                        {n.type === "match_accepted" && (<>
                          <p className="text-emerald-400 text-sm font-semibold">{name} accepted your study match! 🎉</p>
                          <p className="text-pink-100/55 text-xs mt-0.5">You can now message each other</p>
                          <button onClick={() => { markRead(n.id); onOpenChat(n.match_id, n.from_user_id, name); }}
                            className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-xl mt-3 transition-all">
                            <MessageCircle size={12} /> Open Chat
                          </button>
                        </>)}
                        {n.type === "match_declined" && <p className="text-pink-100/55 text-sm">{name} is not available right now. You'll see them again in 2 weeks.</p>}

                        {/* Friend request */}
                        {n.type === "friend_request" && (<>
                          <p className="text-white text-sm font-semibold">{name} sent you a friend request 👋</p>
                          <p className="text-pink-100/55 text-xs mt-0.5">{n.from_profile?.program} · {n.from_profile?.year}</p>
                          <div className="flex gap-2 mt-3">
                            <button onClick={() => acceptFriend(n)} className="flex items-center gap-1.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all"><Check size={12} /> Accept</button>
                            <button onClick={() => declineFriend(n)} className="flex items-center gap-1.5 border border-pink-200/15 hover:border-red-500/40 text-pink-100/60 hover:text-red-400 text-xs font-medium px-3 py-1.5 rounded-xl transition-all"><X size={12} /> Decline</button>
                          </div>
                        </>)}
                        {n.type === "friend_accepted" && <p className="text-emerald-400 text-sm font-semibold">{name} accepted your friend request! 🤝</p>}
                        {n.type === "friend_declined" && <p className="text-pink-100/55 text-sm">{name} couldn't connect right now.</p>}
                        {n.type === "group_invite"    && <p className="text-pink-300 text-sm font-semibold">{name} added you to a study group! 📚</p>}

                        {unread && <button onClick={() => markRead(n.id)} className="text-pink-100/30 hover:text-pink-100/60 text-[10px] mt-2 transition-colors">Mark as read</button>}
                      </div>
                      {unread && <div className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0 mt-1" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── PENDING ── */}
      {tab === "pending" && (
        <>
          {pending.length === 0 ? (
            <div className="py-20 text-center px-8"><div className="text-4xl mb-3">⏳</div><p className="text-white font-semibold text-sm mb-1">No pending requests</p><p className="text-pink-100/55 text-sm">Match requests you send will appear here.</p></div>
          ) : (
            <>
              <p className="text-pink-100/40 text-xs mb-4">{pending.length} request{pending.length > 1 ? "s" : ""} waiting for a response</p>
              <div className="space-y-3">
                {pending.map(m => {
                  const rec      = m.receiver;
                  const name     = rec?.display_name || "Student";
                  const initials = name.slice(0, 2).toUpperCase();
                  const diff     = Date.now() - new Date(m.created_at).getTime();
                  const sentAgo  = diff < 3600000 ? "Just now" : diff < 86400000 ? `${Math.floor(diff/3600000)}h ago` : `${Math.floor(diff/86400000)}d ago`;
                  return (
                    <div key={m.id} className="bg-pink-500/10 border border-amber-500/15 rounded-2xl p-4 backdrop-blur-xl">
                      <div className="flex items-start gap-3">
                        <AvatarBubble initials={initials} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-white text-sm font-semibold">{name}</p>
                            <span className="text-amber-500/70 text-[10px] font-medium flex-shrink-0">⏳ {sentAgo}</span>
                          </div>
                          <p className="text-pink-100/55 text-xs mt-0.5">{rec?.program} · {rec?.year}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {(rec?.courses || []).slice(0, 3).map(c => <Tag key={c}>{c}</Tag>)}
                            {rec?.meeting_preference && <Tag>{rec.meeting_preference}</Tag>}
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-400/10 border border-amber-400/20 text-[10px] font-bold px-2.5 py-1 rounded-full"><Clock size={10} /> Awaiting response</span>
                            <button onClick={() => cancelRequest(m.id)} className="text-pink-100/30 hover:text-red-400 text-[10px] font-medium transition-colors">Cancel request</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// ─── CREATE STUDY GROUP MODAL ────────────────────────────────────────────────

function CreateGroupModal({ myUserId, myProfile, friends, onClose, onCreated }) {
  const [name,        setName]        = useState("");
  const [selected,    setSelected]    = useState([]);
  const [course,      setCourse]      = useState("");
  const [meetPref,    setMeetPref]    = useState("");
  const [description, setDescription] = useState("");
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");

  const toggleFriend = id => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const create = async () => {
    if (!name.trim()) { setError("Give your group a name."); return; }
    if (selected.length === 0) { setError("Select at least one friend to invite."); return; }
    setSaving(true);
    const { data: group, error: err } = await supabase
      .from("study_groups")
      .insert({ name: name.trim(), created_by: myUserId, courses: course ? [course] : [], meeting_preference: meetPref || null, description: description.trim() || null })
      .select().single();
    if (err) { setError(err.message); setSaving(false); return; }
    await supabase.from("study_group_members").insert({ group_id: group.id, user_id: myUserId, role: "admin" });
    for (const friendId of selected) {
      await supabase.from("study_group_members").insert({ group_id: group.id, user_id: friendId, role: "member" });
      await supabase.from("notifications").insert({ user_id: friendId, type: "group_invite", from_user_id: myUserId, match_id: group.id });
    }
    setSaving(false);
    onCreated();
  };

  const courseOptions = myProfile?.courses || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#1b0718] border border-pink-200/15 rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-pink-200/10">
          <h2 className="text-lg font-black text-white">Create Study Group</h2>
          <button onClick={onClose} className="text-pink-100/50 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-pink-100/60 mb-1.5 uppercase tracking-wider">Group Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. CP264 Night Owls"
              className="w-full bg-white/10 border border-pink-200/10 focus:border-pink-400 text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder-pink-100/30" />
          </div>
          {courseOptions.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-pink-100/60 mb-1.5 uppercase tracking-wider">Course (optional)</label>
              <div className="flex flex-wrap gap-2">{courseOptions.map(c => <Chip key={c} selected={course === c} onClick={() => setCourse(prev => prev === c ? "" : c)}>{c}</Chip>)}</div>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-pink-100/60 mb-1.5 uppercase tracking-wider">Meeting Format (optional)</label>
            <div className="flex gap-2">{["In-Person","Online","Hybrid"].map(p => <Chip key={p} selected={meetPref === p} onClick={() => setMeetPref(prev => prev === p ? "" : p)}>{p}</Chip>)}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-pink-100/60 mb-1.5 uppercase tracking-wider">Description (optional)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="What's this group about?"
              className="w-full bg-white/10 border border-pink-200/10 focus:border-pink-400 text-white rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors placeholder-pink-100/30" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-pink-100/60 mb-2 uppercase tracking-wider">Invite Friends</label>
            {friends.length === 0 ? (
              <p className="text-pink-100/40 text-sm">No friends yet. Add some from Discover!</p>
            ) : (
              <div className="space-y-2">
                {friends.map(f => {
                  const fname    = f.display_name || "Student";
                  const initials = fname.slice(0, 2).toUpperCase();
                  const isSel    = selected.includes(f.id);
                  return (
                    <button key={f.id} onClick={() => toggleFriend(f.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${isSel ? "border-pink-500/50 bg-pink-500/10" : "border-pink-200/10 hover:border-pink-300/30"}`}>
                      <AvatarBubble initials={initials} size="sm" />
                      <div className="flex-1 text-left">
                        <p className="text-white text-sm font-semibold">{fname}</p>
                        <p className="text-pink-100/50 text-xs">{f.program}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSel ? "border-pink-500 bg-pink-500" : "border-pink-200/20"}`}>
                        {isSel && <Check size={11} className="text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button onClick={create} disabled={saving}
            className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Users size={16} />}
            {saving ? "Creating…" : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: FRIENDS ───────────────────────────────────────────────────────────

function FriendsPage({ myUserId, myProfile }) {
  const [tab,         setTab]         = useState("friends");
  const [friends,     setFriends]     = useState([]);
  const [groups,      setGroups]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showModal,   setShowModal]   = useState(false);
  const [expandGroup, setExpandGroup] = useState(null);

  const loadFriends = async () => {
    const { data } = await supabase
      .from("friendships")
      .select("*, sender:sender_id(id,display_name,program,year,courses,meeting_preference), receiver:receiver_id(id,display_name,program,year,courses,meeting_preference)")
      .or(`sender_id.eq.${myUserId},receiver_id.eq.${myUserId}`)
      .eq("status", "accepted");
    setFriends((data || []).map(f => f.sender_id === myUserId ? f.receiver : f.sender).filter(Boolean));
  };

  const loadGroups = async () => {
    const { data: memberships } = await supabase
      .from("study_group_members")
      .select("role, group:group_id(id, name, courses, meeting_preference, description, created_by, created_at)")
      .eq("user_id", myUserId);
    const groupList = (memberships || []).map(m => ({ ...m.group, myRole: m.role })).filter(Boolean);
    const withCounts = await Promise.all(groupList.map(async g => {
      const { count } = await supabase.from("study_group_members").select("*", { count: "exact", head: true }).eq("group_id", g.id);
      return { ...g, memberCount: count || 1 };
    }));
    setGroups(withCounts);
  };

  const load = async () => { setLoading(true); await Promise.all([loadFriends(), loadGroups()]); setLoading(false); };
  useEffect(() => { load(); }, [myUserId]);

  const removeFriend = async (friendId) => {
    await supabase.from("friendships").delete()
      .or(`and(sender_id.eq.${myUserId},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${myUserId})`);
    setFriends(f => f.filter(x => x.id !== friendId));
  };

  const leaveGroup = async (groupId) => {
    await supabase.from("study_group_members").delete().eq("group_id", groupId).eq("user_id", myUserId);
    setGroups(g => g.filter(x => x.id !== groupId));
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={24} className="text-pink-500 animate-spin" /></div>;

  return (
    <>
      {showModal && (
        <CreateGroupModal
          myUserId={myUserId} myProfile={myProfile} friends={friends}
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); loadGroups(); setTab("groups"); }}
        />
      )}

      <div className="flex gap-1 bg-pink-200/10 p-1 rounded-xl mb-5 border border-pink-200/10">
        <button onClick={() => setTab("friends")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${tab === "friends" ? "bg-pink-600 text-white shadow" : "text-pink-100/55 hover:text-white"}`}>
          Friends {friends.length > 0 && <span className={`w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center ${tab === "friends" ? "bg-white/20" : "bg-pink-500"}`}>{friends.length}</span>}
        </button>
        <button onClick={() => setTab("groups")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${tab === "groups" ? "bg-pink-600 text-white shadow" : "text-pink-100/55 hover:text-white"}`}>
          Study Groups {groups.length > 0 && <span className={`w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center ${tab === "groups" ? "bg-white/20" : "bg-pink-500"}`}>{groups.length}</span>}
        </button>
      </div>

      {/* ── FRIENDS TAB ── */}
      {tab === "friends" && (
        <>
          {friends.length === 0 ? (
            <div className="py-20 text-center px-8">
              <div className="text-4xl mb-3">🤝</div>
              <p className="text-white font-semibold text-sm mb-1">No friends yet</p>
              <p className="text-pink-100/55 text-sm">Tap "Add Friend" on someone's profile in Discover to connect.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {friends.map(f => {
                const name     = f.display_name || "Student";
                const initials = name.slice(0, 2).toUpperCase();
                return (
                  <div key={f.id} className="bg-pink-500/10 border border-pink-200/15 rounded-2xl p-4 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <AvatarBubble initials={initials} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm">{name}</p>
                        <p className="text-pink-100/55 text-xs mt-0.5">{f.program} · {f.year}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">{(f.courses || []).slice(0, 3).map(c => <Tag key={c}>{c}</Tag>)}</div>
                      </div>
                      <button onClick={() => removeFriend(f.id)} className="text-pink-100/25 hover:text-red-400 transition-colors p-1.5" title="Remove friend">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
              <button onClick={() => setShowModal(true)}
                className="w-full flex items-center justify-center gap-2 border border-dashed border-pink-500/30 hover:border-pink-400/60 hover:bg-pink-500/5 text-pink-400 font-semibold py-3.5 rounded-2xl transition-all text-sm mt-2">
                <Plus size={16} /> Form a Study Group from Friends
              </button>
            </div>
          )}
        </>
      )}

      {/* ── GROUPS TAB ── */}
      {tab === "groups" && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-pink-100/40 text-xs">{groups.length} group{groups.length !== 1 ? "s" : ""}</p>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors">
              <Plus size={13} /> New Group
            </button>
          </div>
          {groups.length === 0 ? (
            <div className="py-16 text-center px-8">
              <div className="text-4xl mb-3">📚</div>
              <p className="text-white font-semibold text-sm mb-1">No study groups yet</p>
              <p className="text-pink-100/55 text-sm mb-5">Create one from your friends list.</p>
              <button onClick={() => setTab("friends")} className="text-pink-400 text-sm font-semibold hover:text-pink-300 transition-colors">Go to Friends →</button>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map(g => {
                const isExpanded = expandGroup === g.id;
                return (
                  <div key={g.id} className="bg-pink-500/10 border border-pink-200/15 rounded-2xl overflow-hidden backdrop-blur-xl">
                    <button onClick={() => setExpandGroup(isExpanded ? null : g.id)} className="w-full p-4 text-left">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Users size={14} className="text-white" />
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">{g.name}</p>
                            <p className="text-pink-100/55 text-xs">{g.memberCount} member{g.memberCount !== 1 ? "s" : ""} · {g.myRole === "admin" ? "Admin" : "Member"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {g.myRole === "admin" && <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">Admin</span>}
                          {isExpanded ? <ChevronUp size={14} className="text-pink-100/40" /> : <ChevronDown size={14} className="text-pink-100/40" />}
                        </div>
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-pink-200/10 space-y-3 pt-3">
                        {g.description && <p className="text-pink-100/60 text-xs leading-relaxed">{g.description}</p>}
                        <div className="flex flex-wrap gap-1.5">
                          {(g.courses || []).map(c => <Tag key={c}>{c}</Tag>)}
                          {g.meeting_preference && <Tag>{g.meeting_preference}</Tag>}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setShowModal(true)}
                            className="flex-1 flex items-center justify-center gap-1.5 border border-pink-200/15 hover:border-pink-400/40 text-pink-100/60 hover:text-pink-300 text-xs font-semibold py-2 rounded-xl transition-all">
                            <UserPlus size={12} /> Invite Friend
                          </button>
                          <button onClick={() => leaveGroup(g.id)}
                            className="flex items-center gap-1.5 border border-pink-200/10 hover:border-red-500/40 text-pink-100/40 hover:text-red-400 text-xs font-medium px-3 py-2 rounded-xl transition-all">
                            <Trash2 size={12} /> Leave
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
}

// ─── PAGE: CHATS LIST ────────────────────────────────────────────────────────
// FIX: removed self-wrapping pageShell div; root app handles the page container

function ChatsListPage({ myUserId, onOpenChat }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("matches")
        .select("*, sender:sender_id(display_name), receiver:receiver_id(display_name)")
        .or(`sender_id.eq.${myUserId},receiver_id.eq.${myUserId}`)
        .eq("status", "accepted")
        .order("updated_at", { ascending: false });
      setMatches(data || []);
      setLoading(false);
    })();
  }, [myUserId]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={24} className="text-pink-500 animate-spin" /></div>;

  return (
    <>
      {matches.length === 0 ? (
        <div className="py-20 text-center px-8">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-pink-100/55 text-sm">No matches yet. Start discovering people!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map(m => {
            const otherId   = m.sender_id === myUserId ? m.receiver_id : m.sender_id;
            const otherName = m.sender_id === myUserId ? m.receiver?.display_name : m.sender?.display_name;
            const initials  = (otherName || "??").slice(0, 2).toUpperCase();
            return (
              <button key={m.id} onClick={() => onOpenChat(m.id, otherId, otherName || "Study Partner")}
                className="w-full bg-pink-500/10 border border-pink-200/15 rounded-2xl p-4 backdrop-blur-xl text-left hover:border-pink-300/30 transition-all">
                <div className="flex items-center gap-3">
                  <AvatarBubble initials={initials} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{otherName || "Study Partner"}</p>
                    <p className="text-pink-100/50 text-sm">Open chat and start talking</p>
                  </div>
                  <ChevronRight size={18} className="text-pink-100/40" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─── PAGE: CHAT ──────────────────────────────────────────────────────────────
// FIX: corrected broken ternary JSX — messages.map was missing its closing paren

function ChatPage({ matchId, otherUserId, otherName, myUserId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(true);
  const [sending,  setSending]  = useState(false);
  const bottomRef = useRef(null);

  const load = async () => {
    const { data } = await supabase.from("messages").select("*").eq("match_id", matchId).order("created_at", { ascending: true });
    setMessages(data || []);
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  useEffect(() => {
    load();
    const channel = supabase.channel("messages:" + matchId)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${matchId}` },
        payload => { setMessages(prev => [...prev, payload.new]); setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50); })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [matchId]);

  const send = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    const content = input.trim(); setInput("");
    await supabase.from("messages").insert({ match_id: matchId, sender_id: myUserId, content });
    setSending(false);
  };

  const handleKey = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };
  const initials  = (otherName || "??").slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-rose-950 via-fuchsia-950 to-pink-950">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-pink-200/10 bg-[#1b0718]/80 backdrop-blur flex-shrink-0">
        <button onClick={onBack} className="text-pink-100/50 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <AvatarBubble initials={initials} size="sm" />
        <div>
          <p className="text-white font-semibold text-sm">{otherName}</p>
          <p className="text-pink-100/45 text-[10px]">Study partner</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {loading ? (
          <div className="flex justify-center pt-10"><Loader2 size={24} className="text-pink-500 animate-spin" /></div>
        ) : messages.length === 0 ? (
          <div className="text-center pt-16"><p className="text-pink-100/55 text-sm">You're matched! Say hello 👋</p></div>
        ) : (
          messages.map(m => {
            const isMe = m.sender_id === myUserId;
            return (
              <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? "bg-pink-600 text-white rounded-br-md" : "bg-pink-200/10 text-pink-100 rounded-bl-md backdrop-blur"}`}>
                  {m.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-pink-200/10 bg-[#1b0718]/80 backdrop-blur flex-shrink-0">
        <div className="flex gap-2 items-end">
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} rows={1} placeholder="Message…"
            className="flex-1 bg-white/10 border border-pink-200/10 focus:border-pink-400 text-white text-sm rounded-2xl px-4 py-3 outline-none resize-none transition-colors placeholder-pink-100/30" />
          <button onClick={send} disabled={!input.trim() || sending}
            className="w-11 h-11 bg-pink-600 hover:bg-pink-500 disabled:opacity-40 text-white rounded-2xl flex items-center justify-center transition-all flex-shrink-0">
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: ACCOUNT ───────────────────────────────────────────────────────────

function AccountPage({ user, profile, onSignOut, onEditProfile, onOpenNotifications }) {
  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Student";
  const initials    = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-950 via-fuchsia-950 to-pink-950 text-white pb-28">
      <div className="max-w-lg mx-auto px-5 pt-10">
        <p className="text-pink-400 text-xs font-bold uppercase tracking-widest mb-1">Account</p>
        <h1 className="text-3xl font-black mb-8">Your Profile</h1>

        <Card className="p-6 mb-4 text-center">
          <div className="flex justify-center"><AvatarBubble initials={initials} size="lg" /></div>
          <h2 className="text-xl font-black mt-4 text-white">{displayName}</h2>
          <p className="text-pink-100/55 text-sm mt-1">{user?.email}</p>
          {profile && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {profile.program            && <Tag>{profile.program}</Tag>}
              {profile.year               && <Tag>{profile.year}</Tag>}
              {profile.meeting_preference && <Tag>{profile.meeting_preference}</Tag>}
              {(profile.courses || []).slice(0, 3).map(c => <Tag key={c}>{c}</Tag>)}
            </div>
          )}
        </Card>

        <Card className="mb-4 divide-y divide-pink-200/10">
          {[
            { label:"Edit Study Preferences", icon:Settings, action: onEditProfile },
            { label:"Notifications",          icon:Bell,     action: onOpenNotifications },
          ].map(({ label, icon: Icon, action }) => (
            <button key={label} onClick={action} className="flex items-center justify-between w-full px-5 py-4 hover:bg-pink-100/5 transition-colors">
              <div className="flex items-center gap-3">
                <Icon size={15} className="text-pink-400" />
                <span className="text-white text-sm">{label}</span>
              </div>
              <ChevronRight size={15} className="text-pink-100/35" />
            </button>
          ))}
        </Card>

        <button onClick={onSignOut} className="w-full flex items-center justify-center gap-2 border border-red-500/20 hover:bg-red-500/5 text-red-400 font-semibold py-3 rounded-2xl transition-all text-sm">
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────

export default function StudySyncApp() {
  const [page,        setPage]        = useState("landing");
  const [authUser,    setAuthUser]    = useState(null);
  const [myProfile,   setMyProfile]   = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [unread,      setUnread]      = useState(0);
  const [activeChat,  setActiveChat]  = useState(null);

  const loadProfile = async (uid) => {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", uid).single();
    if (error && error.code !== "PGRST116") {
      console.error("❌ Profile load failed:", error.message);
    }
    if (data) {
      setMyProfile(data);
      // If profile has a program, skip straight to matches — even on fresh page load
      setPage(data.program ? "browse" : "onboarding");
    } else {
      setPage("onboarding");
    }
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", uid)
      .eq("read", false);
    setUnread(count || 0);
  };

  useEffect(() => {
    let profileLoaded = false;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) { setAuthUser(session.user); await loadProfile(session.user.id); profileLoaded = true; }
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (session?.user) {
        setAuthUser(session.user);
        if (!profileLoaded) { profileLoaded = true; await loadProfile(session.user.id); }
      } else {
        setAuthUser(null); setMyProfile(null); profileLoaded = false; setPage("landing");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authUser) return;
    const channel = supabase.channel("unread-badge")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${authUser.id}` }, () => setUnread(n => n + 1))
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [authUser]);

  const handleAuthSuccess     = async (user) => { setAuthUser(user); await loadProfile(user.id); };
  const handleSignOut         = async () => { await supabase.auth.signOut(); setMyProfile(null); setPage("landing"); };

  const handleProfileComplete = async (profileData) => {
    const displayName = authUser?.user_metadata?.display_name
      || authUser?.email?.split("@")[0]
      || "Student";
    const payload = {
      id: authUser.id,
      display_name: displayName,
      ...profileData,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("profiles").upsert(payload);
    if (error) {
      console.error("❌ Profile save failed:", error.message, error.details);
      return; // don't navigate if save failed
    }
    setMyProfile(payload);
    setPage("browse");
  };

  const openChat = (matchId, otherId, otherName) => { setActiveChat({ matchId, otherId, otherName }); setPage("chat"); };
  const navigate = (dest) => {
    if (dest === "browse" && !myProfile?.program) { setPage("onboarding"); return; }
    setPage(dest);
    if (dest === "notifications") setUnread(0);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-950 via-fuchsia-950 to-pink-950 flex items-center justify-center">
        <Loader2 size={32} className="text-pink-500 animate-spin" />
      </div>
    );
  }

  const showNav = authUser && !["landing","login","onboarding","chat"].includes(page);

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-rose-950 via-fuchsia-950 to-pink-950 text-white">
      {page === "landing"    && <LandingPage onGetStarted={() => setPage("login")} />}
      {page === "login"      && <LoginPage   onAuthSuccess={handleAuthSuccess} />}
      {page === "onboarding" && <OnboardingFlow savedProfile={myProfile} onComplete={handleProfileComplete} />}

      {page === "browse" && (
        <div className="pb-28 pt-10">
          <div className="max-w-lg mx-auto px-5 mb-6">
            <p className="text-pink-400 text-xs font-bold uppercase tracking-widest mb-1">Discover</p>
            <h1 className="text-3xl font-black">Find your people</h1>
            <p className="text-pink-100/55 text-sm mt-1">Ranked by availability, courses & goals.</p>
          </div>
          <BrowseMatchesPage myProfile={myProfile} myUserId={authUser?.id} />
        </div>
      )}

      {page === "notifications" && (
        <div className="max-w-lg mx-auto px-5 pt-10 pb-28">
          <h1 className="text-2xl font-black mb-6">Notifications</h1>
          <NotificationsPage myUserId={authUser?.id} onOpenChat={openChat} />
        </div>
      )}

      {page === "friends" && (
        <div className="max-w-lg mx-auto px-5 pt-10 pb-28">
          <p className="text-pink-400 text-xs font-bold uppercase tracking-widest mb-1">Network</p>
          <h1 className="text-2xl font-black mb-6">Friends & Groups</h1>
          <FriendsPage myUserId={authUser?.id} myProfile={myProfile} />
        </div>
      )}

      {page === "chats" && (
        <div className="max-w-lg mx-auto px-5 pt-10 pb-28">
          <h1 className="text-2xl font-black mb-6">Messages</h1>
          <ChatsListPage myUserId={authUser?.id} onOpenChat={openChat} />
        </div>
      )}

      {page === "chat" && activeChat && (
        <ChatPage matchId={activeChat.matchId} otherUserId={activeChat.otherId} otherName={activeChat.otherName} myUserId={authUser?.id} onBack={() => setPage("chats")} />
      )}

      {page === "account" && (
        <AccountPage user={authUser} profile={myProfile} onSignOut={handleSignOut} onEditProfile={() => setPage("onboarding")} onOpenNotifications={() => navigate("notifications")} />
      )}

      {showNav && <Navbar currentPage={page} onNavigate={navigate} unreadCount={unread} />}
    </div>
  );
}