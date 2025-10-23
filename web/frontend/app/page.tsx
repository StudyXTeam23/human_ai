"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { humanizeSchema, type HumanizeFormData } from "@/schemas/humanize";
import { humanizeText, humanizeFile } from "@/lib/api";
import { addHistoryItem as addToHistoryStore } from "@/lib/storage";
import { addHistoryItem } from "@/lib/history";
import { useCharCount } from "@/hooks/useCharCount";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Loader2, Copy, Download } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";

export default function Home() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [inputMode, setInputMode] = useState<"text" | "document">("text");
  const [fileBase64, setFileBase64] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<HumanizeFormData>({
    resolver: zodResolver(humanizeSchema),
    defaultValues: {
      mode: "text",
      text: "",
      length: "Normal",
      similarity: "Moderate",
      style: "Neutral",
    },
  });

  const text = watch("text");
  const style = watch("style");
  const { count, isTooShort, isTooLong } = useCharCount(text);

  const handleFileProcessed = (text: string, base64: string, filename: string, filepath?: string) => {
    console.log("File processed:", { textLength: text.length, filename, filepath });
    setValue("text", text);
    setValue("mode", "document");
    setFileBase64(base64);
    setFileName(filename);
    if (filepath) {
      setFilePath(filepath);
    }
  };

  const onSubmit = async (data: HumanizeFormData) => {
    console.log("Form submitted:", {
      mode: data.mode,
      textLength: data.text.length,
      count,
      isTooShort,
      isTooLong,
      filePath,
    });
    
    setIsLoading(true);
    setResult("");

    try {
      let response;
      
      // Use different API endpoint based on mode
      if (data.mode === "document" && filePath) {
        // For document mode, use the file-specific endpoint
        console.log("Calling humanize-file API with file path:", filePath);
        response = await humanizeFile({
          file_path: filePath,
          text: data.text,
          params: {
            length: data.length,
            similarity: data.similarity,
            style: data.style,
            customStyle: data.customStyle,
          },
        });
      } else {
        // For text mode, use the regular endpoint
        console.log("Calling humanize API for text mode");
        response = await humanizeText({
          source: {
            mode: data.mode,
            text: data.text,
          },
          params: {
            length: data.length,
            similarity: data.similarity,
            style: data.style,
            customStyle: data.customStyle,
          },
        });
      }

      setResult(response.content);

      // Save to history store (旧的历史记录系统)
      addToHistoryStore({
        preview: data.text.substring(0, 100),
        fullText: data.text,
        outputText: response.content,
        timestamp: Date.now(),
        params: {
          length: data.length,
          similarity: data.similarity,
          style: data.style,
          customStyle: data.customStyle,
        },
      });

      // 保存到本地 JSON 历史记录 (新的历史记录系统)
      try {
        const historyItem = addHistoryItem({
          originalText: data.text,
          humanizedText: response.content,
          processingTime: response.processingTime,
          params: {
            length: data.length,
            similarity: data.similarity,
            style: data.style,
            customStyle: data.customStyle,
          },
          mode: data.mode,
          fileName: data.mode === "document" ? fileName : undefined,
        });

        console.log("History saved:", historyItem?.id || "no-id");
      } catch (historyError) {
        console.error("Failed to save history:", historyError);
      }

      // 保存数据到 localStorage 用于结果页面显示
      localStorage.setItem("originalText", data.text);
      localStorage.setItem("humanizedText", response.content);
      localStorage.setItem("processingTime", response.processingTime.toString());

      toast({
        title: "成功",
        description: inputMode === "document" 
          ? `文档 "${fileName}" 已成功处理`
          : "文本已成功人性化处理",
      });

      // 跳转到结果页面
      setTimeout(() => {
        window.location.href = "/result";
      }, 500);
    } catch (error) {
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "处理失败",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast({
        title: "已复制",
        description: "内容已复制到剪贴板",
      });
    } catch {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      });
    }
  };

  const downloadTxt = () => {
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `humanized_text_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Free AI Humanizer – 100% Human-Written Quality
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            AI Humanizer quickly converts your content into natural, human-like content
          </p>
        </div>

        {/* Main Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Tabs */}
              <Tabs value={inputMode} onValueChange={(v) => {
                setInputMode(v as "text" | "document");
                setValue("mode", v as "text" | "document");
              }}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="document">Document</TabsTrigger>
                </TabsList>

                <TabsContent value="text">
                  <div className="space-y-2">
                    <Textarea
                      {...register("text")}
                      placeholder="Enter your AI-generated text here (minimum 300 characters)..."
                      className="min-h-[200px] resize-none"
                    />
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        {isTooShort && (
                          <span className="text-red-500">最少需要 300 个字符</span>
                        )}
                        {isTooLong && (
                          <span className="text-red-500">最多支持 5000 个字符</span>
                        )}
                      </div>
                      <span
                        className={
                          isTooShort || isTooLong ? "text-red-500" : "text-slate-500"
                        }
                      >
                        {count}/5000
                      </span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="document">
                  <FileUpload
                    onFileProcessed={handleFileProcessed}
                    disabled={isLoading}
                  />
                  {text && inputMode === "document" && (
                    <div className="mt-4 space-y-2">
                      <Label>提取的文本预览</Label>
                      <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900 max-h-[200px] overflow-y-auto">
                        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                          {text.substring(0, 500)}
                          {text.length > 500 && "..."}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">
                          已提取 {count} 个字符 (文件模式无长度限制)
                        </span>
                        {fileName && (
                          <span className="text-slate-500">
                            文件: {fileName}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="space-y-2">
                  <Label>Length</Label>
                  <Select
                    value={watch("length")}
                    onValueChange={(v) => setValue("length", v as "Normal" | "Concise" | "Expanded")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Concise">Concise</SelectItem>
                      <SelectItem value="Expanded">Expanded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Similarity</Label>
                  <Select
                    value={watch("similarity")}
                    onValueChange={(v) => setValue("similarity", v as "Low" | "Moderate" | "High" | "Neutral")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Neutral">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Style</Label>
                  <Select
                    value={watch("style")}
                    onValueChange={(v) => setValue("style", v as "Neutral" | "Academic" | "Business" | "Creative" | "Technical" | "Friendly" | "Informal" | "Custom")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Neutral">Neutral</SelectItem>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Creative">Creative</SelectItem>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Friendly">Friendly</SelectItem>
                      <SelectItem value="Informal">Informal</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Custom Style Input */}
              {style === "Custom" && (
                <div className="mt-4 space-y-2">
                  <Label>Custom Style Description</Label>
                  <Input
                    {...register("customStyle")}
                    placeholder="Describe your desired style (max 120 characters)"
                    maxLength={120}
                  />
                  {errors.customStyle && (
                    <p className="text-sm text-red-500">{errors.customStyle.message}</p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <Button 
                  type="submit" 
                  disabled={
                    isLoading || 
                    !text || 
                    (inputMode === "text" && (isTooShort || isTooLong))
                  } 
                  className="flex-1"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Humanize
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setValue("text", "");
                    setResult("");
                    setFileBase64("");
                    setFileName("");
                    setFilePath("");
                  }}
                >
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Humanized Result</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadTxt}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{result}</p>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {result.length} characters
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-slate-500">
          <p>
            免责声明: 本工具仅用于演示目的。请合法、合规使用,遵守学术诚信和职业道德。
          </p>
        </div>
      </div>

      <Toaster />
    </main>
  );
}
