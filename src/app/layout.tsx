import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ResumeConfigProvider } from "@/context/resume-config";
import { CustomCursor } from "@/components/custom-cursor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
    title: "Dhruvi Patel - Portfolio",
    description: "Full Stack Developer Portfolio",
};

// Client Component wrapper logic moved to separate file to avoid conflict
import { AdminWrapper } from "@/components/admin-wrapper";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-background text-foreground selection:bg-primary/20 selection:text-primary overflow-x-hidden`} suppressHydrationWarning>
                <ResumeConfigProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <AdminWrapper>
                            <CustomCursor />
                            {children}
                        </AdminWrapper>
                    </ThemeProvider>
                </ResumeConfigProvider>
            </body>
        </html>
    );
}
