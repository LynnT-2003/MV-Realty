import createImageUrlBuilder from '@sanity/image-url';
import type { Image as SanityImage } from 'sanity';
import { client } from "./client";


import { dataset, projectId } from '../env';

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
});

export const urlForImage = (source: any) => {
  if (!source || !source.asset || typeof source.asset._ref !== 'string') {
    console.error("Invalid image source", source);
    return '';
  }
  return imageBuilder.image(source).auto('format').fit('max').url();
};

// Use this for files like PDFs (manual construction of URLs)
export const urlForFile = (source: any) => {
  return source ? `https://cdn.sanity.io/files/${client.config().projectId}/${client.config().dataset}/${source.asset._ref.split("-").slice(1).join(".")}` : null;
};