import { Body, Controller, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly comments: CommentsService) {}

  @Post()
  create(
    @Body() body: { idx: string; comment: string; nickname: string; user_id: string },
  ) {
    return this.comments.create(body);
  }
}
