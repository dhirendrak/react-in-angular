import React, { useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

interface AppProps { }

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Name',
      description: 'Enter your full name'
    },
    dateOfBirth: {
      type: 'string',
      format: 'date',
      title: 'Date of Birth',
      description: 'Select your date of birth'
    },
    occupation: {
      type: 'string',
      title: 'Occupation',
      description: 'Select your occupation',
      enum: ['Developer', 'Designer', 'Manager', 'Other']
    }
  },
  required: ['name', 'dateOfBirth']
};


export const App: React.FC<AppProps> = () => {
  const [data, setData] = useState({});

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
            renderers={materialRenderers}
            cells={materialCells}
            onChange={({ data }) => setData(data)}
          />
          <div style={{ marginTop: '20px' }}>
            <h3>Form Data:</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}; 