/**
 * History record management
 * Use localStorage to save history records locally
 */

export interface HistoryItem {
  id: string;
  timestamp: number;
  originalText: string;
  humanizedText: string;
  processingTime: number;
  params: {
    length: string;
    similarity: string;
    style: string;
    customStyle?: string;
  };
  mode: "text" | "document";
  fileName?: string;
}

const HISTORY_KEY = "humanizer_history";
const MAX_HISTORY_ITEMS = 50; // Save at most 50 records

/**
 * Get all history records
 */
export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    if (!data) return [];
    
    const history = JSON.parse(data);
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.error("Failed to load history:", error);
    return [];
  }
}

/**
 * Add new history record
 */
export function addHistoryItem(item: Omit<HistoryItem, "id" | "timestamp">): HistoryItem {
  const newItem: HistoryItem = {
    ...item,
    id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  };

  const history = getHistory();
  history.unshift(newItem); // Add to the beginning

  // Limit history record count
  const limitedHistory = history.slice(0, MAX_HISTORY_ITEMS);
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
    console.log("History saved:", newItem.id);
  } catch (error) {
    console.error("Failed to save history:", error);
  }

  return newItem;
}

/**
 * Delete specified history record
 */
export function deleteHistoryItem(id: string): void {
  const history = getHistory();
  const filtered = history.filter((item) => item.id !== id);
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    console.log("History item deleted:", id);
  } catch (error) {
    console.error("Failed to delete history item:", error);
  }
}

/**
 * Clear all history records
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
    console.log("All history cleared");
  } catch (error) {
    console.error("Failed to clear history:", error);
  }
}

/**
 * Get single history record
 */
export function getHistoryItem(id: string): HistoryItem | null {
  const history = getHistory();
  return history.find((item) => item.id === id) || null;
}

/**
 * Export history records as JSON file
 */
export function exportHistoryToJSON(): void {
  const history = getHistory();
  const dataStr = JSON.stringify(history, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `humanizer-history-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import history records from JSON file
 */
export function importHistoryFromJSON(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedHistory: HistoryItem[] = JSON.parse(content);
        
        if (!Array.isArray(importedHistory)) {
          throw new Error("Invalid history format");
        }

        const currentHistory = getHistory();
        const mergedHistory = [...importedHistory, ...currentHistory];
        
        // Remove duplicates (based on timestamp and original text)
        const uniqueHistory = mergedHistory.filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.timestamp === item.timestamp &&
                t.originalText === item.originalText
            )
        );

        // Limit count
        const limitedHistory = uniqueHistory.slice(0, MAX_HISTORY_ITEMS);
        
        localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
        resolve(importedHistory.length);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

/**
 * Get history record statistics
 */
export function getHistoryStats() {
  const history = getHistory();
  
  return {
    total: history.length,
    totalCharactersProcessed: history.reduce(
      (sum, item) => sum + item.originalText.length,
      0
    ),
    totalProcessingTime: history.reduce(
      (sum, item) => sum + item.processingTime,
      0
    ),
    averageProcessingTime:
      history.length > 0
        ? history.reduce((sum, item) => sum + item.processingTime, 0) /
          history.length
        : 0,
  };
}

