import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/app/store/auth';

/**
 * axios 实例 + 拦截器：统一注入鉴权头、统一错误处理。
 * 模板对接「现有 API」—— baseURL 走环境变量（见 .env.example）。
 */
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15_000,
});

// 请求拦截：带上 token
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截：401 统一登出并跳登录页
http.interceptors.response.use(
  (res) => res,
  (error) => {
    // 仅在「已登录会话」收到 401 时才视为会话失效并登出；
    // 否则（如登录接口凭据错误返回的 401）属预期内错误，交业务层处理，不误登出。
    if (error.response?.status === 401 && useAuthStore.getState().token) {
      useAuthStore.getState().logout();
      // 会话失效用整页跳转，干净地清空所有内存状态；避免在此 import 路由造成循环依赖。
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  },
);

/** 从任意错误中提取可展示的消息（供 queryClient onError 等统一使用） */
export function toMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      '请求失败'
    );
  }
  if (error instanceof Error) return error.message;
  return '发生未知错误';
}
