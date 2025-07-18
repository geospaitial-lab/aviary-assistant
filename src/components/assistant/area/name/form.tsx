"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { Check, ChevronDownIcon, Locate } from "lucide-react"
import osm2geojson from "osm2geojson-lite"

import {
  type NameFormSchema,
  nameFormSchema,
} from "@/components/assistant/area/name/schema"
import {
  type AdminEntry,
  initFuse,
  searchAdminEntries,
} from "@/components/assistant/area/name/search"
import { useNameStore } from "@/components/assistant/area/name/store"
import { Link } from "@/components/link"
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
  const {
    formValues,
    osmId,
    geoJson,
    setFormValues,
    setOsmId,
    setGeoJson,
    reset,
  } = useNameStore()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isSearching, setIsSearching] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<AdminEntry[]>([])
  const [selectedLocation, setSelectedLocation] =
    React.useState<AdminEntry | null>(null)

  const form = useForm<NameFormSchema>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: formValues || {
      name: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  React.useEffect(() => {
    void initFuse()
  }, [])

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

  const fetchOverpassData = async (osmId: number) => {
    try {
      const query = `[out:json];relation(${osmId});out geom;`
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching data from Overpass API: ", error)
      throw error
    }
  }

  async function onSubmit(values: NameFormSchema) {
    const currentOsmId = selectedLocation?.osmId || osmId

    if (currentOsmId) {
      setIsSubmitting(true)

      try {
        const overpassData = await fetchOverpassData(currentOsmId)
        const geoJson = osm2geojson(overpassData)

        setFormValues(values)
        setOsmId(currentOsmId)
        setGeoJson(geoJson)

        console.log(geoJson)
      } catch (error) {
        form.setError("name", {
          type: "manual",
          message: "Ein Fehler ist aufgetreten",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  function handleReset() {
    form.reset({
      name: "",
    })

    setSelectedLocation(null)
    setSearchQuery("")
    setSearchResults([])

    reset()
  }

  return (
    <div className="@container">
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
                <FormLabel className="pointer-events-none">Name</FormLabel>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between border-input [&_svg:not([class*='text-'])]:text-muted-foreground hover:bg-transparent hover:text-foreground",
                          isOpen
                            ? "dark:hover:bg-input/30"
                            : "dark:hover:bg-input/50",
                        )}
                      >
                        <div className="font-normal">{field.value || ""}</div>
                        <ChevronDownIcon
                          className="opacity-50"
                          aria-hidden="true"
                        />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-[1000]">
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
                          <CommandEmpty>
                            {searchQuery.length > 0 ? (
                              "Nichts gefunden"
                            ) : (
                              <span className="invisible">Nichts gefunden</span>
                            )}
                          </CommandEmpty>
                        ) : (
                          <CommandGroup>
                            {searchResults.map((adminEntry) => (
                              <CommandItem
                                key={adminEntry.osmId}
                                value={adminEntry.osmId.toString()}
                                onSelect={() => {
                                  form.setValue("name", adminEntry.name)
                                  setSelectedLocation(adminEntry)
                                  setIsOpen(false)
                                }}
                              >
                                <div className="flex flex-col">
                                  <span>{adminEntry.name}</span>
                                  {adminEntry.adminLevel !== 4 && (
                                    <span className="text-muted-foreground font-light">
                                      {adminEntry.state}
                                    </span>
                                  )}
                                </div>
                                {adminEntry.osmId === osmId ? (
                                  <>
                                    <Check
                                      className="ml-auto text-success"
                                      aria-hidden="true"
                                    />
                                    <span className="sr-only">Angezeigt</span>
                                  </>
                                ) : adminEntry.osmId ===
                                  selectedLocation?.osmId ? (
                                  <>
                                    <Locate
                                      className="ml-auto text-muted-foreground"
                                      aria-hidden="true"
                                    />
                                    <span className="sr-only">Ausgewählt</span>
                                  </>
                                ) : null}
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
          <div className="mt-4 flex flex-col @md:flex-row @md:justify-between gap-4">
            <div className="flex gap-4">
              <Button type="submit" className="w-24" disabled={isSubmitting}>
                <span className={cn(isSubmitting && "animate-pulse")}>
                  Anzeigen
                </span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-24"
                disabled={!geoJson}
              >
                Bearbeiten
              </Button>
            </div>
            <Button
              type="button"
              variant="destructive"
              className="w-24"
              disabled={!geoJson}
              onClick={handleReset}
            >
              Entfernen
            </Button>
          </div>
          <Link showArrow={true} className="text-sm">
            Mehr erfahren
          </Link>
        </form>
      </Form>
    </div>
  )
}
