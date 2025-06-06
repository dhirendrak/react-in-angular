import { JsonSchema, rankWith, schemaMatches } from '@jsonforms/core';

// Extended schema interface to include options property
interface ExtendedJsonSchema extends Omit<JsonSchema, keyof JsonSchema> {
  options?: {
    virtualized?: boolean;
  };
}

// Tester for virtualized array items
// This will match arrays with a large number of items that should be virtualized
export const virtualizedArrayTester = rankWith(
  30, // Higher rank than regular array testers to take precedence
  schemaMatches((schema: JsonSchema) => {
    // Cast to extended schema to access options property
    const extendedSchema = schema as ExtendedJsonSchema;
    
    return Boolean(
      schema.type === 'array' && 
      schema.items && 
      typeof schema.items === 'object' && 
      !Array.isArray(schema.items) &&
      // Check for virtualization hint in the schema
      (extendedSchema.options?.virtualized === true ||
       // Or check if it's a large array that should be virtualized
       schema.maxItems && schema.maxItems > 20)
    );
  })
);

export default virtualizedArrayTester;