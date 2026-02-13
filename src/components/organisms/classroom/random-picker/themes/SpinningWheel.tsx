"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Disc3, Trophy, Sparkles } from "lucide-react";
import Image from "next/image";
import type { GameThemeProps } from "@/types/classroom";

const COLORS = [
  "#2563eb", // blue-600 (primary)
  "#3b82f6", // blue-500
  "#06b6d4", // cyan-500
  "#14b8a6", // teal-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
];

export function SpinningWheel({
  students,
  pickCount,
  isPlaying,
  onComplete,
}: GameThemeProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winners, setWinners] = useState<typeof students>([]);
  const [currentSpin, setCurrentSpin] = useState(0);

  useEffect(() => {
    if (isPlaying && !spinning && winners.length === 0) {
      startSpinning();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const startSpinning = async () => {
    setWinners([]);
    setCurrentSpin(0);

    const selectedWinners: typeof students = [];
    const availableStudents = [...students];

    for (let i = 0; i < pickCount; i++) {
      setSpinning(true);
      setCurrentSpin(i + 1);

      const randomIndex = Math.floor(Math.random() * availableStudents.length);
      const winner = availableStudents[randomIndex];
      availableStudents.splice(randomIndex, 1);

      const winnerIndex = students.findIndex((s) => s.id === winner.id);
      const segmentAngle = 360 / students.length;
      const targetAngle = winnerIndex * segmentAngle;
      const spins = 5 + Math.random() * 3;
      const newRotation = rotation + spins * 360 + targetAngle;

      setRotation(newRotation);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      selectedWinners.push(winner);
      setWinners([...selectedWinners]);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#3b82f6", "#06b6d4", "#8b5cf6"],
      });

      if (i < pickCount - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    setSpinning(false);
    onComplete(selectedWinners);
  };

  const createSegmentPath = (index: number, total: number, radius: number) => {
    const angle = 360 / total;
    const startAngle = index * angle - 90;
    const endAngle = startAngle + angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = radius + radius * Math.cos(startRad);
    const y1 = radius + radius * Math.sin(startRad);
    const x2 = radius + radius * Math.cos(endRad);
    const y2 = radius + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    return `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (index: number, total: number, radius: number) => {
    const angle = 360 / total;
    const midAngle = index * angle + angle / 2 - 90;
    const midRad = (midAngle * Math.PI) / 180;
    const textRadius = radius * 0.65;

    return {
      x: radius + textRadius * Math.cos(midRad),
      y: radius + textRadius * Math.sin(midRad),
      rotation: midAngle + 90,
    };
  };

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-white p-8 shadow-sm lg:p-12">
      <div className="mb-10 flex items-center justify-center gap-4">
        <h2 className="text-3xl font-bold text-slate-800">
          Vòng quay may mắn
          {pickCount > 1 && (
            <span className="ml-2 text-blue-500">
              Lượt {currentSpin}/{pickCount}
            </span>
          )}
        </h2>
      </div>

      <div className="flex flex-col items-center justify-center gap-10 lg:flex-row lg:gap-12">
        {/* Wheel */}
        <div className="relative">
          {/* Pointer */}
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-6">
            <div className="relative">
              <div className="h-0 w-0 border-l-24 border-r-24 border-t-36 border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
              <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full border-[3px] border-primary bg-white" />
            </div>
          </div>

          {/* Wheel Container */}
          <div className="relative h-80 w-80 md:h-105 md:w-105">
            <motion.div
              className="relative h-full w-full overflow-hidden rounded-full"
              style={{
                border: "6px solid white",
                boxShadow:
                  "0 0 0 3px #2563eb, 0 20px 40px rgba(37, 99, 235, 0.3)",
              }}
              animate={{ rotate: rotation }}
              transition={{
                duration: 3,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <svg viewBox="0 0 420 420" className="h-full w-full">
                {students.map((student, index) => {
                  const color = COLORS[index % COLORS.length];
                  const isWinner = winners.some((w) => w.id === student.id);
                  const textPos = getTextPosition(index, students.length, 210);

                  return (
                    <g key={student.id}>
                      <path
                        d={createSegmentPath(index, students.length, 210)}
                        fill={color}
                        style={{
                          opacity: isWinner ? 0.4 : 1,
                          filter: isWinner ? "grayscale(50%)" : "none",
                        }}
                      />
                      <text
                        x={textPos.x}
                        y={textPos.y}
                        fill="white"
                        fontSize="14"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textPos.rotation}, ${textPos.x}, ${textPos.y})`}
                        style={{
                          textShadow: "0 2px 4px rgba(0,0,0,0.4)",
                        }}
                      >
                        {student.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Center Circle */}
              <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-primary bg-linear-to-br from-white to-gray-100 shadow-2xl">
                <Sparkles className="h-8 w-8 text-primary" strokeWidth={2.5} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Winners Display */}
        <div className="min-w-70 flex-1 md:min-w-80">
          <div className="mb-6 flex items-center gap-3">
            <Trophy className="h-7 w-7 text-primary" strokeWidth={2.5} />
            <h3 className="text-2xl font-bold text-slate-800">Kết quả</h3>
          </div>

          <AnimatePresence mode="popLayout">
            {winners.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border-[3px] border-dashed border-blue-200 bg-linear-to-br from-blue-50 to-white px-6 py-16 text-center"
              >
                <Disc3
                  className={`mx-auto mb-4 h-16 w-16 text-blue-300 ${
                    spinning ? "animate-spin" : ""
                  }`}
                  strokeWidth={2}
                />
                <p className="text-lg font-bold text-gray-400">
                  {spinning ? "Đang quay..." : "Chưa có kết quả"}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {winners.map((winner, index) => (
                  <motion.div
                    key={winner.id}
                    initial={{ scale: 0, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: index * 0.1,
                    }}
                    className="relative overflow-hidden rounded-2xl border-[3px] border-primary bg-linear-to-br from-blue-50 to-cyan-50 shadow-lg"
                  >
                    <div className="flex items-center gap-4 p-6">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-white bg-linear-to-br from-primary to-blue-500 text-2xl font-bold text-white shadow-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 text-2xl font-bold text-slate-800">
                          {winner.name}
                        </div>
                        <div className="text-sm font-semibold text-gray-500">
                          Học sinh được chọn
                        </div>
                      </div>
                      <Image
                        src={`/images/random/stu${(index % 2) + 1}.${index % 2 === 0 ? "png" : "webp"}`}
                        alt={winner.name}
                        width={48}
                        height={48}
                        className="object-contain drop-shadow-lg"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
