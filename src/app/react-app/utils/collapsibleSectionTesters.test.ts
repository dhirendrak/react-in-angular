import { collapsibleSectionTester } from './collapsibleSectionTesters';
import { JsonSchema } from '@jsonforms/core';

describe('Collapsible Section Testers', () => {
  describe('collapsibleSectionTester', () => {
    it('should match array with title "Sections"', () => {
      const schema: JsonSchema = {
        type: 'array',
        title: 'Sections',
        items: {
          type: 'object'
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/sections'
      };

      const result = collapsibleSectionTester(uischema, schema, undefined);
      expect(result).toBe(25);
    });

    it('should match array with section reference in items', () => {
      const schema: JsonSchema = {
        type: 'array',
        items: {
          $ref: '#/definitions/section'
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/sections'
      };

      const result = collapsibleSectionTester(uischema, schema, undefined);
      expect(result).toBe(25);
    });

    it('should match array with section reference containing "section"', () => {
      const schema: JsonSchema = {
        type: 'array',
        items: {
          $ref: 'http://example.com/schemas/section.json'
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/sections'
      };

      const result = collapsibleSectionTester(uischema, schema, undefined);
      expect(result).toBe(25);
    });

    it('should match array with both title and section reference', () => {
      const schema: JsonSchema = {
        type: 'array',
        title: 'Sections',
        items: {
          $ref: '#/definitions/section'
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/sections'
      };

      const result = collapsibleSectionTester(uischema, schema, undefined);
      expect(result).toBe(25);
    });

    it('should not match non-array schema', () => {
      const schema: JsonSchema = {
        type: 'object',
        title: 'Sections',
        properties: {
          section: { type: 'object' }
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/sections'
      };

      const result = collapsibleSectionTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should not match array without items', () => {
      const schema: JsonSchema = {
        type: 'array',
        title: 'Sections'
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/sections'
      };

      const result = collapsibleSectionTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should not match array with non-object items', () => {
      const schema: JsonSchema = {
        type: 'array',
        title: 'Sections',
        items: 'string'
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/sections'
      };

      const result = collapsibleSectionTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should not match array with array items', () => {
      const schema: JsonSchema = {
        type: 'array',
        title: 'Sections',
        items: [
          { type: 'object' }
        ]
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/sections'
      };

      const result = collapsibleSectionTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should not match array without section-related title or reference', () => {
      const schema: JsonSchema = {
        type: 'array',
        title: 'Other Items',
        items: {
          type: 'object'
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/otherItems'
      };

      const result = collapsibleSectionTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should not match array with non-section reference', () => {
      const schema: JsonSchema = {
        type: 'array',
        items: {
          $ref: '#/definitions/user'
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/users'
      };

      const result = collapsibleSectionTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should match array with case-insensitive section reference', () => {
      const schema: JsonSchema = {
        type: 'array',
        items: {
          $ref: '#/definitions/Section'
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/sections'
      };

      const result = collapsibleSectionTester(uischema, schema, undefined);
      expect(result).toBe(25);
    });

    it('should match array with section reference in URL', () => {
      const schema: JsonSchema = {
        type: 'array',
        items: {
          $ref: 'https://api.example.com/schemas/section-definition.json'
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/sections'
      };

      const result = collapsibleSectionTester(uischema, schema, undefined);
      expect(result).toBe(25);
    });

    it('should not match array with partial section reference', () => {
      const schema: JsonSchema = {
        type: 'array',
        items: {
          $ref: '#/definitions/subsection'
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/subsections'
      };

      const result = collapsibleSectionTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });
  });
}); 