import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { DbUser } from '../types';

@Injectable()
export class UsersService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAllExcludeMe(name: string): Promise<DbUser[]> {
    const { data } = await this.supabase
      .getClient()
      .from('user')
      .select('id, email, name, nickname, created_at')
      .neq('name', name);
    return (data ?? []) as DbUser[];
  }

  async findByEmail(email: string): Promise<DbUser | null> {
    const { data } = await this.supabase
      .getClient()
      .from('user')
      .select('*')
      .eq('email', email)
      .order('email', { ascending: email ? false : true })
      .limit(1)
      .single();
    return data as DbUser | null;
  }

  async findByName(name: string): Promise<DbUser | null> {
    const { data } = await this.supabase
      .getClient()
      .from('user')
      .select('*')
      .eq('name', name)
      .single();
    return data as DbUser | null;
  }

  async getUsersOrderedByEmail(email: string): Promise<DbUser[]> {
    const { data } = await this.supabase
      .getClient()
      .from('user')
      .select('*');
    if (!data?.length) return [];
    const sorted = [...data].sort((a, b) =>
      (a as { email: string }).email === email ? -1 : (b as { email: string }).email === email ? 1 : 0,
    );
    return sorted as DbUser[];
  }

  async getNameByEmail(email: string): Promise<string | null> {
    const { data } = await this.supabase
      .getClient()
      .from('user')
      .select('name')
      .eq('email', email)
      .single();
    return (data as { name: string } | null)?.name ?? null;
  }
}
