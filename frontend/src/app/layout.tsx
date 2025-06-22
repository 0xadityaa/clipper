import "~/styles/globals.css";

import { type Metadata } from "next";
import localFont from 'next/font/local';

export const metadata: Metadata = {
  title: "Clipper",
  description: "Generate viral and engaging clips from your videos",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const martianMono = localFont({
  src: './Martian_Mono.ttf',
  variable: '--font-martian-mono',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${martianMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
