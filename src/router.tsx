import { createRouter } from '@tanstack/react-router';
// routeTree.gen.ts 由 @tanstack/router-plugin 在 dev/build 时自动生成
import { routeTree } from './routeTree.gen';
import { queryClient } from '@/app/request/queryClient';

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  scrollRestoration: true,
  // 真实后端首屏（冷缓存）会有等待期：loader/Suspense 未就绪时显示统一的 pending UI，
  // 避免白屏。需要更细粒度可在具体路由覆盖 pendingComponent。
  defaultPendingComponent: () => (
    <div className="flex h-full items-center justify-center p-10 text-sm text-fg-muted">加载中…</div>
  ),
});

// 让 useNavigate / Link 等获得端到端类型推导
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
