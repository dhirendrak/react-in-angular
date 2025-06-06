import React, { useRef, useState, useEffect } from 'react';
import { ArrayControlProps } from '@jsonforms/core';
import { withJsonFormsArrayControlProps } from '@jsonforms/react';
import { Button, Stack, Typography, Box } from '@mui/material';
import { FixedSizeList as List } from 'react-window';
import { TiptapEditorControl } from './TiptapEditor';

interface ExtendedArrayControlProps extends ArrayControlProps {
  handleChange: (path: string, value: any) => void;
}

const VirtualizedArrayEditor: React.FC<ExtendedArrayControlProps> = ({
  data,
  path,
  label,
  required,
  description,
  errors,
  visible,
  handleChange
}) => {
  const [items, setItems] = useState<string[]>(data || []);
  const listRef = useRef<List>(null);
  const [listHeight, setListHeight] = useState(400); // Default height

  useEffect(() => {
    setItems(data || []);
  }, [data]);

  const addItem = () => {
    const newData = [...items, ''];
    handleChange(path, newData);
    // Scroll to the newly added item after render
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollToItem(newData.length - 1);
      }
    }, 100);
  };

  const removeItem = (index: number) => {
    const newData = [...items];
    newData.splice(index, 1);
    handleChange(path, newData);
  };

  // Calculate a reasonable height based on the number of items
  useEffect(() => {
    const calculatedHeight = Math.min(items.length * 200, 600);
    setListHeight(items.length > 0 ? calculatedHeight : 100);
  }, [items.length]);

  const ItemRenderer = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={{ ...style, padding: '8px' }}>
      <Box sx={{ position: 'relative', mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Item {index + 1}
        </Typography>
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
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          Remove
        </Button>
      </Box>
    </div>
  );

  return (
    <div style={{ marginBottom: '16px', display: visible === false ? 'none' : undefined }}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        {label}{required ? ' *' : ''}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}
      
      {items.length > 0 ? (
        <List
          ref={listRef}
          height={listHeight}
          itemCount={items.length}
          itemSize={200} // Approximate height for each item
          width="100%"
          style={{ border: '1px solid #e0e0e0', borderRadius: 4 }}
        >
          {ItemRenderer}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No items added yet.
        </Typography>
      )}
      
      <Button 
        variant="outlined" 
        onClick={addItem} 
        sx={{ mt: 2 }}
        startIcon={<span>+</span>}
      >
        Add Item
      </Button>
      
      {errors && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {errors}
        </Typography>
      )}
    </div>
  );
};

export const VirtualizedArrayEditorControl = withJsonFormsArrayControlProps(VirtualizedArrayEditor as React.ComponentType<ArrayControlProps>);