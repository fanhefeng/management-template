import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { notify } from '@/app/notify/store';
import { toMessage } from './client';

/**
 * 服务端状态（缓存/重取）由 TanStack Query 管理；路由 loader 负责「进页面前预取」。
 *
 * QueryCache / MutationCache 的 onError 是「失败路径的统一兜底出口」：任何 query/mutation
 * 报错都会弹出可见通知，而不是静默失败 —— 模板借此给出正确的错误处理范式。
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // 仅当已有缓存数据时（即「后台重取」失败）才弹 toast；首屏冷加载失败交给
    // 路由 errorComponent 显示全屏错误页，避免「全屏错误页 + toast」双重提示。
    onError: (error, query) => {
      if (query.state.data !== undefined) notify.error(toMessage(error));
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => notify.error(toMessage(error)),
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
