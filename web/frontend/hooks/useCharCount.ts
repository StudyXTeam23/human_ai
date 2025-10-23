/**
 * Hook for character counting with validation
 */
import { useMemo } from "react";

interface UseCharCountResult {
  count: number;
  isValid: boolean;
  isTooShort: boolean;
  isTooLong: boolean;
}

export function useCharCount(text: string): UseCharCountResult {
  const count = useMemo(() => {
    // Use string length instead of byte length for consistency
    return text.length;
  }, [text]);

  const isValid = count >= 300 && count <= 5000;
  const isTooShort = count > 0 && count < 300;
  const isTooLong = count > 5000;

  return {
    count,
    isValid,
    isTooShort,
    isTooLong,
  };
}

