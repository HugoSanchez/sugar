import type { Metadata } from "next";
import { Providers } from "./providers";
import { IBM_Plex_Mono } from 'next/font/google'
import "./globals.css";

const ibm_plex_mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['100', '200', '300', '400', '500', '600', '700'] })

export const metadata: Metadata = {
	title: "minimal.xyz",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={ibm_plex_mono.className + " bg-gray-50"}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
