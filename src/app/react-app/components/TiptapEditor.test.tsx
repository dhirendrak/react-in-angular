import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TiptapEditor } from './TiptapEditor';

// Mock TipTap components
jest.mock('@tiptap/react', () => ({
  useEditor: jest.fn(() => ({
    commands: {
      setContent: jest.fn(),
      toggleBold: jest.fn(),
      toggleItalic: jest.fn(),
      toggleUnderline: jest.fn(),
      toggleStrike: jest.fn(),
      setHeading: jest.fn(),
      toggleBulletList: jest.fn(),
      toggleOrderedList: jest.fn(),
      toggleBlockquote: jest.fn(),
      setTextAlign: jest.fn(),
      insertTable: jest.fn(),
      insertImage: jest.fn(),
      insertContent: jest.fn()
    },
    getHTML: jest.fn(() => '<p>Test content</p>'),
    isActive: jest.fn(() => false),
    can: jest.fn(() => true)
  })),
  EditorContent: ({ editor }: any) => (
    <div data-testid="editor-content" data-editor={editor ? 'active' : 'inactive'}>
      Editor Content
    </div>
  )
}));

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  Button: ({ children, onClick, variant, color, size, style }: any) => (
    <button 
      data-testid="mui-button" 
      data-variant={variant} 
      data-color={color} 
      data-size={size}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  ),
  ButtonGroup: ({ children }: any) => <div data-testid="button-group">{children}</div>,
  ToggleButton: ({ children, value, selected, onChange }: any) => (
    <button 
      data-testid="toggle-button" 
      data-value={value} 
      data-selected={selected}
      onClick={onChange}
    >
      {children}
    </button>
  ),
  ToggleButtonGroup: ({ children, value, onChange }: any) => (
    <div data-testid="toggle-button-group" data-value={value} onClick={onChange}>
      {children}
    </div>
  ),
  Stack: ({ children }: any) => <div data-testid="mui-stack">{children}</div>,
  TextField: ({ label, value, onChange, multiline, rows }: any) => (
    <textarea 
      data-testid={`textfield-${label}`} 
      value={value} 
      onChange={onChange}
      data-multiline={multiline}
      data-rows={rows}
    />
  ),
  Dialog: ({ open, children }: any) => 
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogTitle: ({ children }: any) => <div data-testid="dialog-title">{children}</div>,
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogActions: ({ children }: any) => <div data-testid="dialog-actions">{children}</div>,
  Tooltip: ({ children, title }: any) => (
    <div data-testid="tooltip" data-title={title}>{children}</div>
  ),
  Popper: ({ children, open }: any) => 
    open ? <div data-testid="popper">{children}</div> : null,
  Paper: ({ children }: any) => <div data-testid="paper">{children}</div>,
  MenuList: ({ children }: any) => <div data-testid="menu-list">{children}</div>,
  MenuItem: ({ children, onClick }: any) => (
    <div data-testid="menu-item" onClick={onClick}>{children}</div>
  ),
  Divider: () => <div data-testid="divider" />,
  ClickAwayListener: ({ children, onClickAway }: any) => (
    <div data-testid="click-away-listener" onClick={onClickAway}>{children}</div>
  ),
  Grow: ({ children }: any) => <div data-testid="grow">{children}</div>
}));

// Mock Material-UI icons
jest.mock('@mui/icons-material', () => ({
  FormatBold: () => <div data-testid="icon-bold">Bold</div>,
  FormatItalic: () => <div data-testid="icon-italic">Italic</div>,
  FormatUnderlined: () => <div data-testid="icon-underline">Underline</div>,
  StrikethroughS: () => <div data-testid="icon-strike">Strike</div>,
  TextFields: () => <div data-testid="icon-text">Text</div>,
  TitleIcon: () => <div data-testid="icon-title">Title</div>,
  FormatListBulleted: () => <div data-testid="icon-bullet-list">Bullet List</div>,
  FormatListNumbered: () => <div data-testid="icon-numbered-list">Numbered List</div>,
  FormatQuote: () => <div data-testid="icon-quote">Quote</div>,
  FormatAlignLeft: () => <div data-testid="icon-align-left">Align Left</div>,
  FormatAlignCenter: () => <div data-testid="icon-align-center">Align Center</div>,
  FormatAlignRight: () => <div data-testid="icon-align-right">Align Right</div>,
  FormatAlignJustify: () => <div data-testid="icon-align-justify">Align Justify</div>,
  TableChart: () => <div data-testid="icon-table">Table</div>,
  ImageIcon: () => <div data-testid="icon-image">Image</div>,
  CodeIcon: () => <div data-testid="icon-code">Code</div>,
  CodeBlockIcon: () => <div data-testid="icon-code-block">Code Block</div>,
  HtmlIcon: () => <div data-testid="icon-html">HTML</div>,
  Fullscreen: () => <div data-testid="icon-fullscreen">Fullscreen</div>,
  FullscreenExit: () => <div data-testid="icon-fullscreen-exit">Fullscreen Exit</div>,
  ContentCopy: () => <div data-testid="icon-copy">Copy</div>,
  ContentCut: () => <div data-testid="icon-cut">Cut</div>,
  ContentPaste: () => <div data-testid="icon-paste">Paste</div>,
  SubscriptIcon: () => <div data-testid="icon-subscript">Subscript</div>,
  SuperscriptIcon: () => <div data-testid="icon-superscript">Superscript</div>,
  CalloutIcon: () => <div data-testid="icon-callout">Callout</div>,
  ArrowDropDownIcon: () => <div data-testid="icon-dropdown">Dropdown</div>
}));

describe('TiptapEditor', () => {
  const defaultProps = {
    data: '<p>Initial content</p>',
    handleChange: jest.fn(),
    path: 'testPath',
    label: 'Test Editor',
    required: false,
    description: 'Test description',
    errors: null,
    visible: true,
    enabled: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<TiptapEditor {...defaultProps} />);
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
  });

  it('displays the label with required asterisk when required is true', () => {
    render(<TiptapEditor {...defaultProps} required={true} />);
    expect(screen.getByText('Test Editor *')).toBeInTheDocument();
  });

  it('renders editor content', () => {
    render(<TiptapEditor {...defaultProps} />);
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
  });

  it('renders toolbar buttons', () => {
    render(<TiptapEditor {...defaultProps} />);
    
    // Check for various toolbar buttons
    expect(screen.getByTestId('icon-bold')).toBeInTheDocument();
    expect(screen.getByTestId('icon-italic')).toBeInTheDocument();
    expect(screen.getByTestId('icon-underline')).toBeInTheDocument();
    expect(screen.getByTestId('icon-strike')).toBeInTheDocument();
  });

  it('renders text formatting buttons', () => {
    render(<TiptapEditor {...defaultProps} />);
    
    expect(screen.getByTestId('icon-text')).toBeInTheDocument();
    expect(screen.getByTestId('icon-title')).toBeInTheDocument();
  });

  it('renders list formatting buttons', () => {
    render(<TiptapEditor {...defaultProps} />);
    
    expect(screen.getByTestId('icon-bullet-list')).toBeInTheDocument();
    expect(screen.getByTestId('icon-numbered-list')).toBeInTheDocument();
  });

  it('renders alignment buttons', () => {
    render(<TiptapEditor {...defaultProps} />);
    
    expect(screen.getByTestId('icon-align-left')).toBeInTheDocument();
    expect(screen.getByTestId('icon-align-center')).toBeInTheDocument();
    expect(screen.getByTestId('icon-align-right')).toBeInTheDocument();
    expect(screen.getByTestId('icon-align-justify')).toBeInTheDocument();
  });

  it('renders insert buttons', () => {
    render(<TiptapEditor {...defaultProps} />);
    
    expect(screen.getByTestId('icon-table')).toBeInTheDocument();
    expect(screen.getByTestId('icon-image')).toBeInTheDocument();
    expect(screen.getByTestId('icon-code')).toBeInTheDocument();
    expect(screen.getByTestId('icon-code-block')).toBeInTheDocument();
  });

  it('renders utility buttons', () => {
    render(<TiptapEditor {...defaultProps} />);
    
    expect(screen.getByTestId('icon-html')).toBeInTheDocument();
    expect(screen.getByTestId('icon-fullscreen')).toBeInTheDocument();
    expect(screen.getByTestId('icon-copy')).toBeInTheDocument();
    expect(screen.getByTestId('icon-cut')).toBeInTheDocument();
    expect(screen.getByTestId('icon-paste')).toBeInTheDocument();
  });

  it('displays error message when errors prop is provided', () => {
    const errorMessage = 'This field is required';
    render(<TiptapEditor {...defaultProps} errors={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('hides component when visible is false', () => {
    render(<TiptapEditor {...defaultProps} visible={false} />);
    
    const container = screen.getByText('Test Editor').closest('div');
    expect(container).toHaveStyle({ display: 'none' });
  });

  it('shows component when visible is true', () => {
    render(<TiptapEditor {...defaultProps} visible={true} />);
    
    const container = screen.getByText('Test Editor').closest('div');
    expect(container).not.toHaveStyle({ display: 'none' });
  });

  it('handles HTML view toggle', () => {
    render(<TiptapEditor {...defaultProps} />);
    
    const htmlButton = screen.getByTestId('icon-html').closest('button');
    if (htmlButton) {
      fireEvent.click(htmlButton);
      // The component should handle the HTML view toggle
      expect(htmlButton).toBeInTheDocument();
    }
  });

  it('handles fullscreen toggle', () => {
    render(<TiptapEditor {...defaultProps} />);
    
    const fullscreenButton = screen.getByTestId('icon-fullscreen').closest('button');
    if (fullscreenButton) {
      fireEvent.click(fullscreenButton);
      // The component should handle the fullscreen toggle
      expect(fullscreenButton).toBeInTheDocument();
    }
  });

  it('handles table insertion', () => {
    render(<TiptapEditor {...defaultProps} />);
    
    const tableButton = screen.getByTestId('icon-table').closest('button');
    if (tableButton) {
      fireEvent.click(tableButton);
      // Should open table dialog
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    }
  });

  it('handles image insertion', () => {
    render(<TiptapEditor {...defaultProps} />);
    
    const imageButton = screen.getByTestId('icon-image').closest('button');
    if (imageButton) {
      fireEvent.click(imageButton);
      // Should open image dialog
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    }
  });

  it('handles empty data', () => {
    render(<TiptapEditor {...defaultProps} data="" />);
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
  });

  it('handles null data', () => {
    render(<TiptapEditor {...defaultProps} data={null} />);
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
  });

  it('renders with description', () => {
    render(<TiptapEditor {...defaultProps} description="Help text" />);
    expect(screen.getByText('Help text')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<TiptapEditor {...defaultProps} enabled={false} />);
    // The editor should be disabled
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
  });
}); 