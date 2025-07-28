import "@/app/globals.css"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function AssistantLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </>
  )
}
