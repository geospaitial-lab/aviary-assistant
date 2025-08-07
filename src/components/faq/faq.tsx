import { AreaFaq } from "@/components/faq/area-faq"
import { AssistantFaq } from "@/components/faq/assistant-faq"
import { AviaryFaq } from "@/components/faq/aviary-faq"
import { DataFaq } from "@/components/faq/data-faq"
import { ExportFaq } from "@/components/faq/export-faq"
import { ModelFaq } from "@/components/faq/model-faq"
import { ResourcesFaq } from "@/components/faq/resources-faq"

export function Faq() {
  return (
    <div className="@container">
      <div className="@2xl:w-2/3 @2xl:mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter mb-8" id="assistant">
          FAQ
        </h2>
        <div className="space-y-16">
          <AssistantFaq />
          <AviaryFaq />
          <ModelFaq />
          <AreaFaq />
          <DataFaq />
          <ResourcesFaq />
          <ExportFaq />
        </div>
      </div>
    </div>
  )
}
