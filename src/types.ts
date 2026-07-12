/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Landmark {
  id: string;
  name: string;
  image: string;
  description: string;
  historicalImportance: string;
  bestTimeToVisit: string;
  funFacts: string[];
  category: "landmark" | "nature" | "museum" | "culture" | "secret";
  coordinates: { lat: number; lng: number };
}

export interface GalleryImage {
  url: string;
  caption: string;
  category: "hero" | "landmarks" | "nature" | "wildlife" | "food" | "festivals" | "culture" | "architecture" | "hidden";
}

export interface Country {
  id: string;
  name: string;
  code: string; // ISO code
  flag: string; // Emoji
  tagline: string;
  intro: string; // Curated storytelling intro creating curiosity
  history: string;
  geography: string;
  culture: string;
  traditions: string;
  localCustoms: string;
  officialLanguage: string;
  currency: string;
  population: string;
  government: string;
  climate: string;
  wildlife: string;
  nationalParks: string;
  economy: string;
  architecture: string;
  festivals: string;
  music: string;
  famousPersonalities: string[];
  interestingFacts: string[];
  landmarks: Landmark[];
  galleries: GalleryImage[];
  regionalMemories: {
    city: string;
    description: string;
    icon: string;
    memories: string[];
  }[];
}

// Nostalgia / REWIND types

export interface MemoryTimelineItem {
  year: number;
  title: string;
  bullet1: string;
  bullet2: string;
  bullet3: string;
  theme: string;
}

export interface RetroInventoryItem {
  id: string;
  name: string;
  description: string;
  category: "common" | "rare" | "legendary";
  icon: string;
  rarityColor: string;
  unlockedAt?: string;
  funFact: string;
}

export interface NostalgicSound {
  id: string;
  name: string;
  description: string;
  icon: string;
  audioUrl?: string; // standard simulated web audio oscillators or base synth sounds
  volume: number;
  playing: boolean;
  type: "ambient" | "gadget" | "school" | "nature";
}

export interface NostalgiaStoryResponse {
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  fact: string;
  points: number;
}

export interface MemoryPuzzle {
  id: string;
  title: string;
  image: string; // descriptive illustration or SVG representation
  difficulty: "easy" | "medium" | "hard";
  description: string;
  storyUnlocked: string;
}

export interface StreamingItem {
  id: string;
  title: string;
  category: "After School" | "Sunday Morning" | "Summer Vacation" | "Rainy Day" | "Exam Night";
  duration: string;
  desc: string;
  trivia: string;
  pollQuestion: string;
  pollOptions: string[];
  pollResults: number[]; // votes
}

export interface CustomRoomObject {
  id: string;
  name: string;
  category: "wallpaper" | "poster" | "toy" | "gadget" | "furniture";
  style: string; // css class or styles
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}
