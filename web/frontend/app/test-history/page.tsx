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
        originalText: "这是一段测试文本，用于测试历史记录功能。".repeat(10),
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
      
      // 读取历史记录
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
          <CardTitle>测试历史记录功能</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testAddHistory}>测试添加历史</Button>
            <Button onClick={viewHistory} variant="outline">查看历史</Button>
            <Button onClick={clearTest} variant="destructive">清空历史</Button>
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

