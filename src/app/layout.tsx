import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Notes - VN - Trang web khởi tạo ghi chú và rút gọn link",
  description: "Trang web khởi tạo ghi chú và rút gọn link",
  keywords: "Notes - VN, notepad, qrcode, short link",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getInitialColorMode() {
                  return localStorage.getItem('dark-theme');
                }
                const className = 'dark';
                const bodyClass = document.body.classList;
                getInitialColorMode()==='true' ? bodyClass.add(className) : bodyClass.remove(className);
              })()
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
