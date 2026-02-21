import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SessionUser } from '../types';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Supabase Auth 기반 로그인 (email + password).
   * - supabase.auth.signInWithPassword 로 인증
   * - name/nickname은 auth user_metadata에서 사용
   */
  async login(
    email: string,
    pw: string,
  ): Promise<
    | { user: SessionUser; access_token: string; refresh_token: string; expires_at: number | null }
    | { success: false; message: string }
  > {
    const client = this.supabase.getClient();

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password: pw,
    });

    if (error || !data?.user || !data?.session) {
      return { success: false, message: '정보가 일치하지 않습니다' };
    }

    const authUser = data.user;
    const session = data.session;
    const meta = (authUser.user_metadata ?? {}) as Record<string, string>;

    const sessionUser: SessionUser = {
      id: authUser.id,
      email: authUser.email ?? email,
      name: meta.name ?? '',
      nickname: meta.nickname ?? meta.name ?? '',
    };

    return {
      user: sessionUser,
      access_token: session.access_token,
      refresh_token: session.refresh_token ?? '',
      expires_at: session.expires_at ?? null,
    };
  }

  /**
   * Supabase Auth 기반 회원가입.
   * - auth.signUp 으로 계정 생성, user_metadata에 name/nickname 저장
   */
  async register(body: { email: string; pw: string; name: string; nickname: string }) {
    const client = this.supabase.getClient();

    const { data, error } = await client.auth.signUp({
      email: body.email,
      password: body.pw,
      options: {
        data: {
          name: body.name,
          nickname: body.nickname,
        },
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (!data.user) {
      return { success: false, message: '회원가입에 실패했습니다' };
    }

    const meta = (data.user.user_metadata ?? {}) as Record<string, string>;
    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email ?? body.email,
        name: meta.name ?? body.name,
        nickname: meta.nickname ?? body.nickname,
      },
    };
  }
}
