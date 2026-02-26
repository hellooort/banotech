'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import PageHeader from '@/components/ui/PageHeader';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

export default function InquiryPage() {
  const [form, setForm] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from('inquiries').insert([form]);

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch {
      setError('문의 등록에 실패했습니다. 다시 시도해주세요.');
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <>
        <PageHeader title="문의하기" />
        <div className="mx-auto max-w-[1280px] px-6 py-20 text-center">
          <h2 className="text-lg font-semibold text-foreground">문의가 접수되었습니다</h2>
          <p className="mt-2 text-sm text-muted">빠른 시일 내에 답변 드리겠습니다.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="문의하기" description="제품 및 거래에 대한 문의사항을 남겨주세요" />
      <div className="mx-auto max-w-[640px] px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              id="company_name"
              name="company_name"
              label="회사명"
              placeholder="회사명을 입력하세요"
              value={form.company_name}
              onChange={handleChange}
              required
            />
            <Input
              id="contact_name"
              name="contact_name"
              label="담당자명"
              placeholder="담당자명을 입력하세요"
              value={form.contact_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              id="email"
              name="email"
              type="email"
              label="이메일"
              placeholder="email@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              id="phone"
              name="phone"
              type="tel"
              label="전화번호"
              placeholder="02-0000-0000"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <Input
            id="subject"
            name="subject"
            label="제목"
            placeholder="문의 제목을 입력하세요"
            value={form.subject}
            onChange={handleChange}
            required
          />

          <Textarea
            id="message"
            name="message"
            label="문의 내용"
            placeholder="문의하실 내용을 자세히 작성해주세요"
            value={form.message}
            onChange={handleChange}
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? '접수 중...' : '문의 접수'}
          </Button>
        </form>
      </div>
    </>
  );
}
