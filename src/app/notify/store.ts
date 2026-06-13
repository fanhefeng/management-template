import { create } from 'zustand';

export type NoticeKind = 'error' | 'success' | 'info';

export interface Notice {
  id: number;
  kind: NoticeKind;
  message: string;
}

interface NotifyState {
  notices: Notice[];
  push: (kind: NoticeKind, message: string) => void;
  dismiss: (id: number) => void;
}

// 模块级自增 id（不依赖 Date.now/Math.random）
let seq = 0;
// 记录每条通知的自动消除定时器，dismiss / 自动消除时清掉，避免泄漏与卸载后空跑
const timers = new Map<number, ReturnType<typeof setTimeout>>();

function clear(id: number) {
  const t = timers.get(id);
  if (t !== undefined) {
    clearTimeout(t);
    timers.delete(id);
  }
}

export const useNotify = create<NotifyState>((set, get) => ({
  notices: [],
  push: (kind, message) => {
    const id = (seq += 1);
    set((s) => ({ notices: [...s.notices, { id, kind, message }] }));
    timers.set(
      id,
      setTimeout(() => get().dismiss(id), 4000),
    );
  },
  dismiss: (id) => {
    clear(id);
    set((s) => ({ notices: s.notices.filter((n) => n.id !== id) }));
  },
}));

/**
 * 命令式通知入口 —— 供非组件代码（请求拦截器、queryClient onError）使用。
 * 这是「失败路径的统一出口」：任何地方报错都能 notify.error(...)，用户可见而非静默白屏。
 */
export const notify = {
  error: (message: string) => useNotify.getState().push('error', message),
  success: (message: string) => useNotify.getState().push('success', message),
  info: (message: string) => useNotify.getState().push('info', message),
};
