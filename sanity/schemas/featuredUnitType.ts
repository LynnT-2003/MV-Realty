// schemas/faqs.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'featuredUnitType',
  title: 'Featured Unit Type',
  type: 'document',
  fields: [
    defineField({
      name: "unitType",
      title: "Unit Type",
      type: "array",
      of: [{ type: 'reference', to: [{ type: 'unitType' }] }],
    }),
  ],
});
