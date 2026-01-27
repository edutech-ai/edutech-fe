"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EndSessionDialog,
  AddStudentModal,
} from "@/components/organisms/classroom";
import {
  RandomTab,
  ClassroomTab,
  DataTab,
} from "@/components/organisms/classroom/tabs";
import { useClassroomPage } from "@/hooks/useClassroomPage";
import { Shuffle, School, FileSpreadsheet, Users, Loader2 } from "lucide-react";
import { ActionButton } from "@/components/molecules/action-button";
import Image from "next/image";

export type ClassroomTab = "random" | "classroom" | "data";

export default function ClassroomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const classroomId = params.id as string;

  // Use custom hook for all state management
  const {
    classroom,
    isLoadingClassroom,
    classroomError,
    currentClassroom,
    allClassrooms,
    uiStudents,
    dataStudents,
    selectedClass,
    selectedClassId,
    selectedSubject,
    sessionStatus,
    seatingChart,
    classroomStats,
    selectedStudent,
    randomHistory,
    studentDetail,
    showEndSessionDialog,
    showAddStudentModal,
    setSelectedClassId,
    handleClassChange,
    handleSubjectChange,
    handleStartSession,
    handleEndSession,
    handleConfirmEndSession,
    handleStudentClick,
    handleAddHistory,
    handleStudentRowClick,
    handleCloseStudentDetail,
    handleSaveNote,
    setShowEndSessionDialog,
    setShowAddStudentModal,
  } = useClassroomPage(classroomId);

  // Tab state from URL
  const tabFromUrl = searchParams.get("tab") as ClassroomTab | null;
  const initialTab =
    tabFromUrl && ["random", "classroom", "data"].includes(tabFromUrl)
      ? tabFromUrl
      : "data";

  const [activeTab, setActiveTab] = useState<ClassroomTab>(initialTab);

  const handleTabChange = useCallback(
    (tab: string) => {
      const newTab = tab as ClassroomTab;
      setActiveTab(newTab);
      router.push(`/dashboard/classroom/${classroomId}?tab=${newTab}`, {
        scroll: false,
      });
    },
    [router, classroomId]
  );

  useEffect(() => {
    if (tabFromUrl && ["random", "classroom", "data"].includes(tabFromUrl)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Loading state
  if (isLoadingClassroom) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">
          Đang tải thông tin lớp học...
        </span>
      </div>
    );
  }

  // Error state
  if (classroomError || !classroom) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center">
        <Users className="mb-4 h-16 w-16 text-gray-300" />
        <p className="mb-4 text-gray-500">Không tìm thấy lớp học</p>
        <Button onClick={() => router.push("/dashboard/classroom")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ActionButton
        isBack
        href="/dashboard/classroom"
        label="Quay lại danh sách lớp học"
      />

      <div className="mt-2 border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center">
              <Image
                src="/images/util/classroom.svg"
                alt="Classroom Icon"
                width={40}
                height={40}
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {classroom.name}{" "}
                {classroom.school_year && (
                  <span className="font-normal text-gray-500">
                    {classroom.school_year}
                  </span>
                )}
              </h1>
              <p className="text-sm text-gray-500">
                {classroom.student_count || uiStudents.length} học sinh
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-8xl py-6">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger
              value="random"
              className="flex items-center gap-2 rounded-md transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Shuffle className="h-4 w-4" />
              Random Học Sinh
            </TabsTrigger>
            <TabsTrigger
              value="classroom"
              className="flex items-center gap-2 rounded-md transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <School className="h-4 w-4" />
              Giao Diện Lớp Học
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="flex items-center gap-2 rounded-md transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Dữ Liệu Học Sinh
            </TabsTrigger>
          </TabsList>

          <TabsContent value="random" className="mt-6">
            <RandomTab
              classrooms={allClassrooms}
              students={uiStudents}
              currentClassroom={currentClassroom}
              randomHistory={randomHistory}
              onAddHistory={handleAddHistory}
            />
          </TabsContent>

          <TabsContent value="classroom" className="mt-6">
            <ClassroomTab
              classrooms={allClassrooms}
              selectedClassId={selectedClassId}
              selectedSubject={selectedSubject}
              sessionStatus={sessionStatus}
              seatingChart={seatingChart}
              classroomStats={classroomStats}
              selectedStudent={selectedStudent}
              selectedClass={selectedClass}
              onClassChange={handleClassChange}
              onSubjectChange={handleSubjectChange}
              onStartSession={handleStartSession}
              onEndSession={handleEndSession}
              onStudentClick={handleStudentClick}
            />
          </TabsContent>

          <TabsContent value="data" className="mt-6">
            <DataTab
              classrooms={allClassrooms}
              students={
                selectedClassId === classroomId || !selectedClassId
                  ? uiStudents
                  : dataStudents
              }
              selectedClassId={selectedClassId || classroomId}
              studentDetail={studentDetail}
              onClassChange={(id) => setSelectedClassId(id)}
              onStudentClick={handleStudentRowClick}
              onCloseStudentDetail={handleCloseStudentDetail}
              onSaveNote={handleSaveNote}
              onAddStudent={() => setShowAddStudentModal(true)}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <EndSessionDialog
        open={showEndSessionDialog}
        onOpenChange={setShowEndSessionDialog}
        onConfirm={handleConfirmEndSession}
        topStudent={classroomStats?.topActiveStudents[0]}
      />

      <AddStudentModal
        open={showAddStudentModal}
        onOpenChange={setShowAddStudentModal}
        classroomId={classroomId}
      />
    </div>
  );
}
