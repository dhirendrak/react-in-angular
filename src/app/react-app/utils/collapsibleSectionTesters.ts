import { JsonSchema, rankWith, schemaMatches } from '@jsonforms/core';


// Tester for collapsible sections
// This will match the sections property that contains an array of section objects
export const collapsibleSectionTester = rankWith(
  25, // Higher rank than regular array testers but lower than virtualized
  schemaMatches((schema: JsonSchema) => {
    // Cast to extended schema to access options property

    // Check basic array structure
    const isArray = schema.type === 'array';
    const hasItems = schema.items && typeof schema.items === 'object' && !Array.isArray(schema.items);


    // Check if it's a sections array by looking at the title or items structure
    const itemsSchema = schema.items && typeof schema.items === 'object' && !Array.isArray(schema.items) ? schema.items : null;
    const hasSectionRef = itemsSchema && '$ref' in itemsSchema && typeof itemsSchema.$ref === 'string' && itemsSchema.$ref.includes('section');
    const isSectionsArray = schema.title === 'Sections' || hasSectionRef;

    const result = Boolean(
      isArray &&
      hasItems &&
      isSectionsArray
    );

    // Only log when we have a potential match to reduce noise
    if (isArray && hasItems) {
      console.log('CollapsibleSectionTester - Potential match found:', {
        type: schema.type,
        title: schema.title,
        items: schema.items,
        $ref: itemsSchema && '$ref' in itemsSchema ? itemsSchema.$ref : undefined,
        isSectionsArray,
        result
      });
    }

    return result;
  })
);

export default collapsibleSectionTester; 