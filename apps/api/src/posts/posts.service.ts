import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { DbPost } from '../types';

@Injectable()
export class PostsService {
  constructor(private readonly supabase: SupabaseService) {}

  async getFeed(): Promise<{ row: DbPost[]; comment: unknown[]; commentLength: unknown[] }> {
    const client = this.supabase.getClient();
    const { data: posts } = await client
      .from('make')
      .select('*')
      .order('created_at', { ascending: false });

    const uniqueByUser = (posts ?? []).reduce((acc: DbPost[], p) => {
      const existing = acc.find((x) => (x as { user_id: string }).user_id === (p as { user_id: string }).user_id);
      if (!existing) acc.push(p as DbPost);
      return acc;
    }, []);

    const { data: comment } = await client
      .from('comment')
      .select('*')
      .order('created_at', { ascending: false });

    const commentRanked = (comment ?? []).slice(0, 50);
    const { data: commentLength } = await client.from('comment').select('*');

    return {
      row: uniqueByUser.sort(
        (a, b) => new Date((b as { created_at: string }).created_at).getTime() - new Date((a as { created_at: string }).created_at).getTime(),
      ),
      comment: commentRanked,
      commentLength: commentLength ?? [],
    };
  }

  async getDetail(id: string): Promise<DbPost[]> {
    const { data } = await this.supabase
      .getClient()
      .from('make')
      .select('*')
      .eq('id', id);
    return (data ?? []) as DbPost[];
  }

  async getByUserName(name: string): Promise<DbPost[]> {
    const { data } = await this.supabase
      .getClient()
      .from('make')
      .select('*')
      .eq('name', name)
      .order('created_at', { ascending: false });
    return (data ?? []) as DbPost[];
  }

  async create(body: {
    email: string;
    name: string;
    nickname: string;
    make_write: string;
    img: string | string[];
    img_cnt: number;
    user_id: string;
  }) {
    const imgValue = Array.isArray(body.img) ? body.img.join(',') : body.img;
    const { data, error } = await this.supabase
      .getClient()
      .from('make')
      .insert({
        user_id: body.user_id,
        name: body.name,
        nickname: body.nickname,
        email: body.email,
        img: imgValue,
        img_cnt: body.img_cnt,
        make_write: body.make_write,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, message: '업로드완료', data };
  }

  async delete(makeId: string) {
    await this.supabase.getClient().from('make').delete().eq('id', makeId);
    return { success: true };
  }
}
