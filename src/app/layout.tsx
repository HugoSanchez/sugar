import type { Metadata } from "next";
import { IBM_Plex_Mono } from 'next/font/google';
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";

const ibm_plex_mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['100', '200', '300', '400', '500', '600', '700'] })

export const metadata: Metadata = {
	title: "reverv.xyz",
	description: "A minimal onchain publication platform",
};

export default function RootLayout({
	children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={ibm_plex_mono.className + " bg-gray-50"}>
				<ClientLayout>
					{children}
				</ClientLayout>
			</body>
		</html>
	);
}
