import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;
  private adminClient: SupabaseClient;

  constructor(private config: ConfigService) {
    const url = this.config.getOrThrow<string>('SUPABASE_URL');
    this.client = createClient(url, this.config.getOrThrow<string>('SUPABASE_ANON_KEY'));
    const serviceRoleKey = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    this.adminClient = serviceRoleKey
      ? createClient(url, serviceRoleKey)
      : this.client;
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  /** Auth Admin API용 (auth.users 목록 등). service_role 키 필요. */
  getAdminClient(): SupabaseClient {
    return this.adminClient;
  }
}
