-- products 테이블에 global_sort_order 컬럼 추가
-- 1depth(전체/1차 카테고리) 보기에서의 정렬 순서 (2depth 순서와 독립)

alter table products add column if not exists global_sort_order int not null default 0;

-- 기존 제품들의 global_sort_order를 sort_order 값으로 초기화
update products set global_sort_order = sort_order where global_sort_order = 0;

-- 인덱스 추가
create index if not exists idx_products_global_sort_order on products(global_sort_order);
