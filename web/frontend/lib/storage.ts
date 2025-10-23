/**
 * LocalStorage management for history
 */
import type { HistoryItem } from "@/types";

const HISTORY_KEY = "humanize_history";
const MAX_HISTORY_ITEMS = 3;

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveHistory(items: HistoryItem[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save history:", error);
  }
}

export function addHistoryItem(item: Omit<HistoryItem, "id">): void {
  const history = getHistory();
  const newItem: HistoryItem = {
    ...item,
    id: Date.now().toString(),
  };

  const newHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
  saveHistory(newHistory);
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}

