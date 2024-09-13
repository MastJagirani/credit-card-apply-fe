// components/layouts/DashboardLayout.tsx

import { ReactNode } from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <h1 className="text-xl font-bold mb-6">Dashboard</h1>
        <nav className="flex flex-col gap-4">
          {/* Remove the <a> tag inside the Link */}
          <Link href="/" className="hover:bg-gray-700 p-2 rounded">
            Credit Card Application
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between">
          <h2 className="text-xl font-semibold">Welcome to the Dashboard</h2>
          <button className="text-gray-800 hover:bg-gray-200 p-2 rounded">Logout</button>
        </header>

        {/* Page content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
