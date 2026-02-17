import type { McqQuestion } from "@/lib/api";

export const getAnswersStorageKey = (examId: string) =>
  `exam_${examId}_answers`;

export const getStartedAtStorageKey = (examId: string) =>
  `exam_${examId}_startedAt`;

export const buildInitialAnswers = (list: McqQuestion[]) => {
  const initialAnswers = new Map<string, number | null>();
  list.forEach((q) => {
    initialAnswers.set(q._id, null);
  });
  return initialAnswers;
};

export const saveAnswersToStorage = (
  examId: string,
  answersMap: Map<string, number | null>,
) => {
  const payload: Record<string, number | null> = {};
  answersMap.forEach((value, key) => {
    payload[key] = typeof value === "number" ? value : null;
  });
  localStorage.setItem(getAnswersStorageKey(examId), JSON.stringify(payload));
};

export const loadAnswersFromStorage = (examId: string) => {
  try {
    const raw = localStorage.getItem(getAnswersStorageKey(examId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, number | null>;
    const map = new Map<string, number | null>();
    Object.entries(parsed).forEach(([key, value]) => {
      map.set(key, typeof value === "number" ? value : null);
    });
    return map;
  } catch (error) {
    console.error("Failed to load cached answers:", error);
    return null;
  }
};

export const saveStartedAtToStorage = (examId: string, startedAt: number) => {
  localStorage.setItem(getStartedAtStorageKey(examId), String(startedAt));
};

export const loadStartedAtFromStorage = (examId: string) => {
  const raw = localStorage.getItem(getStartedAtStorageKey(examId));
  const value = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(value) ? value : null;
};

export const clearExamCache = (examId: string) => {
  localStorage.removeItem(getAnswersStorageKey(examId));
  localStorage.removeItem(getStartedAtStorageKey(examId));
  localStorage.removeItem(`exam_${examId}_code`);
};
