'use client';

import {
  Bell,
  Home,
  Newspaper,
  ShieldAlert,
  ShieldCheck,
  Bookmark,
  ScanSearch,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

export default function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard',
      icon: Home,
      label: 'Dashboard',
    },
    {
      href: '/dashboard/incidents',
      icon: ShieldAlert,
      label: 'Incidents',
    },
    {
      href: '/dashboard/detections',
      icon: ScanSearch,
      label: 'Detections',
    },
     {
      href: '/dashboard/threats',
      icon: BarChart3,
      label: 'Threats',
    },
    {
      href: '/dashboard/news',
      icon: Newspaper,
      label: 'News Feed',
    },
    {
      href: '/dashboard/news/saved',
      icon: Bookmark,
      label: 'Saved News',
    },
  ];

  return (
    <nav className="flex h-full flex-col bg-card text-card-foreground shadow-lg">
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-headline text-lg font-semibold"
        >
          <ShieldCheck className="h-7 w-7 text-primary" />
          <span>CiberSeg Vistazo</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <div className="flex-1">
          <ul className="grid items-start px-4 text-sm font-medium">
            {navItems.map(({ href, icon: Icon, label }) => (
              <li key={label}>
                <Link href={href}>
                  <Button
                    variant={pathname.startsWith(href) ? 'default' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
