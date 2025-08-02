import type { MetadataRoute } from "next"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [`${basePath}/dev/`, `${basePath}/data/`],
    },
    sitemap: `${basePath}/sitemap.xml`,
  }
}
