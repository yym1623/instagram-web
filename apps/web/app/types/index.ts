export interface User {
  id: string
  email: string
  name: string
  nickname: string
  created_at?: string
}

export interface Post {
  id: string
  user_id: string
  img: string
  img_cnt: number
  make_write: string
  name: string
  nickname: string
  email?: string
  created_at?: string
}

export interface Comment {
  id: string
  make_id: string
  user_id: string
  user_nickname: string
  comment: string
  created_at?: string
}

export interface Message {
  id: string
  msg: string
  img: string
  my_id: string
  list_id: string
  created_at?: string
}

export interface SessionUser {
  id: string
  email: string
  name: string
  nickname: string
}

/** 쿠키에 저장되는 세션 (Supabase expires_at 포함) */
export interface SessionPayload {
  user: SessionUser
  expires_at: number | null
}
