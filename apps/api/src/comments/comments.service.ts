import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CommentsService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(body: { idx: string; comment: string; nickname: string; user_id: string }) {
    const { data, error } = await this.supabase
      .getClient()
      .from('comment')
      .insert({
        make_id: body.idx,
        comment: body.comment,
        user_nickname: body.nickname,
        user_id: body.user_id,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
