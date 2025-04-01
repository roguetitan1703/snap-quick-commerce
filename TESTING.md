# Testing Guide for Snap Quick Commerce

This document provides an overview of the testing setup for the Snap Quick Commerce app and guidelines for writing tests.

## Test Setup

The app uses the following testing tools:

- **Jest**: The main testing framework
- **React Testing Library**: For testing React components
- **@testing-library/user-event**: For simulating user interactions

## Setting Up the Test Environment

We've already configured the test environment in the following files:

1. **jest.config.js**: The main Jest configuration file
2. **jest.setup.js**: Setup code that runs before tests
3. **tsconfig.json**: Includes TypeScript configuration for tests

## Running Tests

To run tests, use these npm scripts:

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test File Organization

Test files should be organized using one of these approaches:

1. **Co-location**: Place test files next to the code they test with a `.test.ts(x)` or `.spec.ts(x)` extension
2. **Test directories**: Place tests in a `__tests__` directory next to the code they test

## Writing Tests

### Component Tests

For React components, use React Testing Library to write tests that focus on user interactions rather than implementation details:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("responds to user interaction", () => {
    render(<MyComponent />);
    fireEvent.click(screen.getByText("Click me"));
    expect(screen.getByText("Button clicked")).toBeInTheDocument();
  });
});
```

### Store Tests

For testing Zustand stores, render a hook with the store and interact with it:

```tsx
import { renderHook, act } from "@testing-library/react";
import { useMyStore } from "./myStore";

describe("myStore", () => {
  it("updates state correctly", () => {
    const { result } = renderHook(() => useMyStore());

    act(() => {
      result.current.someAction();
    });

    expect(result.current.someState).toBe(expectedValue);
  });
});
```

### Utility/Function Tests

For pure functions and utilities, write simple unit tests:

```ts
import { myFunction } from "./myUtils";

describe("myFunction", () => {
  it("returns expected result", () => {
    expect(myFunction(input)).toBe(expectedOutput);
  });
});
```

## Mocking

### Mocking Components

Use Jest's mocking capabilities to mock dependencies:

```tsx
// Mock a component
jest.mock("../components/ComplexComponent", () => {
  return function MockComplexComponent(props) {
    return <div data-testid="mock-complex">{props.children}</div>;
  };
});
```

### Mocking Hooks and APIs

Mock hooks and APIs as needed:

```tsx
// Mock a hook
jest.mock("../hooks/useApi", () => ({
  useApi: jest.fn().mockReturnValue({
    data: mockData,
    isLoading: false,
    error: null,
  }),
}));
```

## Known Issues

- There may be TypeScript errors in test files due to the need to manually import Jest types in each test file.
- The current React version (19) has limited compatibility with the testing libraries. A solution is to use the `--legacy-peer-deps` flag when installing testing dependencies.

## Troubleshooting

1. **TypeScript errors for Jest globals**: Add `import 'jest';` at the top of your test file
2. **"Cannot find module" errors**: Ensure the module is correctly imported and mocked if necessary
3. **Component rendering issues**: Check that all required props are provided and providers are set up

## Best Practices

1. **Test behavior, not implementation**: Focus on what the user sees and does, not internal implementation details
2. **Use semantic queries**: Prefer `getByRole`, `getByLabelText`, and `getByText` over `getByTestId`
3. **Mock minimally**: Only mock what is necessary for the test to run
4. **Keep tests independent**: Each test should be able to run independently of others
5. **Test error states**: Don't just test the happy path; test error handling too
