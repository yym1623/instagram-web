import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

/** Supabase Auth(auth.users) 목록 한 건 형태. 프론트 추천/공유 등에 사용 */
export interface AuthUserLite {
  id: string;
  name: string;
  nickname: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Supabase Authentication → Users (auth.users) 목록을 Admin API로 조회.
   * service_role 필요. name/nickname은 user_metadata에서 사용.
   */
  async listAuthUsers(): Promise<AuthUserLite[]> {
    const { data, error } = await this.supabase
      .getAdminClient()
      .auth.admin.listUsers({ perPage: 1000 });
    if (error || !data?.users?.length) return [];
    return data.users.map((u) => {
      const meta = (u.user_metadata ?? {}) as Record<string, string>;
      return {
        id: u.id,
        name: meta.name ?? u.email ?? '',
        nickname: meta.nickname ?? meta.name ?? u.email ?? '',
      };
    });
  }

  /** name(유저네임)으로 Auth 유저 한 명 조회. 프로필 페이지 등에 사용 */
  async getAuthUserByName(name: string): Promise<AuthUserLite | null> {
    const list = await this.listAuthUsers();
    return list.find((u) => u.name === name) ?? null;
  }
}
