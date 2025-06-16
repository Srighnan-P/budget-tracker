'use client'
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";


export default function Home() {
  const {data:session, status} = useSession();

  console.log('Session:', session?.expires);
  console.log('Status:', status);

  if (status === 'loading') {
    return <div className="text-white">Loading...</div>;
  }

  if (session?.user) {
    return (
    <div className="text-white">
      Welcome Home Page
    </div>
    );
  }
  else {
    redirect('/login');
  }

}
