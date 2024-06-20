export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-06-15'

  export const dataset = assertValue(
    isLocal() ? process.env.NEXT_PUBLIC_SANITY_DATASET : process.env.SANITY_STUDIO_DATASET,
    'Missing environment variable: dataset'
  );
  
  export const projectId = assertValue(
    isLocal() ? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID : process.env.SANITY_STUDIO_PROJECT_ID,
    'Missing environment variable: projectId'
  );

export const useCdn = true

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}

function isLocal() {
  return process.env.NODE_ENV === 'development';
}
