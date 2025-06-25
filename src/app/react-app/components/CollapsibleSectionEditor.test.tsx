import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CollapsibleSectionEditor } from './CollapsibleSectionEditor';

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  Accordion: ({ children, expanded, onChange }: any) => (
    <div data-testid="accordion" data-expanded={expanded} onClick={onChange}>
      {children}
    </div>
  ),
  AccordionSummary: ({ children, expandIcon }: any) => (
    <div data-testid="accordion-summary">
      {children}
      {expandIcon}
    </div>
  ),
  AccordionDetails: ({ children }: any) => (
    <div data-testid="accordion-details">{children}</div>
  ),
  Typography: ({ children }: any) => <div data-testid="typography">{children}</div>,
  ExpandMore: () => <div data-testid="expand-icon">Expand</div>
}));

// Mock JsonForms components
jest.mock('@jsonforms/react', () => ({
  JsonForms: ({ schema, data, onChange }: any) => (
    <div data-testid="jsonforms">
      <input 
        data-testid="jsonforms-input" 
        value={JSON.stringify(data)} 
        onChange={(e) => onChange({ data: JSON.parse(e.target.value) })}
      />
    </div>
  )
}));

describe('CollapsibleSectionEditor', () => {
  const defaultProps = {
    data: { section1: 'value1', section2: 'value2' },
    path: 'testPath',
    label: 'Test Collapsible Section',
    required: false,
    description: 'Test description',
    errors: null,
    visible: true,
    handleChange: jest.fn(),
    schema: {
      type: 'object',
      properties: {
        section1: { type: 'string' },
        section2: { type: 'string' }
      }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<CollapsibleSectionEditor {...defaultProps} />);
    expect(screen.getByText('Test Collapsible Section')).toBeInTheDocument();
  });

  it('displays the label with required asterisk when required is true', () => {
    render(<CollapsibleSectionEditor {...defaultProps} required={true} />);
    expect(screen.getByText('Test Collapsible Section *')).toBeInTheDocument();
  });

  it('renders accordion component', () => {
    render(<CollapsibleSectionEditor {...defaultProps} />);
    expect(screen.getByTestId('accordion')).toBeInTheDocument();
  });

  it('renders accordion summary with label', () => {
    render(<CollapsibleSectionEditor {...defaultProps} />);
    expect(screen.getByTestId('accordion-summary')).toBeInTheDocument();
    expect(screen.getByTestId('typography')).toHaveTextContent('Test Collapsible Section');
  });

  it('renders expand icon', () => {
    render(<CollapsibleSectionEditor {...defaultProps} />);
    expect(screen.getByTestId('expand-icon')).toBeInTheDocument();
  });

  it('renders JsonForms in accordion details', () => {
    render(<CollapsibleSectionEditor {...defaultProps} />);
    expect(screen.getByTestId('accordion-details')).toBeInTheDocument();
    expect(screen.getByTestId('jsonforms')).toBeInTheDocument();
  });

  it('handles accordion expansion', () => {
    render(<CollapsibleSectionEditor {...defaultProps} />);
    
    const accordion = screen.getByTestId('accordion');
    fireEvent.click(accordion);
    
    // The accordion should handle the expansion state
    expect(accordion).toBeInTheDocument();
  });

  it('displays error message when errors prop is provided', () => {
    const errorMessage = 'This field is required';
    render(<CollapsibleSectionEditor {...defaultProps} errors={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('hides component when visible is false', () => {
    render(<CollapsibleSectionEditor {...defaultProps} visible={false} />);
    
    const container = screen.getByText('Test Collapsible Section').closest('div');
    expect(container).toHaveStyle({ display: 'none' });
  });

  it('shows component when visible is true', () => {
    render(<CollapsibleSectionEditor {...defaultProps} visible={true} />);
    
    const container = screen.getByText('Test Collapsible Section').closest('div');
    expect(container).not.toHaveStyle({ display: 'none' });
  });

  it('passes correct props to JsonForms', () => {
    render(<CollapsibleSectionEditor {...defaultProps} />);
    
    const jsonformsInput = screen.getByTestId('jsonforms-input');
    expect(jsonformsInput).toHaveValue(JSON.stringify(defaultProps.data));
  });

  it('handles JsonForms data changes', () => {
    render(<CollapsibleSectionEditor {...defaultProps} />);
    
    const jsonformsInput = screen.getByTestId('jsonforms-input');
    const newData = { section1: 'new value', section2: 'value2' };
    
    fireEvent.change(jsonformsInput, { target: { value: JSON.stringify(newData) } });
    
    // The component should handle the change through JsonForms
    expect(jsonformsInput).toHaveValue(JSON.stringify(newData));
  });

  it('handles empty data', () => {
    render(<CollapsibleSectionEditor {...defaultProps} data={{}} />);
    
    const jsonformsInput = screen.getByTestId('jsonforms-input');
    expect(jsonformsInput).toHaveValue('{}');
  });

  it('handles null data', () => {
    render(<CollapsibleSectionEditor {...defaultProps} data={null} />);
    
    const jsonformsInput = screen.getByTestId('jsonforms-input');
    expect(jsonformsInput).toHaveValue('null');
  });

  it('renders with complex schema', () => {
    const complexSchema = {
      type: 'object',
      properties: {
        nested: {
          type: 'object',
          properties: {
            field1: { type: 'string' },
            field2: { type: 'number' }
          }
        }
      }
    };
    
    render(<CollapsibleSectionEditor {...defaultProps} schema={complexSchema} />);
    expect(screen.getByTestId('jsonforms')).toBeInTheDocument();
  });
}); 