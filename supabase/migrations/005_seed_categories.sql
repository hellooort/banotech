-- 초기 카테고리 데이터 (실행 전 기존 카테고리가 없어야 합니다)
-- 1단계 카테고리
insert into categories (id, parent_id, name, name_en, slug, sort_order) values
  ('c0000001-0000-0000-0000-000000000001', null, '수건걸이', 'Towel Rack', 'towel-rack', 1),
  ('c0000001-0000-0000-0000-000000000002', null, '휴지걸이', 'Paper Holder', 'paper-holder', 2),
  ('c0000001-0000-0000-0000-000000000003', null, '컵대 / 비누대', 'Tumbler Holder / Soap Dish Holder', 'tumbler-soap', 3),
  ('c0000001-0000-0000-0000-000000000004', null, '선반', 'Shelves', 'shelves', 4),
  ('c0000001-0000-0000-0000-000000000005', null, '옷걸이', 'Robe Hook', 'robe-hook', 5),
  ('c0000001-0000-0000-0000-000000000006', null, '욕실 액세서리', 'Bathroom Accessories', 'bathroom-accessories', 6),
  ('c0000001-0000-0000-0000-000000000007', null, '편의 / 공공 제품', 'Utility & Public Products', 'utility-public', 7),
  ('c0000001-0000-0000-0000-000000000008', null, 'NEW PRODUCTS', 'New Products', 'new-products', 8);

-- 2단계: 수건걸이
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c0000001-0000-0000-0000-000000000001', '수건걸이 [벽걸이]', 'Towel rack [Wall-mounted]', 'towel-rack-wall', 1),
  ('c0000001-0000-0000-0000-000000000001', '수건걸이 [프리스탠딩]', 'Towel rack [Free-standing]', 'towel-rack-freestanding', 2),
  ('c0000001-0000-0000-0000-000000000001', '링수건걸이', 'Ring towel holder', 'ring-towel-holder', 3),
  ('c0000001-0000-0000-0000-000000000001', '수건선반 [1단, 2단]', 'Towel shelves', 'towel-shelves', 4);

-- 2단계: 휴지걸이 - 노출형
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c0000001-0000-0000-0000-000000000002', '휴지걸이 싱글', 'Paper holder [Single]', 'paper-holder-single', 1),
  ('c0000001-0000-0000-0000-000000000002', '휴지걸이 더블', 'Paper holder [Double]', 'paper-holder-double', 2),
  ('c0000001-0000-0000-0000-000000000002', '휴지걸이 보조', 'Paper holder [Spare]', 'paper-holder-spare', 3),
  ('c0000001-0000-0000-0000-000000000002', '휴지걸이 [매립]', 'Paper holder [Recessed]', 'paper-holder-recessed', 4),
  ('c0000001-0000-0000-0000-000000000002', '휴지걸이 [매립_트레이/폰박스]', 'Paper holder [Recessed with tray & phone box]', 'paper-holder-recessed-tray', 5),
  ('c0000001-0000-0000-0000-000000000002', '휴지걸이 겸 잡지꽂이 [매립]', 'Paper holder with magazine holder [Recessed]', 'paper-magazine-recessed', 6),
  ('c0000001-0000-0000-0000-000000000002', '휴지걸이 겸 잡지꽂이 [매립/노출]', 'Paper holder with magazine holder [Recessed & wall-mounted]', 'paper-magazine-both', 7);

-- 2단계: 컵대 / 비누대
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c0000001-0000-0000-0000-000000000003', '컵대 [벽걸이/프리스탠딩]', 'Tumbler holder [Wall-mounted / Free-standing]', 'tumbler-holder', 1),
  ('c0000001-0000-0000-0000-000000000003', '비누대 [벽걸이/프리스탠딩]', 'Soap dish holder [Wall-mounted / Free-standing]', 'soap-dish-holder', 2);

-- 2단계: 선반
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c0000001-0000-0000-0000-000000000004', '코너선반', 'Corner shelves', 'corner-shelves', 1),
  ('c0000001-0000-0000-0000-000000000004', '선반', 'Bath shelves', 'bath-shelves', 2),
  ('c0000001-0000-0000-0000-000000000004', '수건선반', 'Towel shelves (shelf)', 'shelf-towel', 3);

-- 2단계: 옷걸이
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c0000001-0000-0000-0000-000000000005', '옷걸이', 'Robe hook', 'robe-hook-basic', 1),
  ('c0000001-0000-0000-0000-000000000005', '도어 스톱퍼 겸 옷걸이', 'Stoppers with hook', 'stoppers-hook', 2);

-- 2단계: 욕실 액세서리
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c0000001-0000-0000-0000-000000000006', '면도경', 'Shaving mirror', 'shaving-mirror', 1),
  ('c0000001-0000-0000-0000-000000000006', '청소솔', 'Toilet brush holder', 'toilet-brush', 2),
  ('c0000001-0000-0000-0000-000000000006', '물비누 분배기', 'Liquid soap dispenser', 'soap-dispenser', 3),
  ('c0000001-0000-0000-0000-000000000006', '욕조손잡이', 'Grab bar', 'grab-bar', 4),
  ('c0000001-0000-0000-0000-000000000006', '샤워부스 도어 손잡이', 'Shower booth door handle', 'shower-door-handle', 5);

-- 2단계: 편의 / 공공 제품
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c0000001-0000-0000-0000-000000000007', '편의품', 'Utility products', 'utility-products', 1),
  ('c0000001-0000-0000-0000-000000000007', '공공화장실 제품', 'Public toilet products', 'public-toilet', 2),
  ('c0000001-0000-0000-0000-000000000007', '기타', 'Others', 'others', 3);

-- 2단계: NEW PRODUCTS
insert into categories (parent_id, name, name_en, slug, sort_order) values
  ('c0000001-0000-0000-0000-000000000008', '신제품', 'New Products', 'new-products-list', 1);
