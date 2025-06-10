import React, { useState } from 'react';
import { ArrayControlProps } from '@jsonforms/core';
import { withJsonFormsArrayControlProps } from '@jsonforms/react';
import { 
  Button, 
  Stack, 
  Typography, 
  Box, 
  IconButton,
  Collapse,
  TextField
} from '@mui/material';
import { ExpandMore, ExpandLess, Add, Delete } from '@mui/icons-material';
import { TiptapEditorControl } from './TiptapEditor';

interface Section {
  title?: string;
  entries?: any[];
}

interface Entry {
  term?: string;
  definition?: string;
  media?: {
    image?: string;
    audio?: string;
  };
}

interface ExtendedArrayControlProps extends ArrayControlProps {
  handleChange: (path: string, value: any) => void;
}

const CollapsibleSectionEditor: React.FC<ExtendedArrayControlProps> = ({
  data,
  path,
  label,
  required,
  description,
  errors,
  visible,
  handleChange
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const sections: Section[] = data || [];

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const addSection = () => {
    const newSections = [...sections, { title: '', entries: [] }];
    handleChange(path, newSections);
  };

  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    handleChange(path, newSections);
  };

  const updateSection = (index: number, field: keyof Section, value: any) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    handleChange(path, newSections);
  };

  const addEntry = (sectionIndex: number) => {
    const newSections = [...sections];
    const currentEntries = newSections[sectionIndex]?.entries || [];
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      entries: [...currentEntries, { term: '', definition: '', media: {} }]
    };
    handleChange(path, newSections);
  };

  const removeEntry = (sectionIndex: number, entryIndex: number) => {
    const newSections = [...sections];
    const currentEntries = [...(newSections[sectionIndex]?.entries || [])];
    currentEntries.splice(entryIndex, 1);
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      entries: currentEntries
    };
    handleChange(path, newSections);
  };

  const updateEntry = (sectionIndex: number, entryIndex: number, field: string, value: any) => {
    const newSections = [...sections];
    const currentEntries = [...(newSections[sectionIndex]?.entries || [])];
    currentEntries[entryIndex] = { ...currentEntries[entryIndex], [field]: value };
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      entries: currentEntries
    };
    handleChange(path, newSections);
  };

  return (
    <div style={{ marginBottom: '16px', display: visible === false ? 'none' : undefined }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        {label}{required ? ' *' : ''}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}

      <Stack spacing={2}>
        {sections.map((section, sectionIndex) => (
          <Box
            key={sectionIndex}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            {/* Section Header */}
            <Box
              sx={{
                p: 2,
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
              onClick={() => toggleSection(sectionIndex)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {section.title || `Section ${sectionIndex + 1}`}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  ({section.entries?.length || 0} entries)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {expandedSections.has(sectionIndex) ? <ExpandLess /> : <ExpandMore />}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSection(sectionIndex);
                  }}
                  sx={{ ml: 1 }}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>

            {/* Section Content - Collapsible */}
            <Collapse in={expandedSections.has(sectionIndex)}>
              <Box sx={{ p: 2 }}>
                {/* Section Title Editor */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Section Title
                  </Typography>
                  <TextField
                    fullWidth
                    value={section.title || ''}
                    onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                    placeholder="Enter section title"
                    variant="outlined"
                    size="small"
                  />
                </Box>

                {/* Entries - Only render when expanded */}
                {expandedSections.has(sectionIndex) && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Entries
                    </Typography>
                    <Stack spacing={2}>
                      {(section.entries || []).map((entry: Entry, entryIndex: number) => (
                        <Box
                          key={entryIndex}
                          sx={{
                            p: 2,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            position: 'relative'
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => removeEntry(sectionIndex, entryIndex)}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              backgroundColor: 'rgba(255, 255, 255, 0.8)'
                            }}
                          >
                            <Delete />
                          </IconButton>

                          <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                            Entry {entryIndex + 1}
                          </Typography>

                          {/* Term */}
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              Term
                            </Typography>
                            <TiptapEditorControl
                              uischema={{
                                type: 'Control',
                                scope: `${path}.${sectionIndex}.entries.${entryIndex}.term`,
                                label: `Term ${entryIndex + 1}`
                              }}
                              schema={{
                                type: 'string',
                                format: 'html'
                              }}
                              path={`${path}.${sectionIndex}.entries.${entryIndex}.term`}
                              visible={true}
                            />
                          </Box>

                          {/* Definition */}
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              Definition
                            </Typography>
                            <TiptapEditorControl
                              uischema={{
                                type: 'Control',
                                scope: `${path}.${sectionIndex}.entries.${entryIndex}.definition`,
                                label: `Definition ${entryIndex + 1}`
                              }}
                              schema={{
                                type: 'string',
                                format: 'html'
                              }}
                              path={`${path}.${sectionIndex}.entries.${entryIndex}.definition`}
                              visible={true}
                            />
                          </Box>

                          {/* Media URLs */}
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              Media URLs
                            </Typography>
                            <Stack spacing={1}>
                              <TextField
                                fullWidth
                                size="small"
                                placeholder="Image URL"
                                value={entry.media?.image || ''}
                                onChange={(e) => updateEntry(sectionIndex, entryIndex, 'media', {
                                  ...entry.media,
                                  image: e.target.value
                                })}
                              />
                              <TextField
                                fullWidth
                                size="small"
                                placeholder="Audio URL"
                                value={entry.media?.audio || ''}
                                onChange={(e) => updateEntry(sectionIndex, entryIndex, 'media', {
                                  ...entry.media,
                                  audio: e.target.value
                                })}
                              />
                            </Stack>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                <Button
                  variant="outlined"
                  onClick={() => addEntry(sectionIndex)}
                  startIcon={<Add />}
                  sx={{ mt: 1 }}
                >
                  Add Entry
                </Button>
              </Box>
            </Collapse>
          </Box>
        ))}
      </Stack>

      <Button
        variant="outlined"
        onClick={addSection}
        startIcon={<Add />}
        sx={{ mt: 2 }}
      >
        Add Section
      </Button>

      {errors && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {errors}
        </Typography>
      )}
    </div>
  );
};

export const CollapsibleSectionEditorControl = withJsonFormsArrayControlProps(CollapsibleSectionEditor as React.ComponentType<ArrayControlProps>); 