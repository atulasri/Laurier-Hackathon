"use client";

import React, { useState } from "react";
import {
  ArrowRight, ArrowLeft, BookOpen, Calendar,
  Target, MapPin, User, Check, Zap
} from "lucide-react";
import {
  PROGRAMS_BY_FACULTY, ALL_PROGRAMS, COURSES_BY_PROGRAM,
  YEARS, MOTIVATIONS, AVAILABILITY_SLOTS,
  GENDERS, GENDER_PREFERENCES
} from "../lib/laurierData";

// ── small helpers ──────────────────────────────────────────────────────────

function Chip({ children, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
        selected
          ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20"
          : "bg-slate-800/80 text-slate-400 border-slate-700 hover:border-indigo-500/60 hover:text-indigo-300"
      }`}
    >
      {children}
    </button>
  );
}

function StepHeader({ step, total, icon: Icon, title, subtitle }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i < step ? "bg-indigo-500" : "bg-slate-800"
            }`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 mb-1">
        <Icon size={16} className="text-indigo-400" />
        <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest">
          Step {step} of {total}
        </span>
      </div>
      <h2 className="text-2xl font-black text-white">{title}</h2>
      {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

function NavButtons({ onBack, onNext, canNext, nextLabel = "Continue" }) {
  return (
    <div className="flex gap-3 mt-6">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all text-sm font-medium"
        >
          <ArrowLeft size={15} /> Back
        </button>
      )}
      <button
        onClick={onNext}
        disabled={!canNext}
        className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all text-sm shadow-lg shadow-indigo-500/20"
      >
        {nextLabel} <ArrowRight size={16} />
      </button>
    </div>
  );
}

// ── STEPS ─────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 6;

// Step 1 — Program
function StepProgram({ value, onChange, onNext }) {
  return (
    <div>
      <StepHeader
        step={1} total={TOTAL_STEPS} icon={User}
        title="What's your program?"
        subtitle="Select your degree program at Laurier."
      />
      <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
        {Object.entries(PROGRAMS_BY_FACULTY).map(([faculty, programs]) => (
          <div key={faculty}>
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-2">
              {faculty}
            </p>
            <div className="flex flex-wrap gap-2">
              {programs.map(p => (
                <Chip key={p} selected={value === p} onClick={() => onChange(p)}>{p}</Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
      <NavButtons onNext={onNext} canNext={!!value} />
    </div>
  );
}

// Step 2 — Year
function StepYear({ value, onChange, onBack, onNext }) {
  return (
    <div>
      <StepHeader
        step={2} total={TOTAL_STEPS} icon={User}
        title="What year are you in?"
        subtitle="This helps match you with students at the same stage."
      />
      <div className="flex flex-wrap gap-3">
        {YEARS.map(y => (
          <Chip key={y} selected={value === y} onClick={() => onChange(y)}>{y}</Chip>
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} canNext={!!value} />
    </div>
  );
}

// Step 3 — Courses
function StepCourses({ program, value, onChange, onBack, onNext }) {
  const available = COURSES_BY_PROGRAM[program] || [];
  const toggle    = c => onChange(prev =>
    prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
  );
  return (
    <div>
      <StepHeader
        step={3} total={TOTAL_STEPS} icon={BookOpen}
        title="Which courses are you in?"
        subtitle={`Select all your current ${program} courses.`}
      />
      {available.length === 0 ? (
        <p className="text-slate-500 text-sm">
          No preset courses for this program — type them in later via settings.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2 max-h-[50vh] overflow-y-auto pr-1">
          {available.map(c => (
            <Chip key={c} selected={value.includes(c)} onClick={() => toggle(c)}>{c}</Chip>
          ))}
        </div>
      )}
      {value.length > 0 && (
        <p className="text-indigo-400 text-xs mt-3">
          {value.length} course{value.length > 1 ? "s" : ""} selected
        </p>
      )}
      <NavButtons onBack={onBack} onNext={onNext} canNext={value.length > 0} />
    </div>
  );
}

// Step 4 — Motivations
function StepMotivations({ value, onChange, onBack, onNext }) {
  const toggle = m => onChange(prev =>
    prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
  );
  return (
    <div>
      <StepHeader
        step={4} total={TOTAL_STEPS} icon={Target}
        title="Why do you want to study?"
        subtitle="Pick everything that applies — you'll match with people who share your goals."
      />
      <div className="flex flex-wrap gap-2">
        {MOTIVATIONS.map(m => (
          <Chip key={m} selected={value.includes(m)} onClick={() => toggle(m)}>{m}</Chip>
        ))}
      </div>
      {value.length > 0 && (
        <p className="text-indigo-400 text-xs mt-3">{value.length} selected</p>
      )}
      <NavButtons onBack={onBack} onNext={onNext} canNext={value.length > 0} />
    </div>
  );
}

// Step 5 — Meeting preference + Availability
function StepSchedule({ meetingPref, onMeetingPref, availability, onAvailability, onBack, onNext }) {
  const toggle = s => onAvailability(prev =>
    prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
  );
  return (
    <div>
      <StepHeader
        step={5} total={TOTAL_STEPS} icon={Calendar}
        title="Schedule & format"
        subtitle="Where do you want to meet, and when are you free?"
      />
      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Meeting Format</p>
      <div className="flex gap-2 mb-6">
        {["In-Person","Online","Hybrid"].map(p => (
          <Chip key={p} selected={meetingPref === p} onClick={() => onMeetingPref(p)}>{p}</Chip>
        ))}
      </div>
      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Availability</p>
      <div className="flex flex-wrap gap-2 max-h-[35vh] overflow-y-auto pr-1">
        {AVAILABILITY_SLOTS.map(s => (
          <Chip key={s} selected={availability.includes(s)} onClick={() => toggle(s)}>{s}</Chip>
        ))}
      </div>
      {availability.length > 0 && (
        <p className="text-indigo-400 text-xs mt-3">{availability.length} slot{availability.length > 1 ? "s" : ""} selected</p>
      )}
      <NavButtons
        onBack={onBack}
        onNext={onNext}
        canNext={!!meetingPref && availability.length > 0}
      />
    </div>
  );
}

// Step 6 — Gender
function StepGender({ gender, onGender, genderPref, onGenderPref, onBack, onFinish, saving }) {
  return (
    <div>
      <StepHeader
        step={6} total={TOTAL_STEPS} icon={User}
        title="A couple more things"
        subtitle="Optional — helps with comfort and preferences."
      />
      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Your Gender</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {GENDERS.map(g => (
          <Chip key={g} selected={gender === g} onClick={() => onGender(g)}>{g}</Chip>
        ))}
      </div>
      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
        Study Partner Gender Preference
      </p>
      <div className="flex flex-wrap gap-2">
        {GENDER_PREFERENCES.map(p => (
          <Chip key={p} selected={genderPref === p} onClick={() => onGenderPref(p)}>{p}</Chip>
        ))}
      </div>
      <NavButtons
        onBack={onBack}
        onNext={onFinish}
        canNext={true}
        nextLabel={saving ? "Saving…" : "Find My Matches ✦"}
      />
    </div>
  );
}

// ── ROOT ONBOARDING COMPONENT ─────────────────────────────────────────────

export default function OnboardingFlow({ savedProfile, onComplete }) {
  const s = savedProfile || {};
  const [step,         setStep]         = useState(1);
  const [program,      setProgram]      = useState(s.program      || "");
  const [year,         setYear]         = useState(s.year         || "");
  const [courses,      setCourses]      = useState(s.courses      || []);
  const [motivations,  setMotivations]  = useState(s.motivations  || []);
  const [meetingPref,  setMeetingPref]  = useState(s.meeting_preference || "");
  const [availability, setAvailability] = useState(s.availability || []);
  const [gender,       setGender]       = useState(s.gender       || "");
  const [genderPref,   setGenderPref]   = useState(s.gender_preference || "No preference");
  const [saving,       setSaving]       = useState(false);

  const finish = async () => {
    setSaving(true);
    await onComplete({
      program, year, courses, motivations,
      meeting_preference: meetingPref,
      availability, gender, gender_preference: genderPref,
    });
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#06080f] text-white pb-10">
      <div className="max-w-lg mx-auto px-5 pt-10">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap size={13} className="text-white" />
          </div>
          <span className="font-black text-base tracking-tight text-white">StudySync</span>
        </div>

        {step === 1 && <StepProgram  value={program}     onChange={setProgram}     onNext={() => setStep(2)} />}
        {step === 2 && <StepYear     value={year}        onChange={setYear}        onBack={() => setStep(1)} onNext={() => setStep(3)} />}
        {step === 3 && (
          <StepCourses
            program={program}
            value={courses}     onChange={setCourses}
            onBack={() => setStep(2)} onNext={() => setStep(4)}
          />
        )}
        {step === 4 && (
          <StepMotivations
            value={motivations} onChange={setMotivations}
            onBack={() => setStep(3)} onNext={() => setStep(5)}
          />
        )}
        {step === 5 && (
          <StepSchedule
            meetingPref={meetingPref}   onMeetingPref={setMeetingPref}
            availability={availability} onAvailability={setAvailability}
            onBack={() => setStep(4)}   onNext={() => setStep(6)}
          />
        )}
        {step === 6 && (
          <StepGender
            gender={gender}       onGender={setGender}
            genderPref={genderPref} onGenderPref={setGenderPref}
            onBack={() => setStep(5)} onFinish={finish} saving={saving}
          />
        )}
      </div>
    </div>
  );
}