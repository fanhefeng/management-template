import { useId } from 'react';
import { Input as HeroInput } from '@heroui/react';
import type { InputProps } from '@/ui/contract';

/**
 * v3 的 Input 是 react-aria-components 的裸输入原语（无 label/error props），
 * 故由适配器手动包裹标签与错误信息，并把契约的 onChange(value) 翻译成 DOM 事件。
 *
 * - 受控/非受控二选一：传了 value 即受控，否则用 defaultValue（避免 React 同时收到
 *   value 与 defaultValue 的告警，也避免「编辑切换行时显示上一行旧值」）。
 * - 用 useId 串起 label[htmlFor] / input[id] / 错误文本[aria-describedby]，补齐可访问性。
 */
export function Input({
  value,
  defaultValue,
  placeholder,
  label,
  error,
  type = 'text',
  disabled,
  onChange,
  onBlur,
}: InputProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const controlled = value !== undefined;

  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <label htmlFor={id} className="text-sm text-fg-muted">
          {label}
        </label>
      ) : null}
      <HeroInput
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...(controlled ? { value } : { defaultValue })}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
      />
      {error ? (
        <span id={errorId} className="text-xs text-negative">
          {error}
        </span>
      ) : null}
    </div>
  );
}
