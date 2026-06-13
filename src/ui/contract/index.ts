/**
 * 契约层总出口：导出所有「库无关」的组件类型 + 适配器需要实现的接口形状。
 *
 * 任何一个适配器（hero / antd / mui…）都必须实现 UIAdapter 这个对象，
 * TypeScript 会强制它的每个组件符合对应契约 —— 换库时编译器即验收清单。
 */
import type { ComponentType } from 'react';
import type { ButtonProps } from './button';
import type { InputProps } from './input';
import type { TableProps } from './table';
import type { ModalProps } from './modal';

export type { ButtonProps } from './button';
export type { InputProps } from './input';
export type { TableProps, ColumnDef } from './table';
export type { ModalProps } from './modal';

/** 一个 UI 库适配器必须提供的全部组件 */
export interface UIAdapter {
  Button: ComponentType<ButtonProps>;
  Input: ComponentType<InputProps>;
  // Table 是泛型组件，用 unknown 占位，业务侧通过 @/ui 的泛型包装拿回类型
  Table: <T extends object>(props: TableProps<T>) => React.ReactElement | null;
  Modal: ComponentType<ModalProps>;
}
