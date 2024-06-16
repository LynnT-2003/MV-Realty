import { type SchemaTypeDefinition } from 'sanity'
import property from './schemas/property'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [property],
}
