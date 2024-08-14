import { type SchemaTypeDefinition } from 'sanity'
import property from './schemas/property'
import listing from './schemas/listing'
import developer from './schemas/developer'
import facilityType from './schemas/facilityType'
import faqs from './schemas/faqs'
import tags from './schemas/tags'
import listOfListings from './schemas/listOfListings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [property, listing, developer, facilityType, faqs, tags, listOfListings],
}
