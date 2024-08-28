// schemas/propertyFaqs.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'propertyFaqs',
  title: 'Property FAQs',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
    }),
  ],
});
