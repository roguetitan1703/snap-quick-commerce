"use client";

import React from "react";
import { usePathname } from "next/navigation";
import NavBar from "./NavBar";
import BottomNav from "./BottomNav";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const hideBottomNav = pathname === "/cart" || pathname === "/checkout";

  return (
    <>
      <NavBar />
      <main
        className={`flex-grow overflow-auto ${!hideBottomNav ? "pb-16" : ""}`}
      >
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </>
  );
};

export default ClientLayout;
