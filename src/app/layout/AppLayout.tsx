import { Link, Outlet, useNavigate } from '@tanstack/react-router';
import { navItems } from './nav';
import { useAuthStore } from '@/app/store/auth';
import { Button } from '@/ui';

/**
 * 单一响应式布局壳。
 *
 * 关键：用 Tailwind 的 md: 断点切换「外观 chrome」（桌面侧边栏 / 移动底部 Tab），
 * 但 <Outlet/> 始终处于 DOM 树的同一位置、永不卸载。这避免了「跨断点（旋转/缩窗）
 * 时整棵内容子树被 React 重挂、表单与弹窗输入丢失」的问题（旧的双组件切换方案有此 bug）。
 *
 * 布局因此也不再依赖 useDevice —— 响应式纯由 CSS 完成。
 */
export function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const onLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  const linkClass =
    'rounded-md px-3 py-2 text-sm text-fg-muted hover:bg-canvas [&.active]:bg-accent-soft [&.active]:text-accent';

  return (
    <div className="flex h-screen bg-canvas">
      {/* 桌面侧边栏（移动端隐藏） */}
      <aside className="hidden w-56 flex-col border-r border-line bg-surface p-4 md:flex">
        <div className="mb-6 px-2 text-lg font-semibold text-fg">管理后台</div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b border-line bg-surface px-4 md:px-6">
          <span className="font-semibold text-fg md:hidden">管理后台</span>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-fg-muted">{user?.name ?? '未登录'}</span>
            <Button variant="text" size="sm" onClick={onLogout}>
              退出
            </Button>
          </div>
        </header>

        {/* 内容区：跨断点稳定常挂 */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>

        {/* 移动端底部 TabBar（桌面隐藏） */}
        <nav className="flex h-14 shrink-0 border-t border-line bg-surface md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-1 flex-col items-center justify-center text-xs text-fg-muted [&.active]:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
