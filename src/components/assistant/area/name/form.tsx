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
  FormDescription,
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
    isLoading,
    setFormValues,
    setCenter,
    setOsmId,
    setGeoJson,
    setIsLoading,
    reset,
  } = useNameStore()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isSearching, setIsSearching] = React.useState(false)
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
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const query = `[out:json];relation(${osmId});out geom;`
      const url = `https://overpass.private.coffee/api/interpreter?data=${encodeURIComponent(query)}`

      const response = await fetch(url, {
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const overpassData = await response.json()
      clearTimeout(timeoutId)
      return overpassData
    } catch (error) {
      console.error("Error fetching data from Overpass API: ", error)
      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }

  async function onSubmit(values: NameFormSchema) {
    const currentOsmId = selectedLocation?.osmId || osmId

    if (currentOsmId) {
      const hasOsmIdChanged = currentOsmId !== osmId

      if (!hasOsmIdChanged && geoJson) {
        const geoJsonCopy = { ...geoJson }
        setGeoJson(geoJsonCopy)
        return
      }

      setIsLoading(true)

      try {
        const overpassData = await fetchOverpassData(currentOsmId)
        const geoJson = osm2geojson(overpassData)

        setFormValues(values)
        setOsmId(currentOsmId)
        setGeoJson(geoJson)
      } catch (error) {
        form.setError("name", {
          type: "manual",
          message: "Ein Fehler ist aufgetreten",
        })
      } finally {
        setIsLoading(false)
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
                          "justify-between border-input [&_svg:not([class*='text-'])]:text-muted-foreground hover:bg-transparent hover:text-foreground aria-invalid:transition-none",
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
                                  setCenter(adminEntry.center)
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
                  {form.formState.errors.name ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>
                      Stadt, Kreis oder Bundesland
                    </FormDescription>
                  )}
                </div>
              </FormItem>
            )}
          />
          <div className="mt-4 flex flex-col @md:flex-row @md:justify-between gap-4">
            <div className="flex gap-4">
              <Button type="submit" className="w-24" disabled={isLoading}>
                <span className={cn(isLoading && "animate-pulse")}>
                  Anzeigen
                </span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-24"
                disabled={!geoJson || isLoading || isSearching}
              >
                Bearbeiten
              </Button>
            </div>
            <Button
              type="button"
              variant="destructive"
              className="w-24"
              disabled={!geoJson || isLoading || isSearching}
              onClick={handleReset}
            >
              Entfernen
            </Button>
          </div>
          <Link
            href="/faq#gebiet"
            showArrow={true}
            openInNewTab={true}
            className="text-sm w-fit"
          >
            Mehr erfahren
          </Link>
        </form>
      </Form>
    </div>
  )
}
