import { createFileRoute, redirect } from '@tanstack/react-router';
import { AppLayout } from '@/app/layout/AppLayout';
import { useAuthStore } from '@/app/store/auth';

/**
 * 受保护布局路由（pathless layout）。
 * 所有需要登录的页面都挂在它下面：beforeLoad 做鉴权守卫，
 * component 渲染 AppLayout（内部按设备自动切桌面/移动布局）。
 */
export const Route = createFileRoute('/_authed')({
  beforeLoad: () => {
    if (!useAuthStore.getState().token) {
      throw redirect({ to: '/login' });
    }
  },
  component: AppLayout,
});
