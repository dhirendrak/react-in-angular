import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Paragraph from '@tiptap/extension-paragraph';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TextAlign from '@tiptap/extension-text-align';
import { ControlProps } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import {
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Tooltip,
  TextField
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  Code as CodeIcon,
  Code as CodeBlockIcon,
  FormatQuote,
  HorizontalRule as HorizontalRuleIcon,
  FormatListBulleted,
  FormatListNumbered,
  Title as TitleIcon,
  TextFields,
  Code as HtmlIcon,
  FormatClear,
  ContentCut,
  ContentCopy,
  ContentPaste,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify
} from '@mui/icons-material';

const TiptapEditor: React.FC<ControlProps> = ({ data, handleChange, path, label, required, description, errors, visible }) => {
  const [isHtmlView, setIsHtmlView] = useState(false);
  const [htmlContent, setHtmlContent] = useState(data || '');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Strike,
      Code,
      CodeBlock,
      Paragraph,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6]
      }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      HorizontalRule,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify']
      })
    ],
    content: data || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setHtmlContent(html);
      handleChange(path, html);
    },
  });

  if (!editor) {
    return null;
  }

  const headingLevels = [1, 2, 3, 4, 5, 6];

  const handleViewToggle = () => {
    if (isHtmlView) {
      // Switching from HTML to formatted view
      editor.commands.setContent(htmlContent);
    } else {
      // Switching from formatted to HTML view
      setHtmlContent(editor.getHTML());
    }
    setIsHtmlView(!isHtmlView);
  };

  const handleHtmlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHtml = event.target.value;
    setHtmlContent(newHtml);
    handleChange(path, newHtml);
  };

  // Cut, Copy, Paste handlers - Only for formatted view
  const handleCut = () => {
    // Only works in formatted view since button is disabled in HTML view
    const { from, to } = editor.state.selection;
    if (from !== to) {
      const text = editor.state.doc.textBetween(from, to);
      navigator.clipboard.writeText(text).then(() => {
        editor.chain().focus().deleteSelection().run();
      }).catch(() => {
        // Fallback for older browsers
        editor.chain().focus().deleteSelection().run();
      });
    }
  };

  const handleCopy = () => {
    // Only works in formatted view since button is disabled in HTML view
    const { from, to } = editor.state.selection;
    if (from !== to) {
      const text = editor.state.doc.textBetween(from, to);
      navigator.clipboard.writeText(text);
    }
  };

  const handlePaste = async () => {
    // Only works in formatted view since button is disabled in HTML view
    try {
      const text = await navigator.clipboard.readText();
      editor.chain().focus().insertContent(text).run();
    } catch (error) {
      // Fallback to execCommand for older browsers
      editor.chain().focus().insertContent('').run();
    }
  };

  return (
    <div style={{ marginBottom: '16px', display: visible === false ? 'none' : undefined }}>
      <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 4 }}>
        {label}{required ? ' *' : ''}
      </label>

      {/* Text Formatting Toolbar */}
      <Stack
        direction="row"
        spacing={0.5}
        style={{
          marginBottom: 8,
          padding: '8px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          backgroundColor: '#fafafa'
        }}
        divider={<Divider orientation="vertical" flexItem />}
      >
        {/* View Toggle */}
        <ToggleButton
          size="small"
          value="html"
          onClick={handleViewToggle}
          selected={isHtmlView}
        >
          <Tooltip title={isHtmlView ? "Switch to Formatted View" : "Switch to HTML View"}>
            <HtmlIcon fontSize="small" />
          </Tooltip>
        </ToggleButton>

        {/* Cut, Copy, Paste buttons - Only enabled in formatted view */}
        <ToggleButton
          size="small"
          value="cut"
          onClick={handleCut}
          disabled={isHtmlView || editor.state.selection.empty}
        >
          <Tooltip title="Cut">
            <ContentCut fontSize="small" />
          </Tooltip>
        </ToggleButton>

        <ToggleButton
          size="small"
          value="copy"
          onClick={handleCopy}
          disabled={isHtmlView || editor.state.selection.empty}
        >
          <Tooltip title="Copy">
            <ContentCopy fontSize="small" />
          </Tooltip>
        </ToggleButton>

        <ToggleButton
          size="small"
          value="paste"
          onClick={handlePaste}
          disabled={isHtmlView}
        >
          <Tooltip title="Paste">
            <ContentPaste fontSize="small" />
          </Tooltip>
        </ToggleButton>

        {/* Formatting Tools - Disabled when in HTML view */}
        <div style={{ opacity: isHtmlView ? 0.5 : 1, pointerEvents: isHtmlView ? 'none' : 'auto' }}>
          {/* Text Style */}
          <ToggleButtonGroup
            size="small"
            value={editor.isActive('heading') ? (editor.getAttributes('heading') as any).level : 'paragraph'}
            exclusive
            onChange={(event, value) => {
              if (value === 'paragraph') {
                editor.chain().focus().setParagraph().run();
              } else if (value && headingLevels.includes(value)) {
                editor.chain().focus().toggleHeading({ level: value }).run();
              }
            }}
          >
            <ToggleButton value="paragraph" size="small">
              <Tooltip title="Paragraph">
                <TextFields fontSize="small" />
              </Tooltip>
            </ToggleButton>
            {headingLevels.map(level => (
              <ToggleButton key={level} value={level} size="small">
                <Tooltip title={`Heading ${level}`}>
                  <TitleIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>


          {/* Text Formatting */}
          <ToggleButtonGroup size="small" value={editor.isActive('bold') ? 'bold' : ''}>
            <ToggleButton
              value="bold"
              size="small"
              onClick={() => editor.chain().focus().toggleBold().run()}
              selected={editor.isActive('bold')}
            >
              <Tooltip title="Bold">
                <FormatBold fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup size="small" value={editor.isActive('italic') ? 'italic' : ''}>
            <ToggleButton
              value="italic"
              size="small"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              selected={editor.isActive('italic')}
            >
              <Tooltip title="Italic">
                <FormatItalic fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup size="small" value={editor.isActive('underline') ? 'underline' : ''}>
            <ToggleButton
              value="underline"
              size="small"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              selected={editor.isActive('underline')}
            >
              <Tooltip title="Underline">
                <FormatUnderlined fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup size="small" value={editor.isActive('strike') ? 'strike' : ''}>
            <ToggleButton
              value="strike"
              size="small"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              selected={editor.isActive('strike')}
            >
              <Tooltip title="Strikethrough">
                <StrikethroughS fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Text Alignment */}
          <ToggleButtonGroup 
            size="small" 
            value={editor.isActive({ textAlign: 'left' }) ? 'left' : 
                   editor.isActive({ textAlign: 'center' }) ? 'center' : 
                   editor.isActive({ textAlign: 'right' }) ? 'right' : 
                   editor.isActive({ textAlign: 'justify' }) ? 'justify' : 'left'}
            exclusive
          >
            <ToggleButton
              value="left"
              size="small"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              selected={editor.isActive({ textAlign: 'left' })}
            >
              <Tooltip title="Align Left">
                <FormatAlignLeft fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton
              value="center"
              size="small"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              selected={editor.isActive({ textAlign: 'center' })}
            >
              <Tooltip title="Align Center">
                <FormatAlignCenter fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton
              value="right"
              size="small"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              selected={editor.isActive({ textAlign: 'right' })}
            >
              <Tooltip title="Align Right">
                <FormatAlignRight fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton
              value="justify"
              size="small"
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              selected={editor.isActive({ textAlign: 'justify' })}
            >
              <Tooltip title="Justify">
                <FormatAlignJustify fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Remove Formatting */}
          <ToggleButton
            value="clearFormatting"
            size="small"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            disabled={editor.state.selection.empty}
            selected={false}
          >
            <Tooltip title="Remove Formatting">
              <FormatClear fontSize="small" />
            </Tooltip>
          </ToggleButton>

          {/* Code Formatting */}
          <ToggleButtonGroup size="small" value={editor.isActive('code') ? 'code' : ''}>
            <ToggleButton
              value="code"
              size="small"
              onClick={() => editor.chain().focus().toggleCode().run()}
              selected={editor.isActive('code')}
            >
              <Tooltip title="Inline Code">
                <CodeIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup size="small" value={editor.isActive('codeBlock') ? 'codeBlock' : ''}>
            <ToggleButton
              value="codeBlock"
              size="small"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              selected={editor.isActive('codeBlock')}
            >
              <Tooltip title="Code Block">
                <CodeBlockIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>


          {/* Lists */}
          <ToggleButtonGroup size="small" value={editor.isActive('bulletList') ? 'bulletList' : ''}>
            <ToggleButton
              value="bulletList"
              size="small"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              selected={editor.isActive('bulletList')}
            >
              <Tooltip title="Bullet List">
                <FormatListBulleted fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup size="small" value={editor.isActive('orderedList') ? 'orderedList' : ''}>
            <ToggleButton
              value="orderedList"
              size="small"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              selected={editor.isActive('orderedList')}
            >
              <Tooltip title="Numbered List">
                <FormatListNumbered fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>


          {/* Block Elements */}
          <ToggleButtonGroup size="small" value={editor.isActive('blockquote') ? 'blockquote' : ''}>
            <ToggleButton
              value="blockquote"
              size="small"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              selected={editor.isActive('blockquote')}
            >
              <Tooltip title="Blockquote">
                <FormatQuote fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </Stack>

      {/* Content Area */}
      {isHtmlView ? (
        <TextField
          multiline
          fullWidth
          variant="outlined"
          value={htmlContent}
          onChange={handleHtmlChange}
          minRows={4}
          style={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            minHeight: 80
          }}
          InputProps={{
            style: {
              fontFamily: 'monospace',
              fontSize: '12px'
            }
          }}
        />
      ) : (
        <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px', minHeight: 80 }}>
          <EditorContent editor={editor} />
        </div>
      )}

      {errors && <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors}</div>}
    </div>
  );
};

export const TiptapEditorControl = withJsonFormsControlProps(TiptapEditor); 