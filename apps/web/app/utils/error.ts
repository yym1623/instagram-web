/** Supabase Auth 에러 메시지를 사용자 친화적인 메시지로 변환 */
export function parseSupabaseAuthError(error: unknown): string {
  const err = error as { message?: string }
  if (!err?.message) {
    return '오류가 발생했습니다'
  }

  const message = err.message.toLowerCase()

  if (message.includes('invalid login credentials') || message.includes('invalid email or password')) {
    return '이메일 또는 비밀번호가 올바르지 않습니다'
  }

  if (message.includes('email not confirmed')) {
    return '이메일을 확인해주세요'
  }

  if (message.includes('user already registered')) {
    return '이미 가입된 이메일입니다'
  }

  if (message.includes('password')) {
    return '비밀번호 관련 오류가 발생했습니다'
  }

  return err.message || '오류가 발생했습니다'
}

/** 폼 검증 에러 메시지 상수 */
export const VALIDATION = {
  EMAIL: '이메일 주소를 정확히 입력해주세요',
  PASSWORD: '비밀번호를 정확히 입력해주세요',
  PASSWORD_RULE: '비밀번호를 정확히 입력해주세요 (영문, 숫자, 특수문자 8~16자)',
  NICKNAME: '닉네임을 정확히 입력해주세요 (영문, 숫자)',
} as const
