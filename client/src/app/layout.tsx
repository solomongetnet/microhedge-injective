import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import ThemeWrapper from "./theme-wrapper";
import { Toaster } from "sonner";
import { Web3Provider } from "@/providers/web3.provider";
import { AuthProvider } from "@/providers/auth-provider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "MicroHedger Africa — Protect Your Farm Income",
  description:
    "AI-powered micro-hedging platform helping smallholder farmers protect their income from crop price volatility with blockchain technology.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full bg-white dark:bg-[#0A0A0A] overflow-x-hidden transition-colors duration-300`}
      >
        <Toaster
          position="top-center"
          duration={4000}
          toastOptions={{
            style: {
              borderRadius: "9999px", // Fully rounded corners
              background: "white",
              color: "black",
              padding: "1rem 2rem", // Add some padding for better appearance
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optional: add a subtle shadow
              zIndex: 1000,
            },
            className: "my-sonner-toast", // Optional: for additional custom CSS if needed
          }}
        />

        <Web3Provider>
          <AuthProvider>
            <ThemeWrapper>{children}</ThemeWrapper>
          </AuthProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
