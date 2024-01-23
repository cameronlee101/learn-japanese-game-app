import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar/Sidebar";
import { Roboto } from "next/font/google";

export const metadata: Metadata = {
  title: "Genki Study Tool",
  description: "Generated by create next app",
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: "300",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} bg-color flex min-h-screen relative user-select-none`}
      >
        <div
          id="modal-root"
          style={{ zIndex: 50 }}
          data-test="modal-root"
        ></div>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
