import { SessionStatus } from "@/types/classroom";
import type { LocalClassSession } from "@/types/classroom";

const STORAGE_KEY = "edutech_class_session";

/**
 * Service for managing class session in localStorage
 */
export const SessionStorageService = {
  /**
   * Get current active session
   */
  getSession(): LocalClassSession | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data) as LocalClassSession;
    } catch (error) {
      console.error("Error reading session from localStorage:", error);
      return null;
    }
  },

  /**
   * Start a new session
   */
  startSession(
    classroomId: string,
    classroomName: string,
    subject: string
  ): LocalClassSession {
    const session: LocalClassSession = {
      id: `session_${Date.now()}`,
      classroomId,
      classroomName,
      subject,
      startTime: new Date().toISOString(),
      status: SessionStatus.IN_PROGRESS,
      handRaises: {},
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      console.error("Error saving session to localStorage:", error);
    }

    return session;
  },

  /**
   * End current session
   */
  endSession(): LocalClassSession | null {
    const session = this.getSession();
    if (!session) return null;

    session.endTime = new Date().toISOString();
    session.status = SessionStatus.ENDED;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      console.error("Error updating session in localStorage:", error);
    }

    return session;
  },

  /**
   * Clear session from storage
   */
  clearSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing session from localStorage:", error);
    }
  },

  /**
   * Increment hand raise count for a student
   */
  incrementHandRaise(studentId: string): LocalClassSession | null {
    const session = this.getSession();
    if (!session || session.status !== SessionStatus.IN_PROGRESS) return null;

    session.handRaises[studentId] = (session.handRaises[studentId] || 0) + 1;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      console.error("Error updating hand raise in localStorage:", error);
    }

    return session;
  },

  /**
   * Decrement hand raise count for a student
   */
  decrementHandRaise(studentId: string): LocalClassSession | null {
    const session = this.getSession();
    if (!session || session.status !== SessionStatus.IN_PROGRESS) return null;

    const current = session.handRaises[studentId] || 0;
    if (current > 0) {
      session.handRaises[studentId] = current - 1;
      if (session.handRaises[studentId] === 0) {
        delete session.handRaises[studentId];
      }
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      console.error("Error updating hand raise in localStorage:", error);
    }

    return session;
  },

  /**
   * Get hand raise count for a student
   */
  getHandRaiseCount(studentId: string): number {
    const session = this.getSession();
    if (!session) return 0;
    return session.handRaises[studentId] || 0;
  },

  /**
   * Get all hand raises as array for batch update
   */
  getHandRaisesForBatch(): Array<{ student_id: string; add_count: number }> {
    const session = this.getSession();
    if (!session) return [];

    return Object.entries(session.handRaises)
      .filter(([, count]) => count > 0)
      .map(([studentId, count]) => ({
        student_id: studentId,
        add_count: count,
      }));
  },

  /**
   * Check if there's an active session
   */
  hasActiveSession(): boolean {
    const session = this.getSession();
    return session !== null && session.status === SessionStatus.IN_PROGRESS;
  },

  /**
   * Update session data
   */
  updateSession(updates: Partial<LocalClassSession>): LocalClassSession | null {
    const session = this.getSession();
    if (!session) return null;

    const updatedSession = { ...session, ...updates };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
    } catch (error) {
      console.error("Error updating session in localStorage:", error);
    }

    return updatedSession;
  },
};
