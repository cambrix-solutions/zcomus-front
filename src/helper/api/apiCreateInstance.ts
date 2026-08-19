import axios, { type AxiosInstance } from 'axios';
import { getApiBaseUrl } from 'src/helper/api/apiConfig';

/** Shared Axios instance pointed at `helper/api/apiConfig` backend URL. */
export function createAxiosInstance(baseURL = getApiBaseUrl()): AxiosInstance {
  return axios.create({
    baseURL,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });
}

export const api = createAxiosInstance();
