"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import NavBar from "./NavBar";
import BottomNav from "./BottomNav";
import { AuthProvider } from "@/contexts/AuthContext";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [hideBottomNav, setHideBottomNav] = useState(false);

  // Handle client-side operations in useEffect to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setHideBottomNav(pathname === "/cart" || pathname === "/checkout");
  }, [pathname]);

  // Render a simpler version on server to avoid hydration issues
  if (!mounted) {
    return (
      <AuthProvider>
        <div className="min-h-screen">{children}</div>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <NavBar />
      <main
        className={`flex-grow overflow-auto ${!hideBottomNav ? "pb-16" : ""}`}
      >
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </AuthProvider>
  );
};

export default ClientLayout;
