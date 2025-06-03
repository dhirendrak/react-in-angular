import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ControlProps } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Button, Stack } from '@mui/material';

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

export const TiptapEditorControl = withJsonFormsControlProps(TiptapEditor); 