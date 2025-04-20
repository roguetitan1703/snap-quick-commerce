"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

// Using an image component initially for faster page load
const QRCodeComponent = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [mounted, setMounted] = useState(false);
  const [QRCodeCanvas, setQRCodeCanvas] = useState<any>(null);
  const [networkIP, setNetworkIP] = useState("");
  const [allIPs, setAllIPs] = useState<string[]>([]);
  const [showIPSelector, setShowIPSelector] = useState(false);

  // Improved function to get network IP addresses using WebRTC
  const getNetworkIPs = () => {
    return new Promise<string[]>((resolve) => {
      // Compatibility for Firefox and Chrome
      const RTCPeerConnection =
        window.RTCPeerConnection ||
        (window as any).mozRTCPeerConnection ||
        (window as any).webkitRTCPeerConnection;

      if (!RTCPeerConnection) {
        resolve([]);
        return;
      }

      const ips: string[] = [];
      // Create multiple STUN server entries to improve IP detection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
        ],
      });

      pc.createDataChannel("");

      // Set timeout to ensure we don't hang if something goes wrong
      const timeout = setTimeout(() => {
        pc.close();
        resolve(ips);
      }, 3000);

      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch(() => {
          clearTimeout(timeout);
          pc.close();
          resolve([]);
        });

      pc.onicecandidate = (event) => {
        if (!event.candidate) {
          clearTimeout(timeout);
          pc.close();
          resolve(ips);
          return;
        }

        const candidate = event.candidate.candidate;
        const ipMatch = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(candidate);

        if (
          ipMatch &&
          ipMatch[1] &&
          !ips.includes(ipMatch[1]) &&
          ipMatch[1] !== "0.0.0.0" &&
          ipMatch[1] !== "127.0.0.1"
        ) {
          // Prioritize actual IPv4 addresses from the local network
          // Common private network ranges
          if (
            ipMatch[1].startsWith("192.168.") ||
            ipMatch[1].startsWith("10.") ||
            (ipMatch[1].startsWith("172.") &&
              parseInt(ipMatch[1].split(".")[1]) >= 16 &&
              parseInt(ipMatch[1].split(".")[1]) <= 31)
          ) {
            console.log("Found local IP:", ipMatch[1]);
            ips.push(ipMatch[1]);
          }
        }
      };
    });
  };

  // Fallback method using window.RTCPeerConnection directly
  const getLocalIPAddressSimple = async () => {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pc.createDataChannel("");

      let localIP = "";
      pc.createOffer().then((offer) => {
        if (!offer || !offer.sdp) {
          return "";
        }

        const regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/g;
        const matches = offer.sdp.match(regex) || [];

        // Filter out localhost and link-local addresses
        const validIPs = matches.filter(
          (ip) =>
            !ip.startsWith("0.0.0.0") &&
            !ip.startsWith("127.") &&
            !ip.startsWith("169.254.")
        );

        if (validIPs.length > 0) {
          // Prioritize private network IPs
          const privateIPs = validIPs.filter(
            (ip) =>
              ip.startsWith("192.168.") ||
              ip.startsWith("10.") ||
              (ip.startsWith("172.") &&
                parseInt(ip.split(".")[1]) >= 16 &&
                parseInt(ip.split(".")[1]) <= 31)
          );

          localIP = privateIPs.length > 0 ? privateIPs[0] : validIPs[0];
        }

        setTimeout(() => {
          pc.close();
        }, 500);

        return localIP;
      });
    } catch (e) {
      console.error("Failed to get IP via RTCPeerConnection:", e);
      return null;
    }
  };

  // Method to get the host's network interfaces (Windows specific)
  const getWindowsNetworkIP = async () => {
    // On Windows, we can try a different approach using a network connection
    try {
      // Try to make a websocket connection that will fail but expose the local IP
      const socket = new WebSocket("ws://8.8.8.8");

      // This will intentionally fail
      await new Promise((resolve) => {
        socket.onerror = () => resolve(null);
        setTimeout(resolve, 100);
      });

      // Check what IP was used for the connection attempt
      const localAddress = socket.url;

      // Close the connection
      socket.close();

      console.log("Local address from WebSocket:", localAddress);
      return null; // We don't actually get the IP this way in most browsers
    } catch (e) {
      console.error("Failed to get Windows network IP:", e);
      return null;
    }
  };

  // Use a manual IP if needed
  const setManualIP = (ip: string) => {
    setNetworkIP(ip);

    // Create URL using the selected IP
    const port = window.location.port ? `:${window.location.port}` : "";
    const protocol = window.location.protocol;
    const path = window.location.pathname + window.location.search;

    const url = `${protocol}//${ip}${port}${path}`;
    console.log("Manual QR Code URL:", url);
    setCurrentUrl(url);

    // Hide selector after selection
    setShowIPSelector(false);
  };

  // Update the detection function to try all methods
  const detectIPAndCreateURL = async () => {
    if (typeof window === "undefined") return;

    try {
      let ipToUse = window.location.hostname;
      let ips: string[] = [];

      // Don't use 0.0.0.0 or localhost
      if (
        ipToUse === "0.0.0.0" ||
        ipToUse === "localhost" ||
        ipToUse === "127.0.0.1"
      ) {
        // Try WebRTC method first (most reliable for local network)
        try {
          ips = await getNetworkIPs();
          console.log("Detected network IPs (WebRTC):", ips);

          // Filter out any localhost-like addresses
          ips = ips.filter(
            (ip) =>
              !ip.startsWith("127.") &&
              !ip.startsWith("0.") &&
              ip !== "localhost"
          );

          // Save all IPs for manual selection
          if (ips.length > 0) {
            setAllIPs(ips);
            // Use the first valid IP (usually the most likely to work)
            ipToUse = ips[0];
          }
        } catch (webrtcError) {
          console.error("WebRTC IP detection failed:", webrtcError);
        }

        // If we couldn't find a local IP, try Windows-specific method
        if (ips.length === 0) {
          const windowsIP = await getWindowsNetworkIP();
          if (windowsIP) {
            console.log("Detected Windows IP:", windowsIP);
            ipToUse = windowsIP;
          }
        }

        // As a last resort, try the simple RTCPeerConnection method
        if (ips.length === 0) {
          const simpleIP = await getLocalIPAddressSimple();
          if (simpleIP) {
            console.log("Detected simple IP:", simpleIP);
            ipToUse = simpleIP;
          }
        }

        // If all local network detection failed, try public IP
        if (
          ipToUse === "0.0.0.0" ||
          ipToUse === "localhost" ||
          ipToUse === "127.0.0.1"
        ) {
          try {
            const res = await fetch("https://api.ipify.org?format=json", {
              cache: "no-store",
            });
            if (res.ok) {
              const data = await res.json();
              if (data.ip) {
                console.log(
                  "Detected public IP (not ideal for local access):",
                  data.ip
                );
                ipToUse = data.ip;
              }
            }
          } catch (ipifyError) {
            console.error("Error fetching public IP:", ipifyError);
          }
        }
      }

      setNetworkIP(ipToUse);

      // Create URL using the detected IP
      const port = window.location.port ? `:${window.location.port}` : "";
      const protocol = window.location.protocol;
      const path = window.location.pathname + window.location.search;

      const url = `${protocol}//${ipToUse}${port}${path}`;
      console.log("Generated QR Code URL:", url);
      setCurrentUrl(url);

      // If we have multiple IPs, show the selector
      if (ips.length > 1) {
        setShowIPSelector(true);
      }
    } catch (error) {
      console.error("Error detecting IP:", error);
      // Fallback to current URL
      setCurrentUrl(window.location.href);
    }
  };

  useEffect(() => {
    // Only load the QR code library client-side
    const loadQRCode = async () => {
      try {
        const qrcode = await import("qrcode.react");
        setQRCodeCanvas(() => qrcode.QRCodeCanvas);
      } catch (err) {
        console.error("Failed to load QR code library:", err);
      }
    };

    setMounted(true);

    if (typeof window !== "undefined") {
      const checkIfDesktop = () => {
        setIsDesktop(window.innerWidth >= 768);
      };

      checkIfDesktop();
      window.addEventListener("resize", checkIfDesktop);
      loadQRCode();
      detectIPAndCreateURL();

      return () => {
        window.removeEventListener("resize", checkIfDesktop);
      };
    }
  }, []);

  // Don't render anything on server or if not mounted
  if (!mounted) return null;

  // Don't render on mobile
  if (!isDesktop) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="text-center">
          <h3 className="text-gray-800 font-semibold text-lg mb-4">
            📱 Open on Mobile
          </h3>

          <div className="relative group">
            {currentUrl && QRCodeCanvas ? (
              <QRCodeCanvas
                value={currentUrl}
                size={192}
                className="mx-auto rounded-lg transition-all duration-300 group-hover:scale-105"
                level="H"
                includeMargin={true}
                bgColor="#FFFFFF"
                fgColor="#000000"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-100 rounded-lg animate-pulse mx-auto"></div>
            )}
          </div>

          <p className="text-gray-600 text-sm mt-4">
            Scan to continue browsing on your phone
          </p>

          {/* Show network details and IP selector */}
          <div className="mt-2">
            <p className="text-xs text-gray-400">Current IP: {networkIP}</p>

            {showIPSelector && allIPs.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-600">
                  Not working? Try another IP:
                </p>
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  {allIPs.map((ip) => (
                    <button
                      key={ip}
                      onClick={() => setManualIP(ip)}
                      className={`text-xs px-2 py-1 rounded ${
                        ip === networkIP
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {ip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-1 break-all">
              URL: {currentUrl}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeComponent;
