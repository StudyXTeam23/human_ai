"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Download,
  Upload,
  Trash2,
  Eye,
  Calendar,
  Clock,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getHistory,
  deleteHistoryItem,
  clearHistory,
  exportHistoryToJSON,
  importHistoryFromJSON,
  getHistoryStats,
  type HistoryItem,
} from "@/lib/history";

export default function HistoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    totalCharactersProcessed: 0,
    totalProcessingTime: 0,
    averageProcessingTime: 0,
  });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const items = getHistory();
    setHistory(items);
    setStats(getHistoryStats());
  };

  const handleView = (item: HistoryItem) => {
    // Save to localStorage for result page display
    localStorage.setItem("originalText", item.originalText);
    localStorage.setItem("humanizedText", item.humanizedText);
    localStorage.setItem("processingTime", item.processingTime.toString());
    
    // Navigate to result page
    router.push("/result");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      deleteHistoryItem(id);
      loadHistory();
      toast({
        title: "Deleted",
        description: "History record deleted",
      });
    }
  };

  const handleClearAll = () => {
    if (confirm(`Are you sure you want to clear all ${history.length} history records? This action cannot be undone!`)) {
      clearHistory();
      loadHistory();
      toast({
        title: "Cleared",
        description: "All history records cleared",
      });
    }
  };

  const handleExport = () => {
    exportHistoryToJSON();
    toast({
      title: "Export successful",
      description: "History records exported to JSON file",
    });
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const count = await importHistoryFromJSON(file);
      loadHistory();
      toast({
        title: "Import successful",
        description: `Imported ${count} history records`,
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Unable to read file",
        variant: "destructive",
      });
    }
    
    // Reset input
    event.target.value = "";
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">History</h1>
                <p className="text-sm text-slate-500">
                  Total {stats.total} records
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <label>
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              {history.length > 0 && (
                <Button variant="destructive" size="sm" onClick={handleClearAll}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-slate-500">Total Records</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-slate-500">Characters Processed</div>
            <div className="text-2xl font-bold">
              {stats.totalCharactersProcessed.toLocaleString()}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-slate-500">Total Processing Time</div>
            <div className="text-2xl font-bold">
              {formatTime(stats.totalProcessingTime)}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-slate-500">Avg Processing Time</div>
            <div className="text-2xl font-bold">
              {formatTime(Math.round(stats.averageProcessingTime))}
            </div>
          </Card>
        </div>
      </div>

      {/* History List */}
      <main className="container mx-auto px-4 pb-8">
        {history.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No history records</h3>
            <p className="text-slate-500 mb-4">
              History records are automatically saved after processing text
            </p>
            <Button onClick={() => router.push("/")}>
              Start Processing Text
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Calendar className="h-4 w-4" />
                        {formatDate(item.timestamp)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Clock className="h-4 w-4" />
                        {formatTime(item.processingTime)}
                      </div>
                      {item.mode === "document" && item.fileName && (
                        <span className="text-sm text-blue-600 dark:text-blue-400">
                          📄 {item.fileName}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-slate-700 dark:text-slate-300 line-clamp-2 mb-2">
                      {item.originalText}
                    </p>
                    
                    <div className="flex gap-2 text-xs text-slate-500">
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                        {item.params.length}
                      </span>
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                        {item.params.similarity}
                      </span>
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                        {item.params.style}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(item)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

