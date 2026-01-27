"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ThemeSelector } from "./ThemeSelector";
import { RandomSettings } from "./RandomSettings";
import { SpinningWheel, Race, ClawMachine, MysteryBoxes } from "./themes";
import { RandomHistoryItem } from "@/components/molecules/classroom/RandomHistoryItem";
import type {
  Student,
  Classroom,
  RandomHistory,
  RandomTheme,
} from "@/types/classroom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface RandomPickerProps {
  classrooms: Classroom[];
  students: Student[];
  currentClassroom?: Classroom;
  randomHistory: RandomHistory[];
  onAddHistory: (history: RandomHistory) => void;
  className?: string;
}

export function RandomPicker({
  classrooms: _classrooms,
  students,
  currentClassroom,
  randomHistory,
  onAddHistory,
  className,
}: RandomPickerProps) {
  const [selectedTheme, setSelectedTheme] = useState<RandomTheme>("wheel");
  const [pickCount, setPickCount] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  // Handle theme change - reset game state
  const handleThemeChange = useCallback((theme: RandomTheme) => {
    setSelectedTheme(theme);
    setIsPlaying(false);
    setGameKey((prev) => prev + 1);
  }, []);

  const handleStart = useCallback(() => {
    if (students.length === 0) return;
    setIsPlaying(true);
    setGameKey((prev) => prev + 1);
  }, [students.length]);

  const handleComplete = useCallback(
    (winners: Student[]) => {
      setIsPlaying(false);

      if (winners.length > 0 && currentClassroom) {
        const history: RandomHistory = {
          id: `random-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          classId: currentClassroom.id,
          className: currentClassroom.name,
          timestamp: new Date().toISOString(),
          selectedStudents: winners.map((s) => ({
            id: s.id,
            name: s.name,
            studentCode: s.studentCode,
          })),
        };
        onAddHistory(history);
      }
    },
    [currentClassroom, onAddHistory]
  );

  const renderTheme = () => {
    const props = {
      students,
      pickCount,
      isPlaying,
      onComplete: handleComplete,
    };

    switch (selectedTheme) {
      case "wheel":
        return <SpinningWheel key={gameKey} {...props} />;
      case "race":
        return <Race key={gameKey} {...props} />;
      case "claw":
        return <ClawMachine key={gameKey} {...props} />;
      case "boxes":
        return <MysteryBoxes key={gameKey} {...props} />;
      default:
        return <SpinningWheel key={gameKey} {...props} />;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Controls Row */}
      <div className="grid gap-3 md:grid-cols-3">
        <ThemeSelector
          selectedTheme={selectedTheme}
          onSelectTheme={handleThemeChange}
          disabled={isPlaying}
        />

        <div className="md:col-span-2">
          <RandomSettings
            studentCount={students.length}
            totalStudents={students.length}
            pickCount={pickCount}
            onPickCountChange={setPickCount}
            onStart={handleStart}
            isPlaying={isPlaying}
            selectedTheme={selectedTheme}
          />
        </div>
      </div>

      {/* Game Display */}
      <div>{renderTheme()}</div>

      {/* History */}
      <Card className="bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Lịch sử random gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          {randomHistory.length > 0 ? (
            <div className="max-h-48 space-y-3 overflow-y-auto">
              {randomHistory.map((history, index) => (
                <RandomHistoryItem
                  key={`${history.id}-${index}`}
                  history={history}
                />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-400">
              Chưa có lịch sử random.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
