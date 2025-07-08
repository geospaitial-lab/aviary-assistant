"use client"

import * as React from "react"

import maplibregl, { LayerSpecification } from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import { useBoundingBoxStore } from "@/components/assistant/area/bounding-box/store"
import { useFileStore } from "@/components/assistant/area/file/store"
import { useNameStore } from "@/components/assistant/area/name/store"
import { useAreaStore } from "@/components/assistant/area/store"
import { bbox } from "@turf/bbox"
import { AllGeoJSON } from "@turf/helpers"

const CENTER: [number, number] = [10.4541231, 51.1846362]
const DEFAULT_ZOOM = 4
const GEOJSON_COLOR = "#155dfc"
const GEOJSON_LINE_WIDTH = 2
const GEOJSON_OPACITY = 0.2
const MIN_ZOOM = DEFAULT_ZOOM
const MAX_ZOOM = 18

export function Map() {
  const nameGeoJson = useNameStore((state) => state.geoJson)
  const fileGeoJson = useFileStore((state) => state.geoJson)
  const boundingBoxGeoJson = useBoundingBoxStore((state) => state.geoJson)
  const { activeTab } = useAreaStore()
  const mapContainer = React.useRef<HTMLDivElement>(null)
  const map = React.useRef<maplibregl.Map | null>(null)
  const sourceAdded = React.useRef<boolean>(false)
  const [prevActiveTab, setPrevActiveTab] = React.useState<string>(
    activeTab || "name",
  )

  const getCurrentGeoJson = (): AllGeoJSON | null => {
    switch (activeTab) {
      case "name":
        return nameGeoJson
      case "file":
        return fileGeoJson
      case "bounding-box":
        return boundingBoxGeoJson
      default:
        return null
    }
  }

  React.useEffect(() => {
    if (mapContainer.current && !map.current) {
      const currentGeoJson = getCurrentGeoJson()

      const mapOptions: maplibregl.MapOptions = {
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
            },
            ...(currentGeoJson && {
              geometry: {
                type: "geojson",
                data: currentGeoJson,
              },
            }),
          },
          layers: [
            {
              id: "osm-tiles",
              type: "raster",
              source: "osm",
            },
            ...(currentGeoJson
              ? [
                  {
                    id: "geometry-fill",
                    type: "fill",
                    source: "geometry",
                    paint: {
                      "fill-color": GEOJSON_COLOR,
                      "fill-opacity": GEOJSON_OPACITY,
                    },
                  } as LayerSpecification,
                  {
                    id: "geometry-line",
                    type: "line",
                    source: "geometry",
                    paint: {
                      "line-color": GEOJSON_COLOR,
                      "line-width": GEOJSON_LINE_WIDTH,
                    },
                  } as LayerSpecification,
                ]
              : []),
          ],
        },
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        dragRotate: false,
        touchZoomRotate: false,
        keyboard: false,
      }

      if (currentGeoJson) {
        try {
          const bounds = bbox(currentGeoJson)
          mapOptions.bounds = [
            [bounds[0], bounds[1]],
            [bounds[2], bounds[3]],
          ]
          mapOptions.fitBoundsOptions = {
            padding: 128,
          }
          sourceAdded.current = true
        } catch (error) {
          console.error("Error calculating initial bounds:", error)
          mapOptions.center = CENTER
          mapOptions.zoom = DEFAULT_ZOOM
        }
      } else {
        mapOptions.center = CENTER
        mapOptions.zoom = DEFAULT_ZOOM
      }

      map.current = new maplibregl.Map(mapOptions)
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  React.useEffect(() => {
    if (!map.current || !map.current.loaded()) return

    const currentGeoJson = getCurrentGeoJson()
    const tabChanged = prevActiveTab !== activeTab

    if (tabChanged) {
      setPrevActiveTab(activeTab)
    }

    if (!currentGeoJson) {
      if (sourceAdded.current && map.current.getSource("geometry")) {
        const emptyGeoJson = {
          type: "FeatureCollection",
          features: [],
        } as AllGeoJSON

        const source = map.current.getSource(
          "geometry",
        ) as maplibregl.GeoJSONSource
        source.setData(emptyGeoJson)
      }
      return
    }

    if (!sourceAdded.current) {
      map.current.addSource("geometry", {
        type: "geojson",
        data: currentGeoJson,
      })

      map.current.addLayer({
        id: "geometry-fill",
        type: "fill",
        source: "geometry",
        paint: {
          "fill-color": GEOJSON_COLOR,
          "fill-opacity": GEOJSON_OPACITY,
        },
      } as LayerSpecification)

      map.current.addLayer({
        id: "geometry-line",
        type: "line",
        source: "geometry",
        paint: {
          "line-color": GEOJSON_COLOR,
          "line-width": GEOJSON_LINE_WIDTH,
        },
      } as LayerSpecification)

      sourceAdded.current = true
    } else {
      try {
        const source = map.current.getSource(
          "geometry",
        ) as maplibregl.GeoJSONSource
        source.setData(currentGeoJson)
      } catch (error) {
        console.error("Error updating source:", error)
      }
    }

    try {
      const bounds = bbox(currentGeoJson)

      map.current.fitBounds(
        [
          [bounds[0], bounds[1]],
          [bounds[2], bounds[3]],
        ],
        {
          padding: 128,
          duration: 1000,
          linear: false,
        },
      )
    } catch (error) {
      console.error("Error calculating bounds:", error)
    }
  }, [activeTab, nameGeoJson, fileGeoJson, boundingBoxGeoJson, prevActiveTab])

  return <div ref={mapContainer} className="h-full w-full rounded-lg" />
}
