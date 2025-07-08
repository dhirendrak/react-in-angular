import React, { useState, useEffect } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { JsonSchema } from '@jsonforms/core';
import { Button, Stack, Snackbar, Alert } from '@mui/material';
import { TiptapEditorControl } from './components/TiptapEditor';
import { TiptapArrayEditorControl } from './components/TiptapArrayEditor';
import { VirtualizedArrayEditorControl } from './components/VirtualizedArrayEditor';
import { CollapsibleSectionEditorControl } from './components/CollapsibleSectionEditor';
import { htmlStringTester, htmlArrayItemTester } from './utils/schemaTesters';
import { virtualizedArrayTester } from './utils/virtualizedSchemaTesters';
import { collapsibleSectionTester } from './utils/collapsibleSectionTesters';

interface AppProps {
  focusElementObservable?: {
    subscribe: (callback: (elementId: string) => void) => { unsubscribe: () => void }
  }
}

const customRenderers = [
  ...materialRenderers,
  {
    tester: htmlStringTester,
    renderer: TiptapEditorControl
  },
  {
    tester: virtualizedArrayTester,
    renderer: VirtualizedArrayEditorControl
  },
  {
    tester: htmlArrayItemTester,
    renderer: TiptapArrayEditorControl
  },
  {
    tester: collapsibleSectionTester,
    renderer: CollapsibleSectionEditorControl
  }
];

export const App: React.FC<AppProps> = ({ focusElementObservable }) => {
  const [data, setData] = useState({});
  const [schema, setSchema] = useState<JsonSchema>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    // Fetch schema and form data from JSON Server
    Promise.all([
      fetch('http://localhost:3001/schema').then(response => response.json()),
      fetch('http://localhost:3001/form').then(response => response.json())
    ])
      .then(([schemaData, formData]) => {
        setSchema(schemaData);
        setData(formData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setSnackbar({
          open: true,
          message: 'Error loading form data',
          severity: 'error'
        });
      });
  }, []);

  useEffect(() => {
    // Subscribe to focus events from Angular
    if (focusElementObservable) {
      const subscription = focusElementObservable.subscribe((elementId: string) => {
        // Find the element by ID and focus it
        const element = document.getElementById(elementId);
        if (element) {
          // If it's an input, textarea, or other focusable element
          if ('focus' in element) {
            (element as HTMLElement & { focus: Function }).focus();
          }
          // Scroll element into view
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
    
    // Return a no-op cleanup function when focusElementObservable is undefined
    return () => {};
  }, [focusElementObservable]);

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3001/form', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Form data updated successfully!',
          severity: 'success'
        });
      } else {
        throw new Error('Failed to update data');
      }
    } catch (error) {
      console.error('Error updating data:', error);
      setSnackbar({
        open: true,
        message: 'Error updating form data',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h1>React JSON Forms Example</h1>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <JsonForms
            schema={schema}
            data={data}
            renderers={customRenderers}
            cells={materialCells}
            onChange={({ data }) => setData(data)}
            readonly={false}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSave}
            style={{ marginTop: '20px' }}
          >
            Save Form
          </Button>
          <div style={{ marginTop: '20px' }}>
            <h3>Form Data:</h3>
           {/* <pre>{JSON.stringify(data, null, 2)}</pre>  */}
          </div>
        </div>
      </div>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};