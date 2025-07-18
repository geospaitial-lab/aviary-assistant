import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"

import { DevAlert } from "@/components/dev-alert"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "aviary-assistant",
  description: "Konfiguriere aviary im Web",
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
        <DevAlert />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1 mb-32">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
