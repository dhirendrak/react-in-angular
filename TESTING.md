# Testing Documentation

This document provides comprehensive information about the testing setup and how to run tests for the React-in-Angular application.

## Test Structure

The application uses a hybrid testing approach with both Angular (Karma/Jasmine) and React (Jest) testing frameworks:

### Angular Tests (Karma/Jasmine)
- **Location**: `src/app/**/*.spec.ts`
- **Framework**: Angular Testing Utilities + Jasmine
- **Runner**: Karma
- **Coverage**: Angular components and services

### React Tests (Jest)
- **Location**: `src/app/react-app/**/*.test.tsx`
- **Framework**: Jest + React Testing Library
- **Runner**: Jest
- **Coverage**: React components and utilities

## Test Files

### Angular Components
- `src/app/app.component.spec.ts` - Main Angular application component
- `src/app/components/react-wrapper/react-wrapper.component.spec.ts` - React wrapper component
- `src/app/integration.test.ts` - Integration tests

### React Components
- `src/app/react-app/App.test.tsx` - Main React application component
- `src/app/react-app/components/TiptapEditor.test.tsx` - Rich text editor component
- `src/app/react-app/components/TiptapArrayEditor.test.tsx` - Array editor component
- `src/app/react-app/components/VirtualizedArrayEditor.test.tsx` - Virtualized array editor
- `src/app/react-app/components/CollapsibleSectionEditor.test.tsx` - Collapsible section editor

### Utility Functions
- `src/app/react-app/utils/schemaTesters.test.ts` - Schema tester utilities
- `src/app/react-app/utils/virtualizedSchemaTesters.test.ts` - Virtualized schema testers
- `src/app/react-app/utils/collapsibleSectionTesters.test.ts` - Collapsible section testers

## Running Tests

### Prerequisites
Make sure you have installed all dependencies:
```bash
npm install
```

### Angular Tests (Karma)
```bash
# Run Angular tests once
npm test

# Run Angular tests in watch mode
npm run test:watch

# Run Angular tests with coverage
npm run test:coverage
```

### React Tests (Jest)
```bash
# Run React tests once
npm run test:react

# Run React tests in watch mode
npm run test:react:watch
```

### All Tests
To run both Angular and React tests:
```bash
# Run Angular tests first
npm test

# Then run React tests
npm run test:react
```

## Test Coverage

### Angular Coverage
- **AppComponent**: Component creation, rendering, styling, and structure
- **ReactWrapperComponent**: React integration, lifecycle management, DOM manipulation

### React Coverage
- **App Component**: Data fetching, form handling, error management, UI interactions
- **TiptapEditor**: Rich text editing, toolbar functionality, dialogs, state management
- **TiptapArrayEditor**: Array manipulation, item addition/removal, validation
- **VirtualizedArrayEditor**: Virtualization, large dataset handling, performance
- **CollapsibleSectionEditor**: Accordion functionality, section management

### Utility Coverage
- **Schema Testers**: JSON schema matching, format validation, array detection
- **Virtualized Schema Testers**: Performance optimization detection
- **Collapsible Section Testers**: Section identification and matching

## Test Configuration

### Angular (Karma)
- **Config**: `karma.conf.js`
- **Entry Point**: `src/test.ts`
- **Polyfills**: `src/polyfills.ts`
- **TypeScript Config**: `tsconfig.spec.json`

### React (Jest)
- **Config**: `jest.config.js`
- **Setup**: `src/setupTests.ts`
- **Environment**: jsdom
- **Mock Files**: `src/__mocks__/fileMock.js`

## Mocking Strategy

### Angular Mocks
- React components are mocked to avoid complex dependencies
- React DOM operations are mocked for testing
- External services are mocked where appropriate

### React Mocks
- Material-UI components are mocked for consistent testing
- TipTap editor is mocked to focus on component logic
- External APIs (fetch) are mocked for controlled testing
- React Window components are mocked for virtualization testing

## Test Patterns

### Component Testing
```typescript
// Angular Component Test Pattern
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentName]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### React Component Testing
```typescript
// React Component Test Pattern
describe('ComponentName', () => {
  const defaultProps = {
    // Define default props
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ComponentName {...defaultProps} />);
    expect(screen.getByTestId('component')).toBeInTheDocument();
  });
});
```

## Best Practices

### Test Organization
1. **Group related tests** using `describe` blocks
2. **Use descriptive test names** that explain the expected behavior
3. **Test one thing at a time** - each test should have a single responsibility
4. **Use beforeEach** to set up common test data and mocks

### Mocking Guidelines
1. **Mock external dependencies** to isolate the unit under test
2. **Use consistent mock implementations** across tests
3. **Mock at the right level** - mock interfaces, not implementations
4. **Reset mocks** between tests to avoid test interference

### Assertion Patterns
1. **Test user behavior** rather than implementation details
2. **Use semantic queries** (getByRole, getByLabelText) when possible
3. **Assert on outcomes** rather than internal state
4. **Test error conditions** and edge cases

## Debugging Tests

### Angular Tests
- Tests run in browser - use browser dev tools
- Karma provides detailed error messages
- Use `fdescribe` and `fit` to focus on specific tests

### React Tests
- Use `console.log` for debugging (output shown in terminal)
- Use `screen.debug()` to see rendered output
- Use `--verbose` flag for more detailed output

### Common Issues
1. **Async operations**: Use `waitFor` or `async/await`
2. **Component not found**: Check imports and module configuration
3. **Mock not working**: Verify mock setup and reset
4. **Timing issues**: Use proper async testing patterns

## Continuous Integration

The test setup is designed to work with CI/CD pipelines:

```yaml
# Example CI configuration
- name: Install dependencies
  run: npm install

- name: Run Angular tests
  run: npm run test:coverage

- name: Run React tests
  run: npm run test:react
```

## Coverage Reports

### Angular Coverage
- Generated in `coverage/angular-react-app/`
- HTML report available at `coverage/angular-react-app/index.html`
- Includes line, branch, and function coverage

### React Coverage
- Generated in `coverage/`
- HTML report available at `coverage/lcov-report/index.html`
- Includes line, branch, and function coverage

## Performance Testing

The test suite includes performance-related tests:
- **Virtualization**: Tests for large dataset handling
- **Memory leaks**: Component cleanup and unmounting
- **Rendering performance**: Component rendering efficiency

## Future Enhancements

1. **E2E Testing**: Add Cypress or Playwright for end-to-end testing
2. **Visual Regression**: Add visual testing for UI consistency
3. **Performance Testing**: Add performance benchmarks
4. **Accessibility Testing**: Add a11y testing with axe-core
5. **Contract Testing**: Add API contract testing

## Troubleshooting

### Common Problems

1. **Tests not running**: Check if all dependencies are installed
2. **Mock not working**: Verify mock setup and imports
3. **Async test failures**: Use proper async testing patterns
4. **Component not rendering**: Check component imports and dependencies

### Getting Help

1. Check the console output for detailed error messages
2. Verify test configuration files
3. Ensure all dependencies are properly installed
4. Check for TypeScript compilation errors 