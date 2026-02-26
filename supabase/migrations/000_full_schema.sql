-- ============================================
-- BANO 전체 DB 스키마 (통합본)
-- Supabase SQL Editor에서 한 번만 실행하세요
-- ============================================

-- 1) Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references categories(id) on delete cascade,
  name text not null,
  name_en text,
  slug text not null unique,
  icon_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 2) Products
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  name_en text,
  model_name text,
  description text,
  description_en text,
  thumbnail_url text,
  specs jsonb default '{}',
  drawing_pdf_url text,
  drawing_dwg_url text,
  drawing_img_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_products_category on products(category_id);

-- 3) Product Images
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0
);

create index idx_product_images_product on product_images(product_id);

-- 4) Documents (catalog, drawing, manual, other)
create table documents (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  title text not null,
  type text not null check (type in ('catalog', 'drawing', 'manual', 'other')),
  file_url text not null,
  created_at timestamptz not null default now()
);

create index idx_documents_product on documents(product_id);
create index idx_documents_type on documents(type);

-- 5) Notices
create table notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now()
);

-- 6) Inquiries
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'replied', 'closed')),
  created_at timestamptz not null default now()
);

-- 7) Company Info (greeting, history, certificates, location)
create table company_info (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('greeting', 'history', 'certificates', 'location')),
  content jsonb not null default '{}',
  sort_order int not null default 0
);

-- 8) Projects
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  thumbnail_url text,
  location text,
  year int,
  created_at timestamptz not null default now()
);

-- 9) Project Images
create table project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0
);

create index idx_project_images_project on project_images(project_id);

-- ============================================
-- Row Level Security
-- ============================================
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table documents enable row level security;
alter table notices enable row level security;
alter table inquiries enable row level security;
alter table company_info enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;

-- Public read
create policy "Public read categories" on categories for select using (true);
create policy "Public read products" on products for select using (true);
create policy "Public read product_images" on product_images for select using (true);
create policy "Public read documents" on documents for select using (true);
create policy "Public read notices" on notices for select using (true);
create policy "Public read company_info" on company_info for select using (true);
create policy "Public read projects" on projects for select using (true);
create policy "Public read project_images" on project_images for select using (true);

-- Public insert (문의하기)
create policy "Public insert inquiries" on inquiries for insert with check (true);

-- Admin (authenticated) full access
create policy "Admin full access categories" on categories for all using (auth.role() = 'authenticated');
create policy "Admin full access products" on products for all using (auth.role() = 'authenticated');
create policy "Admin full access product_images" on product_images for all using (auth.role() = 'authenticated');
create policy "Admin full access documents" on documents for all using (auth.role() = 'authenticated');
create policy "Admin full access notices" on notices for all using (auth.role() = 'authenticated');
create policy "Admin full access inquiries" on inquiries for all using (auth.role() = 'authenticated');
create policy "Admin full access company_info" on company_info for all using (auth.role() = 'authenticated');
create policy "Admin full access projects" on projects for all using (auth.role() = 'authenticated');
create policy "Admin full access project_images" on project_images for all using (auth.role() = 'authenticated');

-- ============================================
-- Storage Buckets (public)
-- ============================================
insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('documents', 'documents', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('projects', 'projects', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('company', 'company', true) on conflict (id) do nothing;

-- Storage policies: 누구나 읽기, 인증된 사용자만 업로드/수정/삭제
create policy "Public read storage" on storage.objects for select using (true);
create policy "Admin upload storage" on storage.objects for insert with check (auth.role() = 'authenticated');
create policy "Admin update storage" on storage.objects for update using (auth.role() = 'authenticated');
create policy "Admin delete storage" on storage.objects for delete using (auth.role() = 'authenticated');
