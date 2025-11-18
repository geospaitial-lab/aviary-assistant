/*
 * Copyright (C) 2025 Marius Maryniak
 *
 * This file is part of aviary-assistant.
 *
 * aviary-assistant is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * aviary-assistant is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with aviary-assistant.
 * If not, see <https://www.gnu.org/licenses/>.
 */
import { AggregationFaq } from "@/components/faq/aggregation-faq"
import { AreaFaq } from "@/components/faq/area-faq"
import { AssistantFaq } from "@/components/faq/assistant-faq"
import { AviaryFaq } from "@/components/faq/aviary-faq"
import { DataFaq } from "@/components/faq/data-faq"
import { ExportFaq } from "@/components/faq/export-faq"
import { ModelFaq } from "@/components/faq/model-faq"
import { PostprocessingFaq } from "@/components/faq/postprocessing-faq"
import { ResourcesFaq } from "@/components/faq/resources-faq"

export function Faq() {
  return (
    <div className="@container">
      <div className="@2xl:w-2/3 @2xl:mx-auto">
        <h2
          className="text-3xl font-bold tracking-tighter text-center mb-8"
          id="assistant"
        >
          FAQ
        </h2>
        <div className="space-y-16">
          <AssistantFaq />
          <AviaryFaq />
          <ModelFaq />
          <AreaFaq />
          <DataFaq />
          <ResourcesFaq />
          <PostprocessingFaq />
          <AggregationFaq />
          <ExportFaq />
        </div>
      </div>
    </div>
  )
}
