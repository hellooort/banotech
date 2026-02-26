-- 기존 DB에 영문 필드 추가 (이미 테이블이 있는 경우 이 파일만 실행)
alter table categories add column if not exists name_en text;
alter table products add column if not exists name_en text;
alter table products add column if not exists description_en text;
