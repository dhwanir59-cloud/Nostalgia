/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Calendar, Heart, Flame, ArrowLeftRight, Check, HelpCircle } from "lucide-react";
import { synth } from "../utils/synth";

interface DailyDropTabProps {
  userCoins: number;
  setUserCoins: React.Dispatch<React.SetStateAction<number>>;
  streakCount: number;
  setStreakCount: React.Dispatch<React.SetStateAction<number>>;
  addXp: (amount: number) => void;
  emotionTheme: string;
  setEmotionTheme: (theme: string) => void;
}

export default function DailyDropTab({
  userCoins,
  setUserCoins,
  streakCount,
  setStreakCount,
  addXp,
  emotionTheme,
  setEmotionTheme,
}: DailyDropTabProps) {
  // Check-In Streak
  const [checkedInToday, setCheckedInToday] = useState(false);

  // Daily Challenge
  const [challengeInput, setChallengeInput] = useState("");
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);

  // Childhood vs Now slider index
  const [vsIndex, setVsIndex] = useState(0);

  const vsSliders = [
    {
      title: "Playtime ⚽",
      then: "Running out at 5 PM sharp for street cricket with cousins and neighbors 🏏",
      now: "Tapping screens, double tapping posts, and mindlessly scrolling video feeds 📱",
    },
    {
      title: "Communication 📞",
      then: "Calling school buddies on landline phones, praying their parents don't pick up first!",
      now: "Sending micro-messages and disappearing story slides with 10 filters added.",
    },
    {
      title: "Rainy Days 🌧️",
      then: "Forming paper boat fleets to float in puddles while drinking warm home cocoa ☕",
      now: "Ordering fast food through home delivery apps while checking screen alerts.",
    },
  ];

  const handleCheckIn = () => {
    if (checkedInToday) return;
    synth.playGameSound("coin");
    setCheckedInToday(true);
    setStreakCount((s) => s + 1);
    setUserCoins((c) => c + 20);
    addXp(30);
  };

  const handleChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeInput.trim()) return;
    synth.playGameSound("match");
    setChallengeSubmitted(true);
    setUserCoins((c) => c + 15);
    addXp(20);
  };

  // Emotion mappings
  const emotionDetails = {
    default: { label: "Standard Exploration", bg: "bg-[#FFF9F2]", text: "Let us explore some memories." },
    missing: { label: "Missing Childhood 🥹", bg: "bg-red-50/50", text: "Comfort food, family stories, and old warm cartoon hubs highlighted." },
    fun: { label: "Want Fun Memories 😂", bg: "bg-yellow-50/50", text: "Retro arcade cabinets, funny street cricket arguments, and comics ready!" },
    comfort: { label: "Need Comfort 😌", bg: "bg-emerald-50/50", text: "Monsoon sound boards, warm room customization, and soft melodies ready." },
    nostalgic: { label: "Feeling Nostalgic 🌙", bg: "bg-purple-50/50", text: "MSN Chat conversations with Sunny, wax letters, and memory timelines ready." },
  };

  return (
    <div className="grid grid-cols-12 gap-6" id="daily-tab-view">
      {/* LEFT COLUMN: STREAK AND DAILY CHALLENGE */}
      <div className="col-span-12 md:col-span-6 flex flex-col gap-6">
        {/* DAILY DROPS STREAK CARD */}
        <div className="bg-white rounded-[2.5rem] border-2 border-[#FFEBD6] p-6 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-orange-50 pb-3">
            <div>
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                STREAK AND LEVELING
              </span>
              <h3 className="text-xl font-black mt-2 text-[#2D2D2D] flex items-center gap-1.5">
                <Flame className="w-5 h-5 text-orange-500" />
                Feature 27: Streak System
              </h3>
            </div>
            <span className="text-[10px] font-bold text-[#FF6B35] font-mono bg-orange-50 px-2.5 py-1 rounded-lg">
              STREAK: {streakCount} DAYS
            </span>
          </div>

          <p className="text-xs text-gray-500 font-semibold leading-relaxed">
            Check-in daily to increment your explorer badges and unlock rare artifacts in the Capsule Inventory!
          </p>

          <button
            onClick={handleCheckIn}
            disabled={checkedInToday}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow transition-all ${
              checkedInToday
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-[#FF6B35] text-white hover:scale-[1.01] active:scale-95 shadow-orange-100"
            }`}
          >
            {checkedInToday ? "✓ STREAK CHECKED IN TODAY (+20💰)" : "CHECK IN DAILY STREAK"}
          </button>
        </div>

        {/* EMOTION-BASED SELECTION CHANGER */}
        <div className="bg-white rounded-[2.5rem] border-2 border-[#FFEBD6] p-6 shadow-sm flex flex-col gap-4">
          <div className="border-b border-orange-50 pb-3">
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Feature 31: Emotion-Based
            </span>
            <h3 className="text-xl font-black mt-2 text-[#2D2D2D]">How are you feeling today?</h3>
            <p className="text-xs text-gray-500 font-semibold mt-1 leading-none">
              Your mood choices change the platform ambiance and highlight custom nostalgic memories.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "missing", label: "Missing Childhood 🥹", icon: "🧸" },
              { id: "fun", label: "Want Fun Memories 😂", icon: "🕹️" },
              { id: "comfort", label: "Need Comfort 😌", icon: "☕" },
              { id: "nostalgic", label: "Feeling Nostalgic 🌙", icon: "🖋️" },
            ].map((emo) => {
              const isSelected = emotionTheme === emo.id;
              return (
                <button
                  key={emo.id}
                  onClick={() => {
                    synth.playGameSound("coin");
                    setEmotionTheme(emo.id);
                  }}
                  className={`p-3 rounded-2xl border-2 text-left text-xs font-bold flex items-center gap-2 transition-all ${
                    isSelected
                      ? "bg-orange-50 border-[#FF6B35] text-[#FF6B35] shadow"
                      : "bg-white border-[#FFEBD6] text-gray-600 hover:border-orange-200"
                  }`}
                >
                  <span className="text-xl">{emo.icon}</span>
                  <span>{emo.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              Active Ambiance Profile
            </p>
            <p className="text-xs font-bold text-gray-700 leading-relaxed">
              {emotionDetails[emotionTheme as keyof typeof emotionDetails]?.text || emotionDetails.default.text}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: COMPARISON SLIDER & DAILY DROPS CHALLENGE */}
      <div className="col-span-12 md:col-span-6 flex flex-col gap-6">
        {/* CHILDHOOD VS NOW SLIDER (Feature 47) */}
        <div className="bg-[#FFF9F2] rounded-[2.5rem] border-2 border-[#FFEBD6] p-6 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-orange-50 pb-3">
            <div>
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Feature 47: Comparison
              </span>
              <h3 className="text-xl font-black mt-2 text-[#2D2D2D] flex items-center gap-1.5">
                <ArrowLeftRight className="w-5 h-5 text-[#FF6B35]" />
                Childhood vs Now
              </h3>
            </div>

            <div className="flex gap-1 bg-white p-1 rounded-lg border border-[#FFEBD6]">
              {vsSliders.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    synth.playGameSound("coin");
                    setVsIndex(idx);
                  }}
                  className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-black ${
                    vsIndex === idx ? "bg-[#FF6B35] text-white" : "bg-transparent text-gray-400"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Then card */}
            <div className="p-4 bg-orange-50 rounded-2xl border-2 border-[#FF6B35]/20 flex flex-col gap-2 relative">
              <span className="absolute top-2 right-2 text-[8px] bg-[#FF6B35] text-white font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                THEN
              </span>
              <h4 className="text-xs font-black text-[#FF6B35] leading-none mb-1">
                {vsSliders[vsIndex].title.split(" ")[0]} Memory
              </h4>
              <p className="text-[10px] text-gray-700 leading-relaxed font-bold">
                {vsSliders[vsIndex].then}
              </p>
            </div>

            {/* Now card */}
            <div className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col gap-2 relative">
              <span className="absolute top-2 right-2 text-[8px] bg-gray-400 text-white font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                NOW
              </span>
              <h4 className="text-xs font-black text-gray-500 leading-none mb-1">Modern Equivalent</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                {vsSliders[vsIndex].now}
              </p>
            </div>
          </div>
        </div>

        {/* DAILY TRIVIA NOSTALGIA CHALLENGE */}
        <div className="bg-white rounded-[2.5rem] border-2 border-[#FFEBD6] p-6 shadow-sm flex flex-col gap-4">
          <div className="border-b border-orange-50 pb-3">
            <span className="bg-[#00B4D8]/15 text-[#00B4D8] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              DAILY REWIND DROP
            </span>
            <h3 className="text-xl font-black mt-2 text-[#2D2D2D] flex items-center gap-1.5">
              <HelpCircle className="w-5 h-5 text-[#00B4D8]" />
              Feature 21 Challenge
            </h3>
            <p className="text-xs text-gray-500 font-semibold mt-1 leading-none">
              Daily Challenge: Name 3 cartoons from your childhood history!
            </p>
          </div>

          {!challengeSubmitted ? (
            <form onSubmit={handleChallengeSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="E.g., Dragon Ball Z, Pokémon, Beyblade"
                value={challengeInput}
                onChange={(e) => setChallengeInput(e.target.value)}
                className="px-4 py-2 bg-[#FFF9F2] border-2 border-[#FFEBD6] rounded-2xl text-xs font-bold focus:outline-none focus:border-[#FF6B35]"
              />
              <button
                type="submit"
                disabled={!challengeInput.trim()}
                className="py-2.5 bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow disabled:opacity-50"
              >
                SUBMIT FOR CHEST LOCKS (+15💰)
              </button>
            </form>
          ) : (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl flex items-center gap-2 animate-fade-in text-xs font-bold leading-relaxed">
              <span>🎉 Correct! +15💰 coins unlocked for the Capsule Vault! Check back tomorrow for more challenges!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
