import { type SchemaTypeDefinition } from 'sanity'
import property from './schemas/property'
import listing from './schemas/listing'
import developer from './schemas/developer'
import facilityType from './schemas/facilityType'
import faqs from './schemas/faqs'
import propertyFaqs from './schemas/propertyFaqs'
import tags from './schemas/tags'
import collections from './schemas/collections'
import unitType from './schemas/unitType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [property, listing, developer, facilityType, faqs, propertyFaqs,tags, collections, unitType],
}
