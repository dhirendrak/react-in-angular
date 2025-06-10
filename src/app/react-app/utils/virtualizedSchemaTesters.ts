import { JsonSchema, rankWith, schemaMatches } from '@jsonforms/core';
// Extended schema interface to include options property
type ExtendedJsonSchema = JsonSchema & {
  options?: {
    virtualized?: boolean;
  };
};

// Tester for virtualized array items
// This will match arrays with a large number of items that should be virtualized
export const virtualizedArrayTester = rankWith(
  30, // Higher rank than regular array testers to take precedence
  schemaMatches((schema: JsonSchema) => {
    // Cast to extended schema to access options property
    const extendedSchema = schema as ExtendedJsonSchema;
    
    const isArray = schema.type === 'array';
    const hasItems = schema.items && typeof schema.items === 'object' && !Array.isArray(schema.items);
    const hasVirtualizedOption = extendedSchema.options?.virtualized === true;
    const hasMaxItems = schema.maxItems && schema.maxItems > 20;
    
    const result = Boolean(
      isArray && 
      hasItems &&
      (hasVirtualizedOption || hasMaxItems)
    );
    
    // Log when virtualized tester matches to see if it's interfering
    if (result) {
      console.log('VirtualizedArrayTester - Match found:', {
        type: schema.type,
        title: schema.title,
        options: extendedSchema.options,
        maxItems: schema.maxItems,
        hasVirtualizedOption,
        hasMaxItems
      });
    }
    
    return result;
  })
);

export default virtualizedArrayTester;