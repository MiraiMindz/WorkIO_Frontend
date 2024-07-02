import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";
import { UserContextWrapper } from "./contexts/wrappers/UserContextWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "WorkIO",
    description: "WorkIO",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} w-screen h-screen scroll-smooth`}>
                <Script src="https://cdn.jsdelivr.net/npm/node-forge@latest/dist/forge.all.min.js" />
                <Script src="https://code.jquery.com/jquery-3.7.1.min.js" />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange={false}
                >
                    <UserContextWrapper>
                        <div className="w-full h-full bg-neutral-50 dark:bg-neutral-950 transition-all">
                            {children}
                        </div>
                    </UserContextWrapper>
                </ThemeProvider>
            </body>
        </html>
    );
}
