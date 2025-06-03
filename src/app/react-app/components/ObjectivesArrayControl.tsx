import React from 'react';
import { withJsonFormsArrayControlProps } from '@jsonforms/react';
import { ArrayControlProps } from '@jsonforms/core';
import { Button, IconButton, TextField, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const ObjectivesArrayControl: React.FC<ArrayControlProps> = ({ data, path, addItem, removeItems, label, required, description, errors, visible }) => {
  const objectives = Array.isArray(data) ? data : [];

  const handleObjectiveChange = (index: number, value: string) => {
    const updated = [...objectives];
    updated[index] = value;
    objectives[index] = value;
  };

  const handleAddObjective = () => {
    if (addItem) {
      addItem(path, '');
    }
  };

  const handleRemoveObjective = (index: number) => {
    if (removeItems) {
      removeItems(path, [index])();
    }
  };

  return (
    <div style={{ marginBottom: '16px', display: visible === false ? 'none' : undefined }}>
      <Typography variant="h6" gutterBottom>{label}{required ? ' *' : ''}</Typography>
      {description && <Typography variant="body2" color="textSecondary">{description}</Typography>}
      <Stack spacing={2}>
        {objectives.map((objective, idx) => (
          <Stack direction="row" spacing={1} alignItems="center" key={idx}>
            <TextField
              fullWidth
              value={objective}
              onChange={e => handleObjectiveChange(idx, e.target.value)}
              placeholder={`Objective ${idx + 1}`}
              variant="outlined"
              size="small"
            />
            <IconButton onClick={() => handleRemoveObjective(idx)} aria-label="delete" color="error">
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
        <Button startIcon={<AddIcon />} onClick={handleAddObjective} variant="outlined">
          Add Objective
        </Button>
      </Stack>
      {errors && <Typography color="error" variant="body2" style={{ marginTop: 4 }}>{errors}</Typography>}
    </div>
  );
};

export default withJsonFormsArrayControlProps(ObjectivesArrayControl); 