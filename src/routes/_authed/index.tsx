import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/')({
  component: Dashboard,
});

function Dashboard() {
  const stats = [
    { label: '总用户', value: '1,284' },
    { label: '今日活跃', value: '326' },
    { label: '待处理', value: '12' },
  ];
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-fg">概览</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-surface p-6">
            <div className="text-sm text-fg-muted">{s.label}</div>
            <div className="mt-2 text-3xl font-semibold text-fg">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
