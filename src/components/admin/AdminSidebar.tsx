'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  Package,
  FolderTree,
  FileText,
  Bell,
  MessageSquare,
  Award,
  LogOut,
} from 'lucide-react';

const ADMIN_NAV = [
  { label: '제품 관리', href: '/admin/products', icon: Package },
  { label: '카테고리 관리', href: '/admin/categories', icon: FolderTree },
  { label: '인증서 관리', href: '/admin/certificates', icon: Award },
  { label: '자료 관리', href: '/admin/documents', icon: FileText },
  { label: '공지사항 관리', href: '/admin/notices', icon: Bell },
  { label: '문의 관리', href: '/admin/inquiries', icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/logo_black.png" alt="BANO" width={72} height={24} className="object-contain" />
          <span className="text-xs text-muted font-medium">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-6 py-2.5 text-sm transition-colors',
                active
                  ? 'text-accent font-medium bg-hover'
                  : 'text-secondary hover:text-foreground hover:bg-hover'
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-2 py-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <LogOut size={18} />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
