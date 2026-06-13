import { useNotify, type NoticeKind } from './store';

/** 库无关的通知出口（只用语义类）。在 __root 渲染一次，全应用可见。 */
const kindClass: Record<NoticeKind, string> = {
  error: 'border-negative/30 text-negative',
  success: 'border-positive/30 text-positive',
  info: 'border-line text-fg',
};

export function Toaster() {
  const { notices, dismiss } = useNotify();
  if (notices.length === 0) return null;

  return (
    <div className="fixed right-4 top-4 z-50 flex w-72 flex-col gap-2">
      {notices.map((n) => (
        <div
          key={n.id}
          role="alert"
          onClick={() => dismiss(n.id)}
          className={`cursor-pointer rounded-lg border bg-surface px-4 py-3 text-sm shadow-lg ${kindClass[n.kind]}`}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}
