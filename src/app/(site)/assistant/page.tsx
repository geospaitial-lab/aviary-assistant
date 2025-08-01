import type { Metadata } from "next"

import { Assistant } from "@/components/assistant/assistant"

export const metadata: Metadata = {
  title: "Assistant",
}

export default function Page() {
  return (
    <div className="max-w-6xl mt-8 mx-auto px-4">
      <Assistant />
    </div>
  )
}
