import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

// Mock fetch
global.fetch = jest.fn();

// Mock JsonForms components
jest.mock('@jsonforms/react', () => ({
  JsonForms: ({ onChange, data }: any) => (
    <div data-testid="jsonforms">
      <input 
        data-testid="jsonforms-input" 
        value={JSON.stringify(data)} 
        onChange={(e) => onChange({ data: JSON.parse(e.target.value) })}
      />
    </div>
  )
}));

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  Button: ({ children, onClick }: any) => (
    <button data-testid="mui-button" onClick={onClick}>{children}</button>
  ),
  Stack: ({ children }: any) => <div data-testid="mui-stack">{children}</div>,
  Snackbar: ({ open, children }: any) => 
    open ? <div data-testid="snackbar">{children}</div> : null,
  Alert: ({ children, severity }: any) => (
    <div data-testid={`alert-${severity}`}>{children}</div>
  )
}));

// Mock ThemeProvider
jest.mock('@mui/material/styles', () => ({
  ThemeProvider: ({ children }: any) => <div data-testid="theme-provider">{children}</div>,
  createTheme: jest.fn(() => ({})),
}));

// Mock CssBaseline
jest.mock('@mui/material/CssBaseline', () => ({
  __esModule: true,
  default: () => <div data-testid="css-baseline" />
}));

describe('App Component', () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('React JSON Forms Example')).toBeInTheDocument();
  });

  it('fetches schema and form data on mount', async () => {
    const mockSchema = { type: 'object', properties: {} };
    const mockFormData = { test: 'value' };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSchema
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockFormData
      } as Response);

    render(<App />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/schema');
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/form');
    });
  });

  it('handles fetch error gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('snackbar')).toBeInTheDocument();
      expect(screen.getByTestId('alert-error')).toBeInTheDocument();
    });
  });

  it('saves form data when save button is clicked', async () => {
    const mockSchema = { type: 'object', properties: {} };
    const mockFormData = { test: 'value' };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSchema
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockFormData
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      } as Response);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Save Form')).toBeInTheDocument();
    });

    const saveButton = screen.getByText('Save Form');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/form',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });
  });

  it('handles save error gracefully', async () => {
    const mockSchema = { type: 'object', properties: {} };
    const mockFormData = { test: 'value' };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSchema
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockFormData
      } as Response)
      .mockRejectedValue(new Error('Save failed'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Save Form')).toBeInTheDocument();
    });

    const saveButton = screen.getByText('Save Form');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByTestId('alert-error')).toBeInTheDocument();
    });
  });

  it('closes snackbar when close is triggered', async () => {
    const mockSchema = { type: 'object', properties: {} };
    const mockFormData = { test: 'value' };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSchema
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockFormData
      } as Response);

    render(<App />);

    // Trigger an error to show snackbar
    mockFetch.mockRejectedValueOnce(new Error('Test error'));

    await waitFor(() => {
      expect(screen.getByTestId('snackbar')).toBeInTheDocument();
    });

    // The snackbar should auto-hide after 6 seconds
    await waitFor(() => {
      expect(screen.queryByTestId('snackbar')).not.toBeInTheDocument();
    }, { timeout: 7000 });
  });

  it('renders JsonForms with correct props', async () => {
    const mockSchema = { type: 'object', properties: {} };
    const mockFormData = { test: 'value' };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSchema
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockFormData
      } as Response);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('jsonforms')).toBeInTheDocument();
    });
  });
}); 