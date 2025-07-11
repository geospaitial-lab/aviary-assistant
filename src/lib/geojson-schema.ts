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
