import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Input } from '@/ui';
import { useAuthStore } from '@/app/store/auth';
import { notify } from '@/app/notify/store';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [account, setAccount] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      // 示例：mock 校验。真实场景调 /auth/login 拿 token；失败走 catch 提示。
      if (!account || !password) throw new Error('请输入账号和密码');
      await new Promise((r) => setTimeout(r, 200));
      login('demo-token', { name: 'Admin' });
      navigate({ to: '/' });
    } catch (e) {
      notify.error(e instanceof Error ? e.message : '登录失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-canvas">
      <div className="flex w-80 flex-col gap-4 rounded-xl border border-line bg-surface p-8">
        <h1 className="text-center text-xl font-semibold text-fg">登录</h1>
        <Input label="账号" value={account} onChange={setAccount} />
        <Input label="密码" type="password" value={password} onChange={setPassword} />
        <Button variant="primary" block loading={submitting} onClick={onSubmit}>
          登录
        </Button>
      </div>
    </div>
  );
}
