import type { LayerSpecification } from "maplibre-gl"

const NAME_FIELD = [
  "case",
  ["has", "name:nonlatin"],
  ["concat", ["get", "name:latin"], "\n", ["get", "name:nonlatin"]],
  ["coalesce", ["get", "name_en"], ["get", "name"]],
]

function placeLabelLayer(
  id: string,
  filter: unknown[],
  layout: Record<string, unknown>,
  opts: { minzoom?: number; maxzoom?: number } = {}
) {
  return {
    id,
    type: "symbol" as const,
    source: "openmaptiles",
    "source-layer": "place",
    ...opts,
    filter,
    layout,
    paint: { "text-color": "#fff", "text-halo-color": "#000", "text-halo-width": 1.2, "text-halo-blur": 0.5 },
  } as unknown as LayerSpecification
}

export const ESRI_SATELLITE_STYLE = {
  version: 8 as const,
  sources: {
    esri: {
      type: "raster" as const,
      tiles: ["https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
      tileSize: 256,
      attribution: "Esri, Maxar, Earthstar Geographics",
    },
    openmaptiles: { type: "vector" as const, url: "https://tiles.openfreemap.org/planet" },
  },
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  layers: [
    { id: "esri-satellite", type: "raster" as const, source: "esri" },
    placeLabelLayer("label_state", ["==", ["get", "class"], "state"], {
      "text-field": NAME_FIELD, "text-font": ["Noto Sans Italic"], "text-letter-spacing": 0.2, "text-max-width": 9,
      "text-size": ["interpolate", ["linear"], ["zoom"], 5, 10, 8, 14], "text-transform": "uppercase",
    }, { minzoom: 5, maxzoom: 8 }),
    placeLabelLayer("label_town", ["==", ["get", "class"], "town"], {
      "text-anchor": "bottom", "text-field": NAME_FIELD, "text-font": ["Noto Sans Regular"], "text-max-width": 8,
      "text-size": ["interpolate", ["exponential", 1.2], ["zoom"], 7, 12, 11, 14],
    }, { minzoom: 6 }),
    placeLabelLayer("label_village", ["==", ["get", "class"], "village"], {
      "text-anchor": "bottom", "text-field": NAME_FIELD, "text-font": ["Noto Sans Regular"], "text-max-width": 8,
      "text-size": ["interpolate", ["exponential", 1.2], ["zoom"], 7, 10, 11, 12],
    }, { minzoom: 9 }),
    placeLabelLayer("label_city", ["all", ["==", ["get", "class"], "city"], ["!=", ["get", "capital"], 2]], {
      "text-anchor": "bottom", "text-field": NAME_FIELD, "text-font": ["Noto Sans Regular"], "text-max-width": 8,
      "text-offset": [0, -0.1], "text-size": ["interpolate", ["exponential", 1.2], ["zoom"], 4, 11, 7, 13, 11, 18],
    }, { minzoom: 3 }),
    placeLabelLayer("label_city_capital", ["all", ["==", ["get", "class"], "city"], ["==", ["get", "capital"], 2]], {
      "text-anchor": "bottom", "text-field": NAME_FIELD, "text-font": ["Noto Sans Bold"], "text-max-width": 8,
      "text-offset": [0, -0.2], "text-size": ["interpolate", ["exponential", 1.2], ["zoom"], 4, 12, 7, 14, 11, 20],
    }, { minzoom: 3 }),
    placeLabelLayer("label_country_3", ["all", ["==", ["get", "class"], "country"], [">=", ["get", "rank"], 3]], {
      "text-field": NAME_FIELD, "text-font": ["Noto Sans Bold"], "text-max-width": 6.25,
      "text-size": ["interpolate", ["linear"], ["zoom"], 3, 9, 7, 17],
    }, { minzoom: 2, maxzoom: 9 }),
    placeLabelLayer("label_country_2", ["all", ["==", ["get", "class"], "country"], ["==", ["get", "rank"], 2]], {
      "text-field": NAME_FIELD, "text-font": ["Noto Sans Bold"], "text-max-width": 6.25,
      "text-size": ["interpolate", ["linear"], ["zoom"], 2, 9, 5, 17],
    }, { maxzoom: 9 }),
    placeLabelLayer("label_country_1", ["all", ["==", ["get", "class"], "country"], ["==", ["get", "rank"], 1]], {
      "text-field": NAME_FIELD, "text-font": ["Noto Sans Bold"], "text-max-width": 6.25,
      "text-size": ["interpolate", ["linear"], ["zoom"], 1, 9, 4, 17],
    }, { maxzoom: 9 }),
  ],
}

export function skyForView(isGlobe: boolean) {
  return isGlobe
    ? {
        "sky-color": "#0b1120",
        "sky-horizon-blend": 0.6,
        "horizon-color": "#1e293b",
        "horizon-fog-blend": 0.6,
        "fog-color": "#1e293b",
        "fog-ground-blend": 0.6,
      }
    : {
        "sky-color": "#88c6fc",
        "sky-horizon-blend": 0.8,
        "horizon-color": "#ffffff",
        "horizon-fog-blend": 0.8,
        "fog-color": "#ffffff",
        "fog-ground-blend": 0.5,
      }
}

export function openFreeMapStyles() {
  return {
    bright: { label: "Bright", url: "https://tiles.openfreemap.org/styles/bright" },
    streets: { label: "Streets", url: "https://tiles.openfreemap.org/styles/liberty" },
    light: { label: "Light", url: "https://tiles.openfreemap.org/styles/positron" },
    dark: { label: "Dark", url: "https://tiles.openfreemap.org/styles/dark" },
    satellite: { label: "Satellite", url: ESRI_SATELLITE_STYLE },
  } as const
}
