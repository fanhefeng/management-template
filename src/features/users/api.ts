import type { QueryClient } from '@tanstack/react-query';
import { queryOptions } from '@tanstack/react-query';
import { http } from '@/app/request/client';

/**
 * 数据模型用「语言无关」的英文 enum，不把中文当类型字面量 —— 显示文案另由 *Label 映射，
 * 这样接真实后端（多为英文枚举）或做 i18n 时无需改类型与比较逻辑。
 */
export type UserRole = 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'disabled';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export const roleLabel: Record<UserRole, string> = {
  admin: '管理员',
  editor: '编辑',
  viewer: '访客',
};

export const statusLabel: Record<UserStatus, string> = {
  active: '启用',
  disabled: '停用',
};

const hasBackend = Boolean(import.meta.env.VITE_API_BASE_URL);

/** 模拟网络延迟（仅 mock 路径用） */
const mockDelay = () => new Promise((r) => setTimeout(r, 300));

const MOCK: User[] = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin', status: 'active' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: 'editor', status: 'active' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: 'viewer', status: 'disabled' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: 'editor', status: 'active' },
];

/**
 * 配了 VITE_API_BASE_URL 就走真实 API（经统一的 http 实例 + 拦截器）；
 * 否则用 mock，开箱即跑。对接后端时删掉 mock 分支即可。
 */
async function fetchUsers(): Promise<User[]> {
  if (hasBackend) {
    const { data } = await http.get<User[]>('/users');
    return data;
  }
  await mockDelay();
  return MOCK;
}

export async function saveUser(user: User): Promise<User> {
  if (hasBackend) {
    const { data } = await http.put<User>(`/users/${user.id}`, user);
    return data;
  }
  await mockDelay();
  return user;
}

/** 复用于「路由 loader 预取」和「组件内 useQuery」—— 同一份 key/queryFn */
export const usersQuery = queryOptions({
  queryKey: ['users'],
  queryFn: fetchUsers,
});

/** 路由 loader：进页面前预取，配合 TanStack Query 缓存 */
export function ensureUsers(qc: QueryClient) {
  return qc.ensureQueryData(usersQuery);
}
