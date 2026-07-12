/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, MessageSquare, Shield, Send, RefreshCw, Award, Smile, BookOpen, Clock, Heart } from "lucide-react";
import { synth } from "../utils/synth";
import { ChatMessage, QuizQuestion, MemoryTimelineItem } from "../types";

interface NostalgiaTestTabProps {
  userCoins: number;
  setUserCoins: React.Dispatch<React.SetStateAction<number>>;
  addXp: (amount: number) => void;
}

export default function NostalgiaTestTab({
  userCoins,
  setUserCoins,
  addXp,
}: NostalgiaTestTabProps) {
  const [activeSubSection, setActiveSubSection] = useState<"ai-story" | "dna-quiz" | "chat-sunny" | "letters" | "timeline">("ai-story");

  // ----------------------------------------------------
  // AI CHILDHOOD STORY CREATOR (Feature 22)
  // ----------------------------------------------------
  const [storyPrompt, setStoryPrompt] = useState("");
  const [generatedStory, setGeneratedStory] = useState("");
  const [storyLoading, setStoryLoading] = useState(false);
  const [animatedStoryText, setAnimatedStoryText] = useState("");

  const handleGenerateStory = async (presetText?: string) => {
    const prompt = presetText || storyPrompt;
    if (!prompt.trim()) return;

    setStoryLoading(true);
    setGeneratedStory("");
    setAnimatedStoryText("");
    synth.playGameSound("coin");

    try {
      const res = await fetch("/api/gemini/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, details: { timestamp: new Date().toISOString() } }),
      });
      const data = await res.json();
      if (data.text) {
        setGeneratedStory(data.text);
        setUserCoins((c) => c + 15);
        addXp(25);
      } else {
        setGeneratedStory("The nostalgic memory faded out temporarily. Please write another memory!");
      }
    } catch (e) {
      setGeneratedStory("The memory server is resting. Remember when we played in the neighborhood garden after rain? There was no internet, just the cold breeze.");
    } finally {
      setStoryLoading(false);
    }
  };

  // Typwriter effect for generated story
  useEffect(() => {
    if (!generatedStory) return;
    let index = 0;
    const interval = setInterval(() => {
      setAnimatedStoryText((prev) => prev + generatedStory.charAt(index));
      index++;
      if (index >= generatedStory.length) {
        clearInterval(interval);
      }
    }, 20); // ms per character
    return () => clearInterval(interval);
  }, [generatedStory]);

  // ----------------------------------------------------
  // CHILDHOOD DNA PERSONALITY TEST (Feature 16, 36)
  // ----------------------------------------------------
  const dnaQuestions: QuizQuestion[] = [
    {
      id: "q1",
      question: "What did you do immediately after school bags hit the floor?",
      options: [
        "Dashed out to the street with a bat/ball 🏏",
        "Switched on the TV for Cartoon Network/Anime 📺",
        "Sat down to sketch or build blocks 🎨",
        "Turned on the computer/console immediately 🎮",
      ],
      answerIndex: 0, // Not matching a single correct, used for profile computing
      fact: "After school time was a sacred golden hour for 90s/2000s kids.",
      points: 10,
    },
    {
      id: "q2",
      question: "Which of these was your ultimate summer treasure?",
      options: [
        "A pocketful of local candies & popsicles 🍭",
        "A shiny new cassette tape or CD 📼",
        "A vintage gaming console cartridge 🕹️",
        "A pile of comic books or drawing books 📚",
      ],
      answerIndex: 0,
      fact: "Summer vacations meant complete freedom from homework.",
      points: 10,
    },
    {
      id: "q3",
      question: "How did you spend cozy rainy monsoon evenings?",
      options: [
        "Sailing paper boats in the street drains ⛵",
        "Playing board games in the living room with family 🎲",
        "Drawing fictional cartoon characters 🎨",
        "Trying to log on to the slow dial-up internet 📶",
      ],
      answerIndex: 0,
      fact: "Rainy days were formal school holidays in many tropical cities.",
      points: 10,
    },
  ];

  const [currentDnaIndex, setCurrentDnaIndex] = useState(0);
  const [dnaAnswers, setDnaAnswers] = useState<number[]>([]);
  const [dnaCompleted, setDnaCompleted] = useState(false);
  const [computedDna, setComputedDna] = useState<{
    gaming: number;
    school: number;
    creativity: number;
    outdoor: number;
    cartoon: number;
    title: string;
    description: string;
  } | null>(null);

  const handleSelectDnaAnswer = (optIndex: number) => {
    synth.playGameSound("coin");
    const nextAnswers = [...dnaAnswers, optIndex];
    setDnaAnswers(nextAnswers);

    if (currentDnaIndex < dnaQuestions.length - 1) {
      setCurrentDnaIndex(currentDnaIndex + 1);
    } else {
      // Compute DNA Profile percentages based on answers array
      const count0 = nextAnswers.filter((a) => a === 0).length;
      const count1 = nextAnswers.filter((a) => a === 1).length;
      const count2 = nextAnswers.filter((a) => a === 2).length;
      const count3 = nextAnswers.filter((a) => a === 3).length;

      const total = nextAnswers.length;

      // Compute weighted results
      const outdoor = Math.round(((count0 + 1) / (total + 4)) * 100);
      const cartoon = Math.round(((count1 + 1) / (total + 4)) * 100);
      const creativity = Math.round(((count2 + 1) / (total + 4)) * 100);
      const gaming = Math.round(((count3 + 1) / (total + 4)) * 100);
      const school = Math.round(((count1 + count0 + 1) / (total * 2)) * 100);

      let title = "The Dreamer 🌙";
      let description = "You lived in your beautiful imagination, reading comics, and drawing paper planes.";

      if (gaming > 50) {
        title = "The Gamer 🎮";
        description = "Your childhood happened inside game consoles. You knew the secret cartridge blow cheat!";
      } else if (outdoor > 50) {
        title = "The Athlete 🏏";
        description = "Street play was your world. Arguments over wickets settled your evenings.";
      } else if (cartoon > 50) {
        title = "The Cartoon Fanatic 📺";
        description = "You finished homework super fast just to watch anime or your favorite cartoons.";
      }

      setComputedDna({ gaming, school, creativity, outdoor, cartoon, title, description });
      setDnaCompleted(true);
      setUserCoins((c) => c + 30);
      addXp(40);
    }
  };

  const resetDnaQuiz = () => {
    setCurrentDnaIndex(0);
    setDnaAnswers([]);
    setDnaCompleted(false);
    setComputedDna(null);
  };

  // ----------------------------------------------------
  // MSN AOL MESSENGER LIVE AI COMPANION "SUNNY" (Feature 49)
  // ----------------------------------------------------
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    return [
      {
        id: "init",
        role: "model",
        text: "Hey! Remember when we used to build forts out of bedsheets and pillows? Or when we shared orange ice-candies in the blistering heat? What is your favorite memory from school recess?",
        timestamp: new Date().toLocaleTimeString(),
      },
    ];
  });
  const [chatLoading, setChatLoading] = useState(false);
  const [screenNudge, setScreenNudge] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    synth.playGameSound("coin");
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/gemini/companion-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          history: updatedHistory.map((h) => ({ role: h.role, text: h.text })),
        }),
      });
      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "model",
        text: data.text || "I am thinking about our cycle race last summer...",
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatHistory((prev) => [...prev, botMsg]);
      setUserCoins((c) => c + 5);
      addXp(10);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "model",
          text: "I remember when the power went out during monsoon and we made shadows on the wall with candles. Sunny is offline now, but Sunny is always with you in memories.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleNudgeMessenger = () => {
    synth.playGameSound("nudge");
    setScreenNudge(true);
    setTimeout(() => setScreenNudge(false), 500);
  };

  // Auto scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // ----------------------------------------------------
  // WAX-SEALED MEMORY LETTERS (Feature 14)
  // ----------------------------------------------------
  const [letterText, setLetterText] = useState("");
  const [letterSealed, setLetterSealed] = useState(false);

  const handleSealLetter = () => {
    if (!letterText.trim()) return;
    synth.playGameSound("stamp");
    setLetterSealed(true);
    setUserCoins((c) => c + 15);
    addXp(20);
  };

  // ----------------------------------------------------
  // LIFE TIMELINE GENERATOR (Feature 10)
  // ----------------------------------------------------
  const [timelineItems, setTimelineItems] = useState<MemoryTimelineItem[]>([
    {
      year: 2008,
      title: "First Cartoon Obsession",
      bullet1: "Watching Dragon Ball Z at 5 PM sharp.",
      bullet2: "Collecting Tazo discs from potato chips.",
      bullet3: "Mimicking power attacks in front of mirror.",
      theme: "cartoon",
    },
    {
      year: 2012,
      title: "First Mobile Game",
      bullet1: "Playing Bounce and Snake on dad's Nokia.",
      bullet2: "Hearing the iconic monotone ringtone.",
      bullet3: "Struggling to browse early mobile portals.",
      theme: "game",
    },
  ]);

  const [newYear, setNewYear] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newBullet, setNewBullet] = useState("");

  const handleAddTimeline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYear || !newTitle || !newBullet) return;

    synth.playGameSound("coin");
    const newItem: MemoryTimelineItem = {
      year: Number(newYear),
      title: newTitle,
      bullet1: newBullet,
      bullet2: "Sharing memories with friends on landlines.",
      bullet3: "Collecting trading cards and cool candies.",
      theme: "custom",
    };

    setTimelineItems((prev) => [...prev, newItem].sort((a, b) => a.year - b.year));
    setNewYear("");
    setNewTitle("");
    setNewBullet("");
    setUserCoins((c) => c + 20);
    addXp(25);
  };

  return (
    <div className={`grid grid-cols-12 gap-6 transition-all duration-300 ${screenNudge ? "translate-x-1 translate-y-1 rotate-1" : ""}`} id="nostalgia-tab-view">
      {/* Sub-Navigation Row */}
      <div className="col-span-12 flex gap-2 p-1.5 bg-white rounded-2xl border border-[#FFEBD6] overflow-x-auto self-start">
        {[
          { id: "ai-story", label: "AI Story Creator 🧠", icon: "✨" },
          { id: "dna-quiz", label: "Childhood DNA Test 🏆", icon: "🧬" },
          { id: "chat-sunny", label: "MSN Chat: Sunny 💬", icon: "🟢" },
          { id: "letters", label: "Nostalgic Letters 💌", icon: "🖋️" },
          { id: "timeline", label: "Memory Timeline 🕰️", icon: "📅" },
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => {
              synth.playGameSound("coin");
              setActiveSubSection(sec.id as any);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSubSection === sec.id
                ? "bg-[#FF6B35] text-white shadow-md shadow-orange-100"
                : "text-gray-500 hover:text-[#FF6B35]"
            }`}
          >
            <span>{sec.icon}</span>
            <span>{sec.label}</span>
          </button>
        ))}
      </div>

      {/* LEFT PORTAL WRAPPER */}
      <div className="col-span-12 md:col-span-8 bg-white rounded-[2.5rem] border-2 border-[#FFEBD6] shadow-xl p-8 flex flex-col gap-6 min-h-[420px]">
        {/* AI story builder */}
        {activeSubSection === "ai-story" && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="border-b border-orange-50 pb-3">
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Feature 22: AI Storytelling
              </span>
              <h3 className="text-xl font-black mt-2 text-[#2D2D2D]">AI Childhood Story Creator</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1 leading-relaxed">
                Describe any faint memory in a few words, and watch Gemini expand it into a touching nostalgic story!
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <textarea
                value={storyPrompt}
                onChange={(e) => setStoryPrompt(e.target.value)}
                placeholder="E.g., Stealing sweet green mangoes from neighbors' trees during summer afternoon rains, and running away with dirty knees..."
                className="w-full h-24 p-4 bg-[#FFF9F2] border-2 border-[#FFEBD6] rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#FF6B35]"
              />

              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Quick Presets:</span>
                {[
                  { label: "Street Cricket 🏏", text: "playing cricket with neighbors and losing the fuzzy tennis ball" },
                  { label: "Sunday Morning Cartoons 📺", text: "eating hot breakfast while watching classic anime on box TV" },
                  { label: "Water Fights 🌧️", text: "splashing in puddle water and floating newspapers" },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setStoryPrompt(preset.text);
                      handleGenerateStory(preset.text);
                    }}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-orange-50 hover:text-[#FF6B35] rounded-xl text-[10px] font-bold border border-gray-100 transition-all"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleGenerateStory()}
                disabled={storyLoading || !storyPrompt.trim()}
                className="py-3 bg-[#FF6B35] text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow disabled:opacity-50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                {storyLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Unlocking memories...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> GENERATE NOSTALGIC STORY (+15💰)
                  </>
                )}
              </button>
            </div>

            {animatedStoryText && (
              <div className="p-5 bg-[#FFF9F2] rounded-3xl border-2 border-[#FFEBD6] flex flex-col gap-2 shadow-inner">
                <span className="text-[9px] font-black text-[#FF6B35] uppercase tracking-widest font-mono">
                  GEMINI MEMORY STREAM
                </span>
                <p className="text-xs font-semibold text-gray-700 leading-relaxed italic whitespace-pre-wrap">
                  {animatedStoryText}
                </p>
              </div>
            )}
          </div>
        )}

        {/* CHILDHOOD DNA PERSONALITY QUIZ */}
        {activeSubSection === "dna-quiz" && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="border-b border-orange-50 pb-3">
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Feature 16 & 36
              </span>
              <h3 className="text-xl font-black mt-2 text-[#2D2D2D]">Your Childhood Personality DNA</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1 leading-relaxed">
                Take this custom diagnostic psych test to compute your authentic childhood compatibility index!
              </p>
            </div>

            {!dnaCompleted ? (
              <div className="p-6 bg-[#FFF9F2] rounded-3xl border border-[#FFEBD6] flex flex-col gap-4">
                <div className="flex justify-between items-center text-[10px] font-black text-[#FF6B35] uppercase tracking-wider">
                  <span>QUESTION {currentDnaIndex + 1} OF {dnaQuestions.length}</span>
                  <span>+10 POINTS EACH</span>
                </div>

                <h4 className="text-sm font-black text-[#2D2D2D] leading-tight">
                  {dnaQuestions[currentDnaIndex].question}
                </h4>

                <div className="space-y-2">
                  {dnaQuestions[currentDnaIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectDnaAnswer(idx)}
                      className="w-full p-4 bg-white hover:bg-orange-50/50 border-2 border-[#FFEBD6] hover:border-[#FF6B35]/40 text-left text-xs font-bold rounded-2xl transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              computedDna && (
                <div className="p-6 bg-gradient-to-br from-[#FFF9F2] to-amber-50/30 rounded-[2.5rem] border-2 border-[#FF6B35]/30 flex flex-col gap-6 relative overflow-hidden shadow-inner">
                  <div className="flex justify-between items-start border-b border-orange-100 pb-4">
                    <div>
                      <span className="text-[9px] bg-[#FF6B35]/10 text-[#FF6B35] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        CHILDHOOD PROFILE CERTIFICATE
                      </span>
                      <h4 className="text-2xl font-black text-[#2D2D2D] mt-2 leading-none">
                        {computedDna.title}
                      </h4>
                      <p className="text-xs text-gray-600 font-semibold mt-1">{computedDna.description}</p>
                    </div>
                    <Award className="w-12 h-12 text-[#FF6B35] animate-bounce-slow" />
                  </div>

                  <div className="space-y-3.5">
                    {[
                      { label: "Cartoon Addiction", val: computedDna.cartoon, col: "bg-[#FF6B35]" },
                      { label: "Gaming Level", val: computedDna.gaming, col: "bg-[#00B4D8]" },
                      { label: "School Memories", val: computedDna.school, col: "bg-emerald-500" },
                      { label: "Outdoor Street Play", val: computedDna.outdoor, col: "bg-purple-500" },
                      { label: "Creativity & Artistry", val: computedDna.creativity, col: "bg-pink-500" },
                    ].map((dna, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-gray-700">
                          <span>{dna.label}</span>
                          <span className="font-mono">{dna.val}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                          <div className={`h-full ${dna.col} transition-all duration-1000`} style={{ width: `${dna.val}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={resetDnaQuiz}
                    className="mt-2 py-2 bg-white text-[#FF6B35] border-2 border-[#FF6B35] rounded-xl font-bold text-xs hover:bg-orange-50 transition-all self-start"
                  >
                    RETENTION TEST RESTART
                  </button>
                </div>
              )
            )}
          </div>
        )}

        {/* MSN AOL MESSENGER WITH "SUNNY" */}
        {activeSubSection === "chat-sunny" && (
          <div className="flex flex-col gap-4 animate-fade-in h-96">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-lg">●</span>
                <h4 className="text-xs font-black text-gray-700 font-mono">Sunny (Online best friend)</h4>
              </div>
              <button
                onClick={handleNudgeMessenger}
                className="px-2 py-1 bg-red-50 text-red-600 rounded text-[9px] font-black uppercase tracking-wider"
              >
                💥 NUDGE SCREEN
              </button>
            </div>

            {/* Chats stream */}
            <div className="flex-1 bg-[#FFF9F2] rounded-2xl border border-[#FFEBD6] p-4 overflow-y-auto space-y-3 shadow-inner">
              {chatHistory.map((msg) => {
                const isModel = msg.role === "model";
                return (
                  <div key={msg.id} className={`flex ${isModel ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm text-xs font-semibold leading-relaxed ${
                      isModel
                        ? "bg-white text-gray-800 border border-orange-100 rounded-tl-none"
                        : "bg-[#FF6B35] text-white rounded-tr-none"
                    }`}>
                      <p>{msg.text}</p>
                      <span className="text-[8px] opacity-40 block text-right mt-1 font-mono">{msg.timestamp}</span>
                    </div>
                  </div>
                );
              })}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl p-3 border border-orange-100 text-xs text-gray-500 animate-pulse font-bold">
                    Sunny is typing a memory...
                  </div>
                </div>
              )}
              <div ref={chatBottomRef}></div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                placeholder="Talk to Sunny as if it is 2004..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-4 py-2 bg-white rounded-2xl border-2 border-[#FFEBD6] text-xs font-semibold focus:outline-none focus:border-[#FF6B35]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#FF6B35] text-white rounded-2xl font-black text-xs uppercase"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* WAX-SEALED LETTERS */}
        {activeSubSection === "letters" && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="border-b border-orange-50 pb-3">
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Feature 14: Digital Memory Letters
              </span>
              <h3 className="text-xl font-black mt-2 text-[#2D2D2D]">Letter to my 10-year-old self</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1 leading-relaxed">
                Write a private journal or encouraging note to your younger self on textured notebook sheets.
              </p>
            </div>

            {!letterSealed ? (
              <div className="bg-amber-50/40 rounded-3xl p-6 border border-[#FFEBD6] flex flex-col gap-4 relative">
                {/* Simulated notebook lines */}
                <div className="absolute inset-0 bg-notebook-lines opacity-20 pointer-events-none"></div>

                <textarea
                  value={letterText}
                  onChange={(e) => setLetterText(e.target.value)}
                  placeholder="Dear 10-year-old me, please do not worry about the math test. You will grow up to explore the entire world, and you will compile a beautiful box of memories..."
                  className="w-full h-36 bg-transparent border-none text-xs font-bold leading-relaxed resize-none focus:outline-none text-gray-800 relative z-10"
                />

                <button
                  onClick={handleSealLetter}
                  disabled={!letterText.trim()}
                  className="px-6 py-2.5 bg-[#FF6B35] text-white rounded-2xl font-black text-xs uppercase tracking-wider self-start shadow disabled:opacity-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  🔴 SEAL WITH WAX STAMP (+15💰)
                </button>
              </div>
            ) : (
              <div className="p-6 bg-[#FFF9F2] rounded-[2rem] border-2 border-dashed border-[#FF6B35] flex flex-col items-center justify-center text-center gap-4 py-10 animate-fade-in">
                <span className="text-5xl">✉️</span>
                <div className="w-12 h-12 bg-[#8B0000] rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-black text-lg">
                  印
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#2D2D2D]">Letter Wax-Sealed and Vaulted!</h4>
                  <p className="text-[10px] text-gray-500 font-bold leading-relaxed mt-1">
                    Your letter is safely locked in your private local diary. +15💰 coins rewarded!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setLetterText("");
                    setLetterSealed(false);
                  }}
                  className="px-4 py-1.5 bg-[#FF6B35] text-white rounded-xl text-[10px] font-bold"
                >
                  Write Another
                </button>
              </div>
            )}
          </div>
        )}

        {/* TIMELINE GENERATOR */}
        {activeSubSection === "timeline" && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="border-b border-orange-50 pb-3">
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Feature 10: Timeline Generator
              </span>
              <h3 className="text-xl font-black mt-2 text-[#2D2D2D]">My Life in Memories</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1 leading-relaxed">
                Add custom years and childhood events to map out your beautiful nostalgic chronological timeline.
              </p>
            </div>

            {/* Input timeline entry */}
            <form onSubmit={handleAddTimeline} className="bg-orange-50/40 p-4 rounded-3xl border border-[#FFEBD6] grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#FF6B35] uppercase tracking-wider">Year</label>
                <input
                  type="number"
                  placeholder="E.g., 2009"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#FFEBD6] text-xs font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#FF6B35] uppercase tracking-wider">Event Title</label>
                <input
                  type="text"
                  placeholder="E.g., First PC"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#FFEBD6] text-xs font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#FF6B35] uppercase tracking-wider">Memory detail</label>
                <input
                  type="text"
                  placeholder="E.g., Typing MSN chats..."
                  value={newBullet}
                  onChange={(e) => setNewBullet(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#FFEBD6] text-xs font-bold"
                />
              </div>
              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#FF6B35] text-white rounded-xl font-black text-xs uppercase tracking-wider"
                >
                  Add Milestone Entry (+20💰)
                </button>
              </div>
            </form>

            {/* Vertical timeline visualizer */}
            <div className="relative border-l-2 border-dashed border-[#FF6B35]/40 pl-6 space-y-6 ml-4 mt-2">
              {timelineItems.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline point indicator */}
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-[#FF6B35] group-hover:scale-125 transition-all"></div>

                  <span className="font-mono text-sm font-black text-[#FF6B35]">{item.year}</span>
                  <h4 className="text-xs font-black text-[#2D2D2D] mt-0.5">{item.title}</h4>
                  <ul className="list-disc list-inside text-[10px] text-gray-600 font-semibold space-y-0.5 mt-1">
                    <li>{item.bullet1}</li>
                    <li>{item.bullet2}</li>
                    <li>{item.bullet3}</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR: CHILDHOOD TWIN MATCH COMPONENT */}
      <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
        <div className="bg-white rounded-[2rem] p-5 border-2 border-[#FFEBD6] shadow-sm flex flex-col gap-3">
          <h3 className="text-xs font-black uppercase text-[#9CA3AF] tracking-[0.15em]">
            Feature 15: Twin finder
          </h3>
          <h4 className="text-xs font-black text-gray-700 leading-tight">Find Your Childhood Twin</h4>
          <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
            Match your preferences with other users in the global database based on childhood traits.
          </p>

          <div className="space-y-2 bg-[#FFF9F2] p-3 rounded-2xl border border-[#FFEBD6]">
            {[
              { category: "Favorite cartoon", value: "Dragon Ball Z" },
              { category: "Favorite snack", value: "Popsicle / Candy" },
              { category: "Childhood hobby", value: "Street games" },
            ].map((twin, idx) => (
              <div key={idx} className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-gray-500">{twin.category}</span>
                <span className="text-[#FF6B35] font-black">{twin.value}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-100 text-center">
            <p className="text-xs font-black text-[#00B4D8] leading-none mb-1">85% Compatibility Matched!</p>
            <p className="text-[9px] text-gray-500 font-bold">
              "You share identical cartoon and recess memories with 85% of other explorers!"
            </p>
          </div>
        </div>

        {/* TIME CAPSULE VAULT (Feature 30) */}
        <div className="bg-[#FFF9F2] rounded-[2rem] p-5 border-2 border-[#FFEBD6] flex flex-col gap-3">
          <h3 className="text-xs font-black uppercase text-[#FF6B35] tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Feature 30: Time Capsule
          </h3>
          <p className="text-[10px] text-gray-600 font-bold leading-relaxed">
            Seal a confidential digital capsule to be unlocked by your future self.
          </p>

          <textarea
            placeholder="E.g., I hope you are still curious and adventurous..."
            className="w-full h-16 p-2 bg-white rounded-xl border border-[#FFEBD6] text-[10px] font-bold resize-none focus:outline-none"
          />

          <button
            onClick={() => {
              synth.playGameSound("stamp");
              setUserCoins((c) => c + 15);
              addXp(15);
              alert("Message sealed inside future vault capsule!");
            }}
            className="w-full py-2 bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-white rounded-xl font-bold text-[10px] uppercase"
          >
            LOCK IN CAPSULE FOR 5 YEARS
          </button>
        </div>
      </div>
    </div>
  );
}
