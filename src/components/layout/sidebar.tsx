'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Smartphone, Bell, FileText, Wrench, BarChart2, Settings } from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Devices', href: '/devices', icon: Smartphone },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Content', href: '/content', icon: FileText },
  { name: 'Services', href: '/services', icon: Wrench },
  { name: 'Reports', href: '/reports', icon: BarChart2 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-sidebar min-h-screen">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center space-x-2 p-2 rounded-md text-sm text-white hover:bg-white/10 transition-colors',
                pathname === item.href && 'bg-white/10'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 