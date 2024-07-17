import { type SchemaTypeDefinition } from 'sanity'
import property from './schemas/property'
import listing from './schemas/listing'
import developer from './schemas/developer'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [property, listing, developer],
}
