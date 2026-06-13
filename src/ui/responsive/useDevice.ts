import { useSyncExternalStore } from 'react';
import { breakpoints } from '@/design/tokens';

/**
 * 设备判断 hook —— 库无关，只依赖 @/design 的断点（更底层），因此放在 @/ui 这一层，
 * 与「响应式降级在 @/ui 完成」的设计一致，避免 @/ui 反向依赖 @/app 形成层级环。
 *
 * 用 matchMedia 而非 UA：平板、分屏、桌面缩窗都正确，且与 CSS 断点同源。
 * useSyncExternalStore 是订阅外部源的官方正解；MediaQueryList 模块级缓存复用。
 */
const query = `(max-width:${breakpoints.md - 1}px)`;

let mql: MediaQueryList | null = null;
function getMql(): MediaQueryList | null {
  if (mql === null && typeof window !== 'undefined') {
    mql = window.matchMedia(query);
  }
  return mql;
}

function subscribe(callback: () => void) {
  const m = getMql();
  if (!m) return () => {};
  m.addEventListener('change', callback);
  return () => m.removeEventListener('change', callback);
}

function getSnapshot() {
  return getMql()?.matches ?? false;
}

// SSR / 无 window 环境兜底为桌面
function getServerSnapshot() {
  return false;
}

export function useDevice() {
  const isMobile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { isMobile };
}
