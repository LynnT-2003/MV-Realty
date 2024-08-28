// schemas/developer.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'developer',
  title: 'Developer',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'profileIcon',
      title: 'Profile Icon',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
});
