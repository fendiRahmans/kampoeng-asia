import React from 'react';

/**
 * Prevent non-digit keys on keydown for an input element.
 * Allows navigation and common control keys (backspace, arrows, delete, home/end)
 */
export function onlyAllowNumbers(e: React.KeyboardEvent<HTMLInputElement>) {
  const allowedKeys = [
    'Backspace',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'Delete',
    'Home',
    'End'
  ];
  // allow navigation and editing keys
  if (allowedKeys.includes(e.key)) return;

  // allow common ctrl/meta shortcuts (copy/paste/select all/cut/undo)
  if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())) return;

  // allow digits only
  if (/^[0-9]$/.test(e.key)) return;

  e.preventDefault();
}

/**
 * Handle paste events: if pasted content contains non-digits, sanitize it
 * and insert only digits. Dispatches an input event so frameworks like React
 * and react-hook-form pick up the change.
 */
export function handlePasteAllowNumbers(e: React.ClipboardEvent<HTMLInputElement>) {
  const paste = e.clipboardData.getData('text');
  if (!paste) return;

  const cleaned = paste.replace(/\D+/g, '');
  if (cleaned === paste) return; // nothing to sanitize

  e.preventDefault();
  const input = e.target as HTMLInputElement;
  // compute new value around the current selection
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? start;
  const newValue = input.value.slice(0, start) + cleaned + input.value.slice(end);
  input.value = newValue;
  // notify listeners (React and native) that value changed
  const ev = new Event('input', { bubbles: true });
  input.dispatchEvent(ev);
}

/**
 * Utility to strip all non-digit characters from a string.
 */
export function sanitizeNumericValue(value: string) {
  return value.replace(/\D+/g, '');
}

export default onlyAllowNumbers;
