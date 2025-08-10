import { Toaster } from "sonner";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50 p-4">
          {children}
          <Toaster richColors position="bottom-right" />
        </main>
      </body>
    </html>
  );
}
