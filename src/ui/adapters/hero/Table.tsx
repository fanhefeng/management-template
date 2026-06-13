import {
  Table as HeroTable,
  TableScrollContainer,
  TableContent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/react';
import type { TableProps } from '@/ui/contract';
import { renderCell, emptyText } from '@/ui/responsive/cell';

/**
 * HeroUI v3 桌面表格适配器。
 *
 * 注意：本适配器只负责「桌面表格」这一种形态。「移动端降级成卡片列表」的响应式
 * 决策已上提到 @/ui 层（见 ui/index.ts），所以这里不再依赖 useDevice，保持适配器
 * 只关心「如何用 HeroUI 渲染表格」这一单一职责。
 *
 * v3 必需结构：Table > ScrollContainer > Content >（Header / Body）。集合根是
 * Content（aria-label 挂这里），缺包裹层会触发 react-aria "cannot be rendered
 * outside a collection" 运行时错误。
 */
export function Table<T extends object>({
  columns,
  data,
  rowKey,
  loading,
  empty,
  onRowClick,
}: TableProps<T>) {
  return (
    <HeroTable>
      <TableScrollContainer>
        <TableContent aria-label="data table">
          <TableHeader>
            {columns.map((col, i) => (
              <TableColumn
                key={col.key}
                id={col.key}
                isRowHeader={i === 0}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.title}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody items={data} renderEmptyState={() => <>{emptyText(loading, empty)}</>}>
            {(row: T) => (
              <TableRow
                id={String(row[rowKey])}
                // react-aria 的行用 onAction（点击/回车）触发，原生 onClick 不可靠
                onAction={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? 'cursor-pointer' : undefined}
              >
                {columns.map((col) => (
                  <TableCell key={col.key}>{renderCell(col, row)}</TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </TableContent>
      </TableScrollContainer>
    </HeroTable>
  );
}
