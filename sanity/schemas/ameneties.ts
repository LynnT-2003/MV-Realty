import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'ameneties',
  title: 'Ameneties',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
        name: 'geoLocation',
        title: 'Geo Location',
        type: 'geopoint',
      }),  
    defineField({
        name: 'amenetiesPhoto',
        title: 'Ameneties Photo',
        type: 'image',
        options: {
          hotspot: true,
        },
      }),
  ],
});
