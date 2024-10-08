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
      name: "listing",
      title: "Listing",
      type: "array",
      of: [{ type: 'reference', to: [{ type: 'listing' }] }],
    }),
    defineField({
      name: "unitType",
      title: "Unit Type",
      type: "array",
      of: [{ type: 'reference', to: [{ type: 'unitType' }] }],
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
              name: 'facilityType',
              title: 'Facility Type',
              type: 'reference',
              to: [{ type: 'facilityType' }],
            },
            {
              name: 'facilityName',
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
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tags' }] }],
    }),
    defineField({
      name: 'propertyHero',
      title: 'Property Hero',
      type: 'image',
      options: {
        hotspot: true, // Allows selection of a hotspot within the image
      },
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
      name: 'completedOn',
      title: 'Completed On',
      type: 'number',
    }),
    defineField({
      name: 'propertyFaqs',
      title: 'Property FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'reference',
              to: [{ type: 'propertyFaqs' }],
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'text',
            },
          ],
        },
      ],
    }),
    defineField({
      name: "brochure",
      title: "Brochure",
      type: "file",
      options: {
        accept: ".pdf", // Specify the allowed file format(s)
      },
    }),
    defineField({
      name: 'createdAt',
      title: 'Created at',
      type: 'datetime',
    }),
  ],
});
