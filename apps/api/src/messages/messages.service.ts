import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { DbMsg } from '../types';

@Injectable()
export class MessagesService {
  constructor(private readonly supabase: SupabaseService) {}

  async getOrCreateMsgList(myIdx: string, idx: string): Promise<string> {
    const listKey = myIdx === idx ? myIdx : [myIdx, idx].sort().join(',');
    const secKey = myIdx === idx ? myIdx : [idx, myIdx].sort().join(',');

    const { data: rows } = await this.supabase
      .getClient()
      .from('msg_list')
      .select('msg_list')
      .in('msg_list', [listKey, secKey])
      .limit(1);

    const existing = Array.isArray(rows) && rows.length > 0 ? (rows[0] as { msg_list: string }).msg_list : null;
    if (existing) return existing;

    await this.supabase.getClient().from('msg_list').insert({ msg_list: listKey });
    return listKey;
  }

  async getMessagesByListId(listId: string): Promise<DbMsg[]> {
    const { data } = await this.supabase
      .getClient()
      .from('msg')
      .select('*')
      .eq('list_id', listId)
      .order('created_at', { ascending: true });
    return (data ?? []) as DbMsg[];
  }

  async saveMessage(payload: { msg: string; img: string; my_id: string; list_id: string }) {
    const { data, error } = await this.supabase
      .getClient()
      .from('msg')
      .insert({
        msg: payload.msg,
        img: payload.img ?? '',
        my_id: payload.my_id,
        list_id: payload.list_id,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
