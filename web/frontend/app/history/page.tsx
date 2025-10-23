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
    // 保存到 localStorage 用于结果页面显示
    localStorage.setItem("originalText", item.originalText);
    localStorage.setItem("humanizedText", item.humanizedText);
    localStorage.setItem("processingTime", item.processingTime.toString());
    
    // 跳转到结果页面
    router.push("/result");
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这条记录吗?")) {
      deleteHistoryItem(id);
      loadHistory();
      toast({
        title: "已删除",
        description: "历史记录已删除",
      });
    }
  };

  const handleClearAll = () => {
    if (confirm(`确定要清除所有 ${history.length} 条历史记录吗?此操作不可恢复!`)) {
      clearHistory();
      loadHistory();
      toast({
        title: "已清除",
        description: "所有历史记录已清除",
      });
    }
  };

  const handleExport = () => {
    exportHistoryToJSON();
    toast({
      title: "导出成功",
      description: "历史记录已导出为 JSON 文件",
    });
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const count = await importHistoryFromJSON(file);
      loadHistory();
      toast({
        title: "导入成功",
        description: `已导入 ${count} 条历史记录`,
      });
    } catch (error) {
      toast({
        title: "导入失败",
        description: error instanceof Error ? error.message : "无法读取文件",
        variant: "destructive",
      });
    }
    
    // 重置 input
    event.target.value = "";
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("zh-CN", {
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
                <h1 className="text-xl font-bold">历史记录</h1>
                <p className="text-sm text-slate-500">
                  共 {stats.total} 条记录
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                导出
              </Button>
              <label>
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    导入
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
                  清空
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
            <div className="text-sm text-slate-500">总记录数</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-slate-500">处理字符数</div>
            <div className="text-2xl font-bold">
              {stats.totalCharactersProcessed.toLocaleString()}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-slate-500">总处理时间</div>
            <div className="text-2xl font-bold">
              {formatTime(stats.totalProcessingTime)}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-slate-500">平均处理时间</div>
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
            <h3 className="text-lg font-semibold mb-2">暂无历史记录</h3>
            <p className="text-slate-500 mb-4">
              处理文本后会自动保存历史记录
            </p>
            <Button onClick={() => router.push("/")}>
              开始处理文本
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

