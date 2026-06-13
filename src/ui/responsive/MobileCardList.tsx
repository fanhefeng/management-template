import type { TableProps } from '@/ui/contract';
import { renderCell, emptyText } from './cell';

/**
 * 移动端「表格的替身」—— 库无关组件（只用语义类 + 契约 props，不依赖任何 UI 库）。
 *
 * 它和「桌面用表格 / 移动用卡片」的决策都放在 @/ui 层（见 ui/index.ts 的 Table 包装），
 * 而不是某个具体库的适配器里 —— 这样换库时这套响应式降级能力天然复用，
 * 新适配器只需实现「桌面表格」即可。
 */
export function MobileCardList<T extends object>({
  columns,
  data,
  rowKey,
  loading,
  empty,
  onRowClick,
}: TableProps<T>) {
  if (loading || data.length === 0) {
    return <div className="py-8 text-center text-fg-subtle">{emptyText(loading, empty)}</div>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {data.map((row) => (
        <li
          key={String(row[rowKey])}
          onClick={() => onRowClick?.(row)}
          className={`rounded-lg border border-line bg-surface p-4${
            onRowClick ? ' active:bg-canvas' : ''
          }`}
        >
          {columns.map((col) => (
            <div key={col.key} className="flex justify-between gap-4 py-1 text-sm">
              <span className="shrink-0 text-fg-muted">{col.title}</span>
              <span className="min-w-0 break-all text-right text-fg">{renderCell(col, row)}</span>
            </div>
          ))}
        </li>
      ))}
    </ul>
  );
}
