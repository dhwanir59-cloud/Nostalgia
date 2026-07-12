/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Compass, Gamepad2, Monitor, Trophy, Sparkles, Heart } from "lucide-react";

// Sub-components
import ExploreTab from "./components/ExploreTab";
import ArcadeTab from "./components/ArcadeTab";
import CyberCafeTab from "./components/CyberCafeTab";
import NostalgiaTestTab from "./components/NostalgiaTestTab";
import DailyDropTab from "./components/DailyDropTab";

import { RetroInventoryItem } from "./types";
import { synth } from "./utils/synth";

export default function App() {
  const [activeTab, setActiveTab] = useState<"explore" | "arcade" | "cybercafe" | "dna-test" | "daily">("explore");

  // Global user state persistent via localStorage
  const [userCoins, setUserCoins] = useState(() => {
    return Number(localStorage.getItem("rewind_user_coins") || "50");
  });

  const [experiencePoints, setExperiencePoints] = useState(() => {
    return Number(localStorage.getItem("rewind_user_xp") || "0");
  });

  const [stamps, setStamps] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("rewind_user_stamps") || "[]");
    } catch (e) {
      return [];
    }
  });

  const [starredLandmarks, setStarredLandmarks] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("rewind_user_starred") || "[]");
    } catch (e) {
      return [];
    }
  });

  const [streakCount, setStreakCount] = useState(() => {
    return Number(localStorage.getItem("rewind_streak_count") || "1");
  });

  const [emotionTheme, setEmotionTheme] = useState("default");

  // Dynamic Level computation based on XP: 100 XP per level
  const explorerLevel = Math.floor(experiencePoints / 100) + 1;
  const xpInCurrentLevel = experiencePoints % 100;

  // Initializing childhood RPG inventories list (Common, Rare, Legendary)
  const [inventory, setInventory] = useState<RetroInventoryItem[]>(() => {
    const defaultInv: RetroInventoryItem[] = [
      { id: "pencil", name: "Natraj Pencil", description: "The classic wood pencil with the white rubber eraser top.", category: "common", icon: "✏️", rarityColor: "#4CAF50", funFact: "Using teeth to bite off the metal eraser crown was common." },
      { id: "candy", name: "Mango Candy", description: "The local orange-wrapped sweet pop of summer vacations.", category: "common", icon: "🍬", rarityColor: "#4CAF50", funFact: "It would turn your tongue completely orange." },
      { id: "slambook", name: "School Slam Book", description: "The notebook full of favorite colors, movies, and teacher jokes.", category: "common", icon: "📕", rarityColor: "#4CAF50", funFact: "Everyone wanted to be the last one to sign the pages." },
      { id: "tamagotchi", name: "Virtual Pet", description: "The pocket keychain companion you had to feed every hour.", category: "rare", icon: "📟", rarityColor: "#00B4D8", funFact: "If you forgot to feed it for a day, it went to heaven." },
      { id: "nokia", name: "Nokia 3310", description: "The brick phone that could survive a drop from a tall bus roof.", category: "rare", icon: "📱", rarityColor: "#00B4D8", funFact: "It was practically indestructible and had a 1-week battery." },
      { id: "gameboy", name: "Gameboy Color", description: "The transparent purplish handheld running pixel cartridges.", category: "rare", icon: "🎮", rarityColor: "#00B4D8", funFact: "Blowing on the cartridge slots fixed most crash errors." },
      { id: "lastday", name: "Last Day of School", description: "The legendary memory of signing shirts with permanent markers.", category: "legendary", icon: "🎒", rarityColor: "#FF6B35", funFact: "You promised to meet every week, but life moved on." },
    ];

    try {
      const stored = localStorage.getItem("rewind_user_inventory");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Sync with properties
        return defaultInv.map(def => {
          const match = parsed.find((p: any) => p.id === def.id);
          if (match && match.unlockedAt) {
            return { ...def, unlockedAt: match.unlockedAt };
          }
          return def;
        });
      }
    } catch (e) {
      // Fallback
    }
    return defaultInv;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("rewind_user_coins", userCoins.toString());
  }, [userCoins]);

  useEffect(() => {
    localStorage.setItem("rewind_user_xp", experiencePoints.toString());
  }, [experiencePoints]);

  useEffect(() => {
    localStorage.setItem("rewind_user_stamps", JSON.stringify(stamps));
  }, [stamps]);

  useEffect(() => {
    localStorage.setItem("rewind_user_starred", JSON.stringify(starredLandmarks));
  }, [starredLandmarks]);

  useEffect(() => {
    localStorage.setItem("rewind_user_inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem("rewind_streak_count", streakCount.toString());
  }, [streakCount]);

  // Sound triggers
  const playTabClickSound = () => {
    synth.playGameSound("coin");
  };

  const addXp = (amount: number) => {
    setExperiencePoints(prev => prev + amount);
  };

  const addStamp = (stampId: string) => {
    if (!stamps.includes(stampId)) {
      setStamps([...stamps, stampId]);
    }
  };

  const toggleStarLandmark = (landmarkId: string) => {
    if (starredLandmarks.includes(landmarkId)) {
      setStarredLandmarks(starredLandmarks.filter(id => id !== landmarkId));
    } else {
      setStarredLandmarks([...starredLandmarks, landmarkId]);
    }
  };

  // Dynamic Background Tinting based on Emotion theme selection (Feature 31)
  const getEmotionBgOverlay = () => {
    if (emotionTheme === "missing") return "bg-red-50/20 border-red-200/40";
    if (emotionTheme === "fun") return "bg-yellow-50/20 border-yellow-200/40";
    if (emotionTheme === "comfort") return "bg-emerald-50/20 border-emerald-200/40";
    if (emotionTheme === "nostalgic") return "bg-purple-50/20 border-purple-200/40";
    return "bg-[#FFF9F2] border-[#FFEBD6]";
  };

  return (
    <div className={`min-h-screen w-full flex flex-col overflow-x-hidden font-sans select-none transition-all duration-500 ${getEmotionBgOverlay()}`}>
      
      {/* TOP NAVIGATION BAR */}
      <nav className="h-16 px-8 bg-white border-b-2 border-[#FFEBD6] flex items-center justify-between shadow-sm shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF6B35] rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 transform hover:scale-105 transition-all">
            <span className="text-white font-black text-xl">W</span>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#FF6B35]">
              rewind <span className="text-[#00B4D8] italic font-medium">// REWIND</span>
            </h1>
          </div>
        </div>

        {/* Global tabs row */}
        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-sm font-bold text-[#6B7280] uppercase tracking-wider">
            {[
              { id: "explore", label: "Explore", icon: <Compass className="w-4 h-4" /> },
              { id: "arcade", label: "Arcade", icon: <Gamepad2 className="w-4 h-4" /> },
              { id: "cybercafe", label: "Cyber Café", icon: <Monitor className="w-4 h-4" /> },
              { id: "dna-test", label: "Nostalgia Tests", icon: <Trophy className="w-4 h-4" /> },
              { id: "daily", label: "Daily Drops", icon: <Sparkles className="w-4 h-4" /> },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playTabClickSound();
                    setActiveTab(tab.id as any);
                  }}
                  className={`flex items-center gap-1.5 pb-1 transition-all ${
                    isSelected
                      ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-black"
                      : "hover:text-[#FF6B35] hover:scale-[1.01]"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Level Badge and Coin Bag */}
          <div className="flex items-center gap-4">
            {/* Coins Bag */}
            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              <span className="text-sm">💰</span>
              <span className="font-mono font-black text-xs text-amber-700">{userCoins}</span>
            </div>

            {/* XP level meter */}
            <div className="flex items-center gap-2.5 bg-[#F3F4F6] px-4 py-2 rounded-full border border-gray-200">
              <div className="w-5 h-5 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black">
                ★
              </div>
              <div className="flex flex-col">
                <span className="font-black text-[9px] uppercase tracking-tighter leading-none">
                  Explorer Lvl {explorerLevel}
                </span>
                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-0.5 border border-gray-300">
                  <div className="h-full bg-yellow-400 transition-all duration-500" style={{ width: `${xpInCurrentLevel}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN LAYOUT GRID */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
        
        {/* Dynamic Warning for Fallback Mode */}
        {process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY" && (
          <div className="p-4 bg-orange-50 border-2 border-dashed border-[#FF6B35]/40 rounded-3xl flex items-center justify-between text-xs font-bold text-gray-700">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF6B35] animate-bounce" />
              Note: Run with local mock fallbacks. Configure GEMINI_API_KEY in the Secrets setting tab for real live AI stories!
            </span>
          </div>
        )}

        {/* Tab content frames */}
        <div className="flex-1">
          {activeTab === "explore" && (
            <ExploreTab
              userCoins={userCoins}
              setUserCoins={setUserCoins}
              stamps={stamps}
              addStamp={addStamp}
              starredLandmarks={starredLandmarks}
              toggleStar={toggleStarLandmark}
            />
          )}

          {activeTab === "arcade" && (
            <ArcadeTab
              userCoins={userCoins}
              setUserCoins={setUserCoins}
              inventory={inventory}
              setInventory={setInventory}
              addXp={addXp}
            />
          )}

          {activeTab === "cybercafe" && (
            <CyberCafeTab
              userCoins={userCoins}
              setUserCoins={setUserCoins}
              addXp={addXp}
            />
          )}

          {activeTab === "dna-test" && (
            <NostalgiaTestTab
              userCoins={userCoins}
              setUserCoins={setUserCoins}
              addXp={addXp}
            />
          )}

          {activeTab === "daily" && (
            <DailyDropTab
              userCoins={userCoins}
              setUserCoins={setUserCoins}
              streakCount={streakCount}
              setStreakCount={setStreakCount}
              addXp={addXp}
              emotionTheme={emotionTheme}
              setEmotionTheme={setEmotionTheme}
            />
          )}
        </div>
      </main>

      {/* FOOTER STATUS BAR */}
      <footer className="h-12 px-8 bg-[#FEE4CC] flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6B35] shrink-0 border-t border-orange-200">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] animate-pulse"></span>
            CONNECTED TO MEMORY SERVER
          </div>
          <div>LATENCY: 12MS</div>
        </div>
        <div className="flex gap-6">
          <span className="opacity-60">© 2026 rewind // REWIND PROJECT</span>
          <span>EST. 2000-2010 NOSTALGIA</span>
        </div>
      </footer>
    </div>
  );
}
