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
const MAX_FIT_ZOOM = 12
const MAX_ZOOM = 18
const MIN_ZOOM = DEFAULT_ZOOM

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
          },
          layers: [
            {
              id: "osm-tiles",
              type: "raster",
              source: "osm",
            },
          ],
        },
        center: CENTER,
        zoom: DEFAULT_ZOOM,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        keyboard: false,
      }

      map.current = new maplibregl.Map(mapOptions)
      map.current.dragRotate.disable()
      map.current.touchZoomRotate.disableRotation()
      map.current.touchPitch.disable()
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  React.useEffect(() => {
    const mapInstance = map.current

    if (!mapInstance) return

    const handleMapLoaded = () => {
      const currentGeoJson = getCurrentGeoJson()
      const tabChanged = prevActiveTab !== activeTab

      if (tabChanged) {
        setPrevActiveTab(activeTab)
      }

      if (!currentGeoJson) {
        if (sourceAdded.current && mapInstance.getSource("geometry")) {
          const emptyGeoJson = {
            type: "FeatureCollection",
            features: [],
          } as AllGeoJSON

          try {
            const source = mapInstance.getSource(
              "geometry",
            ) as maplibregl.GeoJSONSource
            source.setData(emptyGeoJson)
          } catch (error) {
            console.error("Error updating empty source:", error)
          }
        }
        return
      }

      if (!sourceAdded.current) {
        try {
          mapInstance.addSource("geometry", {
            type: "geojson",
            data: currentGeoJson,
          })

          mapInstance.addLayer({
            id: "geometry-fill",
            type: "fill",
            source: "geometry",
            paint: {
              "fill-color": GEOJSON_COLOR,
              "fill-opacity": GEOJSON_OPACITY,
            },
          } as LayerSpecification)

          mapInstance.addLayer({
            id: "geometry-line",
            type: "line",
            source: "geometry",
            paint: {
              "line-color": GEOJSON_COLOR,
              "line-width": GEOJSON_LINE_WIDTH,
            },
          } as LayerSpecification)

          sourceAdded.current = true
        } catch (error) {
          console.error("Error adding source:", error)
        }
      } else {
        try {
          const source = mapInstance.getSource(
            "geometry",
          ) as maplibregl.GeoJSONSource
          source.setData(currentGeoJson)
        } catch (error) {
          console.error("Error updating source:", error)
        }
      }

      try {
        const bounds = bbox(currentGeoJson)

        mapInstance.fitBounds(
          [
            [bounds[0], bounds[1]],
            [bounds[2], bounds[3]],
          ],
          {
            padding: 128,
            maxZoom: MAX_FIT_ZOOM,
            duration: 1000,
            linear: false,
          },
        )
      } catch (error) {
        console.error("Error calculating bounds:", error)
      }
    }

    if (mapInstance.loaded()) {
      handleMapLoaded()
    } else {
      mapInstance.once("load", handleMapLoaded)
    }

    return () => {
      if (map.current) {
        map.current.off("load", handleMapLoaded)
      }
    }
  }, [activeTab, nameGeoJson, fileGeoJson, boundingBoxGeoJson])

  return <div ref={mapContainer} className="h-full w-full rounded-lg" />
}
