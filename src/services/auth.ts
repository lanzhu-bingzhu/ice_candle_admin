import request from './api'
import type { Response } from "@/types";

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  code: number,
  message: string,
  data: {
    token: string
    user: {
      id: number
      name: string
    }
  }
}

export const loginApi = (data: LoginParams) => request.post<any, LoginResult>('/auth/login', data)

export const resetPasswordApi = (data: LoginParams) => request.post<any, Response>('/user/reset_password', data)
