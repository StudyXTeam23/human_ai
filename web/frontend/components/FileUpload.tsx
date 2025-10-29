"use client";

import { useState, useRef, DragEvent } from "react";
import { Upload, File, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/lib/api";

interface FileUploadProps {
  onFileProcessed: (text: string, base64: string, filename: string, filepath?: string) => void;
  disabled?: boolean;
}

export function FileUpload({ onFileProcessed, disabled }: FileUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    // Validate file type
    const allowedExtensions = [".pdf", ".docx", ".pptx", ".txt"];
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      toast({
        title: "Unsupported file type",
        description: "Please upload PDF, DOCX, PPTX or TXT files",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (40MB)
    const maxSize = 40 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "File size must not exceed 40MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Upload file to backend (using getApiUrl to avoid mixed content)
      const response = await fetch(getApiUrl('UPLOAD'), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "File upload failed");
      }

      const data = await response.json();

      // Update uploaded file state
      setUploadedFile({
        name: file.name,
        size: file.size,
      });

      // Call parent callback with extracted text, base64, and file path
      onFileProcessed(data.text, data.base64, file.name, data.file_path);

      toast({
        title: "File uploaded successfully",
        description: `Extracted ${data.chars} characters`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "File upload failed",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-4">
      <div
        className={`
          border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer
          ${isDragging ? "border-primary bg-primary/5" : "border-slate-300 dark:border-slate-700"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-900"}
          ${isUploading ? "pointer-events-none" : ""}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.pptx,.txt"
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-slate-600 dark:text-slate-400">Uploading and processing file...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Upload className="h-12 w-12 text-slate-400" />
            <div>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-2">
                Click or drag file to upload
              </p>
              <p className="text-sm text-slate-500">
                Supports PDF, DOCX, PPTX, TXT (max 40MB)
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" disabled={disabled}>
              Select File
            </Button>
          </div>
        )}
      </div>

      {uploadedFile && (
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <div className="flex items-center gap-3">
            <File className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {uploadedFile.name}
              </p>
              <p className="text-xs text-slate-500">
                {formatFileSize(uploadedFile.size)}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

