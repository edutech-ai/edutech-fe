"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Star, Hand } from "lucide-react";
import Image from "next/image";
import type { GameThemeProps, Student } from "@/types/classroom";

// Get box image path (box1-8)
const getBoxImage = (index: number) => {
  const boxNum = (index % 8) + 1;
  return `/images/random/box${boxNum}.webp`;
};

interface BoxStudent extends Student {
  boxIndex: number;
}

// Shuffle function called only on mount (via useState initializer)
function createShuffledBoxes(students: Student[]): BoxStudent[] {
  return [...students]
    .map((s, i) => ({ student: s, boxIndex: i, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ student, boxIndex }) => ({ ...student, boxIndex }));
}

export function MysteryBoxes({
  students,
  pickCount,
  isPlaying,
  onComplete,
}: GameThemeProps) {
  // Shuffle on mount - component is remounted via key when game starts
  const [boxes] = useState<BoxStudent[]>(() => createShuffledBoxes(students));
  const [selectedBoxes, setSelectedBoxes] = useState<number[]>([]);
  const [openedBoxes, setOpenedBoxes] = useState<number[]>([]);
  const [winners, setWinners] = useState<Student[]>([]);

  const handleBoxClick = async (index: number) => {
    if (
      !isPlaying ||
      selectedBoxes.includes(index) ||
      openedBoxes.includes(index)
    ) {
      return;
    }

    if (selectedBoxes.length >= pickCount) {
      return;
    }

    const newSelected = [...selectedBoxes, index];
    setSelectedBoxes(newSelected);

    if (newSelected.length === pickCount) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setOpenedBoxes(newSelected);
      const selectedWinners = newSelected.map((i) => boxes[i]);
      setWinners(selectedWinners);

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#3b82f6", "#06b6d4", "#fbbf24", "#f59e0b"],
      });

      setTimeout(() => onComplete(selectedWinners), 1000);
    }
  };

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-white p-8 shadow-sm lg:p-12">
      <div className="mb-10 flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <h2 className="mb-2 text-4xl font-bold text-slate-800">
            Hộp quà may mắn
          </h2>
          <p className="flex items-center justify-center gap-2 text-xl font-semibold text-gray-500">
            <Hand className="h-6 w-6" strokeWidth={2.5} />
            Click để chọn {pickCount} hộp quà!
          </p>
          {isPlaying && (
            <div className="mt-3 rounded-full border-[3px] border-primary bg-linear-to-r from-blue-100 to-cyan-100 px-6 py-2">
              <span className="text-base font-bold text-primary">
                Đã chọn: {selectedBoxes.length}/{pickCount}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Winners Display */}
      <AnimatePresence>
        {winners.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border-2 border-primary bg-linear-to-br from-blue-50 via-cyan-50 to-blue-50 p-4"
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {winners.map((winner, index) => (
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
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-primary to-blue-500 shadow-lg">
                      <Star className="h-6 w-6 text-white" fill="white" />
                    </div>
                    <div className="mb-0.5 text-base font-bold text-slate-800">
                      {winner.name}
                    </div>
                    <div className="text-xs font-semibold text-primary">
                      Học sinh #{index + 1}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boxes Grid */}
      <div className="mb-10 grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-6">
        {boxes.map((student, index) => {
          const isSelected = selectedBoxes.includes(index);
          const isOpened = openedBoxes.includes(index);
          const canSelect =
            isPlaying &&
            !isSelected &&
            !isOpened &&
            selectedBoxes.length < pickCount;

          return (
            <motion.div
              key={student.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: isSelected ? 1.05 : 1,
                rotate: 0,
              }}
              transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 200,
              }}
              className="relative aspect-square"
            >
              <AnimatePresence mode="wait">
                {!isOpened ? (
                  <motion.button
                    key="closed"
                    onClick={() => handleBoxClick(index)}
                    disabled={!canSelect}
                    className={`relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-[3px] shadow-lg transition-all duration-200 bg-white ${
                      isSelected
                        ? "scale-105 border-primary shadow-2xl shadow-primary/30"
                        : canSelect
                          ? "border-blue-200 hover:scale-110 hover:border-primary hover:shadow-xl"
                          : "cursor-not-allowed border-blue-200 opacity-60"
                    }`}
                  >
                    <Image
                      src={getBoxImage(index)}
                      alt={`Box ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-contain drop-shadow-lg"
                    />

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-primary shadow-lg"
                      >
                        <Sparkles
                          className="h-6 w-6 text-white"
                          strokeWidth={3}
                        />
                      </motion.div>
                    )}

                    {canSelect && !isSelected && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-white/90 shadow-md"
                      >
                        <Hand
                          className="h-4 w-4 text-primary"
                          strokeWidth={2.5}
                        />
                      </motion.div>
                    )}
                  </motion.button>
                ) : (
                  <motion.div
                    key="opened"
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                    className="h-full w-full"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div
                      className="flex h-full w-full flex-col items-center justify-center rounded-2xl border-2 border-primary bg-linear-to-br from-blue-50 to-cyan-50 p-2"
                      style={{ transform: "rotateY(180deg)" }}
                    >
                      <Star
                        className="mb-1 h-8 w-8 text-primary md:h-10 md:w-10"
                        strokeWidth={2.5}
                        fill="currentColor"
                      />
                      <div className="px-1 text-center text-xs font-bold leading-tight text-slate-800 md:text-sm">
                        {student.name}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
