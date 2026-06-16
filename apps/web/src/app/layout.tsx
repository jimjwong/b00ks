import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "b00ks — Your books. Every device.",
  description:
    "Upload your EPUB and PDF books once, then read them on the web, iPhone, iPad or Android without being locked into a bookstore ecosystem.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
