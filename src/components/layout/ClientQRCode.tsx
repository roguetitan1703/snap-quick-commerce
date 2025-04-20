"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import QRCodeComponent with no SSR to prevent hydration issues
const QRCode = dynamic(() => import("./QRCode"), {
  ssr: false,
  loading: () => (
    <div className="w-48 h-48 bg-gray-100 rounded animate-pulse"></div>
  ),
});

const ClientQRCode = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render on server
  if (!isMounted) {
    return null;
  }

  return <QRCode />;
};

export default ClientQRCode;
