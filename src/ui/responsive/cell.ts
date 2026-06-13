import type { ReactNode } from 'react';
import type { ColumnDef } from '@/ui/contract';

/**
 * 单元格默认渲染：对 null/undefined/对象做兜底，避免出现字面量
 * "null" / "undefined" / "[object Object]"（接真实 API 后空字段很常见）。
 */
export function renderCell<T extends object>(col: ColumnDef<T>, row: T): ReactNode {
  if (col.render) return col.render(row);
  const value = row[col.key];
  if (value == null) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

/** 表格/列表统一的空态与加载文案（单一来源，两端共用） */
export function emptyText(loading?: boolean, empty?: ReactNode): ReactNode {
  if (loading) return '加载中…';
  return empty ?? '暂无数据';
}
