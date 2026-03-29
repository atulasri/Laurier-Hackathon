"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { scoreMatch, meetsGenderPreference } from "../lib/matching";
import { Heart, X, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

function Tag({ children }) {
  return (
    <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full">
      {children}
    </span>
  );
}

function MatchBadge({ score }) {
  const style =
    score >= 80 ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
    : score >= 60 ? "text-amber-400 bg-amber-400/10 border-amber-400/30"
    : "text-slate-400 bg-slate-700 border-slate-600";
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${style}`}>
      {score}% match
    </span>
  );
}

function AvatarBubble({ initials, size = "lg" }) {
  const sizes  = { sm:"w-8 h-8 text-xs", md:"w-11 h-11 text-sm", lg:"w-20 h-20 text-2xl" };
  const colors = ["from-indigo-500 to-violet-600","from-cyan-500 to-blue-600","from-emerald-500 to-teal-600","from-rose-500 to-pink-600","from-amber-500 to-orange-600"];
  const palette = colors[(initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % colors.length];
  return (
    <div className={`${sizes[size]} bg-gradient-to-br ${palette} rounded-full flex items-center justify-center text-white font-black flex-shrink-0`}>
      {initials}
    </div>
  );
}

export default function BrowseMatchesPage({ myProfile, myUserId, onOpenMessages }) {
  const [candidates,   setCandidates]   = useState([]);
  const [idx,          setIdx]          = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [expanded,     setExpanded]     = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast,        setToast]        = useState(null);

  useEffect(() => {
    if (!myProfile) return;
    (async () => {
      setLoading(true);

      // Load all profiles except self
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", myUserId);

      // Load existing matches involving me (to exclude already-matched)
      const { data: existingMatches } = await supabase
        .from("matches")
        .select("sender_id, receiver_id, status, updated_at")
        .or(`sender_id.eq.${myUserId},receiver_id.eq.${myUserId}`);

      const excludeIds = new Set();
      const now = Date.now();
      const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;

      (existingMatches || []).forEach(m => {
        const otherId = m.sender_id === myUserId ? m.receiver_id : m.sender_id;
        // exclude accepted/pending, or recently declined
        if (m.status === "accepted" || m.status === "pending") {
          excludeIds.add(otherId);
        } else if (m.status === "declined") {
          const declinedAgo = now - new Date(m.updated_at).getTime();
          if (declinedAgo < TWO_WEEKS) excludeIds.add(otherId);
        }
      });

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

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const sendMatchRequest = async (toProfile) => {
    setActionLoading(true);
    const { data: match, error } = await supabase
      .from("matches")
      .insert({ sender_id: myUserId, receiver_id: toProfile.id, status: "pending" })
      .select()
      .single();

    if (!error && match) {
      await supabase.from("notifications").insert({
        user_id:      toProfile.id,
        type:         "match_request",
        from_user_id: myUserId,
        match_id:     match.id,
      });
      showToast(`Match request sent to ${toProfile.display_name}! 🎉`);
    }
    setActionLoading(false);
    setIdx(i => i + 1);
    setExpanded(false);
  };

  const skip = () => {
    setIdx(i => i + 1);
    setExpanded(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 size={28} className="text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!myProfile?.courses?.length) {
    return (
      <div className="py-20 text-center px-8">
        <p className="text-slate-400 text-sm">Complete your profile to see matches.</p>
      </div>
    );
  }

  const current = candidates[idx];

  if (!current) {
    return (
      <div className="py-20 text-center px-8">
        <div className="text-4xl mb-4">🎓</div>
        <h3 className="text-white font-bold text-lg mb-2">You've seen everyone!</h3>
        <p className="text-slate-500 text-sm">
          New students join every day. Check back soon or update your preferences.
        </p>
      </div>
    );
  }

  const initials = (current.display_name || "??").slice(0, 2).toUpperCase();
  const sharedCourses = (myProfile.courses || []).filter(c => (current.courses || []).includes(c));

  return (
    <div className="relative max-w-lg mx-auto px-5 pb-6">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl shadow-xl">
          {toast}
        </div>
      )}

      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-600 text-xs">{idx + 1} / {candidates.length} matches</span>
        <MatchBadge score={current.score} />
      </div>

      {/* Card */}
      <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden">
        {/* Top gradient */}
        <div className="bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-transparent px-6 py-8 flex flex-col items-center text-center">
          <AvatarBubble initials={initials} size="lg" />
          <h2 className="text-xl font-black text-white mt-4">{current.display_name || "Student"}</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            {current.program} · {current.year}
          </p>
          {current.bio && (
            <p className="text-slate-300 text-sm mt-3 leading-relaxed max-w-xs">{current.bio}</p>
          )}
        </div>

        {/* Details */}
        <div className="px-6 pb-5 space-y-4">
          <div>
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-2">
              Shared Courses
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sharedCourses.map(c => <Tag key={c}>{c}</Tag>)}
            </div>
          </div>

          <div>
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-2">
              Goals
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(current.motivations || []).slice(0, 4).map(m => <Tag key={m}>{m}</Tag>)}
            </div>
          </div>

          <div className="flex gap-3 text-xs text-slate-500">
            <span>📍 {current.meeting_preference || "—"}</span>
            <span>🕐 {(current.availability || []).length} slots free</span>
          </div>

          {/* Expandable availability */}
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-indigo-400 text-xs font-medium"
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {expanded ? "Hide" : "Show"} full availability
          </button>
          {expanded && (
            <div className="flex flex-wrap gap-1.5">
              {(current.availability || []).map(s => <Tag key={s}>{s}</Tag>)}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={skip}
          disabled={actionLoading}
          className="flex-1 flex items-center justify-center gap-2 border border-slate-700 hover:border-red-500/40 hover:bg-red-500/8 text-slate-400 hover:text-red-400 font-semibold py-3.5 rounded-2xl transition-all"
        >
          <X size={18} /> Skip
        </button>
        <button
          onClick={() => sendMatchRequest(current)}
          disabled={actionLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-500/20"
        >
          {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Heart size={18} />}
          Match
        </button>
      </div>
    </div>
  );
}