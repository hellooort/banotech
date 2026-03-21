-- documents.type 에 인증서·승인서류 추가
alter table documents drop constraint if exists documents_type_check;
alter table documents add constraint documents_type_check
  check (type in ('catalog', 'drawing', 'manual', 'other', 'certificate', 'approval'));
