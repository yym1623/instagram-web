export interface MockUserLite {
  id: string
  name: string
  nickname: string
}

export interface FeedResponseLike {
  row: Array<Record<string, unknown>>
  comment: unknown[]
  commentLength: unknown[]
}

export const mockUsers: MockUserLite[] = [
  { id: 'u1', name: 'mock_user_1', nickname: '목유저1' },
  { id: 'u2', name: 'mock_user_2', nickname: '목유저2' },
  { id: 'u3', name: 'mock_user_3', nickname: '목유저3' },
]

export const mockFeed: FeedResponseLike = {
  row: [
    {
      id: 'p1',
      user_id: 'u1',
      nickname: '목업닉네임',
      name: 'mock_user_1',
      img_cnt: 1,
      img: '/placeholder.jpg',
      make_write: '목업 피드 데이터입니다.',
    },
  ],
  comment: [
    {
      id: 'c1',
      make_id: 'p1',
      user_nickname: '댓글유저',
      comment: '목업 댓글입니다.',
    },
  ],
  commentLength: [
    {
      id: 'c1',
      make_id: 'p1',
      user_nickname: '댓글유저',
      comment: '목업 댓글입니다.',
    },
  ],
}

