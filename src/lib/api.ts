// lib/api.ts - Standard same-origin client for NQDSMTool with CSRF handling

export function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
  status?: number;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");

  // Auto attach CSRF token for mutating methods
  const method = (options.method || "GET").toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers.set("X-XSRF-TOKEN", csrfToken);
    }
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
    credentials: "include", // send JSESSIONID
  });

  if (res.status === 401) {
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login?error=expired";
    }
    throw new Error("Phiên đăng nhập đã hết hạn. Đăng nhập lại để tiếp tục.");
  }

  if (res.status === 403) {
    throw new Error("Yêu cầu không hợp lệ hoặc thiếu CSRF token. Tải lại trang và thử lại.");
  }

  if (res.status === 409) {
    const errData = await res.json().catch(() => ({}));
    const error = new Error("Bài đã được hệ thống xử lý. Đang cập nhật...");
    (error as unknown as { code: string; data: unknown }).code = "POST_STATE_CONFLICT";
    (error as unknown as { code: string; data: unknown }).data = errData;
    throw error;
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const msg =
      errorData?.message ||
      (res.status >= 500
        ? "Có lỗi xảy ra. Thử lại sau. Nếu vẫn lỗi, kiểm tra log hệ thống."
        : "Không thể xử lý yêu cầu.");
    throw new Error(msg);
  }

  // Tự động phát sự kiện đồng bộ toàn ứng dụng khi có thao tác CRUD (POST, PUT, PATCH, DELETE)
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("app:data-mutated", {
        detail: { endpoint, method, timestamp: Date.now() },
      })
    );
  }

  return res.json();
}

/**
 * Hàm thủ công để các component kích hoạt đồng bộ dữ liệu toàn trang khi cần
 */
export function notifyDataChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("app:data-mutated", {
        detail: { manual: true, timestamp: Date.now() },
      })
    );
  }
}

export const api = {
  get: <T>(url: string, options?: RequestInit) => apiClient<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, body?: unknown, options?: RequestInit) =>
    apiClient<T>(url, {
      ...options,
      method: 'POST',
      body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
    }),
  put: <T>(url: string, body?: unknown, options?: RequestInit) =>
    apiClient<T>(url, {
      ...options,
      method: 'PUT',
      body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
    }),
  patch: <T>(url: string, body?: unknown, options?: RequestInit) =>
    apiClient<T>(url, {
      ...options,
      method: 'PATCH',
      body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
    }),
  delete: <T>(url: string, options?: RequestInit) => apiClient<T>(url, { ...options, method: 'DELETE' }),
};

export default api;

