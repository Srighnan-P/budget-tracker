'use client'
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Menu from "./components/Menu";


export default function Home({children}: {children: React.ReactNode}) {
  const {data:session, status} = useSession();

  console.log('Session:', session?.expires);
  console.log('Status:', status);

  if (status === 'loading') {
    return <div className="text-white">Loading...</div>;
  }

  if (session?.user) {
    return (
    <div className="flex h-screen">
      <Menu />
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
    );
  }
  else {
    redirect('/login');
  }

}
