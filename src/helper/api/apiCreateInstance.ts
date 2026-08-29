import axios, { type AxiosInstance } from 'axios';
import { getApiBaseUrl } from 'src/helper/api/apiConfig';

/** Shared Axios instance pointed at `helper/api/apiConfig` backend URL. */
export function createAxiosInstance(baseURL = getApiBaseUrl()): AxiosInstance {
  return axios.create({
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
}

export const api = createAxiosInstance();
