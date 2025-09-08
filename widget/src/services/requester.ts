/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export const requester = (config?: AxiosRequestConfig) => {
  const service = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || config?.baseURL,
    ...config,
  })

  service.interceptors.request.use(
    (req) => req,
    (error) => Promise.reject(error),
  )

  service.interceptors.response.use(
    (res) => res,
    (error) => {
      return Promise.reject(error)
    },
  )

  return {
    async get<T>(uri: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
      const response = await service.get<T>(uri, config)
      return response
    },
    async post<T>(
      uri: string,
      data: unknown,
      config?: AxiosRequestConfig,
    ): Promise<AxiosResponse<T>> {
      const response = await service.post<T>(uri, data, config)
      return response
    },
    async put<T>(uri: string, data: unknown): Promise<AxiosResponse<T>> {
      const response = await service.put<T>(uri, data)
      return response
    },
    async patch<T>(uri: string, data: unknown): Promise<AxiosResponse<T>> {
      const response = await service.patch<T>(uri, data)
      return response
    },
    async delete<T>(uri: string, data: unknown): Promise<AxiosResponse<T>> {
      const response = await service.delete<T>(uri, { data })
      return response
    },
  }
}
