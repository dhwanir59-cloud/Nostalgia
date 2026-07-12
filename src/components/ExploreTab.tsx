/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MapPin, Globe, Compass, BookOpen, Star, Sparkles, ChevronRight, Check } from "lucide-react";
import { Country, Landmark } from "../types";
import { countriesData } from "../data/countries";
import OptimizedImage from "./OptimizedImage";
import { synth } from "../utils/synth";

interface ExploreTabProps {
  userCoins: number;
  setUserCoins: React.Dispatch<React.SetStateAction<number>>;
  stamps: string[];
  addStamp: (stampId: string) => void;
  starredLandmarks: string[];
  toggleStar: (id: string) => void;
}

export default function ExploreTab({
  userCoins,
  setUserCoins,
  stamps,
  addStamp,
  starredLandmarks,
  toggleStar,
}: ExploreTabProps) {
  const [selectedCountryId, setSelectedCountryId] = useState("india");
  const [activeSubTab, setActiveSubTab] = useState<"stories" | "details" | "landmarks" | "galleries" | "regional">("stories");
  const [activeLandmark, setActiveLandmark] = useState<Landmark | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeInfoSection, setActiveInfoSection] = useState<string>("history");
  const [galleryFilter, setGalleryFilter] = useState<string>("all");
  const [newMemoryTexts, setNewMemoryTexts] = useState<{ [city: string]: string }>({});

  // Dynamic state for custom regional memories
  const [customMemories, setCustomMemories] = useState<{ [city: string]: string[] }>({
    Mumbai: [],
    Delhi: [],
    Kolkata: [],
    Bangalore: [],
  });

  const country = countriesData.find((c) => c.id === selectedCountryId) || countriesData[0];

  const handleCountryChange = (id: string) => {
    synth.playGameSound("coin");
    setSelectedCountryId(id);
    setActiveSubTab("stories");
    setActiveLandmark(null);
    setGalleryFilter("all");
  };

  const handleStampPassport = () => {
    if (!stamps.includes(country.id)) {
      addStamp(country.id);
      setUserCoins((c) => c + 30);
      synth.playGameSound("stamp");
    }
  };

  const handleAddMemory = (city: string) => {
    const text = newMemoryTexts[city]?.trim();
    if (!text) return;
    setCustomMemories((prev) => ({
      ...prev,
      [city]: [...(prev[city] || []), text],
    }));
    setNewMemoryTexts((prev) => ({ ...prev, [city]: "" }));
    setUserCoins((c) => c + 10);
    synth.playGameSound("coin");
  };

  // Filter galleries
  const filteredGalleries = galleryFilter === "all"
    ? country.galleries
    : country.galleries.filter((g) => g.category === galleryFilter);

  // Simulated SVG vector maps based on country ID
  const renderSimulatedMap = () => {
    const landmarks = country.landmarks;
    return (
      <div className="relative w-full h-64 bg-sky-100 rounded-3xl border-2 border-[#FFEBD6] overflow-hidden flex items-center justify-center">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-grid opacity-15"></div>

        {/* Decorative Compass Rose */}
        <div className="absolute bottom-4 right-4 text-[#FF6B35]/40 text-center font-mono text-[9px] font-black">
          <Compass className="w-10 h-10 animate-spin-slow text-[#FF6B35]/60 mb-1 mx-auto" />
          N O S T A L G I A
        </div>

        {/* Animated clouds */}
        <div className="absolute top-8 left-1/4 text-2xl opacity-20 animate-bounce">☁️</div>
        <div className="absolute top-16 right-1/4 text-xl opacity-30 animate-pulse">☁️</div>

        {/* Dynamic Country SVG Path outlines (stylized representations) */}
        <svg viewBox="0 0 400 300" className="w-full h-full max-w-sm text-amber-200/60 drop-shadow-lg">
          {selectedCountryId === "india" && (
            <path
              d="M 200,40 L 230,100 L 250,140 L 280,180 L 250,220 L 200,280 L 170,220 L 140,180 L 150,130 L 170,80 Z"
              fill="currentColor"
              stroke="#FF6B35"
              strokeWidth="2"
            />
          )}
          {selectedCountryId === "japan" && (
            <path
              d="M 100,240 Q 140,180 180,160 T 260,110 T 320,50 L 325,55 Q 265,115 185,165 T 105,245 Z"
              fill="currentColor"
              stroke="#00B4D8"
              strokeWidth="2"
            />
          )}
          {selectedCountryId === "usa" && (
            <path
              d="M 60,80 L 340,80 L 330,220 L 150,220 L 120,240 L 60,180 Z"
              fill="currentColor"
              stroke="#FF6B35"
              strokeWidth="2"
            />
          )}
        </svg>

        {/* Render Landmark Map Pins */}
        {landmarks.map((landmark, idx) => {
          // Normalize coordinates mock positions
          const x = selectedCountryId === "india" ? (idx === 0 ? 190 : 220) : selectedCountryId === "japan" ? (idx === 0 ? 250 : 210) : (idx === 0 ? 280 : 120);
          const y = selectedCountryId === "india" ? (idx === 0 ? 110 : 210) : selectedCountryId === "japan" ? (idx === 0 ? 120 : 150) : (idx === 0 ? 100 : 160);

          const isActive = activeLandmark?.id === landmark.id;

          return (
            <button
              key={landmark.id}
              onClick={() => {
                synth.playGameSound("coin");
                setActiveLandmark(landmark);
              }}
              style={{ left: `${x}px`, top: `${y}px` }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center z-10 transition-all ${
                isActive ? "scale-125" : "hover:scale-110"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 ${
                  isActive ? "bg-[#FF6B35] border-white text-white" : "bg-white border-[#FF6B35] text-[#FF6B35]"
                }`}
              >
                <MapPin className="w-4 h-4 animate-bounce" />
              </div>
              <span className="mt-1 px-2 py-0.5 bg-white/95 rounded text-[8px] font-bold border border-[#FFEBD6] whitespace-nowrap shadow-sm text-[#2D2D2D]">
                {landmark.name}
              </span>
            </button>
          );
        })}

        {/* Click Prompt */}
        <div className="absolute top-4 left-4 bg-white/80 px-3 py-1 rounded-full border border-[#FFEBD6] text-[9px] font-bold flex items-center gap-1">
          <Globe className="w-3 h-3 text-[#FF6B35] animate-spin-slow" />
          Interactive Vector Map
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6" id="explore-tab-view">
      {/* Country Selection Row */}
      <div className="grid grid-cols-3 gap-4">
        {countriesData.map((c) => {
          const isSelected = selectedCountryId === c.id;
          const hasStamp = stamps.includes(c.id);

          return (
            <button
              key={c.id}
              id={`country-btn-${c.id}`}
              onClick={() => handleCountryChange(c.id)}
              className={`p-4 rounded-[2rem] border-2 text-left relative transition-all overflow-hidden ${
                isSelected
                  ? "bg-white border-[#FF6B35] shadow-lg shadow-orange-100 scale-[1.02]"
                  : "bg-white/60 border-[#FFEBD6] hover:border-orange-200"
              }`}
            >
              {/* Decorative Passport Stamp Mark */}
              {hasStamp && (
                <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full border-4 border-dashed border-[#00B4D8]/30 flex items-center justify-center rotate-12 pointer-events-none select-none">
                  <span className="text-[9px] font-black font-mono text-[#00B4D8]">STAMPED</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <span className="text-4xl">{c.flag}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black tracking-tight text-[#2D2D2D] leading-none mb-1">
                    {c.name}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-semibold truncate leading-none">
                    {c.tagline}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Exploration Panel */}
      <div className="bg-white rounded-[2.5rem] border-2 border-[#FFEBD6] shadow-xl p-8 flex flex-col gap-6">
        {/* Storytelling Intro Section */}
        <div className="border-b border-orange-100 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                IMMERSIVE EXPLORATION
              </span>
              <h2 className="text-3xl font-black mt-2 text-[#2D2D2D]">
                Welcome to {country.name} {country.flag}
              </h2>
            </div>

            {/* Passport Stamp Button */}
            <button
              onClick={handleStampPassport}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
                stamps.includes(country.id)
                  ? "bg-[#00B4D8]/10 text-[#00B4D8] border-2 border-[#00B4D8]"
                  : "bg-[#00B4D8] text-white hover:bg-[#00B4D8]/90 shadow-md hover:shadow-cyan-200"
              }`}
            >
              <Compass className="w-4 h-4 animate-spin-slow" />
              {stamps.includes(country.id) ? "PASSPORT STAMPED!" : "STAMP DIGITAL PASSPORT (+30💰)"}
            </button>
          </div>

          <p className="text-sm italic font-medium leading-relaxed text-gray-600 mt-4 border-l-4 border-[#FF6B35] pl-4">
            "{country.intro}"
          </p>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex gap-2 p-1.5 bg-[#FFF9F2] rounded-2xl border border-[#FFEBD6] self-start">
          {(["stories", "details", "landmarks", "galleries", "regional"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                synth.playGameSound("coin");
                setActiveSubTab(tab);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeSubTab === tab
                  ? "bg-[#FF6B35] text-white shadow-md shadow-orange-100"
                  : "text-gray-500 hover:text-[#FF6B35]"
              }`}
            >
              {tab === "regional" ? "Regional Memories 🗺️" : tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="min-h-[300px]">
          {/* STORIES / FAST FACTS TAB */}
          {activeSubTab === "stories" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div className="flex flex-col gap-4">
                <h3 className="text-md font-black text-[#FF6B35] uppercase tracking-wider">
                  ⚡ Nostalgia Quick Facts
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Official Language", value: country.officialLanguage },
                    { label: "Currency", value: country.currency },
                    { label: "Population", value: country.population },
                    { label: "Government", value: country.government },
                    { label: "Climate Profile", value: country.climate },
                    { label: "Key Wildlife", value: country.wildlife },
                  ].map((fact, idx) => (
                    <div key={idx} className="p-3 bg-[#FFF9F2] rounded-2xl border border-[#FFEBD6]">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        {fact.label}
                      </p>
                      <p className="text-xs font-bold text-[#2D2D2D] leading-tight">{fact.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-md font-black text-[#00B4D8] uppercase tracking-wider">
                  💡 Curious Real-world Trivia
                </h3>
                <div className="space-y-2">
                  {country.interestingFacts.map((fact, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-cyan-50/50 rounded-2xl border border-[#00B4D8]/10 flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#00B4D8] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed font-medium">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* COMPREHENSIVE INFO SECTION TAB */}
          {activeSubTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
              {/* Accordion Sidebar */}
              <div className="flex flex-col gap-1.5 border-r border-orange-100 pr-4">
                {[
                  { id: "history", label: "History", icon: "🏛️" },
                  { id: "geography", label: "Geography", icon: "🏔️" },
                  { id: "culture", label: "Culture", icon: "🎨" },
                  { id: "traditions", label: "Traditions & Custom", icon: "🌸" },
                  { id: "wildlife", label: "Wildlife & Parks", icon: "🐯" },
                  { id: "architecture", label: "Architecture", icon: "🕌" },
                  { id: "festivals", label: "Festivals & Music", icon: "🥁" },
                ].map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      synth.playGameSound("coin");
                      setActiveInfoSection(sec.id);
                    }}
                    className={`p-3 rounded-xl text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                      activeInfoSection === sec.id
                        ? "bg-[#FFF9F2] text-[#FF6B35] border border-[#FF6B35]/30 shadow-sm"
                        : "text-gray-500 hover:bg-[#FFF9F2]"
                    }`}
                  >
                    <span>{sec.icon}</span>
                    <span className="flex-1 truncate">{sec.label}</span>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  </button>
                ))}
              </div>

              {/* Accordion content */}
              <div className="md:col-span-3 p-4 bg-[#FFF9F2]/40 rounded-3xl border border-[#FFEBD6] flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-orange-100 pb-3">
                  <span className="text-2xl">⚡</span>
                  <h4 className="text-md font-black uppercase text-[#2D2D2D] tracking-wider">
                    {activeInfoSection.toUpperCase()} PROFILE
                  </h4>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {activeInfoSection === "history" && country.history}
                  {activeInfoSection === "geography" && country.geography}
                  {activeInfoSection === "culture" && country.culture}
                  {activeInfoSection === "traditions" && `${country.traditions} ${country.localCustoms}`}
                  {activeInfoSection === "wildlife" && `${country.wildlife} National Parks highlighted: ${country.nationalParks}`}
                  {activeInfoSection === "architecture" && country.architecture}
                  {activeInfoSection === "festivals" && `${country.festivals} Music vibe: ${country.music}`}
                </p>

                {activeInfoSection === "history" && (
                  <div className="p-3 bg-white rounded-xl border border-[#FFEBD6] mt-2">
                    <p className="text-[10px] font-black text-[#FF6B35] uppercase tracking-wider mb-1">
                      Famous Historical Figures
                    </p>
                    <ul className="grid grid-cols-2 gap-1 list-disc list-inside text-[11px] text-gray-600 font-bold">
                      {country.famousPersonalities.map((pers, idx) => (
                        <li key={idx}>{pers}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LANDMARKS & INTERACTIVE MAP */}
          {activeSubTab === "landmarks" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div className="flex flex-col gap-4">
                {renderSimulatedMap()}

                {/* Selected Landmark Details */}
                {activeLandmark && (
                  <div className="p-4 bg-[#FFF9F2] rounded-3xl border border-[#FFEBD6] flex flex-col gap-2 relative">
                    <button
                      onClick={() => toggleStar(activeLandmark.id)}
                      className="absolute top-4 right-4 p-2 bg-white rounded-xl border border-[#FFEBD6] hover:bg-orange-50 transition-all text-yellow-500"
                    >
                      <Star className="w-4 h-4" fill={starredLandmarks.includes(activeLandmark.id) ? "currentColor" : "none"} />
                    </button>

                    <h4 className="text-md font-black text-[#FF6B35] leading-tight pr-8">
                      {activeLandmark.name}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                      {activeLandmark.description}
                    </p>
                    <div className="mt-1 space-y-1 bg-white p-2.5 rounded-xl border border-orange-100 text-[10px]">
                      <p className="text-gray-700 leading-tight">
                        <strong className="text-gray-900 font-black">History:</strong> {activeLandmark.historicalImportance}
                      </p>
                      <p className="text-gray-700 leading-tight mt-1">
                        <strong className="text-gray-900 font-black">Best Visit:</strong> {activeLandmark.bestTimeToVisit}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Landmark Selection Cards */}
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[350px]">
                <h3 className="text-xs font-black text-[#9CA3AF] uppercase tracking-[0.15em] mb-1">
                  Famous Spots in {country.name}
                </h3>
                {country.landmarks.map((spot) => {
                  const isActive = activeLandmark?.id === spot.id;
                  const isStarred = starredLandmarks.includes(spot.id);

                  return (
                    <div
                      key={spot.id}
                      onClick={() => {
                        synth.playGameSound("coin");
                        setActiveLandmark(spot);
                      }}
                      className={`p-3 rounded-2xl border-2 flex gap-4 cursor-pointer transition-all ${
                        isActive
                          ? "bg-white border-[#FF6B35] shadow-md shadow-orange-50 scale-[1.01]"
                          : "bg-white/50 border-[#FFEBD6] hover:border-orange-200"
                      }`}
                    >
                      <OptimizedImage
                        src={spot.image}
                        alt={spot.name}
                        className="w-20 h-20 rounded-xl shrink-0 object-cover"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="text-xs font-black text-[#2D2D2D] leading-tight truncate">
                              {spot.name}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                synth.playGameSound("coin");
                                toggleStar(spot.id);
                              }}
                              className="text-yellow-500 hover:scale-110 transition-all"
                            >
                              <Star className="w-3.5 h-3.5" fill={isStarred ? "currentColor" : "none"} />
                            </button>
                          </div>
                          <p className="text-[10px] text-gray-500 font-semibold line-clamp-2 leading-relaxed mt-1">
                            {spot.description}
                          </p>
                        </div>
                        <div className="flex justify-between items-center text-[8px] font-bold text-[#FF6B35] mt-1 uppercase tracking-wider">
                          <span>{spot.category}</span>
                          <span>BEST: {spot.bestTimeToVisit}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* RICH PHOTO GALLERIES (Feature 6) */}
          {activeSubTab === "galleries" && (
            <div className="space-y-4 animate-fade-in">
              {/* Category Filter Buttons */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-gray-50 rounded-xl border border-gray-100">
                {["all", "hero", "landmarks", "nature", "wildlife", "food", "festivals", "culture", "architecture", "hidden"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      synth.playGameSound("coin");
                      setGalleryFilter(cat);
                    }}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      galleryFilter === cat ? "bg-[#00B4D8] text-white" : "text-gray-500 hover:text-[#00B4D8]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Masonry-Style Gallery */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {filteredGalleries.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className="group cursor-pointer relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#FFEBD6] shadow-sm transform hover:scale-[1.02] transition-all"
                  >
                    <OptimizedImage
                      src={img.url}
                      alt={img.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-2.5">
                      <p className="text-[10px] text-white font-bold leading-tight line-clamp-2">
                        {img.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {filteredGalleries.length === 0 && (
                <p className="text-center text-xs font-semibold text-gray-400 py-8">
                  No images matching this category yet. Unlock more by exploring further!
                </p>
              )}
            </div>
          )}

          {/* REGIONAL MEMORIES TAB (Feature 48) */}
          {activeSubTab === "regional" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
              {country.regionalMemories && country.regionalMemories.length > 0 ? (
                country.regionalMemories.map((region, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-3xl border border-[#FFEBD6] flex flex-col gap-3 shadow-sm relative overflow-hidden"
                  >
                    <div className="flex justify-between items-center border-b border-orange-50 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-2xl">{region.icon}</span>
                        <h4 className="text-xs font-black text-[#2D2D2D] tracking-tight">{region.city}</h4>
                      </div>
                      <span className="text-[8px] bg-orange-100 text-[#FF6B35] font-black px-1.5 py-0.5 rounded">REGIONAL</span>
                    </div>

                    <p className="text-[10px] text-gray-400 font-bold leading-none italic mb-1">{region.description}</p>

                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                      {region.memories.map((mem, midx) => (
                        <p key={midx} className="text-[10px] text-gray-700 leading-relaxed pl-3 border-l-2 border-[#00B4D8] font-medium">
                          {mem}
                        </p>
                      ))}

                      {/* Custom Added Memories */}
                      {(customMemories[region.city] || []).map((mem, midx) => (
                        <p key={`custom-${midx}`} className="text-[10px] text-orange-700 bg-orange-50/50 p-1.5 leading-relaxed pl-3 border-l-2 border-[#FF6B35] font-semibold rounded-r-lg">
                          {mem}
                        </p>
                      ))}
                    </div>

                    {/* Add Custom Local Memory Form */}
                    <div className="mt-auto pt-3 border-t border-gray-100">
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder={`Add city memory...`}
                          value={newMemoryTexts[region.city] || ""}
                          onChange={(e) => setNewMemoryTexts({ ...newMemoryTexts, [region.city]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddMemory(region.city);
                          }}
                          className="flex-1 px-2 py-1.5 text-[9px] font-bold bg-[#FFF9F2] rounded-xl border border-[#FFEBD6] focus:outline-none focus:border-[#FF6B35]"
                        />
                        <button
                          onClick={() => handleAddMemory(region.city)}
                          className="px-2 py-1 text-[9px] bg-[#FF6B35] text-white rounded-xl font-bold uppercase tracking-tight"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-4 text-center text-xs font-semibold text-gray-400 py-8">
                  Select another country to view local city memories!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal for Gallery */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full text-md font-bold transition-all"
          >
            ✕ Close
          </button>

          <div className="max-w-4xl w-full flex flex-col gap-4 items-center">
            <div className="relative max-h-[70vh] w-full flex items-center justify-center">
              <img
                src={filteredGalleries[lightboxIndex].url}
                alt={filteredGalleries[lightboxIndex].caption}
                className="max-h-[70vh] max-w-full object-contain rounded-2xl shadow-2xl"
              />
            </div>

            <div className="text-center max-w-xl text-white">
              <span className="text-[9px] font-bold text-[#00B4D8] uppercase tracking-widest block mb-1">
                {filteredGalleries[lightboxIndex].category}
              </span>
              <p className="text-xs font-semibold leading-relaxed">
                {filteredGalleries[lightboxIndex].caption}
              </p>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-4 mt-2">
              <button
                disabled={lightboxIndex === 0}
                onClick={() => setLightboxIndex((prev) => (prev !== null ? prev - 1 : null))}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold disabled:opacity-30"
              >
                ◀ Previous
              </button>
              <button
                disabled={lightboxIndex === filteredGalleries.length - 1}
                onClick={() => setLightboxIndex((prev) => (prev !== null ? prev + 1 : null))}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold disabled:opacity-30"
              >
                Next ▶
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
