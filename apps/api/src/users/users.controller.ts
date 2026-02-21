import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  /** Supabase Auth(auth.users) 회원 목록. 프론트에서 현재 로그인 유저(auth.id) 제외 후 사용 */
  @Post('select')
  async selectAuthUsers() {
    return this.users.listAuthUsers();
  }

  /** name(유저네임)으로 Auth 유저 한 명. 프로필 페이지용 */
  @Post('me')
  async getMe(@Body() body: { name: string }) {
    const user = await this.users.getAuthUserByName(body.name);
    return user ? [user] : [];
  }
}
