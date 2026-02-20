import { Body, Controller, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}

  @Post('list')
  async getOrCreateList(@Body() body: { my_idx: string; idx: string }) {
    const listId = await this.messages.getOrCreateMsgList(body.my_idx, body.idx);
    return listId;
  }

  @Post('select')
  getByListId(@Body() body: { idx: string }) {
    return this.messages.getMessagesByListId(body.idx);
  }
}
