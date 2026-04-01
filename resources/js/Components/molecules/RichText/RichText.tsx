import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import HardBreak from '@tiptap/extension-hard-break';
import { useEffect } from 'react';

const content = '';
interface RichTextProps {
  value: string; // The value being passed to the editor
  onChange: (value: string) => void; // The function to update the value when content changes
}

function RichText({ value, onChange }: RichTextProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        paragraph: {
          HTMLAttributes: {
            style: 'margin: 0; padding: 0;',
          },
        },
      }),
      HardBreak.configure({
        keepMarks: true,
      }),
      Underline,
      Link.extend({
        inclusive: false,
      }).configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer nofollow',
          class: 'text-blue-600 hover:underline',
        },
      }),
      Superscript,
      SubScript,
      Highlight,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '', // Use the value passed from the parent component
    editorProps: {
      attributes: {
        style: 'white-space: pre-line; min-height: 200px;', // pre-line preserves line breaks
      },
    },
    onUpdate: ({ editor }) => {
      // Get HTML and ensure line breaks are preserved
      let html = editor.getHTML();
      
      // Ensure all links have target="_blank" and rel attributes
      html = html.replace(
        /<a\s+([^>]*?)href=/gi,
        (match, attrs) => {
          // Check if target already exists
          if (!/target\s*=/i.test(attrs)) {
            attrs += ' target="_blank"';
          }
          // Check if rel already exists
          if (!/rel\s*=/i.test(attrs)) {
            attrs += ' rel="noopener noreferrer nofollow"';
          }
          return `<a ${attrs}href=`;
        }
      );
      
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && value !== undefined && value !== null) {
      const currentContent = editor.getHTML();
      // Only update if the content is actually different (avoid infinite loops)
      if (currentContent !== value) {
        editor.commands.setContent(value || '');
      }
    }
  }, [value, editor]);

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.ColorPicker
            colors={[
              '#25262b',
              '#868e96',
              '#fa5252',
              '#e64980',
              '#be4bdb',
              '#7950f2',
              '#4c6ef5',
              '#228be6',
              '#15aabf',
              '#12b886',
              '#40c057',
              '#82c91e',
              '#fab005',
              '#fd7e14',
            ]}
          />
          <RichTextEditor.Color color="#F03E3E" />
          <RichTextEditor.Color color="#7048E8" />
          <RichTextEditor.Color color="#1098AD" />
          <RichTextEditor.Color color="#37B24D" />
          <RichTextEditor.Color color="#F59F00" />
          <RichTextEditor.UnsetColor />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}

export default RichText;
