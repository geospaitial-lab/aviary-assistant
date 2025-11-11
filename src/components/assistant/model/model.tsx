"use client"

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
import * as React from "react"

import { ModelForm, ModelFormRef } from "@/components/assistant/model/form"

function ModelHeadings() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tighter text-center text-balance mb-2">
        Was soll erkannt werden?
      </h1>

      <h2 className="text-lg font-semibold text-muted-foreground text-center text-balance mb-8">
        Wähle die Modelle, die zur Auswertung verwendet werden sollen
      </h2>
    </>
  )
}

export const Model = React.forwardRef<ModelFormRef>(function Model(_, ref) {
  const [isHydrated, setIsHydrated] = React.useState(false)
  const formRef = React.useRef<React.ComponentRef<typeof ModelForm>>(null)

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  const validateForm = React.useCallback(async () => {
    if (formRef.current) {
      return await formRef.current.validate()
    }
    return false
  }, [formRef])

  React.useImperativeHandle(
    ref,
    () => ({
      validate: validateForm,
    }),
    [validateForm],
  )

  if (!isHydrated) {
    return (
      <div className="@container">
        <div className="@2xl:w-2/3 @2xl:mx-auto">
          <ModelHeadings />
        </div>
      </div>
    )
  }

  return (
    <div className="@container">
      <div className="@2xl:w-2/3 @2xl:mx-auto">
        <ModelHeadings />

        <div className="p-4 border-2 rounded-lg">
          <ModelForm ref={formRef} />
        </div>
      </div>
    </div>
  )
})
