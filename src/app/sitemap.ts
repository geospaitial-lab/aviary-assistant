import type { MetadataRoute } from "next"

const BASE_URL = "https://geospaitial-lab.github.io/aviary-assistant"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/assistant`,
      lastModified: new Date(),
    },
  ]
}
