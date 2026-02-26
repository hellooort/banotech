-- 인증서 전용 테이블
create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_en text,
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table certificates enable row level security;
create policy "Public read certificates" on certificates for select using (true);
create policy "Admin full access certificates" on certificates for all using (auth.role() = 'authenticated');
