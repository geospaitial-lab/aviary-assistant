import Fuse from "fuse.js"

export interface AdminEntry {
  osm_id: number
  name: string
  center: {
    lat: number
    lon: number
  }
  admin_level: number
  rank: number | null
  state: string | null
}

const createFuseManager = (() => {
  let fuseInstance: Fuse<AdminEntry> | null = null

  return async function (): Promise<Fuse<AdminEntry>> {
    if (fuseInstance) return fuseInstance

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/data/admin_de.json`,
    )
    const data: AdminEntry[] = await response.json()

    fuseInstance = new Fuse(data, {
      keys: ["name"],
      threshold: 0.2,
      includeScore: true,
      useExtendedSearch: true,
      findAllMatches: false,
      location: 0,
      distance: 100,
      ignoreLocation: false,
    })

    return fuseInstance
  }
})()

const initFuse = createFuseManager

export async function searchAdminEntries(query: string): Promise<AdminEntry[]> {
  const fuse = await initFuse()
  query = query.trim()

  const results = fuse.search(query)

  const resultsWithMetadata = results.map((res) => {
    const startsWithQuery = res.item.name
      .toLowerCase()
      .startsWith(query.toLowerCase())

    return {
      ...res,
      startsWithQuery,
    }
  })

  const sortedResults = resultsWithMetadata
    .sort((a, b) => {
      if (a.startsWithQuery && !b.startsWithQuery) return -1
      if (!a.startsWithQuery && b.startsWithQuery) return 1

      const itemA = a.item
      const itemB = b.item

      if (itemA.rank != null && itemB.rank != null) {
        return itemA.rank - itemB.rank
      }

      if (itemA.rank != null) return -1
      if (itemB.rank != null) return 1

      if (itemA.name.length !== itemB.name.length) {
        return itemA.name.length - itemB.name.length
      }

      return itemA.name.localeCompare(itemB.name)
    })
    .map((res) => res.item)

  return sortedResults.slice(0, 5)
}
