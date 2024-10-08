// schemas/faqs.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'featuredProperty',
  title: 'Featured Property',
  type: 'document',
  fields: [
    defineField({
        name: "property",
        title: "Property",
        type: "array",
        of: [{ type: 'reference', to: [{ type: 'property' }] }],
      }),
  ],
});
