"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addHistoryItem, getHistory } from "@/lib/history";
import { useState } from "react";

export default function TestHistoryPage() {
  const [result, setResult] = useState<string>("");

  const testAddHistory = () => {
    try {
      console.log("Testing addHistoryItem...");
      
      const item = addHistoryItem({
        originalText: "This is a test text for testing the history record functionality.".repeat(10),
        humanizedText: "This is a test text for testing the history feature.".repeat(10),
        processingTime: 1500,
        params: {
          length: "Normal",
          similarity: "Moderate",
          style: "Friendly",
        },
        mode: "text",
      });

      console.log("Result:", item);
      setResult(JSON.stringify(item, null, 2));
      
      // Read history records
      const history = getHistory();
      console.log("Total history items:", history.length);
      console.log("Latest item:", history[0]);
      
    } catch (error) {
      console.error("Error:", error);
      setResult(`Error: ${error}`);
    }
  };

  const clearTest = () => {
    localStorage.removeItem("humanizer_history");
    setResult("History cleared");
  };

  const viewHistory = () => {
    const history = getHistory();
    setResult(JSON.stringify(history, null, 2));
  };

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Test History Record Functionality</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testAddHistory}>Test Add History</Button>
            <Button onClick={viewHistory} variant="outline">View History</Button>
            <Button onClick={clearTest} variant="destructive">Clear History</Button>
          </div>

          {result && (
            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
              <pre className="text-xs overflow-auto">{result}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

