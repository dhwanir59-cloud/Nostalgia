/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Gamepad2, Sparkles, HelpCircle, Trophy, RefreshCw, Key } from "lucide-react";
import { synth } from "../utils/synth";
import { RetroInventoryItem } from "../types";

interface ArcadeTabProps {
  userCoins: number;
  setUserCoins: React.Dispatch<React.SetStateAction<number>>;
  inventory: RetroInventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<RetroInventoryItem[]>>;
  addXp: (amount: number) => void;
}

export default function ArcadeTab({
  userCoins,
  setUserCoins,
  inventory,
  setInventory,
  addXp,
}: ArcadeTabProps) {
  const [activeGame, setActiveGame] = useState<"snake" | "plane" | "cards">("snake");

  // ----------------------------------------------------
  // RETRO SNAKE GAME STATE & IMPLEMENTATION
  // ----------------------------------------------------
  const snakeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeHighScore, setSnakeHighScore] = useState(() => {
    return Number(localStorage.getItem("rewind_snake_highscore") || "0");
  });
  const [snakePlaying, setSnakePlaying] = useState(false);
  const [snakeGameOver, setSnakeGameOver] = useState(false);

  const snakeStateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    direction: { x: 1, y: 0 },
    food: { x: 5, y: 5 },
    gridSize: 20,
    speed: 110,
    intervalId: null as any,
  });

  const generateFood = () => {
    const cols = 20;
    const rows = 15;
    const rx = Math.floor(Math.random() * cols);
    const ry = Math.floor(Math.random() * rows);
    snakeStateRef.current.food = { x: rx, y: ry };
  };

  useEffect(() => {
    if (!snakePlaying) return;
    setSnakeGameOver(false);

    const canvas = snakeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    generateFood();

    const gameLoop = () => {
      const state = snakeStateRef.current;
      const head = {
        x: state.snake[0].x + state.direction.x,
        y: state.snake[0].y + state.direction.y,
      };

      // Wrap-around bounds
      const cols = 20;
      const rows = 15;
      if (head.x < 0) head.x = cols - 1;
      if (head.x >= cols) head.x = 0;
      if (head.y < 0) head.y = rows - 1;
      if (head.y >= rows) head.y = 0;

      // Check self-collision
      const selfCollide = state.snake.some((segment) => segment.x === head.x && segment.y === head.y);
      if (selfCollide) {
        synth.playGameSound("hit");
        setSnakePlaying(false);
        setSnakeGameOver(true);
        return;
      }

      state.snake.unshift(head);

      // Eat Food
      if (head.x === state.food.x && head.y === state.food.y) {
        synth.playGameSound("coin");
        setSnakeScore((prev) => {
          const next = prev + 10;
          if (next > snakeHighScore) {
            setSnakeHighScore(next);
            localStorage.setItem("rewind_snake_highscore", next.toString());
          }
          return next;
        });
        setUserCoins((prev) => prev + 5);
        addXp(15);
        generateFood();
      } else {
        state.snake.pop();
      }

      // Render Frame
      ctx.fillStyle = "#1A1A1A";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid helper lines
      ctx.strokeStyle = "#2A2A2A";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < canvas.width; i += state.gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += state.gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Draw Snake
      state.snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#FF6B35" : "#00B4D8";
        ctx.fillRect(
          segment.x * state.gridSize + 1,
          segment.y * state.gridSize + 1,
          state.gridSize - 2,
          state.gridSize - 2
        );
      });

      // Draw Food
      ctx.fillStyle = "#FFC107";
      ctx.beginPath();
      const r = state.gridSize / 2;
      ctx.arc(
        state.food.x * state.gridSize + r,
        state.food.y * state.gridSize + r,
        r - 2,
        0,
        2 * Math.PI
      );
      ctx.fill();
    };

    const interval = setInterval(gameLoop, snakeStateRef.current.speed);
    return () => clearInterval(interval);
  }, [snakePlaying]);

  const handleSnakeKey = (dir: { x: number; y: number }) => {
    const current = snakeStateRef.current.direction;
    if (dir.x !== 0 && current.x !== 0) return; // Prevent 180 flips
    if (dir.y !== 0 && current.y !== 0) return;
    snakeStateRef.current.direction = dir;
  };

  const startSnakeGame = () => {
    snakeStateRef.current.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    snakeStateRef.current.direction = { x: 1, y: 0 };
    setSnakeScore(0);
    setSnakePlaying(true);
    setSnakeGameOver(false);
  };

  // Keyboard navigation for snake game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeGame !== "snake") return;
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") handleSnakeKey({ x: 0, y: -1 });
      else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") handleSnakeKey({ x: 0, y: 1 });
      else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") handleSnakeKey({ x: -1, y: 0 });
      else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") handleSnakeKey({ x: 1, y: 0 });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeGame]);

  // ----------------------------------------------------
  // PAPER PLANE GAME STATE & IMPLEMENTATION (FLAPPY STYLE)
  // ----------------------------------------------------
  const planeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [planeScore, setPlaneScore] = useState(0);
  const [planeHighScore, setPlaneHighScore] = useState(() => {
    return Number(localStorage.getItem("rewind_plane_highscore") || "0");
  });
  const [planePlaying, setPlanePlaying] = useState(false);
  const [planeGameOver, setPlaneGameOver] = useState(false);

  const planeStateRef = useRef({
    y: 100,
    velocity: 0,
    gravity: 0.28,
    lift: -4.8,
    pipes: [] as { x: number; top: number; bottom: number; passed?: boolean }[],
    pipeWidth: 50,
    pipeGap: 100,
    frameId: null as any,
  });

  const flapPlane = () => {
    if (!planePlaying) {
      startPlaneGame();
      return;
    }
    synth.playGameSound("coin");
    planeStateRef.current.velocity = planeStateRef.current.lift;
  };

  const startPlaneGame = () => {
    planeStateRef.current.y = 100;
    planeStateRef.current.velocity = 0;
    planeStateRef.current.pipes = [
      { x: 300, top: 60, bottom: 140 },
      { x: 500, top: 100, bottom: 100 },
    ];
    setPlaneScore(0);
    setPlanePlaying(true);
    setPlaneGameOver(false);
  };

  useEffect(() => {
    if (!planePlaying) return;

    const canvas = planeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;

    const loop = () => {
      const state = planeStateRef.current;

      // Update plane physics
      state.velocity += state.gravity;
      state.y += state.velocity;

      // Collision checks
      if (state.y < 0 || state.y > canvas.height - 15) {
        synth.playGameSound("hit");
        setPlanePlaying(false);
        setPlaneGameOver(true);
        cancelAnimationFrame(frameId);
        return;
      }

      // Spawn pipes
      if (state.pipes.length === 0 || state.pipes[state.pipes.length - 1].x < canvas.width - 150) {
        const minH = 30;
        const maxH = canvas.height - state.pipeGap - minH;
        const topH = Math.floor(Math.random() * (maxH - minH)) + minH;
        const bottomH = canvas.height - state.pipeGap - topH;
        state.pipes.push({ x: canvas.width, top: topH, bottom: bottomH });
      }

      // Update pipes
      state.pipes.forEach((pipe) => {
        pipe.x -= 2;

        // Score tracking
        if (!pipe.passed && pipe.x < 50) {
          pipe.passed = true;
          setPlaneScore((s) => {
            const next = s + 1;
            if (next > planeHighScore) {
              setPlaneHighScore(next);
              localStorage.setItem("rewind_plane_highscore", next.toString());
            }
            return next;
          });
          setUserCoins((prev) => prev + 2);
          addXp(10);
        }

        // Pipe collision
        if (pipe.x < 50 + 20 && pipe.x + state.pipeWidth > 50) {
          if (state.y < pipe.top || state.y + 12 > canvas.height - pipe.bottom) {
            synth.playGameSound("hit");
            setPlanePlaying(false);
            setPlaneGameOver(true);
            return;
          }
        }
      });

      // Filter off-screen pipes
      state.pipes = state.pipes.filter((pipe) => pipe.x > -state.pipeWidth);

      // Render Frame
      ctx.fillStyle = "#FFF9F2";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Blackboard green background decoration
      ctx.fillStyle = "#1E4620";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Drawing blackboard grid / chalk lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // Draw Pipes as rulers / notebook lines
      state.pipes.forEach((pipe) => {
        ctx.fillStyle = "#E0A96D"; // Pencil wood color
        ctx.fillRect(pipe.x, 0, state.pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, state.pipeWidth, pipe.bottom);

        // Pencil tip accents
        ctx.fillStyle = "#2D2D2D";
        ctx.fillRect(pipe.x, pipe.top - 5, state.pipeWidth, 5);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, state.pipeWidth, 5);
      });

      // Draw Paper Plane
      ctx.save();
      ctx.translate(50, state.y);
      ctx.rotate(Math.min(Math.max(state.velocity * 0.08, -0.5), 0.5));

      // Draw vector paper plane using SVG style path coordinates
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(-5, -8);
      ctx.lineTo(-1, 0);
      ctx.lineTo(-5, 8);
      ctx.closePath();
      ctx.fill();

      // Shadow overlay
      ctx.strokeStyle = "#CCCCCC";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.restore();

      if (planePlaying) {
        frameId = requestAnimationFrame(loop);
      }
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [planePlaying]);

  // ----------------------------------------------------
  // NOSTALGIC MEMORY MATCHING GAME STATE & LOGIC
  // ----------------------------------------------------
  const memoryItems = [
    { id: "tamagotchi", icon: "📟", name: "Tamagotchi" },
    { id: "cassette", icon: "📼", name: "Cassette" },
    { id: "nokia", icon: "📱", name: "Nokia 3310" },
    { id: "candy", icon: "🍭", name: "Candy Pop" },
    { id: "pencil", icon: "✏️", name: "Rubber Eraser" },
    { id: "paperboat", icon: "⛵", name: "Paper Boat" },
  ];

  const [cards, setCards] = useState<{ index: number; id: string; icon: string; matched: boolean; flipped: boolean }[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [cardsMatchedCount, setCardsMatchedCount] = useState(0);

  const initMemoryGame = () => {
    // Duplicate items, shuffle, and initialize
    const duplicated = [...memoryItems, ...memoryItems].map((item, idx) => ({
      index: idx,
      id: item.id,
      icon: item.icon,
      matched: false,
      flipped: false,
    }));

    // Shuffle
    const shuffled = duplicated.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelectedCards([]);
    setCardsMatchedCount(0);
  };

  useEffect(() => {
    initMemoryGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (selectedCards.length === 2) return;
    const card = cards[index];
    if (card.flipped || card.matched) return;

    synth.playGameSound("coin");

    // Flip card
    const updated = cards.map((c, idx) => (idx === index ? { ...c, flipped: true } : c));
    setCards(updated);

    const nextSelected = [...selectedCards, index];
    setSelectedCards(nextSelected);

    if (nextSelected.length === 2) {
      const first = cards[nextSelected[0]];
      const second = cards[nextSelected[1]];

      if (first.id === second.id) {
        // Matched
        setTimeout(() => {
          synth.playGameSound("match");
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === nextSelected[0] || idx === nextSelected[1] ? { ...c, matched: true } : c
            )
          );
          setCardsMatchedCount((m) => {
            const next = m + 1;
            if (next === memoryItems.length) {
              setUserCoins((c) => c + 20);
              addXp(40);
            }
            return next;
          });
          setSelectedCards([]);
        }, 400);
      } else {
        // Unflip cards
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === nextSelected[0] || idx === nextSelected[1] ? { ...c, flipped: false } : c
            )
          );
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  // ----------------------------------------------------
  // CAPSULE COLLECTION VAULT SYSTEM (Feature 18)
  // ----------------------------------------------------
  const [capsuleSpinning, setCapsuleSpinning] = useState(false);
  const [unlockedItem, setUnlockedItem] = useState<RetroInventoryItem | null>(null);

  const triggerInventoryCapsule = () => {
    if (userCoins < 25) return;
    synth.playGameSound("coin");
    setUserCoins((c) => c - 25);
    setCapsuleSpinning(true);
    setUnlockedItem(null);

    setTimeout(() => {
      // Pick a random locked item or any item
      const randIdx = Math.floor(Math.random() * inventory.length);
      const chosen = { ...inventory[randIdx] };

      // Update inventory state
      const updatedInventory = inventory.map((item, idx) => {
        if (idx === randIdx) {
          return { ...item, unlockedAt: new Date().toLocaleDateString() };
        }
        return item;
      });

      setInventory(updatedInventory);
      setUnlockedItem(chosen);
      setCapsuleSpinning(false);
      synth.playGameSound("match");
      addXp(30);
    }, 2000);
  };

  // ----------------------------------------------------
  // HIDDEN CLUES DISCOVERY HUNT (Feature 38)
  // ----------------------------------------------------
  const [huntClueIndex, setHuntClueIndex] = useState(0);
  const [huntInput, setHuntInput] = useState("");
  const [huntStatus, setHuntStatus] = useState<"idle" | "success" | "fail">("idle");

  const huntClues = [
    { clue: "Find the electronic device that played music without the internet.", answer: "MP3 Player" },
    { clue: "What snake game did everyone play on green screens of retro phones?", answer: "Snake" },
    { clue: "Name the sweet ring candy you could wear on your finger.", answer: "Ring Pop" },
  ];

  const handleClueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const current = huntClues[huntClueIndex];
    if (huntInput.toLowerCase().trim() === current.answer.toLowerCase()) {
      setHuntStatus("success");
      setUserCoins((c) => c + 15);
      synth.playGameSound("match");
      addXp(20);
    } else {
      setHuntStatus("fail");
      synth.playGameSound("hit");
    }
  };

  const handleNextClue = () => {
    setHuntClueIndex((prev) => (prev + 1) % huntClues.length);
    setHuntInput("");
    setHuntStatus("idle");
  };

  return (
    <div className="grid grid-cols-12 gap-6" id="arcade-tab-view">
      {/* Game Station selector Sidebar */}
      <div className="col-span-12 md:col-span-3 flex flex-col gap-3">
        <h3 className="text-xs font-black uppercase text-[#9CA3AF] tracking-widest pl-2">
          ARCADE CABINETS
        </h3>
        {[
          { id: "snake", label: "Retro Snake 🐍", desc: "Classic pixel puzzle" },
          { id: "plane", label: "Paper Plane ✈️", desc: "Physics board challenge" },
          { id: "cards", label: "Memory Match 🧩", desc: "Test childhood memory" },
        ].map((game) => (
          <button
            key={game.id}
            onClick={() => {
              synth.playGameSound("coin");
              setActiveGame(game.id as any);
            }}
            className={`p-4 rounded-3xl border-2 text-left transition-all ${
              activeGame === game.id
                ? "bg-white border-[#FF6B35] shadow-lg shadow-orange-50 scale-[1.02]"
                : "bg-white/60 border-[#FFEBD6] hover:border-orange-200"
            }`}
          >
            <h4 className="font-black text-[#2D2D2D] leading-none mb-1">{game.label}</h4>
            <p className="text-[10px] text-gray-500 font-semibold leading-none">{game.desc}</p>
          </button>
        ))}

        {/* Hidden Memory Clue Hunter widget */}
        <div className="bg-[#FFF9F2] p-4 rounded-[2rem] border-2 border-[#FFEBD6] mt-2 flex flex-col gap-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#FF6B35] flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            Feature 38: Memory Hunt
          </h4>
          <p className="text-[10px] text-gray-600 font-bold leading-relaxed">
            {huntClues[huntClueIndex].clue}
          </p>

          <form onSubmit={handleClueSubmit} className="flex gap-1.5">
            <input
              type="text"
              placeholder="Your guess..."
              value={huntInput}
              onChange={(e) => setHuntInput(e.target.value)}
              className="flex-1 px-2.5 py-1.5 text-xs font-bold bg-white rounded-xl border border-[#FFEBD6] focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-[#FF6B35] text-white rounded-xl text-xs font-black uppercase tracking-tight"
            >
              Verify
            </button>
          </form>

          {huntStatus === "success" && (
            <div className="p-2 bg-green-50 text-green-700 text-[10px] font-bold rounded-lg border border-green-100 flex flex-col gap-1.5">
              <span>🎉 Correct! +15💰 coins rewarded!</span>
              <button onClick={handleNextClue} className="text-left underline font-black uppercase tracking-wider">
                Next Clue ➔
              </button>
            </div>
          )}
          {huntStatus === "fail" && (
            <p className="text-[10px] text-red-500 font-bold leading-none">❌ Wrong! Try another guess!</p>
          )}
        </div>
      </div>

      {/* Main Game Screen Portal */}
      <div className="col-span-12 md:col-span-6 flex flex-col gap-6">
        <div className="bg-[#1A1A1A] p-6 rounded-[2.5rem] border-[10px] border-[#2D2D2D] shadow-2xl flex flex-col items-center relative overflow-hidden">
          {/* Retro neon CRT light scan effect */}
          <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-10"></div>

          {/* Game Header Stats */}
          <div className="w-full flex justify-between items-center text-white font-mono text-[10px] tracking-widest border-b border-[#333] pb-3 mb-4">
            <span className="text-[#FF6B35]">CABINET ACTIVE // {activeGame.toUpperCase()}</span>
            {activeGame === "snake" && (
              <span>
                SCORE: {snakeScore} // HIGH: {snakeHighScore}
              </span>
            )}
            {activeGame === "plane" && (
              <span>
                SCORE: {planeScore} // HIGH: {planeHighScore}
              </span>
            )}
            {activeGame === "cards" && (
              <span>
                MATCHES: {cardsMatchedCount} / {memoryItems.length}
              </span>
            )}
          </div>

          {/* RENDERING SNAKE CANVAS */}
          {activeGame === "snake" && (
            <div className="flex flex-col items-center gap-4">
              <canvas
                ref={snakeCanvasRef}
                width={400}
                height={300}
                className="w-full max-w-[400px] aspect-[4/3] bg-[#1A1A1A] rounded-2xl border-4 border-[#333] shadow-inner cursor-pointer"
              />

              <div className="flex gap-2">
                {!snakePlaying && (
                  <button
                    onClick={startSnakeGame}
                    className="px-6 py-2.5 bg-[#FF6B35] text-white rounded-xl font-black text-sm uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    {snakeGameOver ? "Play Again" : "Insert Coin (Start)"}
                  </button>
                )}
              </div>

              {/* Virtual D-pad controls for touch/clicks */}
              <div className="grid grid-cols-3 gap-2 w-32 mt-2">
                <div></div>
                <button
                  onClick={() => handleSnakeKey({ x: 0, y: -1 })}
                  className="bg-[#2D2D2D] text-white p-2.5 rounded-xl text-center active:bg-[#FF6B35] active:text-white"
                >
                  ▲
                </button>
                <div></div>
                <button
                  onClick={() => handleSnakeKey({ x: -1, y: 0 })}
                  className="bg-[#2D2D2D] text-white p-2.5 rounded-xl text-center active:bg-[#FF6B35] active:text-white"
                >
                  ◀
                </button>
                <div className="bg-[#1A1A1A]"></div>
                <button
                  onClick={() => handleSnakeKey({ x: 1, y: 0 })}
                  className="bg-[#2D2D2D] text-white p-2.5 rounded-xl text-center active:bg-[#FF6B35] active:text-white"
                >
                  ▶
                </button>
                <div></div>
                <button
                  onClick={() => handleSnakeKey({ x: 0, y: 1 })}
                  className="bg-[#2D2D2D] text-white p-2.5 rounded-xl text-center active:bg-[#FF6B35] active:text-white"
                >
                  ▼
                </button>
              </div>
            </div>
          )}

          {/* RENDERING PLANE FLAPPER CANVAS */}
          {activeGame === "plane" && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="relative">
                <canvas
                  ref={planeCanvasRef}
                  width={400}
                  height={300}
                  onClick={flapPlane}
                  className="w-full max-w-[400px] aspect-[4/3] bg-[#1E4620] rounded-2xl border-4 border-[#333] shadow-inner cursor-pointer"
                />
                {!planePlaying && !planeGameOver && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-2xl text-white">
                    <p className="text-xs font-bold uppercase tracking-widest mb-3">Chalkboard Aviator</p>
                    <button
                      onClick={startPlaneGame}
                      className="px-6 py-2 bg-[#FF6B35] text-white rounded-xl font-bold text-xs"
                    >
                      FLY PLANE
                    </button>
                  </div>
                )}

                {planeGameOver && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-2xl text-white">
                    <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-1">Crashed!</p>
                    <p className="text-[10px] font-semibold text-gray-300 mb-3">Score: {planeScore}</p>
                    <button
                      onClick={startPlaneGame}
                      className="px-6 py-2 bg-[#FF6B35] text-white rounded-xl font-bold text-xs"
                    >
                      Retry Loop
                    </button>
                  </div>
                )}
              </div>
              <p className="text-[9px] text-gray-400 font-mono font-bold leading-none uppercase">
                Tap Screen or click Button to flap paper plane through pencil obstacles!
              </p>
              <button
                onClick={flapPlane}
                className="w-full max-w-xs py-3 bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-white rounded-2xl font-black text-md uppercase"
              >
                FLAP PLANE (SPACEBAR)
              </button>
            </div>
          )}

          {/* RENDERING MEMORY MATCH CARD GAME */}
          {activeGame === "cards" && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="grid grid-cols-4 gap-2 w-full max-w-[320px]">
                {cards.map((card, idx) => {
                  const isRevealed = card.flipped || card.matched;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleCardClick(idx)}
                      className={`aspect-square rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-center text-3xl select-none ${
                        isRevealed ? "bg-[#333] scale-100 rotate-180 text-white" : "bg-[#FF6B35] text-white hover:scale-105 active:scale-95"
                      }`}
                    >
                      {isRevealed ? card.icon : "❓"}
                    </div>
                  );
                })}
              </div>

              {cardsMatchedCount === memoryItems.length && (
                <div className="p-4 bg-green-950 border border-green-800 text-center text-green-300 rounded-2xl max-w-xs">
                  <p className="text-xs font-black uppercase tracking-widest mb-1">🏆 Perfect Match!</p>
                  <p className="text-[10px] font-bold leading-snug">
                    You matched all childhood memory capsules! +20💰 coins rewarded!
                  </p>
                  <button
                    onClick={initMemoryGame}
                    className="mt-3 px-4 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded-xl text-[10px] font-bold"
                  >
                    RESET GRID
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RPG Childhood Inventory Vault Column */}
      <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
        <div className="bg-white rounded-[2rem] p-5 border-2 border-[#FFEBD6] shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b border-orange-50 pb-2">
            <div>
              <h3 className="text-xs font-black uppercase text-[#2D2D2D] tracking-wider leading-none">
                Capsule Vault
              </h3>
              <p className="text-[9px] text-gray-400 font-bold leading-tight mt-1">Unlock childhood relics</p>
            </div>
            <span className="text-[10px] font-black text-orange-500">
              {inventory.filter((i) => i.unlockedAt).length} / {inventory.length} UNLOCKED
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {inventory.map((item, idx) => {
              const isUnlocked = !!item.unlockedAt;
              return (
                <div
                  key={idx}
                  title={isUnlocked ? `${item.name} (${item.category})` : "Locked Memory Relic"}
                  className={`aspect-square rounded-xl flex items-center justify-center text-xl transition-all relative ${
                    isUnlocked
                      ? "bg-orange-50 border-2 border-[#FF6B35]/40"
                      : "bg-[#F3F4F6] border border-dashed border-gray-300 opacity-40 grayscale"
                  }`}
                >
                  {isUnlocked ? item.icon : "🔒"}

                  {isUnlocked && (
                    <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.rarityColor }}></span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Trigger capsule spin */}
          <button
            onClick={triggerInventoryCapsule}
            disabled={userCoins < 25 || capsuleSpinning}
            className={`w-full py-3 bg-[#FF6B35] text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-md disabled:opacity-50 transition-all`}
          >
            {capsuleSpinning ? "SPINNING CAPSULE..." : "SPIN RELIC CAPSULE (25💰)"}
          </button>
        </div>

        {/* Display details of newly unlocked item */}
        {unlockedItem && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2rem] border-2 border-[#FF6B35]/30 p-5 shadow-sm relative overflow-hidden animate-fade-in">
            <div className="absolute top-3 right-3 text-[9px] font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: unlockedItem.rarityColor + "33", color: unlockedItem.rarityColor }}>
              {unlockedItem.category.toUpperCase()}
            </div>
            <div className="text-3xl mb-2">{unlockedItem.icon}</div>
            <h4 className="text-xs font-black text-[#2D2D2D] mb-1 leading-none">{unlockedItem.name}</h4>
            <p className="text-[10px] text-gray-600 font-medium leading-relaxed mb-2">{unlockedItem.description}</p>
            <div className="p-2.5 bg-white rounded-xl border border-orange-100 text-[9px] text-[#FF6B35] leading-relaxed italic font-bold">
              "Fun Fact: {unlockedItem.funFact}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
