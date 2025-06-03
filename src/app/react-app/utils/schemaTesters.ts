import { JsonSchema } from '@jsonforms/core';

export const htmlFormatTester = (schema: JsonSchema) => {
  return schema?.format === 'html' ? 10 : -1;
}; 