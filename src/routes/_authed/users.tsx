import { createFileRoute } from '@tanstack/react-router';
import { UsersPage } from '@/features/users/UsersPage';
import { ensureUsers } from '@/features/users/api';

export const Route = createFileRoute('/_authed/users')({
  // loader 预取：进页面前数据已在 Query 缓存里，组件用 useSuspenseQuery 直接命中
  loader: ({ context }) => ensureUsers(context.queryClient),
  component: UsersPage,
});
