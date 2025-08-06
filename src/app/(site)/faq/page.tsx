import type { Metadata } from "next"

import { Faq } from "@/components/faq/faq"

export const metadata: Metadata = {
  title: "FAQ",
}

export default function Page() {
  return (
    <div className="max-w-6xl mt-8 mx-auto px-4">
      <Faq />
    </div>
  )
}
