// app/layout.tsx
import { PropsWithChildren } from "react";
import "./globals.css";
import Header from "./dashboard/_components/header";
import { AuthProvider } from "./_ctx/auth.ctx";
import SideBar from "./dashboard/_components/sidebar";
import { HeaderProvider } from "./_ctx/header.ctx";
import { Toaster } from "sonner";
export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html suppressHydrationWarning data-theme="caramellatte">
      <body>
        <Toaster />
        <AuthProvider>
          <HeaderProvider>
            <SideBar>
              <Header />
              <div className="p-4">{children}</div>
            </SideBar>
          </HeaderProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
