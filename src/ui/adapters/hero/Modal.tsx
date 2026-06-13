import { Modal as HeroModal } from '@heroui/react';
import type { ModalProps } from '@/ui/contract/modal';

/**
 * HeroUI v3 的 Modal 是复合组件（React Aria overlay 模式），与 v2 完全不同：
 *   - 没有 ModalContent；用 Modal.Backdrop > Container > Dialog > Header/Body/Footer
 *   - 开关由 Modal.Backdrop 的 isOpen / onOpenChange 控制（不是根组件）
 * 这些 v3 特性全部被本适配器吸收，契约（open/onClose/title/footer）保持不变。
 *
 * placement 由 @/ui 包装层按设备注入（与 Table 的响应式降级同层同范式），
 * 适配器只把它翻译成 Container 的 placement。
 */
export function Modal({ open, title, footer, placement = 'center', onClose, children }: ModalProps) {
  // 受控用法（无触发按钮）：直接用 Modal.Backdrop 作为根，不套 <Modal>（那是给
  // 「带 Modal.Trigger 的非受控用法」的 DialogTrigger，套了会触发 PressResponder 警告）。
  return (
    <HeroModal.Backdrop
      isOpen={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <HeroModal.Container placement={placement}>
        <HeroModal.Dialog>
          <HeroModal.CloseTrigger />
          {title ? (
            <HeroModal.Header>
              <HeroModal.Heading>{title}</HeroModal.Heading>
            </HeroModal.Header>
          ) : null}
          <HeroModal.Body>{children}</HeroModal.Body>
          {footer ? <HeroModal.Footer>{footer}</HeroModal.Footer> : null}
        </HeroModal.Dialog>
      </HeroModal.Container>
    </HeroModal.Backdrop>
  );
}
