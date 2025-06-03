import React, { useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { ControlProps } from '@jsonforms/core';
import { Button, Stack } from '@mui/material';

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
    },
    description: {
      type: 'string',
      title: 'Description',
      description: 'Enter a detailed description',
      format: 'html'
    }
  },
  required: ['name', 'dateOfBirth']
};

const TiptapEditor: React.FC<ControlProps> = ({ data, handleChange, path, label, required, description, errors, visible }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: data || '',
    onUpdate: ({ editor }) => {
      handleChange(path, editor.getHTML());
    },
  });

  return (
    <div style={{ marginBottom: '16px', display: visible === false ? 'none' : undefined }}>
      <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 4 }}>
        {label}{required ? ' *' : ''}
      </label>
      {description && <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{description}</div>}
      <Stack direction="row" spacing={1} style={{ marginBottom: 8 }}>
        <Button variant="outlined" size="small" onClick={() => editor?.chain().focus().toggleBold().run()} disabled={!editor}>Bold</Button>
        <Button variant="outlined" size="small" onClick={() => editor?.chain().focus().toggleItalic().run()} disabled={!editor}>Italic</Button>
      </Stack>
      <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px', minHeight: 80 }}>
        <EditorContent editor={editor} />
      </div>
      {errors && <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors}</div>}
    </div>
  );
};

const TiptapEditorControl = withJsonFormsControlProps(TiptapEditor);

const customRenderers = [
  ...materialRenderers,
  {
    tester: (schema: JsonSchema) => {
      return schema?.format === 'html' ? 10 : -1;
    },
    renderer: TiptapEditorControl
  }
];


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
            renderers={customRenderers}
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