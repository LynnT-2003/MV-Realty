// schemas/property.ts
import {defineType, defineField} from 'sanity';

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
      name: 'developer',
      title: 'Developer',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
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
      title: 'Facilities',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [{ type: 'image' }],
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
