"use client";

import React from 'react';

interface CalculatorKeypadProps {
  onAppendDigit: (digit: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  disabled?: boolean;
}

export default function CalculatorKeypad({ onAppendDigit, onBackspace, onClear, disabled }: CalculatorKeypadProps) {
  const buttonBaseClass = `
    flex items-center justify-center
    h-14 rounded-lg
    text-lg font-semibold
    transition-all duration-150
    disabled:opacity-40 disabled:cursor-not-allowed
    active:scale-95
  `;

  const digitButtonClass = `
    ${buttonBaseClass}
    bg-[var(--surface)] border border-[var(--border)]
    text-[var(--text-primary)]
    hover:bg-[var(--surface-hover)] hover:border-[var(--primary)]
    active:bg-[var(--primary-soft)]
  `;

  const actionButtonClass = `
    ${buttonBaseClass}
    bg-[var(--surface-soft)] border border-[var(--border-subtle)]
    text-[var(--text-secondary)]
    hover:bg-[var(--surface-hover)]
  `;

  return (
    <div className="space-y-2">
      {/* Keypad Grid (3x4) */}
      <div className="grid grid-cols-3 gap-2">
        {/* Row 1: 7, 8, 9 */}
        <button
          type="button"
          className={digitButtonClass}
          onClick={() => onAppendDigit('7')}
          disabled={disabled}
        >
          7
        </button>
        <button
          type="button"
          className={digitButtonClass}
          onClick={() => onAppendDigit('8')}
          disabled={disabled}
        >
          8
        </button>
        <button
          type="button"
          className={digitButtonClass}
          onClick={() => onAppendDigit('9')}
          disabled={disabled}
        >
          9
        </button>

        {/* Row 2: 4, 5, 6 */}
        <button
          type="button"
          className={digitButtonClass}
          onClick={() => onAppendDigit('4')}
          disabled={disabled}
        >
          4
        </button>
        <button
          type="button"
          className={digitButtonClass}
          onClick={() => onAppendDigit('5')}
          disabled={disabled}
        >
          5
        </button>
        <button
          type="button"
          className={digitButtonClass}
          onClick={() => onAppendDigit('6')}
          disabled={disabled}
        >
          6
        </button>

        {/* Row 3: 1, 2, 3 */}
        <button
          type="button"
          className={digitButtonClass}
          onClick={() => onAppendDigit('1')}
          disabled={disabled}
        >
          1
        </button>
        <button
          type="button"
          className={digitButtonClass}
          onClick={() => onAppendDigit('2')}
          disabled={disabled}
        >
          2
        </button>
        <button
          type="button"
          className={digitButtonClass}
          onClick={() => onAppendDigit('3')}
          disabled={disabled}
        >
          3
        </button>

        {/* Row 4: 0, 00, ← */}
        <button
          type="button"
          className={digitButtonClass}
          onClick={() => onAppendDigit('0')}
          disabled={disabled}
        >
          0
        </button>
        <button
          type="button"
          className={digitButtonClass}
          onClick={() => onAppendDigit('00')}
          disabled={disabled}
        >
          00
        </button>
        <button
          type="button"
          className={actionButtonClass}
          onClick={onBackspace}
          disabled={disabled}
          title="Backspace"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
            <line x1="18" y1="9" x2="12" y2="15" />
            <line x1="12" y1="9" x2="18" y2="15" />
          </svg>
        </button>
      </div>

      {/* Quick Add Chips */}
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          className={`${actionButtonClass} text-sm !h-10`}
          onClick={() => onAppendDigit('1000')}
          disabled={disabled}
        >
          +1K
        </button>
        <button
          type="button"
          className={`${actionButtonClass} text-sm !h-10`}
          onClick={() => onAppendDigit('5000')}
          disabled={disabled}
        >
          +5K
        </button>
        <button
          type="button"
          className={`${actionButtonClass} text-sm !h-10`}
          onClick={() => onAppendDigit('10000')}
          disabled={disabled}
        >
          +10K
        </button>
        <button
          type="button"
          className={`${actionButtonClass} text-sm !h-10 !text-[var(--danger)] hover:!bg-[var(--danger-soft)]`}
          onClick={onClear}
          disabled={disabled}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
