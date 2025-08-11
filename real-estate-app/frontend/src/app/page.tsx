import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans flex items-center justify-center min-h-screen px-6 bg-gray-50 dark:bg-gray-900">
      <main className="flex flex-col items-center text-center gap-8 max-w-xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white leading-tight">
          Welcome to Silversjö Real Estate
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          Discover your next home, investment, or getaway. Built for simplicity,
          security, and scale.
        </p>

        <Link
          href="/login"
          className="inline-block rounded-full bg-blue-600 text-white hover:bg-blue-700 transition px-6 py-3 text-base font-medium"
        >
          Log In to Get Started
        </Link>
      </main>
    </div>
  );
}
