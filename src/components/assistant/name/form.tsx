"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { Check, ChevronsUpDown } from "lucide-react"

import {
  type NameFormSchema,
  nameFormSchema,
} from "@/components/assistant/name/schema"
import {
  type AdminEntry,
  searchAdminEntries,
} from "@/components/assistant/name/search"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"

export function NameForm() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isSearching, setIsSearching] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<AdminEntry[]>([])
  const [selectedLocation, setSelectedLocation] =
    React.useState<AdminEntry | null>(null)

  const form = useForm<NameFormSchema>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: {
      name: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  const handleSearch = React.useCallback(async (value: string) => {
    setSearchQuery(value)

    if (value.length < 1) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    try {
      const results = await searchAdminEntries(value)
      setSearchResults(results)
    } catch (error) {
      console.error("Error searching admin entries:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  function onSubmit(data: NameFormSchema) {
    if (selectedLocation) {
      console.log(selectedLocation.osm_id)
    }
  }

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <div>{field.value || ""}</div>
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Suchen..."
                      value={searchQuery}
                      onValueChange={handleSearch}
                    />
                    <CommandList>
                      {isSearching ? (
                        <CommandEmpty>Suche läuft...</CommandEmpty>
                      ) : searchResults.length === 0 ? (
                        <CommandEmpty>Nichts gefunden</CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {searchResults.map((adminEntry) => (
                            <CommandItem
                              key={adminEntry.osm_id}
                              value={adminEntry.osm_id.toString()}
                              onSelect={() => {
                                form.setValue("name", adminEntry.name)
                                setSelectedLocation(adminEntry)
                                setIsOpen(false)
                              }}
                            >
                              <div className="flex flex-col">
                                <span>{adminEntry.name}</span>
                                {adminEntry.admin_level !== 4 && (
                                  <span className="text-muted-foreground font-light">
                                    {adminEntry.state}
                                  </span>
                                )}
                              </div>
                              <Check
                                className={cn(
                                  "ml-auto text-success",
                                  adminEntry.name === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="min-h-[1.25rem]">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">Anzeigen</Button>
      </form>
    </Form>
  )
}
