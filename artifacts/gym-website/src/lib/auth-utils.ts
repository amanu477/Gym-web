/**
 * Utility functions to manage authentication token and headers
 * for the generated API client hooks.
 */

export const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem("auth_token", token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem("auth_token");
};

export const getAuthHeaders = (): { headers?: { Authorization: string } } => {
  const token = getAuthToken();
  if (!token) return {};
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};
