// app/layout.tsx
import './globals.css';
import { SupabaseProvider } from '@/components/SupabaseProvider';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"
import PWARegister from '@/components/PWARegister';

export const metadata = {
  title: 'QR Pay',
  description: 'Scan. Pay. Done.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#1E3A8A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-neutral min-h-screen font-inter">
        <SupabaseProvider>
          <Navbar/>
          {children}
          <Footer/>
          <PWARegister />
        </SupabaseProvider>
      </body>
    </html>
  );
}