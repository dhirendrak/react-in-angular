import React from 'react';
import { ArrayControlProps } from '@jsonforms/core';
import { withJsonFormsArrayControlProps } from '@jsonforms/react';
import { Button, Stack } from '@mui/material';
import { TiptapEditorControl } from './TiptapEditor';

interface ExtendedArrayControlProps extends ArrayControlProps {
  handleChange: (path: string, value: any) => void;
}

const TiptapArrayEditor: React.FC<ExtendedArrayControlProps> = ({
  data,
  path,
  label,
  required,
  description,
  errors,
  visible,
  handleChange
}) => {
  const addItem = () => {
    const newData = [...(data || []), ''];
    handleChange(path, newData);
  };

  const removeItem = (index: number) => {
    const newData = [...(data || [])];
    newData.splice(index, 1);
    handleChange(path, newData);
  };

  return (
    <div style={{ marginBottom: '16px', display: visible === false ? 'none' : undefined }}>
      <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 4 }}>
        {label}{required ? ' *' : ''}
      </label>
      <Stack spacing={2}>
        {(data || []).map((item: string, index: number) => (
          <div key={index} style={{ position: 'relative' }}>
            <TiptapEditorControl
              uischema={{
                type: 'Control',
                scope: `${path}.${index}`,
                label: `Item ${index + 1}`
              }}
              schema={{
                type: 'string',
                format: 'html'
              }}
              path={`${path}.${index}`}
              visible={true}
            />
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => removeItem(index)}
              style={{ position: 'absolute', top: 0, right: 0 }}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button variant="outlined" onClick={addItem}>
          Add Objective
        </Button>
      </Stack>
      {errors && <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors}</div>}
    </div>
  );
};

export const TiptapArrayEditorControl = withJsonFormsArrayControlProps(TiptapArrayEditor as React.ComponentType<ArrayControlProps>); 