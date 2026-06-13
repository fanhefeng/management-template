import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table, Modal, Input } from '@/ui';
import type { ColumnDef } from '@/ui';

/**
 * 运行时渲染冒烟：构建只编译不执行，这里实际把 v3 复合组件
 * （Table / Modal / Input 适配器）渲染到 jsdom，捕捉 react-aria 的运行时结构问题。
 */
interface Row {
  id: number;
  name: string;
}
const columns: ColumnDef<Row>[] = [
  { key: 'name', title: '姓名' },
];
const data: Row[] = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
];

describe('hero 适配器运行时渲染', () => {
  it('Table 渲染表头与数据（桌面形态）', () => {
    render(<Table<Row> columns={columns} data={data} rowKey="id" />);
    expect(screen.getByText('姓名')).toBeInTheDocument();
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('李四')).toBeInTheDocument();
  });

  it('Table onRowClick 契约：点击行触发回调', async () => {
    const onRowClick = vi.fn();
    render(<Table<Row> columns={columns} data={data} rowKey="id" onRowClick={onRowClick} />);
    await userEvent.click(screen.getByText('张三'));
    expect(onRowClick).toHaveBeenCalledWith({ id: 1, name: '张三' });
  });

  it('Table loading / 空态：分别显示加载与空文案', () => {
    const { rerender } = render(<Table<Row> columns={columns} data={[]} rowKey="id" loading />);
    expect(screen.getByText('加载中…')).toBeInTheDocument();
    rerender(<Table<Row> columns={columns} data={[]} rowKey="id" />);
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });

  it('Modal 打开时渲染标题与内容', () => {
    render(
      <Modal open title="编辑" onClose={() => {}}>
        <div>表单内容</div>
      </Modal>,
    );
    expect(screen.getByText('编辑')).toBeInTheDocument();
    expect(screen.getByText('表单内容')).toBeInTheDocument();
  });

  it('Input 渲染 label 与错误信息', () => {
    render(<Input label="邮箱" error="格式不正确" />);
    expect(screen.getByText('邮箱')).toBeInTheDocument();
    expect(screen.getByText('格式不正确')).toBeInTheDocument();
  });
});
