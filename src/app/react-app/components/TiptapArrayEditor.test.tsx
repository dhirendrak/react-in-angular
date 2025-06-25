import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TiptapArrayEditor } from './TiptapArrayEditor';

// Mock TiptapEditorControl
jest.mock('./TiptapEditor', () => ({
  TiptapEditorControl: ({ uischema, path }: any) => (
    <div data-testid={`tiptap-editor-${path}`}>
      {uischema.label}
    </div>
  )
}));

describe('TiptapArrayEditor', () => {
  const defaultProps = {
    data: ['Item 1', 'Item 2'],
    path: 'testPath',
    label: 'Test Array',
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
    render(<TiptapArrayEditor {...defaultProps} />);
    expect(screen.getByText('Test Array')).toBeInTheDocument();
  });

  it('displays the label with required asterisk when required is true', () => {
    render(<TiptapArrayEditor {...defaultProps} required={true} />);
    expect(screen.getByText('Test Array *')).toBeInTheDocument();
  });

  it('renders TiptapEditor for each array item', () => {
    render(<TiptapArrayEditor {...defaultProps} />);
    
    expect(screen.getByTestId('tiptap-editor-testPath.0')).toBeInTheDocument();
    expect(screen.getByTestId('tiptap-editor-testPath.1')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('handles empty data array', () => {
    render(<TiptapArrayEditor {...defaultProps} data={[]} />);
    expect(screen.getByText('Add Objective')).toBeInTheDocument();
  });

  it('handles null data', () => {
    render(<TiptapArrayEditor {...defaultProps} data={null} />);
    expect(screen.getByText('Add Objective')).toBeInTheDocument();
  });

  it('adds new item when Add Objective button is clicked', () => {
    render(<TiptapArrayEditor {...defaultProps} />);
    
    const addButton = screen.getByText('Add Objective');
    fireEvent.click(addButton);
    
    expect(defaultProps.handleChange).toHaveBeenCalledWith('testPath', ['Item 1', 'Item 2', '']);
  });

  it('removes item when Remove button is clicked', () => {
    render(<TiptapArrayEditor {...defaultProps} />);
    
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]); // Remove first item
    
    expect(defaultProps.handleChange).toHaveBeenCalledWith('testPath', ['Item 2']);
  });

  it('displays error message when errors prop is provided', () => {
    const errorMessage = 'This field is required';
    render(<TiptapArrayEditor {...defaultProps} errors={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('hides component when visible is false', () => {
    render(<TiptapArrayEditor {...defaultProps} visible={false} />);
    
    const container = screen.getByText('Test Array').closest('div');
    expect(container).toHaveStyle({ display: 'none' });
  });

  it('shows component when visible is true', () => {
    render(<TiptapArrayEditor {...defaultProps} visible={true} />);
    
    const container = screen.getByText('Test Array').closest('div');
    expect(container).not.toHaveStyle({ display: 'none' });
  });

  it('handles multiple remove operations correctly', () => {
    render(<TiptapArrayEditor {...defaultProps} />);
    
    const removeButtons = screen.getAllByText('Remove');
    
    // Remove first item
    fireEvent.click(removeButtons[0]);
    expect(defaultProps.handleChange).toHaveBeenCalledWith('testPath', ['Item 2']);
    
    // Remove second item
    fireEvent.click(removeButtons[1]);
    expect(defaultProps.handleChange).toHaveBeenCalledWith('testPath', ['Item 1']);
  });

  it('adds multiple items correctly', () => {
    render(<TiptapArrayEditor {...defaultProps} />);
    
    const addButton = screen.getByText('Add Objective');
    
    // Add first item
    fireEvent.click(addButton);
    expect(defaultProps.handleChange).toHaveBeenCalledWith('testPath', ['Item 1', 'Item 2', '']);
    
    // Add second item
    fireEvent.click(addButton);
    expect(defaultProps.handleChange).toHaveBeenCalledWith('testPath', ['Item 1', 'Item 2', '', '']);
  });
}); 