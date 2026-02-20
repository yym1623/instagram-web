import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post()
  async getUsersByEmail(@Body() body: { email: string }) {
    const list = await this.users.getUsersOrderedByEmail(body.email);
    return list;
  }

  @Post('name')
  async getUserName(@Body() body: { email: string }) {
    const name = await this.users.getNameByEmail(body.email);
    return name;
  }

  @Post('select')
  async selectExcludeMe(@Body() body: { name: string }) {
    return this.users.findAllExcludeMe(body.name);
  }

  @Post('me')
  async getMe(@Body() body: { name: string }) {
    const user = await this.users.findByName(body.name);
    return user ? [user] : [];
  }
}
