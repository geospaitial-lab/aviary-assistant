import Fuse from "fuse.js"

export interface AdminEntry {
  osmId: number
  name: string
  center: {
    lat: number
    lon: number
  }
  adminLevel: number
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
    const json = await response.json()

    const data: AdminEntry[] = json.map((entry: any) => ({
      osmId: entry.osm_id,
      name: entry.name,
      center: {
        lat: entry.center[0],
        lon: entry.center[1],
      },
      adminLevel: entry.admin_level,
      rank: entry.rank,
      state: entry.state,
    }))

    fuseInstance = new Fuse(data, {
      keys: ["name"],
      includeScore: true,
      shouldSort: false,
      findAllMatches: true,
      threshold: 0.4,
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

  if (query.length <= 3) {
    const sortedResults = resultsWithMetadata
      .sort((a, b) => {
        if (a.startsWithQuery && !b.startsWithQuery) return -1
        if (!a.startsWithQuery && b.startsWithQuery) return 1

        const itemA = a.item
        const itemB = b.item

        if (itemA.adminLevel !== itemB.adminLevel) {
          return itemA.adminLevel - itemB.adminLevel
        }

        if (itemA.rank != null && itemB.rank != null) {
          return itemA.rank - itemB.rank
        }

        if (itemA.rank != null) return -1
        if (itemB.rank != null) return 1

        return (a.score ?? 0) - (b.score ?? 0)
      })
      .map((res) => res.item)

    return sortedResults.slice(0, 5)
  } else {
    const sortedResults = resultsWithMetadata
      .sort((a, b) => {
        if (a.startsWithQuery && !b.startsWithQuery) return -1
        if (!a.startsWithQuery && b.startsWithQuery) return 1

        return (a.score ?? 0) - (b.score ?? 0)
      })
      .map((res) => res.item)

    return sortedResults.slice(0, 5)
  }
}
