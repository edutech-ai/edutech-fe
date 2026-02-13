"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Image from "next/image";
import type { GameThemeProps, Student } from "@/types/classroom";

// Get duck image path
const getDuckImage = (index: number) =>
  `/images/random/duck${(index % 6) + 1}.png`;

export function Race({
  students,
  pickCount,
  isPlaying,
  onComplete,
}: GameThemeProps) {
  const [racing, setRacing] = useState(false);
  const [positions, setPositions] = useState<Record<string, number>>({});
  const [winners, setWinners] = useState<Student[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (isPlaying && !racing && winners.length === 0) {
      startRace();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const startRace = () => {
    setRacing(true);
    setFinished(false);
    setWinners([]);

    const initialPositions: Record<string, number> = {};
    students.forEach((student) => {
      initialPositions[student.id] = 0;
    });
    setPositions(initialPositions);

    // Create random base speeds for each student
    const studentSpeeds: Record<string, number> = {};
    students.forEach((student) => {
      studentSpeeds[student.id] = 0.3 + Math.random() * 0.9;
    });

    const raceWinners: Student[] = [];

    const interval = setInterval(() => {
      setPositions((prev) => {
        const newPositions = { ...prev };
        students.forEach((student) => {
          if (newPositions[student.id] < 100) {
            const baseSpeed = studentSpeeds[student.id];
            const randomBurst = (Math.random() - 0.4) * 0.8;
            const speed = Math.max(0.1, baseSpeed + randomBurst);

            newPositions[student.id] = Math.min(
              100,
              newPositions[student.id] + speed
            );
          }

          if (
            newPositions[student.id] >= 100 &&
            !raceWinners.some((w) => w.id === student.id)
          ) {
            raceWinners.push(student);

            if (raceWinners.length === pickCount) {
              clearInterval(interval);
              setWinners(raceWinners);
              setFinished(true);
              setRacing(false);

              confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ["#2563eb", "#3b82f6", "#fbbf24", "#f59e0b"],
              });

              setTimeout(() => onComplete(raceWinners), 1000);
            }
          }
        });
        return newPositions;
      });
    }, 50);
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "🏅";
  };

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-white p-8 shadow-sm lg:p-12">
      <div className="mb-10 flex items-center justify-center gap-4">
        <h2 className="text-3xl font-bold text-slate-800">
          Đua vịt
          <span className="ml-2 text-2xl text-blue-500">
            Top {pickCount} về đích!
          </span>
        </h2>
      </div>

      {/* Winners Display */}
      <AnimatePresence>
        {finished && winners.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border-2 border-primary bg-linear-to-br from-blue-50 via-cyan-50 to-blue-50 p-4"
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {winners.map((winner, index) => {
                const studentIndex = students.findIndex(
                  (s) => s.id === winner.id
                );
                return (
                  <motion.div
                    key={winner.id}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: index * 0.15,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="cursor-pointer rounded-xl border-2 border-primary bg-white p-4 transition-transform duration-200 hover:scale-105"
                  >
                    <div className="text-center">
                      <Image
                        src={getDuckImage(studentIndex)}
                        alt={winner.name}
                        width={48}
                        height={48}
                        className="mx-auto mb-2 object-contain drop-shadow-lg"
                      />
                      <div className="mb-0.5 text-base font-bold text-slate-800">
                        {winner.name}
                      </div>
                      <div className="text-xs font-semibold text-primary">
                        {getMedalIcon(index + 1)} #{index + 1}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Race Track */}
      <div
        className="relative min-h-100 overflow-hidden rounded-xl border-2 border-blue-200 p-6"
        style={{
          backgroundImage: "url(/images/random/bg3.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />

        {/* Finish Line */}
        <div className="absolute bottom-0 right-6 top-0 z-10 w-2 bg-linear-to-b from-red-500 via-white to-red-500" />

        {/* All Ducks - each duck stays in its fixed lane */}
        <div className="relative z-20">
          {students.map((student, index) => {
            const position = positions[student.id] || 0;
            const isWinner = winners.some((w) => w.id === student.id);
            const rank = winners.findIndex((w) => w.id === student.id) + 1;
            const verticalPosition = index * 35;

            return (
              <motion.div
                key={student.id}
                className="absolute"
                style={{ top: `${verticalPosition}px` }}
                initial={{ left: 0 }}
                animate={{ left: `${position}%` }}
                transition={{ duration: 0.05 }}
              >
                <div className="relative -ml-12">
                  <div
                    className={`relative flex items-center gap-2 ${
                      position >= 100 ? "animate-bounce" : ""
                    }`}
                  >
                    {/* Name Tag */}
                    <div className="rounded-md border-2 border-primary bg-white px-2 py-0.5 shadow-md">
                      <div className="whitespace-nowrap text-xs font-bold text-slate-800">
                        {student.name}
                      </div>
                    </div>

                    {/* Duck Image */}
                    <div className="relative">
                      <Image
                        src={getDuckImage(index)}
                        alt={student.name}
                        width={64}
                        height={64}
                        className={`object-contain drop-shadow-xl transition-all duration-200 ${
                          isWinner ? "brightness-110" : ""
                        }`}
                      />
                      {isWinner && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", delay: 0.2 }}
                          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-linear-to-br from-yellow-400 to-amber-500 text-xs font-bold text-white shadow-lg"
                        >
                          {rank}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
