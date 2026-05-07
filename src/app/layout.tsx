import MyContextProvider from "@/lib/MyContextProvider";
import SessionProviderForNextAuth from "@/nextAuth/SessionProviderForNextAuth";
import ReduxStoreProvider from "@/redux/ReduxStoreProvider";
import type { Metadata } from "next";
import { DM_Sans, Goldman } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
// import AntDConfigProvider from "@/lib/AntDConfigProvider";

const goldman = Goldman({
  weight: ["400", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-goldman",
});
const dm_sans = DM_Sans({
  weight: ["400", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  fallback: ["sans-serif"],
});

export const metadata: Metadata = {
  title: "CarClickni",
  description: "Your Ultimate Car Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`
          ${goldman.variable}
          ${dm_sans.variable}
         antialiased`}
      >
        <MyContextProvider>
          <SessionProviderForNextAuth>
            <ReduxStoreProvider>
              {/* <AntDConfigProvider> */}
                <Toaster />
                {children}
              {/* </AntDConfigProvider> */}
            </ReduxStoreProvider>
          </SessionProviderForNextAuth>
        </MyContextProvider>
      </body>
    </html>
  );
}
