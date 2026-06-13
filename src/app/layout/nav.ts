/** 桌面/移动两套布局共享的导航定义 */
export interface NavItem {
  to: string;
  label: string;
}

export const navItems: NavItem[] = [
  { to: '/', label: '概览' },
  { to: '/users', label: '用户管理' },
];
