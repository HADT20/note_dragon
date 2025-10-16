'use client';

import Link from 'next/link';
import { Home, Link as LinkIcon, QrCode, FileText, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    icon: Home,
    label: 'Trang chủ',
    href: '/'
  },
  {
    icon: LinkIcon,
    label: 'Rút Gọn Link',
    href: '/short-link'
  },
  {
    icon: QrCode,
    label: 'Tạo Mã QR',
    href: '/qr-code'
  },
  {
    icon: FileText,
    label: 'Tạo Ghi Chú',
    href: '/notes'
  },
  {
    icon: Settings,
    label: 'Quản lý',
    href: '/manage'
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#0a1e4a] border-r border-[#0a1e4a] flex flex-col">
      {/* Logo */}
      <div className="px-8 py-10">
        <Link href="/" className="block">
          <div className="text-5xl font-black text-[#4a9eff] tracking-wider" style={{ fontFamily: 'Arial Black, sans-serif' }}>
            Dragon
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-6 pt-4">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all relative ${
                    isActive
                      ? 'bg-[#0d2557] text-white'
                      : 'text-white/80 hover:bg-[#0d2557]/50 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-full"></div>
                  )}
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
