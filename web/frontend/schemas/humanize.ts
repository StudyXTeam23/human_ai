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
      required_error: "Please select input mode",
    }),
    text: z.string().min(1, "Text cannot be empty"),
    file: z.instanceof(File).optional(),
    length: z.enum(["Normal", "Concise", "Expanded"], {
      required_error: "Please select length option",
    }),
    similarity: z.enum(["Low", "Moderate", "High", "Neutral"], {
      required_error: "Please select similarity option",
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
        required_error: "Please select style option",
      }
    ),
    customStyle: z.string().max(120, "Custom style description up to 120 characters").optional(),
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
      message: "Text mode requires 300-5000 characters",
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
      message: "Please provide custom style description",
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
    return { valid: false, error: "File size exceeds 40MB" };
  }

  // Check file type by extension (more reliable than MIME type)
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

  if (!hasValidExtension && !ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Unsupported file format, only supports PDF, Word, PowerPoint and TXT" };
  }

  return { valid: true };
}

