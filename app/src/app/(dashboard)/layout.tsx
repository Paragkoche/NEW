// app/layout.tsx
import { PropsWithChildren } from "react";
import "./globals.css";
import Header from "./dashboard/_components/header";
export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html suppressHydrationWarning data-theme="caramellatte">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
