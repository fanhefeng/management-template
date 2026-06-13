import type { ReactNode } from 'react';

/**
 * Table 契约 —— 列定义刻意做成「库无关」的描述式结构。
 * 适配器拿到同一份 columns + data：
 *   - 桌面：渲染成真表格
 *   - 移动：渲染成卡片列表（见 src/ui/responsive/MobileCardList.tsx，库无关）
 * 业务永远写 <Table columns={...} data={...} />，对设备形态无感。
 */
export interface ColumnDef<T extends object> {
  key: keyof T & string;
  title: ReactNode;
  /** 自定义单元格渲染 */
  render?: (row: T) => ReactNode;
  width?: number | string;
}

export interface TableProps<T extends object> {
  columns: ColumnDef<T>[];
  data: T[];
  rowKey: keyof T & string;
  loading?: boolean;
  /** 空数据展示 */
  empty?: ReactNode;
  onRowClick?: (row: T) => void;
}
