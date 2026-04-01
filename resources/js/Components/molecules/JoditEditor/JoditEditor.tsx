import React, { useRef } from 'react';
import JoditEditor from 'jodit-react';
// import 'jodit/build/jodit.min.css'; // Import Jodit's styles

// Custom type for defaultActionOnPaste configuration in Jodit Editor
type InsertMode = 'insert_as_html' | 'insert_as_text';

interface EditorProps {
  value?: string; // Initial content of the editor
  onChange?: (content: string) => void; // Callback to handle content changes
  configOverrides?: object; // Custom configuration overrides
}

const Editor: React.FC<EditorProps> = ({ value = '', onChange, configOverrides = {} }) => {
  const editorRef = useRef(null);

  // Default editor configuration
  const defaultConfig = {
    readonly: false, // Enables editing
    placeholder: 'Start typing here...', // Placeholder text
    height: 400, // Editor height
    buttons: [
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'eraser',
      '|', // Group 1
      'paragraph',
      'fontsize',
      'font',
      'superscript',
      'subscript',
      'outdent',
      'indent',
      '|', // Group 2
      'ul',
      'ol',
      '|', // Group 3
      'file',
      'image',
      'video',
      'audio',
      '|', // Group 4
      'cut',
      'copy',
      'paste',
      'table',
      'lineHeight',
      'align',
      '|', // Group 5
      'link',
      'unlink',
      'undo',
      'redo',
      '|', // Group 6
      'brush',
      'hr',
      'fullsize',
      'preview',
      'source',
      'print', // Group 7
    ],
    toolbarSticky: false, // Toolbar position
    language: 'en', // Default language
    defaultActionOnPaste: 'insert_as_html' as InsertMode, // Preserve formatting on paste
    defaultLinkTarget: '_self', // Set default link target to '_self'
    link: {
      // Configure link plugin
      followOnDblClick: false,
      processVideoLink: true,
      processPastedLink: true,
      removeLinkAfterFormat: true,
      noFollowCheckbox: false,
      openInNewTabCheckbox: false, // Disable the "open in new tab" option
    },
    // Replace the previous paste handler with a beforeRender handler to preserve newlines
    events: {
      'paste.beforeRender': (data: { html: string }) => {
        // Replace newlines with <br/>
        data.html = data.html.replace(/\n/g, '<br/>');

        // If pasted content is a plain URL (no HTML tags), wrap it in an anchor tag
        const trimmed = data.html.trim();
        if (!/<[a-z][\s\S]*>/i.test(trimmed) && /^https?:\/\//.test(trimmed)) {
          data.html = `<a href="${trimmed}" target="_self">${trimmed}</a>`;
        }
      },
      'beforeCommand': (command: string) => {
        // Prevent default behavior for link command to avoid focus issues
        if (command === 'link') {
          return false; // Let Jodit handle it normally without interference
        }
      },
      'afterCommand': (command: string, editor: any) => {
        if (command === 'insertLink' || command === 'link') {
          // Use setTimeout to ensure DOM updates are complete
          setTimeout(() => {
            // Replace any target attribute set to '_top' with '_self'
            const currentValue = editor.value;
            const updatedValue = currentValue.replace(/target="_top"/g, 'target="_self"');
            
            if (currentValue !== updatedValue) {
              editor.value = updatedValue;
            }
            
            // Restore focus to the editor without forcing scroll
            try {
              if (editor && editor.editor && typeof editor.editor.focus === 'function') {
                editor.editor.focus();
              }
            } catch (e) {
              console.warn('Could not restore editor focus:', e);
            }
          }, 100);
        }
      },
      'afterOpenDialog': (dialog: any, dialogName: string) => {
        // Handle link dialog specifically
        if (dialogName === 'link') {
          // Find the URL input field and handle paste events
          const urlInput = dialog.container.querySelector('input[name="url"], input[placeholder*="http"]');
          if (urlInput) {
            urlInput.addEventListener('paste', (e: ClipboardEvent) => {
              // Allow normal paste behavior without closing dialog
              e.stopPropagation();
            });
            
            // Prevent Enter key from submitting if URL is being typed
            urlInput.addEventListener('keydown', (e: KeyboardEvent) => {
              if (e.key === 'Enter') {
                e.stopPropagation();
                // Let the dialog handle the enter key normally
              }
            });
          }
        }
      },
    },
    ...configOverrides, // Allow custom overrides
  };

  return (
    <JoditEditor
      ref={editorRef}
      value={value}
      config={defaultConfig}
      onBlur={(newContent) => onChange && onChange(newContent)} // Update content on blur
      onChange={(newContent) => {
        // Also handle onChange for real-time updates if needed
        // This can help with state synchronization
        if (onChange) {
          onChange(newContent);
        }
      }}
    />
  );
};

export default Editor;