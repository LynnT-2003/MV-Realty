import createImageUrlBuilder from '@sanity/image-url';
import type { Image as SanityImage } from 'sanity';

import { dataset, projectId } from '../env';

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
});

export const urlForImage = (source: SanityImage) => {
  return imageBuilder.image(source).auto('format').fit('max').url();
};
