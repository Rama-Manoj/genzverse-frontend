import { API_BASE_URL } from '../api/client';

/**
 * Resolves a file URL or filename returned by the backend to a fully qualified URL
 * suitable for image src attributes. Handles local dev proxy relative paths as well
 * as production absolute paths.
 * 
 * @param urlOrFilename The URL or filename to resolve
 * @returns Fully qualified or relative download URL, or empty string if falsy
 */
export const getImageUrl = (urlOrFilename?: string): string => {
  if (!urlOrFilename) return '';

  // If it's already a full URL or data URI, return as-is
  if (
    urlOrFilename.startsWith('data:') ||
    urlOrFilename.startsWith('http://') ||
    urlOrFilename.startsWith('https://')
  ) {
    return urlOrFilename;
  }

  // Clean the "File uploaded: " prefix from the backend response if present
  let filename = urlOrFilename;
  if (filename.includes('File uploaded: ')) {
    filename = filename.replace('File uploaded: ', '').trim();
  }

  // If the cleaned filename is empty or somehow became empty
  if (!filename) return '';

  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${base}/api/files/download/${filename}`;
};
