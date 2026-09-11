import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YourInteriorDesk | Premium Client & Designer Matchmaking',
  description: 'Connect with elite interior designers across India or register as a professional interior designer to receive client inquiries.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-[#D4AF37] selection:text-[#070D18]">
        {children}
      </body>
    </html>
  );
}
