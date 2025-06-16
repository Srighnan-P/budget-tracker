'use client'
import {signIn, useSession} from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


function handleSignIn() {
    signIn('google', {callbackUrl: '/'});
  }

export default function LoginPage() {
  const {data: session, status} = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Welcome</h1>
        <button
          className="flex items-center justify-center gap-3 px-6 py-3 bg-white dark:bg-gray-100 text-gray-800 rounded-lg border border-gray-300 hover:shadow-md hover:bg-gray-300 transition "
          onClick={handleSignIn}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.2H272v95.1h146.9c-6.4 34.7-25.8 64.1-54.9 83.8l88.6 68.9c51.7-47.7 81.9-118.1 81.9-197.6z"
              fill="#4285f4"
            />
            <path
              d="M272 544.3c73.7 0 135.6-24.4 180.8-66.2l-88.6-68.9c-24.6 16.5-56.2 26.3-92.2 26.3-70.9 0-131-47.9-152.5-112.1l-90.5 69.9c44.4 88.1 135.8 150.9 243 150.9z"
              fill="#34a853"
            />
            <path
              d="M119.5 323.4c-10.2-30.4-10.2-62.9 0-93.3l-90.5-69.9c-39.4 77.3-39.4 168.8 0 246.1l90.5-69.9z"
              fill="#fbbc04"
            />
            <path
              d="M272 107.7c38.3-.6 74.8 13.6 102.6 38.7l76.4-76.4C397.2 24.4 335.3 0 261.6 0 154.4 0 63 62.8 18.6 150.9l90.5 69.9C141 155.6 201.1 107.7 272 107.7z"
              fill="#ea4335"
            />
          </svg>
          <span className="font-medium">Sign up with Google</span>
        </button>
      </div>
    </div>
  );
}
