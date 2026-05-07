import { api } from '../lib/api'

export interface Author {
  id: number
  name: string
  email: string
}

export interface Post {
  id: number
  title: string
  description: string
  content: string | null
  thumbnail: string | null
  tags: string[]
  createdAt: string
  author: Author
  likesCount: number
  commentsCount: number
  likedByMe: boolean
}

export interface PostListResponse {
  data: Post[]
  total: number
  page: number
  limit: number
}

export interface Comment {
  id: number
  content: string
  createdAt: string
  author: Author
}

export interface CreatePostPayload {
  title: string
  description: string
  content?: string
  thumbnail?: string
  tags?: string[]
}

export async function fetchPosts(params?: {
  q?: string
  page?: number
  limit?: number
}): Promise<PostListResponse> {
  const { data } = await api.get<PostListResponse>('/posts', { params })
  return data
}

export async function fetchPost(id: number): Promise<Post> {
  const { data } = await api.get<Post>(`/posts/${id}`)
  return data
}

export async function createPost(payload: CreatePostPayload): Promise<Post> {
  const { data } = await api.post<Post>('/posts', payload)
  return data
}

export async function likePost(id: number): Promise<void> {
  await api.post(`/posts/${id}/likes`)
}

export async function unlikePost(id: number): Promise<void> {
  await api.delete(`/posts/${id}/likes`)
}

export async function fetchComments(postId: number): Promise<Comment[]> {
  const { data } = await api.get<Comment[]>(`/posts/${postId}/comments`)
  return data
}

export async function addComment(postId: number, content: string): Promise<Comment> {
  const { data } = await api.post<Comment>(`/posts/${postId}/comments`, { content })
  return data
}
