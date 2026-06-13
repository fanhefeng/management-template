import type { ReactNode } from 'react';

export interface InputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  label?: ReactNode;
  /** 校验失败信息；非空即视为 invalid 态 */
  error?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  disabled?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}
