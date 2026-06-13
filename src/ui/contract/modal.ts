import type { ReactNode } from 'react';

/**
 * Modal 契约。桌面端渲染为居中弹窗；移动端适配器可渲染为底部 Sheet
 * （策略 B：同一契约，按设备分形态）。
 */
export interface ModalProps {
  open: boolean;
  title?: ReactNode;
  footer?: ReactNode;
  /**
   * 弹窗位置。由 @/ui 包装层按设备注入（桌面 center / 移动 bottom），
   * 适配器只负责把它翻译成具体库的呈现 —— 与 Table 的响应式降级保持同层、同范式。
   */
  placement?: 'center' | 'bottom';
  /** 点击遮罩 / 关闭按钮 / Esc 时触发 */
  onClose: () => void;
  children?: ReactNode;
}
