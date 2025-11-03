import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootProviders from "./providers";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "x402 • Sushi API",
  description: "x402 Sushi API — Payment-gated swap API powered by x402. Fast quotes & transactions with price and token endpoints.",
  openGraph: {
    title: "x402 • Sushi API",
    description: "Payment-gated swap API powered by x402. Fast quotes & transactions with price and token endpoints.",
    url: "https://x402-sushi.vercel.app",
    siteName: "x402 Sushi API",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "x402 Sushi API" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "x402 • Sushi API",
    description: "Payment-gated swap API powered by x402.",
    images: ["/og.png"]
  },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.variable} antialiased`}>
				<RootProviders>{children}</RootProviders>
			</body>
		</html>
	);
}
