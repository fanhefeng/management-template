import { useRef, useState } from 'react';
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Table, Modal, Input } from '@/ui';
import type { ColumnDef } from '@/ui';
import { notify } from '@/app/notify/store';
import { usersQuery, saveUser, roleLabel, statusLabel, type User } from './api';

/**
 * CRUD 示例页 —— 整页没有一处 import '@heroui/react'，全部走 @/ui；className 也只用
 * 库无关的语义类。同一份 columns 在桌面渲染为表格、移动渲染为卡片列表（由 @/ui 的 Table
 * 包装层自动切换）。
 */
const columns: ColumnDef<User>[] = [
  { key: 'name', title: '姓名' },
  { key: 'email', title: '邮箱' },
  { key: 'role', title: '角色', render: (u) => roleLabel[u.role] },
  {
    key: 'status',
    title: '状态',
    render: (u) => (
      <span className={u.status === 'active' ? 'text-positive' : 'text-fg-subtle'}>
        {statusLabel[u.status]}
      </span>
    ),
  },
];

const blankUser: User = { id: 0, name: '', email: '', role: 'viewer', status: 'active' };
const FORM_ID = 'user-edit-form';

export function UsersPage() {
  const { data } = useSuspenseQuery(usersQuery);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<User | null>(null);

  // 关闭时 editing 立即置 null，但 Modal 有退场动画。用 ref 保留最后一次的值，
  // 让弹窗在淡出过程中仍渲染内容（标题/表单/footer），避免「空壳淡出」闪烁。
  const lastEditing = useRef<User | null>(null);
  if (editing) lastEditing.current = editing;
  const shown = editing ?? lastEditing.current;

  const save = useMutation({
    mutationFn: saveUser,
    onSuccess: () => {
      // 失败路径由 queryClient 的 mutationCache.onError 统一兜底（弹通知）。
      qc.invalidateQueries({ queryKey: usersQuery.queryKey });
      notify.success('已保存');
      setEditing(null);
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-fg">用户管理</h1>
        <Button variant="primary" onClick={() => setEditing(blankUser)}>
          新建用户
        </Button>
      </div>

      <Table<User> columns={columns} data={data} rowKey="id" onRowClick={(u) => setEditing(u)} />

      <Modal
        open={editing !== null}
        title={shown && shown.id !== 0 ? '编辑用户' : '新建用户'}
        onClose={() => setEditing(null)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="text" onClick={() => setEditing(null)}>
              取消
            </Button>
            {/* 槽外的提交按钮通过 form 属性提交槽内表单（标准 HTML 关联） */}
            <Button variant="primary" type="submit" form={FORM_ID} loading={save.isPending}>
              保存
            </Button>
          </div>
        }
      >
        {shown ? (
          // key 按 id 强制重挂：切换不同行时表单字段重置为该行数据，不残留上一行。
          <UserForm key={shown.id} user={shown} onSubmit={(u) => save.mutate(u)} />
        ) : null}
      </Modal>
    </div>
  );
}

function UserForm({ user, onSubmit }: { user: User; onSubmit: (user: User) => void }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  return (
    <form
      id={FORM_ID}
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ ...user, name, email });
      }}
    >
      <Input label="姓名" value={name} onChange={setName} />
      <Input label="邮箱" type="email" value={email} onChange={setEmail} />
    </form>
  );
}
