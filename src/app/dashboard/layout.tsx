import Header from '@/components/layout/header';
import SidebarNav from '@/components/layout/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="hidden md:block md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SidebarNav />
      </div>
      <div className="flex flex-col sm:gap-4 sm:py-4 md:pl-64">
        <Header pageTitle="Dashboard" />
        <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
