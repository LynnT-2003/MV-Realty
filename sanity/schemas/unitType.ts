import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'unitType',
  title: 'Unit Type',
  type: 'document',
  fields: [
    defineField({
      name: 'property',
      title: 'Property',
      type: 'reference',
      to: [{ type: 'property' }],
    }),
    defineField({
      name: 'unitTypeName',
      title: 'Unit Type Name',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'startingPrice',
      title: 'Starting Price (in Thai Baht)',
      type: 'number',
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'number',
    }),
    defineField({
      name: 'bedroom',
      title: 'Bedroom',
      type: 'number',
    }),
    defineField({
      name: 'bathroom',
      title: 'Bathroom',
      type: 'number',
    }),
    defineField({
      name: 'furniture',
      title: 'Furniture',
      type: 'string',
      options: {
        list: [
          { title: 'Fully-fitted', value: 'fully-fitted' },
          { title: 'Fully furnished', value: 'fully-furnished' },
        ],
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Ready to move in', value: 'ready-to-move-in' },
          { title: 'Finishing in 2026', value: 'finishing-2026' },
        ],
      },
    }),
    defineField({
      name: 'createdAt',
      title: 'Created at',
      type: 'datetime',
    }),
    defineField({
      name: 'unitHero',
      title: 'Unit Hero',
      type: 'image',
      options: {
        hotspot: true, // Allows selection of a hotspot within the image
      },
    }),
    defineField({
      name: 'unitPhoto',
      title: 'Unit Photo',
      type: 'array',
      of: [{ type: 'image' }],
      options: {
        layout: 'grid',
      },
    }),
    defineField({
      name: 'floorPlan',
      title: 'Floor Plan',
      type: 'image',
      options: {
        hotspot: true, // Allows selection of a hotspot within the image
      },
    }),
    defineField({
      name: 'activeStatus',
      title: 'Active Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Inactive', value: 'inactive' },
        ],
      },
    }),
  ],
});