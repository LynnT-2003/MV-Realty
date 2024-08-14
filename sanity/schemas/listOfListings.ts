// schemas/listOfListings.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'listOfListings',
  title: 'List of Listings',
  type: 'document',
  fields: [
    defineField({
      name: 'listOfListingName',
      title: 'List of Listing Name',
      type: 'string',
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'listings',
      title: 'Listings',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'listing' }] }],
    }),
  ],
});
