import { defineBoot } from '#q-app/wrappers';
import type { AxiosInstance } from 'axios';
import { api } from 'src/helper/api/apiCreateInstance';
import { ensureCsrf } from 'src/helper/api/apiClient';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = api;
  app.config.globalProperties.$api = api;
});

export { api, ensureCsrf };
