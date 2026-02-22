/** feed 안쪽 댓글 한 건. 대댓글은 reply 배열, 개수는 length로. 좋아요 like */
export interface MockFeedComment {
  id: string
  make_id: string
  user_nickname: string
  comment: string
  like: number
  reply?: MockFeedComment[]
}

/** feed 루트: make_write, comment[], like(게시물 좋아요), img[] (개수는 img.length) */
export interface MockFeedInner {
  make_write?: string
  comment?: MockFeedComment[]
  like?: number
  img?: string[]
}

/** story 루트: img[] 만 (개수는 img.length) */
export interface MockStoryInner {
  img?: string[]
}

/** 스토리 하이라이트 한 건: 1단계에서 만든 이름 + 2단계에서 고른 이미지 배열 */
export interface MockStoryHighlightItem {
  name: string
  img: string[]
}

/** 공통: id, name, nickname. feed / story / following·followers */
export interface MockDataItem {
  id: string
  name: string
  nickname: string
  feed: MockFeedInner | Record<string, unknown>
  story: Record<string, unknown>
  /** 스토리 하이라이트: 이름별로 묶은 이미지 배열 (1단계 이름 → 2단계에서 선택한 스토리들) */
  storyHighlight?: MockStoryHighlightItem[]
  /** 팔로워: 내가 팔로우한 사람 (내가 팔로우 버튼 누르면 여기 추가). 스토리·피드는 여기 있는 사람만 노출 */
  following?: UserLite[]
  /** 팔로윙: 나를 팔로우한 사람 (다른 사람이 나 팔로우하면 여기 추가). SubFeed 상단 "X 님이 팔로워했습니다" */
  followers?: UserLite[]
}

/** id, name, nickname 만 쓰는 곳 (SubFeed, Story, ShareModal 등) */
export interface UserLite {
  id: string
  name: string
  nickname: string
}

/** 피드 API 응답 형태 (게시물 row + 댓글 등) */
export interface FeedResponseLike {
  row: Array<Record<string, unknown>>
  comment: unknown[]
  commentLength: unknown[]
}

/** 통합 목업 소스. index에서 한 번만 가져와 내림차순 후 각 컴포넌트에 props로 전달 */
export const mockData: MockDataItem[] = [
  {
    id: 'u1',
    name: 'mock_user_1',
    nickname: '목유저1',
    following: [
      { id: 'u2', name: 'mock_user_2', nickname: '목유저2' },
      { id: 'u3', name: 'mock_user_3', nickname: '목유저3' },
      { id: 'mock_4', name: '김테스트', nickname: 'ts_01' },
    ],
    followers: [
      { id: 'u2', name: 'mock_user_2', nickname: '목유저2' },
      { id: 'u3', name: 'mock_user_3', nickname: '목유저3' },
      { id: 'mock_4', name: '김테스트', nickname: 'ts_01' },
    ],
    feed: {
      make_write: '목업 피드 데이터입니다.',
      like: 0,
      comment: [
        {
          id: 'c1',
          make_id: 'p1',
          user_nickname: '댓글유저',
          comment: '목업 댓글입니다.',
          like: 0,
          reply: [
            { id: 'c1-1', make_id: 'p1', user_nickname: '대댓글유저', comment: '목업 대댓글입니다.', like: 0 },
          ],
        },
        {
          id: 'c2',
          make_id: 'p1',
          user_nickname: '댓글유저',
          comment: '목업 댓글입니다.',
          like: 0,
          reply: [],
        },
      ],
      img: ['/placeholder.jpg'],
    },
    story: { img: ['/placeholder.jpg'] },
    storyHighlight: [
      { name: '연습', img: ['/placeholder.jpg'] },
      { name: '일상', img: ['/placeholder.jpg'] },
    ],
  },
  {
    id: 'u2',
    name: 'mock_user_2',
    nickname: '목유저2',
    feed: {},
    story: { img: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'] },
  },
  {
    id: 'u3',
    name: 'mock_user_3',
    nickname: '목유저3',
    feed: {},
    story: { img: ['/placeholder.jpg'] },
  },
  {
    id: 'mock_4',
    name: '김테스트',
    nickname: 'ts_01',
    feed: {},
    story: { img: ['/placeholder.jpg'] },
  },
  {
    id: 'mock_5',
    name: '이목업',
    nickname: 'ts_22',
    feed: {},
    story: { img: ['/placeholder.jpg'] },
  },
]

/** 광고용 목데이터 2개. SubFeed에는 미노출, 피드·스토리에만 랜덤 끼워넣기 (팔로워/팔로윙 무관) */
export const mockData_ad: MockDataItem[] = [
  {
    id: 'ad_1',
    name: 'sponsor_account_1',
    nickname: '광고_스폰서1',
    
    feed: {
      make_write: '스폰서 광고입니다. 관심 있는 상품을 확인해 보세요.',
      like: 0,
      comment: [
        { id: 'ad_c1', make_id: 'p1', user_nickname: '광고봇', comment: '문의 주세요.', like: 0, reply: [] },
      ],
      img: ['/placeholder.jpg'],
    },
    story: { img: ['/placeholder.jpg'] },
  },
  {
    id: 'ad_2',
    name: 'promotion_account_2',
    nickname: '프로모션_광고2',
    feed: {
      make_write: '한정 기간 특가 이벤트. 지금 참여하세요.',
      like: 0,
      comment: [],
      img: ['/placeholder.jpg'],
    },
    story: { img: ['/placeholder.jpg'] },
  },
]
