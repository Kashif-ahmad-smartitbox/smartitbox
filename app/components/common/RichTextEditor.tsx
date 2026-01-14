// components/RichTextEditor.tsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Image,
  Video,
  Table,
  List,
  ListOrdered,
  Link as LinkIcon,
} from "lucide-react";

// Constants
const DEBOUNCE_DELAY = 300;
const CURSOR_RESTORE_DELAY = 10;

// Types
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your amazing content here...",
  minHeight = "420px",
}) => {
  // Refs
  const editorRef = useRef<HTMLDivElement>(null);
  const isComposingRef = useRef(false);
  const lastHtmlRef = useRef(value);
  const buttonClickTimeRef = useRef<number>(0);
  const isInitializedRef = useRef(false);

  // State
  const [isFocused, setIsFocused] = useState(false);

  // Save selection position
  const saveSelection = useCallback((): number | null => {
    const selection = window.getSelection();
    if (!selection?.rangeCount || !editorRef.current) return null;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editorRef.current);
    preCaretRange.setEnd(range.endContainer, range.endOffset);

    return preCaretRange.toString().length;
  }, []);

  // Restore selection position
  const restoreSelection = useCallback((position: number | null) => {
    if (!position || !editorRef.current) return;

    const selection = window.getSelection();
    if (!selection) return;

    const textNodes: Node[] = [];
    const walker = document.createTreeWalker(
      editorRef.current,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node: Node | null;
    let currentLength = 0;

    // Find the text node at the saved position
    while ((node = walker.nextNode())) {
      textNodes.push(node);
      const nodeLength = node.textContent?.length || 0;

      if (currentLength + nodeLength >= position) {
        const offset = position - currentLength;
        const range = document.createRange();
        range.setStart(node, Math.min(offset, nodeLength));
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);
        return;
      }
      currentLength += nodeLength;
    }

    // Fallback: place cursor at the end
    const range = document.createRange();
    range.selectNodeContents(editorRef.current);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  // Handle editor content changes
  const handleInput = useCallback(() => {
    if (!editorRef.current || isComposingRef.current) return;

    const newHtml = editorRef.current.innerHTML;
    if (newHtml !== lastHtmlRef.current) {
      lastHtmlRef.current = newHtml;
      onChange(newHtml);
    }
  }, [onChange]);

  // Sync external value changes to editor - FIXED VERSION
  useEffect(() => {
    if (!editorRef.current) return;

    // Don't update during IME composition
    if (isComposingRef.current) return;

    // Only update if the value is different from current content
    if (value !== lastHtmlRef.current) {
      const cursorPosition = saveSelection();
      lastHtmlRef.current = value;

      // Always set the innerHTML, even for empty values
      editorRef.current.innerHTML = value;

      if (cursorPosition !== null) {
        setTimeout(
          () => restoreSelection(cursorPosition),
          CURSOR_RESTORE_DELAY
        );
      }
    }
  }, [value, saveSelection, restoreSelection]);

  // Initialize editor with value on first render
  useEffect(() => {
    if (editorRef.current && !isInitializedRef.current) {
      isInitializedRef.current = true;
      editorRef.current.innerHTML = value;
      lastHtmlRef.current = value;
    }
  }, [value]);

  // Debounced command execution
  const execCommand = useCallback(
    (command: string, value?: string) => {
      if (!editorRef.current) return;

      // Prevent rapid successive clicks
      const now = Date.now();
      if (now - buttonClickTimeRef.current < DEBOUNCE_DELAY) return;
      buttonClickTimeRef.current = now;

      editorRef.current.focus();
      const cursorPosition = saveSelection();

      document.execCommand(command, false, value);
      handleInput();

      setTimeout(() => {
        if (cursorPosition !== null) {
          restoreSelection(cursorPosition);
        }
        editorRef.current?.focus();
      }, CURSOR_RESTORE_DELAY);
    },
    [handleInput, saveSelection, restoreSelection]
  );

  // Insert HTML with proper cursor handling
  const insertHTML = useCallback(
    (html: string) => {
      if (!editorRef.current) return;

      // Prevent rapid successive clicks
      const now = Date.now();
      if (now - buttonClickTimeRef.current < DEBOUNCE_DELAY) return;
      buttonClickTimeRef.current = now;

      editorRef.current.focus();
      const cursorPosition = saveSelection();

      document.execCommand("insertHTML", false, html);
      handleInput();

      setTimeout(() => {
        if (cursorPosition !== null) {
          restoreSelection(cursorPosition);
        }
        editorRef.current?.focus();
      }, CURSOR_RESTORE_DELAY);
    },
    [handleInput, saveSelection, restoreSelection]
  );

  // Media insertion functions
  const addImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (url) {
      insertHTML(`<img src="${url}" alt="" class="rich-text-image" />`);
    }
  }, [insertHTML]);

  const addVideo = useCallback(() => {
    const url = prompt("Enter video URL:");
    if (url) {
      insertHTML(
        `<video src="${url}" controls class="rich-text-video"></video>`
      );
    }
  }, [insertHTML]);

  const addLink = useCallback(() => {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      const selection = window.getSelection();

      if (selection?.toString()) {
        // Wrap selected text in link
        execCommand("createLink", url);
      } else {
        // Insert link with URL as text
        insertHTML(
          `<a href="${url}" target="_blank" rel="noopener noreferrer" class="rich-text-link">${url}</a>`
        );
      }
    }
  }, [execCommand, insertHTML]);

  const addTable = useCallback(() => {
    const rows = parseInt(prompt("Number of rows:", "3") || "3");
    const cols = parseInt(prompt("Number of columns:", "3") || "3");

    if (rows > 0 && cols > 0) {
      const tableHTML = `
        <table class="rich-text-table">
          <thead>
            <tr>${"<th>Header</th>".repeat(cols)}</tr>
          </thead>
          <tbody>
            ${"<tr>" + "<td>Content</td>".repeat(cols) + "</tr>".repeat(rows)}
          </tbody>
        </table>
      `;
      insertHTML(tableHTML);
    }
  }, [insertHTML]);

  const addBulletList = useCallback(() => {
    execCommand("insertUnorderedList");
  }, [execCommand]);

  const addNumberedList = useCallback(() => {
    execCommand("insertOrderedList");
  }, [execCommand]);

  // Event handlers
  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback(() => {
    isComposingRef.current = false;
    handleInput();
  }, [handleInput]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
      handleInput();
    },
    [handleInput]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Keyboard shortcuts
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        switch (e.key) {
          case "b":
            e.preventDefault();
            execCommand("bold");
            break;
          case "i":
            e.preventDefault();
            execCommand("italic");
            break;
          case "u":
            e.preventDefault();
            execCommand("underline");
            break;
          case "k":
            e.preventDefault();
            addLink();
            break;
          default:
            break;
        }
      }
    },
    [execCommand, addLink]
  );

  // Toolbar Button Component
  const ToolbarButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    isActive?: boolean;
  }> = ({ onClick, icon, title, isActive = false }) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition-colors border border-transparent ${
        isActive
          ? "bg-primary-100 text-primary-600 border-primary-200"
          : "text-gray-600 hover:border-gray-300 hover:text-gray-900"
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div
      className={`border rounded-lg overflow-hidden transition-all bg-white ${
        isFocused
          ? "ring-2 ring-primary-500 border-primary-500"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-3 flex flex-wrap items-center gap-2">
        {/* Text Formatting */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => execCommand("bold")}
            icon={<Bold className="w-4 h-4" />}
            title="Bold (Ctrl+B)"
          />
          <ToolbarButton
            onClick={() => execCommand("italic")}
            icon={<Italic className="w-4 h-4" />}
            title="Italic (Ctrl+I)"
          />
          <ToolbarButton
            onClick={() => execCommand("underline")}
            icon={<Underline className="w-4 h-4" />}
            title="Underline (Ctrl+U)"
          />
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Headings */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => execCommand("formatBlock", "<h1>")}
            icon={<Heading1 className="w-4 h-4" />}
            title="Heading 1"
          />
          <ToolbarButton
            onClick={() => execCommand("formatBlock", "<h2>")}
            icon={<Heading2 className="w-4 h-4" />}
            title="Heading 2"
          />
          <ToolbarButton
            onClick={() => execCommand("formatBlock", "<p>")}
            icon={<span className="w-4 h-4 text-sm font-bold">P</span>}
            title="Paragraph"
          />
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Lists */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={addBulletList}
            icon={<List className="w-4 h-4" />}
            title="Bullet List"
          />
          <ToolbarButton
            onClick={addNumberedList}
            icon={<ListOrdered className="w-4 h-4" />}
            title="Numbered List"
          />
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Media & Links */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={addLink}
            icon={<LinkIcon className="w-4 h-4" />}
            title="Insert Link (Ctrl+K)"
          />
          <ToolbarButton
            onClick={addImage}
            icon={<Image className="w-4 h-4" />}
            title="Insert Image"
          />
          <ToolbarButton
            onClick={addVideo}
            icon={<Video className="w-4 h-4" />}
            title="Insert Video"
          />
          <ToolbarButton
            onClick={addTable}
            icon={<Table className="w-4 h-4" />}
            title="Insert Table"
          />
        </div>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        className="w-full p-6 outline-none text-base leading-relaxed font-normal rich-text-editor"
        style={{ minHeight }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
