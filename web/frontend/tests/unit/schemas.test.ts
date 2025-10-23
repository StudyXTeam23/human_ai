/**
 * Unit tests for Zod schemas
 */
import { describe, it, expect } from "vitest";
import { humanizeSchema, validateFile } from "@/schemas/humanize";

describe("humanizeSchema", () => {
  it("should validate text mode with valid input", () => {
    const validData = {
      mode: "text" as const,
      text: "a".repeat(300),
      length: "Normal" as const,
      similarity: "Moderate" as const,
      style: "Neutral" as const,
    };

    const result = humanizeSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject text < 300 chars", () => {
    const invalidData = {
      mode: "text" as const,
      text: "short text",
      length: "Normal" as const,
      similarity: "Moderate" as const,
      style: "Neutral" as const,
    };

    const result = humanizeSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject text > 5000 chars", () => {
    const invalidData = {
      mode: "text" as const,
      text: "a".repeat(5001),
      length: "Normal" as const,
      similarity: "Moderate" as const,
      style: "Neutral" as const,
    };

    const result = humanizeSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should require customStyle when style is Custom", () => {
    const invalidData = {
      mode: "text" as const,
      text: "a".repeat(300),
      length: "Normal" as const,
      similarity: "Moderate" as const,
      style: "Custom" as const,
    };

    const result = humanizeSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should accept customStyle when style is Custom", () => {
    const validData = {
      mode: "text" as const,
      text: "a".repeat(300),
      length: "Normal" as const,
      similarity: "Moderate" as const,
      style: "Custom" as const,
      customStyle: "Professional and concise",
    };

    const result = humanizeSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

describe("validateFile", () => {
  it("should accept valid PDF file", () => {
    const file = new File(["content"], "test.pdf", { type: "application/pdf" });
    const result = validateFile(file);
    expect(result.valid).toBe(true);
  });

  it("should reject file > 40MB", () => {
    const largeContent = new Array(41 * 1024 * 1024).fill("a").join("");
    const file = new File([largeContent], "large.pdf", { type: "application/pdf" });
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("40MB");
  });

  it("should reject invalid file type", () => {
    const file = new File(["content"], "test.exe", { type: "application/x-msdownload" });
    const result = validateFile(file);
    expect(result.valid).toBe(false);
  });
});

