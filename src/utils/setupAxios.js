// setupAxios.js
import axios from 'axios';
import store from '../app/store';
import { refreshToken } from '../features/auth/authSlice';

const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    async (config) => {
      const state = store.getState();
      const { accessToken } = state.auth;

      if (accessToken) {
        config.headers.Authorization = `JWT ${accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        await store.dispatch(refreshToken());
        const state = store.getState();
        const { accessToken } = state.auth;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;
