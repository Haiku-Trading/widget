export interface RequestOptions {
  headers?: Record<string, string>
  signal?: AbortSignal
}

export interface HttpClient {
  get<T>(uri: string, options?: RequestOptions): Promise<T>
  post<T>(uri: string, payload: unknown, options?: RequestOptions): Promise<T>
  patch<T>(uri: string, payload: unknown, options?: RequestOptions): Promise<T>
  put<T>(uri: string, payload: unknown, options?: RequestOptions): Promise<T>
  delete<T>(uri: string, payload?: unknown, options?: RequestOptions): Promise<T>
}
