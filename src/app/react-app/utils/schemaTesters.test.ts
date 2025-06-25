import { htmlStringTester, htmlArrayItemTester } from './schemaTesters';
import { JsonSchema } from '@jsonforms/core';

describe('Schema Testers', () => {
  describe('htmlStringTester', () => {
    it('should match string control with html format', () => {
      const schema: JsonSchema = {
        type: 'string',
        format: 'html'
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = htmlStringTester(uischema, schema, undefined);
      expect(result).toBe(20);
    });

    it('should not match non-string control', () => {
      const schema: JsonSchema = {
        type: 'number',
        format: 'html'
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = htmlStringTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should not match string control without html format', () => {
      const schema: JsonSchema = {
        type: 'string',
        format: 'email'
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = htmlStringTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should not match string control without format', () => {
      const schema: JsonSchema = {
        type: 'string'
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = htmlStringTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });
  });

  describe('htmlArrayItemTester', () => {
    it('should match array with html format items', () => {
      const schema: JsonSchema = {
        type: 'array',
        items: {
          type: 'string',
          format: 'html'
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = htmlArrayItemTester(uischema, schema, undefined);
      expect(result).toBe(20);
    });

    it('should not match non-array schema', () => {
      const schema: JsonSchema = {
        type: 'string',
        format: 'html'
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = htmlArrayItemTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should not match array without items', () => {
      const schema: JsonSchema = {
        type: 'array'
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = htmlArrayItemTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should not match array with non-object items', () => {
      const schema: JsonSchema = {
        type: 'array',
        items: 'string'
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = htmlArrayItemTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should not match array with array items', () => {
      const schema: JsonSchema = {
        type: 'array',
        items: [
          { type: 'string', format: 'html' }
        ]
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = htmlArrayItemTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should not match array with non-html format items', () => {
      const schema: JsonSchema = {
        type: 'array',
        items: {
          type: 'string',
          format: 'email'
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = htmlArrayItemTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should not match array with non-string items', () => {
      const schema: JsonSchema = {
        type: 'array',
        items: {
          type: 'number',
          format: 'html'
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = htmlArrayItemTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });
  });
}); 