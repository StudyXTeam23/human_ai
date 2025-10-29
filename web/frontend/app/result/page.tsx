"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Copy, Download, Check, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [originalText, setOriginalText] = useState("");
  const [humanizedText, setHumanizedText] = useState("");
  const [processingTime, setProcessingTime] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const original = localStorage.getItem("originalText") || "";
    const humanized = localStorage.getItem("humanizedText") || "";
    const time = localStorage.getItem("processingTime") || "0";

    console.log("Loading data from localStorage:", {
      original: original.substring(0, 50),
      humanized: humanized.substring(0, 50),
      time
    });

    setOriginalText(original);
    setHumanizedText(humanized);
    setProcessingTime(parseInt(time));

    // Don't clear localStorage immediately, so data can be seen on page refresh
  }, [searchParams]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(humanizedText);
      setCopied(true);
        toast({
          title: "Copied",
          description: "Humanized text copied to clipboard",
        });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    } // Remove unused catch parameter
  };

  const handleDownload = () => {
    const blob = new Blob([humanizedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `humanized-text-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download successful",
      description: "File saved to local",
    });
  };

  const handleBack = () => {
    router.push("/");
  };

  const handleViewHistory = () => {
    router.push("/history");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">AI Text Humanizer</h1>
                <p className="text-sm text-slate-500">
                  Processing complete · {processingTime}ms
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleViewHistory}>
                <History className="mr-2 h-4 w-4" />
                History
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
          {/* Left Panel - Original Text */}
          <Card className="flex flex-col overflow-hidden">
            <div className="border-b bg-slate-50 dark:bg-slate-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Original Text</h2>
                <span className="text-sm text-slate-500">
                  {originalText.length} chars
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 leading-relaxed">
                  {originalText || "No original text"}
                </pre>
              </div>
            </div>
          </Card>

          {/* Right Panel - Humanized Text */}
          <Card className="flex flex-col overflow-hidden border-2 border-blue-200 dark:border-blue-800">
            <div className="border-b bg-blue-50 dark:bg-blue-950 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  Humanized Text
                </h2>
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  {humanizedText.length} chars
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900">
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 leading-relaxed">
                  {humanizedText || "No processed result"}
                </pre>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Footer */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-sm text-slate-500">Original Length</div>
            <div className="text-2xl font-bold">{originalText.length}</div>
            <div className="text-xs text-slate-400">chars</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-slate-500">Processed Length</div>
            <div className="text-2xl font-bold">{humanizedText.length}</div>
            <div className="text-xs text-slate-400">chars</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-slate-500">Processing Time</div>
            <div className="text-2xl font-bold">{processingTime}</div>
            <div className="text-xs text-slate-400">ms</div>
          </Card>
        </div>
      </main>
    </div>
  );
}

// Use Suspense to wrap component to support useSearchParams
export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400">Loading results...</p>
        </div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
