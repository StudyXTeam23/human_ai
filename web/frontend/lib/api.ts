/**
 * API client for backend communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:18201";

interface HumanizeRequest {
  source: {
    mode: "text" | "document";
    text: string;
  };
  params: {
    length: string;
    similarity: string;
    style: string;
    customStyle?: string;
  };
}

interface HumanizeFileRequest {
  file_path: string;
  text: string;
  params: {
    length: string;
    similarity: string;
    style: string;
    customStyle?: string;
  };
}

interface HumanizeResponse {
  content: string;
  chars: number;
  processingTime: number;
}

/**
 * Humanize text (for text mode)
 */
export async function humanizeText(
  request: HumanizeRequest
): Promise<HumanizeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/humanize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to humanize text");
  }

  return response.json();
}

/**
 * Humanize file (for document mode)
 */
export async function humanizeFile(
  request: HumanizeFileRequest
): Promise<HumanizeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/humanize-file`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to humanize file");
  }

  return response.json();
}

/**
 * Upload file and extract text
 */
export async function uploadFile(file: File): Promise<{
  filename: string;
  text: string;
  base64: string;
  size: string;
  chars: string;
  file_path?: string;
}> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/v1/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to upload file");
  }

  return response.json();
}
