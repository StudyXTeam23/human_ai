/**
 * Zod validation schemas for form data
 */
import { z } from "zod";

/**
 * Main humanize form schema
 */
export const humanizeSchema = z
  .object({
    mode: z.enum(["text", "document"], {
      required_error: "请选择输入模式",
    }),
    text: z.string().min(1, "文本不能为空"),
    file: z.instanceof(File).optional(),
    length: z.enum(["Normal", "Concise", "Expanded"], {
      required_error: "请选择长度选项",
    }),
    similarity: z.enum(["Low", "Moderate", "High", "Neutral"], {
      required_error: "请选择相似度选项",
    }),
    style: z.enum(
      [
        "Neutral",
        "Academic",
        "Business",
        "Creative",
        "Technical",
        "Friendly",
        "Informal",
        "Reference",
        "Custom",
      ],
      {
        required_error: "请选择风格选项",
      }
    ),
    customStyle: z.string().max(120, "自定义风格描述最多 120 个字符").optional(),
  })
  .refine(
    (data) => {
      // Only validate text length for text mode, not document mode
      if (data.mode === "text") {
        return data.text.length >= 300 && data.text.length <= 5000;
      }
      // For document mode, just need text to exist
      return data.text.length > 0;
    },
    {
      message: "文本模式需要 300-5000 个字符",
      path: ["text"],
    }
  )
  .refine(
    (data) => {
      // If style is Custom, customStyle must be provided
      if (data.style === "Custom") {
        return !!data.customStyle && data.customStyle.length > 0;
      }
      return true;
    },
    {
      message: "请提供自定义风格描述",
      path: ["customStyle"],
    }
  );

export type HumanizeFormData = z.infer<typeof humanizeSchema>;

/**
 * Helper function to validate file
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 40 * 1024 * 1024; // 40MB
  const ALLOWED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-powerpoint",
    "text/plain",
  ];

  const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".doc", ".pptx", ".ppt", ".txt"];

  // Check file size
  if (file.size > MAX_SIZE) {
    return { valid: false, error: "文件大小超过 40MB" };
  }

  // Check file type by extension (more reliable than MIME type)
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

  if (!hasValidExtension && !ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "不支持的文件格式,仅支持 PDF、Word、PowerPoint 和 TXT" };
  }

  return { valid: true };
}

