/**
 * 🎨 BubbleMenu - The Floating Formatting Toolbar
 *
 * This is the menu that appears when you select text in the editor.
 * It's like the formatting toolbar in Google Docs or Notion - it floats above your selection.
 *
 * 🎯 What this component does:
 * - Appears automatically when text is selected
 * - Provides quick access to formatting options (bold, italic, colors, etc.)
 * - Handles link creation and editing
 * - Shows color picker for text and highlight colors
 * - Maintains selection after applying formatting
 *
 * 💡 Features included:
 * - Text formatting: Bold, Italic, Underline, Strikethrough, Code
 * - Colors: Text color and highlight color
 * - Links: Create new links or edit existing ones
 * - Unstyle: Remove all formatting from selected text
 *
 * 🔧 How it works:
 * - TipTap automatically shows/hides this menu based on text selection
 * - Each button applies formatting to the selected text
 * - Color picker opens as a panel within the menu
 * - Link dialogs open as separate modals
 */

import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus";
import {
  Bold, // Bold formatting icon
  Code, // Inline code formatting icon
  Highlighter, // Text highlighting icon
  Italic, // Italic formatting icon
  Link, // Link creation/editing icon
  PaintBucket, // Text color icon
  Strikethrough, // Strikethrough formatting icon
  Underline, // Underline formatting icon
  RotateCcw, // Remove formatting icon
} from "lucide-react";
import { useState } from "react";
import ColorPickerPanel from "./ColorPickerPanel"; // Color selection component
import LinkEditDialog from "./LinkEditDialog"; // Edit existing links
import LinkCreateDialog from "./LinkCreateDialog"; // Create new links
import { useLinkEditor } from "../hooks/useLinkEditor"; // Link management hook

export default function BubbleMenu({ editor }) {
  // 🎨 State for showing/hiding the color picker panel
  const [showColorPanel, setShowColorPanel] = useState(false);

  // 🔗 Hook for managing link creation and editing
  const linkEditor = useLinkEditor(editor);

  // 🚫 Don't render if no editor is available
  if (!editor) return null;

  return (
    <TiptapBubbleMenu
      editor={editor}
      options={{
        placement: "top", // Show above the selection
        offset: 10, // Distance from the selection
        onHide: () => setShowColorPanel(false), // Clean up color panel when menu hides
      }}
      className="z-50 flex w-[420px] items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
      {/* Bold */}
      <button
        type="button"
        onClick={() => {
          const { from, to } = editor.state.selection;
          editor.chain().toggleBold().run();
          // Restore selection after formatting
          setTimeout(() => editor.commands.setTextSelection({ from, to }), 0);
        }}
        className={`rounded-lg p-2 text-gray-600 transition hover:bg-blue-100 hover:text-black focus:ring-2 focus:ring-blue-200 focus:outline-none active:bg-blue-50 dark:text-gray-300 dark:hover:bg-zinc-800 ${editor.isActive("bold") ? "bg-blue-100 text-blue-600" : ""}`}>
        <Bold className="h-5 w-5" />
      </button>

      {/* Italic */}
      <button
        type="button"
        onClick={() => {
          const { from, to } = editor.state.selection;
          editor.chain().toggleItalic().run();
          // Restore selection after formatting
          setTimeout(() => editor.commands.setTextSelection({ from, to }), 0);
        }}
        className={`rounded-lg p-2 text-gray-600 transition hover:bg-blue-100 hover:text-black focus:ring-2 focus:ring-blue-200 focus:outline-none active:bg-blue-50 dark:text-gray-300 dark:hover:bg-zinc-800 ${editor.isActive("italic") ? "bg-blue-100 text-blue-600" : ""}`}>
        <Italic className="h-5 w-5" />
      </button>

      {/* Underline */}
      <button
        type="button"
        onClick={() => {
          const { from, to } = editor.state.selection;
          editor.chain().toggleUnderline().run();
          // Restore selection after formatting
          setTimeout(() => editor.commands.setTextSelection({ from, to }), 0);
        }}
        className={`rounded-lg p-2 text-gray-600 transition hover:bg-blue-100 hover:text-black focus:ring-2 focus:ring-blue-200 focus:outline-none active:bg-blue-50 dark:text-gray-300 dark:hover:bg-zinc-800 ${editor.isActive("underline") ? "bg-blue-100 text-blue-600" : ""}`}>
        <Underline className="h-5 w-5" />
      </button>

      {/* Strikethrough */}
      <button
        type="button"
        onClick={() => {
          const { from, to } = editor.state.selection;
          editor.chain().toggleStrike().run();
          // Restore selection after formatting
          setTimeout(() => editor.commands.setTextSelection({ from, to }), 0);
        }}
        className={`rounded-lg p-2 text-gray-600 transition hover:bg-blue-100 hover:text-black focus:ring-2 focus:ring-blue-200 focus:outline-none active:bg-blue-50 dark:text-gray-300 dark:hover:bg-zinc-800 ${editor.isActive("strike") ? "bg-blue-100 text-blue-600" : ""}`}>
        <Strikethrough className="h-5 w-5" />
      </button>

      {/* Inline Code */}
      <button
        type="button"
        onClick={() => {
          const { from, to } = editor.state.selection;
          editor.chain().toggleCode().run();
          // Restore selection after formatting
          setTimeout(() => editor.commands.setTextSelection({ from, to }), 0);
        }}
        className={`rounded-lg p-2 text-gray-600 transition hover:bg-blue-100 hover:text-black focus:ring-2 focus:ring-blue-200 focus:outline-none active:bg-blue-50 dark:text-gray-300 dark:hover:bg-zinc-800 ${editor.isActive("code") ? "bg-blue-100 text-blue-600" : ""}`}>
        <Code className="h-5 w-5" />
      </button>

      {/* Highlight */}
      <button
        type="button"
        onClick={() => {
          const { from, to } = editor.state.selection;
          editor.chain().toggleHighlight().run();
          // Restore selection after formatting
          setTimeout(() => editor.commands.setTextSelection({ from, to }), 0);
        }}
        className={`rounded-lg p-2 text-gray-600 transition hover:bg-blue-100 hover:text-black focus:ring-2 focus:ring-blue-200 focus:outline-none active:bg-blue-50 dark:text-gray-300 dark:hover:bg-zinc-800 ${editor.isActive("highlight") ? "bg-yellow-100 text-yellow-600" : ""}`}>
        <Highlighter className="h-5 w-5" />
      </button>

      {/* Link */}
      <button
        type="button"
        onClick={() => {
          if (editor.isActive("link")) {
            // If text is already a link, open edit dialog
            linkEditor.openLinkEditDialog();
          } else {
            // If no link, open create dialog
            linkEditor.openLinkCreateDialog();
          }
        }}
        className={`rounded-lg p-2 text-gray-600 transition hover:bg-blue-100 hover:text-black focus:ring-2 focus:ring-blue-200 focus:outline-none active:bg-blue-50 dark:text-gray-300 dark:hover:bg-zinc-800 ${editor.isActive("link") ? "bg-blue-100 text-blue-600" : ""}`}>
        <Link className="h-5 w-5" />
      </button>

      {/* 🎨 Color Picker */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowColorPanel((prev) => !prev);
        }}
        className={`relative rounded-lg p-2 text-gray-600 transition hover:bg-blue-100 hover:text-black focus:ring-2 focus:ring-blue-200 focus:outline-none active:bg-blue-50 dark:text-gray-300 dark:hover:bg-zinc-800 ${showColorPanel ? "bg-pink-100 text-pink-600" : ""}`}>
        <PaintBucket className="h-5 w-5" />
        {/* Color indicator dot */}
        {(() => {
          const currentColor = editor.getAttributes("textStyle")?.color;
          if (currentColor) {
            return (
              <div
                className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: currentColor }}
                title={`Current color: ${currentColor}`}
              />
            );
          }
          return null;
        })()}
      </button>

      {/* Unstyle - Remove all formatting */}
      <button
        type="button"
        onClick={() => {
          const { from, to } = editor.state.selection;
          editor
            .chain()
            .unsetBold()
            .unsetItalic()
            .unsetUnderline()
            .unsetStrike()
            .unsetHighlight()
            .unsetCode()
            .unsetLink()
            .unsetColor()
            .run();
          // Restore selection after unstyling
          setTimeout(() => editor.commands.setTextSelection({ from, to }), 0);
        }}
        className={`rounded-lg p-2 text-gray-600 transition hover:bg-red-100 hover:text-black focus:ring-2 focus:ring-red-200 focus:outline-none active:bg-red-50 dark:text-gray-300 dark:hover:bg-zinc-800`}
        title="Remove all formatting">
        <RotateCcw className="h-5 w-5" />
      </button>

      {/* Color Picker Panel */}
      {showColorPanel && (
        <div className="absolute top-12 left-0 z-50">
          <ColorPickerPanel
            editor={editor}
            onClose={() => setShowColorPanel(false)}
          />
        </div>
      )}

      {/* Link Dialogs */}
      <LinkEditDialog {...linkEditor.editDialogProps} />
      <LinkCreateDialog {...linkEditor.createDialogProps} />
    </TiptapBubbleMenu>
  );
}
