"use client"

import * as React from "react"

import maplibregl from "maplibre-gl"
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
const GEOJSON_LAYER_ID = "area-geojson-layer"
const GEOJSON_LINE_WIDTH = 2
const GEOJSON_OPACITY = 0.2
const GEOJSON_SOURCE_ID = "area-geojson-source"
const MAX_FIT_ZOOM = 12
const MAX_ZOOM = 18
const MIN_ZOOM = DEFAULT_ZOOM
const VECTOR_TILES_URL = "https://tiles.openfreemap.org/styles/bright"

export function Map() {
  const mapContainer = React.useRef<HTMLDivElement>(null)
  const map = React.useRef<maplibregl.Map | null>(null)
  const [mapInitialized, setMapInitialized] = React.useState(false)

  const { activeTab } = useAreaStore()

  const nameGeoJson = useNameStore((state) => state.geoJson)
  const fileGeoJson = useFileStore((state) => state.geoJson)
  const boundingBoxGeoJson = useBoundingBoxStore((state) => state.geoJson)

  React.useEffect(() => {
    if (mapContainer.current && !map.current) {
      try {
        const mapInstance = new maplibregl.Map({
          container: mapContainer.current,
          style: VECTOR_TILES_URL,
          center: CENTER,
          zoom: DEFAULT_ZOOM,
          minZoom: MIN_ZOOM,
          maxZoom: MAX_ZOOM,
          keyboard: false,
        })

        mapInstance.on("load", () => {
          mapInstance.addSource(GEOJSON_SOURCE_ID, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [],
            },
          })

          mapInstance.addLayer({
            id: `${GEOJSON_LAYER_ID}-fill`,
            type: "fill",
            source: GEOJSON_SOURCE_ID,
            paint: {
              "fill-color": GEOJSON_COLOR,
              "fill-opacity": GEOJSON_OPACITY,
            },
          })

          mapInstance.addLayer({
            id: `${GEOJSON_LAYER_ID}-line`,
            type: "line",
            source: GEOJSON_SOURCE_ID,
            paint: {
              "line-color": GEOJSON_COLOR,
              "line-width": GEOJSON_LINE_WIDTH,
            },
          })

          setMapInitialized(true)
        })

        map.current = mapInstance
        map.current.dragRotate.disable()
        map.current.touchZoomRotate.disableRotation()
        map.current.touchPitch.disable()
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  const getCurrentGeoJson = React.useCallback((): AllGeoJSON | null => {
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
  }, [activeTab, nameGeoJson, fileGeoJson, boundingBoxGeoJson])

  const updateGeoJsonSource = React.useCallback(
    (geoJson: AllGeoJSON | null) => {
      if (!map.current || !mapInitialized) return

      try {
        const source = map.current.getSource(
          GEOJSON_SOURCE_ID,
        ) as maplibregl.GeoJSONSource

        if (source) {
          if (geoJson) {
            source.setData(geoJson)
          } else {
            source.setData({
              type: "FeatureCollection",
              features: [],
            })
          }
        }
      } catch (error) {
        console.error("Error updating source:", error)
      }
    },
    [mapInitialized],
  )

  const fitMapToGeometry = React.useCallback((geoJson: AllGeoJSON) => {
    if (!map.current || !geoJson) return

    try {
      const bounds = bbox(geoJson)

      map.current.fitBounds(
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
      console.error("Error fitting map to geometry:", error)
    }
  }, [])

  React.useEffect(() => {
    if (!mapInitialized) return

    const currentGeoJson = getCurrentGeoJson()
    updateGeoJsonSource(currentGeoJson)

    if (currentGeoJson) {
      fitMapToGeometry(currentGeoJson)
    }
  }, [
    activeTab,
    mapInitialized,
    getCurrentGeoJson,
    updateGeoJsonSource,
    fitMapToGeometry,
  ])

  React.useEffect(() => {
    if (!mapInitialized) return

    const currentGeoJson = getCurrentGeoJson()
    updateGeoJsonSource(currentGeoJson)

    if (currentGeoJson) {
      fitMapToGeometry(currentGeoJson)
    }
  }, [
    nameGeoJson,
    fileGeoJson,
    boundingBoxGeoJson,
    mapInitialized,
    getCurrentGeoJson,
    updateGeoJsonSource,
    fitMapToGeometry,
  ])

  return <div ref={mapContainer} className="h-full w-full rounded-lg" />
}
