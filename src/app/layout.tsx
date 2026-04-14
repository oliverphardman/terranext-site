import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const description =
	"An opinionated Terraform module to host your Next.js app on AWS without breaking the bank on compute. Built on OpenNext.";

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#7c3aed" },
		{ media: "(prefers-color-scheme: dark)", color: "#a78bfa" },
	],
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export const metadata: Metadata = {
	title: "TerraNext",
	description,
	manifest: "/manifest.webmanifest",
	metadataBase: new URL("https://terranext.dev"),
	openGraph: {
		title: "TerraNext",
		description,
		url: "https://terranext.dev",
		siteName: "TerraNext",
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "TerraNext",
		creator: "@oliverphardman",
		creatorId: "",
		description,
		images: [
			{
				url: "https://terranext.dev/twitter-image.png",
				width: 1200,
				height: 600,
				alt: "TerraNext - Next.js + OpenNext + Terraform + AWS",
			},
		],
	},
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/icon.svg", type: "image/svg+xml" },
			{ url: "/icon.png", type: "image/png", sizes: "512x512" },
		],
		apple: [{ url: "/apple-icon.png", sizes: "512x512" }],
	},
	appleWebApp: {
		title: "TerraNext",
		statusBarStyle: "default",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}>
			<body className="min-h-full flex flex-col">{children}</body>
		</html>
	);
}
