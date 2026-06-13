import type { UIAdapter } from '@/ui/contract';
import { Button } from './Button';
import { Input } from './Input';
import { Table } from './Table';
import { Modal } from './Modal';

/**
 * HeroUI 适配器聚合对象。TypeScript 会校验它满足 UIAdapter 契约 ——
 * 缺组件 / prop 不匹配都会在这里报错。换库就是再写一个这样的对象。
 */
export const heroAdapter: UIAdapter = {
  Button,
  Input,
  Table,
  Modal,
};
