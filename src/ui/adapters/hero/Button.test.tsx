import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

/**
 * 适配器「契约一致性测试」：验证契约语义被正确翻译到 HeroUI v3。
 * 换库时，对新适配器跑同一组断言即可验收 —— 行为应保持一致。
 */
describe('hero/Button 适配器', () => {
  it('渲染 children', () => {
    render(<Button>保存</Button>);
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
  });

  it('onClick 契约 → 触发回调（内部映射到 onPress）', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>点我</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('disabled 契约 → 按钮禁用', () => {
    render(<Button disabled>禁用</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
