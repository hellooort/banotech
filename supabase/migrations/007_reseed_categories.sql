-- 카테고리 전면 재편 (기존 데이터 삭제 후 다시 삽입)
-- ※ 기존 제품(products)에 연결된 category_id가 있으면 미리 백업 필요

-- 2차 카테고리(자식) 먼저 삭제
delete from categories where parent_id is not null;
-- 1차 카테고리(부모) 삭제
delete from categories where parent_id is null;

-- ===== 1차 카테고리 =====
insert into categories (id, parent_id, name, name_en, slug, sort_order) values
  ('c1000000-0000-0000-0000-000000000001', null, '수건걸이',                   'Towel Rack',           'towel-rack', 1),
  ('c1000000-0000-0000-0000-000000000002', null, '휴지걸이[노출형]',           'Paper Holder [Wall]',  'paper-holder-wall', 2),
  ('c1000000-0000-0000-0000-000000000003', null, '컵대/비누대',               'Tumbler/Soap Dish',    'tumbler-soap', 3),
  ('c1000000-0000-0000-0000-000000000004', null, '옷걸이',                     'Robe Hook',            'robe-hook', 4),
  ('c1000000-0000-0000-0000-000000000005', null, '휴지걸이[매립형]/잡지꽂이',  'Paper Holder [Recessed]/Magazine', 'paper-holder-recessed', 5),
  ('c1000000-0000-0000-0000-000000000006', null, '선반',                       'Shelves',              'shelves', 6),
  ('c1000000-0000-0000-0000-000000000007', null, '면도경',                     'Shaving Mirror',       'shaving-mirror', 7),
  ('c1000000-0000-0000-0000-000000000008', null, '청소솔',                     'Toilet Brush',         'toilet-brush', 8),
  ('c1000000-0000-0000-0000-000000000009', null, '물비누 분배기',              'Soap Dispenser',       'soap-dispenser', 9),
  ('c1000000-0000-0000-0000-00000000000a', null, '욕조손잡이',                 'Grab Bar',             'grab-bar', 10),
  ('c1000000-0000-0000-0000-00000000000b', null, '샤워부스도어손잡이',         'Shower Door Handle',   'shower-door-handle', 11),
  ('c1000000-0000-0000-0000-00000000000c', null, '스톱퍼',                     'Stopper',              'stopper', 12),
  ('c1000000-0000-0000-0000-00000000000d', null, '편의품',                     'Utility Products',     'utility', 13),
  ('c1000000-0000-0000-0000-00000000000e', null, '기타',                       'Others',               'others', 14),
  ('c1000000-0000-0000-0000-00000000000f', null, 'NEW PRODUCTS',              'New Products',         'new-products', 15);

-- ===== 2차 카테고리 =====

-- 수건걸이
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c1000000-0000-0000-0000-000000000001', '수건걸이 [벽걸이]',                     'Towel rack [Wall-mounted]',     'towel-rack-wall', 1),
  ('c1000000-0000-0000-0000-000000000001', '수건걸이 [프리스탠딩]',                 'Towel rack [Free-standing]',    'towel-rack-freestanding', 2),
  ('c1000000-0000-0000-0000-000000000001', '수건걸이 [사각링, 원형링, 바 타입]',    'Towel rack [Ring, Bar type]',   'towel-rack-ring-bar', 3);

-- 휴지걸이[노출형]
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c1000000-0000-0000-0000-000000000002', '휴지걸이 [싱글]',              'Paper holder [Single]',        'paper-holder-single', 1),
  ('c1000000-0000-0000-0000-000000000002', '휴지걸이 [더블]',              'Paper holder [Double]',        'paper-holder-double', 2),
  ('c1000000-0000-0000-0000-000000000002', '휴지걸이 [보조]',              'Paper holder [Spare]',         'paper-holder-spare', 3),
  ('c1000000-0000-0000-0000-000000000002', '휴지걸이 [프리스탠딩 타입]',   'Paper holder [Free-standing]', 'paper-holder-freestanding', 4);

-- 컵대/비누대
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c1000000-0000-0000-0000-000000000003', '컵대 [벽걸이, 프리스탠딩]',     'Tumbler holder [Wall/Free-standing]',   'tumbler-holder', 1),
  ('c1000000-0000-0000-0000-000000000003', '비누대 [벽걸이, 프리스탠딩]',   'Soap dish [Wall/Free-standing]',        'soap-dish', 2);

-- 옷걸이
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c1000000-0000-0000-0000-000000000004', '옷걸이',   'Robe hook', 'robe-hook-basic', 1);

-- 휴지걸이[매립형]/잡지꽂이
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c1000000-0000-0000-0000-000000000005', '휴지걸이 [매립]',                                  'Paper holder [Recessed]',                                        'paper-recessed', 1),
  ('c1000000-0000-0000-0000-000000000005', '휴지걸이 [매립_트레이,폰박스]',                     'Paper holder [Recessed with tray & phone box]',                  'paper-recessed-tray', 2),
  ('c1000000-0000-0000-0000-000000000005', '휴지걸이 겸 잡지꽂이 [매립_트레이, 폰박스]',        'Paper & magazine holder [Recessed with tray & phone box]',       'paper-mag-recessed-tray', 3),
  ('c1000000-0000-0000-0000-000000000005', '휴지걸이 겸 잡지꽂이 [매립/노출]',                  'Paper & magazine holder [Recessed & wall-mounted]',              'paper-mag-both', 4),
  ('c1000000-0000-0000-0000-000000000005', '잡지꽂이',                                          'Magazine holder',                                                'magazine-holder', 5);

-- 선반
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c1000000-0000-0000-0000-000000000006', '코너선반',                       'Corner shelves',      'corner-shelves', 1),
  ('c1000000-0000-0000-0000-000000000006', '선반 [일자선반,미니선반]',        'Shelves [Flat/Mini]', 'flat-mini-shelves', 2),
  ('c1000000-0000-0000-0000-000000000006', '수건선반 [1단, 2단]',            'Towel shelves [1-2T]','towel-shelves', 3),
  ('c1000000-0000-0000-0000-000000000006', '바스켓선반',                      'Basket shelves',     'basket-shelves', 4);

-- 면도경
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c1000000-0000-0000-0000-000000000007', '면도경', 'Shaving mirror', 'shaving-mirror-item', 1);

-- 청소솔
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c1000000-0000-0000-0000-000000000008', '청소솔', 'Toilet brush holder', 'toilet-brush-item', 1);

-- 물비누 분배기
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c1000000-0000-0000-0000-000000000009', '디스펜서 [물비누분배기]', 'Dispenser [Liquid soap]', 'dispenser-soap', 1);

-- 욕조손잡이
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c1000000-0000-0000-0000-00000000000a', '욕조손잡이', 'Grab bar', 'grab-bar-item', 1);

-- 샤워부스도어손잡이
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c1000000-0000-0000-0000-00000000000b', '샤워부스도어손잡이', 'Shower booth door handle', 'shower-handle-item', 1);

-- 스톱퍼
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c1000000-0000-0000-0000-00000000000c', '스톱퍼 [도어스톱퍼 겸 옷걸이]', 'Stopper [Door stopper with hook]', 'stopper-hook', 1);

-- 편의품
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c1000000-0000-0000-0000-00000000000d', '편의품', 'Utility products', 'utility-item', 1);

-- 기타
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c1000000-0000-0000-0000-00000000000e', '공공화장실 제품', 'Public toilet products', 'public-toilet', 1),
  ('c1000000-0000-0000-0000-00000000000e', '기타',            'Others',                 'others-item', 2);
