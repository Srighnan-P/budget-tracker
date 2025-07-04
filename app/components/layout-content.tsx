'use client'

import { usePathname } from "next/navigation";
import Menu from "./Menu";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showMenu = pathname !== '/login';

  return (
    <div className="flex h-screen">
      {showMenu && <Menu />}
      <div className="flex-1 p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
} 