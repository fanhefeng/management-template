import { Button as HeroButton } from '@heroui/react';
import type { ButtonProps } from '@/ui/contract/button';

/**
 * HeroUI v3 适配器 —— 唯一与具体库耦合的地方。
 *
 * v3 的重大变化都在这里被「翻译」掉：
 *   契约 variant: primary/default/danger/text
 *     → v3 把 color+variant 合并成单一 variant: primary/secondary/.../danger/ghost
 *   契约 loading  → v3 isPending（不是 isLoading）
 *   契约 disabled → v3 isDisabled
 *   契约 onClick  → v3 onPress（React Aria）
 *
 * 将来换 antd 时，新建 adapters/antd/Button.tsx 把同一份 ButtonProps
 * 翻译成 antd 的 type/danger/loading 即可，业务代码完全不动。
 */
const variantMap = {
  primary: 'primary',
  default: 'secondary',
  danger: 'danger',
  text: 'ghost',
} as const;

export function Button({
  variant = 'default',
  size = 'md',
  loading,
  disabled,
  block,
  icon,
  type = 'button',
  form,
  onClick,
  children,
}: ButtonProps) {
  return (
    <HeroButton
      variant={variantMap[variant]}
      size={size}
      isPending={loading}
      isDisabled={disabled}
      fullWidth={block}
      type={type}
      form={form}
      onPress={onClick}
    >
      {icon}
      {children}
    </HeroButton>
  );
}
