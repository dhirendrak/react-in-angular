import { and, isStringControl, JsonSchema, rankWith, schemaMatches } from '@jsonforms/core';

const isHtmlFormat = (schema: JsonSchema) => schema.format === 'html';

export const htmlStringTester = rankWith(
  20,
  and(
    isStringControl,
    schemaMatches(isHtmlFormat)
  )
);

export const htmlArrayItemTester = rankWith(
  20,
  schemaMatches((schema: JsonSchema) => 
    Boolean(
      schema.type === 'array' && 
      schema.items && 
      typeof schema.items === 'object' && 
      !Array.isArray(schema.items) && 
      isHtmlFormat(schema.items)
    )
  )
);

export default [htmlStringTester, htmlArrayItemTester];