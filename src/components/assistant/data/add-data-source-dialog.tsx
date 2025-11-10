"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { Plus } from "lucide-react"
import { z } from "zod"

import { useDataStore } from "@/components/assistant/data/store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"

export type ChannelsType = "rgb" | "cir" | "nir" | "rgbi" | "dom"
export type TypeType = "wms" | "vrt"

const ALL_CHANNELS: ChannelsType[] = ["rgb", "cir", "nir", "rgbi", "dom"]

const VALID_CHANNELS_COMBINATIONS = [
  "rgb",
  "cir",
  "nir",
  "rgbi",
  "dom",
  "cir-rgb",
  "nir-rgb",
  "dom-rgb",
  "cir-dom",
  "dom-nir",
  "dom-rgbi",
  "cir-dom-rgb",
  "dom-nir-rgb",
]

const formSchema = z.object({
  channels: z.enum(["rgb", "cir", "nir", "rgbi", "dom"]),
  type: z.enum(["wms", "vrt"]),
})

type FormSchema = z.infer<typeof formSchema>

export interface AddDataSourceDialogProps {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  onAddAction: (channels: ChannelsType, type: TypeType) => void
}

export function AddDataSourceDialog({
  open,
  onOpenChangeAction,
  onAddAction,
}: AddDataSourceDialogProps) {
  const { dataSources } = useDataStore()

  const existingChannels = React.useMemo(
    () => dataSources.map((dataSource) => dataSource.channels),
    [dataSources],
  )

  const isChannelsDisabled = React.useCallback(
    (channels: ChannelsType) => {
      if (existingChannels.includes(channels)) {
        return true
      }

      const potentialCombination = [...existingChannels, channels]

      if (potentialCombination.length > 3) {
        return true
      }

      const combinationKey = [...potentialCombination].sort().join("-")

      return !VALID_CHANNELS_COMBINATIONS.includes(combinationKey)
    },
    [existingChannels],
  )

  const defaultChannels = React.useMemo(() => {
    const firstValidChannel = ALL_CHANNELS.find(
      (channel) => !isChannelsDisabled(channel),
    )
    return firstValidChannel || "rgb"
  }, [isChannelsDisabled, existingChannels])

  function getDefaultType(channels: ChannelsType): TypeType {
    return channels === "rgbi" ? "vrt" : "wms"
  }

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channels: defaultChannels,
      type: getDefaultType(defaultChannels),
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  })

  const selectedChannels = form.watch("channels")

  React.useEffect(() => {
    if (open) {
      form.reset({
        channels: defaultChannels,
        type: getDefaultType(defaultChannels),
      })
    }
  }, [open, defaultChannels, form])

  React.useEffect(() => {
    if (selectedChannels === "rgbi" && form.getValues("type") !== "vrt") {
      form.setValue("type", "vrt")
    } else if (
      selectedChannels !== "rgbi" &&
      form.getValues("type") === "vrt"
    ) {
      form.setValue("type", "wms")
    }
  }, [selectedChannels, form])

  function onSubmit(values: FormSchema) {
    onAddAction(values.channels, values.type)
    form.reset()
    onOpenChangeAction(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Plus aria-hidden="true" />
              Neue Datenquelle hinzufügen
            </div>
          </DialogTitle>
          <DialogDescription>Wähle die Kanäle und den Typ.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            autoComplete="off"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 grid-cols-1">
              <FormField
                control={form.control}
                name="channels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kanäle</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="rgb"
                            disabled={isChannelsDisabled("rgb")}
                          >
                            RGB
                          </SelectItem>
                          <SelectItem
                            value="cir"
                            disabled={isChannelsDisabled("cir")}
                          >
                            CIR
                          </SelectItem>
                          <SelectItem
                            value="nir"
                            disabled={isChannelsDisabled("nir")}
                          >
                            NIR
                          </SelectItem>
                          <SelectItem
                            value="rgbi"
                            disabled={isChannelsDisabled("rgbi")}
                          >
                            RGBI
                          </SelectItem>
                          <SelectItem
                            value="dom"
                            disabled={isChannelsDisabled("dom")}
                          >
                            DOM
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Typ</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="wms"
                            disabled={selectedChannels === "rgbi"}
                          >
                            WMS
                          </SelectItem>
                          <SelectItem value="vrt">VRT</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Abbrechen
            </Button>
          </DialogClose>
          <Button type="button" onClick={form.handleSubmit(onSubmit)}>
            Hinzufügen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
