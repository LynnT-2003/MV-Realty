// schemas/facilityType.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'facilityType',
  title: 'Facility Type',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Facility Name',
      type: 'string',
    }),
  ],
});
