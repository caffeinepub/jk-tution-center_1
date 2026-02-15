import { useEffect, useState } from 'react';

/**
 * Hook to convert logo bytes (Uint8Array) into a browser-renderable object URL.
 * Automatically revokes the URL on cleanup to prevent memory leaks.
 */
export function useLogoObjectUrl(logoBytes: Uint8Array | undefined): string | null {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    // If no logo bytes or empty array, clear the URL
    if (!logoBytes || logoBytes.length === 0) {
      setObjectUrl(null);
      return;
    }

    // Create blob and object URL
    // Convert to a new Uint8Array to ensure proper typing
    const bytes = new Uint8Array(logoBytes);
    const blob = new Blob([bytes], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    setObjectUrl(url);

    // Cleanup: revoke object URL when component unmounts or logoBytes change
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [logoBytes]);

  return objectUrl;
}
