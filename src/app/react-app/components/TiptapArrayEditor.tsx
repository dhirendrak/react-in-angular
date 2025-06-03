import React from 'react';
import { ArrayControlProps, ControlProps } from '@jsonforms/core';
import { withJsonFormsArrayControlProps } from '@jsonforms/react';
import { Button, Stack } from '@mui/material';
import { TiptapEditorControl } from './TiptapEditor';

const TiptapArrayEditor: React.FC<ArrayControlProps> = ({ data, path, label, required, description, errors, visible }) => {
  const addItem = () => {
    const newData = [...(data || []), ''];
    // @ts-ignore - handleChange is provided by withJsonFormsArrayControlProps
    handleChange(path, newData);
  };

  const removeItem = (index: number) => {
    const newData = [...(data || [])];
    newData.splice(index, 1);
    // @ts-ignore - handleChange is provided by withJsonFormsArrayControlProps
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
              // @ts-ignore - These props are handled by the JsonForms context
              data={item}
              handleChange={(itemPath: string, value: string) => {
                const newData = [...(data || [])];
                newData[index] = value;
                // @ts-ignore - handleChange is provided by withJsonFormsArrayControlProps
                handleChange(path, newData);
              }}
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

export const TiptapArrayEditorControl = withJsonFormsArrayControlProps(TiptapArrayEditor); 