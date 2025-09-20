
'use client';

import {
  Bell,
  Home,
  LineChart,
  Package,
  Package2,
  ShoppingCart,
  Users,
  PanelLeft,
  Search,
  ShieldCheck,
  LifeBuoy,
  LogOut,
  Settings,
  User,
  Moon,
  Sun,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '../ui/sidebar';
import SidebarNav from './sidebar';
import { useTheme } from 'next-themes';

type HeaderProps = {
  pageTitle: string;
};

export default function Header({ pageTitle }: HeaderProps) {
  const { setTheme, theme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs p-0">
          <SidebarNav />
        </SheetContent>
      </Sheet>

      <div className="flex-1">
        <h1 className="font-headline text-xl font-semibold tracking-tight">{pageTitle}</h1>
      </div>
      <div className="relative ml-auto flex items-center gap-2 md:grow-0">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
                aria-label="Open user menu"
            >
                <User />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
                </Link>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
