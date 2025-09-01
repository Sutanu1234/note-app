import Image from "next/image";

export default function Home() {

  const isLogin = false;

  return (
    <>
      {!isLogin ? (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
          <h1 className="text-4xl font-bold mb-4">Welcome to Note App</h1>
          <p className="text-lg mb-8">Your personal note-taking application</p>
          <div className="flex space-x-4">
            <a
              href="/login"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login
            </a>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg mb-8">Access your notes and continue where you left off</p>
          <a
            href="/dashboard/home"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Dashboard
          </a>
        </div>
      )}
    </>
  );
}
