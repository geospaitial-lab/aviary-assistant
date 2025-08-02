import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"

import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "aviary-assistant",
    template: "%s | aviary-assistant",
  },
  description: "Konfiguriere aviary im Web",
  keywords: [
    "aviary-assistant",
    "aviary",
    "geospaitial lab",
    "geospaitial-lab",
    "Westfälische Hochschule",
    "URBAN.KI",
  ],
  authors: [
    {
      name: "Marius Maryniak",
    },
  ],
  creator: "Marius Maryniak",
  publisher: "geospaitial lab",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  referrer: "no-referrer",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="de"
      className="motion-safe:scroll-smooth"
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
