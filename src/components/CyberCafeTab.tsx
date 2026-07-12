/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Radio, Music, Volume2, Wrench, Play, Monitor, Globe, Check, Save } from "lucide-react";
import { synth } from "../utils/synth";

interface CyberCafeTabProps {
  userCoins: number;
  setUserCoins: React.Dispatch<React.SetStateAction<number>>;
  addXp: (amount: number) => void;
}

export default function CyberCafeTab({
  userCoins,
  setUserCoins,
  addXp,
}: CyberCafeTabProps) {
  // Dialup simulator
  const [pcBooted, setPcBooted] = useState(false);
  const [dialupProgress, setDialupProgress] = useState(0);
  const [dialupActive, setDialupActive] = useState(false);
  const [msnScreenName, setMsnScreenName] = useState("~NostalgiaKid_99~");
  const [msnStatus, setMsnStatus] = useState("Listening to Linkin Park... (Busy)");

  // Room customizer
  const [roomWallpaper, setRoomWallpaper] = useState("cartoon");
  const [placedObjects, setPlacedObjects] = useState<string[]>([]);
  const [savedSceneCaption, setSavedSceneCaption] = useState("");
  const [savedScene, setSavedScene] = useState<{ bg: string; items: string[]; caption: string } | null>(null);

  // Sound mixer values (0 to 100)
  const [mixerVolume, setMixerVolume] = useState<{ [key: string]: number }>({
    rain: 0,
    static: 0,
    cricket: 0,
    keyboard: 0,
    school: 0,
  });

  // Radio state
  const [radioChannel, setRadioChannel] = useState<"school" | "summer" | "rainy" | "internet">("school");

  const radioChannels = {
    school: {
      title: "School Morning 🎒",
      freq: "98.5 MHz",
      story: "The distant clang of the school bell, the scratching of chalk on boards, and the bustling excitement of sharing lunch boxes under desks. We had so little to worry about, and our biggest fear was holiday homework.",
    },
    summer: {
      title: "Summer Vacation 🌴",
      freq: "102.1 MHz",
      story: "Warm, long, endless afternoons. Golden sunlight streaming through curtains, the whir of the old ceiling fan, ice candy drippings, and playing arcade games till sunset. Absolute bliss.",
    },
    rainy: {
      title: "Rainy Evening 🌧️",
      freq: "91.3 MHz",
      story: "The soothing pitter-patter of rain on the tin roof, creating tiny paper boats to sail down the flooded streets, and moms serving hot, crispy snacks as we watched the water level rise.",
    },
    internet: {
      title: "Late Night Internet 📶",
      freq: "107.9 MHz",
      story: "The glowing box monitor in the corner of the dark room, waiting 10 minutes for a single image to load, and the thrilling chatter of MSN messenger notifications typing in the silent house.",
    },
  };

  // Trigger Dial-up Handshake
  const triggerDialupConnect = () => {
    if (dialupActive) return;
    setDialupActive(true);
    setDialupProgress(0);
    synth.playDialup(
      (percent) => {
        setDialupProgress(percent);
      },
      () => {
        setDialupActive(false);
        setPcBooted(true);
        setUserCoins((c) => c + 15);
        addXp(20);
      }
    );
  };

  // Toggle mixer channels
  const handleMixerChange = (key: 'rain' | 'static' | 'cricket' | 'keyboard' | 'school', value: number) => {
    setMixerVolume((prev) => ({ ...prev, [key]: value }));
    const normalizedVol = value / 100;

    if (value > 0) {
      synth.startContinuousSound(key, key);
      synth.setVolume(key, normalizedVol);
    } else {
      synth.stopContinuousSound(key);
    }
  };

  // Disconnect loops on unmount
  useEffect(() => {
    return () => {
      synth.stopAll();
    };
  }, []);

  // Room customizer assets
  const availableWallpaper = [
    { id: "cartoon", name: "Anime Wall", color: "bg-blue-100" },
    { id: "gaming", name: "Arcade Retro", color: "bg-purple-100" },
    { id: "school", name: "Vintage Green", color: "bg-emerald-100" },
  ];

  const availableObjects = [
    { id: "tamagotchi", icon: "📟", name: "Tamagotchi" },
    { id: "poster", icon: "🖼️", name: "DBZ Poster" },
    { id: "nokia", icon: "📱", name: "Nokia 3310" },
    { id: "gameboy", icon: "🎮", name: "Gameboy Color" },
    { id: "walkman", icon: "🎧", name: "Cassette Player" },
  ];

  const handleToggleObjectInRoom = (id: string) => {
    synth.playGameSound("coin");
    if (placedObjects.includes(id)) {
      setPlacedObjects(placedObjects.filter((o) => o !== id));
    } else {
      if (placedObjects.length >= 4) return; // Limit objects
      setPlacedObjects([...placedObjects, id]);
    }
  };

  const handleSaveScene = () => {
    synth.playGameSound("match");
    setSavedScene({
      bg: roomWallpaper,
      items: placedObjects,
      caption: savedSceneCaption || "My cozy childhood corner.",
    });
    setSavedSceneCaption("");
    setUserCoins((c) => c + 10);
    addXp(15);
  };

  return (
    <div className="grid grid-cols-12 gap-6" id="cybercafe-tab-view">
      {/* LEFT COLUMN: OLD COMPUTER TERMINAL & DIAL-UP */}
      <div className="col-span-12 md:col-span-6 flex flex-col gap-6">
        <div className="bg-[#D3D3D3] p-4 rounded-[2rem] border-4 border-[#808080] shadow-2xl flex flex-col gap-4 relative">
          <div className="flex justify-between items-center border-b-2 border-white pb-2">
            <h3 className="text-xs font-black uppercase text-[#2D2D2D] font-mono tracking-widest flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-amber-600" />
              CYBER CAFÉ SIMULATOR // OS-95
            </h3>
            <span className="w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow animate-pulse"></span>
          </div>

          {!pcBooted ? (
            <div className="h-72 bg-black rounded-2xl flex flex-col items-center justify-center p-6 text-center text-green-400 font-mono text-xs">
              {dialupActive ? (
                <div className="space-y-4 w-full max-w-xs">
                  <p className="animate-pulse">DIALING UP 0821-239401...</p>
                  <div className="w-full h-4 bg-[#333] rounded-full overflow-hidden border-2 border-white">
                    <div
                      className="h-full bg-green-400 transition-all duration-300"
                      style={{ width: `${dialupProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-gray-400">CONNECTING HANDSHAKE... LISTEN TO MODEM BEEPS!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm font-black">SYSTEM OFFLINE</p>
                  <p className="text-[10px] text-gray-400">Dial-up configuration required to boot internet browser.</p>
                  <button
                    onClick={triggerDialupConnect}
                    className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-black font-black uppercase rounded-lg transition-all"
                  >
                    BOOT SYSTEM & CONNECT MODEM (+15💰)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#008080] p-3 rounded-2xl h-80 relative overflow-hidden font-sans border-2 border-white shadow-inner flex flex-col">
              {/* Windows 95 style Browser Bar */}
              <div className="bg-[#D3D3D3] p-1.5 border-b-2 border-white flex justify-between items-center text-xs text-black font-bold">
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-blue-700" />
                  <span className="truncate max-w-[200px]">msn.messenger/home</span>
                </div>
                <div className="flex gap-1">
                  <button className="px-1 bg-white border border-black text-[8px]">_</button>
                  <button className="px-1 bg-white border border-black text-[8px]" onClick={() => setPcBooted(false)}>✕</button>
                </div>
              </div>

              {/* Chat Messenger Inner container */}
              <div className="flex-1 bg-white border-2 border-[#808080] m-1 p-3 flex flex-col gap-3 overflow-y-auto">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-400 flex items-center justify-center text-lg">
                    👨‍💻
                  </div>
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={msnScreenName}
                      onChange={(e) => setMsnScreenName(e.target.value)}
                      className="text-xs font-black text-blue-700 bg-transparent focus:outline-none border-b border-dashed border-gray-300 w-full"
                    />
                    <input
                      type="text"
                      value={msnStatus}
                      onChange={(e) => setMsnStatus(e.target.value)}
                      className="text-[9px] text-gray-500 font-bold bg-transparent focus:outline-none border-b border-dashed border-gray-200 w-full"
                    />
                  </div>
                </div>

                {/* MSN Style online contacts list */}
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Online Buddies (3)</p>
                  {[
                    { name: "Sunny_Friend_99", status: "Looking back at paper boats... ⛵", icon: "🧑‍🎨" },
                    { name: "SlamBookQueen", status: "Filling my slam book! (Busy)", icon: "👧" },
                    { name: "RetroGamer_X", status: "Playing Snake in classroom...", icon: "👾" },
                  ].map((buddy, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg">
                      <span className="text-base">{buddy.icon}</span>
                      <div>
                        <p className="text-[10px] font-black text-gray-700">{buddy.name}</p>
                        <p className="text-[8px] text-gray-400 font-bold leading-none">{buddy.status}</p>
                      </div>
                      <span className="ml-auto w-2 h-2 rounded-full bg-green-500 border border-white"></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Windows Taskbar bottom */}
              <div className="mt-auto bg-[#D3D3D3] p-1 border-t-2 border-white flex justify-between items-center text-[10px] font-bold">
                <button className="px-2 py-0.5 bg-white border border-black shadow flex items-center gap-1 font-black">
                  <span>💾</span> Start
                </button>
                <span className="font-mono bg-white/20 px-2 py-0.5 rounded border border-[#808080]">07:12 PM</span>
              </div>
            </div>
          )}
        </div>

        {/* CUSTOMIZE YOUR MEMORY ROOM (Feature 23, 39) */}
        <div className="bg-white rounded-[2.5rem] border-2 border-[#FFEBD6] p-6 shadow-sm flex flex-col gap-4">
          <div className="border-b border-orange-50 pb-3">
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Feature 23 & 39
            </span>
            <h3 className="text-xl font-black mt-2 text-[#2D2D2D]">Customize Your Memory Room</h3>
            <p className="text-xs text-gray-500 font-semibold mt-1 leading-none">
              Place retro gadgets, posters, and toys in your custom dream bedroom!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Visualizer Frame */}
            <div className={`p-4 rounded-3xl border-2 border-[#FFEBD6] h-48 flex flex-col relative overflow-hidden shadow-inner ${
              availableWallpaper.find((w) => w.id === roomWallpaper)?.color || "bg-orange-50"
            }`}>
              <span className="absolute top-2 left-2 text-[8px] font-black font-mono bg-black/10 text-gray-600 px-1.5 py-0.5 rounded">
                PREVIEW WALL
              </span>

              {/* Display placed items */}
              <div className="grid grid-cols-4 gap-3 m-auto w-full max-w-[200px]">
                {placedObjects.map((objId) => {
                  const asset = availableObjects.find((o) => o.id === objId);
                  return (
                    <div
                      key={objId}
                      className="aspect-square bg-white rounded-2xl flex items-center justify-center text-2xl shadow border border-[#FFEBD6] animate-bounce-slow"
                    >
                      {asset?.icon}
                    </div>
                  );
                })}
                {placedObjects.length === 0 && (
                  <p className="col-span-4 text-center text-[10px] font-black text-gray-400 uppercase py-6 leading-relaxed">
                    Select artifacts to decorate your room!
                  </p>
                )}
              </div>
            </div>

            {/* Selector Columns */}
            <div className="flex flex-col gap-3 justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">Wallpaper Theme</p>
                <div className="flex gap-2">
                  {availableWallpaper.map((wall) => (
                    <button
                      key={wall.id}
                      onClick={() => {
                        synth.playGameSound("coin");
                        setRoomWallpaper(wall.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border-2 ${
                        roomWallpaper === wall.id
                          ? "bg-white border-[#FF6B35] text-[#FF6B35]"
                          : "bg-[#FFF9F2] border-gray-200 text-gray-500"
                      }`}
                    >
                      {wall.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">Add Relic Toys (Max 4)</p>
                <div className="flex flex-wrap gap-1.5">
                  {availableObjects.map((obj) => {
                    const isSelected = placedObjects.includes(obj.id);
                    return (
                      <button
                        key={obj.id}
                        onClick={() => handleToggleObjectInRoom(obj.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold border-2 flex items-center gap-1 ${
                          isSelected
                            ? "bg-[#FF6B35] text-white border-[#FF6B35]"
                            : "bg-[#FFF9F2] border-gray-200 text-gray-600 hover:border-orange-200"
                        }`}
                      >
                        <span>{obj.icon}</span>
                        <span>{obj.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-orange-50 pt-3 flex gap-3">
            <input
              type="text"
              placeholder="Caption your dream room corner..."
              value={savedSceneCaption}
              onChange={(e) => setSavedSceneCaption(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-[#FFF9F2] border-2 border-[#FFEBD6] rounded-2xl focus:outline-none focus:border-[#FF6B35] font-semibold"
            />
            <button
              onClick={handleSaveScene}
              className="px-5 py-2 bg-[#FF6B35] text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Room
            </button>
          </div>

          {savedScene && (
            <div className="p-4 bg-[#FEE4CC]/40 rounded-3xl border border-[#FF6B35]/20 flex flex-col gap-2 relative">
              <span className="absolute top-3 right-3 text-[8px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full uppercase">
                SAVED NOSTALGIA CARD
              </span>
              <h4 className="text-xs font-black text-[#2D2D2D] uppercase tracking-wider mb-1">
                🏡 "My Retro Sanctuary"
              </h4>
              <p className="text-[10px] text-gray-600 font-semibold leading-relaxed">
                Wallpaper: {savedScene.bg.toUpperCase()} theme, with toys placed:{" "}
                {savedScene.items.map((i) => availableObjects.find((o) => o.id === i)?.name).join(", ")}.
              </p>
              <p className="text-[10px] italic font-bold text-[#FF6B35] leading-none mt-1">
                "{savedScene.caption}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: SOUNDBOARD & NOSTALGIA RADIO CABINET */}
      <div className="col-span-12 md:col-span-6 flex flex-col gap-6">
        {/* MIXER BOARD */}
        <div className="bg-[#2D2D2D] text-white rounded-[2.5rem] p-6 border-4 border-[#333] shadow-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-gray-700 pb-3">
            <div>
              <span className="bg-[#FF6B35]/20 text-[#FF6B35] px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                AMBIENT SYNTHESIZER
              </span>
              <h3 className="text-lg font-black mt-2 flex items-center gap-2">
                <Music className="w-5 h-5 text-[#FF6B35] animate-spin-slow" />
                Feature 52: Sound Mixer
              </h3>
            </div>
            <Volume2 className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {[
              { id: "rain", label: "Monsoon Rain 🌧️", desc: "Soothing water droplets on windows" },
              { id: "static", label: "Analog TV Static 📺", desc: "Cozy old CRT screen frequencies" },
              { id: "cricket", label: "Crickets at Sunset 🌌", desc: "Summer night yard ambiance" },
              { id: "keyboard", label: "Clacking Keyboard ⌨️", desc: "Retro cyber cafe keystrokes" },
              { id: "school", label: "Recess School Bell 🔔", desc: "The distant clang of freedom" },
            ].map((sound) => (
              <div key={sound.id} className="flex flex-col gap-1 bg-[#1A1A1A] p-3 rounded-2xl border border-gray-800">
                <div className="flex justify-between text-xs font-bold">
                  <div>
                    <span className="text-white font-black leading-none block mb-0.5">{sound.label}</span>
                    <span className="text-[8px] text-gray-500 font-semibold leading-none">{sound.desc}</span>
                  </div>
                  <span className="text-yellow-400 font-mono text-[10px] font-black">
                    {mixerVolume[sound.id]}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={mixerVolume[sound.id]}
                  onChange={(e) => handleMixerChange(sound.id as any, Number(e.target.value))}
                  className="w-full accent-[#FF6B35] h-1 bg-gray-700 rounded-full cursor-pointer mt-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* RADIO CABINET (Feature 44) */}
        <div className="bg-[#5C4033] text-orange-50 rounded-[2.5rem] p-6 border-4 border-[#3D2B1F] shadow-2xl flex flex-col gap-4 relative overflow-hidden">
          {/* Wooden speaker grating decoration */}
          <div className="absolute right-0 bottom-0 top-0 w-1/4 opacity-10 bg-stripes pointer-events-none"></div>

          <div className="flex justify-between items-center border-b border-[#3D2B1F] pb-3">
            <h3 className="text-md font-black uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-5 h-5 text-yellow-400 animate-pulse" />
              Feature 44: Nostalgia Radio
            </h3>
            <span className="font-mono text-xs bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded border border-yellow-400/30 font-black">
              TUNING dial
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 border-b border-[#3D2B1F] pb-4">
            {(Object.keys(radioChannels) as Array<keyof typeof radioChannels>).map((ch) => {
              const isSelected = radioChannel === ch;
              return (
                <button
                  key={ch}
                  onClick={() => {
                    synth.playGameSound("coin");
                    setRadioChannel(ch);
                  }}
                  className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                    isSelected
                      ? "bg-yellow-400 border-white text-[#5C4033] shadow font-black"
                      : "bg-[#3D2B1F] border-transparent text-gray-300 hover:border-[#FF6B35]"
                  }`}
                >
                  <p className="text-[10px] leading-tight truncate font-bold">
                    {radioChannels[ch].title.split(" ")[0]}
                  </p>
                  <p className="text-[8px] font-mono leading-none mt-1 opacity-65">
                    {radioChannels[ch].freq.split(" ")[0]}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-[#3D2B1F]/40 rounded-3xl border border-[#3D2B1F] flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] font-bold text-yellow-400">
              <span className="uppercase tracking-widest">{radioChannels[radioChannel].title}</span>
              <span className="font-mono">{radioChannels[radioChannel].freq}</span>
            </div>
            <p className="text-xs text-orange-100 font-semibold leading-relaxed">
              "{radioChannels[radioChannel].story}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
