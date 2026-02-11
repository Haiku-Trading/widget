import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { HttpClient, RequestOptions } from '../models/http-client'

interface AxiosAdapterOptions {
  baseURL?: string
  headers?: Record<string, string>
  widgetKey?: string // Widget key for authentication
  request?: { onIntercept: (request: InternalAxiosRequestConfig) => void }
  response?: { onIntercept: (response: AxiosResponse) => void }
}

export class AxiosAdapter implements HttpClient {
  axios: AxiosInstance

  constructor(options?: AxiosAdapterOptions) {
    this.axios = axios.create({
      baseURL: options?.baseURL,
      headers: options?.headers,
    })
    
    // Add widget key interceptor if provided
    if (options?.widgetKey) {
      this.axios.interceptors.request.use((req) => {
        req.headers['x-widget-key'] = options.widgetKey
        return req
      })
    }
    
    if (options?.request) {
      this.axios.interceptors.request.use((req) => {
        options.request?.onIntercept(req)
        return req
      })
    }
    if (options?.response) {
      this.axios.interceptors.response.use((res) => {
        options.response?.onIntercept(res)
        return res
      })
    }
  }

  async get<T>(uri: string, options?: RequestOptions): Promise<T> {
    const { data } = await this.axios.get(uri, options)
    return data
  }
  async post<T>(uri: string, payload: unknown, options?: RequestOptions): Promise<T> {
    const { data } = await this.axios.post(uri, payload, options)
    return data
  }
  async patch<T>(uri: string, payload: unknown, options?: RequestOptions): Promise<T> {
    const { data } = await this.axios.patch(uri, payload, options)
    return data
  }
  async put<T>(uri: string, payload: unknown, options?: RequestOptions): Promise<T> {
    const { data } = await this.axios.put(uri, payload, options)
    return data
  }
  async delete<T>(uri: string, payload?: unknown, options?: RequestOptions): Promise<T> {
    const { data } = await this.axios.delete(uri, {
      data: payload,
      ...options,
    })
    return data
  }
}
