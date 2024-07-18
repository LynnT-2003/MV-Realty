// schemas/property.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'property',
  title: 'Property',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: 'developer',
      title: 'Developer',
      type: 'reference',
      to: [{ type: 'developer' }],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'mapUrl',
      title: 'Map URL',
      type: 'url',
    }),
    defineField({
      name: 'geoLocation',
      title: 'Geo Location',
      type: 'geopoint',
    }),   
    defineField({
      name: 'minPrice',
      title: 'Min Price',
      type: 'number',
    }),
    defineField({
      name: 'maxPrice',
      title: 'Max Price',
      type: 'number',
    }),
    defineField({
      name: 'facilities',
      type: 'array',
      title: 'Facilities',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              type: 'string',
              title: 'Facility Name'
            },
            {
              name: 'description',
              type: 'text',
              title: 'Facility Description'
            },
            {
              name: 'photos',
              title: 'Photos',
              type: 'array',
              of: [{ type: 'image' }],
              options: {
                layout: 'grid',
              }
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [{ type: 'image' }],
      options: {
        layout: 'grid',
      }
    }),
    defineField({
      name: 'built',
      title: 'Built',
      type: 'number',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created at',
      type: 'datetime',
    }),
  ],
});
