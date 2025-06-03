import { and, isStringControl, JsonSchema, rankWith, schemaMatches } from '@jsonforms/core';

export default rankWith(
  20,
  and(
    isStringControl,
    schemaMatches((schema: JsonSchema) => schema.format === 'html')
  )
);