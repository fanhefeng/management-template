import type { ReactNode } from 'react';

/**
 * Button 契约 —— 你自己定义的「通用语义」，刻意不照抄任何具体库的命名。
 *
 * 注意我们用 onClick / loading / disabled 这些「最普适的心智模型」。
 * HeroUI v3 实际用的是 onPress / isPending / isDisabled，且把 color+variant
 * 合并成单一 variant —— 这些差异全部由 adapters/hero/Button.tsx 翻译，
 * 业务代码永远只认下面这套接口。换库时业务零改动。
 */
export interface ButtonProps {
  /** 语义化变体，由适配器映射到具体库 */
  variant?: 'primary' | 'default' | 'danger' | 'text';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  icon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  /** 关联的 <form> id：使位于表单之外的提交按钮（如弹窗 footer）能提交该表单 */
  form?: string;
  onClick?: () => void;
  children?: ReactNode;
}
