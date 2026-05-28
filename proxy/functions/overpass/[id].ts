/*
 * Copyright (C) 2026 Marius Maryniak
 *
 * This file is part of aviary-assistant.
 *
 * aviary-assistant is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * aviary-assistant is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with aviary-assistant.
 * If not, see <https://www.gnu.org/licenses/>.
 */

const DEFAULT_OVERPASS_BASE = "https://overpass-api.de/api"

const APP_NAME = "aviary-assistant"
const APP_URL = "https://geospaitial-lab.github.io/aviary-assistant"
const USER_AGENT = `${APP_NAME} proxy (${APP_URL})`

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  } as Record<string, string>
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  })
}

export async function onRequestGet(context: any) {
  try {
    const { params } = context as { params: Record<string, string> }
    const id = params?.id

    if (!id || !/^\d+$/.test(String(id))) {
      return json({ error: "Invalid or missing OSM relation id." }, 400)
    }

    const query = `[out:json];relation(${id});out geom;`
    const url = `${DEFAULT_OVERPASS_BASE}/interpreter?data=${encodeURIComponent(
      query,
    )}`

    const upstream = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": USER_AGENT,
      },
    })

    const text = await upstream.text()

    return new Response(text, {
      status: upstream.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...corsHeaders(),
      },
    })
  } catch (err: any) {
    return json(
      {
        error: "Failed to fetch data from Overpass API",
        message: err?.message ?? String(err),
      },
      502,
    )
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(),
    },
  })
}
