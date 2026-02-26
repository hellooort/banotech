-- 기존 DB에 parent_id 추가 (이미 테이블이 있는 경우 이 파일만 실행)
alter table categories add column if not exists parent_id uuid references categories(id) on delete cascade;
