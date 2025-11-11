/*
 * Copyright (c) 2025 Marius Maryniak
 *
 * This file is part of aviary-assistant.
 *
 * aviary-assistant is free software: you can redistribute it and / or modify it under the terms of the
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

export const geoJsonSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://geojson.org/schema/GeoJSON.json",
  title: "GeoJSON",
  oneOf: [
    {
      title: "GeoJSON Polygon",
      type: "object",
      required: ["type", "coordinates"],
      properties: {
        type: {
          type: "string",
          enum: ["Polygon"],
        },
        coordinates: {
          type: "array",
          items: {
            type: "array",
            minItems: 4,
            items: {
              type: "array",
              minItems: 2,
              items: {
                type: "number",
              },
            },
          },
        },
        bbox: {
          type: "array",
          minItems: 4,
          items: {
            type: "number",
          },
        },
      },
    },
    {
      title: "GeoJSON MultiPolygon",
      type: "object",
      required: ["type", "coordinates"],
      properties: {
        type: {
          type: "string",
          enum: ["MultiPolygon"],
        },
        coordinates: {
          type: "array",
          items: {
            type: "array",
            items: {
              type: "array",
              minItems: 4,
              items: {
                type: "array",
                minItems: 2,
                items: {
                  type: "number",
                },
              },
            },
          },
        },
        bbox: {
          type: "array",
          minItems: 4,
          items: {
            type: "number",
          },
        },
      },
    },
    {
      title: "GeoJSON GeometryCollection",
      type: "object",
      required: ["type", "geometries"],
      properties: {
        type: {
          type: "string",
          enum: ["GeometryCollection"],
        },
        geometries: {
          type: "array",
          items: {
            oneOf: [
              {
                title: "GeoJSON Polygon",
                type: "object",
                required: ["type", "coordinates"],
                properties: {
                  type: {
                    type: "string",
                    enum: ["Polygon"],
                  },
                  coordinates: {
                    type: "array",
                    items: {
                      type: "array",
                      minItems: 4,
                      items: {
                        type: "array",
                        minItems: 2,
                        items: {
                          type: "number",
                        },
                      },
                    },
                  },
                  bbox: {
                    type: "array",
                    minItems: 4,
                    items: {
                      type: "number",
                    },
                  },
                },
              },
              {
                title: "GeoJSON MultiPolygon",
                type: "object",
                required: ["type", "coordinates"],
                properties: {
                  type: {
                    type: "string",
                    enum: ["MultiPolygon"],
                  },
                  coordinates: {
                    type: "array",
                    items: {
                      type: "array",
                      items: {
                        type: "array",
                        minItems: 4,
                        items: {
                          type: "array",
                          minItems: 2,
                          items: {
                            type: "number",
                          },
                        },
                      },
                    },
                  },
                  bbox: {
                    type: "array",
                    minItems: 4,
                    items: {
                      type: "number",
                    },
                  },
                },
              },
            ],
          },
        },
        bbox: {
          type: "array",
          minItems: 4,
          items: {
            type: "number",
          },
        },
      },
    },
    {
      title: "GeoJSON Feature",
      type: "object",
      required: ["type", "properties", "geometry"],
      properties: {
        type: {
          type: "string",
          enum: ["Feature"],
        },
        id: {
          oneOf: [
            {
              type: "number",
            },
            {
              type: "string",
            },
          ],
        },
        properties: {
          oneOf: [
            {
              type: "null",
            },
            {
              type: "object",
            },
          ],
        },
        geometry: {
          oneOf: [
            {
              type: "null",
            },
            {
              title: "GeoJSON Polygon",
              type: "object",
              required: ["type", "coordinates"],
              properties: {
                type: {
                  type: "string",
                  enum: ["Polygon"],
                },
                coordinates: {
                  type: "array",
                  items: {
                    type: "array",
                    minItems: 4,
                    items: {
                      type: "array",
                      minItems: 2,
                      items: {
                        type: "number",
                      },
                    },
                  },
                },
                bbox: {
                  type: "array",
                  minItems: 4,
                  items: {
                    type: "number",
                  },
                },
              },
            },
            {
              title: "GeoJSON MultiPolygon",
              type: "object",
              required: ["type", "coordinates"],
              properties: {
                type: {
                  type: "string",
                  enum: ["MultiPolygon"],
                },
                coordinates: {
                  type: "array",
                  items: {
                    type: "array",
                    items: {
                      type: "array",
                      minItems: 4,
                      items: {
                        type: "array",
                        minItems: 2,
                        items: {
                          type: "number",
                        },
                      },
                    },
                  },
                },
                bbox: {
                  type: "array",
                  minItems: 4,
                  items: {
                    type: "number",
                  },
                },
              },
            },
            {
              title: "GeoJSON GeometryCollection",
              type: "object",
              required: ["type", "geometries"],
              properties: {
                type: {
                  type: "string",
                  enum: ["GeometryCollection"],
                },
                geometries: {
                  type: "array",
                  items: {
                    oneOf: [
                      {
                        title: "GeoJSON Polygon",
                        type: "object",
                        required: ["type", "coordinates"],
                        properties: {
                          type: {
                            type: "string",
                            enum: ["Polygon"],
                          },
                          coordinates: {
                            type: "array",
                            items: {
                              type: "array",
                              minItems: 4,
                              items: {
                                type: "array",
                                minItems: 2,
                                items: {
                                  type: "number",
                                },
                              },
                            },
                          },
                          bbox: {
                            type: "array",
                            minItems: 4,
                            items: {
                              type: "number",
                            },
                          },
                        },
                      },
                      {
                        title: "GeoJSON MultiPolygon",
                        type: "object",
                        required: ["type", "coordinates"],
                        properties: {
                          type: {
                            type: "string",
                            enum: ["MultiPolygon"],
                          },
                          coordinates: {
                            type: "array",
                            items: {
                              type: "array",
                              items: {
                                type: "array",
                                minItems: 4,
                                items: {
                                  type: "array",
                                  minItems: 2,
                                  items: {
                                    type: "number",
                                  },
                                },
                              },
                            },
                          },
                          bbox: {
                            type: "array",
                            minItems: 4,
                            items: {
                              type: "number",
                            },
                          },
                        },
                      },
                    ],
                  },
                },
                bbox: {
                  type: "array",
                  minItems: 4,
                  items: {
                    type: "number",
                  },
                },
              },
            },
          ],
        },
        bbox: {
          type: "array",
          minItems: 4,
          items: {
            type: "number",
          },
        },
      },
    },
    {
      title: "GeoJSON FeatureCollection",
      type: "object",
      required: ["type", "features"],
      properties: {
        type: {
          type: "string",
          enum: ["FeatureCollection"],
        },
        features: {
          type: "array",
          items: {
            title: "GeoJSON Feature",
            type: "object",
            required: ["type", "properties", "geometry"],
            properties: {
              type: {
                type: "string",
                enum: ["Feature"],
              },
              id: {
                oneOf: [
                  {
                    type: "number",
                  },
                  {
                    type: "string",
                  },
                ],
              },
              properties: {
                oneOf: [
                  {
                    type: "null",
                  },
                  {
                    type: "object",
                  },
                ],
              },
              geometry: {
                oneOf: [
                  {
                    type: "null",
                  },
                  {
                    title: "GeoJSON Polygon",
                    type: "object",
                    required: ["type", "coordinates"],
                    properties: {
                      type: {
                        type: "string",
                        enum: ["Polygon"],
                      },
                      coordinates: {
                        type: "array",
                        items: {
                          type: "array",
                          minItems: 4,
                          items: {
                            type: "array",
                            minItems: 2,
                            items: {
                              type: "number",
                            },
                          },
                        },
                      },
                      bbox: {
                        type: "array",
                        minItems: 4,
                        items: {
                          type: "number",
                        },
                      },
                    },
                  },
                  {
                    title: "GeoJSON MultiPolygon",
                    type: "object",
                    required: ["type", "coordinates"],
                    properties: {
                      type: {
                        type: "string",
                        enum: ["MultiPolygon"],
                      },
                      coordinates: {
                        type: "array",
                        items: {
                          type: "array",
                          items: {
                            type: "array",
                            minItems: 4,
                            items: {
                              type: "array",
                              minItems: 2,
                              items: {
                                type: "number",
                              },
                            },
                          },
                        },
                      },
                      bbox: {
                        type: "array",
                        minItems: 4,
                        items: {
                          type: "number",
                        },
                      },
                    },
                  },
                  {
                    title: "GeoJSON GeometryCollection",
                    type: "object",
                    required: ["type", "geometries"],
                    properties: {
                      type: {
                        type: "string",
                        enum: ["GeometryCollection"],
                      },
                      geometries: {
                        type: "array",
                        items: {
                          oneOf: [
                            {
                              title: "GeoJSON Polygon",
                              type: "object",
                              required: ["type", "coordinates"],
                              properties: {
                                type: {
                                  type: "string",
                                  enum: ["Polygon"],
                                },
                                coordinates: {
                                  type: "array",
                                  items: {
                                    type: "array",
                                    minItems: 4,
                                    items: {
                                      type: "array",
                                      minItems: 2,
                                      items: {
                                        type: "number",
                                      },
                                    },
                                  },
                                },
                                bbox: {
                                  type: "array",
                                  minItems: 4,
                                  items: {
                                    type: "number",
                                  },
                                },
                              },
                            },
                            {
                              title: "GeoJSON MultiPolygon",
                              type: "object",
                              required: ["type", "coordinates"],
                              properties: {
                                type: {
                                  type: "string",
                                  enum: ["MultiPolygon"],
                                },
                                coordinates: {
                                  type: "array",
                                  items: {
                                    type: "array",
                                    items: {
                                      type: "array",
                                      minItems: 4,
                                      items: {
                                        type: "array",
                                        minItems: 2,
                                        items: {
                                          type: "number",
                                        },
                                      },
                                    },
                                  },
                                },
                                bbox: {
                                  type: "array",
                                  minItems: 4,
                                  items: {
                                    type: "number",
                                  },
                                },
                              },
                            },
                          ],
                        },
                      },
                      bbox: {
                        type: "array",
                        minItems: 4,
                        items: {
                          type: "number",
                        },
                      },
                    },
                  },
                ],
              },
              bbox: {
                type: "array",
                minItems: 4,
                items: {
                  type: "number",
                },
              },
            },
          },
        },
        bbox: {
          type: "array",
          minItems: 4,
          items: {
            type: "number",
          },
        },
      },
    },
  ],
} as const
