// schemas/faqs.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'featuredListing',
  title: 'Featured Listing',
  type: 'document',
  fields: [
    defineField({
      name: "listing",
      title: "Listing",
      type: "array",
      of: [{ type: 'reference', to: [{ type: 'listing' }] }],
    }),
  ],
});
