import { api } from '../lib/api'

export interface LoginResponse {
  access_token: string
}

export interface UserResponse {
  id: number
  name: string
  email: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password })
  return data
}

export async function register(payload: RegisterPayload): Promise<UserResponse> {
  const { data } = await api.post<UserResponse>('/users', payload)
  return data
}

export async function getMe(): Promise<UserResponse> {
  const { data } = await api.get<UserResponse>('/auth/me')
  return data
}
