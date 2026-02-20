import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { MessagesService } from '../messages/messages.service';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { ChatPayload } from '../types';

@WebSocketGateway({
  cors: { origin: process.env.HOST },
})
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly messages: MessagesService) {}

  @SubscribeMessage('chat')
  async handleChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ChatPayload & { img?: Buffer | string },
  ) {
    const roomId = data.idx;
    client.join(roomId);

    let imgPath = '';
    if (data.img) {
      const name = uuidv4() + '.png';
      imgPath = '/public/socket/' + name;
      const buf = typeof data.img === 'string' ? Buffer.from(data.img, 'base64') : data.img;
      await writeFile('public/socket/' + name, buf).catch((err) => console.error(err));
    }
    await this.messages.saveMessage({
      msg: data.msg ?? '',
      img: imgPath,
      my_id: data.my_idx,
      list_id: roomId,
    });
    this.server.to(roomId).emit('test', {
      ...data,
      img: imgPath || data.img,
    });
  }
}
