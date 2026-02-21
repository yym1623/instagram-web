import { Body, Controller, Get, Post, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { PostsService } from './posts.service';

const storage = diskStorage({
  destination: './public/uploads',
  filename: (_req, file, cb) => cb(null, uuidv4() + '.png'),
});

@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get('feed')
  getFeed() {
    return this.posts.getFeed();
  }

  @Post('detail')
  getDetail(@Body() body: { idx: string }) {
    return this.posts.getDetail(body.idx);
  }

  @Post('user')
  getByUser(@Body() body: { name: string }) {
    return this.posts.getByUserName(body.name);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'myfile', maxCount: 10 }], {
      storage,
    }),
  )
  async create(
    @Body() body: { user_id: string; email: string; name: string; nickname: string; write: string },
    @UploadedFiles() files: { myfile?: Express.Multer.File[] },
  ) {
    const filesList = files?.myfile ?? [];
    const imgPaths = filesList.map((f) => '/public/uploads/' + f.filename);
    const img = filesList.length === 1 ? imgPaths[0]! : imgPaths;
    const imgCnt = filesList.length;
    if (!body.user_id) throw new Error('user_id required');
    return this.posts.create({
      email: body.email,
      name: body.name,
      nickname: body.nickname,
      make_write: body.write ?? '',
      img: Array.isArray(img) ? img : [img],
      img_cnt: imgCnt,
      user_id: body.user_id,
    });
  }

  @Post('delete')
  delete(@Body() body: { make_idx: string }) {
    return this.posts.delete(body.make_idx);
  }
}
