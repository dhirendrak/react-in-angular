import { virtualizedArrayTester } from './virtualizedSchemaTesters';
import { JsonSchema } from '@jsonforms/core';

describe('Virtualized Schema Testers', () => {
  describe('virtualizedArrayTester', () => {
    it('should match array with virtualized option', () => {
      const schema: JsonSchema & { options?: { virtualized?: boolean } } = {
        type: 'array',
        items: {
          type: 'string'
        },
        options: {
          virtualized: true
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = virtualizedArrayTester(uischema, schema, undefined);
      expect(result).toBe(30);
    });

    it('should match array with maxItems greater than 20', () => {
      const schema: JsonSchema = {
        type: 'array',
        items: {
          type: 'string'
        },
        maxItems: 25
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = virtualizedArrayTester(uischema, schema, undefined);
      expect(result).toBe(30);
    });

    it('should match array with both virtualized option and maxItems', () => {
      const schema: JsonSchema & { options?: { virtualized?: boolean } } = {
        type: 'array',
        items: {
          type: 'string'
        },
        maxItems: 30,
        options: {
          virtualized: true
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = virtualizedArrayTester(uischema, schema, undefined);
      expect(result).toBe(30);
    });

    it('should not match non-array schema', () => {
      const schema: JsonSchema = {
        type: 'string',
        options: {
          virtualized: true
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = virtualizedArrayTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should not match array without items', () => {
      const schema: JsonSchema & { options?: { virtualized?: boolean } } = {
        type: 'array',
        options: {
          virtualized: true
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = virtualizedArrayTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should not match array with non-object items', () => {
      const schema: JsonSchema & { options?: { virtualized?: boolean } } = {
        type: 'array',
        items: 'string',
        options: {
          virtualized: true
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = virtualizedArrayTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should not match array with array items', () => {
      const schema: JsonSchema & { options?: { virtualized?: boolean } } = {
        type: 'array',
        items: [
          { type: 'string' }
        ],
        options: {
          virtualized: true
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = virtualizedArrayTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should not match array without virtualized option and maxItems <= 20', () => {
      const schema: JsonSchema = {
        type: 'array',
        items: {
          type: 'string'
        },
        maxItems: 15
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = virtualizedArrayTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should not match array without virtualized option and no maxItems', () => {
      const schema: JsonSchema = {
        type: 'array',
        items: {
          type: 'string'
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = virtualizedArrayTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should not match array with virtualized option set to false', () => {
      const schema: JsonSchema & { options?: { virtualized?: boolean } } = {
        type: 'array',
        items: {
          type: 'string'
        },
        options: {
          virtualized: false
        }
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = virtualizedArrayTester(uischema, schema, undefined);
      expect(result).toBe(-1);
    });

    it('should match array with maxItems exactly 21', () => {
      const schema: JsonSchema = {
        type: 'array',
        items: {
          type: 'string'
        },
        maxItems: 21
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = virtualizedArrayTester(uischema, schema, undefined);
      expect(result).toBe(30);
    });

    it('should match array with very large maxItems', () => {
      const schema: JsonSchema = {
        type: 'array',
        items: {
          type: 'string'
        },
        maxItems: 1000
      };
      const uischema = {
        type: 'Control',
        scope: '#/properties/content'
      };

      const result = virtualizedArrayTester(uischema, schema, undefined);
      expect(result).toBe(30);
    });
  });
}); 