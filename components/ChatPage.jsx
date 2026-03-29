"use client";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { Send, Loader2, ArrowLeft } from "lucide-react";

export default function ChatPage({ matchId, otherUserId, otherName, myUserId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(true);
  const [sending,  setSending]  = useState(false);
  const bottomRef = useRef(null);

  const load = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("match_id", matchId)
      .order("created_at", { ascending: true });
    setMessages(data || []);
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("messages:" + matchId)
      .on("postgres_changes", {
        event:  "INSERT",
        schema: "public",
        table:  "messages",
        filter: `match_id=eq.${matchId}`,
      }, payload => {
        setMessages(prev => [...prev, payload.new]);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [matchId]);

  const send = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    const content = input.trim();
    setInput("");
    await supabase.from("messages").insert({
      match_id:  matchId,
      sender_id: myUserId,
      content,
    });
    setSending(false);
  };

  const handleKey = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="flex flex-col h-screen bg-[#06080f]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 bg-slate-950/90 backdrop-blur">
        <button onClick={onBack} className="text-slate-500 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
          {(otherName || "??").slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{otherName}</p>
          <p className="text-slate-600 text-[10px]">Study partner</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {loading ? (
          <div className="flex justify-center pt-10">
            <Loader2 size={24} className="text-indigo-500 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center pt-16">
            <p className="text-slate-500 text-sm">You're matched! Say hello 👋</p>
          </div>
        ) : (
          messages.map(m => {
            const isMe = m.sender_id === myUserId;
            return (
              <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? "bg-indigo-600 text-white rounded-br-md"
                      : "bg-slate-800 text-slate-100 rounded-bl-md"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-white/5 bg-slate-950/90 backdrop-blur">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            placeholder="Message…"
            className="flex-1 bg-slate-800 border border-slate-700 focus:border-indigo-500 text-white text-sm rounded-2xl px-4 py-3 outline-none resize-none transition-colors placeholder-slate-600"
          />
          <button
            onClick={send}
            disabled={!input.trim() || sending}
            className="w-11 h-11 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-2xl flex items-center justify-center transition-all flex-shrink-0"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}