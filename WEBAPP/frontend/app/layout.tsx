import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "INSAT Heavy Rain Nowcasting",
  description: "AI-powered satellite rainfall prediction system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-slate-950 text-white">
        {children}
      </body>
    </html>
  );
}
