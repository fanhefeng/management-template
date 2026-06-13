/**
 * @/ui —— 业务层唯一允许引入 UI 组件的入口。
 *
 * 规则（由 .oxlintrc.json 强制）：features/ 与 pages/ 下严禁直接
 * import '@heroui/react' 等具体库，必须从这里取。这条边界是「UI 库可换」
 * 架构长期不腐化的执法者。
 */
import { adapter } from './registry';
import { useDevice } from './responsive/useDevice';
import { MobileCardList } from './responsive/MobileCardList';
import type { TableProps, ModalProps } from './contract';

export const { Button, Input } = adapter;
const ModalImpl = adapter.Modal;

/**
 * Table / Modal 都在「库无关」的这一层做响应式降级，适配器只实现单一桌面形态：
 *  - Table：移动端渲染卡片列表，桌面渲染适配器表格；
 *  - Modal：按设备注入 placement（桌面 center / 移动 bottom）。
 * 两者同层同范式，换库时这套降级能力自动复用、无需每个适配器各自重实现。
 */
export function Table<T extends object>(props: TableProps<T>) {
  const { isMobile } = useDevice();
  return isMobile ? <MobileCardList {...props} /> : adapter.Table<T>(props);
}

export function Modal(props: ModalProps) {
  const { isMobile } = useDevice();
  return <ModalImpl {...props} placement={isMobile ? 'bottom' : 'center'} />;
}

export type {
  ButtonProps,
  InputProps,
  TableProps,
  ColumnDef,
  ModalProps,
} from './contract';
