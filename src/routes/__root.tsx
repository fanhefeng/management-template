import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { Toaster } from '@/app/notify/Toaster';
import { queryClient } from '@/app/request/queryClient';
import { Button } from '@/ui';

/**
 * 根路由。把 queryClient 注入路由 context —— 各路由 loader 可直接拿它做预取（类型安全）。
 * errorComponent 兜住路由/loader/渲染期抛出的错误（含子树里 useSuspenseQuery 的失败），
 * 避免白屏；Toaster 提供全应用可见的通知出口。
 */
export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  // 关键：失败的 query 会把 error 缓存住，仅 reset() 路由错误边界会立即再抛同一错误。
  // 先 resetQueries 清掉缓存的错误态、触发重新拉取，再 reset() 重渲染路由，重试才真正生效。
  const onRetry = () => {
    queryClient.resetQueries();
    reset();
  };
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-canvas p-6 text-center">
      <h1 className="text-xl font-semibold text-fg">出错了</h1>
      <p className="max-w-md text-sm text-fg-muted">{error.message}</p>
      <Button variant="primary" onClick={onRetry}>
        重试
      </Button>
    </div>
  );
}
