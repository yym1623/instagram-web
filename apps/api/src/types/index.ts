export interface DbUser {
  id: string;
  email: string;
  name: string;
  nickname: string;
  created_at: string;
}

export interface DbPost {
  id: string;
  user_id: string;
  img: string | string[];
  img_cnt: number;
  make_write: string;
  created_at: string;
  user?: DbUser;
}

export interface DbComment {
  id: string;
  make_id: string;
  user_id: string;
  user_nickname: string;
  comment: string;
  created_at: string;
}

export interface DbMsg {
  id: string;
  msg: string;
  img: string;
  my_id: string;
  list_id: string;
  created_at: string;
}

export interface DbMsgList {
  id: string;
  msg_list: string;
  created_at: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  nickname: string;
}

export interface ChatPayload {
  msg: string;
  idx: string;   // room id (msg_list id or composite key)
  my_idx: string;
  img?: string;  // base64 or url
}
