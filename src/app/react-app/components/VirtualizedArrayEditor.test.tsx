import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VirtualizedArrayEditor } from './VirtualizedArrayEditor';

// Mock react-window components
jest.mock('react-window', () => ({
  FixedSizeList: ({ children, itemCount, height }: any) => (
    <div data-testid="virtualized-list" data-item-count={itemCount} data-height={height}>
      {Array.from({ length: itemCount }, (_, index) => children({ index, style: {} }))}
    </div>
  )
}));

// Mock react-window-infinite-loader
jest.mock('react-window-infinite-loader', () => ({
  __esModule: true,
  default: ({ children }: any) => children({ onItemsRendered: jest.fn(), ref: jest.fn() })
}));

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  Button: ({ children, onClick }: any) => (
    <button data-testid="mui-button" onClick={onClick}>{children}</button>
  ),
  Stack: ({ children }: any) => <div data-testid="mui-stack">{children}</div>,
  TextField: ({ label, value, onChange }: any) => (
    <input data-testid={`textfield-${label}`} value={value} onChange={onChange} />
  )
}));

describe('VirtualizedArrayEditor', () => {
  const defaultProps = {
    data: ['Item 1', 'Item 2', 'Item 3'],
    path: 'testPath',
    label: 'Test Virtualized Array',
    required: false,
    description: 'Test description',
    errors: null,
    visible: true,
    handleChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<VirtualizedArrayEditor {...defaultProps} />);
    expect(screen.getByText('Test Virtualized Array')).toBeInTheDocument();
  });

  it('displays the label with required asterisk when required is true', () => {
    render(<VirtualizedArrayEditor {...defaultProps} required={true} />);
    expect(screen.getByText('Test Virtualized Array *')).toBeInTheDocument();
  });

  it('renders virtualized list with correct item count', () => {
    render(<VirtualizedArrayEditor {...defaultProps} />);
    
    const virtualizedList = screen.getByTestId('virtualized-list');
    expect(virtualizedList).toBeInTheDocument();
    expect(virtualizedList).toHaveAttribute('data-item-count', '3');
  });

  it('handles empty data array', () => {
    render(<VirtualizedArrayEditor {...defaultProps} data={[]} />);
    
    const virtualizedList = screen.getByTestId('virtualized-list');
    expect(virtualizedList).toHaveAttribute('data-item-count', '0');
  });

  it('handles null data', () => {
    render(<VirtualizedArrayEditor {...defaultProps} data={null} />);
    
    const virtualizedList = screen.getByTestId('virtualized-list');
    expect(virtualizedList).toHaveAttribute('data-item-count', '0');
  });

  it('adds new item when Add Item button is clicked', () => {
    render(<VirtualizedArrayEditor {...defaultProps} />);
    
    const addButton = screen.getByText('Add Item');
    fireEvent.click(addButton);
    
    expect(defaultProps.handleChange).toHaveBeenCalledWith('testPath', ['Item 1', 'Item 2', 'Item 3', '']);
  });

  it('removes item when Remove button is clicked', () => {
    render(<VirtualizedArrayEditor {...defaultProps} />);
    
    // Find and click the first remove button
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);
    
    expect(defaultProps.handleChange).toHaveBeenCalledWith('testPath', ['Item 2', 'Item 3']);
  });

  it('displays error message when errors prop is provided', () => {
    const errorMessage = 'This field is required';
    render(<VirtualizedArrayEditor {...defaultProps} errors={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('hides component when visible is false', () => {
    render(<VirtualizedArrayEditor {...defaultProps} visible={false} />);
    
    const container = screen.getByText('Test Virtualized Array').closest('div');
    expect(container).toHaveStyle({ display: 'none' });
  });

  it('shows component when visible is true', () => {
    render(<VirtualizedArrayEditor {...defaultProps} visible={true} />);
    
    const container = screen.getByText('Test Virtualized Array').closest('div');
    expect(container).not.toHaveStyle({ display: 'none' });
  });

  it('renders text fields for each item', () => {
    render(<VirtualizedArrayEditor {...defaultProps} />);
    
    // Check that text fields are rendered for each item
    expect(screen.getByTestId('textfield-Item 1')).toBeInTheDocument();
    expect(screen.getByTestId('textfield-Item 2')).toBeInTheDocument();
    expect(screen.getByTestId('textfield-Item 3')).toBeInTheDocument();
  });

  it('handles text field changes', () => {
    render(<VirtualizedArrayEditor {...defaultProps} />);
    
    const textField = screen.getByTestId('textfield-Item 1');
    fireEvent.change(textField, { target: { value: 'Updated Item 1' } });
    
    // The component should handle the change through the virtualized list
    expect(textField).toHaveValue('Updated Item 1');
  });

  it('handles large datasets efficiently', () => {
    const largeData = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);
    render(<VirtualizedArrayEditor {...defaultProps} data={largeData} />);
    
    const virtualizedList = screen.getByTestId('virtualized-list');
    expect(virtualizedList).toHaveAttribute('data-item-count', '1000');
  });
}); 