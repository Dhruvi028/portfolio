import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Dhruvi Shah | Full Stack Developer",
  description: "Portfolio of Dhruvi Shah, Full Stack Developer building scalable web apps.",
  keywords: ["Dhruvi Shah", "Full Stack Developer", "React", "Next.js", "Vue.js", "Node.js", "Laravel", "NestJS", "Software Engineer"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Dhruvi Shah",
  "jobTitle": "Full Stack Developer",
  "url": "https://dhruvi-shah.vercel.app/",
  "sameAs": [
    "https://www.linkedin.com/in/dhruvi-shah-b52b301a1",
    "https://github.com/Dhruvi028"
  ],
  "knowsAbout": [
    "React.js", "Next.js", "Vue.js", "TypeScript", "Tailwind CSS",
    "Node.js", "Python", "Laravel", "NestJS", "FastAPI",
    "PostgreSQL", "MongoDB", "AWS", "Docker", "REST APIs", "WebSockets", "Stripe API", "Payment Integrations",
    "Automotive Tech", "SaaS", "Social Care Tech", "Maritime / Shipping", "E-Commerce", "IoT / Telemetry", "Entertainment / Media"
  ],
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "Gov. Engineering College",
    "sameAs": "https://www.gec.ac.in/"
  },
  "worksFor": [
    {
      "@type": "Organization",
      "name": "Alternative Digital Solutions"
    },
    {
      "@type": "Organization",
      "name": "BuildnBoost"
    },
    {
      "@type": "Organization",
      "name": "TMedia Business Solutions"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
