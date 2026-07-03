import request from './api'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  user: {
    id: number
    name: string
  }
}

export const loginApi = (data: LoginParams) => request.post<any, { data: LoginResult }>('/auth/login', data).then(res => res.data)