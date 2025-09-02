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

export class AxiosAdapter implements HttpClient {
  private axios: any

  constructor(baseURL?: string, apiKey?: string) {
    // Dynamic import to avoid bundling axios in the final widget
    this.initAxios(baseURL, apiKey)
  }

  private async initAxios(baseURL?: string, apiKey?: string) {
    const axios = await import('axios')
    this.axios = axios.default.create({
      baseURL: baseURL || 'https://api.haiku.fi',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })
  }

  async get<T>(uri: string, options?: RequestOptions): Promise<T> {
    await this.ensureAxiosReady()
    const { data } = await this.axios.get(uri, options)
    return data
  }

  async post<T>(uri: string, payload: unknown, options?: RequestOptions): Promise<T> {
    await this.ensureAxiosReady()
    const { data } = await this.axios.post(uri, payload, options)
    return data
  }

  async patch<T>(uri: string, payload: unknown, options?: RequestOptions): Promise<T> {
    await this.ensureAxiosReady()
    const { data } = await this.axios.patch(uri, payload, options)
    return data
  }

  async put<T>(uri: string, payload: unknown, options?: RequestOptions): Promise<T> {
    await this.ensureAxiosReady()
    const { data } = await this.axios.put(uri, payload, options)
    return data
  }

  async delete<T>(uri: string, payload?: unknown, options?: RequestOptions): Promise<T> {
    await this.ensureAxiosReady()
    const { data } = await this.axios.delete(uri, {
      data: payload,
      ...options,
    })
    return data
  }

  private async ensureAxiosReady() {
    if (!this.axios) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
}
