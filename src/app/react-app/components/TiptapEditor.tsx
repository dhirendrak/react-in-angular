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
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import { ControlProps } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import {
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
  FormatAlignJustify,
  Fullscreen,
  FullscreenExit,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  TableChart,
  FormatIndentIncrease,
  FormatIndentDecrease,
  Image as ImageIcon
} from '@mui/icons-material';

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes['width']) {
            return {};
          }
          return {
            width: attributes['width'],
          };
        },
        parseHTML: (element: HTMLElement) => element.getAttribute('width'),
      },
    };
  },
});

const TiptapEditor: React.FC<ControlProps> = ({ data, handleChange, path, label, required, description, errors, visible, enabled = true }) => {
  const [isHtmlView, setIsHtmlView] = useState(false);
  const [htmlContent, setHtmlContent] = useState(data || '');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const [imageWidth, setImageWidth] = useState(300);

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
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Superscript,
      Subscript,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CustomImage.configure({
        inline: true,
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
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

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleHtmlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHtml = event.target.value;
    setHtmlContent(newHtml);
    handleChange(path, newHtml);
  };

  const handleTableDialogOpen = () => {
    setTableDialogOpen(true);
  };

  const handleTableDialogClose = () => {
    setTableDialogOpen(false);
  };

  const handleInsertTable = () => {
    editor.chain().focus().insertTable({ rows: tableRows, cols: tableCols, withHeaderRow: true }).run();
    setTableDialogOpen(false);
  };

  const handleImageDialogOpen = () => {
    setImageDialogOpen(true);
  };

  const handleImageDialogClose = () => {
    setImageDialogOpen(false);
    setImagePath('');
    setImageWidth(300);
  };

  const handleImagePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPath = e.target.value;
    setImagePath(newPath);
  };

  const handleInsertImage = () => {
    if (imagePath.trim()) {
      editor.commands.insertContent({
        type: 'image',
        attrs: {
          src: imagePath.trim(),
          width: imageWidth
        }
      });
      setImageDialogOpen(false);
      setImagePath('');
      setImageWidth(300);
    }
  };

  // Cut, Copy, Paste handlers - Only for formatted view
  const handleCut = () => {
    // Only works in formatted view since button is disabled in HTML view
    const { from, to } = editor.state.selection;
    if (from !== to) {
      const text = editor.state.doc.textBetween(from, to);
      navigator.clipboard.writeText(text).then(() => {
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
    const text = await navigator.clipboard.readText();
    editor.chain().focus().insertContent(text).run();
  };

  return (
    <div style={{
      marginBottom: '16px',
      display: visible === false ? 'none' : undefined,
      position: isFullscreen ? 'fixed' : 'relative',
      top: isFullscreen ? 0 : 'auto',
      left: isFullscreen ? 0 : 'auto',
      right: isFullscreen ? 0 : 'auto',
      bottom: isFullscreen ? 0 : 'auto',
      zIndex: isFullscreen ? 9999 : 'auto',
      backgroundColor: isFullscreen ? 'white' : 'transparent',
      padding: isFullscreen ? '20px' : '0',
      boxShadow: isFullscreen ? '0 0 20px rgba(0,0,0,0.3)' : 'none'
    }}>
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
          backgroundColor: '#fafafa',
          opacity: enabled ? 1 : 0.5,
          pointerEvents: enabled ? 'auto' : 'none'
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

        {/* Fullscreen Toggle */}
        <ToggleButton
          size="small"
          value="fullscreen"
          onClick={handleFullscreenToggle}
          selected={isFullscreen}
        >
          <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
            {isFullscreen ? <FullscreenExit fontSize="small" /> : <Fullscreen fontSize="small" />}
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
            <ToggleButton value={1} size="small">
              <Tooltip title="Heading 1">
                <TitleIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={2} size="small">
              <Tooltip title="Heading 2">
                <TitleIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={3} size="small">
              <Tooltip title="Heading 3">
                <TitleIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={4} size="small">
              <Tooltip title="Heading 4">
                <TitleIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={5} size="small">
              <Tooltip title="Heading 5">
                <TitleIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={6} size="small">
              <Tooltip title="Heading 6">
                <TitleIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
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

          {/* Superscript and Subscript */}
          <ToggleButtonGroup size="small" value={editor.isActive('superscript') ? 'superscript' : ''}>
            <ToggleButton
              value="superscript"
              size="small"
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              selected={editor.isActive('superscript')}
            >
              <Tooltip title="Superscript">
                <SuperscriptIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup size="small" value={editor.isActive('subscript') ? 'subscript' : ''}>
            <ToggleButton
              value="subscript"
              size="small"
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              selected={editor.isActive('subscript')}
            >
              <Tooltip title="Subscript">
                <SubscriptIcon fontSize="small" />
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

          {/* List Indentation Controls */}
          <ToggleButtonGroup size="small">
            <ToggleButton
              value="indent"
              size="small"
              onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
              disabled={!editor.can().sinkListItem('listItem')}
            >
              <Tooltip title="Increase Indent">
                <FormatIndentIncrease fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton
              value="outdent"
              size="small"
              onClick={() => editor.chain().focus().liftListItem('listItem').run()}
              disabled={!editor.can().liftListItem('listItem')}
            >
              <Tooltip title="Decrease Indent">
                <FormatIndentDecrease fontSize="small" />
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

          {/* Table */}
          <ToggleButton
            size="small"
            value="table"
            onClick={handleTableDialogOpen}
            selected={false}
          >
            <Tooltip title="Insert Table">
              <TableChart fontSize="small" />
            </Tooltip>
          </ToggleButton>

          {/* Image */}
          <ToggleButton
            size="small"
            value="image"
            onClick={handleImageDialogOpen}
            selected={false}
          >
            <Tooltip title="Insert Image">
              <ImageIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
        </div>
      </Stack>

      {/* Table Dialog */}
      <Dialog open={tableDialogOpen} onClose={handleTableDialogClose}>
        <DialogTitle>Insert Table</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ minWidth: 300, pt: 1 }}>
            <TextField
              fullWidth
              type="number"
              label="Number of Rows"
              value={tableRows}
              onChange={(e) => setTableRows(Math.max(1, Number(e.target.value)))}
              slotProps={{ input: { min: 1 } }}
            />
            <TextField
              fullWidth
              type="number"
              label="Number of Columns"
              value={tableCols}
              onChange={(e) => setTableCols(Math.max(1, Number(e.target.value)))}
              slotProps={{ input: { min: 1 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTableDialogClose}>Cancel</Button>
          <Button onClick={handleInsertTable} variant="contained">Insert Table</Button>
        </DialogActions>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onClose={handleImageDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Insert Image</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ minWidth: 300, pt: 1 }}>
            <TextField
              fullWidth
              label="Image URL"
              placeholder="https://example.com/image.jpg"
              value={imagePath}
              onChange={handleImagePathChange}
              helperText="Enter the full URL of the image"
            />
            <TextField
              fullWidth
              label="Image Width (pixels)"
              type="number"
              value={imageWidth}
              onChange={(e) => setImageWidth(Math.max(100, Number(e.target.value)))}
              slotProps={{ input: { min: 100 } }}
              helperText="Minimum width: 100px"
            />
            
            {/* Image Preview */}
            {imagePath.trim() && (
              <div style={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: '4px', 
                padding: '16px',
                backgroundColor: '#fafafa',
                textAlign: 'center'
              }}>
                <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#666' }}>
                  Image Preview:
                </div>
                <img
                  src={imagePath.trim()}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    width: `${imageWidth}px`,
                    height: 'auto',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImageDialogClose}>Cancel</Button>
          <Button 
            onClick={handleInsertImage} 
            variant="contained"
            disabled={!imagePath.trim()}
          >
            Insert Image
          </Button>
        </DialogActions>
      </Dialog>

      {/* Content Area */}
      {isHtmlView ? (
        <TextField
          multiline
          fullWidth
          variant="outlined"
          value={htmlContent}
          onChange={handleHtmlChange}
          minRows={isFullscreen ? 20 : 4}
          disabled={!enabled}
          style={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            minHeight: isFullscreen ? 'calc(100vh - 200px)' : 80
          }}
          InputProps={{
            style: {
              fontFamily: 'monospace',
              fontSize: '12px'
            }
          }}
        />
      ) : (
        <div style={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '8px',
          minHeight: isFullscreen ? 'calc(100vh - 200px)' : 80,
          opacity: enabled ? 1 : 0.7,
          pointerEvents: enabled ? 'auto' : 'none'
        }}>
          <EditorContent editor={editor} />
        </div>
      )}

      {errors && <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors}</div>}
    </div>
  );
};

export const TiptapEditorControl = withJsonFormsControlProps(TiptapEditor); 