import axios, { type AxiosInstance } from 'axios';
import { getApiBaseUrl, isApiEnabled } from 'src/helper/api/apiConfig';
import { ApiDisabledError } from 'src/helper/api/apiClient';

/** Shared Axios instance pointed at `helper/api/apiConfig` backend URL. */
export function createAxiosInstance(baseURL = getApiBaseUrl()): AxiosInstance {
  const instance = axios.create({
    baseURL,
    // Generous enough for image uploads, but stops a dead backend hanging the UI.
    timeout: 20_000,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  // Short-circuits before any socket is opened while the backend is disabled.
  instance.interceptors.request.use((config) => {
    if (!isApiEnabled()) throw new ApiDisabledError();
    return config;
  });

  return instance;
}

export const api = createAxiosInstance();
