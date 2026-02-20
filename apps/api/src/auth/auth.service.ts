import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SessionUser } from '../types';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Supabase Auth 기반 로그인 (email + password).
   * - supabase.auth.signInWithPassword 로 인증
   * - auth.users 와 동기화된 public.user 프로필에서 name / nickname 조회
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

    // 프로필 정보는 public.user 테이블에서 관리 (없으면 supabase user_metadata 로 fallback)
    const { data: profile } = await client
      .from('user')
      .select('id, email, name, nickname')
      .eq('id', authUser.id)
      .single();

    const sessionUser: SessionUser = {
      id: authUser.id,
      email: authUser.email ?? email,
      name: profile?.name ?? (authUser.user_metadata as any)?.name ?? '',
      nickname: profile?.nickname ?? (authUser.user_metadata as any)?.nickname ?? '',
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
   * - auth.signUp 으로 계정 생성
   * - public.user 테이블에 프로필 동기화
   */
  async register(body: { email: string; pw: string; name: string; nickname: string }) {
    const client = this.supabase.getClient();

    // 회원가입 요청 payload 로그
    console.log('[AuthService.register] incoming body:', body);

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
      console.error('[AuthService.register] supabase.auth.signUp error:', error);
      return { success: false, message: error.message };
    }

    const authUser = data.user;
    if (!authUser) {
      return { success: false, message: '회원가입에 실패했습니다' };
    }

    // public.user 프로필 upsert (auth.users.id 를 그대로 사용)
    const { data: profile, error: profileError } = await client
      .from('user')
      .upsert(
        {
          id: authUser.id,
          email: authUser.email ?? body.email,
          name: body.name,
          nickname: body.nickname,
        },
        { onConflict: 'id' },
      )
      .select('id, email, name, nickname')
      .single();

    if (profileError) {
      console.error('[AuthService.register] profile upsert error:', profileError);
      return { success: false, message: profileError.message };
    }

    return { success: true, user: profile };
  }
}
