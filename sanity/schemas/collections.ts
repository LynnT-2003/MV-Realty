// schemas/collections.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "collections",
  title: "Collections",
  type: "document",
  fields: [
    defineField({
      name: "collectionName",
      title: "Collection Name",
      type: "string",
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "properties",
      title: "Properties",
      type: "array",
      of: [{ type: "reference", to: [{ type: "property" }] }],
    }),
  ],
});
