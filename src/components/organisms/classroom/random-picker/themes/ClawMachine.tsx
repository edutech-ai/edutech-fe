"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Gamepad2, Gift } from "lucide-react";
import Image from "next/image";
import type { GameThemeProps, Student } from "@/types/classroom";

// Get among character image path
const getAmongImage = (index: number) => {
  const images = [
    "/images/random/among1.webp",
    "/images/random/among2.webp",
    "/images/random/among3.png",
    "/images/random/among4.webp",
    "/images/random/among5.png",
    "/images/random/among6.webp",
  ];
  return images[index % images.length];
};

export function ClawMachine({
  students,
  pickCount,
  isPlaying,
  onComplete,
}: GameThemeProps) {
  const [clawPosition, setClawPosition] = useState({ x: 50, y: 0 });
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [winners, setWinners] = useState<Student[]>([]);
  const [currentPick, setCurrentPick] = useState(0);

  useEffect(() => {
    if (isPlaying && winners.length === 0) {
      startClawSequence();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const startClawSequence = async () => {
    const selectedWinners: Student[] = [];

    for (let i = 0; i < pickCount; i++) {
      setCurrentPick(i + 1);

      const availableStudents = students.filter(
        (s) => !selectedWinners.some((w) => w.id === s.id)
      );
      const randomIndex = Math.floor(Math.random() * availableStudents.length);
      const winner = availableStudents[randomIndex];

      // Move claw horizontally
      const targetX = 20 + Math.random() * 60;
      setClawPosition({ x: targetX, y: 0 });
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Lower claw
      setClawPosition({ x: targetX, y: 70 });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Grab
      setIsGrabbing(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Lift claw
      setClawPosition({ x: targetX, y: 0 });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Move to drop zone
      setClawPosition({ x: 50, y: 0 });
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Drop
      setIsGrabbing(false);
      await new Promise((resolve) => setTimeout(resolve, 300));

      selectedWinners.push(winner);
      setWinners([...selectedWinners]);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#2563eb", "#3b82f6", "#06b6d4", "#fbbf24"],
      });

      if (i < pickCount - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }

    setTimeout(() => onComplete(selectedWinners), 1000);
  };

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-white p-8 shadow-sm lg:p-12">
      <div className="mb-8 flex items-center justify-center gap-4">
        <h2 className="text-3xl font-bold text-slate-800">
          Gắp Thú May Mắn
          {pickCount > 1 && (
            <span className="ml-2 text-blue-500">
              Lượt {currentPick}/{pickCount}
            </span>
          )}
        </h2>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
        {/* Claw Machine */}
        <div className="flex-1">
          <div
            className="relative rounded-2xl border-4 border-blue-700 p-8"
            style={{
              backgroundImage: "url(/images/random/bg.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Machine Top */}
            <div className="absolute -top-10 left-1/2 h-10 w-40 -translate-x-1/2 rounded-t-2xl border-4 border-primary bg-linear-to-b from-blue-400 to-blue-500 shadow-lg" />

            {/* Glass Container */}
            <div className="relative min-h-87.5 overflow-hidden rounded-2xl border-4 border-white/60 bg-white/30 p-6 shadow-inner backdrop-blur-sm">
              {/* Claw */}
              <motion.div
                className="absolute z-20"
                animate={{
                  left: `${clawPosition.x}%`,
                  top: `${clawPosition.y}%`,
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <div className="relative -ml-10">
                  {/* Claw Cable */}
                  <div
                    className="absolute left-1/2 w-1 -translate-x-1/2 bg-gray-700 shadow-md transition-all duration-800"
                    style={{
                      top: "-40px",
                      height: `${4 + clawPosition.y * 1.4}px`,
                    }}
                  />

                  {/* Claw Arm */}
                  <div
                    className={`flex h-20 w-20 items-center justify-center transition-transform duration-200 ${
                      isGrabbing ? "scale-90" : "scale-100"
                    }`}
                  >
                    <Image
                      src="/images/random/craw.svg"
                      alt="Claw"
                      width={64}
                      height={64}
                      className="object-contain drop-shadow-lg"
                    />
                  </div>

                  {/* Grabbed Capsule */}
                  {isGrabbing && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2"
                    >
                      <Image
                        src={getAmongImage(currentPick)}
                        alt="Grabbed"
                        width={48}
                        height={48}
                        className="object-contain drop-shadow-xl"
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Capsules in Machine */}
              <div className="absolute bottom-6 left-6 right-6 h-32">
                {students.slice(0, 12).map((student, index) => {
                  const isWon = winners.some((w) => w.id === student.id);
                  const randomLeft =
                    5 + ((index * 17 + index * index * 3) % 75);
                  const randomBottom = 10 + ((index * 11) % 90);

                  return (
                    <motion.div
                      key={student.id}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{
                        scale: isWon ? 0 : 1,
                        rotate: 0,
                        opacity: isWon ? 0 : 1,
                      }}
                      transition={{ delay: index * 0.05 }}
                      className="absolute cursor-pointer transition-transform hover:scale-110"
                      style={{
                        left: `${randomLeft}%`,
                        bottom: `${randomBottom}px`,
                        zIndex: index,
                      }}
                    >
                      <Image
                        src={getAmongImage(index)}
                        alt={student.name}
                        width={48}
                        height={48}
                        className="object-contain drop-shadow-lg"
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Drop Zone */}
              <div className="absolute bottom-0 left-1/2 h-16 w-32 -translate-x-1/2 rounded-t-2xl border-t-[3px] border-white/40 bg-linear-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </div>

        {/* Winners Display */}
        <div className="min-w-70 flex-1 md:min-w-[320px]">
          <div className="mb-6 flex items-center gap-3">
            <Gift className="h-7 w-7 text-primary" strokeWidth={2.5} />
            <h3 className="text-2xl font-bold text-slate-800">Kết quả</h3>
          </div>

          <AnimatePresence mode="popLayout">
            {winners.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border-[3px] border-dashed border-blue-200 bg-linear-to-br from-blue-50 to-white px-6 py-16 text-center"
              >
                <Gamepad2
                  className="mx-auto mb-4 h-16 w-16 animate-pulse text-blue-300"
                  strokeWidth={2}
                />
                <p className="text-lg font-bold text-gray-400">Đang gắp...</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {winners.map((winner, index) => (
                  <motion.div
                    key={winner.id}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: index * 0.1,
                    }}
                    className="cursor-pointer rounded-2xl border-2 border-primary bg-linear-to-br from-blue-50 to-cyan-50 p-6 transition-transform duration-200 hover:scale-105"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={getAmongImage(index)}
                        alt={winner.name}
                        width={64}
                        height={64}
                        className="shrink-0 object-contain drop-shadow-lg"
                      />
                      <div className="flex-1">
                        <div className="mb-1 text-2xl font-bold text-slate-800">
                          {winner.name}
                        </div>
                        <div className="text-sm font-semibold text-primary">
                          Học sinh #{index + 1}
                        </div>
                      </div>
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
