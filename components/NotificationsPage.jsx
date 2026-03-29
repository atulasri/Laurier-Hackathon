"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Check, X, MessageCircle, Loader2 } from "lucide-react";

export default function NotificationsPage({ myUserId, onOpenChat }) {
  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from("notifications")
      .select("*, from_profile:from_user_id(display_name, program, year)")
      .eq("user_id", myUserId)
      .order("created_at", { ascending: false });
    setNotifications(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // Realtime subscription
    const channel = supabase
      .channel("notifications:" + myUserId)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${myUserId}`,
      }, () => load())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [myUserId]);

  const markRead = async id => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  };

  const acceptMatch = async (notif) => {
    await supabase.from("matches").update({ status: "accepted" }).eq("id", notif.match_id);
    // Notify the sender
    await supabase.from("notifications").insert({
      user_id:      notif.from_user_id,
      type:         "match_accepted",
      from_user_id: myUserId,
      match_id:     notif.match_id,
    });
    await markRead(notif.id);
    load();
  };

  const declineMatch = async (notif) => {
    await supabase.from("matches").update({ status: "declined" }).eq("id", notif.match_id);
    await supabase.from("notifications").insert({
      user_id:      notif.from_user_id,
      type:         "match_declined",
      from_user_id: myUserId,
      match_id:     notif.match_id,
    });
    await markRead(notif.id);
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="py-20 text-center px-8">
        <div className="text-4xl mb-3">🔔</div>
        <p className="text-slate-500 text-sm">No notifications yet. Start matching!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map(n => {
        const name = n.from_profile?.display_name || "Someone";
        const initials = name.slice(0, 2).toUpperCase();
        const unread = !n.read;

        return (
          <div
            key={n.id}
            className={`bg-slate-900 border rounded-2xl p-4 transition-all ${unread ? "border-indigo-500/30" : "border-white/5"}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                {n.type === "match_request" && (
                  <>
                    <p className="text-white text-sm font-semibold">
                      {name} wants to study with you!
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {n.from_profile?.program} · {n.from_profile?.year}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => acceptMatch(n)}
                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                      >
                        <Check size={12} /> Accept
                      </button>
                      <button
                        onClick={() => declineMatch(n)}
                        className="flex items-center gap-1.5 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-400 text-xs font-medium px-3 py-1.5 rounded-xl transition-all"
                      >
                        <X size={12} /> Decline
                      </button>
                    </div>
                  </>
                )}
                {n.type === "match_accepted" && (
                  <>
                    <p className="text-emerald-400 text-sm font-semibold">
                      {name} accepted your match! 🎉
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">You can now message each other</p>
                    <button
                      onClick={() => { markRead(n.id); onOpenChat(n.match_id, n.from_user_id, name); }}
                      className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-xl mt-3 transition-all"
                    >
                      <MessageCircle size={12} /> Open Chat
                    </button>
                  </>
                )}
                {n.type === "match_declined" && (
                  <p className="text-slate-400 text-sm">
                    {name} is not available right now. You'll see them again in 2 weeks.
                  </p>
                )}
                {unread && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="text-slate-600 hover:text-slate-400 text-[10px] mt-2 transition-colors"
                  >
                    Mark as read
                  </button>
                )}
              </div>
              {unread && (
                <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}