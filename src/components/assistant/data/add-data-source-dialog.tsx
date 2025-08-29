"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { Plus } from "lucide-react"
import { z } from "zod"

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
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channels: "rgb",
      type: "wms",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  })

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
                          <SelectItem value="rgb">RGB</SelectItem>
                          <SelectItem value="cir">CIR</SelectItem>
                          <SelectItem value="nir">NIR</SelectItem>
                          <SelectItem value="rgbi">RGBI</SelectItem>
                          <SelectItem value="dom">DOM</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <div className="min-h-[1.25rem]" />
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
                          <SelectItem value="wms">WMS</SelectItem>
                          <SelectItem value="vrt">VRT</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <div className="min-h-[1.25rem]" />
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
