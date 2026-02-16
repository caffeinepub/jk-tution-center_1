import { useEffect, useState } from 'react';

/**
 * Hook to convert image bytes (Uint8Array) into a browser-renderable object URL.
 * Automatically revokes the URL on cleanup to prevent memory leaks.
 * Returns empty string for empty/undefined bytes to support fallback avatars.
 */
export function useByteImageObjectUrl(imageBytes: Uint8Array | undefined): string {
  const [objectUrl, setObjectUrl] = useState<string>('');

  useEffect(() => {
    // If no image bytes or empty array, clear the URL
    if (!imageBytes || imageBytes.length === 0) {
      setObjectUrl('');
      return;
    }

    // Create blob and object URL
    const bytes = new Uint8Array(imageBytes);
    const blob = new Blob([bytes], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    setObjectUrl(url);

    // Cleanup: revoke object URL when component unmounts or imageBytes change
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageBytes]);

  return objectUrl;
}
