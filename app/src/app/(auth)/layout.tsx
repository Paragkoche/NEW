// app/layout.tsx
import { PropsWithChildren } from "react";
import "./globals.css";
import { AuthProvider } from "../(dashboard)/_ctx/auth.ctx";
import { Toaster } from "sonner";
export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html suppressHydrationWarning data-theme="caramellatte">
      <body>
        <Toaster />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
