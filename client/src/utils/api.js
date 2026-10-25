/**
 * API Utility Configuration & Response Handler
 * Ensures robust communication with the backend in both development and production.
 */

// Determine API Base URL:
// 1. If VITE_API_URL is set in environment (e.g., Render Static Site config), use it.
// 2. In production, fallback to the deployed Render backend URL.
// 3. In development, default to empty string '' so Vite's proxy (/api) forwards to localhost:5000.
const resolveApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== '') {
    return import.meta.env.VITE_API_URL.trim().replace(/\/$/, '');
  }
  if (import.meta.env.PROD) {
    return 'https://fsd-ii-0u1f.onrender.com';
  }
  return '';
};

export const API_BASE_URL = resolveApiBaseUrl();

/**
 * Safely parse HTTP responses from the backend.
 *
 * Prevents "SyntaxError: Unexpected end of JSON input" by:
 * - Reading response text before attempting JSON parsing.
 * - Safely extracting error messages from JSON payloads, HTML error pages, or HTTP status codes.
 * - Guarding against empty bodies from static hosts or proxy misconfigurations.
 *
 * @param {Response} response - The raw Fetch API Response object
 * @returns {Promise<any>} - Parsed JSON data
 * @throws {Error} - User-friendly error message
 */
export async function handleApiResponse(response) {
  // Read body as text first to avoid crashing if empty or malformed
  const text = await response.text();
  let data = null;

  if (text && text.trim().length > 0) {
    try {
      data = JSON.parse(text);
    } catch {
      // Body is not valid JSON (e.g. plain text or HTML 502/504 gateway error)
      data = null;
    }
  }

  // Handle HTTP error responses (4xx, 5xx)
  if (!response.ok) {
    const errorMsg =
      (data && (data.message || data.error)) ||
      (text && text.length < 200 && !text.includes('<!DOCTYPE') ? text : null) ||
      `Server error (${response.status}: ${response.statusText || 'Request failed'})`;
    throw new Error(errorMsg);
  }

  // Guard: If response is 2xx OK but body is empty (e.g., POST accidentally hit static host)
  if (!data) {
    throw new Error(
      'Server returned an empty response. Please verify the backend API endpoint is active.'
    );
  }

  // Handle business logic error flags if returned as 200 OK
  if (data.success === false) {
    throw new Error(data.message || 'Operation failed on server.');
  }

  return data;
}
