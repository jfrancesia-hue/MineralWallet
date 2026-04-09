import * as SecureStore from 'expo-secure-store';
import type { ApiResponse } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.mineralwallet.app';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestConfig {
  method: HttpMethod;
  path: string;
  body?: unknown;
  params?: Record<string, string>;
  timeout?: number;
}

async function getAuthToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('auth_token');
  } catch {
    return null;
  }
}

function buildUrl(path: string, params?: Record<string, string>): string {
  const url = new URL(path, API_BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  return url.toString();
}

async function request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
  const { method, path, body, params, timeout = 15000 } = config;

  const token = await getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-App-Version': '2.0.0',
    'X-Platform': 'mobile',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(buildUrl(path, params), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const json = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: json.code ?? `HTTP_${response.status}`,
          message: json.message ?? response.statusText,
          details: json.details,
        },
      };
    }

    return { success: true, data: json.data ?? json };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        success: false,
        error: { code: 'TIMEOUT', message: 'La solicitud excedio el tiempo limite' },
      };
    }

    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Sin conexion. Los cambios se sincronizaran cuando vuelvas a estar online.',
      },
    };
  }
}

export const api = {
  get: <T>(path: string, params?: Record<string, string>) =>
    request<T>({ method: 'GET', path, params }),

  post: <T>(path: string, body?: unknown) =>
    request<T>({ method: 'POST', path, body }),

  put: <T>(path: string, body?: unknown) =>
    request<T>({ method: 'PUT', path, body }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>({ method: 'PATCH', path, body }),

  delete: <T>(path: string) =>
    request<T>({ method: 'DELETE', path }),
};

export async function setAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync('auth_token', token);
}

export async function clearAuthToken(): Promise<void> {
  await SecureStore.deleteItemAsync('auth_token');
}
