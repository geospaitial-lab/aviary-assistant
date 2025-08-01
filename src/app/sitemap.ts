import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/assistant`,
      lastModified: new Date(),
    },
  ]
}
